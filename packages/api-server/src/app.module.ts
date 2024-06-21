import { Logger, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { BullModule } from '@nestjs/bull';
import { StargateService } from './lib/stargate/stargate.service';
import { LifiService } from './lib/lifi/lifi.service';
import { VaultService } from './lib/vault/vault.service';
import { UserService } from './features/user/user.service';
import { AuthController } from './features/auth/auth.controller';
import { l2MarathonService } from './lib/l2marathon/l2-marathon.service';
import { LayerZeroService } from './lib/layerzero/layer-zero.service';
import { ZoraService } from './lib/zora/zora.service';
import { HttpModule } from '@nestjs/axios';
import {
  ClerkExpressRequireAuth,
  ClerkExpressWithAuth,
} from '@clerk/clerk-sdk-node';

import { MerklyService } from '@/lib/merkly/merkly.service';
import { PancakeSwapService } from '@/lib/pancakeswap/pancake-swap.service';
import { BitcoinBridgeService } from '@/lib/bitcoinbridge/bitcoin-bridge.service';
import { AngleService } from '@/lib/angle/angle.service';
import {
  ROUTES_QUEUE_NAME,
  RoutesService,
} from '@/features/routes/routes.service';
import { RoutesConsumer } from '@/features/routes/routes.processor';
import { WalletService } from '@/features/wallet/wallet.service';
import { WalletRouter } from '@/features/wallet/wallet.router';
import { TrpcService } from '@/trpc/trpc.service';
import { TrpcRouter } from '@/trpc/trpc.router';
import { PlaygroundRouter } from '@/features/playground/playground.router';
import { CheckoutService } from '@/features/checkout/checkout.service';
import { CheckoutRouter } from '@/features/checkout/checkout.router';
import { ChargeController } from '@/features/checkout/checkout.controller';
import { BalanceService } from '@/features/balance/balance.service';
import { RoutesRouter } from '@/features/routes/routes.router';
import { PointsService } from '@/features/points/points.service';
import { RoutesScheduler } from '@/features/routes/routes.scheduler';
import { ScheduleModule, SchedulerRegistry } from '@nestjs/schedule';
import { UserRouter } from '@/features/user/user.router';

@Module({
  imports: [
    HttpModule,
    EventEmitterModule.forRoot(),
    ScheduleModule.forRoot(),
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
        username: process.env.REDIS_USERNAME,
        password: process.env.REDIS_PASSWORD,
        tls: {},
      },
    }),
    BullModule.registerQueue({ name: ROUTES_QUEUE_NAME }),
  ],
  controllers: [AuthController, ChargeController],
  providers: [
    UserRouter,
    SchedulerRegistry,
    RoutesScheduler,
    PointsService,
    RoutesRouter,
    TrpcService,
    CheckoutRouter,
    TrpcRouter,
    WalletRouter,
    PlaygroundRouter,
    RoutesService,
    RoutesConsumer,
    BitcoinBridgeService,
    AngleService,
    StargateService,
    l2MarathonService,
    LayerZeroService,
    PancakeSwapService,
    LifiService,
    VaultService,
    UserService,
    ZoraService,
    MerklyService,
    WalletService,
    Logger,
    CheckoutService,
    BalanceService,
  ],
})

// @harajli ClerkExpressRequireAuth or ClerkExpressWithAuth here
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer
      .apply(ClerkExpressWithAuth({}))
      .exclude('api/(.*)')
      .exclude('auth/webhooks')
      .exclude('test')
      .forRoutes('*');
  }
}
