#!/usr/bin/env node

import { readFile, writeFile } from "node:fs/promises";

import { fetchCoingeckoMetricsByNetwork } from "../src/data/adapters/coingecko.ts";
import {
  collectDexscreenerMetrics,
  type DexscreenerMetricField
} from "../src/data/adapters/dexscreener.ts";
import {
  collectEtherscanMetrics,
  type EtherscanMetricField
} from "../src/data/adapters/etherscan.ts";
import { fetchDefillamaMetricsByNetwork } from "../src/data/adapters/defillama.ts";
import { fetchStakingMetricsByNetwork } from "../src/data/adapters/stakingRewards.ts";
import { fetchManualStakingRewardsByNetwork } from "../src/data/adapters/stakingRewardsManual.ts";
import { IMPORTANT_ADDRESSES } from "../src/data/config/importantAddresses.ts";
import { LST_TOKENS } from "../src/data/config/lstTokens.ts";
import { PROTOCOL_CONTRACTS } from "../src/data/config/protocolContracts.ts";
import { DEXSCREENER_CHAINS } from "../src/data/mappings/dexscreenerChains.ts";
import { ETHERSCAN_CHAINS } from "../src/data/mappings/etherscanChains.ts";
import type {
  FieldDataClass,
  RadarOverviewField,
  RadarOverviewRecord
} from "../src/data/radar-overview-schema.ts";

type NetworkConfig = {
  networkId: string;
  network: string;
  token: string;
  coingeckoId: string;
  defillamaChain: string;
  globalLstHealthScore: number;
  opportunityScore: number;
};

type SnapshotRecord = Record<string, Record<string, unknown>>;

type DefillamaSnapshotEntry = {
  status: string;
  defiTvlUsd: number | null;
  stablecoinLiquidityUsd: number | null;
  lstTvlUsd: number | null;
  sourceRefs: string[];
};

type DefillamaSnapshot = {
  generatedAt?: string;
  networks?: Record<string, DefillamaSnapshotEntry>;
};

type ManualUiFieldEntry = {
  category?: string;
  status?: string;
  fdvUsd?: number;
  circulatingSupplyPct?: number;
  stakerAddresses?: number;
  lstProtocols?: number;
  largestLst?: string | null;
  lendingPresence?: boolean;
  lstCollateralEnabled?: boolean;
  mainBottleneck?: string;
  mainOpportunity?: string;
  hasLst?: boolean;
  unbondingDays?: number | null;
  auditCount?: number | null;
  hasTimelock?: boolean | null;
};

type ManualUiFieldsSnapshot = {
  source?: string;
  updatedAt?: string;
  networks?: Record<string, ManualUiFieldEntry>;
};

type NumberMetricCandidate = {
  value: number | null | undefined;
  quality: FieldDataClass;
  refs?: string[];
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
    networkId: "aptos",
    network: "Aptos",
    token: "APT",
    coingeckoId: "aptos",
    defillamaChain: "Aptos",
    globalLstHealthScore: 70,
    opportunityScore: 64
  },
  {
    networkId: "berachain",
    network: "Berachain",
    token: "BERA",
    coingeckoId: "berachain-bera",
    defillamaChain: "Berachain",
    globalLstHealthScore: 63,
    opportunityScore: 91
  },
  {
    networkId: "xdc",
    network: "XDC",
    token: "XDC",
    coingeckoId: "xdce-crowd-sale",
    defillamaChain: "XDC",
    globalLstHealthScore: 58,
    opportunityScore: 87
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
    networkId: "core",
    network: "Core",
    token: "CORE",
    coingeckoId: "coredaoorg",
    defillamaChain: "CORE",
    globalLstHealthScore: 67,
    opportunityScore: 73
  },
  {
    networkId: "sonic",
    network: "Sonic",
    token: "SONIC",
    coingeckoId: "sonic-3",
    defillamaChain: "Sonic",
    globalLstHealthScore: 52,
    opportunityScore: 88
  },
  {
    networkId: "canton",
    network: "Canton Network",
    token: "CC",
    coingeckoId: "canton",
    defillamaChain: "Canton",
    globalLstHealthScore: 0,
    opportunityScore: 0
  },
  {
    networkId: "mantra",
    network: "Mantra",
    token: "OM",
    coingeckoId: "mantra-dao",
    defillamaChain: "Mantra",
    globalLstHealthScore: 68,
    opportunityScore: 79
  }
];

const DEX_FIELDS: DexscreenerMetricField[] = [
  "baseTokenDexLiquidityUsd",
  "baseTokenDexVolume24hUsd",
  "baseTokenPairCount",
  "baseTokenLargestPoolLiquidityUsd",
  "baseTokenPoolConcentration",
  "stableExitRouteExists",
  "stableExitLiquidityUsd",
  "stableExitPairAddress",
  "stableExitQuoteToken",
  "stableExitDexId",
  "lstDexLiquidityUsd",
  "lstDexVolume24hUsd",
  "lstPairCount",
  "lstLargestPoolLiquidityUsd",
  "lstPoolConcentration",
  "lstHasBasePair",
  "lstHasStablePair",
  "baseTokenVolumeLiquidityRatio",
  "lstVolumeLiquidityRatio"
];

