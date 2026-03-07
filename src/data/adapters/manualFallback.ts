import { readFileSync } from "node:fs";

export type ManualStakingMetric = {
  validatorCount: number | null;
  stakingRatioPct: number | null;
  stakingApyPct: number | null;
};

function loadManualStaking() {
  try {
    const path = new URL("../../../data/manual-staking.json", import.meta.url);
    const raw = readFileSync(path, "utf8");
    return JSON.parse(raw) as { networks?: Record<string, ManualStakingMetric> };
  } catch {
    return { networks: {} };
  }
}

const MANUAL_STAKING = loadManualStaking();

export function getManualStakingMetric(networkId: string): ManualStakingMetric | null {
  return MANUAL_STAKING.networks?.[networkId] ?? null;
}
