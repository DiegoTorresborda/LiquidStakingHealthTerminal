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

type MockedVisibilityMode = "Show" | "No Show";

const MOCKED_VISIBILITY_MODE: MockedVisibilityMode =
  process.env.NEXT_PUBLIC_MOCKED_VISIBILITY_MODE === "No Show" ? "No Show" : "Show";

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
  { key: "globalLstHealthScore", label: "Global LST Health", align: "right" },
  { key: "lstProtocols", label: "# of LSTs", align: "right" },
  { key: "lstPenetrationPct", label: "LST / Staked %", align: "right" },
  { key: "defiTvlUsd", label: "DeFi TVL", align: "right" },
  { key: "opportunityScore", label: "Score Potential", align: "right" }
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
                    onClick={(event) => {
                      if (shouldIgnoreRowNavigation(event.target)) {
                        return;
                      }
                      onOpenNetwork(network.networkId);
                    }}
                    role="link"
                    tabIndex={0}
                    onKeyDown={(event) => {
                      if (shouldIgnoreRowNavigation(event.target)) {
                        return;
                      }
                      if (event.key === "Enter") {
                        onOpenNetwork(network.networkId);
                      }
                    }}
                  >
                    <td className="rounded-l-xl px-3 py-3 align-top">
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-ink-50">{network.network}</p>
                          <span className={`inline-flex rounded-md border px-2 py-0.5 text-xs ${resolveStatusClass(network.status)}`}>
                            {network.status}
                          </span>
                        </div>
                        <p className="text-xs text-ink-300">{network.category}</p>
                        <div className="mt-0.5 flex flex-nowrap items-center gap-2 overflow-x-auto overflow-y-visible whitespace-nowrap pr-1">
                          <button
                            type="button"
                            data-no-row-nav="true"
                            onClick={(event) => {
                              event.stopPropagation();
                              onToggleExpanded(network.networkId);
                            }}
                            className="inline-flex px-0 py-0 text-xs font-semibold text-[#cfe2ff] hover:text-[#e6f0ff]"
                          >
                            {isExpanded ? "Hide details" : "Show details"}
                          </button>
                          <ChainResourcesQuickAction networkId={network.networkId} />
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-sm text-ink-50">{network.token}</td>
                    <td className="px-3 py-3 text-right text-sm text-ink-100">{formatUsdCompact(network.marketCapUsd)}</td>
                    <td className="px-3 py-3 text-right text-sm text-ink-100">{formatPercent(network.stakingRatioPct)}</td>
                    <td className="px-3 py-3 text-right text-sm text-ink-100">{formatPercent(network.stakingApyPct)}</td>
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
                      <td colSpan={10} className="px-3 pb-3">
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
                            <DetailItem
                              label="% Staked"
                              value={formatStakedRatioDisplay(network.stakedTokens, network.circulatingSupply, network.stakingRatioPct)}
                              mocked={isStakedRatioDisplayMocked(network)}
                            />
                            <DetailItem
                              label="Tokens in Circulation"
                              value={formatInteger(network.circulatingSupply)}
                              mocked={isMetricMocked(network, "circulatingSupply")}
                            />
                            <DetailItem
                              label="Tokens Staked"
                              value={formatTokenStaked(network.stakedTokens, network.token)}
                              mocked={isMetricMocked(network, "stakedTokens")}
                            />
                            <DetailItem label="Staked Value USD" value={formatUsdFull(network.stakedValueUsd)} mocked={isStakedValueMocked(network)} />
                            <DetailItem
                              label="Validator Count"
                              value={formatInteger(network.validatorCount)}
                              mocked={isMetricMocked(network, "validatorCount")}
                            />
                            <DetailItem label="Largest LST" value={network.largestLst || "N/A"} mocked={isLargestLstMocked(network)} />
                            <DetailItem
                              label="Stablecoin Liquidity"
                              value={formatUsdFull(network.stablecoinLiquidityUsd)}
                              mocked={isMetricMocked(network, "stablecoinLiquidityUsd")}
                            />
                            <DetailItem label="Lending Presence" value={booleanLabel(network.lendingPresence)} mocked />
                            <DetailItem label="LST as Collateral" value={booleanLabel(network.lstCollateralEnabled)} mocked />
                            <DetailItem label="Health Score (Raw)" value={`${network.healthScoreRaw}`} mocked />
                            <DetailItem
                              label="Health Penalties"
                              value={network.healthScorePenaltyPoints > 0 ? `-${network.healthScorePenaltyPoints}` : "0"}
                              mocked
                            />
                            <DetailItem label="Health Score (Capped)" value={`${network.healthScoreCapped}`} mocked />
                            <DetailItem label="Main Bottleneck" value={network.mainBottleneck} mocked />
                            <DetailItem label="Main Opportunity" value={network.mainOpportunity} mocked />
                            <DetailItem label="Status Tag" value={network.status} mocked />
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

