import type { DetailRedFlag } from "@/features/network-detail/types";
import { redFlagSeverityClass } from "@/features/network-detail/utils";

type RedFlagsPanelProps = {
  redFlags: DetailRedFlag[];
  /** Set of enabled improvement IDs — flags whose linkedOpportunityId is in this set show as resolved */
  enabledIds?: Set<string>;
};

export function RedFlagsPanel({ redFlags, enabledIds }: RedFlagsPanelProps) {
  return (
    <section className="rounded-2xl border border-coral/35 bg-gradient-to-br from-coral/12 to-slateglass-600/45 p-5 shadow-card">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-[var(--font-heading)] text-xl font-semibold text-ink-50">Red Flags</h2>
        <span className="rounded-md border border-coral/35 bg-coral/15 px-2 py-1 text-xs font-semibold text-coral">
          LP-Facing Risks
        </span>
      </div>

      <div className="space-y-3">
        {redFlags.map((flag) => {
          const isResolved =
            !!(flag.linkedOpportunityId && enabledIds?.has(flag.linkedOpportunityId));

          return (
            <article
              key={flag.id}
              className={`rounded-xl border p-4 transition-all duration-300 ${
                isResolved
                  ? "border-emerald-400/30 bg-emerald-900/10"
                  : "border-ink-300/20 bg-ink-900/30"
              }`}
            >
              <div className="mb-2 flex items-center justify-between gap-3">
                <h3
                  className={`font-semibold transition-colors ${
                    isResolved ? "text-emerald-200 line-through decoration-emerald-400/60" : "text-ink-50"
                  }`}
                >
                  {flag.title}
                </h3>
                {isResolved ? (
                  <span className="flex items-center gap-1 rounded-md border border-emerald-400/30 bg-emerald-900/25 px-2 py-1 text-xs font-semibold text-emerald-300">
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    Resolved
                  </span>
                ) : (
                  <span className={`rounded-md border px-2 py-1 text-xs font-semibold ${redFlagSeverityClass(flag.severity)}`}>
                    {flag.severity}
                  </span>
                )}
              </div>

              {flag.linkedModule ? (
                <p className={`text-xs uppercase tracking-[0.14em] ${isResolved ? "text-emerald-400/60" : "text-ink-300"}`}>
                  {flag.linkedModule}
                </p>
              ) : null}

              <p className={`mt-2 text-sm transition-colors ${isResolved ? "text-ink-400" : "text-ink-100"}`}>
                {flag.detail}
              </p>

              {flag.linkedOpportunityTitle && (
                <div className="mt-2 flex items-center gap-1.5 text-xs">
                  {isResolved ? (
                    <>
                      <svg className="h-3 w-3 shrink-0 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-emerald-400/70">Improvement planned:</span>
                      <span className="font-medium text-emerald-300">{flag.linkedOpportunityTitle}</span>
                    </>
                  ) : (
                    <>
                      <svg className="h-3 w-3 shrink-0 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                      <span className="text-ink-400">Fix in Improvement Plan:</span>
                      <span className="font-medium text-emerald-300">{flag.linkedOpportunityTitle}</span>
                    </>
                  )}
                </div>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}
