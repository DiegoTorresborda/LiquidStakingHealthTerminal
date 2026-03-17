// Scoring v2 — All module engines

import { usdScore, linScale, logScale, execScore } from "./normalizers"
import type {
  LiquidityExitInput,
  PegStabilityInput,
  DefiMoneynessInput,
  SecurityGovernanceInput,
  ValidatorDecentralizationInput,
  IncentiveSustainabilityInput,
  ModuleScoreResult
} from "./types"

// ─── Redemption anchor scoring ───────────────────────────────────────────────

function scoreRedemption(exists: boolean, unbondingDays: number | null): number {
  if (!exists) return 0
  if (unbondingDays === null) return 50 // exists but days unknown
  if (unbondingDays <= 2) return 100
  if (unbondingDays <= 7) return 80
  if (unbondingDays <= 21) return 60
  return 35
}

// ─── Mode A: Pre-LST ─────────────────────────────────────────────────────────

function scorePreLst(
  input: Extract<LiquidityExitInput, { mode: "pre-lst" }>
): ModuleScoreResult {
  const mc = input.marketCapUsd

  const baseScore = usdScore(
    input.baseExitValue ?? 0,
    mc,
    0.005, // rel floor: 0.5% of market cap
    0.10   // rel ceiling: 10% of market cap
  )

  const stableScore = usdScore(
    input.stableExitValue ?? 0,
    mc,
    0.003, // rel floor: 0.3%
    0.05   // rel ceiling: 5%
  )

  const stakingScore = linScale(input.stakingRatioPct ?? 0, 5, 60)

  // LST readiness: 0 in pre-lst mode (no LST exists yet)
  const lstReadiness = 0

  const rawScore = Math.round(
    baseScore * 0.35 + stableScore * 0.35 + stakingScore * 0.15 + lstReadiness * 0.15
  )

  const CAP = 45
  const capApplied =
    !input.stableExitExists && rawScore > CAP
      ? { reason: "Sin ruta stable documentada", value: CAP }
      : null

  return {
    module: "Liquidity & Exit",
    mode: "pre-lst",
    rawScore,
    finalScore: capApplied ? CAP : rawScore,
    capApplied,
    breakdown: {
      baseExitDepth: {
        score: Math.round(baseScore),
        rawValue: input.baseExitValue,
        source: input.baseExitSource
      },
      stableExitDepth: {
        score: Math.round(stableScore),
        rawValue: input.stableExitValue,
        source: input.stableExitSource
      },
      stakingAdoption: {
        score: Math.round(stakingScore),
        rawValue: input.stakingRatioPct,
        source: "primary"
      },
      lstReadiness: {
        score: lstReadiness,
        rawValue: null,
        source: "primary" as const,
        note: "No LST protocol exists"
      }
    }
  }
}

// ─── Mode B: LST Active ───────────────────────────────────────────────────────

function scoreActiveLst(
  input: Extract<LiquidityExitInput, { mode: "lst-active" }>
): ModuleScoreResult {
  const mc = input.marketCapUsd

  // lstLiquidity: no proxy — null data scores as 0
  const lstScore = usdScore(
    input.lstDexLiquidityUsd ?? 0,
    input.lstTvlUsd,
    0.02,  // rel floor: 2% of LST TVL
    0.20   // rel ceiling: 20% of LST TVL
  )

  const stableScore = usdScore(
    input.stableExitValue ?? 0,
    mc,
    0.003,
    0.05
  )

  const redemptionScore = scoreRedemption(input.redemptionExists, input.unbondingDays)

  const rawScore = Math.round(lstScore * 0.45 + stableScore * 0.35 + redemptionScore * 0.20)

  // Apply lowest active cap
  const caps = [
    !input.stableExitExists && { reason: "Sin ruta stable", value: 55 },
    !input.redemptionExists && { reason: "Sin redención nativa", value: 60 }
  ].filter(Boolean) as { reason: string; value: number }[]

  const capApplied = caps.filter((c) => c.value < rawScore).sort((a, b) => a.value - b.value)[0] ?? null

  const unbondingNote = input.redemptionExists
    ? input.unbondingDays != null
      ? `${input.unbondingDays} días`
      : "días desconocidos"
    : "no existe"

  return {
    module: "Liquidity & Exit",
    mode: "lst-active",
    rawScore,
    finalScore: capApplied ? capApplied.value : rawScore,
    capApplied,
    breakdown: {
      lstLiquidity: {
        score: Math.round(lstScore),
        rawValue: input.lstDexLiquidityUsd,
        source: input.lstDexSource,
        note: input.lstDexLiquidityUsd == null ? "sin dato — scored as 0" : undefined
      },
      stableExit: {
        score: Math.round(stableScore),
        rawValue: input.stableExitValue,
        source: input.stableExitSource
      },
      redemptionAnchor: {
        score: Math.round(redemptionScore),
        rawValue: input.unbondingDays,
        source: input.redemptionExists ? "primary" : "missing",
        note: unbondingNote
      }
    }
  }
}

