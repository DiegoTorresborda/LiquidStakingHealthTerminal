import { Fragment } from "react";

import type { RadarNetwork } from "@/features/radar/types";
import type { SortKey, SortState } from "@/features/radar/types";
import { ChainResourcesQuickAction } from "@/components/chain-resources";
import {
  booleanLabel,
  formatInteger,
  formatPercent,
  formatUsdCompact,
  formatUsdFull,
  resolveHealthScoreClass,
  resolveOpportunityScoreClass,
  resolveStatusClass
} from "@/features/radar/utils";

type NetworksTableProps = {
  networks: RadarNetwork[];
  sort: SortState;
  expandedNetwork: string | null;
  onSort: (key: SortKey) => void;
  onToggleExpanded: (networkId: string) => void;
  onOpenNetwork: (networkId: string) => void;
};

type Column = {
  key: SortKey;
  label: string;
  align?: "left" | "right";
};

const COLUMNS: Column[] = [
  { key: "network", label: "Network" },
  { key: "token", label: "Native Token" },
  { key: "marketCapUsd", label: "Market Cap", align: "right" },
  { key: "stakingRatioPct", label: "% Staked", align: "right" },
  { key: "stakingApyPct", label: "Staking APY", align: "right" },
  { key: "stakerAddresses", label: "# Stakers", align: "right" },
  { key: "globalLstHealthScore", label: "Global LST Health", align: "right" },
  { key: "lstProtocols", label: "# of LSTs", align: "right" },
  { key: "lstPenetrationPct", label: "LST / Staked %", align: "right" },
  { key: "defiTvlUsd", label: "DeFi TVL", align: "right" },
  { key: "opportunityScore", label: "Opportunity Score", align: "right" }
];

