"use client"

import {
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Scatter,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import type { Network } from "@data/networks"
import type { HistoricalSnapshot } from "@/lib/paf/types"
import { stageColor } from "./stage-badge"

type HistoryPoint = HistoricalSnapshot & {
  liquidization: number
}

type NetworkPoint = {
  ticker: string
  network: string
  stage: string
  stakingPct: number
  liquidization: number
}

function CustomTooltip(props: {
  active?: boolean
  payload?: Array<{ payload: HistoryPoint | NetworkPoint; dataKey?: string }>
}) {
  if (!props.active || !props.payload || props.payload.length === 0) return null
  const p = props.payload[0].payload
  // ETH historical point
  if ("quarter" in p) {
    return (
      <div className="rounded-md border border-ink-300/20 bg-ink-900/95 px-3 py-2 text-xs text-ink-100 shadow-lg">
        <div className="font-semibold text-ink-50">ETH {p.quarter}</div>
        <div className="text-ink-300">Stage: {p.stage}</div>
        <div className="text-ink-300">Staking: {p.stakingRatioPct.toFixed(1)}%</div>
        <div className="text-ink-300">Liquidization: {p.liquidization.toFixed(1)}%</div>
        {p.note && <div className="mt-1 max-w-xs text-ink-200">{p.note}</div>}
      </div>
    )
  }
  // Network point
  return (
    <div className="rounded-md border border-ink-300/20 bg-ink-900/95 px-3 py-2 text-xs text-ink-100 shadow-lg">
      <div className="font-semibold text-ink-50">{p.network} ({p.ticker})</div>
      <div className="text-ink-300">Stage: {p.stage}</div>
      <div className="text-ink-300">Staking: {p.stakingPct.toFixed(1)}%</div>
      <div className="text-ink-300">Liquidization: {p.liquidization.toFixed(1)}%</div>
    </div>
  )
}

export function TrajectoryOverlay({
  networks,
  history,
}: {
  networks: Network[]
  history: HistoricalSnapshot[]
}) {
  const historyPoints: HistoryPoint[] = history.map((h) => ({
    ...h,
    liquidization: h.liquidizationRatePct ?? 0,
  }))

  const networkPoints: NetworkPoint[] = networks
    .filter((n) => n.paf && !n.isBenchmark)
    .map((n) => ({
      ticker: n.token,
      network: n.network,
      stage: n.paf!.stage,
      stakingPct: n.stakingRatioPct,
      liquidization: n.paf!.conversionRatios.liquidizationPct ?? 0,
    }))

  return (
    <div className="rounded-xl border border-ink-300/20 bg-slateglass-700/30 p-4 backdrop-blur">
      <div className="mb-3 flex flex-col gap-1">
        <h3 className="text-sm font-semibold text-ink-50">Trajectory overlay</h3>
        <p className="text-xs text-ink-300">
          Ethereum's quarterly path from Beacon Chain genesis (Q4 2020) to current. Each emerging network is placed on the curve at its current staking/liquidization coordinate — where it &quot;is&quot; in Ethereum-time.
        </p>
      </div>
      <ResponsiveContainer width="100%" height={460}>
        <ComposedChart margin={{ top: 24, right: 32, bottom: 36, left: 36 }}>
          <CartesianGrid stroke="#1F2937" strokeDasharray="3 3" />
          <XAxis
            type="number"
            dataKey="stakingPct"
            domain={[0, 100]}
            stroke="#9CA3AF"
            tick={{ fill: "#9CA3AF", fontSize: 11 }}
            label={{ value: "Staking ratio (%)", position: "bottom", fill: "#9CA3AF", fontSize: 12 }}
          />
          <YAxis
            type="number"
            dataKey="liquidization"
            domain={[0, "dataMax + 10"]}
            stroke="#9CA3AF"
            tick={{ fill: "#9CA3AF", fontSize: 11 }}
            label={{ value: "Liquidization rate (%)", angle: -90, position: "left", fill: "#9CA3AF", fontSize: 12 }}
          />
          <Tooltip content={<CustomTooltip />} />

          {/* Ethereum historical curve */}
          <Line
            type="monotone"
            data={historyPoints}
            dataKey="liquidization"
            stroke="#9CA3AF"
            strokeWidth={2}
            dot={(props: { cx?: number; cy?: number; payload?: HistoryPoint }) => {
              const { cx, cy, payload } = props
              if (cx == null || cy == null || !payload) return <g />
              return (
                <g>
                  <circle cx={cx} cy={cy} r={5} fill={stageColor(payload.stage)} stroke="#0B0D10" strokeWidth={1.5} />
                  <text x={cx + 7} y={cy + 4} fill="#9CA3AF" fontSize={9}>{payload.quarter.slice(2)}</text>
                </g>
              )
            }}
            activeDot={false}
            isAnimationActive={false}
            name="Ethereum trajectory"
          />

          {/* Emerging networks as scatter overlay */}
          <Scatter
            data={networkPoints}
            shape={(props: object & { cx?: number; cy?: number; payload?: NetworkPoint }) => {
              const { cx, cy, payload } = props
              if (cx == null || cy == null || !payload) return <g />
              return (
                <g>
                  <circle cx={cx} cy={cy} r={8} fill="#38BDF8" stroke="#0B0D10" strokeWidth={1.5} />
                  <text x={cx + 11} y={cy + 4} fill="#E5E7EB" fontSize={11} fontWeight={600}>{payload.ticker}</text>
                </g>
              )
            }}
            isAnimationActive={false}
            name="Networks"
          />
        </ComposedChart>
      </ResponsiveContainer>
      <div className="mt-3 flex flex-wrap gap-3 text-xs text-ink-200">
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block h-0.5 w-6 bg-ink-300" /> ETH trajectory (Q4&apos;20 → Q1&apos;26)
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-sky-400" /> Emerging networks
        </span>
      </div>
    </div>
  )
}
