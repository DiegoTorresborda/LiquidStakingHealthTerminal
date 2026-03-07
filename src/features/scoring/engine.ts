import type { ModuleName } from "@/config/scoring";

import type {
  LstHealthScoringInput,
  LstHealthScoringResult,
  ScoreBreakdown,
  ScoreCap,
  ScorePenalty
} from "@/features/scoring/types";

function clampScore(value: number): number {
  return Math.max(0, Math.min(100, value));
}

function roundScore(value: number): number {
  return Math.round(clampScore(value));
}

function weighted(scores: Array<{ score: number; weight: number }>): number {
  return scores.reduce((sum, item) => sum + item.score * item.weight, 0);
}

function finalizeScore(raw: number, penalties: ScorePenalty[] = [], caps: ScoreCap[] = []): ScoreBreakdown {
  const rawScore = roundScore(raw);
  const penaltyPoints = penalties.reduce((sum, penalty) => sum + penalty.points, 0);
  const scoreAfterPenalties = roundScore(rawScore - penaltyPoints);

  const sortedCaps = [...caps].sort((a, b) => a.value - b.value);
  const capApplied = sortedCaps.find((cap) => cap.value < scoreAfterPenalties);
  const cappedScore = capApplied ? roundScore(capApplied.value) : scoreAfterPenalties;

  return {
    rawScore,
    penaltyPoints,
    scoreAfterPenalties,
    cappedScore,
    finalScore: cappedScore,
    penalties,
    capsConsidered: sortedCaps,
    capApplied
  };
}

