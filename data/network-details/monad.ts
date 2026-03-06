import type { NetworkDetailData } from "@/features/network-detail/types";

export const monadDetail: NetworkDetailData = {
  summary: {
    networkId: "monad",
    networkName: "Monad",
    token: "MON",
    category: "High-performance EVM L1",
    marketCapUsd: 4200000000,
    stakingRatioPct: 48,
    stakingApyPct: 8.1,
    defiTvlUsd: 610000000,
    globalLstHealthScore: 71,
    opportunityScore: 86,
    lpAttractiveness: "Medium",
    diagnosis:
      "Monad shows strong validator decentralization and security posture, but the LST ecosystem remains constrained by shallow stablecoin exit depth and limited DeFi collateral integration."
  },
  modules: [
    {
      name: "Liquidity & Exit",
      score: 62,
      rationale:
        "Primary LST liquidity exists, but MON-to-stablecoin routing depth remains too shallow for larger LP exits.",
      keyMetrics: [
        { label: "LST Pool TVL", value: "$18.5M" },
        { label: "Slippage @ $100k", value: "0.65%" },
        { label: "Slippage @ $500k", value: "2.40%" },
        { label: "Stablecoin Liquidity", value: "$210M" }
      ],
      keyInsight: "The limiting factor is not staking demand but clean conversion into stablecoin liquidity.",
      riskWarning: "Exit to USDC becomes materially inefficient at larger sizes."
    },
    {
      name: "Peg Stability",
      score: 74,
      rationale:
        "Peg behavior is generally stable, but stress confidence still depends on visible redemption and queue quality.",
      keyMetrics: [
        { label: "Avg Discount (30d)", value: "-0.35%" },
        { label: "Max Discount (30d)", value: "-1.9%" },
        { label: "Redemption Path", value: "Available" },
        { label: "Estimated Redeem Time", value: "4 days" }
      ],
      keyInsight: "Normal market anchoring is acceptable; stress anchoring is only partially validated.",
      riskWarning: "Queue transparency remains medium under stress assumptions."
    },
    {
      name: "DeFi Moneyness",
      score: 58,
      rationale:
        "The LST exists in DeFi, but collateral relevance is still too narrow to be systemically money-like.",
      keyMetrics: [
        { label: "Lending Integrations", value: "1" },
        { label: "Collateral Caps", value: "$5.0M" },
        { label: "Avg LTV", value: "52%" },
        { label: "Idle Share", value: "12%" }
      ],
      keyInsight: "Utility is present but not yet broad enough to create durable demand floor.",
      riskWarning: "Collateral acceptance is still too small to support larger allocations."
    },
    {
      name: "Security & Governance",
      score: 76,
      rationale:
        "Governance and security controls are supportive, with room for more conservative hardening.",
      keyMetrics: [
        { label: "Audits", value: "2" },
        { label: "Bug Bounty", value: "Yes" },
        { label: "Timelock", value: "Yes" },
        { label: "Multisig Transparency", value: "High" }
      ],
      keyInsight: "Risk controls are ahead of liquidity and moneyness maturity.",
      riskWarning: "Upgrade controls are not yet at top conservative benchmark."
    },
    {
      name: "Validator Decentralization",
      score: 81,
      rationale: "Validator footprint is broad with strong uptime and manageable concentration.",
      keyMetrics: [
        { label: "Active Validators", value: "132" },
        { label: "Top-5 Share", value: "29%" },
        { label: "Top-10 Share", value: "44%" },
        { label: "Avg Uptime", value: "98.7%" }
      ],
      keyInsight: "This is one of the strongest structural pillars for LP confidence.",
      riskWarning: "Monitor concentration drift as staked value scales."
    },
    {
      name: "Incentive Sustainability",
      score: 64,
      rationale: "Incentives still drive significant usage, though early organic demand is visible.",
      keyMetrics: [
        { label: "Real Yield", value: "3.4%" },
        { label: "Emissions Yield", value: "4.9%" },
        { label: "Emissions Share", value: "59%" },
        { label: "TVL Decay Post-Cut", value: "18%" }
      ],
      keyInsight: "Liquidity quality is improving but still dependent on emissions support.",
      riskWarning: "Mercenary flow risk remains non-trivial."
    },
    {
      name: "Stress Resilience",
      score: 66,
      rationale:
        "Resilience is moderate; network likely bends before it breaks, but stablecoin flight remains a key vulnerability.",
      keyMetrics: [
        { label: "Stress Scenario", value: "Base token -40%" },
        { label: "Estimated LST Discount", value: "-4.8%" },
        { label: "Exit Haircut to USDC", value: "7.2%" },
        { label: "Estimated Queue", value: "8 days" }
      ],
      keyInsight: "Stress risk is concentrated in stablecoin exits and collateral contagion pathways.",
      riskWarning: "USDC exit haircut can become significant during runs to stables."
    }
  ],
  opportunities: [
    {
      id: "monad-opp-1",
      title: "Deepen MON-to-USDC exit liquidity",
      impact: "Very High",
      linkedModule: "Liquidity & Exit",
      whyItMatters:
        "Serious LPs need a credible route from LST exposure into stablecoins without severe haircut.",
      expectedBenefit: "Improves exitability and raises confidence for larger deployments.",
      implementationDifficulty: "Medium",
      timeHorizon: "Short",
      confidenceLabel: "High"
    },
    {
      id: "monad-opp-2",
      title: "Expand LST collateral usage in lending",
      impact: "Very High",
      linkedModule: "DeFi Moneyness",
      whyItMatters: "Money-like collateral utility is required for structural LST demand.",
      expectedBenefit: "Raises demand floor and improves capital efficiency across DeFi.",
      implementationDifficulty: "Medium",
      timeHorizon: "Medium",
      confidenceLabel: "High"
    },
    {
      id: "monad-opp-3",
      title: "Reduce incentive dependence",
      impact: "High",
      linkedModule: "Incentive Sustainability",
      whyItMatters: "Durable liquidity should be driven by utility and fees, not emissions alone.",
      expectedBenefit: "Improves long-term quality and trustworthiness of liquidity.",
      implementationDifficulty: "Medium",
      timeHorizon: "Medium",
      confidenceLabel: "Medium"
    },
    {
      id: "monad-opp-4",
      title: "Improve redemption transparency and queue visibility",
      impact: "Medium",
      linkedModule: "Peg Stability",
      whyItMatters: "Clearer queue mechanics reduce uncertainty in stress conditions.",
      expectedBenefit: "Strengthens peg confidence for risk-aware LPs.",
      implementationDifficulty: "Low",
      timeHorizon: "Short",
      confidenceLabel: "Medium"
    }
  ],
  redFlags: [
    {
      id: "monad-flag-1",
      title: "Stablecoin exit depth remains below institutional comfort",
      detail: "Exit quality deteriorates rapidly beyond mid-size notional.",
      linkedModule: "Liquidity & Exit",
      severity: "High"
    },
    {
      id: "monad-flag-2",
      title: "LST utility is too concentrated in basic LP usage",
      detail: "Collateral and strategy integrations are still narrow.",
      linkedModule: "DeFi Moneyness",
      severity: "High"
    },
    {
      id: "monad-flag-3",
      title: "Incentive support still drives a large share of adoption",
      detail: "Fee-driven and organic demand remains emerging.",
      linkedModule: "Incentive Sustainability",
      severity: "Medium"
    }
  ],
  stressSnapshot: {
    scenario: "Base token drops 40% in 24h",
    estimatedLstDiscount: "-4.8%",
    estimatedExitHaircutToUsdc: "7.2%",
    estimatedRedeemQueueDelay: "8 days",
    contagionRisk: "Medium"
  },
  miniVisuals: {
    slippageCurve: [
      { tradeSizeUsd: 10000, slippagePct: 0.12 },
      { tradeSizeUsd: 25000, slippagePct: 0.28 },
      { tradeSizeUsd: 50000, slippagePct: 0.44 },
      { tradeSizeUsd: 100000, slippagePct: 0.65 },
      { tradeSizeUsd: 250000, slippagePct: 1.45 },
      { tradeSizeUsd: 500000, slippagePct: 2.4 },
      { tradeSizeUsd: 1000000, slippagePct: 4.9 }
    ],
    pegDeviation: [-0.1, -0.15, -0.08, -0.22, -0.35, -0.4, -0.31, -0.27, -0.18, -0.12],
    defiUsageComposition: [
      { label: "Lending", sharePct: 34 },
      { label: "LP Pools", sharePct: 46 },
      { label: "Vaults", sharePct: 8 },
      { label: "Idle", sharePct: 12 }
    ],
    validatorConcentration: [
      { label: "Top 1", sharePct: 8 },
      { label: "Top 5", sharePct: 29 },
      { label: "Top 10", sharePct: 44 },
      { label: "Remaining", sharePct: 56 }
    ]
  }
};
