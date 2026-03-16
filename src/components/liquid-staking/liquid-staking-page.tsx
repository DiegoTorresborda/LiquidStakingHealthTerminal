import Link from "next/link";

import { NetworkAssessmentCta } from "@/components/liquid-staking/network-assessment-cta";

const AUDIENCE_TAGS = ["L1 Foundations", "Liquidity Providers", "DeFi Teams", "Ecosystem Operators"] as const;

const CAPITAL_LOCK = [
  {
    label: "Security Objective",
    value: "High staking ratio required to harden consensus and validator economics."
  },
  {
    label: "Capital Friction",
    value: "Native stake becomes less deployable for DeFi and liquidity routing."
  },
  {
    label: "Observed Outcome",
    value: "Networks show yield, but struggle to retain serious LP capital at scale."
  }
] as const;

const FLYWHEEL = [
  "More tokenized stake available as LST",
  "Deeper liquidity and tighter execution",
  "Collateral usage expands in core DeFi",
  "Higher capital retention and stronger LP confidence"
] as const;

const INSTITUTIONAL_REQUIREMENTS = [
  {
    title: "Credible Exitability",
    detail: "Stablecoin exits must remain executable at meaningful sizes, not only retail ticket ranges."
  },
  {
    title: "Money-Like Utility",
    detail: "The LST should function as collateral, margin, and strategy input across serious venues."
  },
  {
    title: "Structural Safety",
    detail: "Governance controls, admin transparency, and upgrade constraints must be institutionally legible."
  },
  {
    title: "Stress Robustness",
    detail: "The stack should keep functioning when volatility, redemption pressure, and contagion risks increase."
  }
] as const;

const FAILURES = [
  {
    title: "High APY, Shallow Exit",
    description: "Headline carry looks attractive, but stablecoin off-ramp depth is insufficient under size."
  },
  {
    title: "LST Exists, Utility Missing",
    description: "Token issuance exists, but DeFi moneyness remains too weak to create structural demand."
  },
  {
    title: "Incentive-Led Liquidity",
    description: "TVL quality decays when emissions normalize, exposing mercenary participation."
  },
  {
    title: "Governance Risk Discount",
    description: "Admin concentration or weak controls reduce institutional comfort despite growth metrics."
  }
] as const;

const DIAGNOSTIC_MODULES = [
  "Liquidity & Exit",
  "Peg Stability",
  "DeFi Moneyness",
  "Security & Governance",
  "Validator Decentralization",
  "Incentive Sustainability",
  "Stress Resilience"
] as const;

