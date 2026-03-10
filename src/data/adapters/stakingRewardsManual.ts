import { readFile } from "node:fs/promises";

export type ManualStakingRewardsStaking = {
  rewardRatePct: number | null;
  stakingRatioPct: number | null;
  stakingMarketCapUsd: number | null;
  stakedTokens: number | null;
  inflationRatePct: number | null;
  validators: number | null;
  verifiedProviders: number | null;
  benchmarkCommissionPct: number | null;
};

export type ManualStakingRewardsMetric = {
  chain: string;
  staking: ManualStakingRewardsStaking;
  source: string;
  asOf: string | null;
  quality: "observed-manual";
  confidence: "high";
  sourceRef: string;
};

type RawStakingRewardsRecord = {
  source?: string;
  timestamp?: string;
  rewardRatePct?: number;
  stakingRatioPct?: number;
  stakingMarketCapUsd?: number;
  stakedTokens?: number;
  inflationRatePct?: number;
  validators?: number;
  verifiedProviders?: number;
  benchmarkCommissionPct?: number;
};

type RawStakingRewardsSnapshot = Record<string, RawStakingRewardsRecord>;

const STAKING_REWARDS_MANUAL_PATH = new URL("../../../data/manual/stakingrewards.json", import.meta.url);

function toNumberOrNull(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function normalizeRawRecord(chain: string, raw: RawStakingRewardsRecord): ManualStakingRewardsMetric {
  const source = "stakingrewards.com";
  const asOf = typeof raw.timestamp === "string" && raw.timestamp.trim().length > 0 ? raw.timestamp : null;

  return {
    chain,
    staking: {
      rewardRatePct: toNumberOrNull(raw.rewardRatePct),
      stakingRatioPct: toNumberOrNull(raw.stakingRatioPct),
      stakingMarketCapUsd: toNumberOrNull(raw.stakingMarketCapUsd),
      stakedTokens: toNumberOrNull(raw.stakedTokens),
      inflationRatePct: toNumberOrNull(raw.inflationRatePct),
      validators: toNumberOrNull(raw.validators),
      verifiedProviders: toNumberOrNull(raw.verifiedProviders),
      benchmarkCommissionPct: toNumberOrNull(raw.benchmarkCommissionPct)
    },
    source,
    asOf,
    quality: "observed-manual",
    confidence: "high",
    sourceRef: `stakingrewards.com:manual-snapshot:${chain}`
  };
}

export async function fetchManualStakingRewardsByNetwork(
  networkIds: string[]
): Promise<Record<string, ManualStakingRewardsMetric | null>> {
  let snapshot: RawStakingRewardsSnapshot = {};

  try {
    const raw = await readFile(STAKING_REWARDS_MANUAL_PATH, "utf8");
    snapshot = JSON.parse(raw) as RawStakingRewardsSnapshot;
  } catch {
    snapshot = {};
  }

  const result: Record<string, ManualStakingRewardsMetric | null> = {};

  for (const networkId of networkIds) {
    const rawRecord = snapshot[networkId];
    result[networkId] = rawRecord ? normalizeRawRecord(networkId, rawRecord) : null;
  }

  return result;
}
