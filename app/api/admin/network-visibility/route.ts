import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const VISIBILITY_PATH = join(process.cwd(), "data/manual/network-visibility.json");

function readVisibility(): { hidden: string[] } {
  try {
    return JSON.parse(readFileSync(VISIBILITY_PATH, "utf-8"));
  } catch {
    return { hidden: [] };
  }
}

export async function GET() {
  return NextResponse.json(readVisibility());
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const { networkId, hidden } = body as { networkId: string; hidden: boolean };

  if (!networkId || typeof networkId !== "string") {
    return NextResponse.json({ ok: false, error: "networkId is required" }, { status: 400 });
  }

  const data = readVisibility();

  if (hidden) {
    if (!data.hidden.includes(networkId)) data.hidden.push(networkId);
  } else {
    data.hidden = data.hidden.filter((id) => id !== networkId);
  }

  writeFileSync(VISIBILITY_PATH, JSON.stringify(data, null, 2));
  return NextResponse.json({ ok: true, hidden: data.hidden });
}
