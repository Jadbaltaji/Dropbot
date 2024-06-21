import { ChainId } from '@lifi/sdk';
import { LZChainIds } from '../../lib/layerzero';

export type Network = keyof typeof Networks;

export type Contract = {
  [K in Network]: keyof (typeof Networks)[K]['contracts'];
}[keyof typeof Networks];

export type AvailableNetwork<T extends Contract> = {
  [K in Network]: T extends keyof (typeof Networks)[K]['contracts'] ? K : never;
}[keyof typeof Networks];

export type MainnetNetwork = {
  [K in Network]: (typeof Networks)[K] extends { mainnet?: true } ? K : never;
}[keyof typeof Networks];

type TestnetNetwork = Exclude<Network, MainnetNetwork>;

export const Networks = {
  mainnet: {
    chainId: ChainId.ETH,
    LZChainId: LZChainIds.ethereum,
    mainnet: true,
    contracts: {
      stargate: '0x8731d54E9D02c286767d56ac03e8037C07e01e98',
      stargateETH: '0x150f94B44927F078737562f0fcF3C95c01Cc2376',
      l2Marathon: '0x2FF6a890249bcc6ab071c17a66Db4C327154604C',
      layerZero: '0x66A71Dcef29A0fFBDBE3c6a460a3B5BC225Cd675',
      testnetBridge: '0x0A9f824C05A74F577A536A8A0c673183a872Dff4',
      pancakeSwapOFT: '0x152649eA73beAb28c5b49B26eb48f7EAD6d4c898',
      BTCbOFT: '0x2297aEbD383787A160DD0d9F71508148769342E3',
      agEURToken: '0x1a7e4e63778B4f12a199C062f3eFdD288afCBce8',
      agEURBridge: '0x4Fa745FCCC04555F2AFA8874cd23961636CdF982',
      lifi: '0x1231DEB6f5749EF6cE6943a275A1D3E7486F4EaE',
    },
  },
  arbitrumOne: {
    chainId: ChainId.ARB,
    LZChainId: LZChainIds.arbitrumOne,
    LZRefuelMaxValue: 0.015,
    mainnet: true,
    contracts: {
      stargate: '0x53Bf833A5d6c4ddA888F69c22C88C9f356a41614',
      stargateETH: '0xbf22f0f184bCcbeA268dF387a49fF5238dD23E40',
      l2Marathon: '0xb7c9e72f0a2f338fD269F548920dD896E5DBF3E3',
      layerZero: '0x3c2269811836af69497E5F486A85D7316753cf62',
      merklyONFT: '0xAa58e77238f0E4A565343a89A79b4aDDD744d649',
      merklyOFT: '0x8a555e4Fc287650f5E8CA1778A35dd44e893d6Aa',
      merklyRefuel: '0x4Ae8CEBcCD7027820ba83188DFD73CCAD0A92806',
      testnetBridge: '0x0A9f824C05A74F577A536A8A0c673183a872Dff4',
      pancakeSwapOFT: '0x1b896893dfc86bb67Cf57767298b9073D2c1bA2c',
      BTCbOFT: '0x2297aEbD383787A160DD0d9F71508148769342E3',
      agEURToken: '0xFA5Ed56A203466CbBC2430a43c66b9D8723528E7',
      agEURBridge: '0x16cd38b1B54E7abf307Cb2697E2D9321e843d5AA',
      USDCToken: '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8',
      lifi: '0x1231DEB6f5749EF6cE6943a275A1D3E7486F4EaE',
    },
  },
  polygon: {
    chainId: ChainId.POL,
    LZChainId: LZChainIds.polygon,
    LZRefuelMaxValue: 500,
    mainnet: true,
    contracts: {
      stargate: '0x45A01E4e04F14f7A4a6702c74187c5F6222033cd',
      l2Marathon: '0xbd5F8134E78f3fD4EfC65b1DB552e8B621F1675C',
      layerZero: '0x3c2269811836af69497E5F486A85D7316753cf62',
      merklyONFT: '0xa184998eC58dc1dA77a1F9f1e361541257A50CF4',
      merklyRefuel: '0x0e1f20075c90ab31fc2dd91e536e6990262cf76d',
      merklyOFT: '0x70ea00aB512d13dAc5001C968F8D2263d179e2D2',
      BTCbOFT: '0x2297aEbD383787A160DD0d9F71508148769342E3',
      agEURToken: '0xE0B52e49357Fd4DAf2c15e02058DCE6BC0057db4',
      agEURBridge: '0x0c1EBBb61374dA1a8C57cB6681bF27178360d36F',
      lifi: '0x1231DEB6f5749EF6cE6943a275A1D3E7486F4EaE',
    },
  },
  optimism: {
    chainId: ChainId.OPT,
    LZChainId: LZChainIds.optimism,
    LZRefuelMaxValue: 0.015,
    mainnet: true,
    contracts: {
      stargate: '0xB0D502E938ed5f4df2E681fE6E419ff29631d62b',
      stargateETH: '0xB49c4e680174E331CB0A7fF3Ab58afC9738d5F8b',
      l2Marathon: '0x9e66EBa102B77Fc75cD87b5e60141b85573BC8e8',
      layerZero: '0x3c2269811836af69497E5F486A85D7316753cf62',
      merklyONFT: '0xa2C203d7EF78ed80810da8404090f926d67Cd892',
      merklyOFT: '0x20279b6d57Ba6D3eF852f34800e43e39d46d6487',
      merklyRefuel: '0xd7ba4057f43a7c4d4a34634b2a3151a60bf78f0d',
      testnetBridge: '0x0A9f824C05A74F577A536A8A0c673183a872Dff4',
      BTCbOFT: '0x2297aEbD383787A160DD0d9F71508148769342E3',
      agEURToken: '0x9485aca5bbBE1667AD97c7fE7C4531a624C8b1ED',
      agEURBridge: '0x840b25c87B626a259CA5AC32124fA752F0230a72',
      USDCToken: '0x7F5c764cBc14f9669B88837ca1490cCa17c31607',
      lifi: '0x1231DEB6f5749EF6cE6943a275A1D3E7486F4EaE',
    },
  },
  bsc: {
    chainId: ChainId.BSC,
    LZChainId: LZChainIds.bsc,
    LZRefuelMaxValue: 1,
    mainnet: true,
    contracts: {
      stargate: '0x4a364f8c717cAAD9A442737Eb7b8A55cc6cf18D8',
      l2Marathon: '0x9e66EBa102B77Fc75cD87b5e60141b85573BC8e8',
      layerZero: '0x3c2269811836af69497e5f486a85d7316753cf62',
      merklyONFT: '0xFDc9018aF0E37AbF89233554C937eB5068127080',
      merklyOFT: '0xe341f30Ea040bF3691aA069B8c5c213F72676421',
      merklyRefuel: '0xef1eae0457e8d56a003d781569489bc5466e574b',
      pancakeSwapOFTProxy: '0xb274202daBA6AE180c665B4fbE59857b7c3a8091',
      pancakeSwapToken: '0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82',
      BTCbOFT: '0x2297aEbD383787A160DD0d9F71508148769342E3',
      agEURToken: '0x12f31B73D812C6Bb0d735a218c086d44D5fe5f89',
      agEURBridge: '0xe9f183FC656656f1F17af1F2b0dF79b8fF9ad8eD',
      lifi: '0x1231DEB6f5749EF6cE6943a275A1D3E7486F4EaE',
    },
  },
  base: {
    chainId: ChainId.BAS,
    LZChainId: LZChainIds.base,
    LZRefuelMaxValue: 0.015,
    mainnet: true,
    contracts: {
      omniChainAdventures2: '0x061A883E8c2FEFFB4F3eA42046ABD4bE88E1333f',
      stargate: '0x45f1A95A4D3f3836523F5c83673c797f4d4d263B',
      stargateETH: '0x50B6EbC2103BFEc165949CC946d739d5650d7ae4',
      layerZero: '0xb6319cC6c8c27A8F5dAF0dD3DF91EA35C4720dd7',
      l2Marathon: '0x29D24B2AC84E51F842fb8c1533CD972eb83c65Ce',
      merklyONFT: '0xF882c982a95F4D3e8187eFE12713835406d11840',
      merklyOFT: '0x5f45Cd59BA7F2f6bcD935663F68Ee1dEbE3B8a10',
      merklyRefuel: '0x6bf98654205b1ac38645880ae20fc00b0bb9ffca',
      pancakeSwapOFT: '0x3055913c90Fcc1A6CE9a358911721eEb942013A1',
      USDCToken: '0xd9aAEc86B65D86f6A7B5B1b0c42FFA531710b6CA',
      lifi: '0x1231DEB6f5749EF6cE6943a275A1D3E7486F4EaE',
    },
  },
  avalanche: {
    chainId: ChainId.AVA,
    LZChainId: LZChainIds.avalanche,
    LZRefuelMaxValue: 1,
    mainnet: true,
    contracts: {
      stargate: '0x45A01E4e04F14f7A4a6702c74187c5F6222033cd',
      layerZero: '0x3c2269811836af69497E5F486A85D7316753cf62',
      l2Marathon: '0x9e66EBa102B77Fc75cD87b5e60141b85573BC8e8',
      merklyONFT: '0xE030543b943bdCd6559711Ec8d344389C66e1D56',
      merklyRefuel: '0x5c9bbe51f7f19f8c77df7a3ada35ab434aaa86c5',
      BTCbToken: '0x152b9d0FdC40C096757F570A51E494bd4b943E50',
      BTCbOFTProxy: '0x2297aEbD383787A160DD0d9F71508148769342E3',
      agEURToken: '0xAEC8318a9a59bAEb39861d10ff6C7f7bf1F96C57',
      agEURBridge: '0x14C00080F97B9069ae3B4Eb506ee8a633f8F5434',
      lifi: '0x1231DEB6f5749EF6cE6943a275A1D3E7486F4EaE',
    },
  },
  goerli: {
    chainId: ChainId.GOR,
    LZChainId: LZChainIds.goerli,
    contracts: {
      stargate: '0x7612ae2a34e5a363e137de748801fb4c86499152',
      layerZero: '0xbfD2135BFfbb0B5378b56643c2Df8a87552Bfa23',
      merklyONFT: '0x885ef5813E46ab6EFb10567b50b77aAAD4d258ce',
      merklyOFT: '0x9F40916d0DFb2F8f5FB63D8f76826d09041f2EAE',
    },
  },
  bscTestnet: {
    chainId: ChainId.BSCT,
    LZChainId: LZChainIds.bscTestnet,
    contracts: {
      stargate: '0xbB0f1be1E9CE9cB27EA5b0c3a85B7cc3381d8176',
      layerZero: '0x6Fcb97553D41516Cb228ac03FdC8B9a0a9df04A1',
    },
  },
} as const;

export function getNetworkKeyByChainId(chainId: number): MainnetNetwork | null {
  for (const networkKey in Networks) {
    if (Networks[networkKey].chainId === chainId) {
      return networkKey as MainnetNetwork;
    }
  }
  return null; // If no matching chainId is found
}

export const SupportedNetworks = [
  'avalanche',
  'base',
  'bsc',
  'optimism',
  'arbitrumOne',
] as const;

export const NetworkNames = Object.keys(Networks) as (keyof typeof Networks)[];
export const MainnetNetworkNames = NetworkNames.filter((net) => {
  const network = Networks[net];
  return 'mainnet' in network && network.mainnet;
}) as MainnetNetwork[];

export const nonEthNetworkNames = ['polygon', 'bsc', 'avalanche'] as const;

export const contracts = Object.entries(Networks).reduce(
  (obj, [key, { contracts }]) => ({
    ...obj,
    [key]: contracts,
  }),
  {},
);
