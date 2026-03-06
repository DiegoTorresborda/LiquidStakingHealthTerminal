import { ModuleSnapshot } from "@/data/mock-networks";

type ModuleCardProps = {
  module: ModuleSnapshot;
};

function scoreTone(score: number) {
  if (score >= 70) return "text-mint border-mint/40 bg-mint/10";
  if (score >= 55) return "text-amber border-amber/40 bg-amber/10";
  return "text-coral border-coral/40 bg-coral/10";
}

function statusTone(status: ModuleSnapshot["status"]) {
  if (status === "Strong" || status === "Healthy") return "text-mint border-mint/35 bg-mint/10";
  if (status === "Mixed" || status === "Watchlist" || status === "Constrained") {
    return "text-amber border-amber/35 bg-amber/10";
  }
  return "text-coral border-coral/35 bg-coral/10";
}

export function ModuleCard({ module }: ModuleCardProps) {
  return (
    <article className="flex h-full flex-col gap-4 rounded-2xl border border-ink-300/20 bg-slateglass-600/65 p-5 shadow-card transition-transform duration-300 hover:-translate-y-1">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-[var(--font-heading)] text-lg font-semibold text-ink-50">{module.name}</h3>
          <p className="mt-1 text-sm leading-relaxed text-ink-100/90">{module.rationale}</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <span className={`rounded-lg border px-3 py-1 text-sm font-semibold ${scoreTone(module.score)}`}>
            {module.score}
          </span>
          <span className={`rounded-md border px-2 py-1 text-xs font-semibold ${statusTone(module.status)}`}>
            {module.status}
          </span>
        </div>
      </div>

      <div className="grid gap-2 rounded-xl border border-ink-300/20 bg-ink-900/30 p-3">
        {module.metrics.slice(0, 2).map((metric) => (
          <div key={metric.label} className="flex items-center justify-between gap-2 text-sm">
            <span className="text-ink-300">{metric.label}</span>
            <span className="font-semibold text-ink-50">{metric.value}</span>
          </div>
        ))}
      </div>

      <div className="mt-auto rounded-xl border border-ink-300/20 bg-ink-900/25 p-3 text-sm text-ink-100">
        <p className="text-xs uppercase tracking-[0.16em] text-ink-300">Key Insight</p>
        <p className="mt-1">{module.keyInsight}</p>
        <p className="mt-2 border-t border-ink-300/20 pt-2 text-coral">Risk: {module.redFlag}</p>
      </div>
    </article>
  );
}
