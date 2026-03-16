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
  module: string;
  category: ImprovementCategory;
  overrides: Partial<RadarOverviewRecord>;
  currentModuleScore: number;
  projectedModuleScore: number;
  currentGlobalScore: number;
  projectedGlobalScore: number;
  globalDelta: number;
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
