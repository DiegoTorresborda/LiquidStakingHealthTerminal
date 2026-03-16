import { MODULE_ORDER } from "@/config/scoring";
import { explicitNetworkDetails } from "@data/network-details";
import { networks, type Network } from "@data/networks";
import networksGenerated from "@data/networks.generated.json";

import type { DetailMetric, DetailModule, DetailRedFlag, NetworkDetailData } from "@/features/network-detail/types";
import { resolveLpAttractivenessFromScore, scoreNetworkWithMockModel } from "@/features/scoring";
import type { RadarOverviewRecord } from "@/data/radar-overview-schema";
import { computeV2Score } from "@/features/scoring/v2/index";
import type { V2ScoringResult } from "@/features/scoring/v2/index";
import { adaptV2ToLstResult } from "@/features/scoring/v2/adapter";
import { computeMaxPotentialScore, detectOpportunities } from "@/features/improvement-plan/opportunity-detector";
import type { ImprovementOpportunity } from "@/features/improvement-plan/types";
import { formatUsdCompactStable } from "@/lib/number-format";

const radarRecords = networksGenerated as unknown as RadarOverviewRecord[];

function getRadarRecord(networkId: string): RadarOverviewRecord | undefined {
  return radarRecords.find((r) => r.networkId === networkId);
}

export function getAllNetworkIds(): string[] {
  return networks.map((network) => network.networkId);
}

export function getNetworkById(networkId: string): Network | undefined {
  return networks.find((network) => network.networkId === networkId);
}

export function getNetworkDetailById(networkId: string): NetworkDetailData | undefined {
  const network = getNetworkById(networkId);

  if (!network) {
    return undefined;
  }

  const baseDetail = explicitNetworkDetails[networkId] ?? buildFallbackDetail(network);
  return applyScoring(baseDetail, network);
}

export function getScoredGlobalHealth(network: Network): number {
  const radarRecord = getRadarRecord(network.networkId);
  if (radarRecord) return computeV2Score(radarRecord).globalScore;
  return scoreNetworkWithMockModel(network).globalScore.finalScore;
}

function buildFallbackDetail(network: Network): NetworkDetailData {
  const lpAttractiveness = resolveLpAttractivenessFromScore(network.globalLstHealthScore);

  const modules = MODULE_ORDER.map((moduleName, index) => {
    const score = clamp(Math.round(network.globalLstHealthScore + FALLBACK_MODULE_OFFSETS[index]), 35, 92);

    return {
      name: moduleName,
      score,
      rationale: buildModuleRationale(moduleName, network),
      keyMetrics: buildModuleMetrics(moduleName, network),
      keyInsight: buildModuleInsight(moduleName, network),
      riskWarning: buildModuleRisk(moduleName, network)
    } satisfies DetailModule;
  });

  return {
    summary: {
      networkId: network.networkId,
      networkName: network.network,
      token: network.token,
      category: network.category,
      marketCapUsd: network.marketCapUsd,
      stakingRatioPct: network.stakingRatioPct,
      stakingApyPct: network.stakingApyPct,
      defiTvlUsd: network.defiTvlUsd,
      globalLstHealthScore: network.globalLstHealthScore,
      opportunityScore: network.opportunityScore,
      lpAttractiveness,
      diagnosis: `${network.network} shows ${network.mainBottleneck.toLowerCase()} pressure today, with the clearest upgrade path through ${network.mainOpportunity.toLowerCase()}.`
    },
    modules,
    opportunities: [
      {
        id: `${network.networkId}-opp-1`,
        title: network.mainOpportunity,
        impact: network.opportunityScore >= 85 ? "Very High" : "High",
        linkedModule: "DeFi Moneyness",
        whyItMatters: "This is the highest-leverage way to improve LP attractiveness in the current profile.",
        expectedBenefit: "Improves demand durability and ecosystem investability.",
        confidenceLabel: "Medium"
      },
      {
        id: `${network.networkId}-opp-2`,
        title: "Deepen stablecoin exit liquidity",
        impact: "High",
        linkedModule: "Liquidity & Exit",
        whyItMatters: "Exit quality is a gating condition for serious LP allocations.",
        expectedBenefit: "Reduces haircut risk and improves confidence during volatility.",
        confidenceLabel: "Medium"
      },
      {
        id: `${network.networkId}-opp-3`,
        title: "Expand LST collateral pathways",
        impact: "Medium",
        linkedModule: "DeFi Moneyness",
        whyItMatters: "Collateral utility is required for money-like LST demand.",
        expectedBenefit: "Improves composability and structural usage.",
        confidenceLabel: "Medium"
      }
    ],
    redFlags: [
      {
        id: `${network.networkId}-flag-1`,
        title: network.mainBottleneck,
        detail: "Current profile indicates this remains the main blocker for broader LP participation.",
        linkedModule: "Liquidity & Exit",
        severity: "High"
      },
      {
        id: `${network.networkId}-flag-2`,
        title: "Stress pathways remain partially constrained",
        detail: "Modeled exits can still face non-trivial slippage and queue delays.",
        linkedModule: "Stress Resilience",
        severity: "Medium"
      }
    ],
    stressSnapshot: {
      scenario: "Base token drops 40% in 24h",
      estimatedLstDiscount: `${(-1 * (8.4 - network.globalLstHealthScore / 12)).toFixed(1)}%`,
      estimatedExitHaircutToUsdc: `${(11.5 - network.globalLstHealthScore / 8).toFixed(1)}%`,
      estimatedRedeemQueueDelay: `${Math.max(3, Math.round(12 - network.globalLstHealthScore / 9))} days`,
      contagionRisk: resolveContagion(network.globalLstHealthScore)
    },
    miniVisuals: {
      slippageCurve: [
        { tradeSizeUsd: 10000, slippagePct: 0.2 },
        { tradeSizeUsd: 50000, slippagePct: 0.6 },
        { tradeSizeUsd: 100000, slippagePct: 1.0 },
        { tradeSizeUsd: 250000, slippagePct: 2.1 },
        { tradeSizeUsd: 500000, slippagePct: 3.3 }
      ],
      pegDeviation: [-0.2, -0.3, -0.6, -0.5, -0.4, -0.7, -0.5],
      defiUsageComposition: [
        { label: "LP Pools", sharePct: 52 },
        { label: "Lending", sharePct: 23 },
        { label: "Vaults", sharePct: 10 },
        { label: "Idle", sharePct: 15 }
      ],
      validatorConcentration: [
        { label: "Top 1", sharePct: 10 },
        { label: "Top 5", sharePct: 35 },
        { label: "Top 10", sharePct: 51 },
        { label: "Remaining", sharePct: 49 }
      ]
    }
  };
}

