import Link from "next/link";

const DIAGNOSTIC_MODULES = [
  "Liquidity & Exit",
  "Peg Stability",
  "DeFi Moneyness",
  "Security & Governance",
  "Validator Decentralization",
  "Incentive Sustainability",
  "Stress Resilience"
] as const;

const INSTITUTIONAL_REQUIREMENTS = [
  {
    title: "Executable Exit Routes",
    detail: "Deep, resilient paths from LST exposure into stablecoins at meaningful size."
  },
  {
    title: "Money-Like Utility",
    detail: "Collateral acceptance, borrow demand, and integration across core DeFi venues."
  },
  {
    title: "Structural Safety",
    detail: "Strong governance controls, transparent admin powers, and credible security posture."
  },
  {
    title: "Stress Performance",
    detail: "Behavior under volatility, queue pressure, and liquidity flight scenarios."
  }
] as const;

const COMMON_FAILURES = [
  {
    title: "Yield Without Exitability",
    description: "Attractive APY but shallow stablecoin routes. Large exits face haircut risk."
  },
  {
    title: "LST Without Moneyness",
    description: "Token exists, but collateral usage is symbolic and DeFi demand stays weak."
  },
  {
    title: "Incentive-Only Liquidity",
    description: "Liquidity disappears when emissions decline, exposing fragile market structure."
  },
  {
    title: "Governance Risk Overhang",
    description: "Concentrated admin control reduces institutional trust even when metrics look strong."
  }
] as const;

const FLYWHEEL_STEPS = [
  {
    title: "More Staked Capital Tokenized",
    detail: "LST supply increases usable balance-sheet capacity."
  },
  {
    title: "Deeper Liquidity & Better Execution",
    detail: "Lower slippage and stronger routes improve deployability."
  },
  {
    title: "Stronger DeFi Integrations",
    detail: "Lending, vaults, and collateral utility increase demand quality."
  },
  {
    title: "Higher Capital Retention",
    detail: "Ecosystem becomes more investable and resilient under stress."
  }
] as const;

