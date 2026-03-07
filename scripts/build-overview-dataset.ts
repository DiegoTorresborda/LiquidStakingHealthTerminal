#!/usr/bin/env node

import { readFile, writeFile } from "node:fs/promises";

import { fetchCoingeckoMetricsByNetwork } from "../src/data/adapters/coingecko.ts";
import { fetchDefillamaMetricsByNetwork } from "../src/data/adapters/defillama.ts";
import { fetchStakingMetricsByNetwork } from "../src/data/adapters/stakingRewards.ts";
import type { FieldDataClass, RadarOverviewRecord } from "../src/data/radar-overview-schema.ts";

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
  { networkId: "monad", network: "Monad", token: "MON", coingeckoId: "monad", defillamaChain: "Monad", globalLstHealthScore: 71, opportunityScore: 86 },
  { networkId: "sei", network: "Sei", token: "SEI", coingeckoId: "sei-network", defillamaChain: "Sei", globalLstHealthScore: 66, opportunityScore: 82 },
  { networkId: "sui", network: "Sui", token: "SUI", coingeckoId: "sui", defillamaChain: "Sui", globalLstHealthScore: 74, opportunityScore: 68 },
  { networkId: "shardeum", network: "Shardeum", token: "SHM", coingeckoId: "shardeum", defillamaChain: "Shardeum", globalLstHealthScore: 54, opportunityScore: 92 },
  { networkId: "xdc", network: "XDC", token: "XDC", coingeckoId: "xdce-crowd-sale", defillamaChain: "XDC", globalLstHealthScore: 58, opportunityScore: 87 }
];

type SnapshotRecord = Record<string, Record<string, unknown>>;

