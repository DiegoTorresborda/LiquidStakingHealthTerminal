import { NextResponse } from "next/server";

import { runDatasetRebuildOnly } from "@/features/admin/server/sync";
import {
  addOverride,
  getGeneratedDatasetSummary,
  loadGeneratedDataset,
  loadOverrides,
  removeOverride
} from "@/features/admin/server/store";

export const runtime = "nodejs";

type ScalarValue = string | number | boolean | null;

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
  const [overrides, dataset, records] = await Promise.all([
    loadOverrides(),
    getGeneratedDatasetSummary(),
    loadGeneratedDataset()
  ]);

  return {
    ok: true,
    overrides,
    dataset,
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
        field?: string;
        value?: string | number | boolean | null;
        reason?: string;
      }
    | null;

  const networkId = typeof payload?.networkId === "string" ? payload.networkId : "";
  const field = typeof payload?.field === "string" ? payload.field.trim() : "";
  const reason = typeof payload?.reason === "string" ? payload.reason.trim() : "";

  if (!networkId || !field || !reason) {
    return NextResponse.json(
      {
        ok: false,
        error: "networkId, field, and reason are required"
      },
      { status: 400 }
    );
  }

  const override = await addOverride({
    networkId,
    field,
    value: payload?.value ?? null,
    reason
  });

  await runDatasetRebuildOnly();

  return NextResponse.json({
    ...(await loadResponsePayload()),
    override
  });
}

export async function DELETE(request: Request) {
  const payload = (await request.json().catch(() => null)) as { id?: string } | null;
  const id = typeof payload?.id === "string" ? payload.id : "";

  if (!id) {
    return NextResponse.json(
      {
        ok: false,
        error: "id is required"
      },
      { status: 400 }
    );
  }

  const removed = await removeOverride(id);

  if (!removed) {
    return NextResponse.json(
      {
        ok: false,
        error: "Override not found"
      },
      { status: 404 }
    );
  }

  await runDatasetRebuildOnly();

  return NextResponse.json(await loadResponsePayload());
}
