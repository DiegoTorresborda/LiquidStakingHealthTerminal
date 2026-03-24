import networksGenerated from "./networks.generated.json";

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
  | "RWA-focused L1"
  | "WASM-native L1";

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
  stakedTokens?: number | null;
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
  dataCoveragePct?: number;
  fieldQuality?: Record<string, "observed" | "derived" | "inferred" | "simulated" | "missing">;
  status: NetworkStatus;
};

const baseNetworks: Network[] = [
  {
    networkId: "canton",
    network: "Canton Network",
    token: "CC",
    category: "Enterprise-focused L1",
    marketCapUsd: 0,
    fdvUsd: 0,
    circulatingSupply: 0,
    circulatingSupplyPct: 0,
    stakingRatioPct: 0,
    stakingApyPct: 0,
    stakedValueUsd: 0,
    stakerAddresses: 0,
    validatorCount: 0,
    globalLstHealthScore: 0,
    lstProtocols: 0,
    largestLst: "stCC",
    lstTvlUsd: 0,
    lstPenetrationPct: 0,
    defiTvlUsd: 0,
    tvlToMcapPct: 0,
    stablecoinLiquidityUsd: 0,
    lendingPresence: false,
    lstCollateralEnabled: false,
    opportunityScore: 0,
    mainBottleneck: "TBD",
    mainOpportunity: "TBD",
    status: "Watchlist"
  },
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
  },
  {
    networkId: "vara",
    network: "Vara",
    token: "VARA",
    category: "WASM-native L1",
    marketCapUsd: 4_973_758,
    fdvUsd: 9_392_463,
    circulatingSupply: 5_295_478_204,
    circulatingSupplyPct: 52.95,
    priceUsd: 0.00093925,
    volume24hUsd: 57_742,
    stakingRatioPct: 39.34,
    stakingApyPct: 8.4,
    stakedTokens: 3_934_000_000,
    stakedValueUsd: 3_694_285,
    stakerAddresses: 8_500,
    validatorCount: 59,
    globalLstHealthScore: 0,       // computed by v2 engine
    lstProtocols: 0,
    largestLst: "",
    lstTvlUsd: 0,
    lstPenetrationPct: 0,
    defiTvlUsd: 350_000,
    tvlToMcapPct: 7.04,
    stablecoinLiquidityUsd: 150_000,
    lendingPresence: true,          // vStreet lending protocol
    lstCollateralEnabled: false,
    opportunityScore: 0,           // computed by v2 engine
    mainBottleneck: "No LST deployed — network locked in pre-LST scoring mode",
    mainOpportunity: "Launch a VARA liquid staking protocol to unlock full scoring ceiling",
    status: "Early Opportunity",
    asOf: "2026-03-17",
    sourceRefs: ["coingecko.com/en/coins/vara-network", "vara.subscan.io", "daic.capital/staking/vara-network-vara"],
    quality: "observed",
    confidence: "medium",
    dataCoveragePct: 74
  },
  {
    networkId: "zigchain",
    network: "ZigChain",
    token: "ZIG",
    category: "DeFi-native L1",
    marketCapUsd: 53_598_810,
    fdvUsd: 76_000_000,
    circulatingSupply: 1_410_000_000,
    circulatingSupplyPct: 70.5,
    priceUsd: 0.03803,
    volume24hUsd: 711_164,
    stakingRatioPct: 16.19,
    stakingApyPct: 7.0,
    stakedTokens: 376_274_901,
    stakedValueUsd: 14_313_895,
    stakerAddresses: 0,               // missing — not publicly indexed
    validatorCount: 33,
    globalLstHealthScore: 0,          // computed by v2 engine
    lstProtocols: 1,
    largestLst: "stZIG",
    lstTvlUsd: 7_990_000,
    lstPenetrationPct: 14.9,
    defiTvlUsd: 14_000_000,
    tvlToMcapPct: 26.1,
    stablecoinLiquidityUsd: 50_000,   // inferred — Oroswap DEX nascent
    lendingPresence: false,           // Permapod upcoming, not live
    lstCollateralEnabled: false,
    opportunityScore: 0,              // computed by v2 engine
    mainBottleneck: "stZIG has no DEX liquidity pairs — LST is not liquid in practice yet",
    mainOpportunity: "Seed stZIG/USDC pool on Oroswap and integrate as collateral in Permapod once live",
    status: "Growing",
    asOf: "2026-03-17",
    sourceRefs: [
      "coingecko.com/en/coins/zigchain",
      "staking-explorer.com/explorer/zigchain",
      "defillama.com/chain/zignaly",
      "docs.valdora.finance",
      "docs.zigchain.com"
    ],
    quality: "observed",
    confidence: "medium",
    dataCoveragePct: 74
  }
];

