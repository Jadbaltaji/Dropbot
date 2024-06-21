import { Injectable, Logger } from '@nestjs/common';
import { AvailableNetwork } from '@/features/network';
import { sdk } from '../contracts';
import { ethers } from 'ethers';
import { LayerZeroService } from '../layerzero/layer-zero.service';
import { LZ_PAYMENT_ADDRESS, LZChainIds } from '@/lib/layerzero';
import { Prisma } from '../prisma';

@Injectable()
export class l2MarathonService {
  private readonly logger = new Logger(l2MarathonService.name);
  constructor(private readonly layerZero: LayerZeroService) {}
  async mintONFT(
    wallet: ethers.Wallet,
    network: AvailableNetwork<'l2Marathon'>,
  ) {
    const { l2Marathon } = sdk[network](wallet);
    const fee = await l2Marathon.fee();

    const gasLimit = await l2Marathon.estimateGas.mint({
      value: fee.toString(),
    });
    const tx = await l2Marathon.populateTransaction.mint({
      value: fee.toString(),
      gasLimit,
    });

    const result = await wallet.sendTransaction(tx);
    const txHash = await result.wait();
    const tokenId = txHash.logs[0].topics[3];

    return ethers.BigNumber.from(tokenId).toString();
  }

  async bridgeONFT(
    wallet: ethers.Wallet,
    network: AvailableNetwork<'l2Marathon'>,
    dstChain: AvailableNetwork<'l2Marathon'>,
    tokenId: ethers.BigNumberish,
  ) {
    const { l2Marathon } = sdk[network](wallet);
    const adapterParams = this.layerZero.getRelayerAdapterParamsV1(450000);
    const dstChainId = LZChainIds[dstChain];

    const fee = await l2Marathon.estimateSendFee(
      dstChainId,
      wallet.address,
      tokenId,
      false,
      adapterParams,
    );

    const gasLimit = await l2Marathon.estimateGas.sendFrom(
      wallet.address,
      dstChainId,
      wallet.address,
      tokenId,
      wallet.address,
      LZ_PAYMENT_ADDRESS,
      adapterParams,
      { value: fee[0].toString() },
    );

    const tx = await l2Marathon.populateTransaction.sendFrom(
      wallet.address,
      dstChainId,
      wallet.address,
      tokenId,
      wallet.address,
      LZ_PAYMENT_ADDRESS,
      adapterParams,
      { value: fee[0].toString(), gasLimit },
    );

    const result = await wallet.sendTransaction(tx);
    const receipt = await result.wait();
    this.logger.log(`L2Marathon: ${network} >> ${tokenId} sent`);
    return receipt;
  }

  async getONFTTokenId(
    wallet: ethers.Wallet,
    network: AvailableNetwork<'l2Marathon'>,
  ) {
    const { userId } = await Prisma.wallet.findUnique({
      where: { address: wallet.address },
    });

    if (!userId) throw new Error('User with wallet does not exist.');

    const result = await Prisma.oNFT.findFirst({
      where: { userId, ONFTservice: 'L2Marathon' },
    });

    if (result?.tokenId) {
      this.logger.log(`L2Marathon: ${network} >> ${result.tokenId} FOUND`);
      return result.tokenId;
    } else {
      const newTokenId = await this.mintONFT(wallet, network);

      await Prisma.oNFT.create({
        data: {
          userId,
          tokenId: newTokenId,
          ONFTservice: 'L2Marathon',
          chain: network,
        },
      });

      this.logger.log(`L2Marathon: ${network} >> ${newTokenId} CREATED`);
      return newTokenId;
    }
  }
}
