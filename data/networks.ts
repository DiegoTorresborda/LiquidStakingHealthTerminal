import coingeckoBasics from "./coingecko-basics.json";
import overviewOverrides from "./overview-overrides.json";
import generatedOverview from "./networks.generated.json";

export type NetworkCategory =
  | "High-performance EVM L1"
  | "High-throughput trading L1"
  | "Object-centric L1"
  | "Move-based L1"
  | "DeFi-native L1"
  | "Enterprise-focused L1"
  | "Dynamic sharded L1"
  | "Bitcoin-aligned PoS"
  | "Gaming-focused L1"
  | "RWA-focused L1";

export type NetworkStatus =
  | "High Potential"
  | "Emerging"
  | "Mature"
  | "Underdeveloped"
  | "Early Opportunity"
  | "Growing"
  | "Watchlist"
  | "Strong LP Fit"
  | "Weak DeFi Base";

export type Network = {
  networkId: string;
  network: string;
  token: string;
  category: NetworkCategory;
  marketCapUsd: number;
  fdvUsd: number;
  circulatingSupply: number;
  circulatingSupplyPct: number;
  priceUsd?: number | null;
  volume24hUsd?: number | null;
  stakingRatioPct: number;
  stakingApyPct: number;
  stakedValueUsd: number;
  stakerAddresses: number;
  validatorCount: number;
  globalLstHealthScore: number;
  lstProtocols: number;
  largestLst: string;
  lstTvlUsd: number;
  lstPenetrationPct: number;
  defiTvlUsd: number;
  tvlToMcapPct: number;
  stablecoinLiquidityUsd: number;
  lendingPresence: boolean;
  lstCollateralEnabled: boolean;
  opportunityScore: number;
  mainBottleneck: string;
  mainOpportunity: string;
  asOf?: string;
  sourceRefs?: string[];
  quality?: "observed" | "inferred" | "simulated";
  confidence?: "high" | "medium" | "low";
  status: NetworkStatus;
};

