#!/usr/bin/env node
// scripts/add-chain.mjs
// Run from project root: node scripts/add-chain.mjs

import { readFileSync, writeFileSync } from "node:fs";
import { createInterface } from "node:readline";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

// ─── Categories (from NetworkCategory type) ──────────────────────────────────

const CATEGORIES = [
  "High-performance EVM L1",
  "High-throughput trading L1",
  "Object-centric L1",
  "Move-based L1",
  "DeFi-native L1",
  "Enterprise-focused L1",
  "Dynamic sharded L1",
  "Bitcoin-aligned PoS",
  "Gaming-focused L1",
  "RWA-focused L1"
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function ask(rl, question) {
  return new Promise(resolve => rl.question(question, answer => resolve(answer.trim())));
}

function readFile(relPath) {
  return readFileSync(resolve(ROOT, relPath), "utf8");
}

function writeFile(relPath, content) {
  writeFileSync(resolve(ROOT, relPath), content, "utf8");
}

function containsId(content, networkId) {
  // Check for networkId: "x" pattern (in arrays) or `  x:` (in Record objects)
  return (
    content.includes(`networkId: "${networkId}"`) ||
    content.includes(`"${networkId}":`) ||
    new RegExp(`^  ${networkId}:\\s*\\{`, "m").test(content)
  );
}

function generateOverrideId() {
  const a = Math.random().toString(36).slice(2, 10);
  const b = Math.random().toString(36).slice(2, 8);
  return `ovr_${a}_${b}`;
}

// ─── File patchers ────────────────────────────────────────────────────────────

function patchNetworksTs(d) {
  const path = "data/networks.ts";
  const content = readFile(path);
  const anchor = "\n];\n\ntype GeneratedOverviewRecord";
  if (!content.includes(anchor)) throw new Error(`Anchor not found in ${path}`);

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

  writeFile(path, content.replace(anchor, `,\n${entry}${anchor}`));
  return path;
}

function patchBuildOverviewTs(d) {
  const path = "scripts/build-overview-dataset.ts";
  const content = readFile(path);
  const anchor = "\n];\n\nconst DEX_FIELDS";
  if (!content.includes(anchor)) throw new Error(`Anchor not found in ${path}`);

  const entry = `  {
    networkId: "${d.networkId}",
    network: "${d.network}",
    token: "${d.token}",
    coingeckoId: "${d.coingeckoId}",
    defillamaChain: "${d.defillamaChain}",
    globalLstHealthScore: 0,
    opportunityScore: 0
  }`;

  writeFile(path, content.replace(anchor, `,\n${entry}${anchor}`));
  return path;
}

function patchSyncCoingeckoMjs(d) {
  const path = "scripts/sync-coingecko-basics.mjs";
  const content = readFile(path);
  const anchor = "\n];\n\nasync function";
  if (!content.includes(anchor)) throw new Error(`Anchor not found in ${path}`);

  const entry = `  {
    networkId: "${d.networkId}",
    preferredCoinId: "${d.coingeckoId}",
    symbol: "${d.token.toLowerCase()}",
    nameIncludes: ["${d.network.toLowerCase()}"]
  }`;

  writeFile(path, content.replace(anchor, `,\n${entry}${anchor}`));
  return path;
}

function patchSyncDefillamaMjs(d) {
  const path = "scripts/sync-defillama-basics.mjs";
  const content = readFile(path);
  const anchor = "\n];\n\nfunction";
  if (!content.includes(anchor)) throw new Error(`Anchor not found in ${path}`);

  const entry = `  { networkId: "${d.networkId}", chainName: "${d.defillamaChain}" }`;

  writeFile(path, content.replace(anchor, `,\n${entry}${anchor}`));
  return path;
}

function patchRecordFile(relPath, keyName, entryLines) {
  const content = readFile(relPath);
  // Insert before the last `\n};` in the file
  const lastClose = content.lastIndexOf("\n};");
  if (lastClose === -1) throw new Error(`Closing }; not found in ${relPath}`);

  const newContent =
    content.slice(0, lastClose) +
    `,\n${entryLines}\n` +
    content.slice(lastClose);
  writeFile(relPath, newContent);
  return relPath;
}

function patchDexscreenerChains(d) {
  const entry = `  ${d.networkId}: {
    networkId: "${d.networkId}",
    chainId: "${d.dexscreenerChainId}",
    baseTokenAddress: null
  }`;
  return patchRecordFile("src/data/mappings/dexscreenerChains.ts", d.networkId, entry);
}

function patchEtherscanChains(d) {
  const chainIdVal = d.etherscanChainId ? `"${d.etherscanChainId}"` : "null";
  const entry = `  ${d.networkId}: {
    networkId: "${d.networkId}",
    chainId: ${chainIdVal}
  }`;
  return patchRecordFile("src/data/mappings/etherscanChains.ts", d.networkId, entry);
}

function patchLstTokens(d) {
  const entry = `  ${d.networkId}: {
    networkId: "${d.networkId}",
    lstSymbol: "${d.lstSymbol}",
    lstTokenAddress: null,
    dexscreenerChainId: "${d.dexscreenerChainId}",
    etherscanTokenAddress: null
  }`;
  return patchRecordFile("src/data/config/lstTokens.ts", d.networkId, entry);
}

function patchProtocolContracts(d) {
  const entry = `  ${d.networkId}: {
    networkId: "${d.networkId}",
    primaryContractAddress: null,
    logsFromBlock: null,
    mintEventTopic0: null,
    redeemEventTopic0: null
  }`;
  return patchRecordFile("src/data/config/protocolContracts.ts", d.networkId, entry);
}

function patchImportantAddresses(d) {
  const entry = `  ${d.networkId}: {
    networkId: "${d.networkId}",
    transferMonitorAddress: null,
    treasuryAddress: null
  }`;
  return patchRecordFile("src/data/config/importantAddresses.ts", d.networkId, entry);
}

function patchNetworkUiFields(d) {
  const path = "data/manual/network-ui-fields.json";
  const json = JSON.parse(readFile(path));
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
  writeFile(path, JSON.stringify(json, null, 2) + "\n");
  return path;
}

function patchOverrides(d) {
  const path = "data/manual/overrides.json";
  if (d.hasLst) return { path, skipped: true };

  const json = JSON.parse(readFile(path));
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
  writeFile(path, JSON.stringify(json, null, 2) + "\n");
  return { path, skipped: false };
}

// ─── Idempotency check ────────────────────────────────────────────────────────

function checkIdempotency(networkId) {
  const filesToCheck = [
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

  const conflicts = [];
  for (const f of filesToCheck) {
    try {
      if (containsId(readFile(f), networkId)) conflicts.push(f);
    } catch {
      // file read error handled later
    }
  }
  return conflicts;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log("\n╔══════════════════════════════════════════════════════╗");
  console.log("║   Liquid Staking Health Terminal — Add New Chain     ║");
  console.log("╠══════════════════════════════════════════════════════╣");
  console.log("║  Only L1 validator-based consensus networks are       ║");
  console.log("║  eligible (PoS, BFT). L2s and rollups excluded.      ║");
  console.log("╚══════════════════════════════════════════════════════╝\n");

  // Sanity check: must run from project root
  try { readFile("data/networks.ts"); }
  catch { console.error("❌  Run this script from the project root:\n    node scripts/add-chain.mjs\n"); process.exit(1); }

  const rl = createInterface({ input: process.stdin, output: process.stdout });

  try {
    // ── Eligibility gates ───────────────────────────────────────────────────
    const isL1 = (await ask(rl, "Is this an L1 blockchain (not a rollup or L2)? (y/n): ")).toLowerCase();
    if (isL1 !== "y") {
      console.log("\n❌  Only L1 networks are supported. Rollups and L2s are out of scope.\n");
      rl.close(); return;
    }

    const isPoS = (await ask(rl, "Does this chain use validator-based consensus (PoS or BFT)? (y/n): ")).toLowerCase();
    if (isPoS !== "y") {
      console.log("\n❌  Only validator-based consensus chains are supported (PoS, BFT). PoW and PoA are out of scope.\n");
      rl.close(); return;
    }

    console.log("\n✅  Eligibility confirmed. Enter chain details:\n");

    // ── Data prompts ────────────────────────────────────────────────────────
    let networkId;
    while (true) {
      networkId = await ask(rl, "Network ID (kebab-case, e.g. my-chain): ");
      if (/^[a-z][a-z0-9-]*$/.test(networkId)) break;
      console.log("   ⚠️  Must be lowercase kebab-case (e.g. my-chain). Try again.");
    }

    const network = await ask(rl, "Display name (e.g. My Chain): ");
    if (!network) { console.log("❌  Display name is required."); rl.close(); return; }

    let token = (await ask(rl, "Token symbol (e.g. MCH): ")).toUpperCase();
    if (!token) { console.log("❌  Token symbol is required."); rl.close(); return; }

    const coingeckoId = await ask(rl, "CoinGecko coin ID (e.g. my-chain): ");
    if (!coingeckoId) { console.log("❌  CoinGecko ID is required."); rl.close(); return; }

    const defillamaChain = await ask(rl, "DefiLlama chain name (e.g. MyChain): ");
    if (!defillamaChain) { console.log("❌  DefiLlama chain name is required."); rl.close(); return; }

    const dexscreenerChainId = await ask(rl, "DexScreener chain slug (e.g. mychain): ");
    if (!dexscreenerChainId) { console.log("❌  DexScreener chain slug is required."); rl.close(); return; }

    const etherscanRaw = await ask(rl, "EVM chain ID / Etherscan numeric ID (leave blank = null): ");
    const etherscanChainId = etherscanRaw || null;

    const hasLstRaw = (await ask(rl, "Does this chain already have an LST deployed? (y/n): ")).toLowerCase();
    const hasLst = hasLstRaw === "y";

    let lstSymbol;
    if (hasLst) {
      lstSymbol = (await ask(rl, `LST token symbol (e.g. st${token}): `)).toUpperCase() || `st${token}`;
    } else {
      lstSymbol = `st${token}`;
    }

    console.log("\nNetwork category:");
    CATEGORIES.forEach((c, i) => console.log(`  ${i + 1}. ${c}`));
    let category;
    while (true) {
      const catRaw = await ask(rl, "Choice (1-10): ");
      const idx = parseInt(catRaw, 10) - 1;
      if (idx >= 0 && idx < CATEGORIES.length) { category = CATEGORIES[idx]; break; }
      console.log("   ⚠️  Enter a number between 1 and 10.");
    }

    // ── Confirmation summary ────────────────────────────────────────────────
    console.log("\n┌─────────────────────────────────────────────────┐");
    console.log("│               Summary                           │");
    console.log("├─────────────────────────────────────────────────┤");
    console.log(`│  networkId        ${networkId.padEnd(30)} │`);
    console.log(`│  network          ${network.padEnd(30)} │`);
    console.log(`│  token            ${token.padEnd(30)} │`);
    console.log(`│  category         ${category.slice(0, 30).padEnd(30)} │`);
    console.log(`│  coingeckoId      ${coingeckoId.padEnd(30)} │`);
    console.log(`│  defillamaChain   ${defillamaChain.padEnd(30)} │`);
    console.log(`│  dexscreener      ${dexscreenerChainId.padEnd(30)} │`);
    console.log(`│  etherscanChainId ${(etherscanChainId ?? "null").padEnd(30)} │`);
    console.log(`│  hasLst           ${String(hasLst).padEnd(30)} │`);
    console.log(`│  lstSymbol        ${lstSymbol.padEnd(30)} │`);
    console.log("└─────────────────────────────────────────────────┘");

    const confirm = (await ask(rl, "\nProceed? (y/n): ")).toLowerCase();
    if (confirm !== "y") { console.log("\n⏹  Aborted. No files were modified.\n"); rl.close(); return; }

    // ── Idempotency check ───────────────────────────────────────────────────
    const conflicts = checkIdempotency(networkId);
    if (conflicts.length > 0) {
      console.log(`\n❌  Network "${networkId}" already exists in:\n`);
      conflicts.forEach(f => console.log(`     • ${f}`));
      console.log("\n   No files were modified.\n");
      rl.close(); return;
    }

    // ── Apply patches ───────────────────────────────────────────────────────
    const d = { networkId, network, token, category, coingeckoId, defillamaChain, dexscreenerChainId, etherscanChainId, hasLst, lstSymbol };
    const results = [];

    const run = (label, fn) => {
      try {
        const result = fn(d);
        const path = typeof result === "string" ? result : result.path;
        const skipped = typeof result === "object" && result.skipped;
        results.push({ label: path, ok: true, skipped });
      } catch (err) {
        results.push({ label, ok: false, error: err.message });
      }
    };

    console.log("\n  Writing files...");
    run("data/networks.ts",                        patchNetworksTs);
    run("scripts/build-overview-dataset.ts",       patchBuildOverviewTs);
    run("scripts/sync-coingecko-basics.mjs",       patchSyncCoingeckoMjs);
    run("scripts/sync-defillama-basics.mjs",       patchSyncDefillamaMjs);
    run("src/data/mappings/dexscreenerChains.ts",  patchDexscreenerChains);
    run("src/data/mappings/etherscanChains.ts",    patchEtherscanChains);
    run("src/data/config/lstTokens.ts",            patchLstTokens);
    run("src/data/config/protocolContracts.ts",    patchProtocolContracts);
    run("src/data/config/importantAddresses.ts",   patchImportantAddresses);
    run("data/manual/network-ui-fields.json",      patchNetworkUiFields);
    run("data/manual/overrides.json",              patchOverrides);

    // ── Results ─────────────────────────────────────────────────────────────
    const hadError = results.some(r => !r.ok);
    console.log(`\n${hadError ? "⚠️  Chain added with errors" : `✅  Chain "${networkId}" (${token}) added successfully`}\n`);
    console.log("Files modified:");
    for (const r of results) {
      if (!r.ok)      console.log(`  [ERR] ${r.label} — ${r.error}`);
      else if (r.skipped) console.log(`  [OK]  ${r.label} — skipped (hasLst=true)`);
      else            console.log(`  [OK]  ${r.label}`);
    }

    if (!hadError) {
      console.log(`
Next steps:
  1. Fill in real numeric values in data/networks.ts for "${networkId}"
  2. Add baseTokenAddress to src/data/mappings/dexscreenerChains.ts if available
  3. Run: node scripts/sync-coingecko-basics.mjs
  4. Run: node scripts/sync-defillama-basics.mjs
  5. Run: npx tsx scripts/build-overview-dataset.ts
`);
    }

  } finally {
    rl.close();
  }
}

main().catch(err => { console.error("Fatal error:", err.message); process.exit(1); });
