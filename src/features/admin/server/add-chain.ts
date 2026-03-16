import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { CATEGORIES } from "../shared/add-chain-constants";

export { CATEGORIES } from "../shared/add-chain-constants";

export type AddChainInput = {
  networkId: string;
  network: string;
  token: string;
  category: string;
  coingeckoId: string;
  defillamaChain: string;
  dexscreenerChainId: string;
  etherscanChainId: string | null;
  hasLst: boolean;
  lstSymbol: string;
};

export type PatchResult = {
  file: string;
  ok: boolean;
  skipped?: boolean;
  error?: string;
};

function root(...parts: string[]) {
  return path.join(process.cwd(), ...parts);
}

function readFile(relPath: string): string {
  return readFileSync(root(relPath), "utf8");
}

function writeFile(relPath: string, content: string): void {
  writeFileSync(root(relPath), content, "utf8");
}

function containsId(content: string, networkId: string): boolean {
  return (
    content.includes(`networkId: "${networkId}"`) ||
    content.includes(`"${networkId}":`) ||
    new RegExp(`^  ${networkId}:\\s*\\{`, "m").test(content)
  );
}

function generateOverrideId(): string {
  const a = Math.random().toString(36).slice(2, 10);
  const b = Math.random().toString(36).slice(2, 8);
  return `ovr_${a}_${b}`;
}

// ─── Idempotency ──────────────────────────────────────────────────────────────

export function checkChainExists(networkId: string): string[] {
  const files = [
    "data/networks.ts",
    "scripts/build-overview-dataset.ts",
    "scripts/sync-coingecko-basics.mjs",
    "scripts/sync-defillama-basics.mjs",
    "src/data/mappings/dexscreenerChains.ts",
    "src/data/mappings/etherscanChains.ts",
    "src/data/config/lstTokens.ts",
    "src/data/config/protocolContracts.ts",
    "src/data/config/importantAddresses.ts",
    "data/manual/network-ui-fields.json"
  ];
  return files.filter(f => {
    try { return containsId(readFile(f), networkId); }
    catch { return false; }
  });
}

// ─── File patchers ────────────────────────────────────────────────────────────

function patchNetworksTs(d: AddChainInput): string {
  const relPath = "data/networks.ts";
  const content = readFile(relPath);
  const anchor = "\n];\n\ntype GeneratedOverviewRecord";
  if (!content.includes(anchor)) throw new Error("Anchor not found");
  const lstField = d.hasLst ? `"${d.lstSymbol}"` : `""`;
  const entry = `  {
    networkId: "${d.networkId}",
    network: "${d.network}",
    token: "${d.token}",
    category: "${d.category}",
    marketCapUsd: 0,
    fdvUsd: 0,
    circulatingSupply: 0,
    circulatingSupplyPct: 0,
    stakingRatioPct: 0,
    stakingApyPct: 0,
    stakedValueUsd: 0,
    stakerAddresses: 0,
    validatorCount: 0,
    globalLstHealthScore: 0,
    lstProtocols: ${d.hasLst ? 1 : 0},
    largestLst: ${lstField},
    lstTvlUsd: 0,
    lstPenetrationPct: 0,
    defiTvlUsd: 0,
    tvlToMcapPct: 0,
    stablecoinLiquidityUsd: 0,
    lendingPresence: false,
    lstCollateralEnabled: false,
    opportunityScore: 0,
    mainBottleneck: "TBD",
    mainOpportunity: "TBD",
    status: "Watchlist"
  }`;
  writeFile(relPath, content.replace(anchor, `,\n${entry}${anchor}`));
  return relPath;
}

function patchBuildOverviewTs(d: AddChainInput): string {
  const relPath = "scripts/build-overview-dataset.ts";
  const content = readFile(relPath);
  const anchor = "\n];\n\nconst DEX_FIELDS";
  if (!content.includes(anchor)) throw new Error("Anchor not found");
  const entry = `  {
    networkId: "${d.networkId}",
    network: "${d.network}",
    token: "${d.token}",
    coingeckoId: "${d.coingeckoId}",
    defillamaChain: "${d.defillamaChain}",
    globalLstHealthScore: 0,
    opportunityScore: 0
  }`;
  writeFile(relPath, content.replace(anchor, `,\n${entry}${anchor}`));
  return relPath;
}

function patchSyncCoingeckoMjs(d: AddChainInput): string {
  const relPath = "scripts/sync-coingecko-basics.mjs";
  const content = readFile(relPath);
  const anchor = "\n];\n\nasync function";
  if (!content.includes(anchor)) throw new Error("Anchor not found");
  const entry = `  {
    networkId: "${d.networkId}",
    preferredCoinId: "${d.coingeckoId}",
    symbol: "${d.token.toLowerCase()}",
    nameIncludes: ["${d.network.toLowerCase()}"]
  }`;
  writeFile(relPath, content.replace(anchor, `,\n${entry}${anchor}`));
  return relPath;
}

