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
  const [datasetSummary, syncStatus, coingeckoSnapshot, defillamaSnapshot, dexscreenerSnapshot, explorerSnapshot] =
    await Promise.all([
      getGeneratedDatasetSummary(),
      loadAdminSyncStatus(),
      getLatestRawSnapshotBySource("coingecko"),
      getLatestRawSnapshotBySource("defillama"),
      getLatestRawSnapshotBySource("dexscreener"),
      getLatestRawSnapshotBySource("explorer")
    ]);

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
}

export async function POST(request: Request) {
  const payload = (await request.json().catch(() => null)) as { source?: string } | null;
  const source = payload?.source;

  if (typeof source !== "string" || !isValidSource(source)) {
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

    return NextResponse.json({
      ok: true,
      source,
      result,
      dataset: datasetSummary
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Sync failed"
      },
      { status: 500 }
    );
  }
}