// ─── V2-aware red flag generator ─────────────────────────────────────────────

function buildV2RedFlags(
  v2Result: V2ScoringResult,
  record: RadarOverviewRecord,
  opportunities: ImprovementOpportunity[]
): DetailRedFlag[] {
  const flags: DetailRedFlag[] = [];

  /** Find the best-matching opportunity for a given module */
  const linkOpp = (moduleName: string) => {
    const opp = opportunities.find((o) => o.module === moduleName || o.module.includes(moduleName));
    return { linkedOpportunityId: opp?.id, linkedOpportunityTitle: opp?.title };
  };

  // 1. Pre-LST: no LST deployed
  if (v2Result.mode === "pre-lst") {
    const launchOpp = opportunities.find((o) => o.id === "strategic-launch-lst");
    flags.push({
      id: "flag-no-lst",
      title: "No LST protocol deployed",
      detail:
        "This network operates in pre-LST mode. Without an LST, the scoring ceiling is structurally lower and institutional LP demand cannot materialize.",
      severity: "High",
      linkedOpportunityId: launchOpp?.id,
      linkedOpportunityTitle: launchOpp?.title,
    });
  }

  // 2. Score caps — highest severity signals
  for (const [moduleName, moduleResult] of Object.entries(v2Result.moduleScores)) {
    if (!moduleResult.capApplied) continue;
    const severity: DetailRedFlag["severity"] = moduleResult.finalScore < 35 ? "High" : "Medium";
    const link = linkOpp(moduleName);
    flags.push({
      id: `flag-cap-${moduleName}`.replace(/[\s&+]/g, "-").toLowerCase(),
      title: `${moduleName} score is hard-capped`,
      detail: `A score cap is active on ${moduleName} (reason: "${moduleResult.capApplied.reason}"). This limits the module regardless of other improvements — resolving it is the highest-leverage action for this module.`,
      linkedModule: moduleName as DetailRedFlag["linkedModule"],
      severity,
      ...link,
    });
  }

  // 3. Critically low modules (< 35, no cap — raw underperformance)
  for (const [moduleName, moduleResult] of Object.entries(v2Result.moduleScores)) {
    if (moduleResult.capApplied) continue; // already flagged above
    if (moduleResult.finalScore >= 35) continue;
    const link = linkOpp(moduleName);
    flags.push({
      id: `flag-low-${moduleName}`.replace(/[\s&+]/g, "-").toLowerCase(),
      title: `${moduleName} is critically underperforming`,
      detail: `${moduleName} scores ${moduleResult.finalScore}/100, indicating structural weaknesses that limit LP attractiveness. Immediate action is recommended.`,
      linkedModule: moduleName as DetailRedFlag["linkedModule"],
      severity: "High",
      ...link,
    });
  }

  // 4. Negative real yield
  const apy = record.stakingApyPct ?? 0;
  const infl = record.inflationRatePct ?? 0;
  if (apy - infl < -1) {
    const link = linkOpp("Incentive Sustainability");
    flags.push({
      id: "flag-negative-real-yield",
      title: "Negative real yield",
      detail: `Staking APY (${apy}%) is below inflation (${infl}%), meaning stakers lose real purchasing power. This is a structural deterrent for long-term capital allocation.`,
      linkedModule: "Incentive Sustainability",
      severity: "Medium",
      ...link,
    });
  }

  // Sort: High first, then Medium, then Low; deduplicate by id
  const seen = new Set<string>();
  const severityOrder = { High: 0, Medium: 1, Low: 2 };
  return flags
    .filter((f) => {
      if (seen.has(f.id)) return false;
      seen.add(f.id);
      return true;
    })
    .sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity])
    .slice(0, 5);
}

