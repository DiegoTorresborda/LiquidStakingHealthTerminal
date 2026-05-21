"use client"

import type { Network } from "@data/networks"

import { StageBadge } from "@/features/benchmarks/stage-badge"

type Step = {
  label: string
  short: string
  pct: number          // 0–100 — width of this row, relative to L1 = 100
  conversionPct: number | null // the rate going INTO this step
}

function computeFunnel(network: Network): Step[] {
  const r = network.paf?.conversionRatios
  if (!r) return []

  const staking = r.stakingParticipationPct ?? 0
  const liquidization = r.liquidizationPct ?? 0
  const defiProd = r.defiProductivityPct ?? 0
  const restaking = r.restakingPct ?? 0
  const looping = r.loopingDepthPct ?? 0

  const stakedPct = staking                                             // 100 → staked
  const lstPct = (stakedPct * liquidization) / 100                      // staked → LST
  const defiPct = (lstPct * defiProd) / 100                             // LST → DeFi-productive
  const restPct = (lstPct * restaking) / 100                            // LST → restaking
  const loopPct = (defiPct * looping) / 100                             // DeFi → looping

  return [
    { label: "L1 · Circulating supply", short: "L1", pct: 100, conversionPct: null },
    { label: "L2 · Staked", short: "L2", pct: stakedPct, conversionPct: staking },
    { label: "L3 · LST", short: "L3", pct: lstPct, conversionPct: r.liquidizationPct },
    { label: "L4.2 · LST in DeFi", short: "L4.2", pct: defiPct, conversionPct: r.defiProductivityPct },
    { label: "L4.1 · Restaking", short: "L4.1", pct: restPct, conversionPct: r.restakingPct },
    { label: "L4.2 · Looping depth", short: "Loop", pct: loopPct, conversionPct: r.loopingDepthPct },
  ]
}

export function ConversionFunnels({ entities }: { entities: Network[] }) {
  // Find ETH for the reference shape overlay
  const eth = entities.find((e) => e.isBenchmark === true)

  return (
    <section className="rounded-2xl border border-ink-300/20 bg-slateglass-700/45 p-5 shadow-glow backdrop-blur">
      <div className="mb-4 flex flex-col gap-1">
        <p className="text-xs uppercase tracking-[0.22em] text-ink-300">Funnel shape</p>
        <h2 className="font-[var(--font-heading)] text-xl font-semibold text-ink-50">
          Multiplicative conversion funnels
        </h2>
        <p className="text-xs text-ink-300">
          Starts at 100% (circulating supply) and multiplies through each layer&apos;s conversion ratio.
          The visible bar width shows how much of the original supply survives to that layer. Ethereum&apos;s
          shape is overlaid as a translucent reference on each panel.
        </p>
      </div>

      <div
        className="grid gap-3"
        style={{
          gridTemplateColumns: `repeat(auto-fit, minmax(${entities.length <= 2 ? 360 : 280}px, 1fr))`,
        }}
      >
        {entities.map((entity) => (
          <FunnelCard key={entity.networkId} entity={entity} eth={eth} />
        ))}
      </div>
    </section>
  )
}

function FunnelCard({ entity, eth }: { entity: Network; eth: Network | undefined }) {
  const steps = computeFunnel(entity)
  const ethSteps = eth && eth.networkId !== entity.networkId ? computeFunnel(eth) : null
  const isBenchmark = entity.isBenchmark === true
  const networkColor = isBenchmark ? "#FBBF24" : "#38BDF8"

  return (
    <div
      className={`flex flex-col gap-3 rounded-xl border p-4 ${
        isBenchmark
          ? "border-amber-400/40 bg-amber-500/5"
          : "border-ink-300/15 bg-ink-900/30"
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <p
            className={`font-semibold ${
              isBenchmark ? "text-amber-200" : "text-ink-50"
            }`}
          >
            {entity.network}
          </p>
          {entity.paf && <StageBadge stage={entity.paf.stage} compact />}
        </div>
        <p className="font-mono text-xs text-ink-300">
          {entity.paf?.conversionRatios.stakingParticipationPct?.toFixed(1) ?? "—"}% start
        </p>
      </div>

      <div className="flex flex-col gap-1.5">
        {steps.map((step, i) => {
          const ethPct = ethSteps?.[i]?.pct ?? null
          return (
            <FunnelRow
              key={step.short}
              step={step}
              ethRefPct={ethPct}
              color={networkColor}
              isBenchmark={isBenchmark}
            />
          )
        })}
      </div>
    </div>
  )
}

function FunnelRow({
  step,
  ethRefPct,
  color,
  isBenchmark,
}: {
  step: Step
  ethRefPct: number | null
  color: string
  isBenchmark: boolean
}) {
  // Width: clamp so very small percentages still show a visible sliver
  const visibleWidth = Math.max(2, Math.min(100, step.pct))
  const ethWidth = ethRefPct != null ? Math.max(0, Math.min(100, ethRefPct)) : null

  return (
    <div className="flex flex-col gap-0.5">
      <div className="flex items-baseline justify-between gap-2 text-[11px]">
        <span className="text-ink-200">{step.label}</span>
        <span className="font-mono text-ink-100">
          {step.pct.toFixed(2)}%
          {step.conversionPct != null && (
            <span className="ml-2 text-ink-400">
              (×{step.conversionPct.toFixed(0)}%)
            </span>
          )}
        </span>
      </div>
      <div className="relative h-3 overflow-hidden rounded bg-ink-900/60">
        {/* ETH reference shape (only on non-benchmark cards) */}
        {!isBenchmark && ethWidth != null && (
          <div
            className="absolute inset-y-0 left-0 border-r border-amber-400/40 bg-amber-500/15"
            style={{ width: `${ethWidth}%` }}
            title={`ETH reference: ${ethWidth.toFixed(2)}%`}
          />
        )}
        {/* Network bar */}
        <div
          className="absolute inset-y-0 left-0 rounded"
          style={{
            width: `${visibleWidth}%`,
            backgroundColor: color,
            opacity: 0.78,
          }}
        />
      </div>
    </div>
  )
}
