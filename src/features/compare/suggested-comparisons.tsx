"use client"

import Link from "next/link"

import type { Network } from "@data/networks"

import { StageBadge } from "@/features/benchmarks/stage-badge"

type Preset = {
  id: string
  title: string
  blurb: string
  nets: string[]
}

const PRESETS: Preset[] = [
  {
    id: "move-l1s",
    title: "Move-based L1s",
    blurb: "Sui and Aptos head-to-head — same VM lineage, very different funnel depths.",
    nets: ["sui", "aptos"],
  },
  {
    id: "recent-mainnets",
    title: "Recent mainnet launches",
    blurb: "Monad, Hyperliquid, Initia — early-stage networks with active LST formation.",
    nets: ["monad", "hyperliquid", "initia"],
  },
  {
    id: "funnel-leaders",
    title: "Funnel leaders",
    blurb: "Aptos (S3) + Monad (S2) — the most mature emerging networks in the universe.",
    nets: ["aptos", "monad"],
  },
  {
    id: "anti-monopoly",
    title: "Anti-monopoly red flags",
    blurb: "Sei (Splashing 95%), NEAR (Meta Pool 75%), Injective (Hydro 85%) — networks blocked by single-issuer LST dominance.",
    nets: ["sei", "near", "injective"],
  },
]

/** Filter presets to those whose networks all exist in the selectable set. */
function applicablePresets(selectable: Network[]): Preset[] {
  const valid = new Set(selectable.map((n) => n.networkId))
  return PRESETS.filter((p) => p.nets.every((id) => valid.has(id)))
}

export function SuggestedComparisons({ selectableNetworks }: { selectableNetworks: Network[] }) {
  const presets = applicablePresets(selectableNetworks)
  if (presets.length === 0) return null

  const byId = new Map(selectableNetworks.map((n) => [n.networkId, n]))

  return (
    <section className="rounded-2xl border border-ink-300/20 bg-slateglass-700/30 p-5 backdrop-blur">
      <div className="mb-4 flex flex-col gap-1">
        <p className="text-xs uppercase tracking-[0.22em] text-ink-300">Suggested comparisons</p>
        <h2 className="font-[var(--font-heading)] text-lg font-semibold text-ink-50">
          Quick-pick presets
        </h2>
        <p className="text-xs text-ink-300">
          Curated sets that highlight common analytical questions. Click to load directly.
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {presets.map((p) => (
          <Link
            key={p.id}
            href={`/compare?nets=${p.nets.join(",")}`}
            className="group flex flex-col gap-2 rounded-xl border border-ink-300/15 bg-ink-900/30 p-4 transition-colors hover:border-sky-400/40 hover:bg-ink-900/50"
          >
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-semibold text-ink-50 group-hover:text-sky-100">{p.title}</h3>
              <span className="text-xs text-ink-400 group-hover:text-sky-300">→</span>
            </div>
            <p className="text-xs text-ink-300">{p.blurb}</p>
            <div className="mt-1 flex flex-wrap gap-1.5">
              {p.nets.map((id) => {
                const net = byId.get(id)
                if (!net) return null
                return (
                  <span
                    key={id}
                    className="inline-flex items-center gap-1.5 rounded-full border border-ink-300/20 bg-ink-900/40 px-2 py-0.5 text-xs text-ink-100"
                  >
                    {net.network}
                    {net.paf && <StageBadge stage={net.paf.stage} compact />}
                  </span>
                )
              })}
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