function applyScoring(detail: NetworkDetailData, network: Network): NetworkDetailData {
  const radarRecord = getRadarRecord(network.networkId);
  const v2Result = radarRecord ? computeV2Score(radarRecord) : null;
  const scoring = v2Result
    ? adaptV2ToLstResult(v2Result)
    : scoreNetworkWithMockModel(network);

  const modules = detail.modules
    .filter((module) => module.name !== "Stress Resilience")
    .map((module) => {
      const computedScore = scoring.moduleScores[module.name];
      const keyMetrics =
        radarRecord && v2Result
          ? buildV2ModuleMetrics(module.name, radarRecord, v2Result.mode)
          : module.keyMetrics;
      return {
        ...module,
        score: computedScore?.finalScore ?? module.score,
        keyMetrics
      };
    });

  const globalHealth = scoring.globalScore.finalScore;
  const opportunityScore = (radarRecord && v2Result)
    ? computeMaxPotentialScore(radarRecord, v2Result)
    : detail.summary.opportunityScore;

  // Build v2-aligned red flags when we have real scoring data
  const opportunities = (radarRecord && v2Result)
    ? detectOpportunities(radarRecord, v2Result)
    : null;
  const redFlags = (radarRecord && v2Result && opportunities)
    ? buildV2RedFlags(v2Result, radarRecord, opportunities)
    : detail.redFlags;

  return {
    ...detail,
    summary: {
      ...detail.summary,
      globalLstHealthScore: globalHealth,
      opportunityScore,
      lpAttractiveness: resolveLpAttractivenessFromScore(globalHealth),
      scoringMode: v2Result?.mode
    },
    modules,
    redFlags,
    scoring,
    radarRecord: radarRecord ?? undefined,
    v2Result: v2Result ?? undefined,
  };
}