const baseNetworks: Network[] = [
  {
    networkId: "monad",
    network: "Monad",
    token: "MON",
    category: "High-performance EVM L1",
    marketCapUsd: 4200000000,
    fdvUsd: 9500000000,
    circulatingSupply: 420000000,
    circulatingSupplyPct: 44,
    stakingRatioPct: 48,
    stakingApyPct: 8.1,
    stakedValueUsd: 2016000000,
    stakerAddresses: 142000,
    validatorCount: 132,
    globalLstHealthScore: 71,
    lstProtocols: 2,
    largestLst: "stMON",
    lstTvlUsd: 380000000,
    lstPenetrationPct: 18,
    defiTvlUsd: 610000000,
    tvlToMcapPct: 14,
    stablecoinLiquidityUsd: 210000000,
    lendingPresence: true,
    lstCollateralEnabled: true,
    opportunityScore: 86,
    mainBottleneck: "Stablecoin exit liquidity",
    mainOpportunity: "Expand LST collateral integrations",
    status: "High Potential"
  },
  {
    networkId: "sei",
    network: "Sei",
    token: "SEI",
    category: "High-throughput trading L1",
    marketCapUsd: 3300000000,
    fdvUsd: 5600000000,
    circulatingSupply: 3900000000,
    circulatingSupplyPct: 59,
    stakingRatioPct: 52,
    stakingApyPct: 7.4,
    stakedValueUsd: 1716000000,
    stakerAddresses: 185000,
    validatorCount: 85,
    globalLstHealthScore: 66,
    lstProtocols: 2,
    largestLst: "stSEI",
    lstTvlUsd: 210000000,
    lstPenetrationPct: 12,
    defiTvlUsd: 450000000,
    tvlToMcapPct: 13,
    stablecoinLiquidityUsd: 140000000,
    lendingPresence: true,
    lstCollateralEnabled: false,
    opportunityScore: 82,
    mainBottleneck: "Weak LST DeFi integration",
    mainOpportunity: "Enable lending collateral usage",
    status: "Emerging"
  },
  {
    networkId: "sui",
    network: "Sui",
    token: "SUI",
    category: "Object-centric L1",
    marketCapUsd: 7200000000,
    fdvUsd: 15000000000,
    circulatingSupply: 2800000000,
    circulatingSupplyPct: 48,
    stakingRatioPct: 62,
    stakingApyPct: 5.9,
    stakedValueUsd: 4460000000,
    stakerAddresses: 210000,
    validatorCount: 107,
    globalLstHealthScore: 74,
    lstProtocols: 3,
    largestLst: "stSUI",
    lstTvlUsd: 950000000,
    lstPenetrationPct: 21,
    defiTvlUsd: 980000000,
    tvlToMcapPct: 14,
    stablecoinLiquidityUsd: 420000000,
    lendingPresence: true,
    lstCollateralEnabled: true,
    opportunityScore: 68,
    mainBottleneck: "LST fragmentation",
    mainOpportunity: "Consolidate liquidity across LSTs",
    status: "Mature"
  },
  {
    networkId: "aptos",
    network: "Aptos",
    token: "APT",
    category: "Move-based L1",
    marketCapUsd: 5600000000,
    fdvUsd: 10400000000,
    circulatingSupply: 340000000,
    circulatingSupplyPct: 54,
    stakingRatioPct: 67,
    stakingApyPct: 6.2,
    stakedValueUsd: 3752000000,
    stakerAddresses: 165000,
    validatorCount: 111,
    globalLstHealthScore: 70,
    lstProtocols: 3,
    largestLst: "stAPT",
    lstTvlUsd: 710000000,
    lstPenetrationPct: 19,
    defiTvlUsd: 870000000,
    tvlToMcapPct: 15,
    stablecoinLiquidityUsd: 350000000,
    lendingPresence: true,
    lstCollateralEnabled: true,
    opportunityScore: 64,
    mainBottleneck: "Limited LST liquidity depth",
    mainOpportunity: "Expand LST market-making infrastructure",
    status: "Mature"
  },
  {
    networkId: "berachain",
    network: "Berachain",
    token: "BERA",
    category: "DeFi-native L1",
    marketCapUsd: 2600000000,
    fdvUsd: 7200000000,
    circulatingSupply: 190000000,
    circulatingSupplyPct: 36,
    stakingRatioPct: 43,
    stakingApyPct: 9.3,
    stakedValueUsd: 1118000000,
    stakerAddresses: 97000,
    validatorCount: 69,
    globalLstHealthScore: 63,
    lstProtocols: 2,
    largestLst: "stBERA",
    lstTvlUsd: 210000000,
    lstPenetrationPct: 14,
    defiTvlUsd: 890000000,
    tvlToMcapPct: 34,
    stablecoinLiquidityUsd: 300000000,
    lendingPresence: true,
    lstCollateralEnabled: false,
    opportunityScore: 91,
    mainBottleneck: "LST penetration still low",
    mainOpportunity: "Make LST core collateral asset",
    status: "High Potential"
  },
  {
    networkId: "xdc",
    network: "XDC",
    token: "XDC",
    category: "Enterprise-focused L1",
    marketCapUsd: 1400000000,
    fdvUsd: 1800000000,
    circulatingSupply: 14200000000,
    circulatingSupplyPct: 79,
    stakingRatioPct: 38,
    stakingApyPct: 6.8,
    stakedValueUsd: 532000000,
    stakerAddresses: 61000,
    validatorCount: 108,
    globalLstHealthScore: 58,
    lstProtocols: 1,
    largestLst: "stXDC",
    lstTvlUsd: 72000000,
    lstPenetrationPct: 13,
    defiTvlUsd: 120000000,
    tvlToMcapPct: 9,
    stablecoinLiquidityUsd: 46000000,
    lendingPresence: false,
    lstCollateralEnabled: false,
    opportunityScore: 87,
    mainBottleneck: "Weak DeFi ecosystem",
    mainOpportunity: "Build core DeFi + LST stack",
    status: "Underdeveloped"
  },
  {
    networkId: "shardeum",
    network: "Shardeum",
    token: "SHM",
    category: "Dynamic sharded L1",
    marketCapUsd: 900000000,
    fdvUsd: 2100000000,
    circulatingSupply: 230000000,
    circulatingSupplyPct: 43,
    stakingRatioPct: 41,
    stakingApyPct: 9.8,
    stakedValueUsd: 369000000,
    stakerAddresses: 42000,
    validatorCount: 78,
    globalLstHealthScore: 54,
    lstProtocols: 1,
    largestLst: "stSHM",
    lstTvlUsd: 31000000,
    lstPenetrationPct: 8,
    defiTvlUsd: 75000000,
    tvlToMcapPct: 8,
    stablecoinLiquidityUsd: 21000000,
    lendingPresence: false,
    lstCollateralEnabled: false,
    opportunityScore: 92,
    mainBottleneck: "Ecosystem still early",
    mainOpportunity: "Launch foundational LST infrastructure",
    status: "Early Opportunity"
  },
  {
    networkId: "core",
    network: "Core",
    token: "CORE",
    category: "Bitcoin-aligned PoS",
    marketCapUsd: 2200000000,
    fdvUsd: 3600000000,
    circulatingSupply: 460000000,
    circulatingSupplyPct: 61,
    stakingRatioPct: 55,
    stakingApyPct: 7.3,
    stakedValueUsd: 1210000000,
    stakerAddresses: 98000,
    validatorCount: 83,
    globalLstHealthScore: 67,
    lstProtocols: 2,
    largestLst: "stCORE",
    lstTvlUsd: 260000000,
    lstPenetrationPct: 16,
    defiTvlUsd: 390000000,
    tvlToMcapPct: 17,
    stablecoinLiquidityUsd: 120000000,
    lendingPresence: true,
    lstCollateralEnabled: true,
    opportunityScore: 73,
    mainBottleneck: "Moderate liquidity depth",
    mainOpportunity: "Expand LST adoption in DeFi",
    status: "Growing"
  },
  {
    networkId: "sonic",
    network: "Sonic",
    token: "SONIC",
    category: "Gaming-focused L1",
    marketCapUsd: 1100000000,
    fdvUsd: 2600000000,
    circulatingSupply: 420000000,
    circulatingSupplyPct: 42,
    stakingRatioPct: 36,
    stakingApyPct: 8.7,
    stakedValueUsd: 396000000,
    stakerAddresses: 55000,
    validatorCount: 61,
    globalLstHealthScore: 52,
    lstProtocols: 1,
    largestLst: "stSONIC",
    lstTvlUsd: 42000000,
    lstPenetrationPct: 11,
    defiTvlUsd: 83000000,
    tvlToMcapPct: 7,
    stablecoinLiquidityUsd: 19000000,
    lendingPresence: false,
    lstCollateralEnabled: false,
    opportunityScore: 88,
    mainBottleneck: "Weak financial layer",
    mainOpportunity: "Introduce DeFi primitives for LST",
    status: "Early Opportunity"
  },
  {
    networkId: "mantra",
    network: "Mantra",
    token: "OM",
    category: "RWA-focused L1",
    marketCapUsd: 1800000000,
    fdvUsd: 4200000000,
    circulatingSupply: 890000000,
    circulatingSupplyPct: 43,
    stakingRatioPct: 49,
    stakingApyPct: 7.9,
    stakedValueUsd: 882000000,
    stakerAddresses: 76000,
    validatorCount: 72,
    globalLstHealthScore: 68,
    lstProtocols: 2,
    largestLst: "stOM",
    lstTvlUsd: 210000000,
    lstPenetrationPct: 24,
    defiTvlUsd: 310000000,
    tvlToMcapPct: 17,
    stablecoinLiquidityUsd: 98000000,
    lendingPresence: true,
    lstCollateralEnabled: true,
    opportunityScore: 79,
    mainBottleneck: "Limited stablecoin liquidity",
    mainOpportunity: "Expand DeFi credit markets",
    status: "Emerging"
  }
];

