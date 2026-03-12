import { mkdir, readFile, readdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";

import { networks } from "@data/networks";

import type {
  AdminSyncStatusFile,
  ChainResourceCategory,
  ChainResourcesFile,
  ManualNetworkDataFile,
  ManualNetworkEntry,
  ManualUiFieldEntry,
  ManualUiFieldsFile,
  OverrideEntry,
  OverridesFile,
  SyncSourceStatus
} from "@/features/admin/server/types";

const DATA_DIR = path.join(process.cwd(), "data");
const MANUAL_DIR = path.join(DATA_DIR, "manual");
const RAW_DIR = path.join(DATA_DIR, "raw");

export const GENERATED_DATASET_PATH = path.join(DATA_DIR, "networks.generated.json");
export const MANUAL_NETWORK_DATA_PATH = path.join(MANUAL_DIR, "manual-network-data.json");
export const MANUAL_UI_FIELDS_PATH = path.join(MANUAL_DIR, "network-ui-fields.json");
export const OVERRIDES_PATH = path.join(MANUAL_DIR, "overrides.json");
export const CHAIN_RESOURCES_PATH = path.join(DATA_DIR, "chain-resources.json");
export const ADMIN_SYNC_STATUS_PATH = path.join(MANUAL_DIR, "admin-sync-status.json");

const CHAIN_RESOURCE_CATEGORIES: ChainResourceCategory[] = [
  "official",
  "docs",
  "explorer",
  "staking",
  "governance",
  "developer",
  "ecosystem",
  "analytics",
  "community",
  "validators",
  "liquidity",
  "bridges"
];

function isValidCategory(value: string): value is ChainResourceCategory {
  return CHAIN_RESOURCE_CATEGORIES.includes(value as ChainResourceCategory);
}

async function fileExists(filePath: string): Promise<boolean> {
  try {
    await stat(filePath);
    return true;
  } catch {
    return false;
  }
}

export async function readJsonWithFallback<T>(filePath: string, fallback: T): Promise<T> {
  try {
    const raw = await readFile(filePath, "utf8");
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export async function writeJson(filePath: string, payload: unknown): Promise<void> {
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
}

export async function loadGeneratedDataset(): Promise<Array<Record<string, unknown>>> {
  return readJsonWithFallback<Array<Record<string, unknown>>>(GENERATED_DATASET_PATH, []);
}

export async function getGeneratedDatasetSummary() {
  const dataset = await loadGeneratedDataset();
  const networkCount = dataset.length;

  const timestamps = dataset
    .map((record) => (typeof record.asOf === "string" ? record.asOf : null))
    .filter((value): value is string => value !== null)
    .sort();

  return {
    networkCount,
    lastUpdatedAt: timestamps.length > 0 ? timestamps[timestamps.length - 1] : null
  };
}

function normalizeManualEntry(entry: ManualNetworkEntry): ManualNetworkEntry {
  const normalizeNumber = (value: unknown): number | null | undefined => {
    if (typeof value === "number" && Number.isFinite(value)) return value;
    if (value === null) return null;
    return undefined;
  };

  const normalizeNotes = (value: unknown): string | null | undefined => {
    if (typeof value === "string") {
      const trimmed = value.trim();
      return trimmed.length > 0 ? trimmed : null;
    }

    if (value === null) return null;
    return undefined;
  };

  return {
    stakingRatioPct: normalizeNumber(entry.stakingRatioPct),
    stakingApyPct: normalizeNumber(entry.stakingApyPct),
    validatorCount: normalizeNumber(entry.validatorCount),
    inflationRatePct: normalizeNumber(entry.inflationRatePct),
    notes: normalizeNotes(entry.notes),
    updatedAt: typeof entry.updatedAt === "string" ? entry.updatedAt : undefined
  };
}

export async function loadManualNetworkData(): Promise<ManualNetworkDataFile> {
  const fallback: ManualNetworkDataFile = {
    source: "manual-network-data",
    updatedAt: null,
    networks: {}
  };

  const file = await readJsonWithFallback<ManualNetworkDataFile>(MANUAL_NETWORK_DATA_PATH, fallback);

  if (!file.networks || typeof file.networks !== "object") {
    return fallback;
  }

  const normalizedNetworks = Object.fromEntries(
    Object.entries(file.networks).map(([networkId, entry]) => [networkId, normalizeManualEntry(entry ?? {})])
  );

  return {
    source: "manual-network-data",
    updatedAt: typeof file.updatedAt === "string" ? file.updatedAt : null,
    networks: normalizedNetworks
  };
}

export async function saveManualNetworkDataEntry(networkId: string, entry: ManualNetworkEntry) {
  const current = await loadManualNetworkData();
  const now = new Date().toISOString();

  current.networks[networkId] = {
    ...current.networks[networkId],
    ...normalizeManualEntry(entry),
    updatedAt: now
  };

  current.updatedAt = now;

  await writeJson(MANUAL_NETWORK_DATA_PATH, current);
  return current;
}

function normalizeManualUiEntry(entry: ManualUiFieldEntry): ManualUiFieldEntry {
  const normalizeNumber = (value: unknown): number | null | undefined => {
    if (typeof value === "number" && Number.isFinite(value)) return value;
    if (value === null) return null;
    return undefined;
  };

  const normalizeString = (value: unknown): string | null | undefined => {
    if (typeof value === "string") {
      const trimmed = value.trim();
      return trimmed.length > 0 ? trimmed : null;
    }

    if (value === null) return null;
    return undefined;
  };

  const normalizeBoolean = (value: unknown): boolean | null | undefined => {
    if (typeof value === "boolean") return value;
    if (value === null) return null;
    return undefined;
  };

  return {
    category: normalizeString(entry.category),
    status: normalizeString(entry.status),
    fdvUsd: normalizeNumber(entry.fdvUsd),
    circulatingSupplyPct: normalizeNumber(entry.circulatingSupplyPct),
    stakerAddresses: normalizeNumber(entry.stakerAddresses),
    lstProtocols: normalizeNumber(entry.lstProtocols),
    largestLst: normalizeString(entry.largestLst),
    lendingPresence: normalizeBoolean(entry.lendingPresence),
    lstCollateralEnabled: normalizeBoolean(entry.lstCollateralEnabled),
    mainBottleneck: normalizeString(entry.mainBottleneck),
    mainOpportunity: normalizeString(entry.mainOpportunity),
    updatedAt: typeof entry.updatedAt === "string" ? entry.updatedAt : undefined
  };
}

export async function loadManualUiFields(): Promise<ManualUiFieldsFile> {
  const fallback: ManualUiFieldsFile = {
    source: "manual-ui-fields",
    updatedAt: null,
    networks: {}
  };

  const file = await readJsonWithFallback<ManualUiFieldsFile>(MANUAL_UI_FIELDS_PATH, fallback);

  if (!file.networks || typeof file.networks !== "object") {
    return fallback;
  }

  const normalizedNetworks = Object.fromEntries(
    Object.entries(file.networks).map(([networkId, entry]) => [networkId, normalizeManualUiEntry(entry ?? {})])
  );

  return {
    source: "manual-ui-fields",
    updatedAt: typeof file.updatedAt === "string" ? file.updatedAt : null,
    networks: normalizedNetworks
  };
}

export async function saveManualUiFieldsEntry(networkId: string, entry: ManualUiFieldEntry) {
  const current = await loadManualUiFields();
  const now = new Date().toISOString();

  current.networks[networkId] = {
    ...current.networks[networkId],
    ...normalizeManualUiEntry(entry),
    updatedAt: now
  };

  current.updatedAt = now;

  await writeJson(MANUAL_UI_FIELDS_PATH, current);
  return current;
}

function normalizeResourceItem(item: Record<string, unknown>) {
  const label = typeof item.label === "string" ? item.label.trim() : "";
  const url = typeof item.url === "string" ? item.url.trim() : "";
  const category = typeof item.category === "string" && isValidCategory(item.category) ? item.category : null;
  const priority = typeof item.priority === "number" && Number.isFinite(item.priority) ? item.priority : null;
  const description = typeof item.description === "string" ? item.description.trim() : "";

  if (!label || !url || !category || priority === null) {
    return null;
  }

  return {
    label,
    url,
    category,
    priority,
    ...(description ? { description } : {})
  };
}

export async function loadChainResources(): Promise<ChainResourcesFile> {
  const resources = await readJsonWithFallback<ChainResourcesFile>(CHAIN_RESOURCES_PATH, {});
  if (!resources || typeof resources !== "object") {
    return {};
  }

  const normalized: ChainResourcesFile = {};

  for (const [networkId, items] of Object.entries(resources)) {
    if (!Array.isArray(items)) continue;

    normalized[networkId] = items
      .map((item) => (item && typeof item === "object" ? normalizeResourceItem(item as Record<string, unknown>) : null))
      .filter((item): item is NonNullable<typeof item> => item !== null)
      .sort((a, b) => {
        if (a.priority !== b.priority) return a.priority - b.priority;
        return a.label.localeCompare(b.label);
      });
  }

  return normalized;
}

export async function saveChainResources(networkId: string, entries: Record<string, unknown>[]) {
  const current = await loadChainResources();

  current[networkId] = entries
    .map((item) => normalizeResourceItem(item))
    .filter((item): item is NonNullable<typeof item> => item !== null)
    .sort((a, b) => {
      if (a.priority !== b.priority) return a.priority - b.priority;
      return a.label.localeCompare(b.label);
    });

  await writeJson(CHAIN_RESOURCES_PATH, current);
  return current;
}

export async function loadOverrides(): Promise<OverridesFile> {
  const fallback: OverridesFile = {
    source: "manual-overrides",
    updatedAt: null,
    overrides: []
  };

  const file = await readJsonWithFallback<OverridesFile>(OVERRIDES_PATH, fallback);

  if (!Array.isArray(file.overrides)) {
    return fallback;
  }

  const overrides = file.overrides.filter((entry): entry is OverrideEntry => {
    return (
      typeof entry.id === "string" &&
      typeof entry.networkId === "string" &&
      typeof entry.field === "string" &&
      typeof entry.reason === "string" &&
      typeof entry.timestamp === "string"
    );
  });

  return {
    source: "manual-overrides",
    updatedAt: typeof file.updatedAt === "string" ? file.updatedAt : null,
    overrides
  };
}

export async function addOverride(entry: Omit<OverrideEntry, "id" | "timestamp"> & { id?: string; timestamp?: string }) {
  const current = await loadOverrides();
  const now = new Date().toISOString();

  const override: OverrideEntry = {
    id: entry.id ?? `ovr_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`,
    networkId: entry.networkId,
    field: entry.field,
    value: entry.value,
    reason: entry.reason,
    timestamp: entry.timestamp ?? now
  };

  current.overrides.unshift(override);
  current.updatedAt = now;

  await writeJson(OVERRIDES_PATH, current);
  return override;
}

export async function removeOverride(id: string): Promise<boolean> {
  const current = await loadOverrides();
  const initialLength = current.overrides.length;

  current.overrides = current.overrides.filter((entry) => entry.id !== id);

  if (current.overrides.length === initialLength) {
    return false;
  }

  current.updatedAt = new Date().toISOString();
  await writeJson(OVERRIDES_PATH, current);
  return true;
}

export async function loadAdminSyncStatus(): Promise<AdminSyncStatusFile> {
  return readJsonWithFallback<AdminSyncStatusFile>(ADMIN_SYNC_STATUS_PATH, {
    updatedAt: null,
    sources: {}
  });
}

export async function upsertAdminSyncStatuses(sourceStatuses: SyncSourceStatus[]) {
  const current = await loadAdminSyncStatus();
  const now = new Date().toISOString();

  for (const status of sourceStatuses) {
    current.sources[status.source] = status;
  }

  current.updatedAt = now;
  await writeJson(ADMIN_SYNC_STATUS_PATH, current);
  return current;
}

export async function writeRawSnapshot(source: string, payload: unknown, timestamp: string) {
  const safeTimestamp = timestamp.replace(/[:.]/g, "-");
  const outputPath = path.join(RAW_DIR, source, `${safeTimestamp}.json`);
  await writeJson(outputPath, payload);
  return outputPath;
}

export async function getLatestRawSnapshotBySource(source: string): Promise<string | null> {
  const dir = path.join(RAW_DIR, source);

  if (!(await fileExists(dir))) {
    return null;
  }

  const entries = await readdir(dir);
  const files = entries.filter((entry) => entry.endsWith(".json")).sort();

  if (files.length === 0) {
    return null;
  }

  const latest = files[files.length - 1];
  return path.join(dir, latest);
}

export function getNetworkOptions() {
  return networks.map((network) => ({
    networkId: network.networkId,
    network: network.network,
    token: network.token
  }));
}
