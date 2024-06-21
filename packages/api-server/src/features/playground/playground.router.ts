import { RoutesService } from '@/features/routes/routes.service';
import {
  angleRoute,
  bitcoinBridgeRoute,
  lifiRoute,
  pancakeSwapRoute,
  stargateEthRoute,
  stargateUsdcRoute,
} from '@/features/routes/routes';

import { Injectable } from '@nestjs/common';
import { TrpcService } from '@/trpc/trpc.service';
import { z } from 'zod';
import { BalanceService } from '@/features/balance/balance.service';
import { SupportedNetworks } from '@/features/network';
import { UserService } from '@/features/user/user.service';
import { VaultService } from '@/lib/vault/vault.service';
import { Prisma } from '@/lib/prisma';

@Injectable()
export class PlaygroundRouter {
  constructor(
    private readonly trpc: TrpcService,
    private readonly routes: RoutesService,
    private readonly balance: BalanceService,
    private readonly user: UserService,
    private readonly vault: VaultService,
  ) {}

  router = this.trpc.router({
    DELETE_WALLET: this.trpc.procedure
      .input(
        z.object({
          name: z.string(),
        }),
      )
      .mutation(async ({ input }) => {
        await Prisma.wallet.delete({ where: { address: input.name } });
        await this.vault.deleteSecret(input.name);
      }),
    // DELETE_ALL_WALLETS: this.trpc.procedure.mutation(async ({ctx}) => {
    //   const wallets = await Prisma.wallet.findMany();
    //   for (let i = 0; i < wallets.length; i++) {
    //     await Prisma.wallet.delete({ where: { address: wallets[i].address } });
    //     await this.vault.deleteSecret(wallets[i].address);
    //   }
    // }),
    addPoints: this.trpc.procedure
      .input(
        z.object({
          pointsToAdd: z.number(),
        }),
      )
      .mutation(
        async ({ ctx, input }) =>
          await this.user.addPoints(ctx.user.userId, input.pointsToAdd),
      ),
    consolidate: this.trpc.procedure
      .input(
        z.object({
          wallet: z.string(),
        }),
      )
      .mutation(async ({ input }) => this.balance.consolidate(input.wallet)),
    refuel: this.trpc.procedure
      .input(
        z.object({
          wallet: z.string(),
        }),
      )
      .mutation(async ({ input }) =>
        this.balance.checkAndRefuel(input.wallet, SupportedNetworks),
      ),
    lifi: this.trpc.procedure
      .input(
        z.object({
          wallet: z.string(),
        }),
      )
      .mutation(async ({ input }) =>
        this.routes.executeRoute(input.wallet, lifiRoute, 1),
      ),
    stargateEth: this.trpc.procedure
      .input(
        z.object({
          wallet: z.string(),
        }),
      )
      .mutation(async ({ input }) =>
        this.routes.executeRoute(input.wallet, stargateEthRoute, 2),
      ),
    stargateUsdc: this.trpc.procedure
      .input(
        z.object({
          wallet: z.string(),
        }),
      )
      .mutation(async ({ input }) =>
        this.routes.executeRoute(input.wallet, stargateUsdcRoute, 3),
      ),
    pancakeSwapRoute: this.trpc.procedure
      .input(
        z.object({
          wallet: z.string(),
        }),
      )
      .mutation(async ({ input }) =>
        this.routes.executeRoute(input.wallet, pancakeSwapRoute, 4),
      ),
    bitcoinBridgeRoute: this.trpc.procedure
      .input(
        z.object({
          wallet: z.string(),
        }),
      )
      .mutation(async ({ input }) =>
        this.routes.executeRoute(input.wallet, bitcoinBridgeRoute, 5),
      ),
    angleRoute: this.trpc.procedure
      .input(
        z.object({
          wallet: z.string(),
        }),
      )
      .mutation(async ({ input }) =>
        this.routes.executeRoute(input.wallet, angleRoute, 6),
      ),
  });
}
