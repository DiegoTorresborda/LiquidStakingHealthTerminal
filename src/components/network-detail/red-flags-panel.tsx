import type { DetailRedFlag } from "@/features/network-detail/types";
import { redFlagSeverityClass } from "@/features/network-detail/utils";

type RedFlagsPanelProps = {
  redFlags: DetailRedFlag[];
};

export function RedFlagsPanel({ redFlags }: RedFlagsPanelProps) {
  return (
    <section className="rounded-2xl border border-coral/35 bg-gradient-to-br from-coral/12 to-slateglass-600/45 p-5 shadow-card">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-[var(--font-heading)] text-xl font-semibold text-ink-50">Red Flags</h2>
        <span className="rounded-md border border-coral/35 bg-coral/15 px-2 py-1 text-xs font-semibold text-coral">
          LP-Facing Risks
        </span>
      </div>

      <div className="space-y-3">
        {redFlags.map((flag) => (
          <article key={flag.id} className="rounded-xl border border-ink-300/20 bg-ink-900/30 p-4">
            <div className="mb-2 flex items-center justify-between gap-3">
              <h3 className="font-semibold text-ink-50">{flag.title}</h3>
              <span className={`rounded-md border px-2 py-1 text-xs font-semibold ${redFlagSeverityClass(flag.severity)}`}>
                {flag.severity}
              </span>
            </div>
            {flag.linkedModule ? (
              <p className="text-xs uppercase tracking-[0.14em] text-ink-300">{flag.linkedModule}</p>
            ) : null}
            <p className="mt-2 text-sm text-ink-100">{flag.detail}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