function moduleResult(moduleName: ModuleName, input: LstHealthScoringInput): ScoreBreakdown {
  if (moduleName === "Liquidity & Exit") {
    const lstMarketDepth = weighted([
      { score: input.liquidityExit.lstMarketDepth.poolDepth, weight: 0.35 },
      { score: input.liquidityExit.lstMarketDepth.slippageQuality, weight: 0.3 },
      { score: input.liquidityExit.lstMarketDepth.volumeQuality, weight: 0.2 },
      { score: input.liquidityExit.lstMarketDepth.lpDiversification, weight: 0.15 }
    ]);

    const baseExitQuality = weighted([
      { score: input.liquidityExit.baseExitQuality.lstBaseSlippage, weight: 0.5 },
      { score: input.liquidityExit.baseExitQuality.lstBaseDepth, weight: 0.3 },
      { score: input.liquidityExit.baseExitQuality.routeRedundancy, weight: 0.2 }
    ]);

    const stableExitQuality = weighted([
      { score: input.liquidityExit.stableExitQuality.baseStableDepth, weight: 0.35 },
      { score: input.liquidityExit.stableExitQuality.exitSlippage, weight: 0.35 },
      { score: input.liquidityExit.stableExitQuality.stablecoinQuality, weight: 0.2 },
      { score: input.liquidityExit.stableExitQuality.routeRedundancy, weight: 0.1 }
    ]);

    const redemptionAnchor = weighted([
      { score: input.liquidityExit.redemptionAnchor.redemptionAvailability, weight: 0.35 },
      { score: input.liquidityExit.redemptionAnchor.queueTransparency, weight: 0.25 },
      { score: input.liquidityExit.redemptionAnchor.redemptionFriction, weight: 0.2 },
      { score: input.liquidityExit.redemptionAnchor.arbitrageViability, weight: 0.2 }
    ]);

    const liquidityDurability = weighted([
      { score: input.liquidityExit.liquidityDurability.incentiveDependence, weight: 0.4 },
      { score: input.liquidityExit.liquidityDurability.tvlPersistence, weight: 0.3 },
      { score: input.liquidityExit.liquidityDurability.organicVolumeQuality, weight: 0.2 },
      { score: input.liquidityExit.liquidityDurability.lpStability, weight: 0.1 }
    ]);

    const raw = weighted([
      { score: lstMarketDepth, weight: 0.3 },
      { score: baseExitQuality, weight: 0.2 },
      { score: stableExitQuality, weight: 0.25 },
      { score: redemptionAnchor, weight: 0.15 },
      { score: liquidityDurability, weight: 0.1 }
    ]);

    const penalties: ScorePenalty[] = [];
    if (input.liquidityExit.extremeLpConcentrationPenalty) {
      penalties.push({
        reason: "Extreme LP concentration",
        points: input.liquidityExit.extremeLpConcentrationPenalty
      });
    }

    const caps: ScoreCap[] = [];
    if (!input.liquidityExit.stablecoinExitExists) {
      caps.push({
        reason: "No stablecoin exit route",
        value: 55
      });
    }
    if (!input.liquidityExit.redemptionPathExists) {
      caps.push({
        reason: "No redemption path",
        value: 60
      });
    }

    return finalizeScore(raw, penalties, caps);
  }

  if (moduleName === "Peg Stability") {
    const arbitrageEfficiency = weighted([
      { score: input.pegStability.arbitrageEfficiency.redemptionAvailability, weight: 0.4 },
      { score: input.pegStability.arbitrageEfficiency.redemptionFriction, weight: 0.3 },
      { score: input.pegStability.arbitrageEfficiency.arbitrageCapacity, weight: 0.3 }
    ]);

    const raw = weighted([
      { score: input.pegStability.discountLevel, weight: 0.35 },
      { score: input.pegStability.discountVolatility, weight: 0.25 },
      { score: arbitrageEfficiency, weight: 0.2 },
      { score: input.pegStability.pegRecovery, weight: 0.2 }
    ]);

    const penalties: ScorePenalty[] = [];
    if (input.pegStability.extremeVolatilityPenalty) {
      penalties.push({
        reason: "Extreme discount volatility",
        points: input.pegStability.extremeVolatilityPenalty
      });
    }

    const caps: ScoreCap[] = [];
    if (!input.pegStability.redemptionPathExists) {
      caps.push({
        reason: "No redemption path",
        value: 55
      });
    }
    if (input.pegStability.persistentLargeDiscount) {
      caps.push({
        reason: "Persistent large discount",
        value: 45
      });
    }

    return finalizeScore(raw, penalties, caps);
  }

  if (moduleName === "Stress Resilience") {
    const liquidityShockResistance = weighted([
      { score: input.stressResilience.liquidityShockResistance.lpDiversification, weight: 0.4 },
      { score: input.stressResilience.liquidityShockResistance.poolDepth, weight: 0.35 },
      { score: input.stressResilience.liquidityShockResistance.venueDiversity, weight: 0.25 }
    ]);

    const redemptionCapacity = weighted([
      { score: input.stressResilience.redemptionCapacity.queueThroughput, weight: 0.4 },
      { score: input.stressResilience.redemptionCapacity.redemptionTransparency, weight: 0.3 },
      { score: input.stressResilience.redemptionCapacity.unbondingDuration, weight: 0.3 }
    ]);

    const stableExitCapacity = weighted([
      { score: input.stressResilience.stableExitCapacity.baseStableDepth, weight: 0.4 },
      { score: input.stressResilience.stableExitCapacity.exitSlippage, weight: 0.3 },
      { score: input.stressResilience.stableExitCapacity.stablecoinDiversity, weight: 0.2 },
      { score: input.stressResilience.stableExitCapacity.stablecoinQuality, weight: 0.1 }
    ]);

    const defiContagionRisk = weighted([
      { score: input.stressResilience.defiContagionRisk.lendingRiskDesign, weight: 0.4 },
      { score: input.stressResilience.defiContagionRisk.oracleRobustness, weight: 0.3 },
      { score: input.stressResilience.defiContagionRisk.leverageExposure, weight: 0.3 }
    ]);

    const raw = weighted([
      { score: liquidityShockResistance, weight: 0.3 },
      { score: redemptionCapacity, weight: 0.25 },
      { score: stableExitCapacity, weight: 0.25 },
      { score: defiContagionRisk, weight: 0.2 }
    ]);

    const caps: ScoreCap[] = [];
    if (input.stressResilience.redemptionUnavailable) {
      caps.push({
        reason: "Redemption unavailable",
        value: 50
      });
    }

    return finalizeScore(raw, [], caps);
  }

  if (moduleName === "DeFi Moneyness") {
    const raw = weighted([
      { score: input.defiMoneyness.collateralUtility, weight: 0.4 },
      { score: input.defiMoneyness.defiIntegrationBreadth, weight: 0.25 },
      { score: input.defiMoneyness.usageDepth, weight: 0.2 },
      { score: input.defiMoneyness.demandQuality, weight: 0.15 }
    ]);

    const caps: ScoreCap[] = [];
    if (!input.defiMoneyness.lstUsedAsCollateral) {
      caps.push({
        reason: "LST not used as collateral",
        value: 55
      });
    }

    return finalizeScore(raw, [], caps);
  }

  if (moduleName === "Security & Governance") {
    const raw = weighted([
      { score: input.securityGovernance.auditPosture, weight: 0.3 },
      { score: input.securityGovernance.adminControlQuality, weight: 0.3 },
      { score: input.securityGovernance.upgradeSafety, weight: 0.2 },
      { score: input.securityGovernance.operationalTransparency, weight: 0.2 }
    ]);

    const caps: ScoreCap[] = [];
    if (input.securityGovernance.noAudits) {
      caps.push({
        reason: "No audits",
        value: 50
      });
    }
    if (input.securityGovernance.noTimelockUpgrades) {
      caps.push({
        reason: "No timelock upgrades",
        value: 55
      });
    }

    return finalizeScore(raw, [], caps);
  }

  if (moduleName === "Validator Decentralization") {
    const raw = weighted([
      { score: input.validatorDecentralization.delegationDistribution, weight: 0.35 },
      { score: input.validatorDecentralization.validatorSetBreadth, weight: 0.25 },
      { score: input.validatorDecentralization.operatorQuality, weight: 0.2 },
      { score: input.validatorDecentralization.slashingRiskManagement, weight: 0.2 }
    ]);

    const caps: ScoreCap[] = [];
    if (input.validatorDecentralization.extremeConcentration) {
      caps.push({
        reason: "Extreme validator concentration",
        value: 55
      });
    }

    return finalizeScore(raw, [], caps);
  }

  const raw = weighted([
    { score: input.incentiveSustainability.yieldQuality, weight: 0.35 },
    { score: input.incentiveSustainability.liquidityDurability, weight: 0.3 },
    { score: input.incentiveSustainability.usagePersistence, weight: 0.2 },
    { score: input.incentiveSustainability.revenueSupport, weight: 0.15 }
  ]);

  const caps: ScoreCap[] = [];
  if (input.incentiveSustainability.emissionsDominate) {
    caps.push({
      reason: "Emissions dominate ecosystem attractiveness",
      value: 55
    });
  }

  return finalizeScore(raw, [], caps);
}

