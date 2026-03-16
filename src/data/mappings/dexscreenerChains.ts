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
    chainId: "seiv2", // DexScreener uses "seiv2" for Sei EVM (not "sei")
    baseTokenAddress: "0xE30feDd158A2e3b13e9badaeABaFc5516e95e8C7" // WSEI
  },
  sui: {
    networkId: "sui",
    chainId: "sui",
    baseTokenAddress: "0x0000000000000000000000000000000000000000000000000000000000000002::sui::SUI" // Native SUI (Move format)
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
    baseTokenAddress: "0x039e2fB66102314Ce7b64Ce5Ce3E5183bc94aD38" // Wrapped Sonic (WS)
  },
  mantra: {
    networkId: "mantra",
    chainId: "mantra",
    baseTokenAddress: null
  },
  canton: {
    networkId: "canton",
    chainId: null,
    baseTokenAddress: null
  }
};
