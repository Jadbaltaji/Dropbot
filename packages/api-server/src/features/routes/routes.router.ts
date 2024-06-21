import { RoutesService } from '@/features/routes/routes.service';
import { Injectable } from '@nestjs/common';
import { TrpcService } from '@/trpc/trpc.service';
import { z } from 'zod';
import { Routes } from '@/features/routes/routes';
import { Prisma, RouteJobExecutor } from '@/lib/prisma';

@Injectable()
export class RoutesRouter {
  constructor(
    private readonly trpc: TrpcService,
    private readonly routes: RoutesService,
  ) {}

  router = this.trpc.router({
    getRoutesByUserId: this.trpc.procedure.query(async ({ ctx }) =>
      this.routes.getRoutesByUserId(ctx.user.userId),
    ),
    getRouteList: this.trpc.procedure.query(this.routes.getAllAirdropRoutes),
    getScheduledRouteList: this.trpc.procedure.query(
      async ({ ctx }) =>
        await Prisma.routeJob.findMany({
          where: {
            wallet: {
              userId: ctx.user.userId,
            },
            executor: RouteJobExecutor.Dropbot,
          },
        }),
    ),
    execute: this.trpc.procedure
      .input(
        z.object({
          wallet: z.string(),
          route: z.custom<Routes>(),
          name: z.string(),
        }),
      )
      .mutation(async ({ input }) => {
        const { id } = await Prisma.routeJob.create({
          data: {
            name: input.name,
            executor: RouteJobExecutor.Client,
            wallet: { connect: { address: input.wallet } },
          },
        });
        await this.routes.executeRoute(input.wallet, input.route, id);
      }),
  });
}