export function computeLstHealthScore(input: LstHealthScoringInput): LstHealthScoringResult {
  const moduleScores: Record<ModuleName, ScoreBreakdown> = {
    "Liquidity & Exit": moduleResult("Liquidity & Exit", input),
    "Peg Stability": moduleResult("Peg Stability", input),
    "DeFi Moneyness": moduleResult("DeFi Moneyness", input),
    "Security & Governance": moduleResult("Security & Governance", input),
    "Validator Decentralization": moduleResult("Validator Decentralization", input),
    "Incentive Sustainability": moduleResult("Incentive Sustainability", input),
    "Stress Resilience": moduleResult("Stress Resilience", input)
  };

  const pillarScores = {
    exitability: roundScore(
      weighted([
        { score: moduleScores["Liquidity & Exit"].finalScore, weight: 0.5 },
        { score: moduleScores["Peg Stability"].finalScore, weight: 0.3 },
        { score: moduleScores["Stress Resilience"].finalScore, weight: 0.2 }
      ])
    ),
    moneyness: roundScore(moduleScores["DeFi Moneyness"].finalScore),
    credibility: roundScore(
      weighted([
        { score: moduleScores["Security & Governance"].finalScore, weight: 0.4 },
        { score: moduleScores["Validator Decentralization"].finalScore, weight: 0.3 },
        { score: moduleScores["Incentive Sustainability"].finalScore, weight: 0.3 }
      ])
    )
  };

  const globalRaw = weighted([
    { score: pillarScores.exitability, weight: 0.45 },
    { score: pillarScores.moneyness, weight: 0.3 },
    { score: pillarScores.credibility, weight: 0.25 }
  ]);

  const globalCaps: ScoreCap[] = [];
  if (pillarScores.exitability < 50) {
    globalCaps.push({
      reason: "Exitability below 50",
      value: 60
    });
  }
  if (moduleScores["Peg Stability"].finalScore < 45) {
    globalCaps.push({
      reason: "Peg Stability below 45",
      value: 55
    });
  }
  if (moduleScores["Security & Governance"].finalScore < 50) {
    globalCaps.push({
      reason: "Security & Governance below 50",
      value: 60
    });
  }

  const globalScore = finalizeScore(globalRaw, [], globalCaps);

  return {
    modelVersion: "v1",
    moduleScores,
    pillarScores,
    globalScore
  };
}
