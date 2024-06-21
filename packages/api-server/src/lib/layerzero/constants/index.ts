export const LZ_PAYMENT_ADDRESS = '0x0000000000000000000000000000000000000000';
export const LZChainIds = {
  ethereum: 101,
  bsc: 102,
  avalanche: 106,
  aptos: 108,
  layerzero_apps: 108,
  polygon: 109,
  arbitrumOne: 110,
  optimism: 111,
  fantom: 112,
  dfk: 115,
  harmony: 116,
  dexalot: 118,
  celo: 125,
  moonbeam: 126,
  fuse: 138,
  gnosis: 145,
  klaytn: 150,
  metis: 151,
  coredao: 153,
  okx: 155,
  polygon_zkevm: 158,
  canto: 159,
  zksync_era: 165,
  moonriver: 167,
  tenet: 173,
  arbitrum_nova: 175,
  meter_io: 176,
  sepolia: 161,
  kava: 177,
  linea: 183,
  base: 184,
  mantle: 181,
  loot: 197,
  meritcircle: 198,
  goerli: 10121,
  bscTestnet: 10102,
};

export type LZSupportedNetworks = keyof typeof LZChainIds;
export type LZChainId = (typeof LZChainIds)[keyof typeof LZChainIds];

export const refuelMaxValues = {
  optimism: 0.015,
  arbitrumOne: 0.015,
  base: 0.015,
  polygon: 500,
  bsc: 1,
  avalanche: 1,
};

export type LZRefuelSupportedNetworks = keyof typeof refuelMaxValues;
export type LZRefuelSupportedChainIds =
  (typeof refuelMaxValues)[keyof typeof refuelMaxValues];
