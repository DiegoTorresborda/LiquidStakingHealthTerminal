// Scoring v2 — Types

export type DataSource = "primary" | "proxy" | "missing"

export type InputBreakdown = {
  score: number
  rawValue: number | null
  source: DataSource
  note?: string
}

export type ModuleScoreResult = {
  module: string
  mode: string
  rawScore: number
  finalScore: number
  capApplied: { reason: string; value: number } | null
  breakdown: Record<string, InputBreakdown>
}

// ─── Liquidity & Exit ────────────────────────────────────────────────────────

export type LiquidityExitPreLstInput = {
  mode: "pre-lst"
  // Base token liquidity: primary = baseTokenDexLiquidityUsd, proxy = volume24hUsd
  baseExitValue: number | null
  baseExitSource: DataSource
  // Stable exit depth: primary = stableExitLiquidityUsd (sum), proxy = stablecoinLiquidityUsd × 0.05
  stableExitValue: number | null
  stableExitSource: DataSource
  // Staking demand signal
  stakingRatioPct: number | null
  // References for relative normalization
  marketCapUsd: number | null
  // Cap trigger
  stableExitExists: boolean
}

export type LiquidityExitActiveLstInput = {
  mode: "lst-active"
  // LST market liquidity: sum of all LST DEX pairs — no proxy, 0 if missing
  lstDexLiquidityUsd: number | null
  lstDexSource: DataSource
  // Reference for relative normalization of LST liquidity
  lstTvlUsd: number | null
  // Stable exit: same logic as pre-lst
  stableExitValue: number | null
  stableExitSource: DataSource
  // Reference for relative normalization of stable exit
  marketCapUsd: number | null
  // Redemption anchor
  redemptionExists: boolean
  unbondingDays: number | null // null = exists but days unknown
  // Cap triggers
  stableExitExists: boolean
}

export type LiquidityExitInput = LiquidityExitPreLstInput | LiquidityExitActiveLstInput

// ─── Peg Stability ───────────────────────────────────────────────────────────

export type PegStabilityActiveLstInput = {
  mode: "lst-active"
  unbondingDays: number | null
  redemptionExists: boolean
  // stableBuffer: stableExitLiquidityUsd / marketCapUsd
  stableExitValue: number | null
  marketCapUsd: number | null
}

export type PegStabilityPreLstInput = {
  mode: "pre-lst"
  defiTvlUsd: number | null
  marketCapUsd: number | null
  stakingRatioPct: number | null
}

export type PegStabilityInput = PegStabilityActiveLstInput | PegStabilityPreLstInput

// ─── DeFi Moneyness ──────────────────────────────────────────────────────────

export type DefiMoneynessActiveLstInput = {
  mode: "lst-active"
  lstCollateralEnabled: boolean
  lstPenetrationPct: number | null  // for collateralIntegration when enabled
  lstTvlUsd: number | null
  defiTvlUsd: number | null
  marketCapUsd: number | null
}

export type DefiMoneynessPreLstInput = {
  mode: "pre-lst"
  defiTvlUsd: number | null
  marketCapUsd: number | null
  lendingPresence: boolean
}

export type DefiMoneynessInput = DefiMoneynessActiveLstInput | DefiMoneynessPreLstInput

// ─── Security & Governance ───────────────────────────────────────────────────

export type SecurityGovernanceActiveLstInput = {
  mode: "lst-active"
  auditCount: number | null
  hasTimelock: boolean | null
  lstPenetrationPct: number | null  // protocol maturity proxy
}

export type SecurityGovernancePreLstInput = {
  mode: "pre-lst"
  marketCapUsd: number | null
  validatorCount: number | null
}

export type SecurityGovernanceInput = SecurityGovernanceActiveLstInput | SecurityGovernancePreLstInput

// ─── Validator Decentralization ──────────────────────────────────────────────

// Same formula for both modes — measures the base chain
export type ValidatorDecentralizationInput = {
  validatorCount: number | null
  verifiedProviders: number | null
  benchmarkCommissionPct: number | null
}

// ─── Incentive Sustainability ────────────────────────────────────────────────

export type IncentiveSustainabilityActiveLstInput = {
  mode: "lst-active"
  stakingApyPct: number | null
  inflationRatePct: number | null
  lstPenetrationPct: number | null
  lstCollateralEnabled: boolean
  lendingPresence: boolean
}

export type IncentiveSustainabilityPreLstInput = {
  mode: "pre-lst"
  stakingApyPct: number | null
  inflationRatePct: number | null
  stakingRatioPct: number | null
}

export type IncentiveSustainabilityInput =
  | IncentiveSustainabilityActiveLstInput
  | IncentiveSustainabilityPreLstInput