const ETHERSCAN_FIELDS: EtherscanMetricField[] = [
  "lstTotalSupply",
  "lstHolderCount",
  "lstTop10HolderShare",
  "lstTransferCount24h",
  "lstTransferVolume24h",
  "contractAbiAvailable",
  "contractVerified",
  "protocolMintCount24h",
  "protocolRedeemCount24h",
  "protocolMintVolume24h",
  "protocolRedeemVolume24h",
  "protocolTreasuryNativeBalance",
  "safeGasPrice",
  "proposeGasPrice",
  "fastGasPrice",
  "suggestedBaseFee"
];

const COVERAGE_FIELDS: RadarOverviewField[] = [
  "category",
  "status",
  "fdvUsd",
  "circulatingSupplyPct",
  "stakerAddresses",
  "lstProtocols",
  "largestLst",
  "lendingPresence",
  "lstCollateralEnabled",
  "mainBottleneck",
  "mainOpportunity",
  "marketCapUsd",
  "circulatingSupply",
  "priceUsd",
  "volume24hUsd",
  "defiTvlUsd",
  "stablecoinLiquidityUsd",
  "validatorCount",
  "stakingRatioPct",
  "stakingApyPct",
  "rewardRatePct",
  "stakingMarketCapUsd",
  "stakedTokens",
  "stakedValueUsd",
  "inflationRatePct",
  "verifiedProviders",
  "benchmarkCommissionPct",
  "lstTvlUsd",
  "tvlToMarketCap",
  "lstPenetrationPct",
  "baseTokenDexLiquidityUsd",
  "baseTokenDexVolume24hUsd",
  "baseTokenPairCount",
  "baseTokenLargestPoolLiquidityUsd",
  "baseTokenPoolConcentration",
  "stableExitRouteExists",
  "stableExitLiquidityUsd",
  "stableExitPairAddress",
  "stableExitQuoteToken",
  "stableExitDexId",
  "lstDexLiquidityUsd",
  "lstDexVolume24hUsd",
  "lstPairCount",
  "lstLargestPoolLiquidityUsd",
  "lstPoolConcentration",
  "lstHasBasePair",
  "lstHasStablePair",
  "baseTokenVolumeLiquidityRatio",
  "lstVolumeLiquidityRatio",
  "lstTotalSupply",
  "lstHolderCount",
  "lstTop10HolderShare",
  "lstTransferCount24h",
  "lstTransferVolume24h",
  "contractAbiAvailable",
  "contractVerified",
  "protocolMintCount24h",
  "protocolRedeemCount24h",
  "protocolMintVolume24h",
  "protocolRedeemVolume24h",
  "protocolTreasuryNativeBalance",
  "safeGasPrice",
  "proposeGasPrice",
  "fastGasPrice",
  "suggestedBaseFee"
];

