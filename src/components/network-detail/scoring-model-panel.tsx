import { MODULE_ORDER } from "@/config/scoring";
import type { LstHealthScoringResult } from "@/features/scoring/types";
import { healthScoreClass } from "@/features/network-detail/utils";

type ScoringModelPanelProps = {
  scoring: LstHealthScoringResult;
};

export function ScoringModelPanel({ scoring }: ScoringModelPanelProps) {
  const adjustments = MODULE_ORDER.flatMap((moduleName) => {
    const moduleScore = scoring.moduleScores[moduleName];
    const modulePenalties = moduleScore.penalties.map((penalty) => ({
      label: `${moduleName} penalty`,
      detail: `${penalty.reason} (-${penalty.points})`
    }));

    const moduleCap = moduleScore.capApplied
      ? [
          {
            label: `${moduleName} cap`,
            detail: `${moduleScore.capApplied.reason} (max ${moduleScore.capApplied.value})`
          }
        ]
      : [];

    return [...modulePenalties, ...moduleCap];
  });

  const globalCap = scoring.globalScore.capApplied
    ? [
        {
          label: "Global cap",
          detail: `${scoring.globalScore.capApplied.reason} (max ${scoring.globalScore.capApplied.value})`
        }
      ]
    : [];

  return (
    <section className="rounded-2xl border border-ink-300/20 bg-slateglass-700/45 p-5 shadow-card">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-[var(--font-heading)] text-2xl font-semibold text-ink-50">Scoring Model v1</h2>
        <span className={`rounded-md border px-2.5 py-1 text-sm font-semibold ${healthScoreClass(scoring.globalScore.finalScore)}`}>
          Global {scoring.globalScore.finalScore}
        </span>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <PillarCard label="Exitability" score={scoring.pillarScores.exitability} />
        <PillarCard label="Moneyness" score={scoring.pillarScores.moneyness} />
        <PillarCard label="Credibility" score={scoring.pillarScores.credibility} />
      </div>

      <div className="mt-4 rounded-xl border border-ink-300/20 bg-ink-900/25 p-3 text-sm text-ink-100">
        <p className="text-xs uppercase tracking-[0.16em] text-ink-300">Global Breakdown</p>
        <p className="mt-1">
          Raw {scoring.globalScore.rawScore} · Penalties -{scoring.globalScore.penaltyPoints} · Capped{" "}
          {scoring.globalScore.cappedScore} · Final {scoring.globalScore.finalScore}
        </p>
      </div>

      <div className="mt-4 rounded-xl border border-ink-300/20 bg-ink-900/25 p-3">
        <p className="text-xs uppercase tracking-[0.16em] text-ink-300">Triggered Caps & Penalties</p>
        {adjustments.length + globalCap.length > 0 ? (
          <ul className="mt-2 space-y-2 text-sm text-ink-100">
            {[...adjustments, ...globalCap].map((item) => (
              <li key={`${item.label}-${item.detail}`} className="flex flex-wrap items-center gap-2">
                <span className="rounded border border-ink-300/30 bg-ink-900/40 px-2 py-0.5 text-xs uppercase tracking-[0.12em] text-ink-300">
                  {item.label}
                </span>
                <span>{item.detail}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-sm text-ink-200">No caps or penalties triggered for this network in the current mock scenario.</p>
        )}
      </div>
    </section>
  );
}

type PillarCardProps = {
  label: string;
  score: number;
};

function PillarCard({ label, score }: PillarCardProps) {
  return (
    <div className="rounded-xl border border-ink-300/20 bg-ink-900/30 p-3">
      <p className="text-xs uppercase tracking-[0.14em] text-ink-300">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-ink-50">{score}</p>
    </div>
  );
}
