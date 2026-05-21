// Build-time sync: read paf-toolkit YAMLs, compute derived PAF data, write data/paf-data.json.
//
// Run with: npm run data:sync:paf  (alias for tsx scripts/sync-paf-data.ts)
//
// The paf-toolkit/ directory is the canonical source for the Ethereum benchmark
// (KPI envelopes with confidence/source/as_of). The Next.js app consumes a
// pre-computed JSON to keep runtime cheap and avoid Python in the build path.

import fs from "node:fs"
import path from "node:path"
import { parse as parseYaml } from "yaml"
import { strengthsAndGaps, classifyStage, computeConversionRatios, scoreVsEthereum, trajectoryPosition, bdRecommendation } from "../src/lib/paf/scoring"
import type {
  Confidence,
  HistoricalSnapshot,
  PafDataFile,
  PafSnapshot,
  Stage,
} from "../src/lib/paf/types"

// Python's PyYAML accepts numeric underscore separators (121_500_000.0) but the
// npm `yaml` package does not. Strip underscores between digits before parsing.
function stripNumericUnderscores(yamlText: string): string {
  return yamlText.replace(/(\d)_(?=\d)/g, "$1")
}

const PAF_ROOT = path.resolve(__dirname, "..", "paf-toolkit")
const BENCHMARK_PATH = path.join(PAF_ROOT, "data", "benchmark", "ethereum.yaml")
const NETWORKS_DIR = path.join(PAF_ROOT, "data", "networks")
const OUT_PATH = path.resolve(__dirname, "..", "data", "paf-data.json")

// ─── KPI envelope → raw value helpers ───────────────────────────────────────

type KPI<T> = { value: T; as_of: string; source: string; confidence: Confidence }
type RawProfile = {
  name: string
  ticker: string
  genesis_date: string
  consensus_type: string
  native_liquid_staking_flag?: boolean
  l1: Record<string, KPI<unknown>>
  l2: Record<string, KPI<unknown>>
  l3?: Record<string, KPI<unknown>>
  l41?: Record<string, KPI<unknown>>
  l42?: Record<string, KPI<unknown>>
}
type RawBenchmark = {
  snapshot: RawProfile
  history: Array<{
    quarter: string
    as_of: string
    stage: Stage
    staking_ratio_pct: number
    liquidization_rate_pct?: number | null
    defi_productivity_rate_pct?: number | null
    restaking_rate_pct?: number | null
    lst_tvl_usd?: number | null
    restaking_tvl_usd?: number | null
    note?: string | null
  }>
}

function getNum(kpi: KPI<unknown> | undefined): number | null {
  if (kpi == null) return null
  return typeof kpi.value === "number" ? kpi.value : null
}

function getBool(kpi: KPI<unknown> | undefined): boolean | null {
  if (kpi == null) return null
  return typeof kpi.value === "boolean" ? kpi.value : null
}

function getInt(kpi: KPI<unknown> | undefined): number | null {
  if (kpi == null) return null
  return typeof kpi.value === "number" ? Math.floor(kpi.value) : null
}

function lowestConfidence(profile: RawProfile): Confidence {
  const rank: Record<Confidence, number> = {
    high: 4,
    medium: 3,
    low: 2,
    contested: 1,
    data_gap: 0,
  }
  const relevant: Confidence[] = [profile.l2.staking_ratio_pct.confidence]
  if (profile.l3) {
    relevant.push(profile.l3.liquidization_rate_pct.confidence)
    relevant.push(profile.l3.largest_lst_issuer_share_pct.confidence)
  }
  if (profile.l42) relevant.push(profile.l42.defi_productivity_rate_pct.confidence)
  if (profile.l41) relevant.push(profile.l41.restaking_tvl_usd.confidence)

  let worst = relevant[0]
  for (const c of relevant) if (rank[c] < rank[worst]) worst = c
  return worst
}

// ─── Profile flattening ─────────────────────────────────────────────────────

