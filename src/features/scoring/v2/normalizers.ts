// Scoring v2 — Normalization utilities
// All functions return 0–100. Safe with nulls at the call site.

export const SCORING_CONFIG = {
  ticketSizeUsd: 1_000_000 // $1M default — drives exec() thresholds
} as const

function clamp(val: number, min = 0, max = 100): number {
  return Math.min(max, Math.max(min, val))
}

/**
 * Log scale between floor and ceiling → 0–100.
 * Better than linear for USD values: the gap between $1M and $5M matters
 * more than the gap between $100M and $104M.
 */
export function logScale(val: number, floor: number, ceiling: number): number {
  if (val <= 0 || floor <= 0 || ceiling <= floor) return 0
  // Return 0 when val is below the floor (covers both USD amounts and ratios correctly).
  // NOTE: Do NOT use Math.max(val, 1) here — that guard was only valid for large USD values
  // and inflates scores when called with ratios or small numbers (< 1).
  if (val < floor) return 0
  const normalized =
    (Math.log(val) - Math.log(floor)) /
    (Math.log(ceiling) - Math.log(floor))
  return clamp(normalized * 100)
}

/**
 * Linear scale between floor and ceiling → 0–100.
 * Used for ratios and percentages (e.g. stakingRatioPct).
 */
export function linScale(val: number, floor: number, ceiling: number): number {
  if (ceiling <= floor) return 0
  return clamp(((val - floor) / (ceiling - floor)) * 100)
}

/**
 * Executability score: can an LP execute a trade of `ticketSize`
 * without severe slippage?
 * floor = 2× ticket (barely viable), ceiling = 25× ticket (comfortable).
 */
export function execScore(val: number, ticketSize = SCORING_CONFIG.ticketSizeUsd): number {
  return logScale(val, ticketSize * 2, ticketSize * 25)
}

/**
 * Hybrid USD score combining:
 *   - Executability (60%): can I execute the ticket today?
 *   - Relative health (40%): is this ecosystem liquid for its size?
 *
 * @param val          The USD value to score (e.g. stableExitLiquidityUsd)
 * @param marketRef    Denominator for relative score (e.g. marketCapUsd or lstTvlUsd)
 * @param relFloor     Minimum ratio considered non-zero (e.g. 0.003 = 0.3%)
 * @param relCeiling   Ratio considered "excellent" (e.g. 0.05 = 5%)
 */
export function usdScore(
  val: number,
  marketRef: number | null,
  relFloor: number,
  relCeiling: number,
  ticketSize = SCORING_CONFIG.ticketSizeUsd
): number {
  if (val <= 0) return 0
  const exec = execScore(val, ticketSize)
  const rel =
    marketRef && marketRef > 0
      ? logScale(val / marketRef, relFloor, relCeiling)
      : exec // no market ref → rely on executability alone
  return exec * 0.6 + rel * 0.4
}
