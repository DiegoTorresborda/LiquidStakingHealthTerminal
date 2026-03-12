import { NextResponse } from "next/server";

import { runDatasetRebuildOnly } from "@/features/admin/server/sync";
import {
  getGeneratedDatasetSummary,
  getNetworkOptions,
  loadGeneratedDataset,
  loadManualNetworkData,
  loadManualUiFields,
  saveManualNetworkDataEntry,
  saveManualUiFieldsEntry
} from "@/features/admin/server/store";

export const runtime = "nodejs";

type ScalarValue = string | number | boolean | null;

function toNumberOrNull(value: unknown): number | null | undefined {
  if (value === "" || value === undefined) {
    return undefined;
  }

  if (value === null) {
    return null;
  }

  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
  }

  return undefined;
}

function toStringOrNull(value: unknown): string | null | undefined {
  if (value === undefined) {
    return undefined;
  }

  if (value === null) {
    return null;
  }

  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : null;
  }

  return undefined;
}

function toBooleanOrNull(value: unknown): boolean | null | undefined {
  if (value === undefined) {
    return undefined;
  }

  if (value === null || value === "") {
    return null;
  }

  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "string") {
    const lowered = value.toLowerCase();
    if (lowered === "true") return true;
    if (lowered === "false") return false;
  }

  return undefined;
}

function toScalarRecords(records: Array<Record<string, unknown>>): Array<Record<string, ScalarValue>> {
  return records.map((record) => {
    const output: Record<string, ScalarValue> = {};

    for (const [key, value] of Object.entries(record)) {
      if (value === null || typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
        output[key] = value;
      }
    }

    return output;
  });
}

async function loadResponsePayload() {
  const [manualData, manualUiFields, dataset, networks, records] = await Promise.all([
    loadManualNetworkData(),
    loadManualUiFields(),
    getGeneratedDatasetSummary(),
    Promise.resolve(getNetworkOptions()),
    loadGeneratedDataset()
  ]);

  return {
    ok: true,
    manualData,
    manualUiFields,
    dataset,
    networks,
    records: toScalarRecords(records)
  };
}

export async function GET() {
  return NextResponse.json(await loadResponsePayload());
}

export async function POST(request: Request) {
  const payload = (await request.json().catch(() => null)) as
    | {
        networkId?: string;
        stakingRatioPct?: unknown;
        stakingApyPct?: unknown;
        validatorCount?: unknown;
        inflationRatePct?: unknown;
        notes?: unknown;
        category?: unknown;
        status?: unknown;
        fdvUsd?: unknown;
        circulatingSupplyPct?: unknown;
        stakerAddresses?: unknown;
        lstProtocols?: unknown;
        largestLst?: unknown;
        lendingPresence?: unknown;
        lstCollateralEnabled?: unknown;
        mainBottleneck?: unknown;
        mainOpportunity?: unknown;
      }
    | null;

  const networkId = typeof payload?.networkId === "string" ? payload.networkId : "";

  if (!networkId) {
    return NextResponse.json(
      {
        ok: false,
        error: "networkId is required"
      },
      { status: 400 }
    );
  }

  const stakingEntry = {
    stakingRatioPct: toNumberOrNull(payload?.stakingRatioPct),
    stakingApyPct: toNumberOrNull(payload?.stakingApyPct),
    validatorCount: toNumberOrNull(payload?.validatorCount),
    inflationRatePct: toNumberOrNull(payload?.inflationRatePct),
    notes: toStringOrNull(payload?.notes)
  };

  const uiEntry = {
    category: toStringOrNull(payload?.category),
    status: toStringOrNull(payload?.status),
    fdvUsd: toNumberOrNull(payload?.fdvUsd),
    circulatingSupplyPct: toNumberOrNull(payload?.circulatingSupplyPct),
    stakerAddresses: toNumberOrNull(payload?.stakerAddresses),
    lstProtocols: toNumberOrNull(payload?.lstProtocols),
    largestLst: toStringOrNull(payload?.largestLst),
    lendingPresence: toBooleanOrNull(payload?.lendingPresence),
    lstCollateralEnabled: toBooleanOrNull(payload?.lstCollateralEnabled),
    mainBottleneck: toStringOrNull(payload?.mainBottleneck),
    mainOpportunity: toStringOrNull(payload?.mainOpportunity)
  };

  await Promise.all([saveManualNetworkDataEntry(networkId, stakingEntry), saveManualUiFieldsEntry(networkId, uiEntry)]);

  await runDatasetRebuildOnly();

  return NextResponse.json(await loadResponsePayload());
}
