import { Injectable } from '@nestjs/common';
import { Prisma } from '@/lib/prisma';
import { RouteJobCompletedEvent } from '@/features/routes/routes.events';
import { OnEvent } from '@nestjs/event-emitter';
import { WalletCreatedEvent } from '@/features/wallet/wallet.events';

@Injectable()
export class UserService {
  pointsPerRouteCompletion = 10;

  async findUserById(id: string) {
    return await Prisma.user.findUnique({ where: { id } });
  }

  async findUserByUsername(username: string) {
    return await Prisma.user.findUnique({
      where: { username },
    });
  }

  async findUserByWalletAddress(walletAddress: string) {
    return await Prisma.user.findFirst({
      where: { wallets: { some: { address: walletAddress } } },
    });
  }

  async createUser(
    id: string,
    username: string,
    invitedByUserId?: string | null,
  ) {
    return await Prisma.user.create({
      data: { id, username, invitedByUserId },
    });
  }

  async addPoints(userId: string, pointsToAdd: number) {
    const user = await this.findUserById(userId);

    const points = user.points + pointsToAdd;

    return await Prisma.user.update({
      data: { points },
      where: { id: userId },
    });
  }
}
