import { PackageType, Prisma } from '@/lib/prisma';
import { Injectable, Logger } from '@nestjs/common';
import { ethers } from 'ethers';
import { VaultService } from '@/lib/vault/vault.service';
import { getProvider, getRpcUrl, Network } from '@/lib/ankr';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { WalletCreatedEvent } from '@/features/wallet/wallet.events';

type PrivateKey = {
  privateKey: string;
};

type WalletLimit = {
  custodialWalletLimit: number;
  nonCustodialWalletLimit: number;
};

@Injectable()
export class WalletService {
  private readonly logger = new Logger(WalletService.name);

  constructor(
    private readonly vaultService: VaultService,
    private eventEmitter: EventEmitter2,
  ) {}

  async create(userId: string, privateKey?: string) {
    this.logger.log('Creating Wallet ...');
    if (!(await this.canCreateOrImportWallet(userId, Boolean(privateKey)))) {
      throw new Error('Cannot Import or Create new wallet.');
    }
    const wallet = privateKey ? this.fromPrivateKey(privateKey) : this.random();

    await Prisma.$transaction(async (tx) => {
      // IF input has private key, check importWalletLimit value in db, if value greater than 0, allow wallet to import, else throw an error, if the input
      await tx.wallet.create({
        data: { user: { connect: { id: userId } }, address: wallet.address },
      });

      this.logger.log(`Created Wallet: ${wallet.address}`);
      await this.vaultService.createSecret(wallet.address, {
        privateKey: wallet.privateKey,
      });

      this.logger.log(`Created Wallet Secret in Vault: ${wallet.address}`);
    });

    this.eventEmitter.emit(
      WalletCreatedEvent.name,
      new WalletCreatedEvent(userId, wallet.address),
    );

    return wallet.address;
  }

  async get(address: string, network?: Network) {
    this.logger.log(`Retrieving private key: ${address}`);

    // Get wallet from DB
    const wallet = await Prisma.wallet.findFirst({
      where: { address },
    });

    if (!wallet) {
      throw new Error(`The wallet ${address} does not exist in the DB.`);
    }

    // Get wallet from vault
    return await this.fromVault(address, network);
  }

  async getAllWallets() {
    return await Prisma.wallet.findMany();
  }

  private random() {
    return ethers.Wallet.createRandom();
  }

  private async fromVault(address: string, network?: Network) {
    const { privateKey } =
      await this.vaultService.getSecret<PrivateKey>(address);

    if (!privateKey)
      throw new Error(`Unable to import private key for ${address}`);

    return this.fromPrivateKey(privateKey, network);
  }

  private fromPrivateKey(privateKey: string, network?: Network) {
    return network
      ? new ethers.Wallet(privateKey, getProvider(network))
      : new ethers.Wallet(privateKey);
  }

  async getWalletsByUserId(userId: string) {
    const wallets = await Prisma.wallet.findMany({
      where: { userId },
      include: { RouteJob: true },
    });
    return await Promise.all(
      wallets.map(async (wallet) => {
        const provider = new ethers.providers.JsonRpcProvider(
          getRpcUrl('arbitrumOne'),
        );
        const balance = await provider.getBalance(wallet.address);
        const formatted = ethers.utils.formatEther(balance);

        return { ...wallet, balance: formatted };
      }),
    );
  }

  async getLimitByUserId(userId: string): Promise<WalletLimit> {
    const userCheckouts = await Prisma.checkout.findMany({
      where: {
        userId,
        status: 'Success',
      },
      include: {
        package: true,
      },
    });

    const custodialWalletLimit = userCheckouts.reduce((sum, checkout) => {
      if (checkout.package.type === PackageType.Custodial) {
        return sum + checkout.package.walletCount;
      }
    }, 0);

    const nonCustodialWalletLimit = userCheckouts.reduce((sum, checkout) => {
      if (checkout.package.type === PackageType.NonCustodial) {
        return sum + checkout.package.walletCount;
      }
    }, 0);

    return { custodialWalletLimit, nonCustodialWalletLimit };
  }

  private async canCreateOrImportWallet(
    userId: string,
    isNewWallet: boolean,
  ): Promise<boolean> {
    const user = await Prisma.user.findUnique({ where: { id: userId } });
    if (user.role === 'Admin') return true;
    const { custodialWalletLimit, nonCustodialWalletLimit } =
      await this.getLimitByUserId(userId);

    const nonCustodialWalletCount = await Prisma.wallet.count({
      where: { userId, isImported: true },
    });

    const custodialWalletCount = await Prisma.wallet.count({
      where: { userId, isImported: false },
    });

    const canImportWallet = custodialWalletCount < custodialWalletLimit;
    const canCreateWallet = nonCustodialWalletCount < nonCustodialWalletLimit;

    return isNewWallet ? canCreateWallet : canImportWallet;
  }
}
