import { INestApplication, Injectable } from '@nestjs/common';
import { z } from 'zod';
import { TrpcService } from '@/trpc/trpc.service';
import * as trpcExpress from '@trpc/server/adapters/express';
import { CreateHTTPContextOptions } from '@trpc/server/dist/adapters/standalone';
import JWTDecode from 'jwt-decode';
import { UserJWT } from '@/features/auth/user.decorator';
import { WalletRouter } from '@/features/wallet/wallet.router';
import { PlaygroundRouter } from '@/features/playground/playground.router';
import { CheckoutRouter } from '@/features/checkout/checkout.router';
import { RoutesRouter } from '@/features/routes/routes.router';
import { UserRouter } from '@/features/user/user.router';

export function createContext({ req }: CreateHTTPContextOptions) {
  const accessToken = req?.headers?.authorization?.split(' ')?.[1];

  const user = JWTDecode(accessToken) as UserJWT;
  return { user };
}

@Injectable()
export class TrpcRouter {
  constructor(
    private readonly trpc: TrpcService,
    private readonly wallet: WalletRouter,
    private readonly playground: PlaygroundRouter,
    private readonly checkout: CheckoutRouter,
    private readonly routes: RoutesRouter,
    private readonly user: UserRouter,
  ) {}

  appRouter = this.trpc.router({
    wallet: this.wallet.router,
    playground: this.playground.router,
    checkout: this.checkout.router,
    routes: this.routes.router,
    user: this.user.router,
  });

  async applyMiddleware(app: INestApplication) {
    app.use(
      `/trpc`,
      trpcExpress.createExpressMiddleware({
        router: this.appRouter,
        createContext,
      }),
    );
  }
}

export type AppRouter = TrpcRouter[`appRouter`];
