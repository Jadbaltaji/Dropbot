import { RoutesService } from '@/features/routes/routes.service';
import { Injectable } from '@nestjs/common';
import { TrpcService } from '@/trpc/trpc.service';
import { Prisma } from '@/lib/prisma';
import { z } from 'zod';

@Injectable()
export class UserRouter {
  constructor(private readonly trpc: TrpcService) {}

  router = this.trpc.router({
    getById: this.trpc.procedure.query(async ({ ctx }) =>
      Prisma.user.findFirst({
        where: { id: ctx.user.userId ?? undefined },
      }),
    ),
    getByUsername: this.trpc.procedure
      .input(
        z.object({
          username: z.string(),
        }),
      )
      .query(
        async ({ input }) =>
          await Prisma.user.findFirst({ where: { username: input.username } }),
      ),
  });
}
