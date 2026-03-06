import { Opportunity } from "@/data/mock-networks";

type OpportunitiesPanelProps = {
  opportunities: Opportunity[];
};

export function OpportunitiesPanel({ opportunities }: OpportunitiesPanelProps) {
  return (
    <section className="rounded-2xl border border-mint/30 bg-gradient-to-br from-mint/10 to-slateglass-600/50 p-5 shadow-card">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-[var(--font-heading)] text-xl font-semibold text-ink-50">Opportunities</h2>
        <span className="rounded-md border border-mint/35 bg-mint/15 px-2 py-1 text-xs font-semibold text-mint">
          Highest Leverage
        </span>
      </div>

      <div className="space-y-3">
        {opportunities.map((opportunity) => (
          <article key={opportunity.title} className="rounded-xl border border-ink-300/25 bg-ink-900/30 p-4">
            <div className="mb-2 flex items-center justify-between gap-3">
              <h3 className="font-semibold text-ink-50">{opportunity.title}</h3>
              <span className="rounded-md border border-ink-300/30 bg-slateglass-500/60 px-2 py-1 text-xs text-ink-50">
                {opportunity.impact} impact
              </span>
            </div>
            <p className="text-xs uppercase tracking-[0.14em] text-ink-300">{opportunity.module}</p>
            <p className="mt-2 text-sm leading-relaxed text-ink-100">
              <span className="font-semibold text-ink-50">Why it matters:</span> {opportunity.whyItMatters}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-ink-100">
              <span className="font-semibold text-ink-50">Expected benefit:</span> {opportunity.expectedBenefit}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
