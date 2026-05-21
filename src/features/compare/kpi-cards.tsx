"use client"

import Link from "next/link"

import type { Network } from "@data/networks"
import { StageBadge, stageColor } from "@/features/benchmarks/stage-badge"

const RATIO_AXES: Array<{
  key: keyof NonNullable<Network["paf"]>["conversionRatios"]
  label: string
}> = [
  { key: "stakingParticipationPct", label: "Staking" },
  { key: "liquidizationPct", label: "Liquidization" },
  { key: "defiProductivityPct", label: "DeFi productivity" },
  { key: "restakingPct", label: "Restaking" },
  { key: "loopingDepthPct", label: "Looping depth" },
]

function fmtUsd(n: number): string {
  if (n >= 1e9) return `$${(n / 1e9).toFixed(2)}B`
  if (n >= 1e6) return `$${(n / 1e6).toFixed(1)}M`
  return `$${n.toFixed(0)}`
}

function fmtPct(v: number | null): string {
  if (v == null) return "—"
  return `${v.toFixed(1)}%`
}

function fmtInt(n: number): string {
  if (n >= 1e6) return `${(n / 1e6).toFixed(2)}M`
  if (n >= 1e3) return `${(n / 1e3).toFixed(1)}K`
  return n.toFixed(0)
}

export function KpiCards({ entities }: { entities: Network[] }) {
  return (
    <section className="rounded-2xl border border-ink-300/20 bg-slateglass-700/45 p-5 shadow-glow backdrop-blur">
      <div className="mb-4 flex flex-col gap-1">
        <p className="text-xs uppercase tracking-[0.22em] text-ink-300">Side-by-side</p>
        <h2 className="font-[var(--font-heading)] text-xl font-semibold text-ink-50">
          Snapshot per network
        </h2>
        <p className="text-xs text-ink-300">
          Each card shows the funnel stage, the five conversion ratios as mini-bars, and key counters.
        </p>
      </div>

      <div
        className="grid gap-3"
        style={{
          gridTemplateColumns: `repeat(auto-fit, minmax(${entities.length <= 2 ? 320 : 240}px, 1fr))`,
        }}
      >
        {entities.map((entity) => (
          <Card key={entity.networkId} entity={entity} />
        ))}
      </div>
    </section>
  )
}

function Card({ entity }: { entity: Network }) {
  const isBenchmark = entity.isBenchmark === true
  const paf = entity.paf

  return (
    <div
      className={`flex flex-col gap-3 rounded-xl border p-4 transition-colors ${
        isBenchmark
          ? "border-amber-400/40 bg-gradient-to-br from-amber-500/8 via-transparent to-transparent shadow-[0_0_18px_rgba(251,191,36,0.08)]"
          : "border-ink-300/15 bg-ink-900/30 hover:border-ink-300/30"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-col gap-1">
          <p
            className={`font-semibold ${
              isBenchmark ? "text-amber-200" : "text-ink-50"
            }`}
          >
            {entity.network}
          </p>
          <div className="flex flex-wrap items-center gap-1.5">
            {paf && <StageBadge stage={paf.stage} compact />}
            {isBenchmark && (
              <span className="rounded border border-amber-400/40 bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-amber-200">
                Reference
              </span>
            )}
          </div>
        </div>
        <Link
          href={`/network/${entity.networkId}`}
          className="text-xs text-ink-300 transition-colors hover:text-sky-300"
        >
          detail →
        </Link>
      </div>

      {paf && (
        <div className="flex flex-col gap-1.5">
          {RATIO_AXES.map(({ key, label }) => {
            const value = paf.conversionRatios[key]
            return (
              <MiniBar
                key={key}
                label={label}
                value={value}
                color={isBenchmark ? "#FBBF24" : stageColor(paf.stage)}
              />
            )
          })}
        </div>
      )}

      <div className="grid grid-cols-2 gap-2 border-t border-ink-300/15 pt-3 text-xs">
        <Stat label="Market cap" value={fmtUsd(entity.marketCapUsd)} />
        <Stat label="Validators" value={fmtInt(entity.validatorCount)} />
        <Stat label="Staking APY" value={fmtPct(entity.stakingApyPct)} />
        <Stat label="LST TVL" value={entity.lstTvlUsd > 0 ? fmtUsd(entity.lstTvlUsd) : "—"} />
      </div>
    </div>
  )
}

function MiniBar({ label, value, color }: { label: string; value: number | null; color: string }) {
  const display = value == null ? "—" : `${value.toFixed(1)}%`
  const widthPct = value == null ? 0 : Math.min(100, Math.max(0, value))
  return (
    <div className="flex flex-col gap-0.5">
      <div className="flex items-baseline justify-between text-[11px]">
        <span className="text-ink-300">{label}</span>
        <span className="font-mono text-ink-100">{display}</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-ink-900/60">
        <div
          className="h-full rounded-full transition-all"
          style={{
            width: `${widthPct}%`,
            backgroundColor: color,
            opacity: value == null ? 0 : 0.75,
          }}
        />
      </div>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col">
      <span className="text-[10px] uppercase tracking-wider text-ink-400">{label}</span>
      <span className="text-sm text-ink-50">{value}</span>
    </div>
  )
}
