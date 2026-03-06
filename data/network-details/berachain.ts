import type { NetworkDetailData } from "@/features/network-detail/types";

export const berachainDetail: NetworkDetailData = {
  summary: {
    networkId: "berachain",
    networkName: "Berachain",
    token: "BERA",
    category: "DeFi-native L1",
    marketCapUsd: 2600000000,
    stakingRatioPct: 43,
    stakingApyPct: 9.3,
    defiTvlUsd: 890000000,
    globalLstHealthScore: 63,
    opportunityScore: 91,
    lpAttractiveness: "Opportunistic",
    diagnosis:
      "Berachain shows strong DeFi energy and high upside, but LST penetration, collateral utility, and resilience under stablecoin exits still lag a mature LP-ready profile."
  },
  modules: [
    {
      name: "Liquidity & Exit",
      score: 61,
      rationale:
        "DeFi activity is strong, but LST-specific exit quality remains uneven across market conditions.",
      keyMetrics: [
        { label: "LST TVL", value: "$210M" },
        { label: "Stablecoin Liquidity", value: "$300M" },
        { label: "Slippage @ $100k", value: "1.1%" },
        { label: "Slippage @ $500k", value: "3.4%" }
      ],
      keyInsight: "General liquidity is not yet translating into robust LST-specific exitability.",
      riskWarning: "Larger exits can still face material execution penalty."
    },
    {
      name: "Peg Stability",
      score: 65,
      rationale:
        "Peg quality is serviceable in normal markets but sensitive to temporary depth withdrawals.",
      keyMetrics: [
        { label: "Avg Discount (30d)", value: "-0.7%" },
        { label: "Max Discount (30d)", value: "-2.9%" },
        { label: "Redemption Path", value: "Partial" },
        { label: "Queue Visibility", value: "Low-Medium" }
      ],
      keyInsight: "Peg anchoring still depends more on pool incentives than robust redemption mechanics.",
      riskWarning: "Queue opacity can amplify confidence shocks."
    },
    {
      name: "DeFi Moneyness",
      score: 59,
      rationale:
        "Ecosystem TVL is healthy, but LST is not yet positioned as core collateral money.",
      keyMetrics: [
        { label: "Lending Integrations", value: "1" },
        { label: "LST Collateral", value: "Disabled" },
        { label: "LST Penetration", value: "14%" },
        { label: "Largest LST", value: "stBERA" }
      ],
      keyInsight: "The biggest upside is turning DeFi depth into LST-centered utility.",
      riskWarning: "Without collateral utility, demand remains structurally shallow."
    },
    {
      name: "Security & Governance",
      score: 67,
      rationale: "Governance and security controls are improving but not yet institution-grade hardened.",
      keyMetrics: [
        { label: "Audit Coverage", value: "Moderate" },
        { label: "Timelock", value: "Partial" },
        { label: "Signer Transparency", value: "Medium" },
        { label: "Admin Risk", value: "Medium" }
      ],
      keyInsight: "Security posture is adequate for growth but needs stronger formal controls."
    },
    {
      name: "Validator Decentralization",
      score: 64,
      rationale: "Validator structure is functional with room to improve delegation breadth over time.",
      keyMetrics: [
        { label: "Validator Count", value: "69" },
        { label: "Top-5 Share", value: "41%" },
        { label: "Avg Uptime", value: "97.8%" },
        { label: "Slashing Incidents", value: "Low" }
      ],
      keyInsight: "Current concentration is manageable but should be monitored as TVL scales."
    },
    {
      name: "Incentive Sustainability",
      score: 62,
      rationale: "Growth is high, but incentives still explain a large portion of sticky liquidity behavior.",
      keyMetrics: [
        { label: "Emissions Share", value: "63%" },
        { label: "Real Yield", value: "3.0%" },
        { label: "Emissions Yield", value: "6.3%" },
        { label: "TVL Decay Post-Cut", value: "24%" }
      ],
      keyInsight: "Opportunity is high if utility can replace subsidy-driven usage."
    },
    {
      name: "Stress Resilience",
      score: 60,
      rationale: "Stress response remains the weakest area, especially around stablecoin exits and contagion pathways.",
      keyMetrics: [
        { label: "Stress Scenario", value: "Base token -40%" },
        { label: "Estimated LST Discount", value: "-6.1%" },
        { label: "Exit Haircut to USDC", value: "9.4%" },
        { label: "Estimated Queue", value: "9 days" }
      ],
      keyInsight: "Network can absorb moderate shocks but not yet with tight haircut bounds.",
      riskWarning: "Run-to-stable scenario still shows meaningful fragility."
    }
  ],
  opportunities: [
    {
      id: "bera-opp-1",
      title: "Make LST a core collateral asset in lending",
      impact: "Very High",
      linkedModule: "DeFi Moneyness",
      whyItMatters: "Berachain's strongest upside is converting DeFi depth into LST-centered money utility.",
      expectedBenefit: "Creates structural demand and strengthens LP attractiveness.",
      implementationDifficulty: "Medium",
      timeHorizon: "Medium",
      confidenceLabel: "High"
    },
    {
      id: "bera-opp-2",
      title: "Increase LST penetration through validator and staking pathways",
      impact: "Very High",
      linkedModule: "Liquidity & Exit",
      whyItMatters: "Higher penetration improves depth, routing, and ecosystem relevance of the LST layer.",
      expectedBenefit: "Improves liquidity quality and reduces concentration risk in pool dynamics.",
      implementationDifficulty: "Medium",
      timeHorizon: "Medium",
      confidenceLabel: "High"
    },
    {
      id: "bera-opp-3",
      title: "Harden stress controls for stablecoin exits",
      impact: "High",
      linkedModule: "Stress Resilience",
      whyItMatters: "Stablecoin flight is the main LP-facing fragility under stress.",
      expectedBenefit: "Reduces modeled haircuts and improves confidence in adverse regimes.",
      implementationDifficulty: "High",
      timeHorizon: "Long",
      confidenceLabel: "Medium"
    }
  ],
  redFlags: [
    {
      id: "bera-flag-1",
      title: "LST penetration remains low for a DeFi-heavy ecosystem",
      detail: "Ecosystem depth has not yet translated into strong LST monetary position.",
      linkedModule: "DeFi Moneyness",
      severity: "High"
    },
    {
      id: "bera-flag-2",
      title: "Stress exit haircuts are still elevated",
      detail: "Stablecoin exit quality weakens quickly during shock scenarios.",
      linkedModule: "Stress Resilience",
      severity: "High"
    },
    {
      id: "bera-flag-3",
      title: "Incentives remain a major adoption driver",
      detail: "Usage durability is not yet fully organic.",
      linkedModule: "Incentive Sustainability",
      severity: "Medium"
    }
  ],
  stressSnapshot: {
    scenario: "Base token drops 40% in 24h",
    estimatedLstDiscount: "-6.1%",
    estimatedExitHaircutToUsdc: "9.4%",
    estimatedRedeemQueueDelay: "9 days",
    contagionRisk: "High"
  },
  miniVisuals: {
    slippageCurve: [
      { tradeSizeUsd: 10000, slippagePct: 0.22 },
      { tradeSizeUsd: 50000, slippagePct: 0.7 },
      { tradeSizeUsd: 100000, slippagePct: 1.1 },
      { tradeSizeUsd: 250000, slippagePct: 2.1 },
      { tradeSizeUsd: 500000, slippagePct: 3.4 }
    ],
    pegDeviation: [-0.3, -0.5, -0.9, -1.3, -1.1, -0.8, -0.6],
    defiUsageComposition: [
      { label: "LP Pools", sharePct: 57 },
      { label: "Lending", sharePct: 18 },
      { label: "Vaults", sharePct: 11 },
      { label: "Idle", sharePct: 14 }
    ],
    validatorConcentration: [
      { label: "Top 1", sharePct: 14 },
      { label: "Top 5", sharePct: 41 },
      { label: "Top 10", sharePct: 58 },
      { label: "Remaining", sharePct: 42 }
    ]
  }
};
