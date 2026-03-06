import { RedFlag } from "@/data/mock-networks";

type RedFlagsPanelProps = {
  redFlags: RedFlag[];
};

function severityStyle(severity: RedFlag["severity"]) {
  return severity === "High"
    ? "border-coral/40 bg-coral/15 text-coral"
    : "border-amber/40 bg-amber/15 text-amber";
}

export function RedFlagsPanel({ redFlags }: RedFlagsPanelProps) {
  return (
    <section className="rounded-2xl border border-coral/30 bg-gradient-to-br from-coral/10 to-slateglass-600/50 p-5 shadow-card">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-[var(--font-heading)] text-xl font-semibold text-ink-50">Red Flags</h2>
        <span className="rounded-md border border-coral/35 bg-coral/15 px-2 py-1 text-xs font-semibold text-coral">
          Structural Weaknesses
        </span>
      </div>

      <div className="space-y-3">
        {redFlags.map((flag) => (
          <article key={flag.title} className="rounded-xl border border-ink-300/25 bg-ink-900/30 p-4">
            <div className="mb-2 flex items-center justify-between gap-3">
              <h3 className="font-semibold text-ink-50">{flag.title}</h3>
              <span className={`rounded-md border px-2 py-1 text-xs font-semibold ${severityStyle(flag.severity)}`}>
                {flag.severity}
              </span>
            </div>
            <p className="text-xs uppercase tracking-[0.14em] text-ink-300">{flag.module}</p>
            <p className="mt-2 text-sm leading-relaxed text-ink-100">{flag.detail}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
