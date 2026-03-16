import type { RadarOverviewRecord } from "@/data/radar-overview-schema";
import { computeV2Score, type V2ScoringResult } from "@/features/scoring/v2/index";

/** Run the real v2 scoring engine with hypothetical overrides applied */
export function simulateScore(
  record: RadarOverviewRecord,
  overrides: Partial<RadarOverviewRecord>
): V2ScoringResult {
  const simulated = { ...record, ...overrides } as RadarOverviewRecord;
  return computeV2Score(simulated);
}

/** Merge multiple override sets and simulate the combined impact */
export function simulateMultiple(
  record: RadarOverviewRecord,
  overrideSets: Partial<RadarOverviewRecord>[]
): V2ScoringResult {
  const merged = overrideSets.reduce<Partial<RadarOverviewRecord>>(
    (acc, o) => ({ ...acc, ...o }),
    {}
  );
  return simulateScore(record, merged);
}
