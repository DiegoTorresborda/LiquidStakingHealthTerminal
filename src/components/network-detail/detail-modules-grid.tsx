import type { DetailModule } from "@/features/network-detail/types";
import type { LstHealthScoringResult } from "@/features/scoring/types";
import type { V2ScoringResult } from "@/features/scoring/v2/index";

import { DetailModuleCard } from "@/components/network-detail/detail-module-card";

type DetailModulesGridProps = {
  modules: DetailModule[];
  scoring?: LstHealthScoringResult;
  v2Result?: V2ScoringResult;
};

export function DetailModulesGrid({ modules, scoring, v2Result }: DetailModulesGridProps) {
  const activeCount = modules.filter((m) => !v2Result?.moduleScores[m.name as keyof typeof v2Result.moduleScores]?.excluded).length;
  const totalCount = modules.length;
  const hasExcluded = activeCount < totalCount;

  return (
    <section>
      <div className="mb-4 flex items-end justify-between">
        <div className="flex items-baseline gap-2">
          <h2 className="font-[var(--font-heading)] text-2xl font-semibold text-ink-50">
            {activeCount}-Module Diagnosis
          </h2>
          {hasExcluded && (
            <span className="text-xs text-ink-400">
              + {totalCount - activeCount} not scored (pre-LST)
            </span>
          )}
        </div>
        <p className="text-xs uppercase tracking-[0.16em] text-ink-300">Score + rationale + risks</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {modules.map((module) => {
          const excluded = v2Result?.moduleScores[module.name as keyof typeof v2Result.moduleScores]?.excluded ?? false;
          return (
            <DetailModuleCard
              key={module.name}
              module={module}
              scoreBreakdown={scoring?.moduleScores[module.name]}
              excluded={excluded}
            />
          );
        })}
      </div>
    </section>
  );
}
