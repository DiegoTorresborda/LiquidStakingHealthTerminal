"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import networksGenerated from "@data/networks.generated.json";
import { networks as networkUniverse } from "@data/networks";

import { KpiSummaryBar } from "@/components/radar/kpi-summary-bar";
import { NetworksTable } from "@/components/radar/networks-table";
import { RadarHeader } from "@/components/radar/radar-header";
import { DEFAULT_FILTERS, DEFAULT_SORT, RadarFilters, SortKey, SortState } from "@/features/radar/types";
import {
  computeKpis,
  filterNetworks,
  formatInteger,
  getStatusOptions,
  sortNetworks,
  toggleSortDirection
} from "@/features/radar/utils";
import { scoreNetworkWithMockModel } from "@/features/scoring";
import type { RadarOverviewRecord } from "@/data/radar-overview-schema";
import { computeV2Score } from "@/features/scoring/v2/index";

const radarRecords = networksGenerated as unknown as RadarOverviewRecord[];

export function LstOpportunityRadar({ hiddenNetworkIds = [] }: { hiddenNetworkIds?: string[] }) {
  const router = useRouter();
  const [filters, setFilters] = useState<RadarFilters>(DEFAULT_FILTERS);
  const [sort, setSort] = useState<SortState>(DEFAULT_SORT);
  const [expandedNetwork, setExpandedNetwork] = useState<string | null>(null);

  const networkDataset = useMemo(() => {
    return networkUniverse
      .filter((network) => !hiddenNetworkIds.includes(network.networkId))
      .map((network) => {
      const radarRecord = radarRecords.find((r) => r.networkId === network.networkId);
      const globalScore = radarRecord
        ? computeV2Score(radarRecord).globalScore
        : scoreNetworkWithMockModel(network).globalScore.finalScore;

      return {
        ...network,
        globalLstHealthScore: globalScore,
        healthScoreRaw: globalScore,
        healthScorePenaltyPoints: 0,
        healthScoreCapped: globalScore
      };
    });
  }, [hiddenNetworkIds]);

  const statusOptions = useMemo(() => getStatusOptions(networkDataset), [networkDataset]);

  const filteredNetworks = useMemo(() => {
    return filterNetworks(networkDataset, filters);
  }, [filters, networkDataset]);

  const visibleNetworks = useMemo(() => {
    return sortNetworks(filteredNetworks, sort);
  }, [filteredNetworks, sort]);

  const kpis = useMemo(() => computeKpis(filteredNetworks), [filteredNetworks]);

  function handleSort(key: SortKey) {
    setSort((current) => {
      if (current.key === key) {
        return {
          key,
          direction: toggleSortDirection(current.direction)
        };
      }

      return {
        key,
        direction: "desc"
      };
    });
  }

  return (
    <main className="mx-auto flex w-full max-w-[1520px] flex-col gap-6 px-4 py-6 md:px-8 md:py-8">
      <RadarHeader
        filters={filters}
        statusOptions={statusOptions}
        visibleCount={filteredNetworks.length}
        totalCount={networkDataset.length}
        onQueryChange={(value) => setFilters((current) => ({ ...current, query: value }))}
        onStatusChange={(value) => setFilters((current) => ({ ...current, status: value }))}
        onLendingChange={(value) => setFilters((current) => ({ ...current, lending: value }))}
        onCollateralChange={(value) => setFilters((current) => ({ ...current, collateral: value }))}
        onReset={() => {
          setFilters(DEFAULT_FILTERS);
          setSort(DEFAULT_SORT);
          setExpandedNetwork(null);
        }}
      />

      <KpiSummaryBar kpis={kpis} />

      {visibleNetworks.length > 0 ? (
        <NetworksTable
          networks={visibleNetworks}
          sort={sort}
          expandedNetwork={expandedNetwork}
          onSort={handleSort}
          onToggleExpanded={(networkId) => setExpandedNetwork((current) => (current === networkId ? null : networkId))}
          onOpenNetwork={(networkId) => router.push(`/network/${networkId}`)}
        />
      ) : (
        <section className="rounded-2xl border border-ink-300/20 bg-slateglass-600/55 p-10 text-center shadow-card">
          <p className="text-sm uppercase tracking-[0.16em] text-ink-300">No matches</p>
          <h2 className="mt-2 font-[var(--font-heading)] text-2xl font-semibold text-ink-50">
            No networks match current filters
          </h2>
          <p className="mt-2 text-sm text-ink-200">
            Try clearing search or filters. Current tracked universe: {formatInteger(networkDataset.length)} networks.
          </p>
        </section>
      )}
    </main>
  );
}
