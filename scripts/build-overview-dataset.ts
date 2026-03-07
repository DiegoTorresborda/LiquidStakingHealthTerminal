#!/usr/bin/env node

import { readFile, writeFile } from "node:fs/promises";

import { fetchCoingeckoMetricsByNetwork } from "../src/data/adapters/coingecko.ts";
import { fetchDefillamaMetricsByNetwork } from "../src/data/adapters/defillama.ts";
import { fetchStakingMetricsByNetwork } from "../src/data/adapters/stakingRewards.ts";
import type { RadarOverviewRecord } from "../src/data/radar-overview-schema.ts";

type NetworkConfig = {
  networkId: string;
  network: string;
  token: string;
  coingeckoId: string;
  defillamaChain: string;
  globalLstHealthScore: number;
  opportunityScore: number;
};

const NETWORKS: NetworkConfig[] = [
  {
    networkId: "monad",
    network: "Monad",
    token: "MON",
    coingeckoId: "monad",
    defillamaChain: "Monad",
    globalLstHealthScore: 71,
    opportunityScore: 86
  },
  {
    networkId: "sei",
    network: "Sei",
    token: "SEI",
    coingeckoId: "sei-network",
    defillamaChain: "Sei",
    globalLstHealthScore: 66,
    opportunityScore: 82
  },
  {
    networkId: "sui",
    network: "Sui",
    token: "SUI",
    coingeckoId: "sui",
    defillamaChain: "Sui",
    globalLstHealthScore: 74,
    opportunityScore: 68
  },
  {
    networkId: "shardeum",
    network: "Shardeum",
    token: "SHM",
    coingeckoId: "shardeum",
    defillamaChain: "Shardeum",
    globalLstHealthScore: 54,
    opportunityScore: 92
  },
  {
    networkId: "xdc",
    network: "XDC",
    token: "XDC",
    coingeckoId: "xdce-crowd-sale",
    defillamaChain: "XDC",
    globalLstHealthScore: 58,
    opportunityScore: 87
  }
];

type SnapshotRecord = Record<string, Record<string, unknown>>;

function toNumberOrNull(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function calculateRatio(numerator: number | null, denominator: number | null): number | null {
  if (numerator === null || denominator === null || denominator <= 0) {
    return null;
  }

  return Number((numerator / denominator).toFixed(4));
}

async function readJson(path: string) {
  const raw = await readFile(path, "utf8");
  return JSON.parse(raw);
}

async function loadFallbacks() {
  const [coingeckoSnapshot, domainSnapshot] = await Promise.all([
    readJson("data/coingecko-basics.json").catch(() => ({ networks: {} })),
    readJson("data/dashboard-domain-overrides.json").catch(() => ({ networks: {} }))
  ]);

  return {
    coingeckoSnapshot: coingeckoSnapshot.networks as SnapshotRecord,
    domainSnapshot: domainSnapshot.networks as SnapshotRecord
  };
}

async function main() {
  const { coingeckoSnapshot, domainSnapshot } = await loadFallbacks();

  const coinIdByNetwork = Object.fromEntries(NETWORKS.map((network) => [network.networkId, network.coingeckoId]));
  const chainNameByNetwork = Object.fromEntries(NETWORKS.map((network) => [network.networkId, network.defillamaChain]));

  let coingeckoMetrics: Awaited<ReturnType<typeof fetchCoingeckoMetricsByNetwork>> = {};
  let defillamaMetrics: Awaited<ReturnType<typeof fetchDefillamaMetricsByNetwork>> = {};

  try {
    coingeckoMetrics = await fetchCoingeckoMetricsByNetwork(coinIdByNetwork);
  } catch {
    coingeckoMetrics = {};
  }

  try {
    defillamaMetrics = await fetchDefillamaMetricsByNetwork(chainNameByNetwork);
  } catch {
    defillamaMetrics = {};
  }

  const stakingMetrics = await fetchStakingMetricsByNetwork(NETWORKS.map((network) => network.networkId));

  const asOf = new Date().toISOString();

  const records: RadarOverviewRecord[] = NETWORKS.map((network) => {
    const coingecko = coingeckoMetrics[network.networkId];
    const defillama = defillamaMetrics[network.networkId];
    const staking = stakingMetrics[network.networkId];

    const fallbackCg = coingeckoSnapshot[network.networkId] ?? {};
    const fallbackDomain = domainSnapshot[network.networkId] ?? {};

    const marketCapUsd = coingecko?.marketCapUsd ?? toNumberOrNull(fallbackCg.marketCapUsd);
    const circulatingSupply = coingecko?.circulatingSupply ?? toNumberOrNull(fallbackCg.circulatingSupply);
    const priceUsd = coingecko?.priceUsd ?? null;
    const volume24hUsd = coingecko?.volume24hUsd ?? null;

    const defiTvlUsd = defillama?.defiTvlUsd ?? toNumberOrNull(fallbackDomain.defiTvlUsd);
    const stablecoinLiquidityUsd =
      defillama?.stablecoinLiquidityUsd ?? toNumberOrNull(fallbackDomain.stablecoinLiquidityUsd);
    const lstTvlUsd = defillama?.lstTvlUsd ?? toNumberOrNull(fallbackDomain.lstTvlUsd);

    const validatorCount = staking?.validatorCount ?? toNumberOrNull(fallbackDomain.validatorCount);
    const stakingRatioPct = staking?.stakingRatioPct ?? toNumberOrNull(fallbackDomain.stakingRatioPct);
    const stakingApyPct = staking?.stakingApyPct ?? toNumberOrNull(fallbackDomain.stakingApyPct);

    const tvlToMarketCap = calculateRatio(defiTvlUsd, marketCapUsd);
    const lstPenetrationPct = calculateRatio(lstTvlUsd, defiTvlUsd);

    const sourceRefs = [
      coingecko?.sourceRef,
      ...(defillama?.sourceRefs ?? []),
      staking?.sourceRef
    ].filter((value): value is string => Boolean(value));

    const observedCount = [marketCapUsd, priceUsd, volume24hUsd, defiTvlUsd, validatorCount, stakingRatioPct].filter(
      (value) => value !== null
    ).length;

    const quality: RadarOverviewRecord["quality"] = observedCount >= 5 ? "observed" : observedCount >= 3 ? "inferred" : "simulated";
    const confidence: RadarOverviewRecord["confidence"] = observedCount >= 5 ? "high" : observedCount >= 3 ? "medium" : "low";

    return {
      networkId: network.networkId,
      network: network.network,
      token: network.token,
      marketCapUsd,
      circulatingSupply,
      priceUsd,
      volume24hUsd,
      defiTvlUsd,
      stablecoinLiquidityUsd,
      validatorCount,
      stakingRatioPct,
      stakingApyPct,
      lstTvlUsd,
      tvlToMarketCap,
      lstPenetrationPct,
      globalLstHealthScore: network.globalLstHealthScore,
      opportunityScore: network.opportunityScore,
      asOf,
      sourceRefs,
      quality,
      confidence
    };
  });

  await writeFile("data/networks.generated.json", `${JSON.stringify(records, null, 2)}\n`, "utf8");
  console.log("[build-overview-dataset] Wrote data/networks.generated.json");
}

main().catch((error) => {
  console.error("[build-overview-dataset] Failed:", error);
  process.exitCode = 1;
});
