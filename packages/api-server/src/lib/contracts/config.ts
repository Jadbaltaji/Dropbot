import { defineConfig } from '@dethcrypto/eth-sdk';
import { getRpcUrl } from '../ankr';
import { contracts } from '../../features/network';

export default defineConfig({
  contracts,
  rpc: {
    arbitrumOne: getRpcUrl('arbitrumOne'),
    polygon: getRpcUrl('polygon'),
    optimism: getRpcUrl('optimism'),
    bsc: getRpcUrl('bsc'),
    base: getRpcUrl('base'),
    avalanche: getRpcUrl('avalanche'),
  },
  etherscanURLs: {
    base: 'https://api.basescan.org/api',
    avalanche:
      'https://api.routescan.io/v2/network/mainnet/evm/43114/etherscan/api',
    // avalanche: 'https://api.snowtrace.io/api',
  },
});
