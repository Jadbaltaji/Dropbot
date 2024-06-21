import { Injectable } from '@nestjs/common';
import { BigNumber, ethers, Wallet } from 'ethers';
import { sdk } from '@/lib/contracts';
import { AvailableNetwork, Networks } from '@/features/network';
import { LZChainIds } from '@/lib/layerzero';
import { LayerZeroService } from '@/lib/layerzero/layer-zero.service';
import { calculatePercentOfBigNumber } from '@/utils';
import { BalanceService } from '@/features/balance/balance.service';
import { LifiService } from '@/lib/lifi/lifi.service';

type BitcoinBridgeNetworks = AvailableNetwork<'BTCbOFT'> | 'avalanche';

@Injectable()
export class BitcoinBridgeService {
  constructor(
    private readonly layerzero: LayerZeroService,
    private readonly balance: BalanceService,
    private readonly lifi: LifiService,
  ) {}
  async bridge(
    wallet: ethers.Wallet,
    network: BitcoinBridgeNetworks,
    dstChain: BitcoinBridgeNetworks,
    amount: BigNumber,
  ) {
    if (network === 'avalanche')
      return await this.bridgeAvax(wallet, dstChain, amount);

    const { BTCbOFT } = sdk[network](wallet);

    const dstChainId = LZChainIds[dstChain];
    const minAmount = calculatePercentOfBigNumber(amount, 95);
    const padded = ethers.utils.hexZeroPad(wallet.address, 32);

    const fee = await BTCbOFT.estimateSendFee(
      dstChainId,
      padded,
      amount,
      false,
      this.layerzero.defaultRelayerAdapterParams,
    );

    const value = fee[0].toString();

    const gasLimit = await BTCbOFT.estimateGas.sendFrom(
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

    const tx = await BTCbOFT.populateTransaction.sendFrom(
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

  private async bridgeAvax(
    wallet: ethers.Wallet,
    dstChain: BitcoinBridgeNetworks,
    amount: BigNumber,
  ) {
    await this.lifi.approveSpend(
      wallet,
      Networks.avalanche.contracts.BTCbToken,
      Networks.avalanche.contracts.BTCbOFTProxy,
      amount,
    );

    const { BTCbOFTProxy } = sdk['avalanche'](wallet);
    const dstChainId = LZChainIds[dstChain];
    const minAmount = calculatePercentOfBigNumber(amount, 95);

    const padded = ethers.utils.hexZeroPad(wallet.address, 32);

    const minGas = await BTCbOFTProxy.minDstGasLookup(dstChainId, 1);

    const fee = await BTCbOFTProxy.estimateSendAndCallFee(
      dstChainId,
      padded,
      amount,
      '0x',
      minGas,
      false,
      this.layerzero.getRelayerAdapterParamsV1(minGas),
    );

    const value = fee[0].toString();
    const gasLimit = await BTCbOFTProxy.estimateGas.sendFrom(
      wallet.address,
      dstChainId,
      padded,
      amount,
      minAmount,
      {
        refundAddress: wallet.address,
        zroPaymentAddress: this.layerzero.nullAddress,
        adapterParams: this.layerzero.getRelayerAdapterParamsV1(minGas),
      },
      {
        value,
      },
    );

    const tx = await BTCbOFTProxy.populateTransaction.sendFrom(
      wallet.address,
      dstChainId,
      padded,
      amount,
      minAmount,
      {
        refundAddress: wallet.address,
        zroPaymentAddress: this.layerzero.nullAddress,
        adapterParams: this.layerzero.getRelayerAdapterParamsV1(minGas),
      },
      {
        value,
        gasLimit,
      },
    );

    const result = await wallet.sendTransaction(tx);
    return await result.wait();
  }

  async getBalance(
    wallet: Wallet,
    network: AvailableNetwork<'BTCbOFT' | 'BTCbToken' | 'BTCbOFTProxy'>,
    percentAmount = 100,
  ) {
    let tokenAddress: string;

    if (network === 'avalanche')
      tokenAddress = Networks.avalanche.contracts.BTCbToken;
    else tokenAddress = Networks[network].contracts.BTCbOFT;

    return await this.balance.getFromWallet(
      wallet,
      tokenAddress,
      percentAmount,
    );
  }
}
