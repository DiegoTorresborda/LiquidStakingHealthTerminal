import { NextResponse } from "next/server";

import { executeDataSync } from "@/features/admin/server/sync";
import {
  getGeneratedDatasetSummary,
  getLatestRawSnapshotBySource,
  loadAdminSyncStatus
} from "@/features/admin/server/store";
import type { SyncSourceKey } from "@/features/admin/server/types";

export const runtime = "nodejs";

const VALID_SYNC_SOURCES: SyncSourceKey[] = ["coingecko", "defillama", "dexscreener", "explorer", "all"];

function isValidSource(value: string): value is SyncSourceKey {
  return VALID_SYNC_SOURCES.includes(value as SyncSourceKey);
}

export async function GET() {
  console.log("[data-sync] GET — loading sync status and snapshots");

  try {
    const [datasetSummary, syncStatus, coingeckoSnapshot, defillamaSnapshot, dexscreenerSnapshot, explorerSnapshot] =
      await Promise.all([
        getGeneratedDatasetSummary(),
        loadAdminSyncStatus(),
        getLatestRawSnapshotBySource("coingecko"),
        getLatestRawSnapshotBySource("defillama"),
        getLatestRawSnapshotBySource("dexscreener"),
        getLatestRawSnapshotBySource("explorer")
      ]);

    console.log("[data-sync] GET — dataset: %d networks, last updated %s", datasetSummary.networkCount, datasetSummary.lastUpdatedAt ?? "never");
    console.log("[data-sync] GET — latest snapshots: coingecko=%s, defillama=%s, dexscreener=%s, explorer=%s",
      coingeckoSnapshot ?? "none", defillamaSnapshot ?? "none", dexscreenerSnapshot ?? "none", explorerSnapshot ?? "none");

    return NextResponse.json({
      ok: true,
      dataset: datasetSummary,
      syncStatus,
      snapshots: {
        coingecko: coingeckoSnapshot,
        defillama: defillamaSnapshot,
        dexscreener: dexscreenerSnapshot,
        explorer: explorerSnapshot
      }
    });
  } catch (error) {
    console.error("[data-sync] GET — failed to load sync status:", error instanceof Error ? error.message : error);
    return NextResponse.json({ ok: false, error: "Failed to load sync status" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const payload = (await request.json().catch(() => null)) as { source?: string } | null;
  const source = payload?.source;

  console.log("[data-sync] POST — received sync request for source: %s", source ?? "(missing)");

  if (typeof source !== "string" || !isValidSource(source)) {
    console.warn("[data-sync] POST — rejected invalid source: %s", source);
    return NextResponse.json(
      {
        ok: false,
        error: "Invalid sync source"
      },
      { status: 400 }
    );
  }

  try {
    const result = await executeDataSync(source);
    const datasetSummary = await getGeneratedDatasetSummary();

    console.log("[data-sync] POST — sync completed for %s: %d statuses, dataset has %d networks",
      source, result.statuses.length, datasetSummary.networkCount);

    return NextResponse.json({
      ok: true,
      source,
      result,
      dataset: datasetSummary
    });
  } catch (error) {
    console.error("[data-sync] POST — sync failed for %s:", source, error instanceof Error ? error.message : error);
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Sync failed"
      },
      { status: 500 }
    );
  }
}
