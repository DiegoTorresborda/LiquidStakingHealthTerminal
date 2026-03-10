export type EtherscanChainConfig = {
  networkId: string;
  chainId: string | null;
};

export const ETHERSCAN_CHAINS: Record<string, EtherscanChainConfig> = {
  monad: {
    networkId: "monad",
    chainId: "143"
  },
  sei: {
    networkId: "sei",
    chainId: null
  },
  sui: {
    networkId: "sui",
    chainId: null
  },
  aptos: {
    networkId: "aptos",
    chainId: null
  },
  berachain: {
    networkId: "berachain",
    chainId: "80094"
  },
  xdc: {
    networkId: "xdc",
    chainId: "50"
  },
  shardeum: {
    networkId: "shardeum",
    chainId: null
  },
  core: {
    networkId: "core",
    chainId: "1116"
  },
  sonic: {
    networkId: "sonic",
    chainId: "146"
  },
  mantra: {
    networkId: "mantra",
    chainId: "169"
  }
};

