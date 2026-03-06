import { ModuleCard } from "@/components/dashboard/module-card";
import { ModuleSnapshot } from "@/data/mock-networks";

type ModuleGridProps = {
  modules: ModuleSnapshot[];
};

export function ModuleGrid({ modules }: ModuleGridProps) {
  return (
    <section>
      <div className="mb-4 flex items-end justify-between">
        <h2 className="font-[var(--font-heading)] text-2xl font-semibold text-ink-50">Module Scores</h2>
        <p className="text-xs uppercase tracking-[0.16em] text-ink-300">7-domain framework</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {modules.map((module) => (
          <ModuleCard key={module.name} module={module} />
        ))}
      </div>
    </section>
  );
}
