import { MODULE_ORDER } from "@/config/scoring";
import type { LstHealthScoringResult } from "@/features/scoring/types";
import { healthScoreClass } from "@/features/network-detail/utils";

type ScoringModelPanelProps = {
  scoring: LstHealthScoringResult;
  mode?: "pre-lst" | "lst-active";
};

export function ScoringModelPanel({ scoring, mode }: ScoringModelPanelProps) {
  const activeModules = MODULE_ORDER.filter((m) => m !== "Stress Resilience");

  const adjustments = activeModules.flatMap((moduleName) => {
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

  const allAdjustments = [...adjustments, ...globalCap];

  const modeLabel = mode === "lst-active" ? "LST Active" : mode === "pre-lst" ? "Pre-LST" : null;
  const modeBadgeClass =
    mode === "lst-active"
      ? "border-emerald-400/30 bg-emerald-900/30 text-emerald-300"
      : "border-amber-400/30 bg-amber-900/30 text-amber-300";

  const globalScore = scoring.globalScore.finalScore;
  const wasCapped = scoring.globalScore.rawScore !== scoring.globalScore.cappedScore;

  return (
    <section className="rounded-2xl border border-ink-300/20 bg-slateglass-700/45 p-5 shadow-card">
      {/* Header row: title + mode badge */}
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="font-[var(--font-heading)] text-2xl font-semibold text-ink-50">Scoring</h2>
        {modeLabel && (
          <span
            className={`rounded-md border px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.12em] ${modeBadgeClass}`}
          >
            {modeLabel}
          </span>
        )}
      </div>

      {/* Global score — prominent */}
      <div className="mt-4 flex items-end gap-4">
        <span
          className={`rounded-xl border px-5 py-3 font-[var(--font-heading)] text-5xl font-bold leading-none tabular-nums ${healthScoreClass(globalScore)}`}
        >
          {globalScore}
        </span>
        <div className="mb-1 text-sm">
          <p className="text-xs uppercase tracking-[0.14em] text-ink-300">Global LST Health</p>
          <p className="mt-0.5 text-ink-300">
            {wasCapped
              ? `Raw ${scoring.globalScore.rawScore} → capped to ${scoring.globalScore.cappedScore}`
              : `${activeModules.length}-module weighted average`}
          </p>
        </div>
      </div>

      {/* Pillar breakdown */}
      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <PillarCard label="Exitability" score={scoring.pillarScores.exitability} />
        <PillarCard label="Moneyness" score={scoring.pillarScores.moneyness} />
        <PillarCard label="Credibility" score={scoring.pillarScores.credibility} />
      </div>

      {/* Active adjustments — only rendered when something fired */}
      {allAdjustments.length > 0 && (
        <div className="mt-4 rounded-xl border border-ink-300/20 bg-ink-900/25 p-3">
          <p className="text-xs uppercase tracking-[0.16em] text-ink-300">Active Adjustments</p>
          <ul className="mt-2 space-y-2 text-sm text-ink-100">
            {allAdjustments.map((item) => (
              <li key={`${item.label}-${item.detail}`} className="flex flex-wrap items-center gap-2">
                <span className="rounded border border-ink-300/30 bg-ink-900/40 px-2 py-0.5 text-xs uppercase tracking-[0.12em] text-ink-300">
                  {item.label}
                </span>
                <span>{item.detail}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
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
