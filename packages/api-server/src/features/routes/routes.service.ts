import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import Bull, { Queue } from 'bull';
import { RouteList, Routes } from './routes';
import { BalanceService } from '@/features/balance/balance.service';
import { AvailableNetwork } from '@/features/network';
import { Prisma } from '@/lib/prisma';
import { UserService } from '@/features/user/user.service';

export const ROUTES_QUEUE_NAME = 'routes';

@Injectable()
export class RoutesService {
  constructor(
    @InjectQueue(ROUTES_QUEUE_NAME) private routesQueue: Queue,
    private readonly balance: BalanceService,
  ) {}

  async executeRoute(
    walletAddress: string,
    routes: Routes,
    jobId: Bull.JobId,
    delay = 5000,
    attempts = 3,
  ) {
    const networks = routes
      .filter(({ fromChain }) => fromChain !== 'arbitrumOne')
      .filter(({ fromChain }) => fromChain !== 'mainnet')
      .map(({ fromChain }) => fromChain) as AvailableNetwork<'merklyRefuel'>[];
    await this.balance.checkAndRefuel(walletAddress, [...new Set(networks)]);

    await this.routesQueue.add(
      { walletAddress, routes },
      { delay, attempts, jobId },
    );
  }

  async getRoutesByUserId(userId: string) {
    return await Prisma.routeJob.findMany({
      where: { wallet: { userId } },
    });
  }

  async getAllAirdropRoutes() {
    return RouteList;
  }
}
