type ContrastPoint = {
  title: string;
  detail: string;
};

type ContrastPanelProps = {
  strengths: ContrastPoint[];
  bottlenecks: ContrastPoint[];
};

export function ContrastPanel({ strengths, bottlenecks }: ContrastPanelProps) {
  return (
    <section className="grid gap-4 lg:grid-cols-2">
      <article className="rounded-2xl border border-mint/35 bg-gradient-to-br from-mint/12 to-slateglass-600/45 p-5 shadow-card">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-[var(--font-heading)] text-xl font-semibold text-ink-50">Structural Strengths</h2>
          <span className="rounded-md border border-mint/35 bg-mint/15 px-2 py-1 text-xs font-semibold text-mint">
            Foundation
          </span>
        </div>

        <div className="space-y-3">
          {strengths.map((point) => (
            <article key={point.title} className="rounded-xl border border-ink-300/25 bg-ink-900/25 p-4">
              <h3 className="font-semibold text-ink-50">{point.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-100">{point.detail}</p>
            </article>
          ))}
        </div>
      </article>

      <article className="rounded-2xl border border-coral/35 bg-gradient-to-br from-coral/12 to-slateglass-600/45 p-5 shadow-card">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-[var(--font-heading)] text-xl font-semibold text-ink-50">Strategic Bottlenecks</h2>
          <span className="rounded-md border border-coral/35 bg-coral/15 px-2 py-1 text-xs font-semibold text-coral">
            Upgrade Priority
          </span>
        </div>

        <div className="space-y-3">
          {bottlenecks.map((point) => (
            <article key={point.title} className="rounded-xl border border-ink-300/25 bg-ink-900/25 p-4">
              <h3 className="font-semibold text-ink-50">{point.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-100">{point.detail}</p>
            </article>
          ))}
        </div>
      </article>
    </section>
  );
}
