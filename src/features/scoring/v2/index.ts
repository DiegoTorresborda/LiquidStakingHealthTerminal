// Scoring v2 — Orchestrator
// Combines all 6 module engines into a single scored result per network.

import type { RadarOverviewRecord } from "@/data/radar-overview-schema"
import type { ModuleScoreResult } from "./types"

// v2 weights (sum = 0.90, global score renormalized by dividing by WEIGHTS_SUM)
const W = {
  "Liquidity & Exit": 0.25,
  "Peg Stability": 0.15,
  "DeFi Moneyness": 0.15,
  "Security & Governance": 0.15,
  "Validator Decentralization": 0.10,
  "Incentive Sustainability": 0.10,
} as const

const WEIGHTS_SUM = 0.90
import {
  scoreLiquidityExit,
  scorePegStability,
  scoreDefiMoneyness,
  scoreSecurityGovernance,
  scoreValidatorDecentralization,
  scoreIncentiveSustainability,
} from "./engine"
import {
  buildLiquidityExitInput,
  buildPegStabilityInput,
  buildDefiMoneynessInput,
  buildSecurityGovernanceInput,
  buildValidatorDecentralizationInput,
  buildIncentiveSustainabilityInput,
} from "./input-builder"

// ─── Output type ─────────────────────────────────────────────────────────────

export type V2ModuleScores = {
  "Liquidity & Exit": ModuleScoreResult
  "Peg Stability": ModuleScoreResult
  "DeFi Moneyness": ModuleScoreResult
  "Security & Governance": ModuleScoreResult
  "Validator Decentralization": ModuleScoreResult
  "Incentive Sustainability": ModuleScoreResult
}

export type V2PillarScores = {
  /** (L&E×0.25 + Peg×0.15) / 0.40 */
  exitability: number
  /** DeFi score (already 0–100) */
  moneyness: number
  /** (Sec×0.15 + Val×0.10 + Inc×0.10) / 0.35 */
  credibility: number
}

export type V2ScoringResult = {
  modelVersion: "v2"
  networkId: string
  mode: "pre-lst" | "lst-active"
  moduleScores: V2ModuleScores
  pillarScores: V2PillarScores
  /** Weighted sum of module finalScores / WEIGHTS_SUM (0.90), clamped 0–100 */
  globalScore: number
}

// ─── Pillar aggregation ───────────────────────────────────────────────────────

function calcPillars(m: V2ModuleScores): V2PillarScores {
  const s = (key: keyof V2ModuleScores) => m[key].finalScore
  const excluded = (key: keyof V2ModuleScores) => m[key].excluded === true

  // Exitability: L&E + Peg. If Peg is excluded (pre-LST), use only L&E.
  const pegExcluded = excluded("Peg Stability")
  const exitabilityWeightSum = pegExcluded
    ? W["Liquidity & Exit"]
    : W["Liquidity & Exit"] + W["Peg Stability"]
  const exitabilityWeighted = pegExcluded
    ? s("Liquidity & Exit") * W["Liquidity & Exit"]
    : s("Liquidity & Exit") * W["Liquidity & Exit"] + s("Peg Stability") * W["Peg Stability"]
  const exitability = Math.round(exitabilityWeighted / exitabilityWeightSum)

  const moneyness = s("DeFi Moneyness")

  const credibility = Math.round(
    (s("Security & Governance") * W["Security & Governance"] +
      s("Validator Decentralization") * W["Validator Decentralization"] +
      s("Incentive Sustainability") * W["Incentive Sustainability"]) /
      (W["Security & Governance"] +
        W["Validator Decentralization"] +
        W["Incentive Sustainability"])
  )

  return { exitability, moneyness, credibility }
}

// ─── Global score ─────────────────────────────────────────────────────────────

function calcGlobal(m: V2ModuleScores): number {
  // Sum only non-excluded modules. This redistributes excluded weights
  // proportionally across the remaining modules via normalization.
  let weighted = 0
  let activeWeightSum = 0

  for (const key of Object.keys(W) as (keyof typeof W)[]) {
    if (m[key].excluded) continue
    weighted += m[key].finalScore * W[key]
    activeWeightSum += W[key]
  }

  if (activeWeightSum === 0) return 0
  return Math.round(Math.min(100, Math.max(0, weighted / activeWeightSum)))
}

// ─── Main entry point ─────────────────────────────────────────────────────────

export function computeV2Score(network: RadarOverviewRecord): V2ScoringResult {
  const moduleScores: V2ModuleScores = {
    "Liquidity & Exit": scoreLiquidityExit(buildLiquidityExitInput(network)),
    "Peg Stability": scorePegStability(buildPegStabilityInput(network)),
    "DeFi Moneyness": scoreDefiMoneyness(buildDefiMoneynessInput(network)),
    "Security & Governance": scoreSecurityGovernance(buildSecurityGovernanceInput(network)),
    "Validator Decentralization": scoreValidatorDecentralization(
      buildValidatorDecentralizationInput(network)
    ),
    "Incentive Sustainability": scoreIncentiveSustainability(
      buildIncentiveSustainabilityInput(network)
    ),
  }

  // All modules share the same mode (set by detectMode in each builder)
  const mode = moduleScores["Liquidity & Exit"].mode as "pre-lst" | "lst-active"

  return {
    modelVersion: "v2",
    networkId: network.networkId,
    mode,
    moduleScores,
    pillarScores: calcPillars(moduleScores),
    globalScore: calcGlobal(moduleScores),
  }
}