function toNumberOrNull(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function calculateRatio(numerator: number | null, denominator: number | null): number | null {
  if (numerator === null || denominator === null || denominator <= 0) return null;
  return Number((numerator / denominator).toFixed(4));
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function scale(value: number | null, min: number, max: number): number | null {
  if (value === null) return null;
  if (max <= min) return null;
  return clamp(((value - min) / (max - min)) * 100, 0, 100);
}

function resolveQualityClass(value: number | null, source: "observed" | "inferred" | "simulated"): FieldDataClass {
  if (value === null) return "missing";
  return source;
}

function weightedAverage(items: Array<{ value: number | null; weight: number }>): number | null {
  const valid = items.filter((item) => item.value !== null) as Array<{ value: number; weight: number }>;
  if (valid.length === 0) return null;
  const totalWeight = valid.reduce((sum, item) => sum + item.weight, 0);
  const total = valid.reduce((sum, item) => sum + item.value * item.weight, 0);
  return totalWeight > 0 ? total / totalWeight : null;
}

function computeRealBackedHealthScore(input: {
  marketCapUsd: number | null;
  volume24hUsd: number | null;
  defiTvlUsd: number | null;
  stablecoinLiquidityUsd: number | null;
  lstTvlUsd: number | null;
  validatorCount: number | null;
  stakingRatioPct: number | null;
  stakingApyPct: number | null;
  baselineScore: number;
  dataCoveragePct: number;
}): number {
  const marketSignal = weightedAverage([
    { value: scale(input.marketCapUsd, 100_000_000, 10_000_000_000), weight: 0.7 },
    { value: scale(input.volume24hUsd, 1_000_000, 1_000_000_000), weight: 0.3 }
  ]);

  const liquiditySignal = weightedAverage([
    { value: scale(input.defiTvlUsd, 10_000_000, 2_000_000_000), weight: 0.4 },
    { value: scale(input.stablecoinLiquidityUsd, 5_000_000, 1_000_000_000), weight: 0.35 },
    { value: scale(input.lstTvlUsd, 5_000_000, 1_500_000_000), weight: 0.25 }
  ]);

  const validatorSignal = scale(input.validatorCount, 40, 180);
  const stakingSignal = weightedAverage([
    { value: scale(input.stakingRatioPct, 20, 75), weight: 0.65 },
    { value: scale(input.stakingApyPct, 2, 12), weight: 0.35 }
  ]);

  const realSignalScore = weightedAverage([
    { value: marketSignal, weight: 0.2 },
    { value: liquiditySignal, weight: 0.4 },
    { value: validatorSignal, weight: 0.2 },
    { value: stakingSignal, weight: 0.2 }
  ]);

  if (realSignalScore === null) return input.baselineScore;

  const blendReal = clamp(input.dataCoveragePct / 100, 0.2, 0.75);
  const blendBaseline = 1 - blendReal;
  return Math.round(realSignalScore * blendReal + input.baselineScore * blendBaseline);
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

function computeCoveragePct(fieldQuality: Record<string, FieldDataClass>, trackedFields: string[]): number {
  const available = trackedFields.filter((field) => fieldQuality[field] !== "missing").length;
  return Number(((available / trackedFields.length) * 100).toFixed(1));
}

function coverageToConfidence(coveragePct: number): RadarOverviewRecord["confidence"] {
  if (coveragePct >= 80) return "high";
  if (coveragePct >= 55) return "medium";
  return "low";
}

function coverageToQuality(coveragePct: number): RadarOverviewRecord["quality"] {
  if (coveragePct >= 75) return "observed";
  if (coveragePct >= 45) return "inferred";
  return "simulated";
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
    const stablecoinLiquidityUsd = defillama?.stablecoinLiquidityUsd ?? toNumberOrNull(fallbackDomain.stablecoinLiquidityUsd);
    const lstTvlUsd = defillama?.lstTvlUsd ?? toNumberOrNull(fallbackDomain.lstTvlUsd);

    const validatorCount = staking?.validatorCount ?? toNumberOrNull(fallbackDomain.validatorCount);
    const stakingRatioPct = staking?.stakingRatioPct ?? toNumberOrNull(fallbackDomain.stakingRatioPct);
    const stakingApyPct = staking?.stakingApyPct ?? toNumberOrNull(fallbackDomain.stakingApyPct);

    const tvlToMarketCap = calculateRatio(defiTvlUsd, marketCapUsd);
    const lstPenetrationPct = calculateRatio(lstTvlUsd, defiTvlUsd);

    const fieldQuality: Record<string, FieldDataClass> = {
      marketCapUsd: resolveQualityClass(marketCapUsd, coingecko?.marketCapUsd !== null && coingecko?.marketCapUsd !== undefined ? "observed" : "inferred"),
      circulatingSupply: resolveQualityClass(circulatingSupply, coingecko?.circulatingSupply !== null && coingecko?.circulatingSupply !== undefined ? "observed" : "inferred"),
      priceUsd: resolveQualityClass(priceUsd, coingecko?.priceUsd !== null && coingecko?.priceUsd !== undefined ? "observed" : "inferred"),
      volume24hUsd: resolveQualityClass(volume24hUsd, coingecko?.volume24hUsd !== null && coingecko?.volume24hUsd !== undefined ? "observed" : "inferred"),
      defiTvlUsd: resolveQualityClass(defiTvlUsd, defillama?.defiTvlUsd !== null && defillama?.defiTvlUsd !== undefined ? "observed" : "inferred"),
      stablecoinLiquidityUsd: resolveQualityClass(
        stablecoinLiquidityUsd,
        defillama?.stablecoinLiquidityUsd !== null && defillama?.stablecoinLiquidityUsd !== undefined ? "observed" : "inferred"
      ),
      validatorCount: resolveQualityClass(validatorCount, staking?.sourceRef === "stakingRewards:fixed-endpoint" ? "observed" : "inferred"),
      stakingRatioPct: resolveQualityClass(stakingRatioPct, staking?.sourceRef === "stakingRewards:fixed-endpoint" ? "observed" : "inferred"),
      stakingApyPct: resolveQualityClass(stakingApyPct, staking?.sourceRef === "stakingRewards:fixed-endpoint" ? "observed" : "inferred"),
      lstTvlUsd: resolveQualityClass(lstTvlUsd, defillama?.lstTvlUsd !== null && defillama?.lstTvlUsd !== undefined ? "observed" : "inferred"),
      tvlToMarketCap: resolveQualityClass(tvlToMarketCap, "inferred"),
      lstPenetrationPct: resolveQualityClass(lstPenetrationPct, "inferred")
    };

    const trackedFields = [
      "marketCapUsd",
      "circulatingSupply",
      "priceUsd",
      "volume24hUsd",
      "defiTvlUsd",
      "stablecoinLiquidityUsd",
      "validatorCount",
      "stakingRatioPct",
      "stakingApyPct",
      "lstTvlUsd",
      "tvlToMarketCap",
      "lstPenetrationPct"
    ];

    const dataCoveragePct = computeCoveragePct(fieldQuality, trackedFields);

    const sourceRefs = [
      coingecko?.sourceRef,
      ...(defillama?.sourceRefs ?? []),
      staking?.sourceRef,
      fieldQuality.marketCapUsd !== "observed" ? "fallback:coingecko-basics.json" : undefined,
      fieldQuality.defiTvlUsd !== "observed" ? "fallback:dashboard-domain-overrides.json" : undefined
    ].filter((value): value is string => Boolean(value));

    const inferredScoreComponents = [
      "Peg Stability",
      "Security & Governance",
      "Stress Resilience"
    ];

    const globalLstHealthScore = computeRealBackedHealthScore({
      marketCapUsd,
      volume24hUsd,
      defiTvlUsd,
      stablecoinLiquidityUsd,
      lstTvlUsd,
      validatorCount,
      stakingRatioPct,
      stakingApyPct,
      baselineScore: network.globalLstHealthScore,
      dataCoveragePct
    });

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
      globalLstHealthScore,
      opportunityScore: network.opportunityScore,
      asOf,
      sourceRefs,
      quality: coverageToQuality(dataCoveragePct),
      confidence: coverageToConfidence(dataCoveragePct),
      dataCoveragePct,
      fieldQuality,
      inferredScoreComponents
    };
  });

  await writeFile("data/networks.generated.json", `${JSON.stringify(records, null, 2)}\n`, "utf8");
  console.log("[build-overview-dataset] Wrote data/networks.generated.json");
}

main().catch((error) => {
  console.error("[build-overview-dataset] Failed:", error);
  process.exitCode = 1;
});
