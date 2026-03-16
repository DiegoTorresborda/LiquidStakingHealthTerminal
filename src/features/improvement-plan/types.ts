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
