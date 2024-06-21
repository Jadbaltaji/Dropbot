import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "@dropbot/api-server/src/trpc/trpc.router";

export const trpc = createTRPCReact<AppRouter>();
