import type { ChainResourceGroup } from "@/features/chain-resources/data";

import { ChainResourceLink } from "@/components/chain-resources/chain-resource-link";

type ChainResourcesGroupProps = {
  group: ChainResourceGroup;
};

export function ChainResourcesGroup({ group }: ChainResourcesGroupProps) {
  return (
    <article className="rounded-xl border border-ink-300/20 bg-ink-900/25 p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-xs uppercase tracking-[0.16em] text-ink-300">{group.categoryLabel}</h3>
        <span className="rounded-md border border-ink-300/25 px-2 py-0.5 text-[10px] uppercase tracking-[0.12em] text-ink-300">
          {group.resources.length}
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        {group.resources.map((resource) => (
          <ChainResourceLink key={`${group.category}-${resource.label}-${resource.url}`} resource={resource} />
        ))}
      </div>
    </article>
  );
}
