import Link from "next/link"

import { BenchmarksView } from "@/features/benchmarks/benchmarks-view"
import { UniverseOverview } from "@/features/benchmarks/universe-overview"
import { networks } from "@data/networks"
import pafData from "@data/paf-data.json"
import type { HistoricalSnapshot } from "@/lib/paf/types"

export const metadata = {
  title: "Network Benchmarks — LST Ecosystem Health",
  description:
    "PoS adoption funnel comparison: emerging networks vs Ethereum's historical trajectory.",
}

export default function BenchmarksPage() {
  return (
    <main className="mx-auto flex w-full max-w-[1520px] flex-col gap-6 px-4 py-6 md:px-8 md:py-8">
      <nav className="flex flex-wrap items-center gap-2">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-md border border-ink-300/25 bg-ink-900/30 px-3 py-1.5 text-sm text-ink-100 transition-colors hover:border-[#7baff5]/40 hover:bg-ink-900/50 hover:text-ink-50"
        >
          <span aria-hidden>←</span> Back to Radar
        </Link>
        <Link
          href="/compare"
          className="inline-flex items-center gap-2 rounded-md border border-sky-500/40 bg-sky-500/15 px-3 py-1.5 text-sm font-medium text-sky-200 transition-colors hover:border-sky-400/60 hover:bg-sky-500/25 hover:text-sky-100"
        >
          Compare networks <span aria-hidden>→</span>
        </Link>
      </nav>

      <header className="rounded-2xl border border-ink-300/20 bg-slateglass-700/45 p-6 shadow-glow backdrop-blur">
        <p className="text-xs uppercase tracking-[0.22em] text-ink-300">Benchmark</p>
        <h1 className="font-[var(--font-heading)] text-3xl font-semibold text-ink-50 md:text-4xl">
          PoS Adoption Funnel
        </h1>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-ink-100 md:text-base">
          Networks plotted against Ethereum&apos;s historical trajectory. Each emerging chain is
          classified across a 5-stage funnel (S0 → S4.2) using thresholds calibrated to Ethereum&apos;s
          path from Beacon Chain genesis to mature DeFi composability.
        </p>
        <p className="mt-3 text-xs text-ink-300">
          Calibration reference: Ethereum benchmark (as of {pafData.benchmarkAsOf}). See{" "}
          <code className="rounded bg-ink-900/40 px-1 py-0.5">paf-toolkit/</code> for the source-of-truth YAMLs.
        </p>
      </header>

      <UniverseOverview networks={networks} />

      <BenchmarksView
        networks={networks}
        history={pafData.ethereumHistory as HistoricalSnapshot[]}
      />
    </main>
  )
}
