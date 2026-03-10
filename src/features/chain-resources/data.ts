import chainResourcesRegistry from "@data/chain-resources.json";

export type ChainResourceCategory =
  | "official"
  | "docs"
  | "explorer"
  | "staking"
  | "governance"
  | "developer"
  | "ecosystem"
  | "analytics"
  | "community"
  | "validators"
  | "liquidity"
  | "bridges";

export type ChainResource = {
  label: string;
  url: string;
  category: ChainResourceCategory;
  priority: number;
  description?: string;
};

export type ChainResourceGroup = {
  category: ChainResourceCategory;
  categoryLabel: string;
  resources: ChainResource[];
};

type RawResource = {
  label?: unknown;
  url?: unknown;
  category?: unknown;
  priority?: unknown;
  description?: unknown;
};

const CATEGORY_ORDER: ChainResourceCategory[] = [
  "official",
  "docs",
  "explorer",
  "staking",
  "governance",
  "developer",
  "validators",
  "ecosystem",
  "analytics",
  "community",
  "liquidity",
  "bridges"
];

const CATEGORY_LABELS: Record<ChainResourceCategory, string> = {
  official: "Official",
  docs: "Docs",
  explorer: "Explorer",
  staking: "Staking",
  governance: "Governance",
  developer: "Developer",
  validators: "Validators",
  ecosystem: "Ecosystem",
  analytics: "Analytics",
  community: "Community",
  liquidity: "Liquidity",
  bridges: "Bridges"
};

const VALID_CATEGORIES = new Set<ChainResourceCategory>(CATEGORY_ORDER);

function toSafeResource(raw: RawResource): ChainResource | null {
  if (typeof raw.label !== "string" || raw.label.trim().length === 0) return null;
  if (typeof raw.url !== "string" || raw.url.trim().length === 0) return null;
  if (typeof raw.category !== "string" || !VALID_CATEGORIES.has(raw.category as ChainResourceCategory)) return null;
  if (typeof raw.priority !== "number" || !Number.isFinite(raw.priority)) return null;

  const description =
    typeof raw.description === "string" && raw.description.trim().length > 0 ? raw.description.trim() : undefined;

  return {
    label: raw.label.trim(),
    url: raw.url.trim(),
    category: raw.category as ChainResourceCategory,
    priority: raw.priority,
    description
  };
}

function sortByPriority(resources: ChainResource[]): ChainResource[] {
  return [...resources].sort((a, b) => {
    if (a.priority !== b.priority) return a.priority - b.priority;
    return a.label.localeCompare(b.label);
  });
}

export function getChainResources(networkId: string | null | undefined): ChainResource[] {
  if (!networkId) return [];

  const raw = (chainResourcesRegistry as Record<string, RawResource[]>)[networkId];
  if (!Array.isArray(raw)) return [];

  return sortByPriority(raw.map(toSafeResource).filter((item): item is ChainResource => item !== null));
}

export function getGroupedChainResources(networkId: string | null | undefined): ChainResourceGroup[] {
  const resources = getChainResources(networkId);
  if (resources.length === 0) return [];

  return CATEGORY_ORDER.map((category) => {
    const grouped = resources.filter((resource) => resource.category === category);
    if (grouped.length === 0) return null;

    return {
      category,
      categoryLabel: CATEGORY_LABELS[category],
      resources: grouped
    } satisfies ChainResourceGroup;
  }).filter((group): group is ChainResourceGroup => group !== null);
}

export function getPrimaryQuickActionResources(networkId: string | null | undefined): ChainResource[] {
  return getChainResources(networkId);
}
