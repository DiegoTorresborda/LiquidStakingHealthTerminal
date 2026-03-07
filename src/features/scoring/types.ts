import type { ModuleName } from "@/config/scoring";

export type ScorePenalty = {
  reason: string;
  points: number;
};

export type ScoreCap = {
  reason: string;
  value: number;
};

export type ScoreBreakdown = {
  rawScore: number;
  penaltyPoints: number;
  scoreAfterPenalties: number;
  cappedScore: number;
  finalScore: number;
  penalties: ScorePenalty[];
  capsConsidered: ScoreCap[];
  capApplied?: ScoreCap;
};

export type LstHealthScoringInput = {
  liquidityExit: {
    lstMarketDepth: {
      poolDepth: number;
      slippageQuality: number;
      volumeQuality: number;
      lpDiversification: number;
    };
    baseExitQuality: {
      lstBaseSlippage: number;
      lstBaseDepth: number;
      routeRedundancy: number;
    };
    stableExitQuality: {
      baseStableDepth: number;
      exitSlippage: number;
      stablecoinQuality: number;
      routeRedundancy: number;
    };
    redemptionAnchor: {
      redemptionAvailability: number;
      queueTransparency: number;
      redemptionFriction: number;
      arbitrageViability: number;
    };
    liquidityDurability: {
      incentiveDependence: number;
      tvlPersistence: number;
      organicVolumeQuality: number;
      lpStability: number;
    };
    stablecoinExitExists: boolean;
    redemptionPathExists: boolean;
    extremeLpConcentrationPenalty?: 0 | 5 | 10;
  };
  pegStability: {
    discountLevel: number;
    discountVolatility: number;
    pegRecovery: number;
    arbitrageEfficiency: {
      redemptionAvailability: number;
      redemptionFriction: number;
      arbitrageCapacity: number;
    };
    redemptionPathExists: boolean;
    persistentLargeDiscount: boolean;
    extremeVolatilityPenalty?: 0 | 5 | 10;
  };
  stressResilience: {
    liquidityShockResistance: {
      lpDiversification: number;
      poolDepth: number;
      venueDiversity: number;
    };
    redemptionCapacity: {
      queueThroughput: number;
      redemptionTransparency: number;
      unbondingDuration: number;
    };
    stableExitCapacity: {
      baseStableDepth: number;
      exitSlippage: number;
      stablecoinDiversity: number;
      stablecoinQuality: number;
    };
    defiContagionRisk: {
      lendingRiskDesign: number;
      oracleRobustness: number;
      leverageExposure: number;
    };
    redemptionUnavailable: boolean;
  };
  defiMoneyness: {
    collateralUtility: number;
    defiIntegrationBreadth: number;
    usageDepth: number;
    demandQuality: number;
    lstUsedAsCollateral: boolean;
  };
  securityGovernance: {
    auditPosture: number;
    adminControlQuality: number;
    upgradeSafety: number;
    operationalTransparency: number;
    noAudits: boolean;
    noTimelockUpgrades: boolean;
  };
  validatorDecentralization: {
    delegationDistribution: number;
    validatorSetBreadth: number;
    operatorQuality: number;
    slashingRiskManagement: number;
    extremeConcentration: boolean;
  };
  incentiveSustainability: {
    yieldQuality: number;
    liquidityDurability: number;
    usagePersistence: number;
    revenueSupport: number;
    emissionsDominate: boolean;
  };
};

export type PillarScores = {
  exitability: number;
  moneyness: number;
  credibility: number;
};

export type LstHealthScoringResult = {
  modelVersion: "v1";
  moduleScores: Record<ModuleName, ScoreBreakdown>;
  pillarScores: PillarScores;
  globalScore: ScoreBreakdown;
};
