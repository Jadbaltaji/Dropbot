import { NATIVE_TOKEN_ADDRESS } from '../../lib/lifi/constants';
import { Networks, AvailableNetwork } from '../../features/network';
import { Network } from '../../lib/ankr';

export type Routes = Readonly<Array<Route>>;

export type RouteJobOptions = {
  walletAddress: string;
  routes: Routes;
};

export type Route =
  | LifiRoute
  | StargateUSDCRoute
  | StargateETHRoute
  | MerklyOFTRoute
  | MerklyONFTRoute
  | MerklyRefuelRoute
  | PancakeSwapRoute
  | BitcoinBridgeRoute
  | AngleRoute
  | L2MarathonRoute;

type RouteOptions = {
  fromChain: Network;
  function?: string;
  skip?: boolean;
  delay?: number;
};

type LifiRoute = {
  service: 'lifi';
  fromChain: AvailableNetwork<'lifi'>;
  toChain?: AvailableNetwork<'lifi'>;
  percentAmount?: number;
  fromTokenAddress: string;
  toTokenAddress: string;
} & RouteOptions;

type StargateUSDCRoute = {
  fromChain: AvailableNetwork<'USDCToken'>;
  service: 'stargate';
  asset: 'USDC';
  toChain: AvailableNetwork<'USDCToken'>;
} & RouteOptions;

type StargateETHRoute = {
  fromChain: AvailableNetwork<'stargateETH'>;
  service: 'stargate';
  asset: 'ETH';
  toChain: AvailableNetwork<'stargateETH'>;
  percentAmount?: number;
} & RouteOptions;

type MerklyOFTRoute = {
  service: 'merkly';
  type: 'OFT';
  fromChain: AvailableNetwork<'merklyOFT'>;
  toChain: AvailableNetwork<'merklyOFT'>;
} & RouteOptions;

type MerklyONFTRoute = {
  service: 'merkly';
  type: 'ONFT';
  fromChain: AvailableNetwork<'merklyONFT'>;
  toChain: AvailableNetwork<'merklyONFT'>;
} & RouteOptions;

type MerklyRefuelRoute = {
  service: 'merkly';
  type: 'refuel';
  fromChain: AvailableNetwork<'merklyRefuel'>;
  toChain: AvailableNetwork<'merklyRefuel'>;
  amount: string;
} & RouteOptions;

type PancakeSwapRoute = {
  service: 'pancakeSwap';
  fromChain: AvailableNetwork<
    'pancakeSwapOFT' | 'pancakeSwapToken' | 'pancakeSwapOFTProxy'
  >;
  toChain: AvailableNetwork<
    'pancakeSwapOFT' | 'pancakeSwapToken' | 'pancakeSwapOFTProxy'
  >;
} & RouteOptions;

type BitcoinBridgeRoute = {
  service: 'bitcoinBridge';
  fromChain: AvailableNetwork<'BTCbOFT' | 'BTCbToken' | 'BTCbOFTProxy'>;
  toChain: AvailableNetwork<'BTCbOFT' | 'BTCbToken' | 'BTCbOFTProxy'>;
} & RouteOptions;

type AngleRoute = {
  service: 'angle';
  fromChain: AvailableNetwork<'agEURToken'>;
  toChain: AvailableNetwork<'agEURToken'>;
} & RouteOptions;

type L2MarathonRoute = {
  service: 'l2Marathon';
  fromChain: AvailableNetwork<'l2Marathon'>;
  toChain: AvailableNetwork<'l2Marathon'>;
} & RouteOptions;

export const routes6: Routes = [
  {
    service: 'l2Marathon',
    fromChain: 'arbitrumOne',
    toChain: 'optimism',
  },
  {
    service: 'merkly',
    type: 'refuel',
    fromChain: 'arbitrumOne',
    toChain: 'optimism',
    amount: '0.01',
  },
  {
    service: 'merkly',
    type: 'OFT',
    fromChain: 'arbitrumOne',
    toChain: 'optimism',
  },
  {
    service: 'merkly',
    type: 'ONFT',
    fromChain: 'arbitrumOne',
    toChain: 'optimism',
  },
] as const;

export const lifiRoute: Routes = [
  {
    service: 'lifi',
    fromChain: 'arbitrumOne',
    fromTokenAddress: NATIVE_TOKEN_ADDRESS,
    toTokenAddress: Networks.arbitrumOne.contracts.agEURToken,
  },
  {
    service: 'lifi',
    fromChain: 'arbitrumOne',
    fromTokenAddress: Networks.arbitrumOne.contracts.agEURToken,
    toTokenAddress: NATIVE_TOKEN_ADDRESS,
  },
];

export const angleRoute: Routes = [
  {
    service: 'lifi',
    fromChain: 'arbitrumOne',
    fromTokenAddress: NATIVE_TOKEN_ADDRESS,
    toTokenAddress: Networks.arbitrumOne.contracts.agEURToken,
  },
  {
    service: 'angle',
    fromChain: 'arbitrumOne',
    toChain: 'avalanche',
  },
  {
    service: 'angle',
    fromChain: 'avalanche',
    toChain: 'optimism',
  },
  {
    service: 'angle',
    fromChain: 'optimism',
    toChain: 'arbitrumOne',
  },
  {
    service: 'lifi',
    fromChain: 'arbitrumOne',
    percentAmount: 1,
    fromTokenAddress: Networks.arbitrumOne.contracts.agEURToken,
    toTokenAddress: NATIVE_TOKEN_ADDRESS,
  },
] as const;