function patchSyncDefillamaMjs(d: AddChainInput): string {
  const relPath = "scripts/sync-defillama-basics.mjs";
  const content = readFile(relPath);
  const anchor = "\n];\n\nfunction";
  if (!content.includes(anchor)) throw new Error("Anchor not found");
  const entry = `  { networkId: "${d.networkId}", chainName: "${d.defillamaChain}" }`;
  writeFile(relPath, content.replace(anchor, `,\n${entry}${anchor}`));
  return relPath;
}

function patchRecordFile(relPath: string, d: AddChainInput, entryLines: string): string {
  const content = readFile(relPath);
  const lastClose = content.lastIndexOf("\n};");
  if (lastClose === -1) throw new Error(`Closing }; not found`);
  writeFile(relPath, content.slice(0, lastClose) + `,\n${entryLines}\n` + content.slice(lastClose));
  return relPath;
}

function patchDexscreenerChains(d: AddChainInput): string {
  return patchRecordFile("src/data/mappings/dexscreenerChains.ts", d, `  ${d.networkId}: {
    networkId: "${d.networkId}",
    chainId: "${d.dexscreenerChainId}",
    baseTokenAddress: null
  }`);
}

function patchEtherscanChains(d: AddChainInput): string {
  const chainIdVal = d.etherscanChainId ? `"${d.etherscanChainId}"` : "null";
  return patchRecordFile("src/data/mappings/etherscanChains.ts", d, `  ${d.networkId}: {
    networkId: "${d.networkId}",
    chainId: ${chainIdVal}
  }`);
}

function patchLstTokens(d: AddChainInput): string {
  return patchRecordFile("src/data/config/lstTokens.ts", d, `  ${d.networkId}: {
    networkId: "${d.networkId}",
    lstSymbol: "${d.lstSymbol}",
    lstTokenAddress: null,
    dexscreenerChainId: "${d.dexscreenerChainId}",
    etherscanTokenAddress: null
  }`);
}

function patchProtocolContracts(d: AddChainInput): string {
  return patchRecordFile("src/data/config/protocolContracts.ts", d, `  ${d.networkId}: {
    networkId: "${d.networkId}",
    primaryContractAddress: null,
    logsFromBlock: null,
    mintEventTopic0: null,
    redeemEventTopic0: null
  }`);
}

function patchImportantAddresses(d: AddChainInput): string {
  return patchRecordFile("src/data/config/importantAddresses.ts", d, `  ${d.networkId}: {
    networkId: "${d.networkId}",
    transferMonitorAddress: null,
    treasuryAddress: null
  }`);
}

function patchNetworkUiFields(d: AddChainInput): string {
  const relPath = "data/manual/network-ui-fields.json";
  const json = JSON.parse(readFile(relPath)) as {
    source: string;
    updatedAt: string;
    networks: Record<string, unknown>;
  };
  json.updatedAt = new Date().toISOString();
  json.networks[d.networkId] = {
    category: d.category,
    status: "Watchlist",
    fdvUsd: 0,
    circulatingSupplyPct: 0,
    stakerAddresses: 0,
    lstProtocols: d.hasLst ? 1 : 0,
    largestLst: d.hasLst ? d.lstSymbol : null,
    lendingPresence: false,
    lstCollateralEnabled: false,
    mainBottleneck: "TBD",
    mainOpportunity: "TBD",
    hasLst: d.hasLst,
    unbondingDays: null,
    auditCount: null,
    hasTimelock: null
  };
  writeFile(relPath, JSON.stringify(json, null, 2) + "\n");
  return relPath;
}

function patchOverrides(d: AddChainInput): { path: string; skipped: boolean } {
  const relPath = "data/manual/overrides.json";
  if (d.hasLst) return { path: relPath, skipped: true };
  const json = JSON.parse(readFile(relPath)) as {
    source: string;
    updatedAt: string;
    overrides: unknown[];
  };
  const now = new Date().toISOString();
  json.updatedAt = now;
  json.overrides.push({
    id: generateOverrideId(),
    networkId: d.networkId,
    field: "lstTvlUsd",
    value: 0,
    reason: "no LST deployed",
    timestamp: now
  });
  writeFile(relPath, JSON.stringify(json, null, 2) + "\n");
  return { path: relPath, skipped: false };
}

// ─── Main entry point ─────────────────────────────────────────────────────────

export function addChain(d: AddChainInput): PatchResult[] {
  const results: PatchResult[] = [];

  function run(fn: () => string | { path: string; skipped?: boolean }) {
    try {
      const result = fn();
      if (typeof result === "string") {
        results.push({ file: result, ok: true });
      } else {
        results.push({ file: result.path, ok: true, skipped: result.skipped });
      }
    } catch (err) {
      results.push({ file: "unknown", ok: false, error: (err as Error).message });
    }
  }

  run(() => patchNetworksTs(d));
  run(() => patchBuildOverviewTs(d));
  run(() => patchSyncCoingeckoMjs(d));
  run(() => patchSyncDefillamaMjs(d));
  run(() => patchDexscreenerChains(d));
  run(() => patchEtherscanChains(d));
  run(() => patchLstTokens(d));
  run(() => patchProtocolContracts(d));
  run(() => patchImportantAddresses(d));
  run(() => patchNetworkUiFields(d));
  run(() => patchOverrides(d));

  return results;
}
