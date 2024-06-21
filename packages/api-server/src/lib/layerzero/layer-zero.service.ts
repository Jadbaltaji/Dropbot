import { Injectable, Logger } from '@nestjs/common';
import { ethers } from 'ethers';
import { LZChainIds, refuelMaxValues } from '@/lib/layerzero/constants';
import { waitForMessageReceived } from '@layerzerolabs/scan-client';
import { AvailableNetwork } from '@/features/network';
import { findKeyByValue } from '@/utils';

@Injectable()
export class LayerZeroService {
  defaultRelayerAdapterParams: string;
  emptyByteArray: string;
  nullAddress: string;
  private readonly logger = new Logger(LayerZeroService.name);

  constructor() {
    this.defaultRelayerAdapterParams = this.getRelayerAdapterParamsV1(300000);
    this.emptyByteArray = ethers.utils.hexlify('0x');
    this.nullAddress = '0x0000000000000000000000000000000000000000';
  }

  async waitForMessageReceived(
    network: AvailableNetwork<'layerZero'>,
    transactionHash: string,
    pollInterval = 3000,
  ) {
    const message = await waitForMessageReceived(
      LZChainIds[network],
      transactionHash,
      pollInterval,
    );

    const dstChain = findKeyByValue(LZChainIds, message.dstChainId);
    this.logger.log(
      `${network} -> ${dstChain.toString()} >> ${message.status}`,
    );
  }

  getRelayerAdapterParamsV1(gasAmount: ethers.BigNumberish) {
    return ethers.utils.solidityPack(['uint16', 'uint256'], [1, gasAmount]);
  }

  getRelayerAdapterParamsV2(
    gasAmount: ethers.BigNumberish,
    nativeForDst: string,
    addressOnDst: string,
    network: AvailableNetwork<'merklyRefuel'>,
  ) {
    const refuelMaxValuesWei = ethers.utils.parseUnits(
      refuelMaxValues[network].toString(),
      18,
    );

    const nativeForDstWei = ethers.utils.parseUnits(nativeForDst, 18);

    if (nativeForDstWei.gt(refuelMaxValuesWei))
      throw new Error(
        `The max gas you can bridge to ${network} is ${refuelMaxValues[network]}`,
      );

    return ethers.utils.solidityPack(
      ['uint16', 'uint', 'uint', 'address'],
      [2, gasAmount.toString(), nativeForDstWei.toString(), addressOnDst],
    );
  }
}
