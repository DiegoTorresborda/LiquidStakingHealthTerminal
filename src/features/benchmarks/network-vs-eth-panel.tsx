"use client"

import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts"

import type { Network } from "@data/networks"
import { StageBadge } from "./stage-badge"

type AxisRow = { axis: string; network: number; ethereum: number }

const AXES: Array<{ key: keyof NonNullable<Network["paf"]>["conversionRatios"]; label: string }> = [
  { key: "stakingParticipationPct", label: "Staking" },
  { key: "liquidizationPct", label: "Liquidization" },
  { key: "defiProductivityPct", label: "DeFi productivity" },
  { key: "restakingPct", label: "Restaking" },
  { key: "loopingDepthPct", label: "Looping depth" },
]

export function NetworkVsEthPanel({ network, ethereum }: { network: Network; ethereum: Network }) {
  if (!network.paf || !ethereum.paf) return null

  const data: AxisRow[] = AXES.map(({ key, label }) => ({
    axis: label,
    network: network.paf!.conversionRatios[key] ?? 0,
    ethereum: ethereum.paf!.conversionRatios[key] ?? 0,
  }))

  return (
    <section className="flex flex-col gap-4 rounded-2xl border border-ink-300/20 bg-slateglass-700/45 p-5 shadow-glow backdrop-blur">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-ink-300">PoS Adoption Funnel</p>
          <div className="mt-1 flex items-center gap-3">
            <h2 className="font-[var(--font-heading)] text-2xl font-semibold text-ink-50">
              {network.network} vs Ethereum
            </h2>
            <StageBadge stage={network.paf.stage} />
          </div>
          <p className="mt-1 text-sm text-ink-200">{network.paf.trajectory}</p>
        </div>
        <a
          href="/benchmarks"
          className="rounded-md border border-ink-300/30 px-3 py-1.5 text-xs text-ink-100 transition-colors hover:bg-ink-300/10"
        >
          View benchmarks →
        </a>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_1fr]">
        {/* Radar */}
        <div className="rounded-xl border border-ink-300/15 bg-ink-900/20 p-3">
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={data} outerRadius="75%">
              <PolarGrid stroke="#374151" />
              <PolarAngleAxis dataKey="axis" tick={{ fill: "#D1D5DB", fontSize: 11 }} />
              <PolarRadiusAxis tick={{ fill: "#9CA3AF", fontSize: 9 }} stroke="#374151" />
              <Radar
                name="Ethereum"
                dataKey="ethereum"
                stroke="#FB7185"
                fill="#FB7185"
                fillOpacity={0.15}
                strokeWidth={2}
              />
              <Radar
                name={network.network}
                dataKey="network"
                stroke="#38BDF8"
                fill="#38BDF8"
                fillOpacity={0.25}
                strokeWidth={2}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0B0D10",
                  border: "1px solid #374151",
                  borderRadius: 6,
                  fontSize: 12,
                }}
                labelStyle={{ color: "#F3F4F6" }}
              />
            </RadarChart>
          </ResponsiveContainer>
          <div className="mt-2 flex justify-center gap-4 text-xs">
            <span className="inline-flex items-center gap-1.5 text-ink-200">
              <span className="inline-block h-2 w-3 rounded-sm bg-sky-400/70" /> {network.network}
            </span>
            <span className="inline-flex items-center gap-1.5 text-ink-200">
              <span className="inline-block h-2 w-3 rounded-sm bg-rose-400/70" /> Ethereum
            </span>
          </div>
        </div>

        {/* Strengths & gaps */}
        <div className="flex flex-col gap-4">
          {network.paf.strengths.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-emerald-300">Strengths</h3>
              <ul className="mt-2 space-y-1.5 text-sm text-ink-100">
                {network.paf.strengths.map((s, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-emerald-400">▸</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {network.paf.gaps.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-amber-300">Gaps</h3>
              <ul className="mt-2 space-y-1.5 text-sm text-ink-100">
                {network.paf.gaps.slice(0, 3).map((g, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-amber-400">▸</span>
                    <span>{g}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      <div className="rounded-lg border border-sky-500/20 bg-sky-500/5 p-3 text-sm text-ink-100">
        <span className="text-xs font-semibold uppercase tracking-wider text-sky-300">BD recommendation</span>
        <p className="mt-1">{network.paf.bdRecommendation}</p>
      </div>
    </section>
  )
}
