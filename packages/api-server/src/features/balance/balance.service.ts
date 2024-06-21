import { Injectable, Logger } from '@nestjs/common';
import { BigNumber, Contract, ethers, Wallet } from 'ethers';
import { WalletService } from '@/features/wallet/wallet.service';
import {
  Networks,
  MainnetNetwork,
  nonEthNetworkNames,
  AvailableNetwork,
  SupportedNetworks,
} from '@/features/network';
import { MerklyService } from '@/lib/merkly/merkly.service';
import { LifiService } from '@/lib/lifi/lifi.service';
import { NATIVE_TOKEN_ADDRESS } from '@/lib/lifi/constants';
import { calculatePercentOfBigNumber, truncate } from '@/utils';
import { ERC20_ABI } from '@/lib/contracts/abis/ERC_20';

@Injectable()
export class BalanceService {
  homeNetwork = 'arbitrumOne' as const;
  homeNetworkChainId = Networks[this.homeNetwork].chainId;

  // Minimum Values needed to refuel
  minimumEthRefuelValue = '0.005';
  minimumEthRefuelValueWei = '5000000000000000';
  // Consolidation Minimum
  minimumConsolidationValueWei = '2500000000000000';

  private readonly logger = new Logger(WalletService.name);

  constructor(
    private readonly walletService: WalletService,
    private readonly merkly: MerklyService,
    private readonly lifi: LifiService,
  ) {}

  async getFromWallet(
    wallet: Wallet,
    tokenAddress: string,
    percentAmount?: number,
  ) {
    let balance: BigNumber;

    if (tokenAddress === NATIVE_TOKEN_ADDRESS)
      balance = await wallet.getBalance();
    else {
      const contract = new Contract(tokenAddress, ERC20_ABI, wallet);
      balance = (await contract.balanceOf(wallet.address)) as BigNumber;
    }

    return percentAmount
      ? calculatePercentOfBigNumber(balance, percentAmount)
      : balance;
  }

  async getMinimumRefuelValue(network: MainnetNetwork) {
    if ((nonEthNetworkNames as readonly string[]).includes(network as string)) {
      const toChainId = Networks[network].chainId;
      const quote = await this.lifi.getRoute(
        this.homeNetworkChainId,
        toChainId,
        this.minimumEthRefuelValueWei,
        NATIVE_TOKEN_ADDRESS,
        NATIVE_TOKEN_ADDRESS,
      );

      return quote.toAmount;
    } else {
      return this.minimumEthRefuelValueWei;
    }
  }

  private async refuelAll(
    walletAddress: string,
    networks: AvailableNetwork<'merklyRefuel'>[],
  ) {
    const wallet = await this.walletService.get(
      walletAddress,
      this.homeNetwork,
    );

    for (const network of networks) {
      this.logger.log(`Refueling: ${network}`);
      switch (network) {
        case 'avalanche': {
          const minimumAvaxRefuelValueWei =
            await this.getMinimumRefuelValue('avalanche');
          const minimumAvaxRefuelValue = ethers.utils.formatEther(
            minimumAvaxRefuelValueWei,
          );

          await this.merkly.refuel(
            wallet,
            this.homeNetwork,
            network,
            minimumAvaxRefuelValue,
          );

          break;
        }
        case 'bsc': {
          const minimumBnbRefuelValueWei =
            await this.getMinimumRefuelValue('bsc');
          const minimumBnbRefuelValue = ethers.utils.formatEther(
            minimumBnbRefuelValueWei,
          );

          await this.merkly.refuel(
            wallet,
            this.homeNetwork,
            network,
            minimumBnbRefuelValue,
          );
          break;
        }
        default: {
          await this.merkly.refuel(
            wallet,
            this.homeNetwork,
            network,
            this.minimumEthRefuelValue,
          );
        }
      }
      this.logger.log(`Refueled ${network}`);
    }
  }

  async check(walletAddress: string, network: MainnetNetwork) {
    const wallet = await this.walletService.get(walletAddress, network);
    return await wallet.getBalance();
  }

  async checkAndRefuel(
    walletAddress: string,
    networks: readonly AvailableNetwork<'merklyRefuel'>[],
  ) {
    const homeWallet = await this.walletService.get(
      walletAddress,
      this.homeNetwork,
    );
    const homeBalance = await homeWallet.getBalance();

    if (homeBalance.lt(this.minimumConsolidationValueWei))
      throw new Error(`${truncate(walletAddress)}: balance is too low.`);

    let networksToRefuel: AvailableNetwork<'merklyRefuel'>[] = [];

    // check balances of different networks
    for (const network of networks) {
      if (network === this.homeNetwork) continue;

      const balance = await this.check(walletAddress, network);
      this.logger.log(`${network} balance: ${balance}`);
      if (
        balance.lt(BigNumber.from(await this.getMinimumRefuelValue(network)))
      ) {
        this.logger.log(`Adding ${network} to Refuel Queue...`);
        networksToRefuel = [network, ...networksToRefuel];
      }
    }

    const notEnoughEth = homeBalance.lt(
      BigNumber.from(this.minimumEthRefuelValueWei).mul(
        networksToRefuel.length,
      ),
    );

    if (notEnoughEth) {
      throw new Error(
        `Your arbitrum balance is too low to refuel ${networksToRefuel.length} networks.`,
      );
    }

    if (networksToRefuel.length > 0)
      await this.refuelAll(walletAddress, networksToRefuel);
  }

  async consolidate(walletAddress: string) {
    for (const network of SupportedNetworks) {
      if (network === this.homeNetwork) continue;

      const wallet = await this.walletService.get(walletAddress, network);
      const balance = await this.check(walletAddress, network);

      if (balance.gt(BigNumber.from(this.minimumConsolidationValueWei))) {
        this.logger.log(`Consolidating ${network} ...`);
        const amountToSwap = calculatePercentOfBigNumber(balance, 90);
        const fromChainId = Networks[network].chainId;

        await this.lifi.bridgeAndSwap(
          wallet,
          fromChainId,
          this.homeNetworkChainId,
          amountToSwap.toString(),
          NATIVE_TOKEN_ADDRESS,
          NATIVE_TOKEN_ADDRESS,
        );
      }
    }
  }

  async withdraw(fromWalletAddress: string, toWalletAddress: string) {
    await this.consolidate(fromWalletAddress);
    const wallet = await this.walletService.get(
      fromWalletAddress,
      this.homeNetwork,
    );
    const balance = await wallet.getBalance();

    const tx = {
      to: toWalletAddress,
      value: balance,
    };

    const gasLimit = await wallet.estimateGas(tx);

    const gasLimitBuffered = calculatePercentOfBigNumber(gasLimit, 110);

    const feeData = await wallet.getFeeData();

    const gas = feeData.gasPrice
      .add(feeData.maxPriorityFeePerGas)
      .mul(gasLimitBuffered);

    const value = balance.sub(gas);

    const { hash } = await wallet.sendTransaction({
      ...tx,
      value,
      gasLimit,
    });

    return hash;
  }
}
