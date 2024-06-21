import { Injectable } from '@nestjs/common';
import { inferAsyncReturnType, initTRPC } from '@trpc/server';
import { createContext } from './trpc.router';

export type Context = inferAsyncReturnType<typeof createContext>;

@Injectable()
export class TrpcService {
  trpc = initTRPC.context<Context>().create();
  procedure = this.trpc.procedure;
  router = this.trpc.router;
  mergeRouters = this.trpc.mergeRouters;
}