function buildV2ModuleMetrics(
  moduleName: DetailModule["name"],
  r: RadarOverviewRecord,
  mode: "pre-lst" | "lst-active"
): DetailMetric[] {
  const usd = (v: number | null | undefined) => (v != null ? formatUsdCompact(v) : "N/A");
  const pct = (v: number | null | undefined) => (v != null ? `${v}%` : "N/A");
  const num = (v: number | null | undefined) =>
    v != null ? new Intl.NumberFormat("en-US").format(v) : "N/A";
  const bool = (v: boolean | null | undefined) =>
    v == null ? "N/A" : v ? "Yes" : "No";
  const days = (v: number | null | undefined) =>
    v != null ? `${v}d` : "Unknown";

  if (moduleName === "Liquidity & Exit") {
    if (mode === "lst-active") {
      return [
        { label: "LST DEX Liquidity", value: usd(r.lstDexLiquidityUsd), description: "Total liquidity of LST pairs on DEXes. Higher depth means lower slippage on large exits." },
        { label: "Stable Exit Depth", value: usd(r.stableExitLiquidityUsd), description: "Stablecoin liquidity available to absorb LST sells. Critical for USDC/USDT exit quality." },
        { label: "Unbonding Period", value: days(r.unbondingDays), description: "Days to redeem staked tokens via the protocol. Longer unbonding increases redemption risk." }
      ];
    }
    return [
      { label: "Base Token DEX Liq.", value: usd(r.baseTokenDexLiquidityUsd), description: "Native token DEX liquidity. Proxy for on-chain market depth before an LST exists." },
      { label: "Stable Exit Depth", value: usd(r.stableExitLiquidityUsd ?? (r.stablecoinLiquidityUsd != null ? r.stablecoinLiquidityUsd * 0.05 : null)), description: "Stablecoin liquidity available to exit the base token position." },
      { label: "Staking Ratio", value: pct(r.stakingRatioPct), description: "% of supply staked. Higher ratio signals committed capital but reduces liquid float." }
    ];
  }

  if (moduleName === "Peg Stability") {
    if (mode === "lst-active") {
      const buffer =
        r.stableExitLiquidityUsd != null && r.marketCapUsd != null && r.marketCapUsd > 0
          ? `${((r.stableExitLiquidityUsd / r.marketCapUsd) * 100).toFixed(2)}%`
          : "N/A";
      return [
        { label: "Unbonding Period", value: days(r.unbondingDays), description: "Days to redeem via protocol. Long unbonding slows peg arbitrage, increasing discount risk." },
        { label: "Stable Buffer / MktCap", value: buffer, description: "Stable exit liquidity as % of market cap. Measures the chain's capacity to defend the peg." },
        { label: "Redemption Exists", value: bool(r.hasLst), description: "Whether the protocol has a live redemption mechanism to anchor the LST price." }
      ];
    }
    return [
      { label: "DeFi TVL", value: usd(r.defiTvlUsd), description: "Total DeFi TVL on the chain. Deeper liquidity anchors the token price more reliably." },
      { label: "Staking Ratio", value: pct(r.stakingRatioPct), description: "% of supply staked. High staking ratio reduces circulating supply and supports price stability." },
      { label: "Market Cap", value: usd(r.marketCapUsd), description: "Network market cap. Larger networks have stronger price support and lower volatility." }
    ];
  }

  if (moduleName === "DeFi Moneyness") {
    if (mode === "lst-active") {
      return [
        { label: "LST Penetration", value: pct(r.lstPenetrationPct), description: "LST TVL as % of total staked value. Higher penetration signals broader adoption and utility." },
        { label: "DeFi TVL", value: usd(r.defiTvlUsd), description: "DeFi ecosystem depth. More TVL means more venues where the LST can be deployed." },
        { label: "LST Collateral", value: bool(r.lstCollateralEnabled), description: "Whether the LST is accepted as collateral in lending protocols — a key driver of money-like demand." }
      ];
    }
    return [
      { label: "DeFi TVL", value: usd(r.defiTvlUsd), description: "DeFi ecosystem TVL. Indicates how much liquidity the future LST could tap at launch." },
      { label: "Lending Presence", value: bool(r.lendingPresence), description: "Whether lending protocols exist on this chain. Required for collateral-based LST demand." },
      { label: "Market Cap", value: usd(r.marketCapUsd), description: "Network size. Larger markets have more capacity to absorb and sustain LST demand." }
    ];
  }

  if (moduleName === "Security & Governance") {
    if (mode === "lst-active") {
      return [
        { label: "Audits", value: r.auditCount != null ? String(r.auditCount) : "N/A", description: "Number of security audits completed on the LST protocol. More audits reduce unknown risk vectors." },
        { label: "Timelock", value: bool(r.hasTimelock), description: "Whether governance changes are time-locked. Timelocks reduce the attack surface for protocol upgrades." },
        { label: "LST Penetration", value: pct(r.lstPenetrationPct), description: "LST TVL / staked value. Used as a proxy for protocol maturity and market validation." }
      ];
    }
    return [
      { label: "Market Cap", value: usd(r.marketCapUsd), description: "Network market cap. Larger cap implies greater economic security for the base chain." },
      { label: "Validators", value: num(r.validatorCount), description: "Total active validators securing the network. More validators increase resilience." },
      { label: "Staking Ratio", value: pct(r.stakingRatioPct), description: "% of supply staked. Higher ratio means more economic weight actively securing the chain." }
    ];
  }

  if (moduleName === "Validator Decentralization") {
    return [
      { label: "Validator Count", value: num(r.validatorCount), description: "Total active validators. Higher count means more distributed consensus and lower censorship risk." },
      { label: "Verified Providers", value: num(r.verifiedProviders), description: "Institutional or verified staking providers. More diversity reduces concentration among large operators." },
      { label: "Benchmark Commission", value: pct(r.benchmarkCommissionPct), description: "Average validator commission. Lower benchmarks favor delegators and support broader participation." }
    ];
  }

  if (moduleName === "Incentive Sustainability") {
    if (mode === "lst-active") {
      return [
        { label: "Staking APY", value: pct(r.stakingApyPct), description: "Annual staking yield. Drives demand but risks inflation dependency if not backed by organic usage." },
        { label: "Inflation Rate", value: pct(r.inflationRatePct), description: "Annual token inflation. High inflation without utility growth dilutes holders and undermines rewards." },
        { label: "LST Penetration", value: pct(r.lstPenetrationPct), description: "LST TVL / staked. Higher penetration reduces reliance on external incentives for adoption." }
      ];
    }
    return [
      { label: "Staking APY", value: pct(r.stakingApyPct), description: "Annual staking yield driving pre-LST adoption. Signals reward attractiveness for validators." },
      { label: "Inflation Rate", value: pct(r.inflationRatePct), description: "Token inflation rate. High inflation without commensurate utility growth hurts long-term sustainability." },
      { label: "Staking Ratio", value: pct(r.stakingRatioPct), description: "% staked. High ratio indicates strong organic demand for staking rewards beyond pure incentives." }
    ];
  }

  return [];
}

