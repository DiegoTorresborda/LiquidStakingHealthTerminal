export type ProtocolContractConfig = {
  networkId: string;
  primaryContractAddress: string | null;
  logsFromBlock: string | null;
  mintEventTopic0: string | null;
  redeemEventTopic0: string | null;
};

export const PROTOCOL_CONTRACTS: Record<string, ProtocolContractConfig> = {
  monad: {
    networkId: "monad",
    primaryContractAddress: null,
    logsFromBlock: null,
    mintEventTopic0: null,
    redeemEventTopic0: null
  },
  sei: {
    networkId: "sei",
    primaryContractAddress: null,
    logsFromBlock: null,
    mintEventTopic0: null,
    redeemEventTopic0: null
  },
  sui: {
    networkId: "sui",
    primaryContractAddress: null,
    logsFromBlock: null,
    mintEventTopic0: null,
    redeemEventTopic0: null
  },
  aptos: {
    networkId: "aptos",
    primaryContractAddress: null,
    logsFromBlock: null,
    mintEventTopic0: null,
    redeemEventTopic0: null
  },
  berachain: {
    networkId: "berachain",
    primaryContractAddress: null,
    logsFromBlock: null,
    mintEventTopic0: null,
    redeemEventTopic0: null
  },
  xdc: {
    networkId: "xdc",
    primaryContractAddress: null,
    logsFromBlock: null,
    mintEventTopic0: null,
    redeemEventTopic0: null
  },
  shardeum: {
    networkId: "shardeum",
    primaryContractAddress: null,
    logsFromBlock: null,
    mintEventTopic0: null,
    redeemEventTopic0: null
  },
  core: {
    networkId: "core",
    primaryContractAddress: null,
    logsFromBlock: null,
    mintEventTopic0: null,
    redeemEventTopic0: null
  },
  sonic: {
    networkId: "sonic",
    primaryContractAddress: null,
    logsFromBlock: null,
    mintEventTopic0: null,
    redeemEventTopic0: null
  },
  mantra: {
    networkId: "mantra",
    primaryContractAddress: null,
    logsFromBlock: null,
    mintEventTopic0: null,
    redeemEventTopic0: null
  },
  canton: {
    networkId: "canton",
    primaryContractAddress: null,
    logsFromBlock: null,
    mintEventTopic0: null,
    redeemEventTopic0: null
  }
};

