// Scoring v2 — Input builder for Liquidity & Exit
// Maps a RadarOverviewRecord to a typed LiquidityExitInput,
// resolving source priority and mode detection.

import type { RadarOverviewRecord } from "@/data/radar-overview-schema"
import type {
  DataSource,
  LiquidityExitInput,
  PegStabilityInput,
  DefiMoneynessInput,
  SecurityGovernanceInput,
  ValidatorDecentralizationInput,
  IncentiveSustainabilityInput
} from "./types"

// ─── Mode detection ───────────────────────────────────────────────────────────

/**
 * Primary signal: explicit hasLst field (manual, authoritative).
 * Fallback: lstProtocols >= 1 AND lstTvlUsd > $100k (inferred).
 */
function detectMode(network: RadarOverviewRecord): "pre-lst" | "lst-active" {
  if (network.hasLst != null) {
    return network.hasLst ? "lst-active" : "pre-lst"
  }
  const hasProtocol = (network.lstProtocols ?? 0) >= 1
  const hasTvl = (network.lstTvlUsd ?? 0) > 100_000
  return hasProtocol && hasTvl ? "lst-active" : "pre-lst"
}

// ─── Shared resolution helpers ────────────────────────────────────────────────

/**
 * Stable exit depth:
 *   primary  → stableExitLiquidityUsd  (DEXScreener best/sum pair)
 *   proxy    → stablecoinLiquidityUsd × 0.05  (chain stables, heavy discount)
 *   missing  → null
 */
function resolveStableExit(network: RadarOverviewRecord): {
  value: number | null
  source: DataSource
} {
  if (network.stableExitLiquidityUsd != null) {
    return { value: network.stableExitLiquidityUsd, source: "primary" }
  }
  if (network.stablecoinLiquidityUsd != null) {
    return { value: network.stablecoinLiquidityUsd * 0.05, source: "proxy" }
  }
  return { value: null, source: "missing" }
}

function resolveStableExitExists(
  network: RadarOverviewRecord,
  stableExitValue: number | null
): boolean {
  if (network.stableExitRouteExists != null) return network.stableExitRouteExists
  return stableExitValue != null && stableExitValue > 500_000
}

// ─── Pre-LST builder ──────────────────────────────────────────────────────────

function buildPreLst(
  network: RadarOverviewRecord
): Extract<LiquidityExitInput, { mode: "pre-lst" }> {
  // Base exit depth:
  //   primary → baseTokenDexLiquidityUsd  (DEXScreener aggregated)
  //   proxy   → volume24hUsd  (CoinGecko total — CEX+DEX, what matters is exit capacity)
  let baseExitValue: number | null
  let baseExitSource: DataSource

  if (network.baseTokenDexLiquidityUsd != null) {
    baseExitValue = network.baseTokenDexLiquidityUsd
    baseExitSource = "primary"
  } else if (network.volume24hUsd != null) {
    baseExitValue = network.volume24hUsd
    baseExitSource = "proxy"
  } else {
    baseExitValue = null
    baseExitSource = "missing"
  }

  const { value: stableExitValue, source: stableExitSource } = resolveStableExit(network)
  const stableExitExists = resolveStableExitExists(network, stableExitValue)

  return {
    mode: "pre-lst",
    baseExitValue,
    baseExitSource,
    stableExitValue,
    stableExitSource,
    stakingRatioPct: network.stakingRatioPct,
    marketCapUsd: network.marketCapUsd,
    stableExitExists
  }
}

// ─── LST Active builder ───────────────────────────────────────────────────────

function buildActiveLst(
  network: RadarOverviewRecord
): Extract<LiquidityExitInput, { mode: "lst-active" }> {
  // LST liquidity: primary only, no proxy — missing data scores as 0
  const lstDexLiquidityUsd = network.lstDexLiquidityUsd ?? null
  const lstDexSource: DataSource = lstDexLiquidityUsd != null ? "primary" : "missing"

  const { value: stableExitValue, source: stableExitSource } = resolveStableExit(network)
  const stableExitExists = resolveStableExitExists(network, stableExitValue)

  // Redemption: hasLst=true implies protocol exists; unbondingDays now in dataset
  const redemptionExists = network.hasLst ?? (network.lstProtocols ?? 0) >= 1

  return {
    mode: "lst-active",
    lstDexLiquidityUsd,
    lstDexSource,
    lstTvlUsd: network.lstTvlUsd,
    stableExitValue,
    stableExitSource,
    marketCapUsd: network.marketCapUsd,
    redemptionExists,
    unbondingDays: network.unbondingDays ?? null,
    stableExitExists
  }
}

