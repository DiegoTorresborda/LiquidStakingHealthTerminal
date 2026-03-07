import { MODULE_ORDER } from "@/config/scoring";
import { explicitNetworkDetails } from "@data/network-details";
import { networks, type Network } from "@data/networks";

import type { DetailModule, NetworkDetailData } from "@/features/network-detail/types";
import { resolveLpAttractivenessFromScore, scoreNetworkWithMockModel } from "@/features/scoring";

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

function applyScoring(detail: NetworkDetailData, network: Network): NetworkDetailData {
  const scoring = scoreNetworkWithMockModel(network);

  const modules = detail.modules.map((module) => {
    const computedScore = scoring.moduleScores[module.name];
    return {
      ...module,
      score: computedScore.finalScore
    };
  });

  const globalHealth = scoring.globalScore.finalScore;

  return {
    ...detail,
    summary: {
      ...detail.summary,
      globalLstHealthScore: globalHealth,
      lpAttractiveness: resolveLpAttractivenessFromScore(globalHealth)
    },
    modules,
    scoring
  };
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
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 1
  }).format(value);
}
