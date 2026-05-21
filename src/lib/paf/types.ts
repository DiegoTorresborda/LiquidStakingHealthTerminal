// PoS Adoption Funnel — TypeScript types
// Port of paf-toolkit/paf/schema.py. The Python package remains the canonical
// reference (with calibration tests). This TS port is consumed by the Next.js
// app via the sync-paf-data build script.

export type Stage = "S0" | "S1" | "S2" | "S3" | "S4.1" | "S4.2" | "S*"

export type Confidence = "high" | "medium" | "low" | "data_gap" | "contested"

export type ConversionRatios = {
  stakingParticipationPct: number
  liquidizationPct: number | null
  defiProductivityPct: number | null
  restakingPct: number | null
  loopingDepthPct: number | null
}

export type HistoricalSnapshot = {
  quarter: string         // "2023-Q2"
  asOf: string            // ISO date
  stage: Stage
  stakingRatioPct: number
  liquidizationRatePct: number | null
  defiProductivityRatePct: number | null
  restakingRatePct: number | null
  lstTvlUsd: number | null
  restakingTvlUsd: number | null
  note: string | null
}

// What gets attached to a Network as `paf?: PafExtension`.
// Pre-computed at build time by scripts/sync-paf-data.ts — the app doesn't
// recompute these at runtime.
export type PafExtension = {
  stage: Stage
  classificationConfidence: Confidence
  conversionRatios: ConversionRatios
  trajectory: string                  // "comparable to ETH 2022-Q3 (Merge era)"
  nearestQuarter: string | null       // "2022-Q3"
  // Per-layer score vs Ethereum (100 = parity, capped at 150). null = layer absent.
  vsEthScores: {
    L1: number | null
    L2: number | null
    L3: number | null
    "L4.1": number | null
    "L4.2": number | null
    overall: number
  }
  // Top 3 strengths / gaps, auto-derived
  strengths: string[]
  gaps: string[]
  // Stage-driven BD recommendation
  bdRecommendation: string
}

// Shape of the JSON written by scripts/sync-paf-data.ts to data/paf-data.json
export type PafDataFile = {
  generatedAt: string
  benchmarkAsOf: string
  ethereum: PafSnapshot              // calibration reference (Q1 2026 snapshot)
  ethereumHistory: HistoricalSnapshot[]
  networks: Record<string, PafSnapshot>  // keyed by networkId
}

// Raw KPI fields without the derived PafExtension. Scoring functions accept
// this form so they can be called during the build before paf is computed.
export type RawPafSnapshot = {
  name: string
  ticker: string
  // Native quantities — invariant to price
  circulatingSupply: number
  totalStaked: number
  stakingRatioPct: number
  nativePriceUsd: number
  // USD values — derived from native quantities × price
  marketCapUsd: number
  lstTvlUsd: number | null
  lstInDefiTvlUsd: number | null
  restakingTvlUsd: number | null
  pendleEquivalentTvlUsd: number | null
  // L2 essentials
  activeValidators: number
  nakamotoCoefficient: number
  nominalYieldPct: number
  realYieldPct: number
  clientDiversityHhi: number
  // L3 essentials
  liquidizationRatePct: number | null
  largestLstIssuerSharePct: number | null
  numLstIssuersAbove5pct: number | null
  nativeRedemptionAvailable: boolean | null
  // L4.1 essentials
  restakingRatePct: number | null
  avsCountLive: number | null
  lrtCount: number | null
  // L4.2 essentials
  defiProductivityRatePct: number | null
  numLendingIntegrations: number | null
  numAmmIntegrations: number | null
  loopingSupported: boolean | null
}

// PafSnapshot = raw fields + derived PafExtension. This is what gets written
// to data/paf-data.json and consumed by the app.
export type PafSnapshot = RawPafSnapshot & {
  paf: PafExtension
}
