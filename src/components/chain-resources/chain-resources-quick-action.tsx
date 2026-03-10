import { ChainResourceLink } from "@/components/chain-resources/chain-resource-link";
import { getPrimaryQuickActionResources } from "@/features/chain-resources/data";

type ChainResourcesQuickActionProps = {
  networkId: string;
};

export function ChainResourcesQuickAction({ networkId }: ChainResourcesQuickActionProps) {
  const resources = getPrimaryQuickActionResources(networkId);

  if (resources.length === 0) {
    return <span className="text-xs text-ink-300">Resources N/A</span>;
  }

  return (
    <details className="relative" onClick={(event) => event.stopPropagation()}>
      <summary className="inline-flex cursor-pointer rounded-md border border-ink-300/30 bg-ink-900/25 px-2 py-1 text-xs font-medium text-ink-100 hover:bg-ink-900/40">
        Resources
      </summary>

      <div className="absolute left-0 top-8 z-20 w-64 rounded-xl border border-ink-300/20 bg-slateglass-700/95 p-3 shadow-glow backdrop-blur">
        <p className="mb-2 text-[10px] uppercase tracking-[0.16em] text-ink-300">Available Links</p>
        <div className="flex flex-wrap gap-2">
          {resources.map((resource) => (
            <ChainResourceLink
              key={`${resource.category}-${resource.label}-${resource.url}`}
              resource={resource}
              compact
            />
          ))}
        </div>
      </div>
    </details>
  );
}
