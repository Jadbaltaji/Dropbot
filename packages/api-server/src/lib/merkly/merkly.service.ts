import { sdk } from '../contracts';
import { AvailableNetwork, Networks } from '@/features/network';
import { Injectable, Logger } from '@nestjs/common';
import { BigNumber, Contract, ethers, Wallet } from 'ethers';
import { LayerZeroService } from '@/lib/layerzero/layer-zero.service';
import { LZChainIds, LZ_PAYMENT_ADDRESS } from '@/lib/layerzero';
import { Prisma } from '@/lib/prisma';
import { ERC20_ABI } from '@/lib/contracts/abis/ERC_20';

@Injectable()
export class MerklyService {
  private readonly logger = new Logger(MerklyService.name);
  constructor(private readonly layerZero: LayerZeroService) {}

  async refuel(
    wallet: ethers.Wallet,
    network: AvailableNetwork<'merklyRefuel'>,
    dstChain: AvailableNetwork<'merklyRefuel'>,
    nativeForDst: string,
  ) {
    const { merklyRefuel } = sdk[network](wallet);

    const dstChainId = LZChainIds[dstChain];
    const adapterParams = this.layerZero.getRelayerAdapterParamsV2(
      300000,
      nativeForDst,
      wallet.address,
      dstChain,
    );

    const fee = await merklyRefuel.estimateSendFee(
      dstChainId,
      this.layerZero.emptyByteArray,
      adapterParams,
    );
    const padding = fee[0].div(200);
    const value = fee[0].add(padding).toString();

    const gasLimit = await merklyRefuel.estimateGas.bridgeGas(
      dstChainId,
      wallet.address,
      adapterParams,
      { value },
    );

    const tx = await merklyRefuel.populateTransaction.bridgeGas(
      dstChainId,
      wallet.address,
      adapterParams,
      { value, gasLimit },
    );

    const result = await wallet.sendTransaction(tx);

    const receipt = await result.wait();
    this.logger.log(`Merkly refuel: ${network} -> ${dstChain} >> SENT`);

    return receipt;
  }

  async getONFTTokenId(
    wallet: ethers.Wallet,
    network: AvailableNetwork<'merklyONFT'>,
  ) {
    const { userId } = await Prisma.wallet.findUnique({
      where: { address: wallet.address },
    });

    if (!userId) throw new Error('User with wallet does not exist.');

    const result = await Prisma.oNFT.findFirst({
      where: { userId, ONFTservice: 'Merkly' },
    });

    if (result?.tokenId) {
      this.logger.log(`MerklyONFT: ${network} >> ${result.tokenId} FOUND`);
      return result.tokenId;
    } else {
      const newTokenId = await this.mintONFT(wallet, network);

      await Prisma.oNFT.create({
        data: {
          userId,
          tokenId: newTokenId,
          ONFTservice: 'Merkly',
          chain: network,
        },
      });

      this.logger.log(`MerklyONFT: ${network} >> ${newTokenId} CREATED`);
      return newTokenId;
    }
  }

  async mintONFT(
    wallet: ethers.Wallet,
    network: AvailableNetwork<'merklyONFT'>,
  ) {
    const { merklyONFT } = sdk[network](wallet);
    const fee = await merklyONFT.fee();
    const gasLimit = await merklyONFT.estimateGas.mint({
      value: fee.toString(),
    });

    const tx = await merklyONFT.populateTransaction.mint({
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
    network: AvailableNetwork<'merklyONFT'>,
    dstChain: AvailableNetwork<'merklyONFT'>,
    tokenId: ethers.BigNumberish,
  ) {
    const { merklyONFT } = sdk[network](wallet);
    const dstChainId = LZChainIds[dstChain];
    const adapterParams = this.layerZero.defaultRelayerAdapterParams;
    const merklyFee = await merklyONFT.estimateSendFee(
      dstChainId,
      wallet.address,
      tokenId,
      false,
      adapterParams,
    );

    const gasLimit = await merklyONFT.estimateGas.sendFrom(
      wallet.address,
      dstChainId,
      wallet.address,
      tokenId,
      wallet.address,
      LZ_PAYMENT_ADDRESS,
      adapterParams,
      { value: merklyFee[0].toString() },
    );

    const tx = await merklyONFT.populateTransaction.sendFrom(
      wallet.address,
      dstChainId,
      wallet.address,
      tokenId,
      wallet.address,
      LZ_PAYMENT_ADDRESS,
      adapterParams,
      { value: merklyFee[0].toString(), gasLimit },
    );

    const result = await wallet.sendTransaction(tx);

    const reciept = await result.wait();

    this.logger.log(`merklyONFT: ${network} -> ${dstChain} >> ${tokenId} SENT`);
    return reciept;
  }

  async getOFTBalance(wallet: Wallet, network: AvailableNetwork<'merklyOFT'>) {
    const contract = new Contract(
      Networks[network].contracts.merklyOFT,
      ERC20_ABI,
      wallet,
    );
    return (await contract.balanceOf(wallet.address)) as BigNumber;
  }

  async getOrCreateOFTBalance(
    wallet: ethers.Wallet,
    network: AvailableNetwork<'merklyOFT'>,
    amount = 4,
  ) {
    const balance = await this.getOFTBalance(wallet, network);

    if (balance.eq(ethers.BigNumber.from(0))) {
      await this.mintOFT(wallet, network, amount);

      return await this.getOFTBalance(wallet, network);
    }
    return balance;
  }

  async mintOFT(
    wallet: ethers.Wallet,
    network: AvailableNetwork<'merklyOFT'>,
    amount: ethers.BigNumberish,
  ) {
    const { merklyOFT } = sdk[network](wallet);

    const fee = await merklyOFT.fee();
    const value = fee.mul(amount);
    const gasLimit = await merklyOFT.estimateGas.mint(wallet.address, amount, {
      value,
    });

    const tx = await merklyOFT.populateTransaction.mint(
      wallet.address,
      amount,
      { value, gasLimit },
    );

    const result = await wallet.sendTransaction(tx);

    const reciept = await result.wait();

    this.logger.log(`MerklyOFT: ${network} >> Minted`);
    return reciept;
  }

  async bridgeOFT(
    wallet: ethers.Wallet,
    network: AvailableNetwork<'merklyOFT'>,
    dstChain: AvailableNetwork<'merklyOFT'>,
    balance: BigNumber,
  ) {
    const { merklyOFT } = sdk[network](wallet);

    const dstChainId = LZChainIds[dstChain];

    const emptyByteArray = this.layerZero.emptyByteArray;

    const fee = await merklyOFT.estimateSendFee(
      dstChainId,
      wallet.address,
      balance,
      false,
      emptyByteArray,
    );
    const value = fee[0].toString();

    const gasLimit = await merklyOFT.estimateGas.sendFrom(
      wallet.address,
      dstChainId,
      wallet.address,
      balance,
      wallet.address,
      LZ_PAYMENT_ADDRESS,
      emptyByteArray,
      { value },
    );

    const tx = await merklyOFT.populateTransaction.sendFrom(
      wallet.address,
      dstChainId,
      wallet.address,
      balance,
      wallet.address,
      LZ_PAYMENT_ADDRESS,
      emptyByteArray,
      { value, gasLimit },
    );

    const result = await wallet.sendTransaction(tx);
    const receipt = await result.wait();

    this.logger.log(`MerklyOFT: ${network} -> ${dstChain} >> SENT`);

    return receipt;
  }
}
