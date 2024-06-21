import { LiFi, Orders } from '@lifi/sdk';
import { ChainId, RoutesRequest } from '@lifi/sdk';
import { Injectable, Logger } from '@nestjs/common';
import { BigNumber, BigNumberish, ethers } from 'ethers';
import { calculatePercentOfBigNumber, truncate } from '@/utils';
import { WalletService } from '@/features/wallet/wallet.service';
import { ERC20_ABI } from '@/lib/contracts/abis/ERC_20';
import { getNetworkKeyByChainId } from '@/features/network';
import { NATIVE_TOKEN_ADDRESS } from '@/lib/lifi/constants';
import {
  getFromWallet,
  getMaxTransferableValue,
} from '@/features/balance/balance.utils';

const integrator = 'FrogTools';

@Injectable()
export class LifiService {
  private readonly logger = new Logger(LifiService.name);

  constructor(private readonly wallet: WalletService) {}

  async getRoute(
    fromChainId: ChainId,
    toChainId: ChainId,
    fromAmount: string,
    fromTokenAddress: string,
    toTokenAddress: string,
  ) {
    const lifi = new LiFi({
      integrator,
    });
    const routesRequest: RoutesRequest = {
      fromChainId,
      toChainId,
      fromAmount,
      fromTokenAddress,
      toTokenAddress,
      options: {
        integrator,
        order: Orders[0], // Recommended
        slippage: 3 / 100,
      },
    };

    const result = await lifi.getRoutes(routesRequest);

    return result.routes[0];
  }

  async approveSpend(
    wallet: ethers.Wallet,
    tokenAddress: string,
    spender: string,
    balance: BigNumberish,
  ) {
    const tokenContract = new ethers.Contract(tokenAddress, ERC20_ABI, wallet);

    const tx = await tokenContract.populateTransaction.approve(
      spender,
      balance.toString(),
    );

    const result = await wallet.sendTransaction(tx);

    await result.wait();

    this.logger.log(`Approved: ${truncate(tokenContract.address)} for trading`);
  }

  async bridgeAndSwap(
    wallet: ethers.Wallet,
    fromChainId: ChainId,
    toChainId: ChainId,
    fromAmount: string,
    fromTokenAddress: string,
    toTokenAddress: string,
  ) {
    const lifi = new LiFi({
      integrator,
    });

    const route = await this.getRoute(
      fromChainId,
      toChainId,
      fromAmount,
      fromTokenAddress,
      toTokenAddress,
    );

    const executedRoute = await lifi.executeRoute(wallet, route, {
      acceptExchangeRateUpdateHook: async () => true,
      switchChainHook: async (requiredChainId: number) =>
        await this.wallet.get(
          wallet.address,
          getNetworkKeyByChainId(requiredChainId),
        ),
    });

    this.logger.log(
      `Swapped: ${executedRoute.fromToken.symbol} > ${executedRoute.toToken.symbol}`,
    );

    return executedRoute;
  }

  async bridgeAndSwapMax(
    wallet: ethers.Wallet,
    fromChainId: ChainId,
    toChainId: ChainId,
    fromTokenAddress: string,
    toTokenAddress: string,
  ) {
    const lifi = new LiFi({
      integrator,
    });

    const fromAmount = await getFromWallet(wallet, fromTokenAddress);

    if (fromTokenAddress === NATIVE_TOKEN_ADDRESS) {
      const routeQuote = await this.getRoute(
        fromChainId,
        toChainId,
        calculatePercentOfBigNumber(fromAmount, 90).toString(),
        fromTokenAddress,
        toTokenAddress,
      );

      const gasLimit = routeQuote.steps.reduce((acc, cv) => {
        let gasLimitTotal = acc;
        for (let i = 0; i < cv.includedSteps.length; i++) {
          for (
            let j = 0;
            j < cv.includedSteps[i].estimate.gasCosts.length;
            j++
          ) {
            // loops thru all the steps in the route and adds all the gasLimits
            gasLimitTotal = acc.add(
              BigNumber.from(cv.includedSteps[i].estimate.gasCosts[j].limit),
            );
          }
        }
        return gasLimitTotal;
      }, BigNumber.from('0'));

      const balance = await getMaxTransferableValue(wallet, gasLimit);

      const route = await this.getRoute(
        fromChainId,
        toChainId,
        balance.toString(),
        fromTokenAddress,
        toTokenAddress,
      );

      const executedRoute = await lifi.executeRoute(wallet, route, {
        acceptExchangeRateUpdateHook: async () => true,
        switchChainHook: async (requiredChainId: number) =>
          await this.wallet.get(
            wallet.address,
            getNetworkKeyByChainId(requiredChainId),
          ),
      });

      this.logger.log(
        `Swapped: ${executedRoute.fromToken.symbol} > ${executedRoute.toToken.symbol}`,
      );

      return executedRoute;
    } else {
      return await this.bridgeAndSwap(
        wallet,
        fromChainId,
        toChainId,
        fromAmount.toString(),
        fromTokenAddress,
        toTokenAddress,
      );
    }
  }
}
