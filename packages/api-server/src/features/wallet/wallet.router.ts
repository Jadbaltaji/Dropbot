import { Injectable } from '@nestjs/common';
import { z } from 'zod';
import { TrpcService } from '@/trpc/trpc.service';
import { WalletService } from '@/features/wallet/wallet.service';
import { BalanceService } from '@/features/balance/balance.service';
import { VaultService } from '@/lib/vault/vault.service';

@Injectable()
export class WalletRouter {
  constructor(
    private readonly trpc: TrpcService,
    private readonly walletService: WalletService,
    private readonly balanceService: BalanceService,
  ) {}

  router = this.trpc.router({
    withdraw: this.trpc.procedure
      .input(
        z.object({
          fromWalletAddress: z.string(),
          toWalletAddress: z.string(),
        }),
      )
      .mutation(({ input }) =>
        this.balanceService.withdraw(
          input.fromWalletAddress,
          input.toWalletAddress,
        ),
      ),
    create: this.trpc.procedure.mutation(
      async ({ ctx }) => await this.walletService.create(ctx.user.userId),
    ),
    import: this.trpc.procedure
      .input(
        z.object({
          privateKey: z.string(),
        }),
      )
      .mutation(
        async ({ input, ctx }) =>
          await this.walletService.create(ctx.user.userId, input.privateKey),
      ),
    getAllForUser: this.trpc.procedure.query(async ({ ctx }) =>
      this.walletService.getWalletsByUserId(ctx.user.userId),
    ),
  });
}
