"use client"

import {
  Bar,
  BarChart,
  Cell,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import type { Network } from "@data/networks"

const RATIOS: Array<{
  key: keyof NonNullable<Network["paf"]>["conversionRatios"]
  label: string
  helper: string
}> = [
  { key: "stakingParticipationPct", label: "Staking participation", helper: "L1 → L2" },
  { key: "liquidizationPct", label: "Liquidization rate", helper: "L2 → L3" },
  { key: "defiProductivityPct", label: "DeFi productivity", helper: "L3 → L4.2" },
  { key: "restakingPct", label: "Restaking rate", helper: "L3 → L4.1" },
  { key: "loopingDepthPct", label: "Looping depth", helper: "L4.1 → L4.2" },
]

type Row = {
  networkId: string
  label: string
  value: number
  isBenchmark: boolean
}

function buildRows(
  entities: Network[],
  ratioKey: keyof NonNullable<Network["paf"]>["conversionRatios"],
): Row[] {
  return entities
    .map((e) => ({
      networkId: e.networkId,
      label: e.network,
      value: e.paf?.conversionRatios[ratioKey] ?? null,
      isBenchmark: e.isBenchmark === true,
    }))
    .filter((r): r is Row => r.value != null && Number.isFinite(r.value))
    .sort((a, b) => b.value - a.value)
}

export function BarLeaderboards({ entities }: { entities: Network[] }) {
  return (
    <section className="rounded-2xl border border-ink-300/20 bg-slateglass-700/45 p-5 shadow-glow backdrop-blur">
      <div className="mb-4 flex flex-col gap-1">
        <p className="text-xs uppercase tracking-[0.22em] text-ink-300">Leaderboards</p>
        <h2 className="font-[var(--font-heading)] text-xl font-semibold text-ink-50">
          Per-ratio rankings
        </h2>
        <p className="text-xs text-ink-300">
          One bar chart per conversion ratio. Networks sorted descending. Ethereum bar shown in amber as
          the baseline; emerging networks above it lead that metric, below trail it.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {RATIOS.map((ratio) => {
          const rows = buildRows(entities, ratio.key)
          return (
            <div
              key={ratio.key}
              className="rounded-xl border border-ink-300/15 bg-ink-900/25 p-3"
            >
              <div className="mb-1 flex items-baseline justify-between">
                <h3 className="text-sm font-semibold text-ink-50">{ratio.label}</h3>
                <span className="text-[10px] uppercase tracking-wider text-ink-400">
                  {ratio.helper}
                </span>
              </div>
              {rows.length === 0 ? (
                <p className="py-6 text-center text-xs text-ink-400">
                  No data for any selected network.
                </p>
              ) : (
                <ResponsiveContainer width="100%" height={Math.max(140, rows.length * 32)}>
                  <BarChart
                    data={rows}
                    layout="vertical"
                    margin={{ top: 4, right: 40, bottom: 4, left: 6 }}
                  >
                    <XAxis
                      type="number"
                      domain={[0, "dataMax + 5"]}
                      hide
                    />
                    <YAxis
                      type="category"
                      dataKey="label"
                      tick={{ fill: "#D1D5DB", fontSize: 11 }}
                      stroke="#374151"
                      width={92}
                    />
                    <Tooltip
                      cursor={{ fill: "#1F2937", opacity: 0.4 }}
                      contentStyle={{
                        backgroundColor: "#0B0D10",
                        border: "1px solid #374151",
                        borderRadius: 6,
                        fontSize: 12,
                      }}
                      formatter={(value) => [
                        `${typeof value === "number" ? value.toFixed(1) : value}%`,
                        ratio.label,
                      ]}
                    />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                      {rows.map((row) => (
                        <Cell
                          key={row.networkId}
                          fill={row.isBenchmark ? "#FBBF24" : "#38BDF8"}
                          opacity={row.isBenchmark ? 0.9 : 0.85}
                        />
                      ))}
                      <LabelList
                        dataKey="value"
                        position="right"
                        formatter={(v) => (typeof v === "number" ? `${v.toFixed(1)}%` : "")}
                        fill="#E5E7EB"
                        fontSize={11}
                      />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}
