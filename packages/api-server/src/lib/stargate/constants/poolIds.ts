export type PoolId = (typeof poolIds)[keyof typeof poolIds];
export const poolIds = {
  USDC: 1,
  USDT: 2,
  DAI: 3,
  ETH: 13,
} as const;
