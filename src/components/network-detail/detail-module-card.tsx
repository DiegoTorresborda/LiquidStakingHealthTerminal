import type { DetailModule } from "@/features/network-detail/types";
import type { ScoreBreakdown } from "@/features/scoring/types";
import { moduleScoreClass } from "@/features/network-detail/utils";

type DetailModuleCardProps = {
  module: DetailModule;
  scoreBreakdown?: ScoreBreakdown;
};

export function DetailModuleCard({ module, scoreBreakdown }: DetailModuleCardProps) {
  return (
    <article className="flex h-full flex-col gap-4 rounded-2xl border border-ink-300/20 bg-slateglass-600/60 p-5 shadow-card">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-[var(--font-heading)] text-lg font-semibold text-ink-50">{module.name}</h3>
          <p className="mt-1 text-sm leading-relaxed text-ink-100">{module.rationale}</p>
        </div>
        <span className={`rounded-md border px-3 py-1 text-sm font-semibold ${moduleScoreClass(module.score)}`}>
          {module.score}
        </span>
      </div>

      {scoreBreakdown && scoreBreakdown.rawScore !== scoreBreakdown.cappedScore ? (
        <div className="rounded-xl border border-amber-400/20 bg-amber-900/10 p-3 text-xs text-ink-200">
          <p className="uppercase tracking-[0.14em] text-amber-400/80">Cap Applied</p>
          <p className="mt-1">
            Raw {scoreBreakdown.rawScore} → capped to {scoreBreakdown.cappedScore}
            {scoreBreakdown.capApplied ? ` (${scoreBreakdown.capApplied.reason})` : ""}
          </p>
        </div>
      ) : null}

      <div className="grid gap-2 rounded-xl border border-ink-300/20 bg-ink-900/30 p-3">
        {module.keyMetrics.slice(0, 4).map((metric) => (
          <div key={metric.label} className="flex items-center justify-between gap-2 text-sm">
            <span className="flex items-center gap-1.5 text-ink-300">
              {metric.label}
              {metric.description && (
                <span className="group/tip relative inline-flex cursor-help">
                  <svg className="h-3.5 w-3.5 shrink-0 text-ink-400" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M8 7v5M8 5v.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                  <span className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 w-52 -translate-x-1/2 rounded-lg border border-ink-300/20 bg-ink-50 px-3 py-2 text-xs leading-relaxed text-ink-700 opacity-0 shadow-xl transition-opacity group-hover/tip:opacity-100">
                    {metric.description}
                    <span className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-ink-50" />
                  </span>
                </span>
              )}
            </span>
            <span className="font-semibold text-ink-50">{metric.value}</span>
          </div>
        ))}
      </div>

      <div className="mt-auto rounded-xl border border-ink-300/20 bg-ink-900/25 p-3 text-sm text-ink-100">
        <p className="text-xs uppercase tracking-[0.14em] text-ink-300">Key Insight</p>
        <p className="mt-1">{module.keyInsight}</p>
        {module.riskWarning ? (
          <p className="mt-2 border-t border-ink-300/20 pt-2 text-coral">Risk: {module.riskWarning}</p>
        ) : null}
      </div>
    </article>
  );
}
