import { Injectable } from '@nestjs/common';
import { z } from 'zod';
import { TrpcService } from '@/trpc/trpc.service';
import { Prisma, PackageType } from '@/lib/prisma';

import { CheckoutService } from '@/features/checkout/checkout.service';

@Injectable()
export class CheckoutRouter {
  constructor(
    private readonly trpc: TrpcService,
    private readonly checkoutService: CheckoutService,
  ) {}

  router = this.trpc.router({
    createCharge: this.trpc.procedure
      .input(z.object({ packageId: z.string() }))
      .mutation(({ ctx, input }) =>
        this.checkoutService.createCharge(ctx.user.userId, input.packageId),
      ),
    createPackage: this.trpc.procedure
      .input(
        z.object({
          name: z.string(),
          description: z.string(),
          price: z.number(),
          walletCount: z.number(),
          type: z.nativeEnum(PackageType),
        }),
      )
      .mutation(({ input }) =>
        Prisma.package.create({
          data: {
            name: input.name,
            description: input.description,
            price: input.price,
            walletCount: input.walletCount,
            type: input.type,
          },
        }),
      ),
  });
}
