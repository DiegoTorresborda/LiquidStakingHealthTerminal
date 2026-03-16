"use client";

import { useMemo, useState, useCallback } from "react";
import type { RadarOverviewRecord } from "@/data/radar-overview-schema";
import type { V2ScoringResult } from "@/features/scoring/v2/index";
import { detectOpportunities } from "@/features/improvement-plan/opportunity-detector";
import { simulateMultiple } from "@/features/improvement-plan/simulator";
import { SERVICE_CATALOG } from "@/features/improvement-plan/service-catalog";
import type { ImprovementOpportunity } from "@/features/improvement-plan/types";
import { healthScoreClass } from "@/features/network-detail/utils";

type Props = {
  record: RadarOverviewRecord;
  currentResult: V2ScoringResult;
};

export function ImprovementPlanPanel({ record, currentResult }: Props) {
  const opportunities = useMemo(
    () => detectOpportunities(record, currentResult),
    [record, currentResult]
  );

  const [enabledIds, setEnabledIds] = useState<Set<string>>(new Set());

  const toggle = useCallback((id: string) => {
    setEnabledIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const projected = useMemo(() => {
    if (enabledIds.size === 0) return null;
    const activeOverrides = opportunities
      .filter((o) => enabledIds.has(o.id))
      .map((o) => o.overrides);
    return simulateMultiple(record, activeOverrides);
  }, [record, opportunities, enabledIds]);

  const projectedGlobal = projected?.globalScore ?? currentResult.globalScore;
  const globalDelta = projectedGlobal - currentResult.globalScore;

  if (opportunities.length === 0) return null;

  return (
    <section className="rounded-2xl border border-ink-300/20 bg-slateglass-700/45 p-5 shadow-card">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-[var(--font-heading)] text-2xl font-semibold text-ink-50">
            Improvement Plan
          </h2>
          <p className="mt-1 text-sm text-ink-300">
            Select improvements to simulate their impact on the health score
          </p>
        </div>
        <span className="rounded-md border border-sky-400/30 bg-sky-900/25 px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-sky-300">
          Protofire Advisory
        </span>
      </div>

      {/* Score Projection Bar */}
      <div className="mt-4 rounded-xl border border-ink-300/20 bg-ink-900/30 p-4">
        <div className="flex flex-wrap items-center gap-4">
          {/* Current */}
          <div className="text-center">
            <p className="text-xs uppercase tracking-[0.14em] text-ink-400">Current</p>
            <span
              className={`mt-1 inline-block rounded-lg border px-3 py-1.5 font-[var(--font-heading)] text-3xl font-bold tabular-nums ${healthScoreClass(currentResult.globalScore)}`}
            >
              {currentResult.globalScore}
            </span>
          </div>

          {/* Arrow */}
          <div className="flex items-center gap-2 text-ink-400">
            <div className="h-px w-8 bg-ink-400/50" />
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </div>

          {/* Projected */}
          <div className="text-center">
            <p className="text-xs uppercase tracking-[0.14em] text-ink-400">Projected</p>
            <span
              className={`mt-1 inline-block rounded-lg border px-3 py-1.5 font-[var(--font-heading)] text-3xl font-bold tabular-nums ${healthScoreClass(projectedGlobal)}`}
            >
              {projectedGlobal}
            </span>
          </div>

          {/* Delta badge */}
          {globalDelta > 0 && (
            <span className="rounded-full border border-emerald-400/30 bg-emerald-900/30 px-3 py-1 text-sm font-semibold text-emerald-300">
              +{globalDelta} pts
            </span>
          )}
        </div>

        {/* Pillar deltas */}
        {projected && (
          <div className="mt-3 grid gap-2 md:grid-cols-3">
            <PillarDelta
              label="Exitability"
              current={currentResult.pillarScores.exitability}
              projected={projected.pillarScores.exitability}
            />
            <PillarDelta
              label="Moneyness"
              current={currentResult.pillarScores.moneyness}
              projected={projected.pillarScores.moneyness}
            />
            <PillarDelta
              label="Credibility"
              current={currentResult.pillarScores.credibility}
              projected={projected.pillarScores.credibility}
            />
          </div>
        )}
      </div>

      {/* Opportunity Cards */}
      <div className="mt-4 space-y-3">
        {opportunities.map((opp) => (
          <OpportunityCard
            key={opp.id}
            opportunity={opp}
            enabled={enabledIds.has(opp.id)}
            onToggle={() => toggle(opp.id)}
          />
        ))}
      </div>
    </section>
  );
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function PillarDelta({
  label,
  current,
  projected,
}: {
  label: string;
  current: number;
  projected: number;
}) {
  const delta = projected - current;
  return (
    <div className="flex items-center justify-between rounded-lg border border-ink-300/15 bg-ink-900/20 px-3 py-2 text-sm">
      <span className="text-ink-300">{label}</span>
      <span className="tabular-nums text-ink-100">
        {current}
        {delta !== 0 && (
          <>
            <span className="text-ink-400"> → </span>
            <span className={delta > 0 ? "text-emerald-400" : "text-ink-100"}>
              {projected}
            </span>
          </>
        )}
      </span>
    </div>
  );
}

function OpportunityCard({
  opportunity: opp,
  enabled,
  onToggle,
}: {
  opportunity: ImprovementOpportunity;
  enabled: boolean;
  onToggle: () => void;
}) {
  const service = SERVICE_CATALOG.find((s) => s.id === opp.serviceId);

  const categoryBadge = {
    "cap-removal": "border-red-400/30 bg-red-900/25 text-red-300",
    "low-input": "border-sky-400/30 bg-sky-900/25 text-sky-300",
    "missing-data": "border-ink-300/30 bg-ink-900/30 text-ink-300",
    "growth-opportunity": "border-amber-400/30 bg-amber-900/25 text-amber-300",
    strategic: "border-violet-400/30 bg-violet-900/25 text-violet-300",
  }[opp.category];

  const categoryLabel = {
    "cap-removal": "Cap Removal",
    "low-input": "Low Score",
    "missing-data": "Missing Data",
    "growth-opportunity": "Growth",
    strategic: "Strategic",
  }[opp.category];

  return (
    <div
      className={`rounded-xl border p-4 transition-colors ${
        enabled
          ? "border-emerald-400/30 bg-emerald-900/10"
          : "border-ink-300/20 bg-ink-900/20"
      }`}
    >
      <div className="flex flex-wrap items-start gap-3">
        {/* Checkbox */}
        <button
          type="button"
          onClick={onToggle}
          className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors ${
            enabled
              ? "border-emerald-400 bg-emerald-500 text-white"
              : "border-ink-400/50 bg-ink-900/50 text-transparent hover:border-ink-300"
          }`}
        >
          {enabled && (
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </button>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-semibold text-ink-50">{opp.title}</h3>
            <span
              className={`rounded border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.1em] ${categoryBadge}`}
            >
              {categoryLabel}
            </span>
          </div>

          <p className="mt-1 text-xs text-ink-300">{opp.description}</p>

          {/* Module score delta */}
          <div className="mt-2 flex flex-wrap items-center gap-3 text-xs">
            <span className="text-ink-400">{opp.module}:</span>
            <span className="tabular-nums text-ink-200">
              {opp.currentModuleScore}
              <span className="text-ink-400"> → </span>
              <span className="text-emerald-400">{opp.projectedModuleScore}</span>
            </span>
          </div>

          {/* Service + metadata */}
          {service && (
            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
              <span className="rounded border border-sky-400/20 bg-sky-900/20 px-1.5 py-0.5 text-sky-300">
                {service.name}
              </span>
              <span className="text-ink-400">{opp.timeHorizon}</span>
              <span className="text-ink-400">·</span>
              <EffortBadge effort={opp.effort} />
            </div>
          )}
        </div>

        {/* Global delta badge */}
        <span className="shrink-0 rounded-full border border-emerald-400/30 bg-emerald-900/20 px-2.5 py-1 text-sm font-semibold tabular-nums text-emerald-300">
          +{opp.globalDelta}
        </span>
      </div>
    </div>
  );
}

function EffortBadge({ effort }: { effort: "Low" | "Medium" | "High" }) {
  const cls =
    effort === "Low"
      ? "text-emerald-400"
      : effort === "Medium"
        ? "text-amber-400"
        : "text-red-400";
  return <span className={`text-xs font-medium ${cls}`}>{effort}</span>;
}
