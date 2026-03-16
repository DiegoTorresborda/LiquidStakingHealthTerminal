// Scoring v2 — Adapter
// Converts V2ScoringResult to the LstHealthScoringResult shape expected by the UI,
// allowing v2 to be dropped in as a replacement for v1 without changing UI components.

import type { LstHealthScoringResult, ScoreBreakdown, ScoreCap } from "@/features/scoring/types"
import type { V2ScoringResult } from "./index"
import type { ModuleScoreResult } from "./types"

// ─── Module result → ScoreBreakdown ──────────────────────────────────────────

function toScoreBreakdown(m: ModuleScoreResult): ScoreBreakdown {
  const cap: ScoreCap | undefined = m.capApplied
    ? { reason: m.capApplied.reason, value: m.capApplied.value }
    : undefined

  return {
    rawScore: m.rawScore,
    penaltyPoints: 0,           // v2 uses caps, not deduction penalties
    scoreAfterPenalties: m.rawScore,
    cappedScore: m.finalScore,
    finalScore: m.finalScore,
    penalties: [],
    capsConsidered: cap ? [cap] : [],
    capApplied: cap,
  }
}

// Placeholder for Stress Resilience (removed in v2, but ModuleName still includes it)
function stressResiliencePlaceholder(): ScoreBreakdown {
  return {
    rawScore: 0,
    penaltyPoints: 0,
    scoreAfterPenalties: 0,
    cappedScore: 0,
    finalScore: 0,
    penalties: [],
    capsConsidered: [],
    capApplied: undefined,
  }
}

// ─── Global score → ScoreBreakdown ───────────────────────────────────────────

function globalScoreBreakdown(score: number): ScoreBreakdown {
  return {
    rawScore: score,
    penaltyPoints: 0,
    scoreAfterPenalties: score,
    cappedScore: score,
    finalScore: score,
    penalties: [],
    capsConsidered: [],
    capApplied: undefined,
  }
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Adapts a V2ScoringResult to the LstHealthScoringResult shape used by UI components.
 * Stress Resilience is set to 0 (module removed in v2).
 */
export function adaptV2ToLstResult(v2: V2ScoringResult): LstHealthScoringResult {
  const m = v2.moduleScores

  return {
    modelVersion: "v1",   // structural compatibility — UI checks this field
    moduleScores: {
      "Liquidity & Exit": toScoreBreakdown(m["Liquidity & Exit"]),
      "Peg Stability": toScoreBreakdown(m["Peg Stability"]),
      "DeFi Moneyness": toScoreBreakdown(m["DeFi Moneyness"]),
      "Security & Governance": toScoreBreakdown(m["Security & Governance"]),
      "Validator Decentralization": toScoreBreakdown(m["Validator Decentralization"]),
      "Incentive Sustainability": toScoreBreakdown(m["Incentive Sustainability"]),
      "Stress Resilience": stressResiliencePlaceholder(),
    },
    pillarScores: v2.pillarScores,
    globalScore: globalScoreBreakdown(v2.globalScore),
  }
}
