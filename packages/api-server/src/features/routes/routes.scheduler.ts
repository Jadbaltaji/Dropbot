import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression, SchedulerRegistry } from '@nestjs/schedule';
import { RouteList, Routes } from './routes';
import { CronJob } from 'cron';
import { WalletService } from '@/features/wallet/wallet.service';
import { convertCronExpr, getRandomIntBetween, shuffleArray } from '@/utils';
import { RoutesService } from '@/features/routes/routes.service';
import { Prisma, RouteJobExecutor } from '@/lib/prisma';

type Time = {
  seconds: string;
  minute: string;
  hour: string;
};

@Injectable()
export class RoutesScheduler {
  private readonly logger = new Logger(RoutesScheduler.name);
  constructor(
    private schedulerRegistry: SchedulerRegistry,
    private readonly walletService: WalletService,
    private readonly routesService: RoutesService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async scheduleDailyRoutes() {
    // Clears Cron Jobs of previous day.
    this.clearAllCronJobs();
    const wallets = await this.walletService.getAllWallets();
    // loops through all the wallets
    for (const wallet of wallets) {
      for (const category of RouteList) {
        // Shuffles order of routes in order to run at different order every day
        const routes = shuffleArray(category.routes);
        for (const [index, route] of routes.entries()) {
          // assigns a time window for each route as to not conflict
          const maxHour = 24 / routes.length;
          const hour = getRandomIntBetween(
            index * maxHour,
            (index + 1) * maxHour,
          ).toString();
          const zeroToSixty = getRandomIntBetween(0, 60).toString();

          const name = `${wallet.address}${category.name}${route.id}`;
          // Schedules the route for the day.
          await this.addCronJob(name, wallet.address, route.name, route.route, {
            seconds: zeroToSixty,
            minute: zeroToSixty,
            hour,
          });

          // To do: Write scheduled job to database with included daily scheduled routes
        }
      }
    }
  }

  private async addCronJob(
    cronName: string,
    walletAddress: string,
    routeName: string,
    route: Routes,
    time: Time,
  ) {
    const cronTime = `${time.seconds} ${time.minute} ${time.hour} * * *`;
    const scheduledDate = convertCronExpr(cronTime);

    const { id } = await Prisma.routeJob.create({
      data: {
        name: routeName,
        executor: RouteJobExecutor.Dropbot,
        scheduledDate,
        wallet: { connect: { address: walletAddress } },
      },
    });

    const job = new CronJob(cronTime, () =>
      this.routesService.executeRoute(walletAddress, route, id),
    );

    this.schedulerRegistry.addCronJob(cronName, job);

    job.start();

    this.logger.warn(
      `job ${cronName} added for each minute at ${time.hour}:${time.minute}:${time.seconds}!`,
    );
  }

  private clearAllCronJobs() {
    const jobs = this.schedulerRegistry.getCronJobs();

    if (jobs.size === 0) {
      this.logger.log('No cron jobs found.');
      return;
    }

    jobs.forEach((cronJob, name, map) => {
      this.schedulerRegistry.deleteCronJob(name);
      this.logger.warn(`job ${name} deleted!`);
    });
  }
}
