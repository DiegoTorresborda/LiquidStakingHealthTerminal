"use client"

import { useState } from "react"

import type { Network } from "@data/networks"
import type { HistoricalSnapshot } from "@/lib/paf/types"

import { BenchmarkTable } from "./benchmark-table"
import { FunnelScatter } from "./funnel-scatter"
import { TrajectoryOverlay } from "./trajectory-overlay"

type Tab = "table" | "scatter" | "trajectory"

const TABS: Array<{ id: Tab; label: string; description: string }> = [
  { id: "table", label: "Table", description: "All networks side-by-side with gap-vs-ETH" },
  { id: "scatter", label: "Funnel positions", description: "Staking × liquidization scatter, colored by stage" },
  { id: "trajectory", label: "Trajectory", description: "Networks placed on ETH's historical curve" },
]

export function BenchmarksView({
  networks,
  history,
}: {
  networks: Network[]
  history: HistoricalSnapshot[]
}) {
  const [tab, setTab] = useState<Tab>("table")

  return (
    <section className="flex flex-col gap-4">
      <nav className="flex flex-wrap gap-1 rounded-xl border border-ink-300/20 bg-slateglass-700/30 p-1 backdrop-blur">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`flex-1 rounded-lg px-4 py-2.5 text-sm transition-colors ${
              tab === t.id
                ? "bg-sky-500/15 text-ink-50 ring-1 ring-sky-500/40"
                : "text-ink-200 hover:bg-ink-300/5 hover:text-ink-50"
            }`}
          >
            <span className="block font-semibold">{t.label}</span>
            <span className="block text-xs text-ink-300">{t.description}</span>
          </button>
        ))}
      </nav>

      {tab === "table" && <BenchmarkTable networks={networks} />}
      {tab === "scatter" && <FunnelScatter networks={networks} />}
      {tab === "trajectory" && <TrajectoryOverlay networks={networks} history={history} />}
    </section>
  )
}
