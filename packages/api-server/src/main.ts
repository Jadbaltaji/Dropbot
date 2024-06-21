import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { AppConfig } from './config';
import { StrictAuthProp } from '@clerk/clerk-sdk-node';

import { TrpcRouter } from '@/trpc/trpc.router';

dotenv.config({ path: '.env' });
AppConfig.parse(process.env);

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    // eslint-disable-next-line
    interface Request extends StrictAuthProp {}
  }
}
async function bootstrap() {
  const app = await NestFactory.create(AppModule, { rawBody: true });

  app.enableCors({
    origin: 'http://localhost:3000',
  });
  const trpc = app.get(TrpcRouter);
  await trpc.applyMiddleware(app);
  await app.listen(4000);
}
bootstrap();
