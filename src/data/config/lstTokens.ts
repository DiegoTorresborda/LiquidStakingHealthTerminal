export type LstTokenConfig = {
  networkId: string;
  lstSymbol: string;
  lstTokenAddress: string | null;
  dexscreenerChainId: string | null;
  etherscanTokenAddress: string | null;
};

export const LST_TOKENS: Record<string, LstTokenConfig> = {
  monad: {
    networkId: "monad",
    lstSymbol: "stMON",
    lstTokenAddress: null,
    dexscreenerChainId: "monad",
    etherscanTokenAddress: null
  },
  sei: {
    networkId: "sei",
    lstSymbol: "stSEI",
    lstTokenAddress: null,
    dexscreenerChainId: "sei",
    etherscanTokenAddress: null
  },
  sui: {
    networkId: "sui",
    lstSymbol: "stSUI",
    lstTokenAddress: null,
    dexscreenerChainId: "sui",
    etherscanTokenAddress: null
  },
  aptos: {
    networkId: "aptos",
    lstSymbol: "stAPT",
    lstTokenAddress: null,
    dexscreenerChainId: "aptos",
    etherscanTokenAddress: null
  },
  berachain: {
    networkId: "berachain",
    lstSymbol: "stBERA",
    lstTokenAddress: null,
    dexscreenerChainId: "berachain",
    etherscanTokenAddress: null
  },
  xdc: {
    networkId: "xdc",
    lstSymbol: "stXDC",
    lstTokenAddress: null,
    dexscreenerChainId: "xdc",
    etherscanTokenAddress: null
  },
  shardeum: {
    networkId: "shardeum",
    lstSymbol: "stSHM",
    lstTokenAddress: null,
    dexscreenerChainId: "shardeum",
    etherscanTokenAddress: null
  },
  core: {
    networkId: "core",
    lstSymbol: "stCORE",
    lstTokenAddress: null,
    dexscreenerChainId: "core",
    etherscanTokenAddress: null
  },
  sonic: {
    networkId: "sonic",
    lstSymbol: "stSONIC",
    lstTokenAddress: null,
    dexscreenerChainId: "sonic",
    etherscanTokenAddress: null
  },
  mantra: {
    networkId: "mantra",
    lstSymbol: "stOM",
    lstTokenAddress: null,
    dexscreenerChainId: "mantra",
    etherscanTokenAddress: null
  }
};
