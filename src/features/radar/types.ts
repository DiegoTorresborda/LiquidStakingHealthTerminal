import type { Network, NetworkStatus } from "@data/networks";

export type RadarNetwork = Network;

export type BinaryFilter = "all" | "yes" | "no";

export type SortDirection = "asc" | "desc";

export type SortKey =
  | "network"
  | "token"
  | "marketCapUsd"
  | "stakingRatioPct"
  | "stakingApyPct"
  | "stakerAddresses"
  | "globalLstHealthScore"
  | "lstProtocols"
  | "lstPenetrationPct"
  | "defiTvlUsd"
  | "opportunityScore";

export type SortState = {
  key: SortKey;
  direction: SortDirection;
};

export type RadarFilters = {
  query: string;
  status: "all" | NetworkStatus;
  lending: BinaryFilter;
  collateral: BinaryFilter;
};

export type RadarKpis = {
  trackedNetworks: number;
  totalMarketCapUsd: number;
  totalStakedValueUsd: number;
  avgStakingRatioPct: number;
  avgLstPenetrationPct: number;
  totalDefiTvlUsd: number;
};

export const DEFAULT_SORT: SortState = {
  key: "opportunityScore",
  direction: "desc"
};

export const DEFAULT_FILTERS: RadarFilters = {
  query: "",
  status: "all",
  lending: "all",
  collateral: "all"
};
