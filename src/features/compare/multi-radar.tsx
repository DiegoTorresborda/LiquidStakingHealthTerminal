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

const AXES: Array<{
  key: keyof NonNullable<Network["paf"]>["conversionRatios"]
  label: string
}> = [
  { key: "stakingParticipationPct", label: "Staking" },
  { key: "liquidizationPct", label: "Liquidization" },
  { key: "defiProductivityPct", label: "DeFi prod." },
  { key: "restakingPct", label: "Restaking" },
  { key: "loopingDepthPct", label: "Looping" },
]

// Series-distinct colors for emerging networks (Ethereum always uses rose).
// Stable per-position so swapping selections doesn't flicker the palette.
const SERIES_COLORS = ["#38BDF8", "#34D399", "#FBBF24", "#A78BFA", "#FB923C"]

type RadarRow = Record<string, number | string>

export function MultiRadar({ entities }: { entities: Network[] }) {
  // Build the data array: one row per axis, columns are entities by networkId.
  const data: RadarRow[] = AXES.map(({ key, label }) => {
    const row: RadarRow = { axis: label }
    for (const entity of entities) {
      const v = entity.paf?.conversionRatios[key]
      // Use 0 for null so the radar still renders the polygon; Tooltip notes it.
      row[entity.networkId] = v ?? 0
    }
    return row
  })

  const seriesList = entities.map((entity, i) => {
    const color = entity.isBenchmark ? "#FB7185" : SERIES_COLORS[i % SERIES_COLORS.length]
    return { entity, color }
  })

  return (
    <section className="rounded-2xl border border-ink-300/20 bg-slateglass-700/45 p-5 shadow-glow backdrop-blur">
      <div className="mb-4 flex flex-col gap-1">
        <p className="text-xs uppercase tracking-[0.22em] text-ink-300">5-axis overlay</p>
        <h2 className="font-[var(--font-heading)] text-xl font-semibold text-ink-50">
          Conversion ratios radar
        </h2>
        <p className="text-xs text-ink-300">
          Each axis is a conversion ratio (0–100%). Ethereum is shown in rose as the baseline; emerging
          networks overlay in distinct colors. Larger polygons = more funnel-mature.
        </p>
      </div>

      <ResponsiveContainer width="100%" height={420}>
        <RadarChart data={data} outerRadius="75%">
          <PolarGrid stroke="#374151" />
          <PolarAngleAxis dataKey="axis" tick={{ fill: "#D1D5DB", fontSize: 12 }} />
          <PolarRadiusAxis
            domain={[0, 100]}
            tick={{ fill: "#9CA3AF", fontSize: 9 }}
            stroke="#374151"
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#0B0D10",
              border: "1px solid #374151",
              borderRadius: 6,
              fontSize: 12,
            }}
            labelStyle={{ color: "#F3F4F6" }}
            formatter={(value, _name, entry) => {
              const networkId = (entry as { dataKey?: string } | undefined)?.dataKey
              const entity = entities.find((e) => e.networkId === networkId)
              const label = entity ? entity.network : networkId ?? ""
              const num = typeof value === "number" ? value.toFixed(1) : value
              return [`${num}%`, label]
            }}
          />
          {seriesList.map(({ entity, color }) => (
            <Radar
              key={entity.networkId}
              name={entity.network}
              dataKey={entity.networkId}
              stroke={color}
              fill={color}
              fillOpacity={entity.isBenchmark ? 0.12 : 0.18}
              strokeWidth={2}
            />
          ))}
        </RadarChart>
      </ResponsiveContainer>

      <div className="mt-3 flex flex-wrap justify-center gap-3 text-xs">
        {seriesList.map(({ entity, color }) => (
          <span key={entity.networkId} className="inline-flex items-center gap-1.5 text-ink-200">
            <span
              className="inline-block h-2 w-3 rounded-sm"
              style={{ backgroundColor: color }}
            />
            {entity.network}
            {entity.isBenchmark && <span className="text-amber-300">(baseline)</span>}
          </span>
        ))}
      </div>

    </section>
  )
}
