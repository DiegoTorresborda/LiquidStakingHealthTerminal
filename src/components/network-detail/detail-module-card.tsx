import type { DetailModule } from "@/features/network-detail/types";
import { moduleScoreClass } from "@/features/network-detail/utils";

type DetailModuleCardProps = {
  module: DetailModule;
};

export function DetailModuleCard({ module }: DetailModuleCardProps) {
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

      <div className="grid gap-2 rounded-xl border border-ink-300/20 bg-ink-900/30 p-3">
        {module.keyMetrics.slice(0, 4).map((metric) => (
          <div key={metric.label} className="flex items-center justify-between gap-2 text-sm">
            <span className="text-ink-300">{metric.label}</span>
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
