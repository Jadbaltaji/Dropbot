/* eslint-disable @typescript-eslint/no-namespace,@typescript-eslint/no-empty-interface */

import { z } from 'zod';

export const AppConfig = z.object({
  /**
   * Vault
   */
  VAULT_URL: z.string(),
  VAULT_ROLE_ID: z.string(),
  VAULT_SECRET_ID: z.string(),
  /**
   * Clerk
   */
  CLERK_WEBHOOK_SECRET: z.string(),
  /**
   * SCAN API KEYS
   */
  BASE_SCAN_API_KEY: z.string(),
  ETHER_SCAN_API_KEY: z.string(),
  AMBER_DATA_API_KEY: z.string(),
  /**
   * Redis
   */
  REDIS_HOST: z.string(),
  REDIS_PORT: z.coerce.number(),
  REDIS_USERNAME: z.string(),
  REDIS_PASSWORD: z.string(),
  /**
   * Coinbase Commerce
   * */
  COINBASE_COMMERCE_SECRET: z.string(),
  COINBASE_COMMERCE_API_KEY: z.string(),
  /**
   * Node Environment
   * */
  NODE_ENV: z.enum(['production', 'dev']),
});

declare global {
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof AppConfig> {}
  }
}
