// Stage transition rules — port of paf-toolkit/paf/thresholds.py.
// Each rule operates on a RawPafSnapshot's raw fields.

import type { RawPafSnapshot, Stage } from "./types"

export type Threshold = {
  fromStage: Stage
  toStage: Stage
  rule: string
  check: (s: RawPafSnapshot) => boolean
}

function stakingRatioAbove2(s: RawPafSnapshot): boolean {
  return s.stakingRatioPct > 2.0
}

// S1 → S2: liquidization > 20% AND (≥3 issuers > 5% OR largest issuer < 70%).
// The two-clause version captures the anti-monopoly intent while not falsely
// failing mature markets like Ethereum (where natural consolidation leaves
// only 2 issuers above 5% but the leader is well under 70%).
function liquidizationAndDiverseIssuers(s: RawPafSnapshot): boolean {
  if (s.liquidizationRatePct == null) return false
  if (s.liquidizationRatePct <= 20.0) return false
  const diverse = (s.numLstIssuersAbove5pct ?? 0) >= 3
  const nonDominantLeader =
    s.largestLstIssuerSharePct != null && s.largestLstIssuerSharePct < 70.0
  return diverse || nonDominantLeader
}

function defiProductiveAndWithdrawals(s: RawPafSnapshot): boolean {
  if (s.defiProductivityRatePct == null) return false
  if (s.nativeRedemptionAvailable !== true) return false
  return s.defiProductivityRatePct > 30.0
}

function restakingAbove5pct(s: RawPafSnapshot): boolean {
  if (s.lstTvlUsd == null || s.lstTvlUsd <= 0) return false
  if (s.restakingTvlUsd == null) return false
  return s.restakingTvlUsd / s.lstTvlUsd > 0.05
}

function composableMature(s: RawPafSnapshot): boolean {
  if (s.loopingSupported !== true) return false
  if ((s.numLendingIntegrations ?? 0) < 2) return false
  if (s.pendleEquivalentTvlUsd == null) return false
  return s.pendleEquivalentTvlUsd > 1_000_000_000
}

export const TRANSITIONS: Threshold[] = [
  { fromStage: "S0", toStage: "S1", rule: "staking_ratio > 2%", check: stakingRatioAbove2 },
  {
    fromStage: "S1",
    toStage: "S2",
    rule: "liquidization > 20% AND (≥3 LST issuers > 5% OR largest issuer < 70%)",
    check: liquidizationAndDiverseIssuers,
  },
  {
    fromStage: "S2",
    toStage: "S3",
    rule: "defi_productivity > 30% AND withdrawals enabled",
    check: defiProductiveAndWithdrawals,
  },
  {
    fromStage: "S3",
    toStage: "S4.1",
    rule: "restaking_tvl > 5% of lst_tvl",
    check: restakingAbove5pct,
  },
  {
    fromStage: "S4.1",
    toStage: "S4.2",
    rule: "looping in 2+ lending markets AND pendle-equivalent > $1B",
    check: composableMature,
  },
]

export function transitionFor(fromStage: Stage): Threshold | null {
  return TRANSITIONS.find((t) => t.fromStage === fromStage) ?? null
}
