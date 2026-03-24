import type { RadarOverviewRecord } from "@/data/radar-overview-schema";

export type ImprovementCategory =
  | "cap-removal"
  | "low-input"
  | "missing-data"
  | "growth-opportunity"
  | "strategic";

export type ImprovementOpportunity = {
  id: string;
  title: string;
  description: string;
  whyItMatters: string;
  expectedBenefit: string;
  module: string;
  category: ImprovementCategory;
  overrides: Partial<RadarOverviewRecord>;
  currentModuleScore: number;
  projectedModuleScore: number;
  currentGlobalScore: number;
  projectedGlobalScore: number;
  globalDelta: number;
  /** Incremental score contribution when stacked on all higher-priority improvements.
   * Sum of all marginalDeltas equals Score Potential − Current Score. */
  marginalDelta: number;
  /** True for the "Launch LST" initiative — it is a mode-unlock prerequisite, not a regular improvement.
   * For pre-LST networks, all other improvements are evaluated in LST-active context. */
  isLstModeUnlock?: boolean;
  serviceId: string;
  effort: "Low" | "Medium" | "High";
  timeHorizon: string;
};

export type ProtofireService = {
  id: string;
  name: string;
  category: string;
  description: string;
  typicalTimeline: string;
  relatedFields: (keyof RadarOverviewRecord)[];
};