function shouldIgnoreRowNavigation(target: EventTarget | null): boolean {
  if (!target) {
    return false;
  }

  if (target instanceof HTMLElement) {
    return target.closest("[data-no-row-nav='true']") !== null;
  }

  if (target instanceof Text) {
    return target.parentElement?.closest("[data-no-row-nav='true']") !== null;
  }

  return false;
}

function isMetricMocked(network: RadarNetwork, metric: string): boolean {
  const quality = network.fieldQuality?.[metric];
  return quality === "missing" || quality === "simulated";
}

function isStakedValueMocked(network: RadarNetwork): boolean {
  return isMetricMocked(network, "marketCapUsd") || isMetricMocked(network, "stakingRatioPct");
}

function isStakedRatioDisplayMocked(network: RadarNetwork): boolean {
  const hasValidTokenRatio =
    typeof network.stakedTokens === "number" &&
    Number.isFinite(network.stakedTokens) &&
    typeof network.circulatingSupply === "number" &&
    Number.isFinite(network.circulatingSupply) &&
    network.circulatingSupply > 0 &&
    network.stakedTokens >= 0 &&
    (network.stakedTokens / network.circulatingSupply) * 100 <= 100;

  if (hasValidTokenRatio) {
    return isMetricMocked(network, "stakedTokens") || isMetricMocked(network, "circulatingSupply");
  }

  return isMetricMocked(network, "stakingRatioPct");
}

function isLargestLstMocked(network: RadarNetwork): boolean {
  return !network.largestLst || network.largestLst.trim().length === 0;
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
  mocked?: boolean;
};

function DetailItem({ label, value, mocked = false }: DetailItemProps) {
  const showMockedStyling = MOCKED_VISIBILITY_MODE === "Show";
  const effectiveMocked = mocked && showMockedStyling;

  return (
    <div
      className={`rounded-lg border p-3 ${
        effectiveMocked ? "border-amber/45 bg-amber/10" : "border-ink-300/20 bg-slateglass-600/35"
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <p className={`text-xs uppercase tracking-[0.14em] ${effectiveMocked ? "text-amber" : "text-ink-300"}`}>{label}</p>
        {effectiveMocked ? (
          <span className="rounded border border-amber/45 bg-amber/15 px-1.5 py-0.5 text-[10px] uppercase tracking-[0.12em] text-amber">
            Mock
          </span>
        ) : null}
      </div>
      <p className={`mt-1 text-sm ${effectiveMocked ? "font-semibold text-amber-200" : "text-ink-50"}`}>{value}</p>
    </div>
  );
}

function formatTokenStaked(value: number | null | undefined, token: string): string {
  const amount = formatInteger(value ?? null);
  if (amount === "N/A") {
    return amount;
  }

  return `${amount} ${token}`;
}

function formatStakedRatioDisplay(
  stakedTokens: number | null | undefined,
  circulatingSupply: number | null | undefined,
  fallbackRatioPct: number | null | undefined
): string {
  const hasTokenInputs =
    typeof stakedTokens === "number" &&
    Number.isFinite(stakedTokens) &&
    typeof circulatingSupply === "number" &&
    Number.isFinite(circulatingSupply) &&
    circulatingSupply > 0;

  if (hasTokenInputs) {
    const ratioFromTokens = (stakedTokens / circulatingSupply) * 100;
    if (Number.isFinite(ratioFromTokens) && ratioFromTokens >= 0 && ratioFromTokens <= 100) {
      return `${ratioFromTokens.toFixed(1)}%`;
    }
  }

  if (typeof fallbackRatioPct === "number" && Number.isFinite(fallbackRatioPct)) {
    return `${fallbackRatioPct.toFixed(1)}%`;
  }

  return "N/A";
}