type GeneratedOverviewRecord = {
  networkId: string;
  category?: string | null;
  status?: NetworkStatus | null;
  fdvUsd?: number | null;
  circulatingSupplyPct?: number | null;
  stakerAddresses?: number | null;
  lstProtocols?: number | null;
  largestLst?: string | null;
  lendingPresence?: boolean | null;
  lstCollateralEnabled?: boolean | null;
  mainBottleneck?: string | null;
  mainOpportunity?: string | null;
  marketCapUsd?: number | null;
  circulatingSupply?: number | null;
  stakedTokens?: number | null;
  priceUsd?: number | null;
  volume24hUsd?: number | null;
  defiTvlUsd?: number | null;
  stablecoinLiquidityUsd?: number | null;
  validatorCount?: number | null;
  stakingRatioPct?: number | null;
  stakingApyPct?: number | null;
  lstTvlUsd?: number | null;
  globalLstHealthScore?: number | null;
  opportunityScore?: number | null;
  asOf?: string;
  sourceRefs?: string[];
  quality?: Network["quality"];
  confidence?: Network["confidence"];
  dataCoveragePct?: number;
  fieldQuality?: Record<string, "observed" | "derived" | "inferred" | "simulated" | "missing">;
};

export const networks: Network[] = applyGeneratedOverview(
  baseNetworks,
  networksGenerated as GeneratedOverviewRecord[]
);

