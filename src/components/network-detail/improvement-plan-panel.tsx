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
  /** For pre-LST networks: the projected global score immediately after LST launch (before other improvements). */
  lstLaunchProjectedScore?: number;
  /** Controlled mode: pass from a shared parent to sync with RedFlagsPanel */
  enabledIds?: Set<string>;
  onToggle?: (id: string) => void;
};

export function ImprovementPlanPanel({ record, currentResult, lstLaunchProjectedScore, enabledIds: externalIds, onToggle: externalToggle }: Props) {
  const opportunities = useMemo(
    () => detectOpportunities(record, currentResult),
    [record, currentResult]
  );

  // Internal state used only when no controlled props are provided
  const [internalIds, setInternalIds] = useState<Set<string>>(new Set());
  const enabledIds = externalIds ?? internalIds;

  const internalToggle = useCallback((id: string) => {
    setInternalIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const toggle = externalToggle ?? internalToggle;

  const projected = useMemo(() => {
    if (enabledIds.size === 0) return null;
    const activeOverrides = opportunities
      .filter((o) => enabledIds.has(o.id))
      .map((o) => o.overrides);
    return simulateMultiple(record, activeOverrides);
  }, [record, opportunities, enabledIds]);

  const projectedGlobal = projected?.globalScore ?? currentResult.globalScore;
  const globalDelta = projectedGlobal - currentResult.globalScore;

  // Pre-LST trajectory
  const isPreLst = currentResult.mode === "pre-lst";
  const lstLaunchOpp = useMemo(
    () => opportunities.find((o) => o.isLstModeUnlock),
    [opportunities]
  );
  const lstAfterScore =
    lstLaunchProjectedScore ??
    lstLaunchOpp?.projectedGlobalScore ??
    currentResult.globalScore;
  const maxPotentialScore = useMemo(() => {
    if (opportunities.length === 0) return currentResult.globalScore;
    return simulateMultiple(record, opportunities.map((o) => o.overrides)).globalScore;
  }, [record, opportunities, currentResult.globalScore]);

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
            {isPreLst
              ? "Non-LST improvements shown in LST-active context — their value once the LST is deployed"
              : "Select improvements to simulate their impact on the health score"}
          </p>
        </div>
        <span className="rounded-md border border-sky-400/30 bg-sky-900/25 px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-sky-300">
          Protofire Advisory
        </span>
      </div>

      {/* Score Trajectory — pre-LST only */}
      {isPreLst && lstLaunchOpp && (
        <div className="mt-4 rounded-xl border border-indigo-400/15 bg-indigo-900/10 p-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.12em] text-indigo-300">
            Score Trajectory
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <ScoreStep label="Current (pre-LST)" score={currentResult.globalScore} />
            <TrajectoryArrow />
            <ScoreStep
              label="After LST Launch"
              score={lstAfterScore}
              delta={lstAfterScore - currentResult.globalScore}
            />
            <TrajectoryArrow />
            <ScoreStep
              label="Full Potential"
              score={maxPotentialScore}
              delta={maxPotentialScore - lstAfterScore}
            />
          </div>
        </div>
      )}

      {/* Interactive Score Projection Bar */}
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
            isPreLst={isPreLst}
          />
        ))}
      </div>
    </section>
  );
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function ScoreStep({ label, score, delta }: { label: string; score: number; delta?: number }) {
  return (
    <div className="text-center">
      <p className="text-[10px] uppercase tracking-[0.12em] text-indigo-300/70">{label}</p>
      <div className="mt-1 flex items-center gap-1.5">
        <span
          className={`inline-block rounded-lg border px-2.5 py-1 font-[var(--font-heading)] text-2xl font-bold tabular-nums ${healthScoreClass(score)}`}
        >
          {score}
        </span>
        {delta != null && delta > 0 && (
          <span className="text-xs font-semibold text-emerald-400">+{delta}</span>
        )}
      </div>
    </div>
  );
}

function TrajectoryArrow() {
  return (
    <div className="flex items-center gap-1 text-indigo-300/50">
      <div className="h-px w-6 bg-indigo-300/30" />
      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
      </svg>
    </div>
  );
}

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
  isPreLst,
}: {
  opportunity: ImprovementOpportunity;
  enabled: boolean;
  onToggle: () => void;
  isPreLst: boolean;
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
    "low-input": "Needs Boost",
    "missing-data": "Missing Data",
    "growth-opportunity": "Growth",
    strategic: "Strategic",
  }[opp.category];

  return (
    <div
      className={`rounded-xl border p-4 transition-colors ${
        enabled
          ? "border-emerald-400/30 bg-emerald-900/10"
          : opp.isLstModeUnlock
            ? "border-indigo-400/20 bg-indigo-900/10"
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
            {opp.isLstModeUnlock && (
              <span className="rounded border border-indigo-400/40 bg-indigo-900/30 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-indigo-300">
                Mode Unlock
              </span>
            )}
          </div>

          <p className="mt-1 text-xs text-ink-300">{opp.description}</p>

          {/* Why it matters + Expected benefit */}
          <div className="mt-2 space-y-1.5">
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-ink-400">
                Why it matters
              </span>
              <p className="mt-0.5 text-xs text-ink-200">{opp.whyItMatters}</p>
            </div>
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-ink-400">
                Expected benefit
              </span>
              <p className="mt-0.5 text-xs text-ink-200">{opp.expectedBenefit}</p>
            </div>
          </div>

          {/* Module score delta */}
          <div className="mt-2 flex flex-wrap items-center gap-3 text-xs">
            <span className="text-ink-400">{opp.module}:</span>
            <span className="tabular-nums text-ink-200">
              {opp.currentModuleScore}
              <span className="text-ink-400"> → </span>
              <span className="text-emerald-400">{opp.projectedModuleScore}</span>
            </span>
            {isPreLst && !opp.isLstModeUnlock && (
              <span className="italic text-ink-500">in LST-active context</span>
            )}
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

        {/* Marginal delta badge — incremental pts when stacked with higher-priority improvements */}
        <span
          className="shrink-0 rounded-full border border-emerald-400/30 bg-emerald-900/20 px-2.5 py-1 text-sm font-semibold tabular-nums text-emerald-300"
          title="Points added on top of all higher-priority improvements"
        >
          +{opp.marginalDelta} pts
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