function flattenProfile(raw: RawProfile): Omit<PafSnapshot, "paf"> {
  return {
    name: raw.name,
    ticker: raw.ticker,
    circulatingSupply: getNum(raw.l1.circulating_supply)!,
    totalStaked: getNum(raw.l2.total_staked)!,
    stakingRatioPct: getNum(raw.l2.staking_ratio_pct)!,
    nativePriceUsd: getNum(raw.l1.native_price_usd)!,
    marketCapUsd: getNum(raw.l1.market_cap_usd)!,
    lstTvlUsd: raw.l3 ? getNum(raw.l3.lst_tvl_usd) : null,
    lstInDefiTvlUsd: raw.l42 ? getNum(raw.l42.lst_in_defi_tvl_usd) : null,
    restakingTvlUsd: raw.l41 ? getNum(raw.l41.restaking_tvl_usd) : null,
    pendleEquivalentTvlUsd: raw.l42 ? getNum(raw.l42.pendle_equivalent_tvl_usd) : null,
    activeValidators: getInt(raw.l2.active_validators)!,
    nakamotoCoefficient: getInt(raw.l2.nakamoto_coefficient)!,
    nominalYieldPct: getNum(raw.l2.nominal_yield_pct)!,
    realYieldPct: getNum(raw.l2.real_yield_pct)!,
    clientDiversityHhi: getNum(raw.l2.client_diversity_hhi)!,
    liquidizationRatePct: raw.l3 ? getNum(raw.l3.liquidization_rate_pct) : null,
    largestLstIssuerSharePct: raw.l3
      ? getNum(raw.l3.largest_lst_issuer_share_pct)
      : null,
    numLstIssuersAbove5pct: raw.l3
      ? getInt(raw.l3.num_lst_issuers_above_5pct)
      : null,
    nativeRedemptionAvailable: raw.l3
      ? getBool(raw.l3.native_redemption_available)
      : null,
    restakingRatePct: raw.l41 ? getNum(raw.l41.restaking_rate_pct) : null,
    avsCountLive: raw.l41 ? getInt(raw.l41.avs_count_live) : null,
    lrtCount: raw.l41 ? getInt(raw.l41.lrt_count) : null,
    defiProductivityRatePct: raw.l42
      ? getNum(raw.l42.defi_productivity_rate_pct)
      : null,
    numLendingIntegrations: raw.l42
      ? getInt(raw.l42.num_lending_integrations)
      : null,
    numAmmIntegrations: raw.l42 ? getInt(raw.l42.num_amm_integrations) : null,
    loopingSupported: raw.l42 ? getBool(raw.l42.looping_supported) : null,
  }
}

// ─── Main ───────────────────────────────────────────────────────────────────

function flattenHistory(raw: RawBenchmark["history"]): HistoricalSnapshot[] {
  return raw.map((h) => ({
    quarter: h.quarter,
    asOf: h.as_of,
    stage: h.stage,
    stakingRatioPct: h.staking_ratio_pct,
    liquidizationRatePct: h.liquidization_rate_pct ?? null,
    defiProductivityRatePct: h.defi_productivity_rate_pct ?? null,
    restakingRatePct: h.restaking_rate_pct ?? null,
    lstTvlUsd: h.lst_tvl_usd ?? null,
    restakingTvlUsd: h.restaking_tvl_usd ?? null,
    note: h.note ?? null,
  }))
}

function buildSnapshot(
  raw: RawProfile,
  ethBase: Omit<PafSnapshot, "paf">,
  history: HistoricalSnapshot[],
): PafSnapshot {
  const base = flattenProfile(raw)
  const stage = classifyStage(base, raw.native_liquid_staking_flag === true)
  const ratios = computeConversionRatios(base)
  const traj = trajectoryPosition(base, history)
  const vsEth = scoreVsEthereum(base, ethBase)
  const { strengths, gaps } = strengthsAndGaps(base, ethBase, stage)

  return {
    ...base,
    paf: {
      stage,
      classificationConfidence: lowestConfidence(raw),
      conversionRatios: ratios,
      trajectory: traj.description,
      nearestQuarter: traj.nearestQuarter,
      vsEthScores: vsEth,
      strengths,
      gaps,
      bdRecommendation: bdRecommendation(stage),
    },
  }
}

function main() {
  if (!fs.existsSync(BENCHMARK_PATH)) {
    console.error(`Benchmark YAML not found at ${BENCHMARK_PATH}`)
    process.exit(1)
  }

  const benchRaw = parseYaml(stripNumericUnderscores(fs.readFileSync(BENCHMARK_PATH, "utf-8"))) as RawBenchmark
  const history = flattenHistory(benchRaw.history)
  const ethBase = flattenProfile(benchRaw.snapshot)
  const ethereum = buildSnapshot(benchRaw.snapshot, ethBase, history)

  const networks: Record<string, PafSnapshot> = {}
  if (fs.existsSync(NETWORKS_DIR)) {
    for (const file of fs.readdirSync(NETWORKS_DIR)) {
      if (!file.endsWith(".yaml") || file.startsWith("_")) continue
      const raw = parseYaml(
        stripNumericUnderscores(
          fs.readFileSync(path.join(NETWORKS_DIR, file), "utf-8"),
        ),
      ) as RawProfile
      networks[raw.ticker.toLowerCase()] = buildSnapshot(raw, ethBase, history)
    }
  }

  const out: PafDataFile = {
    generatedAt: new Date().toISOString(),
    benchmarkAsOf: benchRaw.snapshot.l1.native_price_usd.as_of,
    ethereum,
    ethereumHistory: history,
    networks,
  }

  fs.writeFileSync(OUT_PATH, JSON.stringify(out, null, 2) + "\n")
  console.log(`Wrote ${OUT_PATH}`)
  console.log(`  Ethereum: stage=${ethereum.paf.stage}, mc=$${(ethereum.marketCapUsd / 1e9).toFixed(1)}B`)
  console.log(`  Networks: ${Object.keys(networks).length}`)
  console.log(`  History: ${history.length} quarters`)
}

main()
