import {
  getGoerliSdk,
  getArbitrumOneSdk,
  getBscSdk,
  getBscTestnetSdk,
  getMainnetSdk,
  getOptimismSdk,
  getPolygonSdk,
  getBaseSdk,
  getAvalancheSdk,
} from '.dethcrypto/eth-sdk-client';

export type Networks = keyof typeof sdk;
export type MainnetNetworks = Exclude<
  keyof typeof sdk,
  'bscTestnet' | 'goerli'
>;
export const sdk = {
  mainnet: getMainnetSdk,
  goerli: getGoerliSdk,
  arbitrumOne: getArbitrumOneSdk,
  bsc: getBscSdk,
  bscTestnet: getBscTestnetSdk,
  optimism: getOptimismSdk,
  polygon: getPolygonSdk,
  base: getBaseSdk,
  avalanche: getAvalancheSdk,
} as const;

export * from './config';
