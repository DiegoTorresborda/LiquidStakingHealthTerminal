import type { ModuleName } from "@/config/scoring";
import type { Network } from "@data/networks";

import { computeLstHealthScore } from "@/features/scoring/engine";
import type { LstHealthScoringInput, LstHealthScoringResult } from "@/features/scoring/types";

type ModuleBaselines = Record<ModuleName, number>;
type LpAttractiveness = "Strong" | "Medium" | "Cautious" | "Opportunistic";

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function scale(value: number, min: number, max: number): number {
  if (max <= min) return 0;
  const normalized = (value - min) / (max - min);
  return clamp(normalized * 100, 0, 100);
}

function toRange(value: number, minIn: number, maxIn: number, minOut: number, maxOut: number): number {
  const normalized = scale(value, minIn, maxIn) / 100;
  return minOut + normalized * (maxOut - minOut);
}

function deriveModuleBaselines(network: Network): ModuleBaselines {
  const base = network.globalLstHealthScore;
  const stableRatio = network.stablecoinLiquidityUsd / Math.max(network.stakedValueUsd, 1);
  const stableDepthSignal = toRange(stableRatio, 0.03, 0.2, -5, 6);
  const defiDepthSignal = toRange(network.tvlToMcapPct, 7, 34, 0, 8);
  const governanceSignal = toRange(network.validatorCount, 60, 135, -2, 5);
  const validatorSignal =
    toRange(network.validatorCount, 60, 135, -3, 6) + toRange(network.stakerAddresses, 40000, 220000, -2, 4);
  const yieldSignal = toRange(9.5 - network.stakingApyPct, 0, 4, -3, 4);
  const redemptionSignal = network.lstProtocols >= 2 ? 2 : -4;
  const penetrationSignal = network.lstPenetrationPct >= 14 ? 1 : -2;

  return {
    "Liquidity & Exit": clamp(base - 8 + stableDepthSignal + redemptionSignal + penetrationSignal, 30, 92),
    "Peg Stability": clamp(base + 2 + stableDepthSignal / 2 + redemptionSignal, 30, 92),
    "DeFi Moneyness": clamp(
      base - 15 + defiDepthSignal + (network.lendingPresence ? 2 : -3) + (network.lstCollateralEnabled ? 3 : -4),
      25,
      90
    ),
    "Security & Governance": clamp(base + 5 + governanceSignal + (network.lendingPresence ? 1 : 0), 35, 92),
    "Validator Decentralization": clamp(base + 7 + validatorSignal, 30, 95),
    "Incentive Sustainability": clamp(
      base - 8 + yieldSignal + (network.lstCollateralEnabled ? 1 : -2) + (network.lendingPresence ? 1 : 0),
      25,
      88
    ),
    "Stress Resilience": clamp(
      base - 6 +
        stableDepthSignal / 2 +
        (network.validatorCount >= 90 ? 2 : 0) +
        (network.stablecoinLiquidityUsd >= 120_000_000 ? 1 : -2),
      25,
      90
    )
  };
}

function repeated(value: number): number {
  return Math.round(clamp(value, 0, 100));
}

