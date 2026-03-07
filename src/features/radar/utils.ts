import type { NetworkStatus } from "@data/networks";
import { formatUsdCompactStable } from "@/lib/number-format";

import {
  RadarFilters,
  RadarKpis,
  RadarNetwork,
  SortDirection,
  SortKey,
  SortState
} from "@/features/radar/types";

export function formatUsdCompact(value: number): string {
  return formatUsdCompactStable(value);
}

export function formatUsdFull(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(value);
}

export function formatInteger(value: number): string {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0
  }).format(value);
}

export function formatPercent(value: number, digits = 1): string {
  return `${value.toFixed(digits)}%`;
}

export function computeKpis(networks: RadarNetwork[]): RadarKpis {
  const count = networks.length;
  const totalMarketCap = networks.reduce((sum, network) => sum + network.marketCapUsd, 0);
  const totalStakedValue = networks.reduce((sum, network) => sum + network.stakedValueUsd, 0);
  const totalDefiTvl = networks.reduce((sum, network) => sum + network.defiTvlUsd, 0);
  const avgStakingRatio = count === 0 ? 0 : networks.reduce((sum, network) => sum + network.stakingRatioPct, 0) / count;
  const avgLstPenetration =
    count === 0 ? 0 : networks.reduce((sum, network) => sum + network.lstPenetrationPct, 0) / count;
  const avgDataCoverage =
    count === 0 ? 0 : networks.reduce((sum, network) => sum + (network.dataCoveragePct ?? 0), 0) / count;

  return {
    trackedNetworks: count,
    totalMarketCapUsd: totalMarketCap,
    totalStakedValueUsd: totalStakedValue,
    avgStakingRatioPct: avgStakingRatio,
    avgLstPenetrationPct: avgLstPenetration,
    totalDefiTvlUsd: totalDefiTvl,
    avgDataCoveragePct: avgDataCoverage
  };
}

export function getStatusOptions(networks: RadarNetwork[]): NetworkStatus[] {
  return [...new Set(networks.map((network) => network.status))].sort((a, b) => a.localeCompare(b));
}

export function filterNetworks(networks: RadarNetwork[], filters: RadarFilters): RadarNetwork[] {
  const normalizedQuery = filters.query.trim().toLowerCase();

  return networks.filter((network) => {
    const matchesQuery =
      normalizedQuery.length === 0 ||
      network.network.toLowerCase().includes(normalizedQuery) ||
      network.token.toLowerCase().includes(normalizedQuery) ||
      network.category.toLowerCase().includes(normalizedQuery);

    const matchesStatus = filters.status === "all" || network.status === filters.status;

    const matchesLending =
      filters.lending === "all" ||
      (filters.lending === "yes" && network.lendingPresence) ||
      (filters.lending === "no" && !network.lendingPresence);

    const matchesCollateral =
      filters.collateral === "all" ||
      (filters.collateral === "yes" && network.lstCollateralEnabled) ||
      (filters.collateral === "no" && !network.lstCollateralEnabled);

    return matchesQuery && matchesStatus && matchesLending && matchesCollateral;
  });
}

export function sortNetworks(networks: RadarNetwork[], sort: SortState): RadarNetwork[] {
  const sorted = [...networks];

  sorted.sort((a, b) => {
    const directionFactor = sort.direction === "asc" ? 1 : -1;

    const valueA = getSortValue(a, sort.key);
    const valueB = getSortValue(b, sort.key);

    if (typeof valueA === "string" && typeof valueB === "string") {
      return valueA.localeCompare(valueB) * directionFactor;
    }

    return ((valueA as number) - (valueB as number)) * directionFactor;
  });

  return sorted;
}

function getSortValue(network: RadarNetwork, key: SortKey): string | number {
  switch (key) {
    case "network":
      return network.network;
    case "token":
      return network.token;
    case "marketCapUsd":
      return network.marketCapUsd;
    case "stakingRatioPct":
      return network.stakingRatioPct;
    case "stakingApyPct":
      return network.stakingApyPct;
    case "stakerAddresses":
      return network.stakerAddresses;
    case "globalLstHealthScore":
      return network.globalLstHealthScore;
    case "lstProtocols":
      return network.lstProtocols;
    case "lstPenetrationPct":
      return network.lstPenetrationPct;
    case "defiTvlUsd":
      return network.defiTvlUsd;
    case "opportunityScore":
      return network.opportunityScore;
    default:
      return network.opportunityScore;
  }
}

export function toggleSortDirection(current: SortDirection): SortDirection {
  return current === "asc" ? "desc" : "asc";
}

export function resolveHealthScoreClass(score: number): string {
  if (score >= 72) {
    return "border-mint/35 bg-mint/12 text-mint";
  }

  if (score >= 60) {
    return "border-amber/40 bg-amber/12 text-amber";
  }

  return "border-coral/40 bg-coral/12 text-coral";
}

export function resolveOpportunityScoreClass(score: number): string {
  if (score >= 85) {
    return "border-[#7baff5]/35 bg-[#7baff5]/14 text-[#a9ceff]";
  }

  if (score >= 70) {
    return "border-amber/35 bg-amber/12 text-amber";
  }

  return "border-ink-300/35 bg-ink-300/10 text-ink-200";
}

export function resolveStatusClass(status: NetworkStatus): string {
  switch (status) {
    case "Mature":
      return "border-mint/35 bg-mint/12 text-mint";
    case "Emerging":
    case "Growing":
      return "border-amber/40 bg-amber/12 text-amber";
    case "High Potential":
    case "Early Opportunity":
      return "border-[#7baff5]/35 bg-[#7baff5]/14 text-[#a9ceff]";
    case "Underdeveloped":
    case "Weak DeFi Base":
      return "border-coral/40 bg-coral/12 text-coral";
    case "Watchlist":
      return "border-ink-300/35 bg-ink-300/10 text-ink-200";
    case "Strong LP Fit":
      return "border-mint/35 bg-mint/12 text-mint";
    default:
      return "border-ink-300/35 bg-ink-300/10 text-ink-200";
  }
}

export function booleanLabel(value: boolean | null | undefined): string {
  if (value === true) return "Yes";
  if (value === false) return "No";
  return "Unknown";
}
