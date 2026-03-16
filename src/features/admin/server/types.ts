export type ManualNetworkFieldValue = number | null;

export type ManualNetworkEntry = {
  stakingRatioPct?: ManualNetworkFieldValue;
  stakingApyPct?: ManualNetworkFieldValue;
  validatorCount?: ManualNetworkFieldValue;
  inflationRatePct?: ManualNetworkFieldValue;
  notes?: string | null;
  updatedAt?: string;
};

export type ManualNetworkDataFile = {
  source: "manual-network-data";
  updatedAt: string | null;
  networks: Record<string, ManualNetworkEntry>;
};

export type ManualUiFieldNumber = number | null;

export type ManualUiFieldEntry = {
  category?: string | null;
  status?: string | null;
  fdvUsd?: ManualUiFieldNumber;
  circulatingSupplyPct?: ManualUiFieldNumber;
  stakerAddresses?: ManualUiFieldNumber;
  lstProtocols?: ManualUiFieldNumber;
  largestLst?: string | null;
  lendingPresence?: boolean | null;
  lstCollateralEnabled?: boolean | null;
  mainBottleneck?: string | null;
  mainOpportunity?: string | null;
  // V2 scoring fields
  hasLst?: boolean | null;
  unbondingDays?: ManualUiFieldNumber;
  auditCount?: ManualUiFieldNumber;
  hasTimelock?: boolean | null;
  updatedAt?: string;
};

export type ManualUiFieldsFile = {
  source: "manual-ui-fields";
  updatedAt: string | null;
  networks: Record<string, ManualUiFieldEntry>;
};

export type ChainResourceCategory =
  | "official"
  | "docs"
  | "explorer"
  | "staking"
  | "governance"
  | "developer"
  | "ecosystem"
  | "analytics"
  | "community"
  | "validators"
  | "liquidity"
  | "bridges";

export type ChainResourceEntry = {
  label: string;
  url: string;
  category: ChainResourceCategory;
  priority: number;
  description?: string;
};

export type ChainResourcesFile = Record<string, ChainResourceEntry[]>;

export type OverrideEntry = {
  id: string;
  networkId: string;
  field: string;
  value: string | number | boolean | null;
  reason: string;
  timestamp: string;
};

export type OverridesFile = {
  source: "manual-overrides";
  updatedAt: string | null;
  overrides: OverrideEntry[];
};

export type SyncSourceKey = "coingecko" | "defillama" | "dexscreener" | "explorer" | "all";

export type SyncSourceStatus = {
  source: Exclude<SyncSourceKey, "all">;
  status: "ok" | "error";
  updatedNetworks: number;
  startedAt: string;
  endedAt: string;
  message?: string;
};

export type AdminSyncStatusFile = {
  updatedAt: string | null;
  sources: Partial<Record<Exclude<SyncSourceKey, "all">, SyncSourceStatus>>;
};
