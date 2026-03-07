#!/usr/bin/env node

import { readFile, writeFile } from "node:fs/promises";

const OUTPUT_PATH = new URL("../data/coingecko-basics.json", import.meta.url);
const COINGECKO_COINS_LIST_URL = "https://api.coingecko.com/api/v3/coins/list?include_platform=false";
const COINGECKO_MARKETS_URL = "https://api.coingecko.com/api/v3/coins/markets";

const TARGET_NETWORKS = [
  {
    networkId: "xdc",
    preferredCoinId: "xdce-crowd-sale",
    symbol: "xdc",
    nameIncludes: ["xdc"]
  },
  {
    networkId: "monad",
    preferredCoinId: "monad",
    symbol: "mon",
    nameIncludes: ["monad"]
  },
  {
    networkId: "sei",
    preferredCoinId: "sei-network",
    symbol: "sei",
    nameIncludes: ["sei"]
  },
  {
    networkId: "shardeum",
    preferredCoinId: "shardeum",
    symbol: "shm",
    nameIncludes: ["shardeum"]
  },
  {
    networkId: "sui",
    preferredCoinId: "sui",
    symbol: "sui",
    nameIncludes: ["sui"]
  }
];

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

function buildCoinIndexes(coinsList) {
  const byId = new Map();
  const bySymbol = new Map();

  for (const coin of coinsList) {
    byId.set(coin.id, coin);

    const symbol = String(coin.symbol || "").toLowerCase();
    if (!bySymbol.has(symbol)) {
      bySymbol.set(symbol, []);
    }

    bySymbol.get(symbol).push(coin);
  }

  return { byId, bySymbol };
}

function resolveCoinId(target, indexes) {
  if (target.preferredCoinId && indexes.byId.has(target.preferredCoinId)) {
    return target.preferredCoinId;
  }

  const candidates = indexes.bySymbol.get(target.symbol.toLowerCase()) ?? [];

  for (const candidate of candidates) {
    const normalizedName = String(candidate.name || "").toLowerCase();
    if (target.nameIncludes.some((segment) => normalizedName.includes(segment))) {
      return candidate.id;
    }
  }

  return null;
}

function toNumberOrNull(value) {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function computeCirculatingSupplyPct(market) {
  const circulating = toNumberOrNull(market.circulating_supply);
  const denominator = toNumberOrNull(market.max_supply) ?? toNumberOrNull(market.total_supply);

  if (circulating === null || denominator === null || denominator <= 0) {
    return null;
  }

  return Number(((circulating / denominator) * 100).toFixed(2));
}

async function main() {
  console.log("[sync-coingecko-basics] Fetching coin universe...");
  const coinsList = await fetchJson(COINGECKO_COINS_LIST_URL);
  const indexes = buildCoinIndexes(coinsList);

  const resolved = TARGET_NETWORKS.map((target) => {
    const coinId = resolveCoinId(target, indexes);
    return { ...target, coinId };
  });

  const resolvedIds = resolved
    .map((item) => item.coinId)
    .filter((id) => typeof id === "string");

  let markets = [];
  if (resolvedIds.length > 0) {
    console.log(`[sync-coingecko-basics] Fetching market data for ids: ${resolvedIds.join(", ")}`);
    const query = new URLSearchParams({
      vs_currency: "usd",
      ids: resolvedIds.join(","),
      order: "market_cap_desc",
      per_page: "250",
      page: "1",
      sparkline: "false",
      price_change_percentage: "24h"
    });

    markets = await fetchJson(`${COINGECKO_MARKETS_URL}?${query.toString()}`);
  }

  const marketById = new Map(markets.map((market) => [market.id, market]));

  const snapshot = {
    source: "coingecko",
    generatedAt: new Date().toISOString(),
    vsCurrency: "usd",
    networks: {}
  };

  for (const item of resolved) {
    if (!item.coinId) {
      snapshot.networks[item.networkId] = {
        status: "missing_coin_id",
        coinId: null,
        symbol: item.symbol,
        marketCapUsd: null,
        fdvUsd: null,
        circulatingSupply: null,
        circulatingSupplyPct: null
      };
      continue;
    }

    const market = marketById.get(item.coinId);

    if (!market) {
      snapshot.networks[item.networkId] = {
        status: "missing_market_data",
        coinId: item.coinId,
        symbol: item.symbol,
        marketCapUsd: null,
        fdvUsd: null,
        circulatingSupply: null,
        circulatingSupplyPct: null
      };
      continue;
    }

    snapshot.networks[item.networkId] = {
      status: "ok",
      coinId: item.coinId,
      symbol: String(market.symbol || item.symbol).toUpperCase(),
      marketCapUsd: toNumberOrNull(market.market_cap),
      fdvUsd: toNumberOrNull(market.fully_diluted_valuation),
      circulatingSupply: toNumberOrNull(market.circulating_supply),
      circulatingSupplyPct: computeCirculatingSupplyPct(market)
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

  console.log("[sync-coingecko-basics] Wrote data/coingecko-basics.json");
  if (previousGeneratedAt) {
    console.log(`[sync-coingecko-basics] Previous snapshot: ${previousGeneratedAt}`);
  }

  for (const [networkId, record] of Object.entries(snapshot.networks)) {
    console.log(`[sync-coingecko-basics] ${networkId}: ${record.status}${record.coinId ? ` (${record.coinId})` : ""}`);
  }
}

main().catch((error) => {
  console.error("[sync-coingecko-basics] Failed:", error);
  process.exitCode = 1;
});
