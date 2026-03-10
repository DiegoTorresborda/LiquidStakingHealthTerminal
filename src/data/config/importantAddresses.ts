export type ImportantAddressConfig = {
  networkId: string;
  transferMonitorAddress: string | null;
  treasuryAddress: string | null;
};

export const IMPORTANT_ADDRESSES: Record<string, ImportantAddressConfig> = {
  monad: {
    networkId: "monad",
    transferMonitorAddress: null,
    treasuryAddress: null
  },
  sei: {
    networkId: "sei",
    transferMonitorAddress: null,
    treasuryAddress: null
  },
  sui: {
    networkId: "sui",
    transferMonitorAddress: null,
    treasuryAddress: null
  },
  aptos: {
    networkId: "aptos",
    transferMonitorAddress: null,
    treasuryAddress: null
  },
  berachain: {
    networkId: "berachain",
    transferMonitorAddress: null,
    treasuryAddress: null
  },
  xdc: {
    networkId: "xdc",
    transferMonitorAddress: null,
    treasuryAddress: null
  },
  shardeum: {
    networkId: "shardeum",
    transferMonitorAddress: null,
    treasuryAddress: null
  },
  core: {
    networkId: "core",
    transferMonitorAddress: null,
    treasuryAddress: null
  },
  sonic: {
    networkId: "sonic",
    transferMonitorAddress: null,
    treasuryAddress: null
  },
  mantra: {
    networkId: "mantra",
    transferMonitorAddress: null,
    treasuryAddress: null
  }
};