type CoingeckoNetworkBasics = {
  status: "ok" | "partial" | "missing_coin_id" | "missing_market_data";
  coinId: string | null;
  symbol: string;
  marketCapUsd: number | null;
  fdvUsd: number | null;
  circulatingSupply: number | null;
  circulatingSupplyPct: number | null;
};

type CoingeckoBasicsSnapshot = {
  source: string;
  generatedAt: string;
  vsCurrency: string;
  networks: Record<string, CoingeckoNetworkBasics>;
};

const coingeckoNetworkIds = new Set(["xdc", "monad", "sei", "shardeum", "sui"]);

type OverviewOverrideRecord = {
  marketCapUsd: number | null;
  fdvUsd: number | null;
  circulatingSupply: number | null;
  circulatingSupplyPct: number | null;
  stakingRatioPct: number | null;
  stakingApyPct: number | null;
  stakerAddresses: number | null;
  validatorCount: number | null;
  stakedValueUsd: number | null;
  lstProtocols: number | null;
  largestLst: string | null;
  lstTvlUsd: number | null;
  lstPenetrationPct: number | null;
  defiTvlUsd: number | null;
  tvlToMcapPct: number | null;
  stablecoinLiquidityUsd: number | null;
  lendingPresence: boolean | null;
  lstCollateralEnabled: boolean | null;
};

type OverviewOverridesSnapshot = {
  source: string;
  generatedAt: string;
  networks: Record<string, OverviewOverrideRecord>;
};

const networksWithCoingecko = applyCoingeckoBasics(baseNetworks, coingeckoBasics as CoingeckoBasicsSnapshot);

const networksWithOverviewOverrides: Network[] = applyOverviewOverrides(
  networksWithCoingecko,
  overviewOverrides as OverviewOverridesSnapshot
);

export const networks: Network[] = applyGeneratedOverview(networksWithOverviewOverrides, generatedOverview as RadarOverviewRecord[]);

