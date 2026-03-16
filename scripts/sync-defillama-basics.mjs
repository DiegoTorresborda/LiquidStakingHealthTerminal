#!/usr/bin/env node

import { readFile, writeFile } from "node:fs/promises";

const OUTPUT_PATH = new URL("../data/defillama-basics.json", import.meta.url);
const CHAINS_URL = "https://api.llama.fi/chains";
const PROTOCOLS_URL = "https://api.llama.fi/protocols";
const STABLECOINS_URL = "https://stablecoins.llama.fi/stablecoins";

const TARGET_NETWORKS = [
  { networkId: "monad", chainName: "Monad" },
  { networkId: "sei", chainName: "Sei" },
  { networkId: "sui", chainName: "Sui" },
  { networkId: "aptos", chainName: "Aptos" },
  { networkId: "berachain", chainName: "Berachain" },
  { networkId: "core", chainName: "CORE" },
  { networkId: "mantra", chainName: "Mantra" },
  { networkId: "sonic", chainName: "Sonic" },
  { networkId: "xdc", chainName: "XDC" },
  { networkId: "shardeum", chainName: "Shardeum" },
  { networkId: "canton", chainName: "Canton" }
];

function normalizeChainKey(value) {
  return String(value || "").trim().toLowerCase();
}

async function fetchJson(url) {
  const response = await fetch(url, {
    headers: {
      accept: "application/json"
    }
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Request failed (${response.status}) for ${url}: ${text}`);
  }

  return response.json();
}

function toNumberOrNull(value) {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function resolveStatus(record, hasChainInChainsList) {
  if (!hasChainInChainsList) {
    return "missing_chain";
  }

  if (record.defiTvlUsd !== null || record.stablecoinLiquidityUsd !== null || record.lstTvlUsd !== null) {
    if (record.defiTvlUsd !== null && record.lstTvlUsd !== null) {
      return "ok";
    }
    return "partial";
  }

  return "missing_market_data";
}

async function main() {
  console.log("[sync-defillama-basics] Fetching chains / protocols / stablecoins...");
  const [chains, protocols, stablecoins] = await Promise.all([
    fetchJson(CHAINS_URL),
    fetchJson(PROTOCOLS_URL),
    fetchJson(STABLECOINS_URL)
  ]);

  const chainTvlByName = new Map();
  for (const chain of chains) {
    if (!chain?.name || typeof chain?.tvl !== "number") continue;
    chainTvlByName.set(normalizeChainKey(chain.name), chain.tvl);
  }

  const lstTvlByChain = new Map();
  for (const protocol of protocols) {
    if (!protocol?.chain || typeof protocol?.tvl !== "number") continue;
    if (normalizeChainKey(protocol.category) !== "liquid staking") continue;

    const key = normalizeChainKey(protocol.chain);
    lstTvlByChain.set(key, (lstTvlByChain.get(key) ?? 0) + protocol.tvl);
  }

  const stableByChain = new Map();
  for (const asset of stablecoins.peggedAssets ?? []) {
    for (const [chainName, payload] of Object.entries(asset.chainCirculating ?? {})) {
      const amount = payload?.circulating?.peggedUSD;
      if (typeof amount !== "number") continue;

      const key = normalizeChainKey(chainName);
      stableByChain.set(key, (stableByChain.get(key) ?? 0) + amount);
    }
  }

  const snapshot = {
    source: "defillama",
    generatedAt: new Date().toISOString(),
    networks: {}
  };

  for (const target of TARGET_NETWORKS) {
    const key = normalizeChainKey(target.chainName);
    const hasChainInChainsList = chainTvlByName.has(key);

    const record = {
      chainName: target.chainName,
      defiTvlUsd: toNumberOrNull(chainTvlByName.get(key)),
      stablecoinLiquidityUsd: toNumberOrNull(stableByChain.get(key)),
      lstTvlUsd: toNumberOrNull(lstTvlByChain.get(key)),
      sourceRefs: [
        `defillama:chains:${target.chainName}`,
        `defillama:protocols:category=liquid staking:chain=${target.chainName}`,
        `defillama:stablecoins:${target.chainName}`
      ]
    };

    snapshot.networks[target.networkId] = {
      status: resolveStatus(record, hasChainInChainsList),
      ...record
    };
  }

  let previousGeneratedAt = null;
  try {
    const previous = JSON.parse(await readFile(OUTPUT_PATH, "utf8"));
    previousGeneratedAt = previous.generatedAt ?? null;
  } catch {
    // File may not exist yet; ignore.
  }

  await writeFile(OUTPUT_PATH, `${JSON.stringify(snapshot, null, 2)}\n`, "utf8");
  console.log("[sync-defillama-basics] Wrote data/defillama-basics.json");
  if (previousGeneratedAt) {
    console.log(`[sync-defillama-basics] Previous snapshot: ${previousGeneratedAt}`);
  }

  for (const [networkId, record] of Object.entries(snapshot.networks)) {
    console.log(`[sync-defillama-basics] ${networkId}: ${record.status}`);
  }
}

main().catch((error) => {
  console.error("[sync-defillama-basics] Failed:", error);
  process.exitCode = 1;
});
