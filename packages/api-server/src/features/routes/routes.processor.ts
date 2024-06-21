import {
  Processor,
  Process,
  OnGlobalQueueCompleted,
  InjectQueue,
  OnGlobalQueueProgress,
  OnGlobalQueueFailed,
} from '@nestjs/bull';
import { Job, Queue } from 'bull';
import { RouteJobOptions } from './routes';
import { NATIVE_TOKEN_ADDRESS } from '@/lib/lifi/constants';
import { Networks } from '@/features/network';
import { BigNumber } from 'ethers';
import { PoolId, poolIds } from '@/lib/stargate/constants';
import {
  calculatePercentOfBigNumber,
  delay,
  formatCamelCase,
  truncate,
} from '@/utils';
import { Logger } from '@nestjs/common';
import { WalletService } from '@/features/wallet/wallet.service';
import { LifiService } from '@/lib/lifi/lifi.service';
import { StargateService } from '@/lib/stargate/stargate.service';
import { LayerZeroService } from '@/lib/layerzero/layer-zero.service';
import { MerklyService } from '@/lib/merkly/merkly.service';
import { PancakeSwapService } from '@/lib/pancakeswap/pancake-swap.service';
import { BitcoinBridgeService } from '@/lib/bitcoinbridge/bitcoin-bridge.service';
import { AngleService } from '@/lib/angle/angle.service';
import { l2MarathonService } from '@/lib/l2marathon/l2-marathon.service';
import { ROUTES_QUEUE_NAME } from '@/features/routes/routes.service';
import { Prisma } from '@/lib/prisma';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { RouteJobCompletedEvent } from './routes.events';
import { BalanceService } from '@/features/balance/balance.service';

@Processor(ROUTES_QUEUE_NAME)
export class RoutesConsumer {
  private readonly logger = new Logger(RoutesConsumer.name);
  constructor(
    private readonly walletService: WalletService,
    private readonly lifi: LifiService,
    private readonly stargate: StargateService,
    private readonly layerZero: LayerZeroService,
    private readonly merkly: MerklyService,
    private readonly pancakeSwap: PancakeSwapService,
    private readonly bitcoinBridge: BitcoinBridgeService,
    private readonly angle: AngleService,
    private readonly l2Marathon: l2MarathonService,
    private readonly balance: BalanceService,
    private eventEmitter: EventEmitter2,
    @InjectQueue(ROUTES_QUEUE_NAME) private routesQueue: Queue,
  ) {}
  @Process()
  async transcode(job: Job<RouteJobOptions>) {
    const routes = job.data.routes;
    const walletAddress = job.data.walletAddress;

    const step = await job.progress();
    const progressedRoutes = routes.slice(step);
    for (const [i, route] of progressedRoutes.entries()) {
      const wallet = await this.walletService.get(
        walletAddress,
        route.fromChain,
      );
      if ('skip' in route && route.skip) {
        await job.progress(i);
        continue;
      }
      switch (route.service) {
        case 'l2Marathon': {
          const tokenId = await this.l2Marathon.getONFTTokenId(
            wallet,
            route.fromChain,
          );
          const { transactionHash } = await this.l2Marathon.bridgeONFT(
            wallet,
            route.fromChain,
            route.toChain,
            tokenId,
          );

          await this.layerZero.waitForMessageReceived(
            route.fromChain,
            transactionHash,
          );
          break;
        }
        case 'angle': {
          const amount = await this.balance.getFromWallet(
            wallet,
            Networks[route.fromChain].contracts.agEURToken,
          );

          const { transactionHash } = await this.angle.bridgeAgEUR(
            wallet,
            route.fromChain,
            route.toChain,
            amount,
          );

          this.logger.log(
            `agEUR: ${route.fromChain} -> ${route.toChain} >> SENT`,
          );

          await this.layerZero.waitForMessageReceived(
            route.fromChain,
            transactionHash,
          );

          break;
        }
        case 'bitcoinBridge': {
          const amount = await this.bitcoinBridge.getBalance(
            wallet,
            route.fromChain,
          );

          const { transactionHash } = await this.bitcoinBridge.bridge(
            wallet,
            route.fromChain,
            route.toChain,
            amount,
          );

          this.logger.log(
            `BTCb: ${route.fromChain} -> ${route.toChain} >> SENT`,
          );

          await this.layerZero.waitForMessageReceived(
            route.fromChain,
            transactionHash,
          );

          break;
        }
        case 'pancakeSwap': {
          const amount = await this.pancakeSwap.getBalance(
            wallet,
            route.fromChain,
          );

          const { transactionHash } = await this.pancakeSwap.bridge(
            wallet,
            route.fromChain,
            route.toChain,
            amount,
          );

          this.logger.log(
            `CAKE: ${route.fromChain} -> ${route.toChain} >> SENT`,
          );

          await this.layerZero.waitForMessageReceived(
            route.fromChain,
            transactionHash,
          );

          break;
        }
        case 'merkly': {
          switch (route.type) {
            case 'OFT': {
              const balance = await this.merkly.getOrCreateOFTBalance(
                wallet,
                route.fromChain,
              );

              const { transactionHash } = await this.merkly.bridgeOFT(
                wallet,
                route.fromChain,
                route.toChain,
                balance,
              );

              await this.layerZero.waitForMessageReceived(
                route.fromChain,
                transactionHash,
              );
              break;
            }
            case 'ONFT': {
              const tokenId = await this.merkly.getONFTTokenId(
                wallet,
                route.fromChain,
              );
              const { transactionHash } = await this.merkly.bridgeONFT(
                wallet,
                route.fromChain,
                route.toChain,
                tokenId,
              );

              await this.layerZero.waitForMessageReceived(
                route.fromChain,
                transactionHash,
              );
              break;
            }
            case 'refuel': {
              const { transactionHash } = await this.merkly.refuel(
                wallet,
                route.fromChain,
                route.toChain,
                route.amount,
              );

              this.logger.log(
                `MerklyRefuel: ${route.fromChain} -> ${route.toChain} >> ${route.amount} SENT`,
              );

              await this.layerZero.waitForMessageReceived(
                route.fromChain,
                transactionHash,
              );
              break;
            }
          }

          break;
        }
        case 'lifi': {
          const chainId = Networks[route.fromChain].chainId;
          const toChainId = route.toChain
            ? Networks[route.toChain].chainId
            : chainId;

          const balance = await this.balance.getFromWallet(
            wallet,
            route.fromTokenAddress,
          );

          if (route.fromTokenAddress !== NATIVE_TOKEN_ADDRESS) {
            await this.lifi.approveSpend(
              wallet,
              route.fromTokenAddress,
              Networks[route.fromChain].contracts.lifi,
              balance,
            );
          }

          await this.lifi.bridgeAndSwapMax(
            wallet,
            chainId,
            toChainId,
            route.fromTokenAddress,
            route.toTokenAddress,
          );

          break;
        }
        case 'stargate': {
          let balance: BigNumber;
          let assetPoolId: PoolId;
          let stargateTx: string;
          if (route.asset === 'USDC') {
            assetPoolId = poolIds.USDC;
            balance = await this.balance.getFromWallet(
              wallet,
              Networks[route.fromChain].contracts.USDCToken,
            );
            await this.lifi.approveSpend(
              wallet,
              Networks[route.fromChain].contracts.USDCToken,
              Networks[route.fromChain].contracts.stargate,
              balance,
            );
            const { transactionHash } = await this.stargate.bridgeAsset(
              wallet,
              route.fromChain,
              route.toChain,
              assetPoolId,
              balance,
            );
            stargateTx = transactionHash;
          } else if (route.asset === 'ETH') {
            assetPoolId = poolIds.ETH;

            const { transactionHash } = await this.stargate.bridgeETH(
              wallet,
              route.fromChain,
              route.toChain,
            );

            stargateTx = transactionHash;
          } else {
            throw new Error(`Pool ID not supported for stargate module yet.`);
          }

          this.logger.log(
            `${route.asset}: ${route.fromChain} -> ${route.toChain} >> SENT`,
          );

          await this.layerZero.waitForMessageReceived(
            route.fromChain,
            stargateTx,
          );

          await delay(route.delay);
          break;
        }
      }
      await job.progress(i);
    }

    this.eventEmitter.emit(
      RouteJobCompletedEvent.name,
      new RouteJobCompletedEvent(String(job.id), walletAddress),
    );

    return await job.moveToCompleted();
  }

