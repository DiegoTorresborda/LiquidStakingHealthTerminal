import type { ChainResource } from "@/features/chain-resources/data";

type ChainResourceLinkProps = {
  resource: ChainResource;
  compact?: boolean;
};

export function ChainResourceLink({ resource, compact = false }: ChainResourceLinkProps) {
  return (
    <a
      href={resource.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`group inline-flex items-center gap-1.5 rounded-md border border-ink-300/25 bg-ink-900/25 px-2.5 py-1.5 text-sm text-ink-100 transition hover:border-[#7baff5]/35 hover:bg-ink-900/40 hover:text-ink-50 ${
        compact ? "text-xs" : ""
      }`}
    >
      <span className="truncate">{resource.label}</span>
      <span className="text-[10px] text-ink-300 transition group-hover:text-[#a9ceff]">↗</span>
    </a>
  );
}
