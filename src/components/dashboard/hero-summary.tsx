import { toneClasses } from "@/lib/scoring";

type HeroSummaryProps = {
  networkName: string;
  lstSymbol: string;
  globalScore: number;
  lpLabel: string;
  labelTone: "positive" | "warning" | "risk";
  diagnosis: string;
  heroText: string;
  institutionalReadiness: string;
  bestModule: string;
  weakestModule: string;
  primaryBottleneck: string;
  strategicUpgrade: string;
  highlights: string[];
};

export function HeroSummary({
  networkName,
  lstSymbol,
  globalScore,
  lpLabel,
  labelTone,
  diagnosis,
  heroText,
  institutionalReadiness,
  bestModule,
  weakestModule,
  primaryBottleneck,
  strategicUpgrade,
  highlights
}: HeroSummaryProps) {
  return (
    <section className="rounded-2xl border border-ink-300/20 bg-gradient-to-br from-slateglass-600/85 via-slateglass-600/65 to-ink-700/70 p-6 shadow-glow backdrop-blur">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl space-y-4">
          <p className="text-xs uppercase tracking-[0.22em] text-ink-300">Ecosystem Diagnosis</p>
          <h2 className="font-[var(--font-heading)] text-2xl font-semibold leading-tight text-ink-50 md:text-4xl">
            {networkName} / {lstSymbol}
          </h2>
          <p className="text-balance text-sm leading-relaxed text-ink-100 md:text-base">{diagnosis}</p>
          <p className="text-balance text-sm leading-relaxed text-ink-200/95 md:text-base">{heroText}</p>

          <div className="flex flex-wrap gap-2">
            {highlights.map((highlight) => (
              <span
                key={highlight}
                className="rounded-lg border border-ink-300/30 bg-ink-500/15 px-3 py-1 text-xs font-medium text-ink-100"
              >
                {highlight}
              </span>
            ))}
          </div>
        </div>

        <div className="grid w-full max-w-md gap-3 rounded-2xl border border-ink-300/20 bg-ink-900/35 p-5">
          <p className="text-xs uppercase tracking-[0.16em] text-ink-300">Global LST Health Score</p>
          <div className="flex items-end gap-3">
            <span className="font-[var(--font-heading)] text-6xl font-semibold leading-none text-ink-50">
              {globalScore}
            </span>
            <span className="mb-1 text-sm text-ink-300">/ 100</span>
          </div>
          <div className={`inline-flex w-fit rounded-lg border px-3 py-1 text-sm font-semibold ${toneClasses(labelTone)}`}>
            LP Attractiveness: {lpLabel}
          </div>
          <p className="text-sm text-ink-200">Institutional Readiness: {institutionalReadiness}</p>
          <div className="grid gap-2 rounded-xl border border-ink-300/20 bg-ink-900/25 p-3 text-xs text-ink-200">
            <p>Best Module: <span className="font-semibold text-mint">{bestModule}</span></p>
            <p>Weakest Module: <span className="font-semibold text-coral">{weakestModule}</span></p>
            <p>Primary Bottleneck: <span className="font-semibold text-amber">{primaryBottleneck}</span></p>
            <p>Main Strategic Upgrade: <span className="font-semibold text-ink-50">{strategicUpgrade}</span></p>
          </div>
        </div>
      </div>
    </section>
  );
}