export function buildMockScoringInput(network: Network): LstHealthScoringInput {
  const baselines = deriveModuleBaselines(network);
  const stablecoinExitExists = network.stablecoinLiquidityUsd >= 70_000_000;
  const redemptionPathExists = network.lstProtocols >= 2;

  const extremeLpConcentrationPenalty: 0 | 5 | 10 =
    network.lstProtocols === 1 ? (network.lstPenetrationPct < 10 ? 10 : 5) : 0;
  const extremeVolatilityPenalty: 0 | 5 | 10 = network.stablecoinLiquidityUsd < 30_000_000 ? 10 : network.stablecoinLiquidityUsd < 60_000_000 ? 5 : 0;
  const noAudits = network.marketCapUsd < 1_200_000_000 && network.lstProtocols === 1;
  const noTimelockUpgrades = !network.lendingPresence && !network.lstCollateralEnabled;
  const emissionsDominate = network.stakingApyPct >= 8.8 && !network.lstCollateralEnabled;
  const extremeConcentration = network.validatorCount < 65;

  return {
    liquidityExit: {
      lstMarketDepth: {
        poolDepth: repeated(baselines["Liquidity & Exit"]),
        slippageQuality: repeated(baselines["Liquidity & Exit"]),
        volumeQuality: repeated(baselines["Liquidity & Exit"]),
        lpDiversification: repeated(baselines["Liquidity & Exit"])
      },
      baseExitQuality: {
        lstBaseSlippage: repeated(baselines["Liquidity & Exit"]),
        lstBaseDepth: repeated(baselines["Liquidity & Exit"]),
        routeRedundancy: repeated(baselines["Liquidity & Exit"])
      },
      stableExitQuality: {
        baseStableDepth: repeated(baselines["Liquidity & Exit"]),
        exitSlippage: repeated(baselines["Liquidity & Exit"]),
        stablecoinQuality: repeated(baselines["Liquidity & Exit"]),
        routeRedundancy: repeated(baselines["Liquidity & Exit"])
      },
      redemptionAnchor: {
        redemptionAvailability: repeated(baselines["Liquidity & Exit"]),
        queueTransparency: repeated(baselines["Liquidity & Exit"]),
        redemptionFriction: repeated(baselines["Liquidity & Exit"]),
        arbitrageViability: repeated(baselines["Liquidity & Exit"])
      },
      liquidityDurability: {
        incentiveDependence: repeated(baselines["Liquidity & Exit"]),
        tvlPersistence: repeated(baselines["Liquidity & Exit"]),
        organicVolumeQuality: repeated(baselines["Liquidity & Exit"]),
        lpStability: repeated(baselines["Liquidity & Exit"])
      },
      stablecoinExitExists,
      redemptionPathExists,
      extremeLpConcentrationPenalty
    },
    pegStability: {
      discountLevel: repeated(baselines["Peg Stability"]),
      discountVolatility: repeated(baselines["Peg Stability"]),
      pegRecovery: repeated(baselines["Peg Stability"]),
      arbitrageEfficiency: {
        redemptionAvailability: repeated(baselines["Peg Stability"]),
        redemptionFriction: repeated(baselines["Peg Stability"]),
        arbitrageCapacity: repeated(baselines["Peg Stability"])
      },
      redemptionPathExists,
      persistentLargeDiscount: !redemptionPathExists || network.stablecoinLiquidityUsd < 60_000_000,
      extremeVolatilityPenalty
    },
    stressResilience: {
      liquidityShockResistance: {
        lpDiversification: repeated(baselines["Stress Resilience"]),
        poolDepth: repeated(baselines["Stress Resilience"]),
        venueDiversity: repeated(baselines["Stress Resilience"])
      },
      redemptionCapacity: {
        queueThroughput: repeated(baselines["Stress Resilience"]),
        redemptionTransparency: repeated(baselines["Stress Resilience"]),
        unbondingDuration: repeated(baselines["Stress Resilience"])
      },
      stableExitCapacity: {
        baseStableDepth: repeated(baselines["Stress Resilience"]),
        exitSlippage: repeated(baselines["Stress Resilience"]),
        stablecoinDiversity: repeated(baselines["Stress Resilience"]),
        stablecoinQuality: repeated(baselines["Stress Resilience"])
      },
      defiContagionRisk: {
        lendingRiskDesign: repeated(baselines["Stress Resilience"]),
        oracleRobustness: repeated(baselines["Stress Resilience"]),
        leverageExposure: repeated(baselines["Stress Resilience"])
      },
      redemptionUnavailable: !redemptionPathExists
    },
    defiMoneyness: {
      collateralUtility: repeated(baselines["DeFi Moneyness"]),
      defiIntegrationBreadth: repeated(baselines["DeFi Moneyness"]),
      usageDepth: repeated(baselines["DeFi Moneyness"]),
      demandQuality: repeated(baselines["DeFi Moneyness"]),
      lstUsedAsCollateral: network.lstCollateralEnabled
    },
    securityGovernance: {
      auditPosture: repeated(baselines["Security & Governance"]),
      adminControlQuality: repeated(baselines["Security & Governance"]),
      upgradeSafety: repeated(baselines["Security & Governance"]),
      operationalTransparency: repeated(baselines["Security & Governance"]),
      noAudits,
      noTimelockUpgrades
    },
    validatorDecentralization: {
      delegationDistribution: repeated(baselines["Validator Decentralization"]),
      validatorSetBreadth: repeated(baselines["Validator Decentralization"]),
      operatorQuality: repeated(baselines["Validator Decentralization"]),
      slashingRiskManagement: repeated(baselines["Validator Decentralization"]),
      extremeConcentration
    },
    incentiveSustainability: {
      yieldQuality: repeated(baselines["Incentive Sustainability"]),
      liquidityDurability: repeated(baselines["Incentive Sustainability"]),
      usagePersistence: repeated(baselines["Incentive Sustainability"]),
      revenueSupport: repeated(baselines["Incentive Sustainability"]),
      emissionsDominate
    }
  };
}

export function scoreNetworkWithMockModel(network: Network): LstHealthScoringResult {
  const input = buildMockScoringInput(network);
  return computeLstHealthScore(input);
}

export function resolveLpAttractivenessFromScore(score: number): LpAttractiveness {
  if (score >= 75) return "Strong";
  if (score >= 62) return "Medium";
  if (score >= 52) return "Cautious";
  return "Opportunistic";
}
