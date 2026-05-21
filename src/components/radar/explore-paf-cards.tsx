import Link from "next/link"

/** Discovery cards linking to the PAF analytical surfaces from the home page. */
export function ExplorePafCards() {
  return (
    <section className="grid gap-3 md:grid-cols-2">
      <Link
        href="/benchmarks"
        className="group flex flex-col gap-2 rounded-2xl border border-ink-300/20 bg-gradient-to-br from-sky-500/10 via-slateglass-700/45 to-transparent p-5 shadow-glow backdrop-blur transition-all hover:border-sky-400/40 hover:from-sky-500/20"
      >
        <div className="flex items-start justify-between">
          <p className="text-xs uppercase tracking-[0.22em] text-sky-300">PAF Benchmarks</p>
          <span className="text-sky-300 transition-transform group-hover:translate-x-1" aria-hidden>
            →
          </span>
        </div>
        <h3 className="font-[var(--font-heading)] text-xl font-semibold text-ink-50">
          PoS Adoption Funnel
        </h3>
        <p className="text-sm text-ink-200">
          Universe overview + funnel positions scatter + Ethereum trajectory overlay. See where every
          tracked network sits across the 5-stage funnel calibrated against Ethereum.
        </p>
        <p className="mt-1 text-xs text-ink-400">
          → Stage distribution · BD shortlist · Comparative table
        </p>
      </Link>

      <Link
        href="/compare"
        className="group flex flex-col gap-2 rounded-2xl border border-ink-300/20 bg-gradient-to-br from-emerald-500/10 via-slateglass-700/45 to-transparent p-5 shadow-glow backdrop-blur transition-all hover:border-emerald-400/40 hover:from-emerald-500/20"
      >
        <div className="flex items-start justify-between">
          <p className="text-xs uppercase tracking-[0.22em] text-emerald-300">Compare</p>
          <span className="text-emerald-300 transition-transform group-hover:translate-x-1" aria-hidden>
            →
          </span>
        </div>
        <h3 className="font-[var(--font-heading)] text-xl font-semibold text-ink-50">
          Head-to-head analytics
        </h3>
        <p className="text-sm text-ink-200">
          Pick up to 5 networks and stack them against Ethereum across KPIs, radar, leaderboards,
          conversion funnels, and gap matrix. URL-shareable comparisons.
        </p>
        <p className="mt-1 text-xs text-ink-400">
          → Multi-radar · Bar leaderboards · Funnel shapes · Gap pp matrix
        </p>
      </Link>
    </section>
  )
}
