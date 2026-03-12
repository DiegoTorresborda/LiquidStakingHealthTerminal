import Link from "next/link";

const LP_THESIS_PILLARS = [
  {
    title: "Carry",
    description:
      "LPs need yield, but net carry only matters when capital can be deployed and unwound without major friction."
  },
  {
    title: "Exit Liquidity",
    description:
      "Exit routes to stablecoins must remain credible at size. Weak exitability can invalidate high nominal APY."
  },
  {
    title: "DeFi Moneyness",
    description:
      "The LST must work as collateral and transferable liquidity across serious venues, not only as a staking wrapper."
  },
  {
    title: "Risk Control",
    description:
      "Security posture, governance controls, validator diversification, and stress behavior determine institutional confidence."
  }
] as const;

const DIAGNOSTIC_MODULES = [
  {
    name: "Liquidity & Exit",
    measures: "Depth, slippage, route quality, and stablecoin exit capacity.",
    matters: "Large LPs optimize for executable exits, not only for entry yield.",
    failureMode: "TVL exists, but stable exit path breaks or becomes too expensive at size."
  },
  {
    name: "Peg Stability",
    measures: "Discount behavior versus NAV, redemption anchors, and recovery speed.",
    matters: "Protocols and LPs need confidence that the LST stays economically anchored.",
    failureMode: "Persistent discounts due to weak redemption/arbitrage mechanics."
  },
  {
    name: "DeFi Moneyness",
    measures: "Collateral usage, integration breadth, utilization, and demand quality.",
    matters: "Money-like utility creates structural demand beyond emissions.",
    failureMode: "Token exists but remains idle or constrained to shallow LP incentives."
  },
  {
    name: "Security & Governance",
    measures: "Audit posture, admin controls, upgrade safety, and transparency.",
    matters: "Institutional liquidity avoids systems with opaque or discretionary control risk.",
    failureMode: "Centralized admin powers overshadow otherwise strong on-chain metrics."
  },
  {
    name: "Validator Decentralization",
    measures: "Delegation concentration, validator breadth, uptime, and slashing risk.",
    matters: "Concentrated validator exposure increases correlated operational risk.",
    failureMode: "A few operators dominate delegated stake, weakening resilience."
  },
  {
    name: "Incentive Sustainability",
    measures: "Dependence on emissions versus durable, utility-driven demand.",
    matters: "Temporary farming demand is not equivalent to investable liquidity depth.",
    failureMode: "TVL and volume collapse when reward programs decline."
  },
  {
    name: "Stress Resilience",
    measures: "Behavior under price shock, stablecoin run, and contagion scenarios.",
    matters: "Serious LPs care about drawdown pathways and exit haircuts under stress.",
    failureMode: "Normal conditions look healthy, but exits degrade sharply in risk-off periods."
  }
] as const;

const HEALTH_SCORE_FORMULAS = [
  {
    title: "Pillar Construction",
    lines: [
      "Exitability = 0.50 x Liquidity & Exit + 0.30 x Peg Stability + 0.20 x Stress Resilience",
      "Moneyness = DeFi Moneyness",
      "Credibility = 0.40 x Security & Governance + 0.30 x Validator Decentralization + 0.30 x Incentive Sustainability"
    ]
  },
  {
    title: "Global Aggregation",
    lines: [
      "Global LST Health Score = 0.45 x Exitability + 0.30 x Moneyness + 0.25 x Credibility",
      "Score range: 0-100"
    ]
  },
  {
    title: "Penalties and Caps",
    lines: [
      "Module-level caps and penalties apply when structural conditions fail (for example: no stablecoin exit route, no redemption path, extreme concentration).",
      "Global caps apply when gating conditions are weak: Exitability < 50, Peg Stability < 45, or Security & Governance < 50."
    ]
  }
] as const;

const INSTITUTIONAL_READINESS_CONDITIONS = [
  "Credible stablecoin exits with enough depth to unwind meaningful position sizes.",
  "LST integrated as real collateral across core DeFi venues, with non-symbolic capacity.",
  "Redemption and peg mechanics that stay transparent and functional under stress.",
  "Governance and security controls that reduce discretionary admin risk.",
  "Validator and liquidity structures that avoid dangerous concentration.",
  "Adoption quality supported by utility and fees, not only short-term emissions."
] as const;

const SCORE_BANDS = [
  "85-100: Institutional Grade",
  "70-84: Strong",
  "55-69: Usable but Constrained",
  "40-54: Fragile",
  "Below 40: Unhealthy"
] as const;

