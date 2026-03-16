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
    weight: "25%",
    measures: "DEX depth, slippage routes, stablecoin exit capacity, and redemption anchor.",
    matters: "Large LPs optimize for executable exits at size, not only entry yield.",
    caps: "Cap 45 (pre-LST, no stable exit) · Cap 55 (no stable exit) · Cap 60 (no redemption)"
  },
  {
    name: "Peg Stability",
    weight: "15%",
    measures: "Redemption anchor quality, unbonding period, and stablecoin buffer depth.",
    matters: "Protocols and LPs need confidence that the LST stays economically anchored.",
    caps: "Cap 50 (no native redemption)"
  },
  {
    name: "DeFi Moneyness",
    weight: "15%",
    measures: "Collateral usage, DeFi integration breadth, LST-to-DeFi depth ratio.",
    matters: "Money-like utility creates structural demand beyond emissions.",
    caps: "Cap 55 (LST not used as collateral)"
  },
  {
    name: "Security & Governance",
    weight: "15%",
    measures: "Audit count, timelock/governance controls, and protocol maturity.",
    matters: "Institutional liquidity avoids systems with opaque or discretionary control risk.",
    caps: "Cap 50 (zero audits) · Cap 55 (no timelock)"
  },
  {
    name: "Validator Decentralization",
    weight: "10%",
    measures: "Validator breadth, verified operator ratio, and commission competitiveness.",
    matters: "Concentrated validator exposure increases correlated operational risk.",
    caps: "Cap 40 (fewer than 20 validators)"
  },
  {
    name: "Incentive Sustainability",
    weight: "10%",
    measures: "Real yield (APY minus inflation), LST adoption depth, structural demand quality.",
    matters: "Temporary farming demand is not equivalent to investable liquidity depth.",
    caps: "Cap 45 (negative real yield + no collateral or lending demand)"
  }
] as const;

const HEALTH_SCORE_FORMULAS = [
  {
    title: "Module Weights",
    lines: [
      "Liquidity & Exit — 25%",
      "Peg Stability — 15%",
      "DeFi Moneyness — 15%",
      "Security & Governance — 15%",
      "Validator Decentralization — 10%",
      "Incentive Sustainability — 10%"
    ]
  },
  {
    title: "Pillar Construction",
    lines: [
      "Exitability = (L&E×0.25 + Peg×0.15) / 0.40",
      "Moneyness = DeFi Moneyness (direct)",
      "Credibility = (Sec×0.15 + Val×0.10 + Inc×0.10) / 0.35"
    ]
  },
  {
    title: "Global Aggregation",
    lines: [
      "Global Score = weighted sum / 0.90",
      "(Weights sum to 0.90; renormalized to 0–100)",
      "Score range: 0–100"
    ]
  }
] as const;

const PRE_LST_INFO = [
  {
    label: "Mode trigger",
    text: "hasLst = false or null → pre-LST mode"
  },
  {
    label: "Structural penalty",
    text: "L&E, Peg Stability, and DeFi Moneyness each include a lstReadiness term with 15% weight, always scored as 0. This lowers their theoretical ceiling by ~15 points."
  },
  {
    label: "Rationale",
    text: "A network without an LST has no redemption path, no collateral integrations, and no DEX liquidity for the token — these structural gaps should be reflected in the score, not masked by proxy metrics."
  },
  {
    label: "Path to remove penalty",
    text: "Launch an LST protocol. Once hasLst = true, the network switches to lst-active mode and the lstReadiness penalty is lifted."
  }
];

const INSTITUTIONAL_READINESS_CONDITIONS = [
  "Credible stablecoin exits with enough depth to unwind meaningful position sizes.",
  "LST integrated as real collateral across core DeFi venues, with non-symbolic capacity.",
  "Redemption and peg mechanics that stay transparent and functional under stress.",
  "Governance and security controls that reduce discretionary admin risk.",
  "Validator and liquidity structures that avoid dangerous concentration.",
  "Adoption quality supported by utility and fees, not only short-term emissions."
] as const;