// ─── Public API: Liquidity & Exit ────────────────────────────────────────────

export function buildLiquidityExitInput(network: RadarOverviewRecord): LiquidityExitInput {
  const mode = detectMode(network)
  return mode === "pre-lst" ? buildPreLst(network) : buildActiveLst(network)
}

// ─── Peg Stability ────────────────────────────────────────────────────────────

export function buildPegStabilityInput(network: RadarOverviewRecord): PegStabilityInput {
  const mode = detectMode(network)
  if (mode === "pre-lst") {
    return {
      mode: "pre-lst",
      defiTvlUsd: network.defiTvlUsd,
      marketCapUsd: network.marketCapUsd,
      stakingRatioPct: network.stakingRatioPct
    }
  }
  const { value: stableExitValue } = resolveStableExit(network)
  return {
    mode: "lst-active",
    unbondingDays: network.unbondingDays ?? null,
    redemptionExists: network.hasLst ?? (network.lstProtocols ?? 0) >= 1,
    stableExitValue,
    marketCapUsd: network.marketCapUsd
  }
}

// ─── DeFi Moneyness ──────────────────────────────────────────────────────────

export function buildDefiMoneynessInput(network: RadarOverviewRecord): DefiMoneynessInput {
  const mode = detectMode(network)
  if (mode === "pre-lst") {
    return {
      mode: "pre-lst",
      defiTvlUsd: network.defiTvlUsd,
      marketCapUsd: network.marketCapUsd,
      lendingPresence: network.lendingPresence ?? false
    }
  }
  return {
    mode: "lst-active",
    lstCollateralEnabled: network.lstCollateralEnabled ?? false,
    lstPenetrationPct: network.lstPenetrationPct,
    lstTvlUsd: network.lstTvlUsd,
    defiTvlUsd: network.defiTvlUsd,
    marketCapUsd: network.marketCapUsd
  }
}

// ─── Security & Governance ───────────────────────────────────────────────────

export function buildSecurityGovernanceInput(network: RadarOverviewRecord): SecurityGovernanceInput {
  const mode = detectMode(network)
  if (mode === "pre-lst") {
    return {
      mode: "pre-lst",
      marketCapUsd: network.marketCapUsd,
      validatorCount: network.validatorCount
    }
  }
  return {
    mode: "lst-active",
    auditCount: network.auditCount ?? null,
    hasTimelock: network.hasTimelock ?? null,
    lstPenetrationPct: network.lstPenetrationPct
  }
}

// ─── Validator Decentralization ──────────────────────────────────────────────

export function buildValidatorDecentralizationInput(
  network: RadarOverviewRecord
): ValidatorDecentralizationInput {
  return {
    validatorCount: network.validatorCount,
    verifiedProviders: network.verifiedProviders,
    benchmarkCommissionPct: network.benchmarkCommissionPct
  }
}

// ─── Incentive Sustainability ─────────────────────────────────────────────────

export function buildIncentiveSustainabilityInput(
  network: RadarOverviewRecord
): IncentiveSustainabilityInput {
  const mode = detectMode(network)
  if (mode === "pre-lst") {
    return {
      mode: "pre-lst",
      stakingApyPct: network.stakingApyPct,
      inflationRatePct: network.inflationRatePct,
      stakingRatioPct: network.stakingRatioPct
    }
  }
  return {
    mode: "lst-active",
    stakingApyPct: network.stakingApyPct,
    inflationRatePct: network.inflationRatePct,
    lstPenetrationPct: network.lstPenetrationPct,
    lstCollateralEnabled: network.lstCollateralEnabled ?? false,
    lendingPresence: network.lendingPresence ?? false
  }
}
