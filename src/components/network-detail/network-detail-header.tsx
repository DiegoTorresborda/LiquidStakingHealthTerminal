import Link from "next/link";

import type { NetworkDetailSummary } from "@/features/network-detail/types";
import {
  formatPercent,
  formatUsdCompact,
  healthScoreClass,
  lpAttractivenessClass,
  opportunityScoreClass
} from "@/features/network-detail/utils";

type NetworkDetailHeaderProps = {
  summary: NetworkDetailSummary;
};

export function NetworkDetailHeader({ summary }: NetworkDetailHeaderProps) {
  return (
    <section className="surface-grid rounded-2xl border border-ink-300/20 bg-slateglass-700/45 p-6 shadow-glow backdrop-blur">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <Link
              href="/"
              className="inline-flex rounded-md border border-ink-300/30 bg-ink-900/25 px-3 py-1 text-xs font-medium text-ink-100 hover:bg-ink-900/40"
            >
              Back to Radar
            </Link>
            <p className="mt-4 text-xs uppercase tracking-[0.2em] text-ink-300">Network Diagnosis</p>
            <h1 className="font-[var(--font-heading)] text-3xl font-semibold text-ink-50 md:text-4xl">
              {summary.networkName} ({summary.token})
            </h1>
            <p className="mt-2 text-sm text-ink-200">{summary.category}</p>
            <p className="mt-4 max-w-3xl text-sm leading-relaxed text-ink-100 md:text-base">{summary.diagnosis}</p>
          </div>

          <div className="grid w-full max-w-md gap-3 rounded-2xl border border-ink-300/20 bg-ink-900/30 p-4">
            <div className="grid grid-cols-2 gap-2">
              <Metric label="Market Cap" value={formatUsdCompact(summary.marketCapUsd)} />
              <Metric label="% Staked" value={formatPercent(summary.stakingRatioPct)} />
              <Metric label="Staking APY" value={formatPercent(summary.stakingApyPct)} />
              <Metric label="DeFi TVL" value={formatUsdCompact(summary.defiTvlUsd)} />
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              <span className={`rounded-md border px-2.5 py-1 text-sm font-semibold ${healthScoreClass(summary.globalLstHealthScore)}`}>
                Health Score: {summary.globalLstHealthScore}
              </span>
              <span className={`rounded-md border px-2.5 py-1 text-sm font-semibold ${opportunityScoreClass(summary.opportunityScore)}`}>
                Score Potential: {summary.opportunityScore}
              </span>
              <span className={`rounded-md border px-2.5 py-1 text-sm font-semibold ${lpAttractivenessClass(summary.lpAttractiveness)}`}>
                LP Attractiveness: {summary.lpAttractiveness}
              </span>
              {summary.scoringMode && (
                <span className={`rounded-md border px-2.5 py-1 text-sm font-semibold ${summary.scoringMode === "lst-active" ? "border-cyan-400/40 bg-cyan-400/10 text-cyan-300" : "border-amber-400/40 bg-amber-400/10 text-amber-300"}`}>
                  {summary.scoringMode === "lst-active" ? "LST Active" : "Pre-LST"}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

type MetricProps = {
  label: string;
  value: string;
};

function Metric({ label, value }: MetricProps) {
  return (
    <div className="rounded-lg border border-ink-300/20 bg-slateglass-600/40 p-3">
      <p className="text-xs uppercase tracking-[0.14em] text-ink-300">{label}</p>
      <p className="mt-1 text-sm font-semibold text-ink-50">{value}</p>
    </div>
  );
}
