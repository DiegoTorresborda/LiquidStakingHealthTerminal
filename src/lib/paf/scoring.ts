// Stage classification, conversion ratios, vs-Ethereum scoring, trajectory.
// Port of paf-toolkit/paf/scoring.py.

import type {
  ConversionRatios,
  HistoricalSnapshot,
  RawPafSnapshot,
  Stage,
} from "./types"
import { TRANSITIONS } from "./thresholds"

// ─── Stage classification ───────────────────────────────────────────────────

export function classifyStage(
  s: RawPafSnapshot,
  nativeLiquidStakingFlag = false,
): Stage {
  // Native LS networks (Solana, Cardano) classify as S* once they cross
  // the 2% staking-ratio floor — the funnel L3 evaluation does not apply.
  if (nativeLiquidStakingFlag) {
    return s.stakingRatioPct <= 2.0 ? "S0" : "S*"
  }

  let current: Stage = "S0"
  for (const t of TRANSITIONS) {
    if (t.fromStage !== current) continue
    if (t.check(s)) {
      current = t.toStage
    } else {
      break
    }
  }
  return current
}

// ─── Conversion ratios ──────────────────────────────────────────────────────

export function computeConversionRatios(s: RawPafSnapshot): ConversionRatios {
  const ratios: ConversionRatios = {
    stakingParticipationPct: s.stakingRatioPct,
    liquidizationPct: s.liquidizationRatePct,
    defiProductivityPct: s.defiProductivityRatePct,
    restakingPct: null,
    loopingDepthPct: null,
  }

  if (s.restakingTvlUsd != null && s.lstTvlUsd != null && s.lstTvlUsd > 0) {
    ratios.restakingPct = (s.restakingTvlUsd / s.lstTvlUsd) * 100
  }

  if (
    s.pendleEquivalentTvlUsd != null &&
    s.lstTvlUsd != null &&
    s.lstTvlUsd > 0
  ) {
    ratios.loopingDepthPct = (s.pendleEquivalentTvlUsd / s.lstTvlUsd) * 100
  }

  return ratios
}

// ─── vs-Ethereum scoring (log-scaled, 100 = parity, cap 150) ────────────────

function logScaleScore(networkValue: number, ethValue: number, cap = 150): number {
  if (ethValue <= 0 || networkValue <= 0) return 0
  const raw = 100 * (1 + Math.log10(networkValue / ethValue))
  return Math.max(0, Math.min(cap, raw))
}

export type VsEthScores = {
  L1: number | null
  L2: number | null
  L3: number | null
  "L4.1": number | null
  "L4.2": number | null
  overall: number
}

export function scoreVsEthereum(network: RawPafSnapshot, eth: RawPafSnapshot): VsEthScores {
  const scores = {
    L1: logScaleScore(network.marketCapUsd, eth.marketCapUsd),
    L2: logScaleScore(network.stakingRatioPct, eth.stakingRatioPct),
    L3:
      network.liquidizationRatePct != null && eth.liquidizationRatePct != null
        ? logScaleScore(network.liquidizationRatePct, eth.liquidizationRatePct)
        : null,
    "L4.1":
      network.restakingRatePct != null && eth.restakingRatePct != null
        ? logScaleScore(network.restakingRatePct, eth.restakingRatePct)
        : null,
    "L4.2":
      network.defiProductivityRatePct != null &&
      eth.defiProductivityRatePct != null
        ? logScaleScore(
            network.defiProductivityRatePct,
            eth.defiProductivityRatePct,
          )
        : null,
  } as const

  const values = Object.values(scores).filter((v): v is number => v != null)
  const overall = values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : 0

  return { ...scores, overall }
}

// ─── Trajectory positioning ─────────────────────────────────────────────────

function snapshotDistance(s: RawPafSnapshot, h: HistoricalSnapshot): number {
  const diffs: number[] = []

  diffs.push(Math.abs(s.stakingRatioPct - h.stakingRatioPct))

  if (s.liquidizationRatePct != null && h.liquidizationRatePct != null) {
    diffs.push(Math.abs(s.liquidizationRatePct - h.liquidizationRatePct))
  }

  if (s.defiProductivityRatePct != null && h.defiProductivityRatePct != null) {
    diffs.push(
      Math.abs(s.defiProductivityRatePct - h.defiProductivityRatePct),
    )
  }

  if (diffs.length === 0) return Infinity
  return diffs.reduce((a, b) => a + b, 0) / diffs.length
}