  @OnGlobalQueueCompleted()
  async onGlobalCompleted(jobId: number, result: any) {
    const job: Job<RouteJobOptions> = await this.routesQueue.getJob(jobId);

    this.logger.log(
      `(Global) on completed: job ${job.id} -> result: Completed`,
    );
    await Prisma.routeJob.update({
      where: { id: job.id.toString() },
      data: {
        status: 'Idle',
      },
    });
  }

  async getProgressStatus(job: Job<RouteJobOptions>, progress: number) {
    const currentRoute = job.data.routes[progress];
    const progressString = `(${progress + 1}/${job.data.routes.length})`;

    if (progress + 1 === job.data.routes.length) return 'Idle';

    if (currentRoute.service === 'lifi') {
      return `Swapping: ${truncate(
        currentRoute.fromTokenAddress,
      )} -> ${truncate(currentRoute.toTokenAddress)} ${progressString}`;
    } else {
      return `${formatCamelCase(currentRoute.service)}: ${formatCamelCase(
        currentRoute.fromChain,
      )} -> ${formatCamelCase(currentRoute.toChain)} ${progressString}`;
    }
  }

  @OnGlobalQueueProgress()
  async onGlobalProgress(jobId: number, progress: number) {
    const job: Job<RouteJobOptions> = await this.routesQueue.getJob(jobId);
    const status = await this.getProgressStatus(job, progress);

    this.logger.log(
      `(Global) on progress: job ${job.id} -> progress: ${progress + 1} / ${
        job.data.routes.length
      }`,
    );
    await Prisma.routeJob.update({
      where: { id: job.id.toString() },
      data: {
        status,
        percentageComplete: progress + 1 / job.data.routes.length,
      },
    });
  }

  @OnGlobalQueueFailed()
  async onGlobalFailed(jobId: number, error: Error) {
    const job: Job<RouteJobOptions> = await this.routesQueue.getJob(jobId);
    this.logger.error(
      `(Global) Error: job ${job.id} -> FAILED: ${job.failedReason}`,
    );

    this.logger.error(error);
    await Prisma.routeJob.update({
      where: { id: job.id.toString() },
      data: {
        status: 'Idle',
      },
    });
  }
}
