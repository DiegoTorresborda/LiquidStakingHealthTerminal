"use client";

import { useState, useCallback } from "react";
import type { RadarOverviewRecord } from "@/data/radar-overview-schema";
import type { V2ScoringResult } from "@/features/scoring/v2/index";
import type { DetailRedFlag } from "@/features/network-detail/types";
import { RedFlagsPanel } from "@/components/network-detail/red-flags-panel";
import { ImprovementPlanPanel } from "@/components/network-detail/improvement-plan-panel";

type Props = {
  record: RadarOverviewRecord;
  currentResult: V2ScoringResult;
  redFlags: DetailRedFlag[];
  lstLaunchProjectedScore?: number;
};

/**
 * Manages the shared enabledIds state so that:
 * - Red Flags appear first and turn green when their linked improvement is selected
 * - Improvement Plan below reacts to the same selection state
 */
export function DiagnosisInteractiveSection({ record, currentResult, redFlags, lstLaunchProjectedScore }: Props) {
  const [enabledIds, setEnabledIds] = useState<Set<string>>(new Set());

  const toggle = useCallback((id: string) => {
    setEnabledIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  return (
    <>
      <RedFlagsPanel redFlags={redFlags} enabledIds={enabledIds} />
      <ImprovementPlanPanel
        record={record}
        currentResult={currentResult}
        lstLaunchProjectedScore={lstLaunchProjectedScore}
        enabledIds={enabledIds}
        onToggle={toggle}
      />
    </>
  );
}
