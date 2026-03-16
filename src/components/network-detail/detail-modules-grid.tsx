import type { DetailModule } from "@/features/network-detail/types";
import type { LstHealthScoringResult } from "@/features/scoring/types";

import { DetailModuleCard } from "@/components/network-detail/detail-module-card";

type DetailModulesGridProps = {
  modules: DetailModule[];
  scoring?: LstHealthScoringResult;
};

export function DetailModulesGrid({ modules, scoring }: DetailModulesGridProps) {
  return (
    <section>
      <div className="mb-4 flex items-end justify-between">
        <h2 className="font-[var(--font-heading)] text-2xl font-semibold text-ink-50">{modules.length}-Module Diagnosis</h2>
        <p className="text-xs uppercase tracking-[0.16em] text-ink-300">Score + rationale + risks</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {modules.map((module) => (
          <DetailModuleCard key={module.name} module={module} scoreBreakdown={scoring?.moduleScores[module.name]} />
        ))}
      </div>
    </section>
  );
}