export function MethodologyPage() {
  return (
    <main className="mx-auto flex w-full max-w-[1360px] flex-col gap-6 px-4 py-6 md:px-8 md:py-8">
      <section className="rounded-2xl border border-ink-300/20 bg-slateglass-700/35 p-4 shadow-card">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.16em] text-ink-300">
            <span>LST Opportunity Radar</span>
            <span>/</span>
            <span className="text-[#dcecff]">Methodology</span>
          </div>
          <Link
            href="/"
            className="inline-flex items-center rounded-lg border border-[#7baff5]/45 bg-[#7baff5]/20 px-3 py-1.5 text-sm font-semibold text-[#dcecff] transition hover:bg-[#7baff5]/30"
          >
            Back to Radar
          </Link>
        </div>
      </section>

      <section className="surface-grid rounded-2xl border border-ink-300/20 bg-slateglass-700/45 p-6 shadow-glow backdrop-blur">
        <p className="text-xs uppercase tracking-[0.22em] text-ink-300">Methodology</p>
        <h1 className="mt-2 font-[var(--font-heading)] text-3xl font-semibold text-ink-50 md:text-4xl">
          LST Ecosystem Scoring Model
        </h1>
        <p className="mt-3 max-w-4xl text-sm leading-relaxed text-ink-100 md:text-base">
          This framework explains how the dashboard evaluates investability for liquidity providers and how L1 teams can
          move from yield availability to institutional liquidity readiness.
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {SCORE_BANDS.map((band) => (
            <span key={band} className="rounded-md border border-ink-300/25 bg-ink-900/25 px-2.5 py-1 text-xs text-ink-100">
              {band}
            </span>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-ink-300/20 bg-slateglass-700/35 p-5 shadow-card">
        <h2 className="font-[var(--font-heading)] text-2xl font-semibold text-ink-50">1. The Liquidity Provider Thesis</h2>
        <p className="mt-2 text-sm text-ink-100">
          LP behavior is multi-dimensional. Capital allocation depends on carry, utility, exits, and risk controls at the
          same time.
        </p>
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {LP_THESIS_PILLARS.map((pillar) => (
            <article key={pillar.title} className="rounded-xl border border-ink-300/20 bg-ink-900/25 p-4">
              <h3 className="text-sm font-semibold uppercase tracking-[0.1em] text-[#dcecff]">{pillar.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-100">{pillar.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <article className="rounded-2xl border border-ink-300/20 bg-slateglass-700/35 p-5 shadow-card">
          <h2 className="font-[var(--font-heading)] text-2xl font-semibold text-ink-50">2. The Two Scores</h2>
          <div className="mt-3 space-y-3 text-sm text-ink-100">
            <div className="rounded-xl border border-[#7baff5]/35 bg-[#7baff5]/10 p-4">
              <p className="text-xs uppercase tracking-[0.16em] text-ink-300">Global LST Health Score</p>
              <p className="mt-1 font-semibold text-ink-50">Current ecosystem health and investability quality.</p>
              <p className="mt-1 text-ink-100">
                Answers: How strong and usable is this LST ecosystem today for serious liquidity?
              </p>
            </div>
            <div className="rounded-xl border border-amber/45 bg-amber/10 p-4">
              <p className="text-xs uppercase tracking-[0.16em] text-ink-300">Opportunity Score</p>
              <p className="mt-1 font-semibold text-ink-50">Attractiveness as a strategic intervention target.</p>
              <p className="mt-1 text-ink-100">
                Answers: How compelling is this network for ecosystem-building and product upgrade opportunities?
              </p>
            </div>
          </div>
        </article>

        <article className="rounded-2xl border border-ink-300/20 bg-slateglass-700/35 p-5 shadow-card">
          <h2 className="font-[var(--font-heading)] text-2xl font-semibold text-ink-50">3. Seven Diagnostic Modules</h2>
          <p className="mt-2 text-sm text-ink-100">
            The model diagnoses quality through seven modules. Each module isolates a structural dimension of LP
            attractiveness.
          </p>
        </article>
      </section>

      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {DIAGNOSTIC_MODULES.map((module) => (
          <article key={module.name} className="rounded-xl border border-ink-300/20 bg-ink-900/25 p-4 shadow-card">
            <h3 className="text-base font-semibold text-ink-50">{module.name}</h3>
            <div className="mt-3 space-y-2 text-sm leading-relaxed text-ink-100">
              <p>
                <span className="font-semibold text-[#dcecff]">Measures:</span> {module.measures}
              </p>
              <p>
                <span className="font-semibold text-[#dcecff]">Why it matters:</span> {module.matters}
              </p>
              <p>
                <span className="font-semibold text-[#dcecff]">Typical failure mode:</span> {module.failureMode}
              </p>
            </div>
          </article>
        ))}
      </section>

      <section className="rounded-2xl border border-ink-300/20 bg-slateglass-700/35 p-5 shadow-card">
        <h2 className="font-[var(--font-heading)] text-2xl font-semibold text-ink-50">4. Score Construction</h2>
        <p className="mt-2 text-sm text-ink-100">
          Module outputs are aggregated into pillars, then into the Global LST Health Score. Structural caps prevent
          over-scoring when gating risks are unresolved.
        </p>

        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {HEALTH_SCORE_FORMULAS.map((formula) => (
            <article key={formula.title} className="rounded-xl border border-ink-300/20 bg-ink-900/25 p-4">
              <h3 className="text-sm font-semibold uppercase tracking-[0.1em] text-[#dcecff]">{formula.title}</h3>
              <div className="mt-2 space-y-2 text-sm text-ink-100">
                {formula.lines.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-ink-300/20 bg-slateglass-700/35 p-5 shadow-card">
        <h2 className="font-[var(--font-heading)] text-2xl font-semibold text-ink-50">5. Institutional Liquidity Readiness</h2>
        <p className="mt-2 text-sm text-ink-100">
          To attract large LP capital, a network must demonstrate durable execution quality across liquidity,
          moneyness, and risk controls.
        </p>

        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {INSTITUTIONAL_READINESS_CONDITIONS.map((condition) => (
            <div key={condition} className="rounded-lg border border-ink-300/20 bg-ink-900/25 p-3 text-sm text-ink-100">
              {condition}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
