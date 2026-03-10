export type DexscreenerChainConfig = {
  networkId: string;
  chainId: string | null;
  baseTokenAddress: string | null;
};

export const DEXSCREENER_CHAINS: Record<string, DexscreenerChainConfig> = {
  monad: {
    networkId: "monad",
    chainId: "monad",
    baseTokenAddress: "0x3bd359C1119dA7Da1D913D1C4D2B7c461115433A"
  },
  sei: {
    networkId: "sei",
    chainId: "sei",
    baseTokenAddress: null
  },
  sui: {
    networkId: "sui",
    chainId: "sui",
    baseTokenAddress: null
  },
  aptos: {
    networkId: "aptos",
    chainId: "aptos",
    baseTokenAddress: "0x1::aptos_coin::AptosCoin"
  },
  berachain: {
    networkId: "berachain",
    chainId: "berachain",
    baseTokenAddress: "0x6969696969696969696969696969696969696969"
  },
  xdc: {
    networkId: "xdc",
    chainId: "xdc",
    baseTokenAddress: null
  },
  shardeum: {
    networkId: "shardeum",
    chainId: "shardeum",
    baseTokenAddress: null
  },
  core: {
    networkId: "core",
    chainId: "core",
    baseTokenAddress: null
  },
  sonic: {
    networkId: "sonic",
    chainId: "sonic",
    baseTokenAddress: null
  },
  mantra: {
    networkId: "mantra",
    chainId: "mantra",
    baseTokenAddress: null
  }
};