function applyCoingeckoBasics(networks: Network[], snapshot: CoingeckoBasicsSnapshot): Network[] {
  if (!snapshot || snapshot.source !== "coingecko") {
    return networks;
  }

  return networks.map((network) => {
    if (!coingeckoNetworkIds.has(network.networkId)) {
      return network;
    }

    const basics = snapshot.networks[network.networkId];

    if (!basics || basics.status === "missing_coin_id" || basics.status === "missing_market_data") {
      return network;
    }

    return {
      ...network,
      marketCapUsd: basics.marketCapUsd ?? network.marketCapUsd,
      fdvUsd: basics.fdvUsd ?? network.fdvUsd,
      circulatingSupply: basics.circulatingSupply ?? network.circulatingSupply,
      circulatingSupplyPct: basics.circulatingSupplyPct ?? network.circulatingSupplyPct
    };
  });
}

function applyOverviewOverrides(networks: Network[], snapshot: OverviewOverridesSnapshot): Network[] {
  if (!snapshot || snapshot.source !== "overview-merge") {
    return networks;
  }

  return networks.map((network) => {
    const override = snapshot.networks[network.networkId];

    if (!override) {
      return network;
    }

    return {
      ...network,
      marketCapUsd: override.marketCapUsd ?? network.marketCapUsd,
      fdvUsd: override.fdvUsd ?? network.fdvUsd,
      circulatingSupply: override.circulatingSupply ?? network.circulatingSupply,
      circulatingSupplyPct: override.circulatingSupplyPct ?? network.circulatingSupplyPct,
      stakingRatioPct: override.stakingRatioPct ?? network.stakingRatioPct,
      stakingApyPct: override.stakingApyPct ?? network.stakingApyPct,
      stakerAddresses: override.stakerAddresses ?? network.stakerAddresses,
      validatorCount: override.validatorCount ?? network.validatorCount,
      stakedValueUsd: override.stakedValueUsd ?? network.stakedValueUsd,
      lstProtocols: override.lstProtocols ?? network.lstProtocols,
      largestLst: override.largestLst ?? network.largestLst,
      lstTvlUsd: override.lstTvlUsd ?? network.lstTvlUsd,
      lstPenetrationPct: override.lstPenetrationPct ?? network.lstPenetrationPct,
      defiTvlUsd: override.defiTvlUsd ?? network.defiTvlUsd,
      tvlToMcapPct: override.tvlToMcapPct ?? network.tvlToMcapPct,
      stablecoinLiquidityUsd: override.stablecoinLiquidityUsd ?? network.stablecoinLiquidityUsd,
      lendingPresence: override.lendingPresence ?? network.lendingPresence,
      lstCollateralEnabled: override.lstCollateralEnabled ?? network.lstCollateralEnabled
    };
  });
}


type RadarOverviewRecord = {
  networkId: string;
  marketCapUsd: number | null;
  circulatingSupply: number | null;
  priceUsd: number | null;
  volume24hUsd: number | null;
  defiTvlUsd: number | null;
  stablecoinLiquidityUsd: number | null;
  validatorCount: number | null;
  stakingRatioPct: number | null;
  stakingApyPct: number | null;
  lstTvlUsd: number | null;
  tvlToMarketCap: number | null;
  lstPenetrationPct: number | null;
  globalLstHealthScore: number;
  opportunityScore: number;
  asOf: string;
  sourceRefs: string[];
  quality: "observed" | "inferred" | "simulated";
  confidence: "high" | "medium" | "low";
};

function applyGeneratedOverview(networks: Network[], records: RadarOverviewRecord[]): Network[] {
  const byId = new Map(records.map((record) => [record.networkId, record]));

  return networks.map((network) => {
    const record = byId.get(network.networkId);

    if (!record) {
      return network;
    }

    return {
      ...network,
      marketCapUsd: record.marketCapUsd ?? network.marketCapUsd,
      circulatingSupply: record.circulatingSupply ?? network.circulatingSupply,
      priceUsd: record.priceUsd,
      volume24hUsd: record.volume24hUsd,
      defiTvlUsd: record.defiTvlUsd ?? network.defiTvlUsd,
      stablecoinLiquidityUsd: record.stablecoinLiquidityUsd ?? network.stablecoinLiquidityUsd,
      validatorCount: record.validatorCount ?? network.validatorCount,
      stakingRatioPct: record.stakingRatioPct ?? network.stakingRatioPct,
      stakingApyPct: record.stakingApyPct ?? network.stakingApyPct,
      lstTvlUsd: record.lstTvlUsd ?? network.lstTvlUsd,
      tvlToMcapPct: record.tvlToMarketCap !== null ? Number((record.tvlToMarketCap * 100).toFixed(2)) : network.tvlToMcapPct,
      lstPenetrationPct:
        record.lstPenetrationPct !== null ? Number((record.lstPenetrationPct * 100).toFixed(2)) : network.lstPenetrationPct,
      globalLstHealthScore: record.globalLstHealthScore ?? network.globalLstHealthScore,
      opportunityScore: record.opportunityScore ?? network.opportunityScore,
      asOf: record.asOf,
      sourceRefs: record.sourceRefs,
      quality: record.quality,
      confidence: record.confidence
    };
  });
}
