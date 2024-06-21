import { Injectable } from '@nestjs/common';
import { sdk } from '../contracts';
import { AvailableNetwork } from '@/features/network';
import { BigNumber, ethers } from 'ethers';
import { PoolId } from './constants';
import { LZChainIds } from '@/lib/layerzero';
import { calculatePercentOfBigNumber } from '@/utils';
import { BalanceService } from '@/features/balance/balance.service';
import { getMaxTransferableValue } from '@/features/balance/balance.utils';

@Injectable()
export class StargateService {
  constructor(private readonly balance: BalanceService) {}

  async bridgeETH(
    wallet: ethers.Wallet,
    network: AvailableNetwork<'stargateETH'>,
    dstChain: AvailableNetwork<'stargateETH'>,
  ) {
    const { stargateETH, stargate } = sdk[network](wallet);
    const dstChainId = LZChainIds[dstChain];

    const balance = await this.balance.check(wallet.address, network);
    const minimumBalance = calculatePercentOfBigNumber(balance, 90);
    const slippage = calculatePercentOfBigNumber(balance, 85);

    const quoteData = await stargate.functions.quoteLayerZeroFee(
      dstChainId,
      1,
      wallet.address,
      '0x',
      {
        dstGasForCall: 0,
        dstNativeAmount: 0,
        dstNativeAddr: '0x',
      },
    );
    const feeWei = quoteData[0];

    let value = feeWei.add(minimumBalance).toString();

    const gasLimit = await stargateETH.estimateGas.swapETH(
      dstChainId,
      wallet.address,
      wallet.address,
      minimumBalance.toString(),
      slippage.toString(),
      { value },
    );

    const maxBalanceToSend = await getMaxTransferableValue(
      wallet,
      gasLimit,
      feeWei,
    );

    const minBalanceToSend = calculatePercentOfBigNumber(maxBalanceToSend, 95);

    value = feeWei.add(maxBalanceToSend).toString();

    const tx = await stargateETH.populateTransaction.swapETH(
      dstChainId,
      wallet.address,
      wallet.address,
      maxBalanceToSend.toString(),
      minBalanceToSend.toString(),
      { value, gasLimit },
    );

    const result = await wallet.sendTransaction(tx);

    return await result.wait();
  }

  async bridgeAsset(
    wallet: ethers.Wallet,
    network: AvailableNetwork<'stargate'>,
    dstChain: AvailableNetwork<'stargate'>,
    assetPoolId: PoolId,
    quantity: BigNumber,
  ) {
    const { stargate } = sdk[network](wallet);
    const dstChainId = LZChainIds[dstChain];

    const { feeWei, gasLimit } = await this.calculateGasLimit(
      wallet,
      network,
      dstChain,
      assetPoolId,
      quantity,
    );

    const minimum = calculatePercentOfBigNumber(quantity, 95);

    const tx = await stargate.populateTransaction.swap(
      dstChainId,
      assetPoolId,
      assetPoolId,
      wallet.address,
      quantity.toString(),
      minimum.toString(),
      {
        dstGasForCall: 0,
        dstNativeAmount: 0,
        dstNativeAddr: '0x',
      },
      wallet.address,
      '0x',
      { value: feeWei.toString(), gasLimit },
    );

    const result = await wallet.sendTransaction(tx);

    return await result.wait();
  }

  private async calculateGasLimit(
    wallet: ethers.Wallet,
    network: AvailableNetwork<'stargate'>,
    dstChain: AvailableNetwork<'stargate'>,
    assetPoolId: PoolId,
    quantity: BigNumber,
  ) {
    const { stargate } = sdk[network](wallet);
    const dstChainId = LZChainIds[dstChain];

    const quoteData = await stargate.functions.quoteLayerZeroFee(
      dstChainId,
      1,
      wallet.address,
      '0x',
      {
        dstGasForCall: 0,
        dstNativeAmount: 0,
        dstNativeAddr: '0x',
      },
    );
    const feeWei = quoteData[0];

    const minimum = calculatePercentOfBigNumber(quantity, 95);

    const gasLimit = await stargate.estimateGas.swap(
      dstChainId,
      assetPoolId,
      assetPoolId,
      wallet.address,
      quantity.toString(),
      minimum.toString(),
      {
        dstGasForCall: 0,
        dstNativeAmount: 0,
        dstNativeAddr: '0x',
      },
      wallet.address,
      '0x',
      { value: feeWei.toString() },
    );

    return { feeWei, gasLimit };
  }
}
