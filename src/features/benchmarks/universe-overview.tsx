"use client"

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"

import type { Network } from "@data/networks"
import type { Stage } from "@/lib/paf/types"

import { STAGE_ORDER, stageColor } from "./stage-badge"

type Props = {
  networks: Network[]   // all networks (with and without PAF)
}

const STAGE_DESCR: Record<Stage, string> = {
  S0: "Pre-staking",
  S1: "Securing",
  S2: "Liquidizing",
  S3: "Productive",
  "S4.1": "Restaking era",
  "S4.2": "Composable mature",
  "S*": "Native LS",
}

function fmtUsd(n: number): string {
  if (n >= 1e12) return `$${(n / 1e12).toFixed(2)}T`
  if (n >= 1e9) return `$${(n / 1e9).toFixed(2)}B`
  if (n >= 1e6) return `$${(n / 1e6).toFixed(1)}M`
  return `$${n.toFixed(0)}`
}

export function UniverseOverview({ networks }: Props) {
  const pafNetworks = networks.filter((n) => n.paf != null)
  const ethereum = networks.find((n) => n.isBenchmark === true)

  // Stage distribution
  const stageDist = new Map<Stage, number>()
  for (const stage of STAGE_ORDER) stageDist.set(stage, 0)
  for (const n of pafNetworks) {
    if (n.paf) {
      stageDist.set(n.paf.stage, (stageDist.get(n.paf.stage) ?? 0) + 1)
    }
  }

  const donutData = STAGE_ORDER.filter((s) => (stageDist.get(s) ?? 0) > 0).map((stage) => ({
    name: `${stage} · ${STAGE_DESCR[stage]}`,
    stage,
    value: stageDist.get(stage) ?? 0,
  }))

  // Aggregates
  const totalMcap = pafNetworks.reduce((s, n) => s + (n.marketCapUsd || 0), 0)
  const totalLstTvl = pafNetworks.reduce((s, n) => s + (n.lstTvlUsd || 0), 0)
  const totalStakedUsd = pafNetworks.reduce((s, n) => s + (n.stakedValueUsd || 0), 0)
  const avgStakingRatio =
    pafNetworks.length > 0
      ? pafNetworks.reduce((s, n) => s + (n.stakingRatioPct || 0), 0) / pafNetworks.length
      : 0

  // BD shortlist: S1 networks with liquidization > 15% (near S2)
  const bdShortlist = pafNetworks
    .filter(
      (n) =>
        n.paf?.stage === "S1" &&
        (n.paf.conversionRatios.liquidizationPct ?? 0) > 15 &&
        !n.isBenchmark,
    )
    .sort(
      (a, b) =>
        (b.paf!.conversionRatios.liquidizationPct ?? 0) -
        (a.paf!.conversionRatios.liquidizationPct ?? 0),
    )
    .slice(0, 4)

  return (
    <section className="rounded-2xl border border-ink-300/20 bg-slateglass-700/45 p-6 shadow-glow backdrop-blur">
      <div className="mb-4 flex flex-col gap-1">
        <p className="text-xs uppercase tracking-[0.22em] text-ink-300">Universe overview</p>
        <h2 className="font-[var(--font-heading)] text-xl font-semibold text-ink-50">
          {pafNetworks.length} networks tracked, calibrated against Ethereum
        </h2>
      </div>

      <div className="grid gap-5 lg:grid-cols-[280px_1fr]">
        {/* Donut: stage distribution */}
        <div className="rounded-xl border border-ink-300/15 bg-ink-900/30 p-3">
          <p className="mb-2 text-xs uppercase tracking-wider text-ink-300">Stage distribution</p>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={donutData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={90}
                paddingAngle={2}
                stroke="#0B0D10"
                strokeWidth={2}
                isAnimationActive={false}
              >
                {donutData.map((d) => (
                  <Cell key={d.stage} fill={stageColor(d.stage)} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0B0D10",
                  border: "1px solid #374151",
                  borderRadius: 6,
                  fontSize: 12,
                }}
                formatter={(value) => [`${value} networks`, ""]}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-1 grid grid-cols-2 gap-1 text-xs">
            {donutData.map((d) => (
              <span key={d.stage} className="inline-flex items-center gap-1.5 text-ink-200">
                <span
                  className="inline-block h-2 w-2 rounded-full"
                  style={{ backgroundColor: stageColor(d.stage) }}
                />
                <span className="font-mono">{d.value}</span>
                <span>{d.stage}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Aggregates + BD shortlist */}
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <Stat label="Total market cap" value={fmtUsd(totalMcap)} />
            <Stat label="Total staked" value={fmtUsd(totalStakedUsd)} sub={`avg ratio ${avgStakingRatio.toFixed(1)}%`} />
            <Stat label="Total LST TVL" value={fmtUsd(totalLstTvl)} />
            <Stat
              label="ETH benchmark"
              value={ethereum ? "S4.2" : "—"}
              sub={ethereum ? `${fmtUsd(ethereum.marketCapUsd)} mc` : ""}
            />
          </div>

          <div className="rounded-xl border border-sky-500/20 bg-sky-500/5 p-4">
            <p className="mb-2 text-xs uppercase tracking-wider text-sky-300">
              BD shortlist — S1 networks near the S2 threshold
            </p>
            {bdShortlist.length === 0 ? (
              <p className="text-sm text-ink-300">None close to S2 yet.</p>
            ) : (
              <ul className="flex flex-wrap gap-2 text-sm">
                {bdShortlist.map((n) => (
                  <li
                    key={n.networkId}
                    className="inline-flex items-center gap-2 rounded-md border border-ink-300/20 bg-ink-900/40 px-2 py-1"
                  >
                    <span className="font-medium text-ink-50">{n.network}</span>
                    <span className="font-mono text-xs text-sky-300">
                      {n.paf!.conversionRatios.liquidizationPct?.toFixed(1)}% liq.
                    </span>
                  </li>
                ))}
              </ul>
            )}
            <p className="mt-2 text-[11px] text-ink-400">
              Liquidization {">"} 15% but still under the 20% S1→S2 trigger. These are the highest-leverage BD targets.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

function Stat({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-lg border border-ink-300/15 bg-ink-900/30 p-3">
      <p className="text-[10px] uppercase tracking-wider text-ink-400">{label}</p>
      <p className="mt-1 font-[var(--font-heading)] text-lg font-semibold text-ink-50">{value}</p>
      {sub && <p className="mt-0.5 text-xs text-ink-300">{sub}</p>}
    </div>
  )
}