// Todo add bridge and swap integration for lifi
export const bitcoinBridgeRoute: Routes = [
  {
    service: 'lifi',
    fromChain: 'arbitrumOne',
    toChain: 'avalanche',
    fromTokenAddress: NATIVE_TOKEN_ADDRESS,
    toTokenAddress: Networks.avalanche.contracts.BTCbToken,
  },
  {
    service: 'bitcoinBridge',
    fromChain: 'avalanche',
    toChain: 'arbitrumOne',
  },
  {
    service: 'bitcoinBridge',
    fromChain: 'arbitrumOne',
    toChain: 'optimism',
  },
  {
    service: 'bitcoinBridge',
    fromChain: 'optimism',
    toChain: 'avalanche',
  },
  {
    service: 'lifi',
    fromChain: 'avalanche',
    toChain: 'arbitrumOne',
    fromTokenAddress: Networks.avalanche.contracts.BTCbToken,
    toTokenAddress: NATIVE_TOKEN_ADDRESS,
  },
];

export const pancakeSwapRoute: Routes = [
  {
    service: 'lifi',
    fromChain: 'arbitrumOne',
    toChain: 'bsc',
    fromTokenAddress: NATIVE_TOKEN_ADDRESS,
    toTokenAddress: Networks.bsc.contracts.pancakeSwapToken,
  },
  {
    service: 'pancakeSwap',
    fromChain: 'bsc',
    toChain: 'base',
  },
  {
    service: 'pancakeSwap',
    fromChain: 'base',
    toChain: 'arbitrumOne',
  },
  {
    service: 'pancakeSwap',
    fromChain: 'arbitrumOne',
    toChain: 'bsc',
  },
  {
    service: 'lifi',
    fromChain: 'bsc',
    toChain: 'arbitrumOne',
    fromTokenAddress: Networks.bsc.contracts.pancakeSwapToken,
    toTokenAddress: NATIVE_TOKEN_ADDRESS,
  },
];

export const stargateEthRoute: Routes = [
  {
    service: 'stargate',
    asset: 'ETH',
    fromChain: 'arbitrumOne',
    toChain: 'optimism',
  },
  {
    service: 'stargate',
    asset: 'ETH',
    fromChain: 'optimism',
    toChain: 'base',
  },
  {
    service: 'stargate',
    asset: 'ETH',
    fromChain: 'base',
    toChain: 'arbitrumOne',
  },
];

export const stargateUsdcRoute: Routes = [
  {
    service: 'lifi',
    fromChain: 'arbitrumOne',
    fromTokenAddress: NATIVE_TOKEN_ADDRESS,
    toTokenAddress: Networks.arbitrumOne.contracts.USDCToken,
  },
  {
    service: 'stargate',
    asset: 'USDC',
    fromChain: 'arbitrumOne',
    toChain: 'optimism',
  },
  {
    service: 'stargate',
    asset: 'USDC',
    fromChain: 'optimism',
    toChain: 'base',
  },
  {
    service: 'stargate',
    asset: 'USDC',
    fromChain: 'base',
    toChain: 'arbitrumOne',
  },
  {
    service: 'lifi',
    fromChain: 'arbitrumOne',
    fromTokenAddress: Networks.arbitrumOne.contracts.USDCToken,
    toTokenAddress: NATIVE_TOKEN_ADDRESS,
  },
] as const;

export const RouteList = [
  {
    name: 'LayerZero',
    imageLink: 'https://i.imgur.com/dGd8Ujy.png',
    routes: [
      {
        id: 1,
        name: 'Stargate ETH',
        description:
          'ETH on Arbitrum > Bridge ETH to Optimism > Bridge ETH to Base > Bridge ETH to Arbitrum.',
        route: stargateEthRoute,
        imageLink: 'https://i.imgur.com/X84Itve.png',
      },
      {
        id: 2,
        name: 'Stargate USDC',
        route: stargateUsdcRoute,
        description:
          'Swap 95% of ETH to USDC on Arbitrum > Bridge USDC to Optimism > Bridge USDC to Base > Bridge USDC back to Arbitrum.',
        imageLink: 'https://i.imgur.com/X84Itve.png',
      },
      {
        id: 3,
        name: 'Pancake Swap',
        route: pancakeSwapRoute,
        description:
          'Swap 95% of Arbitrum ETH to BSC CAKE > Bridge CAKE to Base > Bridge CAKE to Arbitrum > Bridge CAKE to BNB > Swap and bridge back to Arbitrum ETH.',
        imageLink: 'https://i.imgur.com/zFrbHNx.png',
      },
      {
        id: 4,
        name: 'Bitcoin Bridge',
        route: bitcoinBridgeRoute,
        description:
          'Swap 95% of Arbitrum ETH to Avalanche BTC.b > Bridge BTC.b to Arbitrum > Bridge BTC.b to Optimism > Bridge BTC.b back to Avalanche > Swap and bridge back to Arbitrum ETH.',
        imageLink: 'https://i.imgur.com/vjXCcLB.png',
      },
      {
        id: 5,
        name: 'Angle Route',
        route: angleRoute,
        description:
          'Swap 95% of Arbitrum ETH to agEUR > Bridge agEUR to Avalanche > Bridge agEUR to Optimism > Bridge agEUR to Arbitrum > Swap back to Arbitrum ETH.',
        imageLink: 'https://i.imgur.com/x6i1WTH.png',
      },
    ],
  },
  {
    name: 'Lifi',
    imageLink: 'https://i.imgur.com/KpgJgza.png',
    daily: false,
    routes: [
      {
        id: 1,
        name: 'Lifi Route 1',
        description: 'Swaps to agEUR and swaps back.',
        route: lifiRoute,
        imageLink: 'https://i.imgur.com/KpgJgza.png',
      },
    ],
  },
];
