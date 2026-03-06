import type { DetailOpportunity } from "@/features/network-detail/types";
import { opportunityImpactClass } from "@/features/network-detail/utils";

type OpportunityItemProps = {
  opportunity: DetailOpportunity;
  rank: number;
};

export function OpportunityItem({ opportunity, rank }: OpportunityItemProps) {
  return (
    <article className="rounded-xl border border-ink-300/20 bg-ink-900/30 p-4">
      <div className="mb-2 flex items-center justify-between gap-3">
        <h3 className="font-semibold text-ink-50">
          {rank}. {opportunity.title}
        </h3>
        <span className={`rounded-md border px-2 py-1 text-xs font-semibold ${opportunityImpactClass(opportunity.impact)}`}>
          {opportunity.impact}
        </span>
      </div>
      <p className="text-xs uppercase tracking-[0.14em] text-ink-300">{opportunity.linkedModule}</p>
      <p className="mt-2 text-sm text-ink-100">
        <span className="font-semibold text-ink-50">Why it matters:</span> {opportunity.whyItMatters}
      </p>
      <p className="mt-2 text-sm text-ink-100">
        <span className="font-semibold text-ink-50">Expected benefit:</span> {opportunity.expectedBenefit}
      </p>
    </article>
  );
}
