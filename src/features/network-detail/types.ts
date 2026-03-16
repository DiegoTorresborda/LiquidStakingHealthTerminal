import type { ModuleName } from "@/config/scoring";
import type { LstHealthScoringResult } from "@/features/scoring/types";
import type { RadarOverviewRecord } from "@/data/radar-overview-schema";
import type { V2ScoringResult } from "@/features/scoring/v2/index";

export type LpAttractivenessLabel = "Strong" | "Medium" | "Cautious" | "Opportunistic";

export type ContagionRiskLabel = "Low" | "Medium" | "High";

export type OpportunityImpact = "Very High" | "High" | "Medium" | "Low";

export type DetailMetric = {
  label: string;
  value: string;
  description?: string;
};

export type DetailModule = {
  name: ModuleName;
  score: number;
  rationale: string;
  keyMetrics: DetailMetric[];
  keyInsight: string;
  riskWarning?: string;
};

export type DetailOpportunity = {
  id: string;
  title: string;
  impact: OpportunityImpact;
  linkedModule: ModuleName;
  whyItMatters: string;
  expectedBenefit: string;
  implementationDifficulty?: "Low" | "Medium" | "High";
  timeHorizon?: "Short" | "Medium" | "Long";
  confidenceLabel?: "Low" | "Medium" | "High";
};

export type DetailRedFlag = {
  id: string;
  title: string;
  detail: string;
  linkedModule?: ModuleName;
  severity: "High" | "Medium" | "Low";
  /** ID of the Improvement Plan opportunity that addresses this flag */
  linkedOpportunityId?: string;
  /** Title of the Improvement Plan opportunity that addresses this flag */
  linkedOpportunityTitle?: string;
};

export type StressSnapshot = {
  scenario: string;
  estimatedLstDiscount: string;
  estimatedExitHaircutToUsdc: string;
  estimatedRedeemQueueDelay: string;
  contagionRisk: ContagionRiskLabel;
};

export type DetailMiniVisuals = {
  slippageCurve?: { tradeSizeUsd: number; slippagePct: number }[];
  pegDeviation?: number[];
  defiUsageComposition?: { label: string; sharePct: number }[];
  validatorConcentration?: { label: string; sharePct: number }[];
};

export type NetworkDetailSummary = {
  networkId: string;
  networkName: string;
  token: string;
  category: string;
  marketCapUsd: number;
  stakingRatioPct: number;
  stakingApyPct: number;
  defiTvlUsd: number;
  globalLstHealthScore: number;
  opportunityScore: number;
  lpAttractiveness: LpAttractivenessLabel;
  diagnosis: string;
  scoringMode?: "pre-lst" | "lst-active";
};

export type NetworkDetailData = {
  summary: NetworkDetailSummary;
  modules: DetailModule[];
  opportunities: DetailOpportunity[];
  redFlags: DetailRedFlag[];
  stressSnapshot: StressSnapshot;
  miniVisuals?: DetailMiniVisuals;
  scoring?: LstHealthScoringResult;
  radarRecord?: RadarOverviewRecord;
  v2Result?: V2ScoringResult;
};
