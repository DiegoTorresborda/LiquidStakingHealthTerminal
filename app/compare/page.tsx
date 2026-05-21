import Link from "next/link"
import { Suspense } from "react"

import { networks } from "@data/networks"
import { ComparisonView } from "@/features/compare/comparison-view"

export const metadata = {
  title: "Compare Networks — LST Ecosystem Health",
  description:
    "Pick up to 5 PoS networks and compare them side-by-side against Ethereum across the 5-layer adoption funnel.",
}

export default function ComparePage() {
  const ethereum = networks.find((n) => n.isBenchmark === true)
  const selectable = networks.filter((n) => !n.isBenchmark && n.paf != null)

  if (!ethereum) {
    return (
      <main className="mx-auto flex w-full max-w-[1520px] flex-col gap-6 px-4 py-6 md:px-8 md:py-8">
        <p className="text-ink-200">
          Ethereum benchmark not loaded. Run <code className="rounded bg-ink-900/40 px-1 py-0.5">npm run data:sync:paf</code> first.
        </p>
      </main>
    )
  }

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
          href="/benchmarks"
          className="inline-flex items-center gap-2 rounded-md border border-ink-300/25 bg-ink-900/30 px-3 py-1.5 text-sm text-ink-100 transition-colors hover:border-[#7baff5]/40 hover:bg-ink-900/50 hover:text-ink-50"
        >
          <span aria-hidden>←</span> Benchmarks
        </Link>
      </nav>

      <header className="rounded-2xl border border-ink-300/20 bg-slateglass-700/45 p-6 shadow-glow backdrop-blur">
        <p className="text-xs uppercase tracking-[0.22em] text-ink-300">Comparative analytics</p>
        <h1 className="font-[var(--font-heading)] text-3xl font-semibold text-ink-50 md:text-4xl">
          Compare Networks
        </h1>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-ink-100 md:text-base">
          Multi-network analytical layer. Pick up to 5 networks and stack them against Ethereum across
          KPIs, the 5-axis conversion radar, per-ratio leaderboards, multiplicative funnels, and a gap
          matrix. The URL is shareable — bookmark or paste a comparison.
        </p>
        <p className="mt-3 text-xs text-ink-300">
          {selectable.length} networks with PAF data available · Ethereum is always the baseline reference
        </p>
      </header>

      <Suspense fallback={<p className="text-ink-300">Loading comparison…</p>}>
        <ComparisonView ethereum={ethereum} selectableNetworks={selectable} />
      </Suspense>
    </main>
  )
}