export function trajectoryPosition(
  s: RawPafSnapshot,
  history: HistoricalSnapshot[],
): { description: string; nearestQuarter: string | null } {
  if (history.length === 0) {
    return { description: "no benchmark history available", nearestQuarter: null }
  }

  let nearest = history[0]
  let bestDist = snapshotDistance(s, nearest)
  for (const h of history.slice(1)) {
    const d = snapshotDistance(s, h)
    if (d < bestDist) {
      bestDist = d
      nearest = h
    }
  }

  const suffix = nearest.note ? ` — ${nearest.note}` : ""
  return {
    description: `comparable to ETH ${nearest.quarter}${suffix}`,
    nearestQuarter: nearest.quarter,
  }
}

// ─── BD recommendation ──────────────────────────────────────────────────────

export function bdRecommendation(stage: Stage): string {
  switch (stage) {
    case "S0":
      return "Watch list, not active target. Network has not crossed the 2% staking-ratio floor. Revisit if a staking-incentive program or consensus-upgrade catalyst is announced."
    case "S1":
      return "Highest-leverage BD opportunity. Network is securing but pre-liquidization. Pitch a liquid-staking product before a dominant issuer emerges."
    case "S2":
      return "Active BD target. LST market is forming. Push for DeFi integrations (lending + AMM) to break the 30% productivity barrier."
    case "S3":
      return "Productive integrations stage. Restaking primitives are the next gate but watch for restaking market stability before pitching restaking-only narratives."
    case "S4.1":
      return "Restaking-era opportunity with caution. Pitch composability primitives — yield tokenization, looping markets, LRT-collateralized lending."
    case "S4.2":
      return "Mature funnel. All conversion ratios qualify for category-leadership pitches. BD focus on differentiated yield products and institutional structured products."
    case "S*":
      return "Native liquid staking — non-standard funnel. Focus on L4.2 productivity and L4.1 restaking analogs; L3 evaluation does not apply."
    default:
      return "No specific recommendation."
  }
}

// ─── Strengths & gaps (auto-derived from threshold proximity) ───────────────

export function strengthsAndGaps(
  s: RawPafSnapshot,
  eth: RawPafSnapshot,
  stage: Stage,
): { strengths: string[]; gaps: string[] } {
  const strengths: string[] = []
  const gaps: string[] = []

  if (s.stakingRatioPct >= eth.stakingRatioPct) {
    strengths.push(
      `Staking ratio ${s.stakingRatioPct.toFixed(1)}% meets/exceeds Ethereum's ${eth.stakingRatioPct.toFixed(1)}%.`,
    )
  } else if (s.stakingRatioPct < 0.5 * eth.stakingRatioPct) {
    gaps.push(
      `Staking ratio ${s.stakingRatioPct.toFixed(1)}% is less than half Ethereum's — security thin.`,
    )
  }

  if (s.largestLstIssuerSharePct != null && s.largestLstIssuerSharePct >= 70) {
    gaps.push(
      `LST market dominated by single issuer (${s.largestLstIssuerSharePct.toFixed(0)}% share) — anti-monopoly red flag.`,
    )
  }

  if (s.liquidizationRatePct != null && s.liquidizationRatePct >= 30) {
    strengths.push(
      `Liquidization rate ${s.liquidizationRatePct.toFixed(0)}% is healthy (S2-mature).`,
    )
  }

  if (s.nativeRedemptionAvailable === false) {
    gaps.push("Native LST redemption not yet enabled — S2→S3 blocker.")
  }

  if (s.defiProductivityRatePct != null) {
    if (s.defiProductivityRatePct >= 30) {
      strengths.push(
        `DeFi productivity ${s.defiProductivityRatePct.toFixed(0)}% clears the S3 threshold.`,
      )
    } else if (s.defiProductivityRatePct < 10) {
      gaps.push(
        `DeFi productivity ${s.defiProductivityRatePct.toFixed(0)}% is low — LST is not yet productive collateral.`,
      )
    }
  }

  const nextT = TRANSITIONS.find((t) => t.fromStage === stage)
  if (nextT) {
    gaps.push(`Next gate: ${nextT.fromStage} → ${nextT.toStage} requires ${nextT.rule}.`)
  }

  return { strengths, gaps }
}
