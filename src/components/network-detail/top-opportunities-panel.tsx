import type { DetailOpportunity } from "@/features/network-detail/types";

import { OpportunityItem } from "@/components/network-detail/opportunity-item";

type TopOpportunitiesPanelProps = {
  opportunities: DetailOpportunity[];
};

export function TopOpportunitiesPanel({ opportunities }: TopOpportunitiesPanelProps) {
  return (
    <section className="rounded-2xl border border-[#7baff5]/35 bg-gradient-to-br from-[#7baff5]/12 to-slateglass-600/45 p-5 shadow-card">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-[var(--font-heading)] text-xl font-semibold text-ink-50">Top Opportunities</h2>
        <span className="rounded-md border border-[#7baff5]/35 bg-[#7baff5]/15 px-2 py-1 text-xs font-semibold text-[#a9ceff]">
          Ranked Priority
        </span>
      </div>

      <div className="space-y-3">
        {opportunities.slice(0, 5).map((opportunity, index) => (
          <OpportunityItem key={opportunity.id} opportunity={opportunity} rank={index + 1} />
        ))}
      </div>
    </section>
  );
}
