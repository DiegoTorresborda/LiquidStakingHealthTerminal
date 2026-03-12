import { NextResponse } from "next/server";

import { loadChainResources, saveChainResources } from "@/features/admin/server/store";

export const runtime = "nodejs";

export async function GET() {
  const resources = await loadChainResources();

  return NextResponse.json({
    ok: true,
    resources
  });
}

export async function POST(request: Request) {
  const payload = (await request.json().catch(() => null)) as
    | {
        networkId?: string;
        resources?: Record<string, unknown>[];
      }
    | null;

  const networkId = typeof payload?.networkId === "string" ? payload.networkId : "";
  const resources = Array.isArray(payload?.resources) ? payload.resources : null;

  if (!networkId || resources === null) {
    return NextResponse.json(
      {
        ok: false,
        error: "networkId and resources are required"
      },
      { status: 400 }
    );
  }

  const updated = await saveChainResources(networkId, resources);

  return NextResponse.json({
    ok: true,
    resources: updated
  });
}
