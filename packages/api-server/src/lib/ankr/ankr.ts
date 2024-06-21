import { AnkrProvider } from '@ankr.com/ankr.js';
import { ethers } from 'ethers';

export const API_KEY =
  '0b198e3e1905ad7620d036c0e1d5a5c455071c1a848d24ac673b4d2197f5c56b';
const RPC_URL = 'https://rpc.ankr.com/';

export const multichainProvider = new AnkrProvider(
  `${RPC_URL}multichain/${API_KEY}`,
);

const endpointChains = {
  ethereum: 'eth',
  mainnet: 'eth',
  bsc: 'bsc',
  avalanche: 'avalanche',
  aptos: 'aptos',
  polygon: 'polygon',
  arbitrumOne: 'arbitrum',
  optimism: 'optimism',
  fantom: 'fantom',
  harmony: 'harmony',
  celo: 'celo',
  moonbeam: 'moonbeam',
  zksync_era: 'zksync_era',
  arbitrum_nova: 'arbitrumnova',
  base: 'base',
  mantle: 'mantle',
};

export type Network = keyof typeof endpointChains;

export const getRpcUrl = (network: Network) =>
  `${RPC_URL}${endpointChains[network]}/${API_KEY}`;

export const getProvider = (network: Network) =>
  new ethers.providers.JsonRpcProvider(getRpcUrl(network));