// ─── Public API: Liquidity & Exit ─────────────────────────────────────────────

export function scoreLiquidityExit(input: LiquidityExitInput): ModuleScoreResult {
  if (input.mode === "pre-lst") return scorePreLst(input)
  return scoreActiveLst(input)
}

// ═══════════════════════════════════════════════════════════════════════════════
// PEG STABILITY
// ═══════════════════════════════════════════════════════════════════════════════

export function scorePegStability(input: PegStabilityInput): ModuleScoreResult {
  if (input.mode === "pre-lst") {
    // Peg Stability is not meaningful without an LST — the module is excluded from
    // the global score in pre-LST mode. UI renders it greyed-out as "N/A".
    return {
      module: "Peg Stability", mode: "pre-lst",
      rawScore: 0, finalScore: 0, capApplied: null,
      excluded: true,
      breakdown: {}
    }
  }

  const redemptionScore = scoreRedemption(input.redemptionExists, input.unbondingDays)
  const stableRatio =
    input.stableExitValue != null && input.marketCapUsd
      ? input.stableExitValue / input.marketCapUsd
      : 0
  const bufferScore = logScale(stableRatio, 0.003, 0.05)
  const rawScore = Math.round(redemptionScore * 0.60 + bufferScore * 0.40)

  const CAP = 50
  const capApplied = !input.redemptionExists && rawScore > CAP
    ? { reason: "Sin redención nativa", value: CAP }
    : null

  return {
    module: "Peg Stability", mode: "lst-active",
    rawScore, finalScore: capApplied ? CAP : rawScore, capApplied,
    breakdown: {
      redemptionAnchor: {
        score: Math.round(redemptionScore),
        rawValue: input.unbondingDays,
        source: input.redemptionExists ? "primary" : "missing",
        note: input.unbondingDays != null ? `${input.unbondingDays} días` : undefined
      },
      stableBuffer: { score: Math.round(bufferScore), rawValue: input.stableExitValue, source: "primary" }
    }
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// DEFI MONEYNESS
// ═══════════════════════════════════════════════════════════════════════════════

export function scoreDefiMoneyness(input: DefiMoneynessInput): ModuleScoreResult {
  if (input.mode === "pre-lst") {
    const defiScore = logScale(
      input.defiTvlUsd != null && input.marketCapUsd
        ? input.defiTvlUsd / input.marketCapUsd
        : 0,
      0.02, 0.30
    )
    const lendingScore = input.lendingPresence ? 80 : 20
    const lstReadiness = 0
    const rawScore = Math.round(defiScore * 0.50 + lendingScore * 0.35 + lstReadiness * 0.15)
    return {
      module: "DeFi Moneyness", mode: "pre-lst",
      rawScore, finalScore: rawScore, capApplied: null,
      breakdown: {
        defiEcosystem: { score: Math.round(defiScore), rawValue: input.defiTvlUsd, source: "primary" },
        lendingInfrastructure: { score: lendingScore, rawValue: input.lendingPresence ? 1 : 0, source: "primary" },
        lstReadiness: { score: lstReadiness, rawValue: null, source: "primary" as const, note: "No LST protocol exists" }
      }
    }
  }

  // collateralIntegration: 0 if not used as collateral; else scale by lstPenetration
  const collateralScore = !input.lstCollateralEnabled
    ? 0
    : logScale(input.lstPenetrationPct ?? 0, 0.005, 0.15)

  // defiDepth: lstTvlUsd / defiTvlUsd
  const defiDepthScore =
    input.lstTvlUsd != null && input.defiTvlUsd
      ? logScale(input.lstTvlUsd / input.defiTvlUsd, 0.005, 0.10)
      : 0

  // ecosystemBreadth: defiTvlUsd / marketCapUsd
  const breadthScore = logScale(
    input.defiTvlUsd != null && input.marketCapUsd
      ? input.defiTvlUsd / input.marketCapUsd
      : 0,
    0.02, 0.30
  )

  const rawScore = Math.round(collateralScore * 0.45 + defiDepthScore * 0.35 + breadthScore * 0.20)

  const CAP = 55
  const capApplied = !input.lstCollateralEnabled && rawScore > CAP
    ? { reason: "LST no usado como colateral", value: CAP }
    : null

  return {
    module: "DeFi Moneyness", mode: "lst-active",
    rawScore, finalScore: capApplied ? CAP : rawScore, capApplied,
    breakdown: {
      collateralIntegration: { score: Math.round(collateralScore), rawValue: input.lstPenetrationPct, source: "primary" },
      defiDepth: { score: Math.round(defiDepthScore), rawValue: input.lstTvlUsd, source: "primary" },
      ecosystemBreadth: { score: Math.round(breadthScore), rawValue: input.defiTvlUsd, source: "primary" }
    }
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECURITY & GOVERNANCE
// ═══════════════════════════════════════════════════════════════════════════════

export function scoreSecurityGovernance(input: SecurityGovernanceInput): ModuleScoreResult {
  if (input.mode === "pre-lst") {
    const econScore = logScale(input.marketCapUsd ?? 0, 50_000_000, 5_000_000_000)
    const decentScore = logScale(input.validatorCount ?? 0, 15, 200)
    const rawScore = Math.round(econScore * 0.50 + decentScore * 0.50)
    return {
      module: "Security & Governance", mode: "pre-lst",
      rawScore, finalScore: rawScore, capApplied: null,
      breakdown: {
        economicSecurity: { score: Math.round(econScore), rawValue: input.marketCapUsd, source: "primary" },
        decentralization: { score: Math.round(decentScore), rawValue: input.validatorCount, source: "primary" }
      }
    }
  }

  // null = unknown (not verified) → neutral 30; 0 = confirmed no audits → 0
  const auditScore = input.auditCount == null ? 30 : linScale(input.auditCount, 0, 3)
  const timelockScore = input.hasTimelock === null ? 40 : input.hasTimelock ? 80 : 10
  const maturityScore = logScale(input.lstPenetrationPct ?? 0, 0.001, 0.15)

  const rawScore = Math.round(auditScore * 0.40 + timelockScore * 0.35 + maturityScore * 0.25)

  const caps = [
    (input.auditCount ?? 0) === 0 && { reason: "Sin auditorías", value: 50 },
    input.hasTimelock === false && { reason: "Sin timelock", value: 55 }
  ].filter(Boolean) as { reason: string; value: number }[]

  const capApplied = caps.filter((c) => c.value < rawScore).sort((a, b) => a.value - b.value)[0] ?? null

  return {
    module: "Security & Governance", mode: "lst-active",
    rawScore, finalScore: capApplied ? capApplied.value : rawScore, capApplied,
    breakdown: {
      auditPosture: {
        score: Math.round(auditScore), rawValue: input.auditCount,
        source: input.auditCount != null ? "primary" : "missing"
      },
      governanceControls: {
        score: timelockScore, rawValue: input.hasTimelock ? 1 : 0,
        source: input.hasTimelock != null ? "primary" : "missing"
      },
      protocolMaturity: { score: Math.round(maturityScore), rawValue: input.lstPenetrationPct, source: "primary" }
    }
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// VALIDATOR DECENTRALIZATION  (same formula for both modes)
// ═══════════════════════════════════════════════════════════════════════════════

export function scoreValidatorDecentralization(input: ValidatorDecentralizationInput): ModuleScoreResult {
  const breadthScore = logScale(input.validatorCount ?? 0, 15, 200)

  const qualityRatio =
    input.verifiedProviders != null && input.validatorCount
      ? input.verifiedProviders / input.validatorCount
      : null
  const qualityScore = qualityRatio != null ? linScale(qualityRatio, 0.05, 0.40) : 0

  // Lower commission = more competitive market
  const compScore = input.benchmarkCommissionPct != null
    ? linScale(100 - input.benchmarkCommissionPct, 70, 100)
    : 50 // neutral fallback

  const rawScore = Math.round(breadthScore * 0.40 + qualityScore * 0.35 + compScore * 0.25)

  const CAP = 40
  const capApplied = (input.validatorCount ?? 999) < 20 && rawScore > CAP
    ? { reason: "Concentración extrema de validadores", value: CAP }
    : null

  return {
    module: "Validator Decentralization", mode: "base-chain",
    rawScore, finalScore: capApplied ? CAP : rawScore, capApplied,
    breakdown: {
      validatorBreadth: { score: Math.round(breadthScore), rawValue: input.validatorCount, source: "primary" },
      operatorQuality: {
        score: Math.round(qualityScore), rawValue: input.verifiedProviders,
        source: qualityRatio != null ? "primary" : "missing"
      },
      marketCompetitiveness: {
        score: Math.round(compScore), rawValue: input.benchmarkCommissionPct,
        source: input.benchmarkCommissionPct != null ? "primary" : "missing"
      }
    }
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// INCENTIVE SUSTAINABILITY
// ═══════════════════════════════════════════════════════════════════════════════

export function scoreIncentiveSustainability(input: IncentiveSustainabilityInput): ModuleScoreResult {
  const realYield =
    input.stakingApyPct != null && input.inflationRatePct != null
      ? input.stakingApyPct - input.inflationRatePct
      : null
  const yieldScore = realYield != null ? linScale(realYield, -2, 8) : 50

  if (input.mode === "pre-lst") {
    const stakingScore = linScale(input.stakingRatioPct ?? 0, 5, 60)
    const rawScore = Math.round(yieldScore * 0.50 + stakingScore * 0.50)
    return {
      module: "Incentive Sustainability", mode: "pre-lst",
      rawScore, finalScore: rawScore, capApplied: null,
      breakdown: {
        yieldAttractiveness: { score: Math.round(yieldScore), rawValue: realYield, source: "primary" },
        stakingDepth: { score: Math.round(stakingScore), rawValue: input.stakingRatioPct, source: "primary" }
      }
    }
  }

  const adoptionScore = logScale(input.lstPenetrationPct ?? 0, 0.001, 0.15)

  const both = input.lstCollateralEnabled && input.lendingPresence
  const neither = !input.lstCollateralEnabled && !input.lendingPresence
  const demandScore = both ? 80 : neither ? 20 : 50

  const rawScore = Math.round(yieldScore * 0.40 + adoptionScore * 0.35 + demandScore * 0.25)

  const CAP = 45
  const capApplied = (realYield != null && realYield < 0) && neither && rawScore > CAP
    ? { reason: "Yield negativo sin demanda estructural", value: CAP }
    : null

  return {
    module: "Incentive Sustainability", mode: "lst-active",
    rawScore, finalScore: capApplied ? CAP : rawScore, capApplied,
    breakdown: {
      realYieldQuality: {
        score: Math.round(yieldScore), rawValue: realYield,
        source: realYield != null ? "primary" : "missing"
      },
      adoptionDepth: { score: Math.round(adoptionScore), rawValue: input.lstPenetrationPct, source: "primary" },
      structuralDemand: { score: demandScore, rawValue: null, source: "primary",
        note: both ? "collateral + lending" : neither ? "ninguno" : "uno de dos"
      }
    }
  }
}