function toNumberOrNull(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function calculateRatio(numerator: number | null, denominator: number | null): number | null {
  if (numerator === null || denominator === null || denominator <= 0) {
    return null;
  }

  return Number((numerator / denominator).toFixed(4));
}

function metricFromCandidates(
  primary: NumberMetricCandidate,
  fallbacks: NumberMetricCandidate[]
): { value: number | null; quality: FieldDataClass; refs: string[] } {
  for (const candidate of [primary, ...fallbacks]) {
    const normalized = toNumberOrNull(candidate.value);
    if (normalized !== null) {
      return {
        value: normalized,
        quality: candidate.quality,
        refs: candidate.refs ?? []
      };
    }
  }

  return {
    value: null,
    quality: "missing",
    refs: []
  };
}

function resolveDerivedQuality(value: unknown): FieldDataClass {
  if (typeof value === "number") {
    return Number.isFinite(value) ? "derived" : "missing";
  }

  if (typeof value === "boolean") {
    return "derived";
  }

  if (typeof value === "string") {
    return value.trim().length > 0 ? "derived" : "missing";
  }

  return "missing";
}

async function readJson(path: string) {
  const raw = await readFile(path, "utf8");
  return JSON.parse(raw);
}

async function loadFallbacks() {
  const [coingeckoSnapshot, defillamaSnapshot, domainSnapshot, uiFieldsSnapshot] = await Promise.all([
    readJson("data/coingecko-basics.json").catch(() => ({ generatedAt: undefined, networks: {} })),
    readJson("data/defillama-basics.json").catch(() => ({ generatedAt: undefined, networks: {} })),
    readJson("data/dashboard-domain-overrides.json").catch(() => ({ generatedAt: undefined, networks: {} })),
    readJson("data/manual/network-ui-fields.json").catch(() => ({ source: "manual-ui-fields", updatedAt: undefined, networks: {} }))
  ]);

  return {
    coingeckoGeneratedAt: coingeckoSnapshot.generatedAt as string | undefined,
    defillamaGeneratedAt: defillamaSnapshot.generatedAt as string | undefined,
    domainGeneratedAt: domainSnapshot.generatedAt as string | undefined,
    uiFieldsUpdatedAt: (uiFieldsSnapshot as ManualUiFieldsSnapshot).updatedAt as string | undefined,
    coingeckoSnapshot: coingeckoSnapshot.networks as SnapshotRecord,
    defillamaSnapshot: (defillamaSnapshot as DefillamaSnapshot).networks ?? {},
    domainSnapshot: domainSnapshot.networks as SnapshotRecord,
    uiFieldsSnapshot: (uiFieldsSnapshot as ManualUiFieldsSnapshot).networks ?? {}
  };
}

function resolveRecordQuality(fieldQuality: Record<string, FieldDataClass>) {
  const coverageCount = COVERAGE_FIELDS.filter((field) => fieldQuality[field] && fieldQuality[field] !== "missing").length;
  const observedCount = COVERAGE_FIELDS.filter((field) => fieldQuality[field] === "observed").length;
  const derivedCount = COVERAGE_FIELDS.filter((field) => fieldQuality[field] === "derived").length;
  const inferredCount = COVERAGE_FIELDS.filter((field) => fieldQuality[field] === "inferred").length;

  const dataCoveragePct = Number(((coverageCount / COVERAGE_FIELDS.length) * 100).toFixed(1));

  let quality: RadarOverviewRecord["quality"] = "simulated";
  if (observedCount + derivedCount >= COVERAGE_FIELDS.length * 0.7) {
    quality = "observed";
  } else if (observedCount + derivedCount + inferredCount >= COVERAGE_FIELDS.length * 0.55) {
    quality = "inferred";
  }

  let confidence: RadarOverviewRecord["confidence"] = "low";
  if (dataCoveragePct >= 80) {
    confidence = "high";
  } else if (dataCoveragePct >= 55) {
    confidence = "medium";
  }

  return {
    dataCoveragePct,
    quality,
    confidence
  };
}

async function main() {
  const generatedAt = new Date().toISOString();
  const { coingeckoSnapshot, defillamaSnapshot, domainSnapshot, uiFieldsSnapshot, uiFieldsUpdatedAt } = await loadFallbacks();

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
  const manualStakingMetrics = await fetchManualStakingRewardsByNetwork(
    NETWORKS.map((network) => network.networkId)
  );

  const dexscreenerByNetwork = Object.fromEntries(
    await Promise.all(
      NETWORKS.map(async (network) => {
        const chainConfig = DEXSCREENER_CHAINS[network.networkId];
        const lstConfig = LST_TOKENS[network.networkId];

        const metrics = await collectDexscreenerMetrics({
          chainId: chainConfig?.chainId ?? null,
          baseTokenAddress: chainConfig?.baseTokenAddress ?? null,
          lstTokenAddress: lstConfig?.lstTokenAddress ?? null
        });

        return [network.networkId, metrics] as const;
      })
    )
  );

  const etherscanByNetwork = Object.fromEntries(
    await Promise.all(
      NETWORKS.map(async (network) => {
        const chainConfig = ETHERSCAN_CHAINS[network.networkId];
        const lstConfig = LST_TOKENS[network.networkId];
        const protocolConfig = PROTOCOL_CONTRACTS[network.networkId];
        const addressConfig = IMPORTANT_ADDRESSES[network.networkId];

        const metrics = await collectEtherscanMetrics({
          chainId: chainConfig?.chainId ?? null,
          lstTokenAddress: lstConfig?.etherscanTokenAddress ?? null,
          transferMonitorAddress: addressConfig?.transferMonitorAddress ?? null,
          protocolContractAddress: protocolConfig?.primaryContractAddress ?? null,
          logsFromBlock: protocolConfig?.logsFromBlock ?? null,
          mintEventTopic0: protocolConfig?.mintEventTopic0 ?? null,
          redeemEventTopic0: protocolConfig?.redeemEventTopic0 ?? null,
          treasuryAddress: addressConfig?.treasuryAddress ?? null
        });

        return [network.networkId, metrics] as const;
      })
    )
  );

  const records: RadarOverviewRecord[] = NETWORKS.map((network) => {
    const fieldQuality: Record<string, FieldDataClass> = {};
    const sourceRefs: string[] = [];

    const coingecko = coingeckoMetrics[network.networkId];
    const defillama = defillamaMetrics[network.networkId];
    const staking = stakingMetrics[network.networkId];
    const manualStaking = manualStakingMetrics[network.networkId];
    const dexscreener = dexscreenerByNetwork[network.networkId];
    const etherscan = etherscanByNetwork[network.networkId];

    const fallbackCg = coingeckoSnapshot[network.networkId] ?? {};
    const fallbackDefillama = defillamaSnapshot[network.networkId] ?? null;
    const fallbackDomain = domainSnapshot[network.networkId] ?? {};
    const manualUi = uiFieldsSnapshot[network.networkId] ?? {};

    const marketCapMetric = metricFromCandidates(
      {
        value: coingecko?.marketCapUsd,
        quality: "observed",
        refs: coingecko?.marketCapUsd !== null ? [coingecko.sourceRef] : []
      },
      [
        {
          value: toNumberOrNull(fallbackCg.marketCapUsd),
          quality: "inferred",
          refs: fallbackCg.coinId ? [`coingecko:coins/markets:${String(fallbackCg.coinId)}`] : []
        }
      ]
    );

    const circulatingSupplyMetric = metricFromCandidates(
      {
        value: coingecko?.circulatingSupply,
        quality: "observed",
        refs: coingecko?.circulatingSupply !== null ? [coingecko.sourceRef] : []
      },
      [
        {
          value: toNumberOrNull(fallbackCg.circulatingSupply),
          quality: "inferred",
          refs: fallbackCg.coinId ? [`coingecko:coins/markets:${String(fallbackCg.coinId)}`] : []
        }
      ]
    );

    const priceMetric = metricFromCandidates(
      {
        value: coingecko?.priceUsd,
        quality: "observed",
        refs: coingecko?.priceUsd !== null ? [coingecko.sourceRef] : []
      },
      []
    );

    const volumeMetric = metricFromCandidates(
      {
        value: coingecko?.volume24hUsd,
        quality: "observed",
        refs: coingecko?.volume24hUsd !== null ? [coingecko.sourceRef] : []
      },
      []
    );

    const defiTvlMetric = metricFromCandidates(
      {
        value: defillama?.defiTvlUsd,
        quality: "observed",
        refs: defillama?.defiTvlUsd !== null ? defillama.sourceRefs : []
      },
      [
        {
          value: fallbackDefillama?.defiTvlUsd,
          quality: "inferred",
          refs: fallbackDefillama?.defiTvlUsd !== null ? fallbackDefillama.sourceRefs : []
        },
        {
          value: toNumberOrNull(fallbackDomain.defiTvlUsd),
          quality: "inferred",
          refs: toNumberOrNull(fallbackDomain.defiTvlUsd) !== null ? ["manual-domain-overrides:defiTvlUsd"] : []
        }
      ]
    );

    const stablecoinMetric = metricFromCandidates(
      {
        value: defillama?.stablecoinLiquidityUsd,
        quality: "observed",
        refs: defillama?.stablecoinLiquidityUsd !== null ? defillama.sourceRefs : []
      },
      [
        {
          value: fallbackDefillama?.stablecoinLiquidityUsd,
          quality: "inferred",
          refs: fallbackDefillama?.stablecoinLiquidityUsd !== null ? fallbackDefillama.sourceRefs : []
        },
        {
          value: toNumberOrNull(fallbackDomain.stablecoinLiquidityUsd),
          quality: "inferred",
          refs:
            toNumberOrNull(fallbackDomain.stablecoinLiquidityUsd) !== null
              ? ["manual-domain-overrides:stablecoinLiquidityUsd"]
              : []
        }
      ]
    );

    const lstTvlMetric = metricFromCandidates(
      {
        value: defillama?.lstTvlUsd,
        quality: "observed",
        refs: defillama?.lstTvlUsd !== null ? defillama.sourceRefs : []
      },
      [
        {
          value: fallbackDefillama?.lstTvlUsd,
          quality: "inferred",
          refs: fallbackDefillama?.lstTvlUsd !== null ? fallbackDefillama.sourceRefs : []
        },
        {
          value: toNumberOrNull(fallbackDomain.lstTvlUsd),
          quality: "inferred",
          refs: toNumberOrNull(fallbackDomain.lstTvlUsd) !== null ? ["manual-domain-overrides:lstTvlUsd"] : []
        }
      ]
    );

    const hasStrongStakingSource = staking?.sourceRef === "stakingRewards:fixed-endpoint";
    const manualStakingSourceRef =
      manualStaking && manualStaking.asOf
        ? `${manualStaking.sourceRef}:asOf=${manualStaking.asOf}`
        : manualStaking?.sourceRef ?? null;

    const validatorMetric = metricFromCandidates(
      {
        value: hasStrongStakingSource ? staking?.validatorCount : null,
        quality: "observed",
        refs:
          hasStrongStakingSource && staking?.validatorCount !== null && staking?.validatorCount !== undefined
            ? [staking.sourceRef]
            : []
      },
      [
        {
          value: manualStaking?.staking.validators,
          quality: "observed",
          refs:
            manualStakingSourceRef && manualStaking?.staking.validators !== null ? [manualStakingSourceRef] : []
        },
        {
          value: hasStrongStakingSource ? null : staking?.validatorCount,
          quality: "inferred",
          refs:
            !hasStrongStakingSource && staking?.validatorCount !== null && staking?.validatorCount !== undefined
              ? [staking.sourceRef]
              : []
        },
        {
          value: toNumberOrNull(fallbackDomain.validatorCount),
          quality: "inferred",
          refs: toNumberOrNull(fallbackDomain.validatorCount) !== null ? ["manual-domain-overrides:validatorCount"] : []
        }
      ]
    );

    const stakingRatioMetric = metricFromCandidates(
      {
        value: hasStrongStakingSource ? staking?.stakingRatioPct : null,
        quality: "observed",
        refs:
          hasStrongStakingSource && staking?.stakingRatioPct !== null && staking?.stakingRatioPct !== undefined
            ? [staking.sourceRef]
            : []
      },
      [
        {
          value: manualStaking?.staking.stakingRatioPct,
          quality: "observed",
          refs:
            manualStakingSourceRef && manualStaking?.staking.stakingRatioPct !== null ? [manualStakingSourceRef] : []
        },
        {
          value: hasStrongStakingSource ? null : staking?.stakingRatioPct,
          quality: "inferred",
          refs:
            !hasStrongStakingSource && staking?.stakingRatioPct !== null && staking?.stakingRatioPct !== undefined
              ? [staking.sourceRef]
              : []
        },
        {
          value: toNumberOrNull(fallbackDomain.stakingRatioPct),
          quality: "inferred",
          refs:
            toNumberOrNull(fallbackDomain.stakingRatioPct) !== null ? ["manual-domain-overrides:stakingRatioPct"] : []
        }
      ]
    );

    const stakingApyMetric = metricFromCandidates(
      {
        value: hasStrongStakingSource ? staking?.stakingApyPct : null,
        quality: "observed",
        refs:
          hasStrongStakingSource && staking?.stakingApyPct !== null && staking?.stakingApyPct !== undefined
            ? [staking.sourceRef]
            : []
      },
      [
        {
          value: manualStaking?.staking.rewardRatePct,
          quality: "observed",
          refs:
            manualStakingSourceRef && manualStaking?.staking.rewardRatePct !== null ? [manualStakingSourceRef] : []
        },
        {
          value: hasStrongStakingSource ? null : staking?.stakingApyPct,
          quality: "inferred",
          refs:
            !hasStrongStakingSource && staking?.stakingApyPct !== null && staking?.stakingApyPct !== undefined
              ? [staking.sourceRef]
              : []
        },
        {
          value: toNumberOrNull(fallbackDomain.stakingApyPct),
          quality: "inferred",
          refs: toNumberOrNull(fallbackDomain.stakingApyPct) !== null ? ["manual-domain-overrides:stakingApyPct"] : []
        }
      ]
    );

    const rewardRateMetric = metricFromCandidates(
      {
        value: manualStaking?.staking.rewardRatePct,
        quality: "observed",
        refs:
          manualStakingSourceRef && manualStaking?.staking.rewardRatePct !== null ? [manualStakingSourceRef] : []
      },
      []
    );

    const stakingMarketCapMetric = metricFromCandidates(
      {
        value: manualStaking?.staking.stakingMarketCapUsd,
        quality: "observed",
        refs:
          manualStakingSourceRef && manualStaking?.staking.stakingMarketCapUsd !== null
            ? [manualStakingSourceRef]
            : []
      },
      []
    );

    const stakedTokensMetric = metricFromCandidates(
      {
        value: manualStaking?.staking.stakedTokens,
        quality: "observed",
        refs: manualStakingSourceRef && manualStaking?.staking.stakedTokens !== null ? [manualStakingSourceRef] : []
      },
      []
    );

    const inflationRateMetric = metricFromCandidates(
      {
        value: manualStaking?.staking.inflationRatePct,
        quality: "observed",
        refs:
          manualStakingSourceRef && manualStaking?.staking.inflationRatePct !== null ? [manualStakingSourceRef] : []
      },
      []
    );

    const verifiedProvidersMetric = metricFromCandidates(
      {
        value: manualStaking?.staking.verifiedProviders,
        quality: "observed",
        refs:
          manualStakingSourceRef && manualStaking?.staking.verifiedProviders !== null ? [manualStakingSourceRef] : []
      },
      []
    );

    const benchmarkCommissionMetric = metricFromCandidates(
      {
        value: manualStaking?.staking.benchmarkCommissionPct,
        quality: "observed",
        refs:
          manualStakingSourceRef && manualStaking?.staking.benchmarkCommissionPct !== null
            ? [manualStakingSourceRef]
            : []
      },
      []
    );

    const category = typeof manualUi.category === "string" ? manualUi.category : null;
    const status = typeof manualUi.status === "string" ? manualUi.status : null;
    const fdvUsd = toNumberOrNull(manualUi.fdvUsd);
    const circulatingSupplyPct = toNumberOrNull(manualUi.circulatingSupplyPct);
    const stakerAddresses = toNumberOrNull(manualUi.stakerAddresses);
    const lstProtocols = toNumberOrNull(manualUi.lstProtocols);
    const largestLst = typeof manualUi.largestLst === "string" ? manualUi.largestLst : null;
    const lendingPresence = typeof manualUi.lendingPresence === "boolean" ? manualUi.lendingPresence : null;
    const lstCollateralEnabled = typeof manualUi.lstCollateralEnabled === "boolean" ? manualUi.lstCollateralEnabled : null;
    const mainBottleneck = typeof manualUi.mainBottleneck === "string" ? manualUi.mainBottleneck : null;
    const mainOpportunity = typeof manualUi.mainOpportunity === "string" ? manualUi.mainOpportunity : null;
    const hasLst = typeof manualUi.hasLst === "boolean" ? manualUi.hasLst : null;
    const unbondingDays = manualUi.unbondingDays != null ? Number(manualUi.unbondingDays) : null;
    const auditCount = manualUi.auditCount != null ? Number(manualUi.auditCount) : null;
    const hasTimelock = typeof manualUi.hasTimelock === "boolean" ? manualUi.hasTimelock : null;

    const marketCapUsd = marketCapMetric.value;
    const circulatingSupply = circulatingSupplyMetric.value;
    const priceUsd = priceMetric.value;
    const volume24hUsd = volumeMetric.value;
    const defiTvlUsd = defiTvlMetric.value;
    const stablecoinLiquidityUsd = stablecoinMetric.value;
    const validatorCount = validatorMetric.value;
    const stakingRatioPct = stakingRatioMetric.value;
    const stakingApyPct = stakingApyMetric.value;
    const rewardRatePct = rewardRateMetric.value;
    const stakingMarketCapUsd = stakingMarketCapMetric.value;
    const stakedTokens = stakedTokensMetric.value;
    const inflationRatePct = inflationRateMetric.value;
    const verifiedProviders = verifiedProvidersMetric.value;
    const benchmarkCommissionPct = benchmarkCommissionMetric.value;
    const lstTvlUsd = lstTvlMetric.value;

    fieldQuality.category = resolveDerivedQuality(category) === "derived" ? "inferred" : "missing";
    fieldQuality.status = resolveDerivedQuality(status) === "derived" ? "inferred" : "missing";
    fieldQuality.fdvUsd = resolveDerivedQuality(fdvUsd) === "derived" ? "inferred" : "missing";
    fieldQuality.circulatingSupplyPct =
      resolveDerivedQuality(circulatingSupplyPct) === "derived" ? "inferred" : "missing";
    fieldQuality.stakerAddresses = resolveDerivedQuality(stakerAddresses) === "derived" ? "inferred" : "missing";
    fieldQuality.lstProtocols = resolveDerivedQuality(lstProtocols) === "derived" ? "inferred" : "missing";
    fieldQuality.largestLst = resolveDerivedQuality(largestLst) === "derived" ? "inferred" : "missing";
    fieldQuality.lendingPresence = resolveDerivedQuality(lendingPresence) === "derived" ? "inferred" : "missing";
    fieldQuality.lstCollateralEnabled =
      resolveDerivedQuality(lstCollateralEnabled) === "derived" ? "inferred" : "missing";
    fieldQuality.mainBottleneck = resolveDerivedQuality(mainBottleneck) === "derived" ? "inferred" : "missing";
    fieldQuality.mainOpportunity =
      resolveDerivedQuality(mainOpportunity) === "derived" ? "inferred" : "missing";

    fieldQuality.marketCapUsd = marketCapMetric.quality;
    fieldQuality.circulatingSupply = circulatingSupplyMetric.quality;
    fieldQuality.priceUsd = priceMetric.quality;
    fieldQuality.volume24hUsd = volumeMetric.quality;
    fieldQuality.defiTvlUsd = defiTvlMetric.quality;
    fieldQuality.stablecoinLiquidityUsd = stablecoinMetric.quality;
    fieldQuality.validatorCount = validatorMetric.quality;
    fieldQuality.stakingRatioPct = stakingRatioMetric.quality;
    fieldQuality.stakingApyPct = stakingApyMetric.quality;
    fieldQuality.rewardRatePct = rewardRateMetric.quality;
    fieldQuality.stakingMarketCapUsd = stakingMarketCapMetric.quality;
    fieldQuality.stakedTokens = stakedTokensMetric.quality;
    fieldQuality.inflationRatePct = inflationRateMetric.quality;
    fieldQuality.verifiedProviders = verifiedProvidersMetric.quality;
    fieldQuality.benchmarkCommissionPct = benchmarkCommissionMetric.quality;
    fieldQuality.lstTvlUsd = lstTvlMetric.quality;

    const manualUiSourceRef = uiFieldsUpdatedAt
      ? "manual-ui-fields:asOf=" + uiFieldsUpdatedAt + ":network=" + network.networkId
      : "manual-ui-fields:network=" + network.networkId;

    if (
      category !== null ||
      status !== null ||
      fdvUsd !== null ||
      circulatingSupplyPct !== null ||
      stakerAddresses !== null ||
      lstProtocols !== null ||
      largestLst !== null ||
      lendingPresence !== null ||
      lstCollateralEnabled !== null ||
      mainBottleneck !== null ||
      mainOpportunity !== null
    ) {
      sourceRefs.push(manualUiSourceRef);
    }

    sourceRefs.push(
      ...marketCapMetric.refs,
      ...circulatingSupplyMetric.refs,
      ...priceMetric.refs,
      ...volumeMetric.refs,
      ...defiTvlMetric.refs,
      ...stablecoinMetric.refs,
      ...validatorMetric.refs,
      ...stakingRatioMetric.refs,
      ...stakingApyMetric.refs,
      ...rewardRateMetric.refs,
      ...stakingMarketCapMetric.refs,
      ...stakedTokensMetric.refs,
      ...inflationRateMetric.refs,
      ...verifiedProvidersMetric.refs,
      ...benchmarkCommissionMetric.refs,
      ...lstTvlMetric.refs
    );

    const stakedValueUsd =
      marketCapUsd !== null && stakingRatioPct !== null ? (marketCapUsd * stakingRatioPct) / 100 : null;

    const tvlToMarketCap = calculateRatio(defiTvlUsd, marketCapUsd);
    const lstPenetrationPct = calculateRatio(lstTvlUsd, stakedValueUsd);

    fieldQuality.stakedValueUsd = resolveDerivedQuality(stakedValueUsd);
    fieldQuality.tvlToMarketCap = resolveDerivedQuality(tvlToMarketCap);
    fieldQuality.lstPenetrationPct = resolveDerivedQuality(lstPenetrationPct);

    const dexMetrics = dexscreener?.metrics;
    const dexQuality = dexscreener?.fieldQuality;

    const baseTokenDexLiquidityUsd = dexMetrics?.baseTokenDexLiquidityUsd ?? null;
    const baseTokenDexVolume24hUsd = dexMetrics?.baseTokenDexVolume24hUsd ?? null;
    const baseTokenPairCount = dexMetrics?.baseTokenPairCount ?? null;
    const baseTokenLargestPoolLiquidityUsd = dexMetrics?.baseTokenLargestPoolLiquidityUsd ?? null;
    const baseTokenPoolConcentration = dexMetrics?.baseTokenPoolConcentration ?? null;
    const stableExitRouteExists = dexMetrics?.stableExitRouteExists ?? null;
    const stableExitLiquidityUsd = dexMetrics?.stableExitLiquidityUsd ?? null;
    const stableExitPairAddress = dexMetrics?.stableExitPairAddress ?? null;
    const stableExitQuoteToken = dexMetrics?.stableExitQuoteToken ?? null;
    const stableExitDexId = dexMetrics?.stableExitDexId ?? null;
    const lstDexLiquidityUsd = dexMetrics?.lstDexLiquidityUsd ?? null;
    const lstDexVolume24hUsd = dexMetrics?.lstDexVolume24hUsd ?? null;
    const lstPairCount = dexMetrics?.lstPairCount ?? null;
    const lstLargestPoolLiquidityUsd = dexMetrics?.lstLargestPoolLiquidityUsd ?? null;
    const lstPoolConcentration = dexMetrics?.lstPoolConcentration ?? null;
    const lstHasBasePair = dexMetrics?.lstHasBasePair ?? null;
    const lstHasStablePair = dexMetrics?.lstHasStablePair ?? null;
    const baseTokenVolumeLiquidityRatio = dexMetrics?.baseTokenVolumeLiquidityRatio ?? null;
    const lstVolumeLiquidityRatio = dexMetrics?.lstVolumeLiquidityRatio ?? null;

    for (const field of DEX_FIELDS) {
      fieldQuality[field] = dexQuality?.[field] ?? "missing";
    }

    sourceRefs.push(...(dexscreener?.sourceRefs ?? []));

    const etherscanMetrics = etherscan?.metrics;
    const etherscanQuality = etherscan?.fieldQuality;

    const lstTotalSupply = etherscanMetrics?.lstTotalSupply ?? null;
    const lstHolderCount = etherscanMetrics?.lstHolderCount ?? null;
    const lstTop10HolderShare = etherscanMetrics?.lstTop10HolderShare ?? null;
    const lstTransferCount24h = etherscanMetrics?.lstTransferCount24h ?? null;
    const lstTransferVolume24h = etherscanMetrics?.lstTransferVolume24h ?? null;
    const contractAbiAvailable = etherscanMetrics?.contractAbiAvailable ?? null;
    const contractVerified = etherscanMetrics?.contractVerified ?? null;
    const protocolMintCount24h = etherscanMetrics?.protocolMintCount24h ?? null;
    const protocolRedeemCount24h = etherscanMetrics?.protocolRedeemCount24h ?? null;
    const protocolMintVolume24h = etherscanMetrics?.protocolMintVolume24h ?? null;
    const protocolRedeemVolume24h = etherscanMetrics?.protocolRedeemVolume24h ?? null;
    const protocolTreasuryNativeBalance = etherscanMetrics?.protocolTreasuryNativeBalance ?? null;
    const safeGasPrice = etherscanMetrics?.safeGasPrice ?? null;
    const proposeGasPrice = etherscanMetrics?.proposeGasPrice ?? null;
    const fastGasPrice = etherscanMetrics?.fastGasPrice ?? null;
    const suggestedBaseFee = etherscanMetrics?.suggestedBaseFee ?? null;

    for (const field of ETHERSCAN_FIELDS) {
      fieldQuality[field] = etherscanQuality?.[field] ?? "missing";
    }

    sourceRefs.push(...(etherscan?.sourceRefs ?? []));

    const summary = resolveRecordQuality(fieldQuality);

    return {
      networkId: network.networkId,
      chain: manualStaking?.chain ?? network.networkId,
      network: network.network,
      token: network.token,
      category,
      status,
      fdvUsd,
      circulatingSupplyPct,
      stakerAddresses,
      lstProtocols,
      largestLst,
      lendingPresence,
      lstCollateralEnabled,
      mainBottleneck,
      mainOpportunity,
      marketCapUsd,
      circulatingSupply,
      priceUsd,
      volume24hUsd,
      defiTvlUsd,
      stablecoinLiquidityUsd,
      validatorCount,
      stakingRatioPct,
      stakingApyPct,
      rewardRatePct,
      stakingMarketCapUsd,
      stakedTokens,
      stakedValueUsd,
      inflationRatePct,
      verifiedProviders,
      benchmarkCommissionPct,
      staking: {
        rewardRatePct,
        stakingRatioPct,
        stakingMarketCapUsd,
        stakedTokens,
        inflationRatePct,
        validators: validatorCount,
        verifiedProviders,
        benchmarkCommissionPct
      },
      stakingMeta: {
        source: manualStaking?.source ?? null,
        asOf: manualStaking?.asOf ?? null,
        quality: manualStaking?.quality ?? null,
        confidence: manualStaking?.confidence ?? null
      },
      lstTvlUsd,
      tvlToMarketCap,
      lstPenetrationPct,
      baseTokenDexLiquidityUsd,
      baseTokenDexVolume24hUsd,
      baseTokenPairCount,
      baseTokenLargestPoolLiquidityUsd,
      baseTokenPoolConcentration,
      stableExitRouteExists,
      stableExitLiquidityUsd,
      stableExitPairAddress,
      stableExitQuoteToken,
      stableExitDexId,
      lstDexLiquidityUsd,
      lstDexVolume24hUsd,
      lstPairCount,
      lstLargestPoolLiquidityUsd,
      lstPoolConcentration,
      lstHasBasePair,
      lstHasStablePair,
      baseTokenVolumeLiquidityRatio,
      lstVolumeLiquidityRatio,
      lstTotalSupply,
      lstHolderCount,
      lstTop10HolderShare,
      lstTransferCount24h,
      lstTransferVolume24h,
      contractAbiAvailable,
      contractVerified,
      protocolMintCount24h,
      protocolRedeemCount24h,
      protocolMintVolume24h,
      protocolRedeemVolume24h,
      protocolTreasuryNativeBalance,
      safeGasPrice,
      proposeGasPrice,
      fastGasPrice,
      suggestedBaseFee,
      hasLst,
      unbondingDays,
      auditCount,
      hasTimelock,
      globalLstHealthScore: network.globalLstHealthScore,
      opportunityScore: network.opportunityScore,
      asOf: generatedAt,
      sourceRefs: [...new Set(sourceRefs)],
      quality: summary.quality,
      confidence: summary.confidence,
      dataCoveragePct: summary.dataCoveragePct,
      fieldQuality
    };
  });

  await writeFile("data/networks.generated.json", `${JSON.stringify(records, null, 2)}\n`, "utf8");
  console.log("[build-overview-dataset] Wrote data/networks.generated.json");
}

main().catch((error) => {
  console.error("[build-overview-dataset] Failed:", error);
  process.exitCode = 1;
});
