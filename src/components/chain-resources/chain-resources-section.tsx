import { ChainResourcesGroup } from "@/components/chain-resources/chain-resources-group";
import { getGroupedChainResources } from "@/features/chain-resources/data";

type ChainResourcesSectionProps = {
  networkId: string;
  showEmptyState?: boolean;
};

export function ChainResourcesSection({ networkId, showEmptyState = false }: ChainResourcesSectionProps) {
  const groups = getGroupedChainResources(networkId);

  if (groups.length === 0) {
    if (!showEmptyState) {
      return null;
    }

    return (
      <section className="rounded-2xl border border-ink-300/20 bg-slateglass-700/45 p-5 shadow-card">
        <h2 className="font-[var(--font-heading)] text-xl font-semibold text-ink-50">Chain Resources</h2>
        <p className="mt-2 text-sm text-ink-200">No curated links available for this chain yet.</p>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-ink-300/20 bg-slateglass-700/45 p-5 shadow-card">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-[var(--font-heading)] text-xl font-semibold text-ink-50">Chain Resources</h2>
        <p className="text-xs uppercase tracking-[0.16em] text-ink-300">Curated registry</p>
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        {groups.map((group) => (
          <ChainResourcesGroup key={group.category} group={group} />
        ))}
      </div>
    </section>
  );
}