const SCORE_BANDS = [
  "85–100: Institutional Grade",
  "70–84: Strong",
  "55–69: Usable but Constrained",
  "40–54: Fragile",
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
        <p className="text-xs uppercase tracking-[0.22em] text-ink-300">Methodology · Scoring Model v2</p>
        <h1 className="mt-2 font-[var(--font-heading)] text-3xl font-semibold text-ink-50 md:text-4xl">
          LST Ecosystem Scoring Model
        </h1>
        <p className="mt-3 max-w-4xl text-sm leading-relaxed text-ink-100 md:text-base">
          A 6-module framework that evaluates investability for liquidity providers across two modes:{" "}
          <span className="font-semibold text-amber-300">pre-LST</span> (network has no liquid staking protocol yet) and{" "}
          <span className="font-semibold text-emerald-300">LST-active</span> (an LST exists). Scores reflect current ecosystem health and where structural gaps remain.
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
          LP behavior is multi-dimensional. Capital allocation depends on carry, utility, exits, and risk controls simultaneously.
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
          <h2 className="font-[var(--font-heading)] text-2xl font-semibold text-ink-50">3. Two Scoring Modes</h2>
          <p className="mt-2 text-sm text-ink-100">
            Mode is detected automatically from{" "}
            <code className="rounded bg-ink-900/40 px-1 py-0.5 text-xs text-[#dcecff]">hasLst</code>. Different module formulas apply — the same inputs are interpreted differently based on whether a liquid staking protocol exists.
          </p>
          <div className="mt-3 grid gap-2">
            <div className="rounded-lg border border-amber-400/20 bg-ink-900/20 p-3 text-sm">
              <span className="font-semibold text-amber-300">pre-LST</span>
              <span className="ml-2 text-ink-200">No LST deployed yet. Modules use proxy metrics (DEX liquidity, staking ratio, DeFi TVL). A 15% lstReadiness penalty applies to 3 modules.</span>
            </div>
            <div className="rounded-lg border border-emerald-400/20 bg-ink-900/20 p-3 text-sm">
              <span className="font-semibold text-emerald-300">LST-active</span>
              <span className="ml-2 text-ink-200">LST exists. Modules score actual LST metrics: DEX liquidity, redemption path, collateral integrations, audit posture.</span>
            </div>
          </div>
        </article>
      </section>

      <section className="rounded-2xl border border-ink-300/20 bg-slateglass-700/35 p-5 shadow-card">
        <h2 className="font-[var(--font-heading)] text-2xl font-semibold text-ink-50">4. Six Diagnostic Modules</h2>
        <p className="mt-2 text-sm text-ink-100">
          Each module isolates a structural dimension of LP attractiveness. Module-level caps prevent over-scoring when gating conditions fail.
        </p>
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {DIAGNOSTIC_MODULES.map((module) => (
            <article key={module.name} className="rounded-xl border border-ink-300/20 bg-ink-900/25 p-4 shadow-card">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold text-ink-50">{module.name}</h3>
                <span className="rounded-md border border-[#7baff5]/30 bg-[#7baff5]/10 px-2 py-0.5 text-xs font-semibold text-[#dcecff]">{module.weight}</span>
              </div>
              <div className="mt-3 space-y-2 text-sm leading-relaxed text-ink-100">
                <p>
                  <span className="font-semibold text-[#dcecff]">Measures:</span> {module.measures}
                </p>
                <p>
                  <span className="font-semibold text-[#dcecff]">Why it matters:</span> {module.matters}
                </p>
                <p className="text-xs text-ink-400">
                  <span className="font-semibold text-ink-300">Caps:</span> {module.caps}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-ink-300/20 bg-slateglass-700/35 p-5 shadow-card">
        <h2 className="font-[var(--font-heading)] text-2xl font-semibold text-ink-50">5. Score Construction</h2>
        <p className="mt-2 text-sm text-ink-100">
          Module outputs aggregate into three pillars, then into the Global LST Health Score. The six module weights sum to 0.90 — the global score is renormalized by dividing by 0.90.
        </p>

        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {HEALTH_SCORE_FORMULAS.map((formula) => (
            <article key={formula.title} className="rounded-xl border border-ink-300/20 bg-ink-900/25 p-4">
              <h3 className="text-sm font-semibold uppercase tracking-[0.1em] text-[#dcecff]">{formula.title}</h3>
              <div className="mt-2 space-y-1.5">
                {formula.lines.map((line) => (
                  <p key={line} className="font-mono text-xs text-ink-100">{line}</p>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-amber-400/20 bg-amber-400/5 p-5 shadow-card">
        <h2 className="font-[var(--font-heading)] text-2xl font-semibold text-ink-50">6. Pre-LST Structural Penalty</h2>
        <p className="mt-2 text-sm text-ink-100">
          Networks without an LST score structurally lower due to a built-in{" "}
          <code className="rounded bg-ink-900/40 px-1 py-0.5 text-xs text-amber-300">lstReadiness</code>{" "}
          term in three modules.
        </p>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {PRE_LST_INFO.map((item) => (
            <div key={item.label} className="rounded-lg border border-amber-400/15 bg-ink-900/20 p-3 text-sm">
              <span className="font-semibold text-amber-300">{item.label}: </span>
              <span className="text-ink-100">{item.text}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-ink-300/20 bg-slateglass-700/35 p-5 shadow-card">
        <h2 className="font-[var(--font-heading)] text-2xl font-semibold text-ink-50">7. Institutional Liquidity Readiness</h2>
        <p className="mt-2 text-sm text-ink-100">
          To attract large LP capital, a network must demonstrate durable execution quality across liquidity, moneyness, and risk controls.
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
