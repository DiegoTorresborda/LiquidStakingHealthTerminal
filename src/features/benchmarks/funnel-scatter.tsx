"use client"

import {
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts"

import type { Network } from "@data/networks"
import { STAGE_ORDER, stageColor } from "./stage-badge"
import type { Stage } from "@/lib/paf/types"

type Point = {
  ticker: string
  network: string
  stage: Stage
  stakingPct: number
  liquidizationPct: number
  marketCapUsd: number
  isBenchmark: boolean
}

function buildPoints(networks: Network[]): Map<Stage, Point[]> {
  const byStage = new Map<Stage, Point[]>()
  for (const stage of STAGE_ORDER) byStage.set(stage, [])

  for (const n of networks) {
    if (!n.paf) continue
    const stage = n.paf.stage
    const liquidization = n.paf.conversionRatios.liquidizationPct ?? 0
    byStage.get(stage)!.push({
      ticker: n.token,
      network: n.network,
      stage,
      stakingPct: n.stakingRatioPct,
      liquidizationPct: liquidization,
      marketCapUsd: n.marketCapUsd > 0 ? n.marketCapUsd : 1e6,
      isBenchmark: n.isBenchmark === true,
    })
  }
  return byStage
}

function TickerLabel(props: { x?: number; y?: number; payload?: Point }) {
  const { x, y, payload } = props
  if (x == null || y == null || !payload) return null
  return (
    <text x={x} y={y - 12} fill="#E5E7EB" fontSize={11} textAnchor="middle" fontWeight={500}>
      {payload.ticker}
    </text>
  )
}

function CustomTooltip(props: { active?: boolean; payload?: Array<{ payload: Point }> }) {
  if (!props.active || !props.payload || props.payload.length === 0) return null
  const p = props.payload[0].payload
  return (
    <div className="rounded-md border border-ink-300/20 bg-ink-900/95 px-3 py-2 text-xs text-ink-100 shadow-lg">
      <div className="font-semibold text-ink-50">{p.network} ({p.ticker})</div>
      <div className="mt-1 grid grid-cols-2 gap-x-3 gap-y-0.5">
        <span className="text-ink-300">Stage</span><span>{p.stage}</span>
        <span className="text-ink-300">Staking</span><span>{p.stakingPct.toFixed(1)}%</span>
        <span className="text-ink-300">Liquidization</span><span>{p.liquidizationPct.toFixed(1)}%</span>
        <span className="text-ink-300">Market Cap</span><span>${(p.marketCapUsd / 1e9).toFixed(2)}B</span>
      </div>
    </div>
  )
}

export function FunnelScatter({ networks }: { networks: Network[] }) {
  const byStage = buildPoints(networks)

  return (
    <div className="rounded-xl border border-ink-300/20 bg-slateglass-700/30 p-4 backdrop-blur">
      <div className="mb-3 flex flex-col gap-1">
        <h3 className="text-sm font-semibold text-ink-50">Funnel positions</h3>
        <p className="text-xs text-ink-300">
          x = staking ratio · y = liquidization rate · color = stage · size ∝ √(market cap). Dotted lines mark the S0→S1 (2%) and S1→S2 (20%) thresholds.
        </p>
      </div>
      <ResponsiveContainer width="100%" height={460}>
        <ScatterChart margin={{ top: 24, right: 32, bottom: 36, left: 36 }}>
          <CartesianGrid stroke="#1F2937" strokeDasharray="3 3" />
          <XAxis
            type="number"
            dataKey="stakingPct"
            name="Staking ratio"
            unit="%"
            domain={[0, 100]}
            stroke="#9CA3AF"
            tick={{ fill: "#9CA3AF", fontSize: 11 }}
            label={{ value: "Staking ratio (%)", position: "bottom", fill: "#9CA3AF", fontSize: 12 }}
          />
          <YAxis
            type="number"
            dataKey="liquidizationPct"
            name="Liquidization"
            unit="%"
            domain={[0, "dataMax + 10"]}
            stroke="#9CA3AF"
            tick={{ fill: "#9CA3AF", fontSize: 11 }}
            label={{ value: "Liquidization rate (%)", angle: -90, position: "left", fill: "#9CA3AF", fontSize: 12 }}
          />
          <ZAxis
            type="number"
            dataKey="marketCapUsd"
            range={[60, 800]}
          />
          <ReferenceLine x={2} stroke="#4B5563" strokeDasharray="3 3" label={{ value: "S0→S1", fill: "#6B7280", fontSize: 10, position: "top" }} />
          <ReferenceLine y={20} stroke="#4B5563" strokeDasharray="3 3" label={{ value: "S1→S2", fill: "#6B7280", fontSize: 10, position: "right" }} />
          <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: "3 3" }} />
          {STAGE_ORDER.map((stage) => {
            const points = byStage.get(stage) ?? []
            if (points.length === 0) return null
            return (
              <Scatter
                key={stage}
                name={stage}
                data={points}
                fill={stageColor(stage)}
                stroke="#0B0D10"
                strokeWidth={1}
                shape={(props: object & { cx?: number; cy?: number; payload?: Point }) => {
                  const { cx, cy, payload } = props
                  if (cx == null || cy == null || !payload) return <g />
                  const r = payload.isBenchmark ? 11 : 7
                  return (
                    <g>
                      <circle cx={cx} cy={cy} r={r} fill={stageColor(stage)} stroke="#0B0D10" strokeWidth={1.5} />
                      {payload.isBenchmark && (
                        <circle cx={cx} cy={cy} r={r + 4} fill="none" stroke={stageColor(stage)} strokeWidth={1} strokeDasharray="2 2" />
                      )}
                    </g>
                  )
                }}
              >
                <TickerLabel />
              </Scatter>
            )
          })}
        </ScatterChart>
      </ResponsiveContainer>
      <div className="mt-3 flex flex-wrap gap-3 text-xs text-ink-200">
        {STAGE_ORDER.filter((s) => (byStage.get(s) ?? []).length > 0).map((s) => (
          <span key={s} className="inline-flex items-center gap-1.5">
            <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: stageColor(s) }} />
            {s}
          </span>
        ))}
      </div>
    </div>
  )
}