export function LiquidStakingPage() {
  return (
    <main className="mx-auto flex w-full max-w-[1360px] flex-col gap-7 px-4 py-6 md:px-8 md:py-8">
      <section className="rounded-2xl border border-ink-300/20 bg-slateglass-700/35 p-4 shadow-card">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-ink-300">
            <span>LST Ecosystem Intelligence Platform</span>
            <span>/</span>
            <span className="text-[#dcecff]">Liquid Staking Primer</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/"
              className="inline-flex items-center rounded-lg border border-[#7baff5]/45 bg-[#7baff5]/20 px-3 py-1.5 text-sm font-semibold text-[#dcecff] transition hover:bg-[#7baff5]/30"
            >
              Open Radar
            </Link>
            <Link
              href="/methodology"
              className="inline-flex items-center rounded-lg border border-ink-300/30 bg-ink-900/25 px-3 py-1.5 text-sm font-semibold text-ink-100 transition hover:bg-ink-900/40"
            >
              Scoring Methodology
            </Link>
          </div>
        </div>
      </section>

      <section className="surface-grid relative overflow-hidden rounded-3xl border border-ink-300/20 bg-slateglass-700/45 p-6 shadow-glow backdrop-blur md:p-8">
        <div className="pointer-events-none absolute -left-20 -top-28 h-72 w-72 rounded-full bg-[#55f4d2]/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-[#7baff5]/10 blur-3xl" />

        <div className="relative grid gap-5 lg:grid-cols-[1.35fr_1fr]">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-ink-300">Economic Thesis</p>
            <h1 className="mt-3 max-w-4xl font-[var(--font-heading)] text-4xl font-semibold leading-tight text-ink-50 md:text-5xl">
              Liquid Staking Is the Monetary Core of a PoS Ecosystem
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-relaxed text-ink-100 md:text-base">
              The strongest PoS ecosystems are not defined by staking yield alone. They are defined by how efficiently
              staked capital can move, be used as money inside DeFi, and exit safely under stress.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {AUDIENCE_TAGS.map((tag) => (
                <span key={tag} className="rounded-md border border-ink-300/30 bg-ink-900/30 px-2.5 py-1 text-xs text-ink-100">
                  {tag}
                </span>
              ))}
            </div>
            <div className="mt-5">
              <Link
                href="#assessment-request"
                className="inline-flex items-center rounded-lg border border-[#55f4d2]/55 bg-[#55f4d2]/20 px-3 py-2 text-sm font-semibold text-[#d6fff5] transition hover:bg-[#55f4d2]/30"
              >
                Request Network Assessment
              </Link>
            </div>
          </div>

          <article className="rounded-2xl border border-[#7baff5]/30 bg-ink-900/45 p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-ink-300">LP Decision Surface</p>
            <div className="mt-3 space-y-2.5">
              <SignalPill label="Carry" value="Necessary, not sufficient" />
              <SignalPill label="Exit Liquidity" value="Primary gating factor" />
              <SignalPill label="DeFi Moneyness" value="Creates structural demand" />
              <SignalPill label="Risk Control" value="Determines institutional trust" />
            </div>
            <p className="mt-4 text-sm text-ink-100">
              If exitability is weak, high APR usually fails to compensate for execution and haircut risk.
            </p>
          </article>
        </div>
      </section>

      <section className="rounded-2xl border border-ink-300/20 bg-slateglass-700/35 p-5 shadow-card">
        <h2 className="font-[var(--font-heading)] text-2xl font-semibold text-ink-50">The Capital Lock Problem</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {CAPITAL_LOCK.map((item) => (
            <article key={item.label} className="rounded-xl border border-ink-300/20 bg-ink-900/25 p-4">
              <p className="text-xs uppercase tracking-[0.16em] text-ink-300">{item.label}</p>
              <p className="mt-2 text-sm text-ink-100">{item.value}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-ink-300/20 bg-slateglass-700/35 p-5 shadow-card">
        <h2 className="font-[var(--font-heading)] text-2xl font-semibold text-ink-50">The LST DeFi Flywheel</h2>
        <p className="mt-2 text-sm text-ink-100">
          Liquid staking works when tokenized stake and DeFi liquidity reinforce each other over time.
        </p>
        <div className="mt-4 grid gap-2 lg:grid-cols-4">
          {FLYWHEEL.map((step, index) => (
            <article key={step} className="relative rounded-xl border border-ink-300/20 bg-ink-900/25 p-4">
              <p className="text-xs uppercase tracking-[0.16em] text-ink-300">Stage {index + 1}</p>
              <p className="mt-2 text-sm text-ink-100">{step}</p>
              {index < FLYWHEEL.length - 1 ? (
                <span className="pointer-events-none absolute -right-2 top-1/2 hidden -translate-y-1/2 text-ink-300 lg:block">→</span>
              ) : null}
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <article className="rounded-2xl border border-ink-300/20 bg-slateglass-700/35 p-5 shadow-card">
          <h2 className="font-[var(--font-heading)] text-2xl font-semibold text-ink-50">Institutional Liquidity Requirements</h2>
          <div className="mt-4 grid gap-3">
            {INSTITUTIONAL_REQUIREMENTS.map((item) => (
              <div key={item.title} className="rounded-xl border border-ink-300/20 bg-ink-900/25 p-4">
                <h3 className="text-sm font-semibold uppercase tracking-[0.1em] text-[#dcecff]">{item.title}</h3>
                <p className="mt-2 text-sm text-ink-100">{item.detail}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-2xl border border-ink-300/20 bg-slateglass-700/35 p-5 shadow-card">
          <h2 className="font-[var(--font-heading)] text-2xl font-semibold text-ink-50">Common Ecosystem Failure Modes</h2>
          <div className="mt-4 grid gap-3">
            {FAILURES.map((failure) => (
              <div key={failure.title} className="rounded-xl border border-coral/35 bg-coral/10 p-4">
                <h3 className="text-sm font-semibold uppercase tracking-[0.1em] text-[#ffd9d9]">{failure.title}</h3>
                <p className="mt-2 text-sm text-ink-100">{failure.description}</p>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="rounded-2xl border border-ink-300/20 bg-slateglass-700/35 p-5 shadow-card">
        <h2 className="font-[var(--font-heading)] text-2xl font-semibold text-ink-50">The 7-Module Diagnostic Framework</h2>
        <p className="mt-2 text-sm text-ink-100">
          The platform translates this thesis into a score-first framework that diagnoses ecosystem health and
          prioritizes the highest-leverage upgrades.
        </p>
        <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
          {DIAGNOSTIC_MODULES.map((module) => (
            <article key={module} className="rounded-lg border border-ink-300/20 bg-ink-900/25 p-3">
              <p className="text-sm text-ink-100">{module}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-[#7baff5]/35 bg-[#7baff5]/10 p-5 shadow-card">
        <h2 className="font-[var(--font-heading)] text-2xl font-semibold text-ink-50">Ready to Diagnose a Network?</h2>
        <p className="mt-2 max-w-4xl text-sm leading-relaxed text-ink-100">
          Use the Opportunity Radar to prioritize where to go deeper, then open a network diagnosis to identify
          bottlenecks, stress risks, and intervention opportunities.
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
            Open Methodology
          </Link>
          <Link
            href="#assessment-request"
            className="inline-flex items-center rounded-lg border border-[#55f4d2]/55 bg-[#55f4d2]/20 px-3 py-1.5 text-sm font-semibold text-[#d6fff5] transition hover:bg-[#55f4d2]/30"
          >
            Request Assessment
          </Link>
        </div>
      </section>

      <NetworkAssessmentCta />
    </main>
  );
}

function SignalPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-ink-300/20 bg-slateglass-600/35 px-3 py-2 text-sm">
      <span className="text-ink-100">{label}</span>
      <span className="text-xs uppercase tracking-[0.12em] text-[#dcecff]">{value}</span>
    </div>
  );
}
