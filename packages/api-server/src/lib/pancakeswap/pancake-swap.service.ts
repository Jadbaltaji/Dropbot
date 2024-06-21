import { Injectable } from '@nestjs/common';
import { BigNumber, ethers, Wallet } from 'ethers';
import { sdk } from '@/lib/contracts';
import { AvailableNetwork, Networks } from '@/features/network';

import { LZChainIds } from '@/lib/layerzero';
import { LayerZeroService } from '@/lib/layerzero/layer-zero.service';
import { calculatePercentOfBigNumber } from '@/utils';
import { LifiService } from '@/lib/lifi/lifi.service';
import { BalanceService } from '@/features/balance/balance.service';

type PancakeSwapNetworks = AvailableNetwork<'pancakeSwapOFT'> | 'bsc';

@Injectable()
export class PancakeSwapService {
  constructor(
    private readonly layerzero: LayerZeroService,
    private readonly balance: BalanceService,
    private readonly lifi: LifiService,
  ) {}

  async getBalance(
    wallet: Wallet,
    network: PancakeSwapNetworks,
    percentAmount = 100,
  ) {
    let tokenAddress: string;

    if (network === 'bsc')
      tokenAddress = Networks[network].contracts.pancakeSwapToken;
    else tokenAddress = Networks[network].contracts.pancakeSwapOFT;

    return await this.balance.getFromWallet(
      wallet,
      tokenAddress,
      percentAmount,
    );
  }
  async bridge(
    wallet: ethers.Wallet,
    network: PancakeSwapNetworks,
    dstChain: PancakeSwapNetworks,
    amount: BigNumber,
  ) {
    if (network === 'bsc')
      return await this.bridgeBsc(wallet, dstChain, amount);

    const { pancakeSwapOFT } = sdk[network](wallet);

    const dstChainId = LZChainIds[dstChain];
    const minAmount = calculatePercentOfBigNumber(amount, 95);
    const padded = ethers.utils.hexZeroPad(wallet.address, 32);

    const fee = await pancakeSwapOFT.estimateSendFee(
      dstChainId,
      padded,
      amount.toString(),
      false,
      this.layerzero.defaultRelayerAdapterParams,
    );

    const value = fee[0].toString();
    const gasLimit = await pancakeSwapOFT.estimateGas.sendFrom(
      wallet.address,
      dstChainId,
      padded,
      amount.toString(),
      minAmount.toString(),
      {
        refundAddress: wallet.address,
        zroPaymentAddress: this.layerzero.nullAddress,
        adapterParams: this.layerzero.defaultRelayerAdapterParams,
      },
      {
        value,
      },
    );

    const tx = await pancakeSwapOFT.populateTransaction.sendFrom(
      wallet.address,
      dstChainId,
      padded,
      amount.toString(),
      minAmount,
      {
        refundAddress: wallet.address,
        zroPaymentAddress: this.layerzero.nullAddress,
        adapterParams: this.layerzero.defaultRelayerAdapterParams,
      },
      {
        value,
        gasLimit,
      },
    );

    const result = await wallet.sendTransaction(tx);
    return await result.wait();
  }

  private async bridgeBsc(
    wallet: ethers.Wallet,
    dstChain: PancakeSwapNetworks,
    amount: BigNumber,
  ) {
    await this.lifi.approveSpend(
      wallet,
      Networks.bsc.contracts.pancakeSwapToken,
      Networks.bsc.contracts.pancakeSwapOFTProxy,
      amount,
    );

    const { pancakeSwapOFTProxy } = sdk['bsc'](wallet);
    const dstChainId = LZChainIds[dstChain];
    const minAmount = calculatePercentOfBigNumber(amount, 90);

    const padded = ethers.utils.hexZeroPad(wallet.address, 32);

    const fee = await pancakeSwapOFTProxy.estimateSendFee(
      dstChainId,
      padded,
      amount,
      false,
      this.layerzero.defaultRelayerAdapterParams,
    );

    const value = fee[0].toString();
    const gasLimit = await pancakeSwapOFTProxy.estimateGas.sendFrom(
      wallet.address,
      dstChainId,
      padded,
      amount,
      minAmount,
      {
        refundAddress: wallet.address,
        zroPaymentAddress: this.layerzero.nullAddress,
        adapterParams: this.layerzero.defaultRelayerAdapterParams,
      },
      {
        value,
      },
    );

    const tx = await pancakeSwapOFTProxy.populateTransaction.sendFrom(
      wallet.address,
      dstChainId,
      padded,
      amount,
      minAmount,
      {
        refundAddress: wallet.address,
        zroPaymentAddress: this.layerzero.nullAddress,
        adapterParams: this.layerzero.defaultRelayerAdapterParams,
      },
      {
        value,
        gasLimit,
      },
    );

    const result = await wallet.sendTransaction(tx);
    return await result.wait();
  }
}
