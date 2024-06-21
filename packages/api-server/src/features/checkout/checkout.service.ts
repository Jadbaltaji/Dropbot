import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { CheckoutStatus, Prisma } from '@/lib/prisma';
import { coinbaseCommerceApiEndpoint } from '@/lib/coinbase';
import { WalletService } from '../wallet/wallet.service';

@Injectable()
export class CheckoutService {
  private readonly logger = new Logger(CheckoutService.name);
  constructor(private readonly wallet: WalletService) {}

  async createCharge(userId: string, packageId: string) {
    const headers = {
      'X-CC-Api-Key': process.env.COINBASE_COMMERCE_API_KEY,
      'Content-Type': 'application/json',
    };

    const checkoutPackage = await Prisma.package.findFirstOrThrow({
      where: { id: packageId },
    });

    const chargeData = {
      name: checkoutPackage.name,
      description: checkoutPackage.description,
      local_price: {
        amount: checkoutPackage.price,
        currency: 'USD',
      },
      pricing_type: 'fixed_price',
      metadata: {
        packageId,
        userId,
      },
    };

    const response = await axios.post(coinbaseCommerceApiEndpoint, chargeData, {
      headers,
    });

    const charge = response.data.data;

    return charge.code as string;
  }

  async handleChargeConfrimed(chargeId: string) {
    const checkout = await Prisma.checkout.update({
      where: {
        id: chargeId,
      },
      data: {
        status: CheckoutStatus.Success,
      },
    });
    this.logger.log(`${chargeId}: Confirmed`);
    const { type, walletCount } = await Prisma.package.findFirst({
      where: { id: checkout.packageId },
    });

    if (type === 'Custodial') {
      for (let i = 0; i < walletCount; i++) {
        await this.wallet.create(checkout.userId);
      }
      this.logger.log(`${walletCount}: Custodial Wallets Created`);
    }
  }

  async handleWebhook(
    chargeId: string,
    userId: string,
    packageId: string,
    eventType: string,
  ) {
    switch (eventType) {
      case 'charge:created':
        this.logger.log(`${chargeId}: Created`);
        break;
      case 'charge:confirmed':
        await this.handleChargeConfrimed(chargeId);
        break;
      case 'charge:failed':
        await Prisma.checkout.update({
          where: {
            id: chargeId,
          },
          data: {
            status: CheckoutStatus.Failed,
          },
        });

        this.logger.log(`${chargeId}: Failed`);
        break;
      case 'charge:delayed':
        this.logger.log(`${chargeId}: Delayed`);
        break;
      case 'charge:pending':
        await Prisma.checkout.create({
          data: {
            id: chargeId,
            user: {
              connect: { id: userId },
            },
            status: CheckoutStatus.Pending,
            package: {
              connect: {
                id: packageId,
              },
            },
          },
        });
        this.logger.log(`${chargeId}: Pending`);
        break;
      case 'charge:resolved':
        this.logger.log(`${chargeId}: Resolved`);
        break;
    }
  }
}
