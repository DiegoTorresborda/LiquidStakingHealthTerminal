export type FieldDataClass = "observed" | "inferred" | "simulated" | "missing";

export type RadarOverviewRecord = {
  networkId: string;
  network: string;
  token: string;
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
  dataCoveragePct: number;
  fieldQuality: Record<string, FieldDataClass>;
  inferredScoreComponents: string[];
};