const FALLBACK_MODULE_OFFSETS = [-4, 2, -5, 3, 1, -1, -2];

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function resolveContagion(score: number) {
  if (score >= 72) return "Low" as const;
  if (score >= 58) return "Medium" as const;
  return "High" as const;
}

function buildModuleRationale(moduleName: DetailModule["name"], network: Network): string {
  const shared = `${network.network} currently presents ${network.mainBottleneck.toLowerCase()} as a key constraint.`;

  if (moduleName === "DeFi Moneyness") {
    return `${shared} DeFi integration depth is central to unlocking stronger LST utility.`;
  }

  if (moduleName === "Liquidity & Exit") {
    return `${shared} Exitability remains a primary gating condition for larger LP allocation.`;
  }

  return `${shared} This module is part of the investability profile and requires continued hardening.`;
}

function buildModuleMetrics(moduleName: DetailModule["name"], network: Network) {
  if (moduleName === "Liquidity & Exit") {
    return [
      { label: "LST TVL", value: formatUsdCompact(network.lstTvlUsd) },
      { label: "Stablecoin Liquidity", value: formatUsdCompact(network.stablecoinLiquidityUsd) },
      { label: "LST Penetration", value: `${network.lstPenetrationPct}%` }
    ];
  }

  if (moduleName === "DeFi Moneyness") {
    return [
      { label: "DeFi TVL", value: formatUsdCompact(network.defiTvlUsd) },
      { label: "Lending Presence", value: network.lendingPresence ? "Yes" : "No" },
      { label: "LST Collateral", value: network.lstCollateralEnabled ? "Enabled" : "Disabled" }
    ];
  }

  if (moduleName === "Validator Decentralization") {
    return [
      { label: "Validator Count", value: new Intl.NumberFormat("en-US").format(network.validatorCount) },
      { label: "Staker Addresses", value: new Intl.NumberFormat("en-US").format(network.stakerAddresses) },
      { label: "% Staked", value: `${network.stakingRatioPct}%` }
    ];
  }

  return [
    { label: "Health Score", value: `${network.globalLstHealthScore}` },
    { label: "Opportunity Score", value: `${network.opportunityScore}` },
    { label: "Staking APY", value: `${network.stakingApyPct}%` }
  ];
}

function buildModuleInsight(moduleName: DetailModule["name"], network: Network): string {
  if (moduleName === "Liquidity & Exit") {
    return `Stablecoin pathway quality is central for moving from moderate to strong LP fit on ${network.network}.`;
  }

  if (moduleName === "DeFi Moneyness") {
    return `The highest-convexity upgrade is turning ${network.largestLst} into broader collateral utility.`;
  }

  if (moduleName === "Stress Resilience") {
    return "Stress outcomes still depend heavily on liquidity durability and queue behavior.";
  }

  return "Current posture is serviceable but still leaves clear room for structural improvement.";
}

function buildModuleRisk(moduleName: DetailModule["name"], network: Network): string | undefined {
  if (moduleName === "Liquidity & Exit") {
    return `${network.mainBottleneck} remains a first-order LP risk.`;
  }

  if (moduleName === "DeFi Moneyness" && !network.lstCollateralEnabled) {
    return "LST collateral pathways are still missing in key credit venues.";
  }

  if (moduleName === "Incentive Sustainability") {
    return "Usage durability can degrade if incentives compress without utility growth.";
  }

  return undefined;
}

function formatUsdCompact(value: number): string {
  return formatUsdCompactStable(value);
}
