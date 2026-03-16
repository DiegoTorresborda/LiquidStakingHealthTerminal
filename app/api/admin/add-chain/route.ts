import { NextResponse } from "next/server";
import { addChain, checkChainExists, CATEGORIES, type AddChainInput } from "@/features/admin/server/add-chain";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  if (!payload || typeof payload !== "object") {
    return NextResponse.json({ ok: false, error: "Missing payload" }, { status: 400 });
  }

  const p = payload as Record<string, unknown>;

  // Eligibility gates
  if (p.isL1 !== true) {
    return NextResponse.json({ ok: false, error: "Only L1 blockchains are supported." }, { status: 400 });
  }
  if (p.isPoS !== true) {
    return NextResponse.json({ ok: false, error: "Only validator-based consensus chains are supported (PoS or BFT)." }, { status: 400 });
  }

  // Required field validation
  const networkId = typeof p.networkId === "string" ? p.networkId.trim() : "";
  if (!networkId || !/^[a-z][a-z0-9-]*$/.test(networkId)) {
    return NextResponse.json({ ok: false, error: "networkId must be lowercase kebab-case (e.g. my-chain)" }, { status: 400 });
  }

  const network = typeof p.network === "string" ? p.network.trim() : "";
  if (!network) return NextResponse.json({ ok: false, error: "network display name is required" }, { status: 400 });

  const token = typeof p.token === "string" ? p.token.trim().toUpperCase() : "";
  if (!token) return NextResponse.json({ ok: false, error: "token symbol is required" }, { status: 400 });

  const coingeckoId = typeof p.coingeckoId === "string" ? p.coingeckoId.trim() : "";
  if (!coingeckoId) return NextResponse.json({ ok: false, error: "coingeckoId is required" }, { status: 400 });

  const defillamaChain = typeof p.defillamaChain === "string" ? p.defillamaChain.trim() : "";
  if (!defillamaChain) return NextResponse.json({ ok: false, error: "defillamaChain is required" }, { status: 400 });

  const dexscreenerChainId = typeof p.dexscreenerChainId === "string" ? p.dexscreenerChainId.trim() : "";
  if (!dexscreenerChainId) return NextResponse.json({ ok: false, error: "dexscreenerChainId is required" }, { status: 400 });

  const etherscanChainId = typeof p.etherscanChainId === "string" && p.etherscanChainId.trim()
    ? p.etherscanChainId.trim()
    : null;

  const hasLst = p.hasLst === true;
  const lstSymbol = typeof p.lstSymbol === "string" && p.lstSymbol.trim()
    ? p.lstSymbol.trim().toUpperCase()
    : `st${token}`;

  const category = typeof p.category === "string" ? p.category.trim() : "";
  if (!CATEGORIES.includes(category as typeof CATEGORIES[number])) {
    return NextResponse.json({ ok: false, error: "Invalid category" }, { status: 400 });
  }

  // Idempotency check
  const conflicts = checkChainExists(networkId);
  if (conflicts.length > 0) {
    return NextResponse.json(
      { ok: false, error: `Chain "${networkId}" already exists`, conflicts },
      { status: 409 }
    );
  }

  const input: AddChainInput = {
    networkId, network, token, category, coingeckoId, defillamaChain,
    dexscreenerChainId, etherscanChainId, hasLst, lstSymbol
  };

  const results = addChain(input);
  const hadError = results.some(r => !r.ok);

  return NextResponse.json({ ok: !hadError, results });
}
