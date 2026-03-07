import { fetchJsonWithCache } from "./http-cache.ts";
import { getManualStakingMetric } from "./manualFallback.ts";

export type StakingMetric = {
  validatorCount: number | null;
  stakingRatioPct: number | null;
  stakingApyPct: number | null;
  sourceRef: string;
};

type StakingApiResponse = Record<
  string,
  {
    validatorCount?: number;
    stakingRatioPct?: number;
    stakingApyPct?: number;
  }
>;

export async function fetchStakingMetricsByNetwork(networkIds: string[]): Promise<Record<string, StakingMetric>> {
  const result: Record<string, StakingMetric> = {};

  const endpoint = process.env.STAKING_REWARDS_ENDPOINT;
  let remote: StakingApiResponse | null = null;

  if (endpoint) {
    try {
      remote = await fetchJsonWithCache<StakingApiResponse>(endpoint);
    } catch {
      remote = null;
    }
  }

  for (const networkId of networkIds) {
    const fromRemote = remote?.[networkId];

    if (fromRemote) {
      result[networkId] = {
        validatorCount: typeof fromRemote.validatorCount === "number" ? fromRemote.validatorCount : null,
        stakingRatioPct: typeof fromRemote.stakingRatioPct === "number" ? fromRemote.stakingRatioPct : null,
        stakingApyPct: typeof fromRemote.stakingApyPct === "number" ? fromRemote.stakingApyPct : null,
        sourceRef: "stakingRewards:fixed-endpoint"
      };
      continue;
    }

    const manual = getManualStakingMetric(networkId);
    result[networkId] = {
      validatorCount: manual?.validatorCount ?? null,
      stakingRatioPct: manual?.stakingRatioPct ?? null,
      stakingApyPct: manual?.stakingApyPct ?? null,
      sourceRef: "manual-fallback:manual-staking.json"
    };
  }

  return result;
}
