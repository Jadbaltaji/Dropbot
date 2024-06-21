import { Injectable } from '@nestjs/common';
import { AvailableNetwork, Networks } from '@/features/network';
import { sdk } from '@/lib/contracts';
import { BigNumberish, ethers } from 'ethers';
import { LZChainIds } from '@/lib/layerzero';
import { LayerZeroService } from '@/lib/layerzero/layer-zero.service';
import { LifiService } from '../lifi/lifi.service';

@Injectable()
export class AngleService {
  constructor(
    private readonly layerzero: LayerZeroService,
    private readonly lifi: LifiService,
  ) {}

  async bridgeAgEUR(
    wallet: ethers.Wallet,
    network: AvailableNetwork<'agEURToken'>,
    dstChain: AvailableNetwork<'agEURToken'>,
    amount: BigNumberish,
  ) {
    const { agEURBridge } = sdk[network](wallet);

    await this.lifi.approveSpend(
      wallet,
      Networks[network].contracts.agEURToken,
      Networks[network].contracts.agEURBridge,
      amount,
    );

    const dstChainId = LZChainIds[dstChain];

    const fee = await agEURBridge.estimateSendFee(
      dstChainId,
      wallet.address,
      amount,
      false,
      this.layerzero.defaultRelayerAdapterParams,
    );

    const value = fee[0].toString();

    const gasLimit = await agEURBridge.estimateGas.send(
      dstChainId,
      wallet.address,
      amount.toString(),
      wallet.address,
      this.layerzero.nullAddress,
      this.layerzero.defaultRelayerAdapterParams,
      { value },
    );

    const tx = await agEURBridge.populateTransaction.send(
      dstChainId,
      wallet.address,
      amount,
      wallet.address,
      this.layerzero.nullAddress,
      this.layerzero.defaultRelayerAdapterParams,
      { value, gasLimit },
    );

    const result = await wallet.sendTransaction(tx);
    return await result.wait();
  }
}