export function LiquidStakingPage() {
  return (
    <main className="mx-auto flex w-full max-w-[1360px] flex-col gap-6 px-4 py-6 md:px-8 md:py-8">
      <section className="rounded-2xl border border-ink-300/20 bg-slateglass-700/35 p-4 shadow-card">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.16em] text-ink-300">
            <span>LST Opportunity Radar</span>
            <span>/</span>
            <span className="text-[#dcecff]">Liquid Staking Economics</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/"
              className="inline-flex items-center rounded-lg border border-[#7baff5]/45 bg-[#7baff5]/20 px-3 py-1.5 text-sm font-semibold text-[#dcecff] transition hover:bg-[#7baff5]/30"
            >
              Back to Radar
            </Link>
            <Link
              href="/methodology"
              className="inline-flex items-center rounded-lg border border-ink-300/30 bg-ink-900/25 px-3 py-1.5 text-sm font-semibold text-ink-100 transition hover:bg-ink-900/40"
            >
              Open Methodology
            </Link>
          </div>
        </div>
      </section>

      <section className="surface-grid rounded-2xl border border-ink-300/20 bg-slateglass-700/45 p-6 shadow-glow backdrop-blur">
        <p className="text-xs uppercase tracking-[0.22em] text-ink-300">Economic Primer</p>
        <h1 className="mt-2 font-[var(--font-heading)] text-3xl font-semibold text-ink-50 md:text-4xl">
          Liquid Staking Is the Monetary Layer of PoS Ecosystems
        </h1>
        <p className="mt-3 max-w-4xl text-sm leading-relaxed text-ink-100 md:text-base">
          Robust liquid staking systems shape how capital enters, circulates, and exits a network. If the LST layer is
          weak, DeFi depth, LP confidence, and institutional readiness all remain constrained.
        </p>
        <div className="mt-4 flex flex-wrap gap-2 text-xs">
          <span className="rounded-md border border-ink-300/25 bg-ink-900/25 px-2.5 py-1 text-ink-100">L1 Foundations</span>
          <span className="rounded-md border border-ink-300/25 bg-ink-900/25 px-2.5 py-1 text-ink-100">Ecosystem Builders</span>
          <span className="rounded-md border border-ink-300/25 bg-ink-900/25 px-2.5 py-1 text-ink-100">Liquidity Providers</span>
        </div>
      </section>

      <section className="rounded-2xl border border-ink-300/20 bg-slateglass-700/35 p-5 shadow-card">
        <h2 className="font-[var(--font-heading)] text-2xl font-semibold text-ink-50">1. The Capital Lock Problem</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <article className="rounded-xl border border-ink-300/20 bg-ink-900/25 p-4">
            <p className="text-xs uppercase tracking-[0.16em] text-ink-300">Security Need</p>
            <p className="mt-2 text-sm text-ink-100">
              PoS networks need high staking participation to secure consensus and reduce attack surface.
            </p>
          </article>
          <article className="rounded-xl border border-ink-300/20 bg-ink-900/25 p-4">
            <p className="text-xs uppercase tracking-[0.16em] text-ink-300">Liquidity Cost</p>
            <p className="mt-2 text-sm text-ink-100">
              Staked capital becomes operationally illiquid, limiting DeFi usage and reducing deployable ecosystem
              liquidity.
            </p>
          </article>
        </div>
        <p className="mt-3 text-sm text-ink-100">
          Result: networks often face a tradeoff between staking security and capital efficiency.
        </p>
      </section>

      <section className="rounded-2xl border border-ink-300/20 bg-slateglass-700/35 p-5 shadow-card">
        <h2 className="font-[var(--font-heading)] text-2xl font-semibold text-ink-50">2. Liquid Staking as a Solution</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <article className="rounded-xl border border-ink-300/20 bg-ink-900/25 p-4 text-sm text-ink-100">
            <p className="text-xs uppercase tracking-[0.16em] text-ink-300">Step 1</p>
            Stake native token into validator set.
          </article>
          <article className="rounded-xl border border-ink-300/20 bg-ink-900/25 p-4 text-sm text-ink-100">
            <p className="text-xs uppercase tracking-[0.16em] text-ink-300">Step 2</p>
            Receive LST representation of staked position.
          </article>
          <article className="rounded-xl border border-ink-300/20 bg-ink-900/25 p-4 text-sm text-ink-100">
            <p className="text-xs uppercase tracking-[0.16em] text-ink-300">Step 3</p>
            Use LST across DeFi while preserving security contribution.
          </article>
        </div>
      </section>

      <section className="rounded-2xl border border-ink-300/20 bg-slateglass-700/35 p-5 shadow-card">
        <h2 className="font-[var(--font-heading)] text-2xl font-semibold text-ink-50">3. The DeFi Flywheel</h2>
        <p className="mt-2 text-sm text-ink-100">
          Strong LST systems create a reinforcing loop between tokenized stake and DeFi liquidity quality.
        </p>
        <div className="mt-4 grid gap-2 lg:grid-cols-4">
          {FLYWHEEL_STEPS.map((step, index) => (
            <article key={step.title} className="relative rounded-xl border border-ink-300/20 bg-ink-900/25 p-4">
              <p className="text-xs uppercase tracking-[0.16em] text-ink-300">{index + 1}</p>
              <h3 className="mt-1 text-sm font-semibold text-ink-50">{step.title}</h3>
              <p className="mt-2 text-sm text-ink-100">{step.detail}</p>
              {index < FLYWHEEL_STEPS.length - 1 ? (
                <span className="pointer-events-none absolute -right-2 top-1/2 hidden -translate-y-1/2 text-ink-300 lg:block">→</span>
              ) : null}
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-ink-300/20 bg-slateglass-700/35 p-5 shadow-card">
        <h2 className="font-[var(--font-heading)] text-2xl font-semibold text-ink-50">4. Institutional Liquidity Requirements</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {INSTITUTIONAL_REQUIREMENTS.map((item) => (
            <article key={item.title} className="rounded-xl border border-ink-300/20 bg-ink-900/25 p-4">
              <h3 className="text-sm font-semibold uppercase tracking-[0.1em] text-[#dcecff]">{item.title}</h3>
              <p className="mt-2 text-sm text-ink-100">{item.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-ink-300/20 bg-slateglass-700/35 p-5 shadow-card">
        <h2 className="font-[var(--font-heading)] text-2xl font-semibold text-ink-50">5. Common Ecosystem Failures</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {COMMON_FAILURES.map((failure) => (
            <article key={failure.title} className="rounded-xl border border-coral/35 bg-coral/10 p-4">
              <h3 className="text-sm font-semibold uppercase tracking-[0.1em] text-[#ffd9d9]">{failure.title}</h3>
              <p className="mt-2 text-sm text-ink-100">{failure.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-ink-300/20 bg-slateglass-700/35 p-5 shadow-card">
        <h2 className="font-[var(--font-heading)] text-2xl font-semibold text-ink-50">6. The LST Ecosystem Framework</h2>
        <p className="mt-2 text-sm text-ink-100">
          The platform evaluates ecosystem quality through seven diagnostic modules designed around LP capital behavior.
        </p>
        <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
          {DIAGNOSTIC_MODULES.map((module) => (
            <div key={module} className="rounded-lg border border-ink-300/20 bg-ink-900/25 px-3 py-2 text-sm text-ink-100">
              {module}
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-[#7baff5]/35 bg-[#7baff5]/10 p-5 shadow-card">
        <h2 className="font-[var(--font-heading)] text-2xl font-semibold text-ink-50">7. Platform Introduction</h2>
        <p className="mt-2 max-w-4xl text-sm leading-relaxed text-ink-100">
          The LST Ecosystem Intelligence Platform connects market overview, per-network diagnosis, and opportunity
          framing. It helps teams identify bottlenecks, quantify investability, and prioritize the upgrades that most
          improve LP attractiveness.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link
            href="/"
            className="inline-flex items-center rounded-lg border border-[#7baff5]/50 bg-[#7baff5]/25 px-3 py-1.5 text-sm font-semibold text-[#dcecff] transition hover:bg-[#7baff5]/35"
          >
            Open Radar
          </Link>
          <Link
            href="/methodology"
            className="inline-flex items-center rounded-lg border border-ink-300/30 bg-ink-900/25 px-3 py-1.5 text-sm font-semibold text-ink-100 transition hover:bg-ink-900/40"
          >
            Open Scoring Methodology
          </Link>
        </div>
      </section>
    </main>
  );
}