function toFiniteNumber(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function toNullableString(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function toNullableBoolean(value: unknown): boolean | null {
  return typeof value === "boolean" ? value : null;
}

function applyGeneratedOverview(networks: Network[], generated: GeneratedOverviewRecord[]): Network[] {
  const generatedById = new Map(generated.map((entry) => [entry.networkId, entry]));

  return networks.map((network) => {
    const live = generatedById.get(network.networkId);

    const category = (toNullableString(live?.category) as NetworkCategory | null) ?? network.category;
    const status = (toNullableString(live?.status) as NetworkStatus | null) ?? network.status;
    const fdvUsd = toFiniteNumber(live?.fdvUsd) ?? network.fdvUsd;
    const circulatingSupplyPct = toFiniteNumber(live?.circulatingSupplyPct) ?? network.circulatingSupplyPct;
    const stakerAddresses = toFiniteNumber(live?.stakerAddresses) ?? network.stakerAddresses;
    const lstProtocols = toFiniteNumber(live?.lstProtocols) ?? network.lstProtocols;
    const largestLst = toNullableString(live?.largestLst) ?? network.largestLst;
    const lendingPresence = toNullableBoolean(live?.lendingPresence) ?? network.lendingPresence;
    const lstCollateralEnabled = toNullableBoolean(live?.lstCollateralEnabled) ?? network.lstCollateralEnabled;
    const mainBottleneck = toNullableString(live?.mainBottleneck) ?? network.mainBottleneck;
    const mainOpportunity = toNullableString(live?.mainOpportunity) ?? network.mainOpportunity;
    const marketCapUsd = toFiniteNumber(live?.marketCapUsd) ?? network.marketCapUsd;
    const circulatingSupply = toFiniteNumber(live?.circulatingSupply) ?? network.circulatingSupply;
    const stakedTokens = toFiniteNumber(live?.stakedTokens) ?? network.stakedTokens ?? null;
    const stakingRatioPct = toFiniteNumber(live?.stakingRatioPct) ?? network.stakingRatioPct;
    const stakingApyPct = toFiniteNumber(live?.stakingApyPct) ?? network.stakingApyPct;
    // For TVL fields: if a generated record exists, trust its value even if null
    // (null = explicitly no data, not "data missing"). Only fall back to hardcoded
    // when there is NO generated record for this network at all.
    const defiTvlUsd = live !== undefined ? (toFiniteNumber(live.defiTvlUsd) ?? 0) : network.defiTvlUsd;
    const stablecoinLiquidityUsd = live !== undefined ? (toFiniteNumber(live.stablecoinLiquidityUsd) ?? 0) : network.stablecoinLiquidityUsd;
    const validatorCount = toFiniteNumber(live?.validatorCount) ?? network.validatorCount;
    const lstTvlUsd = live !== undefined ? (toFiniteNumber(live.lstTvlUsd) ?? 0) : network.lstTvlUsd;
    const globalLstHealthScore = toFiniteNumber(live?.globalLstHealthScore) ?? network.globalLstHealthScore;
    const opportunityScore = toFiniteNumber(live?.opportunityScore) ?? network.opportunityScore;

    const merged: Network = {
      ...network,
      category,
      status,
      fdvUsd,
      circulatingSupplyPct,
      stakerAddresses,
      lstProtocols,
      largestLst,
      lendingPresence,
      lstCollateralEnabled,
      mainBottleneck,
      mainOpportunity,
      marketCapUsd,
      circulatingSupply,
      stakedTokens,
      priceUsd: toFiniteNumber(live?.priceUsd) ?? network.priceUsd ?? null,
      volume24hUsd: toFiniteNumber(live?.volume24hUsd) ?? network.volume24hUsd ?? null,
      stakingRatioPct,
      stakingApyPct,
      defiTvlUsd,
      stablecoinLiquidityUsd,
      validatorCount,
      lstTvlUsd,
      globalLstHealthScore,
      opportunityScore,
      asOf: live?.asOf ?? network.asOf,
      sourceRefs: live?.sourceRefs ?? network.sourceRefs,
      quality: live?.quality ?? network.quality,
      confidence: live?.confidence ?? network.confidence,
      dataCoveragePct: toFiniteNumber(live?.dataCoveragePct) ?? network.dataCoveragePct,
      fieldQuality: live?.fieldQuality ?? network.fieldQuality
    };

    return applyDerivedMetrics(merged);
  });
}

function applyDerivedMetrics(network: Network): Network {
  const hasTokenRatioInputs =
    typeof network.stakedTokens === "number" &&
    Number.isFinite(network.stakedTokens) &&
    typeof network.circulatingSupply === "number" &&
    Number.isFinite(network.circulatingSupply) &&
    network.circulatingSupply > 0;

  const derivedTokenRatioPct = hasTokenRatioInputs ? (network.stakedTokens! / network.circulatingSupply) * 100 : null;
  const isDerivedTokenRatioUsable =
    typeof derivedTokenRatioPct === "number" && Number.isFinite(derivedTokenRatioPct) && derivedTokenRatioPct >= 0 && derivedTokenRatioPct <= 100;

  const resolvedStakingRatioPct = isDerivedTokenRatioUsable ? derivedTokenRatioPct : network.stakingRatioPct;

  const stakedValueUsd = (network.marketCapUsd * resolvedStakingRatioPct) / 100;
  const tvlToMcapPct = network.marketCapUsd > 0 ? (network.defiTvlUsd / network.marketCapUsd) * 100 : network.tvlToMcapPct;
  const lstPenetrationPct = stakedValueUsd > 0 ? (network.lstTvlUsd / stakedValueUsd) * 100 : network.lstPenetrationPct;

  return {
    ...network,
    stakingRatioPct: Number(resolvedStakingRatioPct.toFixed(2)),
    stakedValueUsd: Number(stakedValueUsd.toFixed(0)),
    tvlToMcapPct: Number(tvlToMcapPct.toFixed(1)),
    lstPenetrationPct: Number(lstPenetrationPct.toFixed(1))
  };
}

function resolveAsOf(...timestamps: Array<string | undefined>): string | undefined {
  const valid = timestamps.filter((timestamp): timestamp is string => Boolean(timestamp)).sort();
  return valid.length > 0 ? valid[valid.length - 1] : undefined;
}