export function NetworksTable({
  networks,
  sort,
  expandedNetwork,
  onSort,
  onToggleExpanded,
  onOpenNetwork
}: NetworksTableProps) {
  return (
    <section className="rounded-2xl border border-ink-300/20 bg-slateglass-700/40 p-4 shadow-glow backdrop-blur">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-[var(--font-heading)] text-2xl font-semibold text-ink-50">Network Radar Table</h2>
        <p className="text-xs uppercase tracking-[0.16em] text-ink-300">Health and opportunity are separate signals</p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-[1280px] w-full border-separate border-spacing-y-2">
          <thead>
            <tr>
              {COLUMNS.map((column) => (
                <th
                  key={column.key}
                  className={`px-3 py-2 text-xs uppercase tracking-[0.14em] text-ink-300 ${
                    column.align === "right" ? "text-right" : "text-left"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => onSort(column.key)}
                    className={`inline-flex items-center gap-1.5 ${column.align === "right" ? "ml-auto" : ""}`}
                  >
                    <span>{column.label}</span>
                    <span className="text-ink-200">{resolveSortIcon(sort, column.key)}</span>
                  </button>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {networks.map((network) => {
              const isExpanded = expandedNetwork === network.networkId;

              return (
                <Fragment key={network.networkId}>
                  <tr
                    className="cursor-pointer rounded-xl border border-ink-300/20 bg-ink-900/25 transition hover:border-[#7baff5]/30 hover:bg-ink-900/35"
                    onClick={() => onOpenNetwork(network.networkId)}
                    role="link"
                    tabIndex={0}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        onOpenNetwork(network.networkId);
                      }
                    }}
                  >
                    <td className="rounded-l-xl px-3 py-3 align-top">
                      <div className="flex flex-col gap-1">
                        <p className="font-semibold text-ink-50">{network.network}</p>
                        <p className="text-xs text-ink-300">{network.category}</p>
                        <span className={`inline-flex w-fit rounded-md border px-2 py-0.5 text-xs ${resolveStatusClass(network.status)}`}>
                          {network.status}
                        </span>
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            onToggleExpanded(network.networkId);
                          }}
                          className="mt-1 w-fit text-xs font-medium text-[#a9ceff] hover:text-[#c0dcff]"
                        >
                          {isExpanded ? "Hide details" : "Show details"}
                        </button>
                        <div className="mt-1">
                          <ChainResourcesQuickAction networkId={network.networkId} />
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-sm text-ink-50">{network.token}</td>
                    <td className="px-3 py-3 text-right text-sm text-ink-100">{formatUsdCompact(network.marketCapUsd)}</td>
                    <td className="px-3 py-3 text-right text-sm text-ink-100">{formatPercent(network.stakingRatioPct)}</td>
                    <td className="px-3 py-3 text-right text-sm text-ink-100">{formatPercent(network.stakingApyPct)}</td>
                    <td className="px-3 py-3 text-right text-sm text-ink-100">{formatInteger(network.stakerAddresses)}</td>
                    <td className="px-3 py-3 text-right">
                      <span className={`inline-flex rounded-md border px-2.5 py-1 text-sm font-semibold ${resolveHealthScoreClass(network.globalLstHealthScore)}`}>
                        {network.globalLstHealthScore}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-right text-sm text-ink-100">{formatInteger(network.lstProtocols)}</td>
                    <td className="px-3 py-3 text-right text-sm text-ink-100">{formatPercent(network.lstPenetrationPct)}</td>
                    <td className="px-3 py-3 text-right text-sm text-ink-100">{formatUsdCompact(network.defiTvlUsd)}</td>
                    <td className="rounded-r-xl px-3 py-3 text-right">
                      <span className={`inline-flex rounded-md border px-2.5 py-1 text-sm font-semibold ${resolveOpportunityScoreClass(network.opportunityScore)}`}>
                        {network.opportunityScore}
                      </span>
                    </td>
                  </tr>

                  {isExpanded ? (
                    <tr>
                      <td colSpan={11} className="px-3 pb-3">
                        <div className="rounded-xl border border-ink-300/20 bg-ink-900/30 p-4">
                          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                            <p className="text-xs uppercase tracking-[0.16em] text-ink-300">Secondary fields</p>
                            <button
                              type="button"
                              className="rounded-md border border-[#7baff5]/35 bg-[#7baff5]/15 px-3 py-1 text-xs font-medium text-[#a9ceff]"
                              onClick={() => onOpenNetwork(network.networkId)}
                            >
                              Open full diagnosis
                            </button>
                          </div>

                          <div className="grid gap-3 text-sm sm:grid-cols-2 xl:grid-cols-4">
                            <DetailItem label="FDV" value={formatUsdFull(network.fdvUsd)} />
                            <DetailItem label="Tokens in Circulation" value={formatInteger(network.circulatingSupply)} />
                            <DetailItem label="Circulating Supply %" value={formatPercent(network.circulatingSupplyPct)} />
                            <DetailItem label="Staked Value USD" value={formatUsdFull(network.stakedValueUsd)} />
                            <DetailItem label="Validator Count" value={formatInteger(network.validatorCount)} />
                            <DetailItem label="Largest LST" value={network.largestLst} />
                            <DetailItem label="Stablecoin Liquidity" value={formatUsdFull(network.stablecoinLiquidityUsd)} />
                            <DetailItem label="Lending Presence" value={booleanLabel(network.lendingPresence)} />
                            <DetailItem label="LST as Collateral" value={booleanLabel(network.lstCollateralEnabled)} />
                            <DetailItem label="Health Score (Raw)" value={`${network.healthScoreRaw}`} />
                            <DetailItem
                              label="Health Penalties"
                              value={network.healthScorePenaltyPoints > 0 ? `-${network.healthScorePenaltyPoints}` : "0"}
                            />
                            <DetailItem label="Health Score (Capped)" value={`${network.healthScoreCapped}`} />
                            <DetailItem label="Main Bottleneck" value={network.mainBottleneck} />
                            <DetailItem label="Main Opportunity" value={network.mainOpportunity} />
                            <DetailItem label="Status Tag" value={network.status} />
                            <DetailItem label="Data Quality" value={network.quality ?? "Unknown"} />
                            <DetailItem label="Confidence" value={network.confidence ?? "Unknown"} />
                            <DetailItem label="As Of" value={network.asOf ?? "Unknown"} />
                            <DetailItem label="Source Refs" value={network.sourceRefs?.join(", ") || "Unknown"} />
                          </div>
                        </div>
                      </td>
                    </tr>
                  ) : null}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function resolveSortIcon(sort: SortState, key: SortKey): string {
  if (sort.key !== key) {
    return "↕";
  }

  return sort.direction === "asc" ? "↑" : "↓";
}

type DetailItemProps = {
  label: string;
  value: string;
};

function DetailItem({ label, value }: DetailItemProps) {
  return (
    <div className="rounded-lg border border-ink-300/20 bg-slateglass-600/35 p-3">
      <p className="text-xs uppercase tracking-[0.14em] text-ink-300">{label}</p>
      <p className="mt-1 text-sm text-ink-50">{value}</p>
    </div>
  );
}
