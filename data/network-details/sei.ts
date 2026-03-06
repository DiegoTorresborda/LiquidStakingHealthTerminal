import type { NetworkDetailData } from "@/features/network-detail/types";

export const seiDetail: NetworkDetailData = {
  summary: {
    networkId: "sei",
    networkName: "Sei",
    token: "SEI",
    category: "High-throughput trading L1",
    marketCapUsd: 3300000000,
    stakingRatioPct: 52,
    stakingApyPct: 7.4,
    defiTvlUsd: 450000000,
    globalLstHealthScore: 66,
    opportunityScore: 82,
    lpAttractiveness: "Medium",
    diagnosis:
      "Sei has a credible staking base and improving liquidity footprint, but LST DeFi integration and collateral utility remain the main blockers for stronger LP fit."
  },
  modules: [
    {
      name: "Liquidity & Exit",
      score: 64,
      rationale: "Core pools exist with reasonable depth for mid-size orders, but exits still depend on limited stable routing.",
      keyMetrics: [
        { label: "LST TVL", value: "$210M" },
        { label: "Stablecoin Liquidity", value: "$140M" },
        { label: "Slippage @ $100k", value: "0.9%" },
        { label: "Slippage @ $500k", value: "3.1%" }
      ],
      keyInsight: "Exit path is workable for normal flow but fragile at larger deployment sizes.",
      riskWarning: "Stable routing concentration remains a structural constraint."
    },
    {
      name: "Peg Stability",
      score: 68,
      rationale: "Peg tracks close to NAV in normal regimes with moderate deviation in volatile windows.",
      keyMetrics: [
        { label: "Avg Discount (30d)", value: "-0.5%" },
        { label: "Max Discount (30d)", value: "-2.2%" },
        { label: "Redemption Path", value: "Available" },
        { label: "Queue Visibility", value: "Medium" }
      ],
      keyInsight: "Stability is acceptable but still partly liquidity-led rather than redemption-led.",
      riskWarning: "Queue behavior under stress is not fully transparent."
    },
    {
      name: "DeFi Moneyness",
      score: 55,
      rationale: "LST utility remains limited by missing collateral enablement in major lending surfaces.",
      keyMetrics: [
        { label: "Lending Integrations", value: "1" },
        { label: "Collateral Enabled", value: "No" },
        { label: "LST Protocols", value: "2" },
        { label: "LST Penetration", value: "12%" }
      ],
      keyInsight: "Adoption exists, but money-like utility remains underdeveloped.",
      riskWarning: "Weak collateral pathways cap structural demand growth."
    },
    {
      name: "Security & Governance",
      score: 71,
      rationale: "Risk controls are generally adequate with moderate governance centralization risk.",
      keyMetrics: [
        { label: "Audit Coverage", value: "Moderate" },
        { label: "Timelock", value: "Yes" },
        { label: "Signer Transparency", value: "Medium" },
        { label: "Admin Risk", value: "Medium" }
      ],
      keyInsight: "Security posture supports scale, but governance hardening remains an upgrade lever."
    },
    {
      name: "Validator Decentralization",
      score: 69,
      rationale: "Validator set is reasonably distributed, though concentration pressure can rise during rewards cycles.",
      keyMetrics: [
        { label: "Validator Count", value: "85" },
        { label: "Top-5 Share", value: "36%" },
        { label: "Avg Uptime", value: "98.2%" },
        { label: "Slashing Incidents", value: "Low" }
      ],
      keyInsight: "Decentralization is acceptable, not yet a major differentiator."
    },
    {
      name: "Incentive Sustainability",
      score: 61,
      rationale: "Activity quality is mixed, with material dependence on incentives for marginal liquidity.",
      keyMetrics: [
        { label: "Emissions Share", value: "57%" },
        { label: "Real Yield", value: "3.1%" },
        { label: "Emissions Yield", value: "4.3%" },
        { label: "TVL Decay Post-Cut", value: "20%" }
      ],
      keyInsight: "Durability improves when utility integrations are expanded."
    },
    {
      name: "Stress Resilience",
      score: 63,
      rationale: "Sei is resilient under moderate stress but faces stablecoin-exit fragility in sharper dislocations.",
      keyMetrics: [
        { label: "Stress Scenario", value: "Base token -40%" },
        { label: "Estimated LST Discount", value: "-5.4%" },
        { label: "Exit Haircut to USDC", value: "8.1%" },
        { label: "Estimated Queue", value: "7 days" }
      ],
      keyInsight: "Stress pathways are manageable but still liquidity-sensitive.",
      riskWarning: "Larger exits can amplify peg and haircut pressure."
    }
  ],
  opportunities: [
    {
      id: "sei-opp-1",
      title: "Enable LST collateral usage in core lending venues",
      impact: "Very High",
      linkedModule: "DeFi Moneyness",
      whyItMatters: "Collateral utility is the main missing step toward money-like LST demand.",
      expectedBenefit: "Raises structural demand floor and improves ecosystem composability.",
      implementationDifficulty: "Medium",
      timeHorizon: "Medium",
      confidenceLabel: "High"
    },
    {
      id: "sei-opp-2",
      title: "Deepen stablecoin routing for larger notional exits",
      impact: "High",
      linkedModule: "Liquidity & Exit",
      whyItMatters: "LP confidence depends on predictable exit quality under size and volatility.",
      expectedBenefit: "Reduces haircut risk and improves allocation capacity.",
      implementationDifficulty: "Medium",
      timeHorizon: "Short",
      confidenceLabel: "High"
    },
    {
      id: "sei-opp-3",
      title: "Publish clearer redemption and queue transparency metrics",
      impact: "Medium",
      linkedModule: "Peg Stability",
      whyItMatters: "Visibility improves peg trust during stress scenarios.",
      expectedBenefit: "Lowers uncertainty premiums for risk-aware LPs.",
      implementationDifficulty: "Low",
      timeHorizon: "Short",
      confidenceLabel: "Medium"
    }
  ],
  redFlags: [
    {
      id: "sei-flag-1",
      title: "LST collateral pathways remain underdeveloped",
      detail: "Most LST usage is still outside major credit primitives.",
      linkedModule: "DeFi Moneyness",
      severity: "High"
    },
    {
      id: "sei-flag-2",
      title: "Exit quality degrades at larger order sizes",
      detail: "Stablecoin route concentration amplifies stress haircuts.",
      linkedModule: "Liquidity & Exit",
      severity: "High"
    },
    {
      id: "sei-flag-3",
      title: "Incentive dependence remains material",
      detail: "Adoption durability still relies on subsidy support.",
      linkedModule: "Incentive Sustainability",
      severity: "Medium"
    }
  ],
  stressSnapshot: {
    scenario: "Base token drops 40% in 24h",
    estimatedLstDiscount: "-5.4%",
    estimatedExitHaircutToUsdc: "8.1%",
    estimatedRedeemQueueDelay: "7 days",
    contagionRisk: "Medium"
  },
  miniVisuals: {
    slippageCurve: [
      { tradeSizeUsd: 10000, slippagePct: 0.18 },
      { tradeSizeUsd: 50000, slippagePct: 0.52 },
      { tradeSizeUsd: 100000, slippagePct: 0.9 },
      { tradeSizeUsd: 250000, slippagePct: 1.8 },
      { tradeSizeUsd: 500000, slippagePct: 3.1 }
    ],
    pegDeviation: [-0.2, -0.3, -0.5, -0.7, -0.9, -0.8, -0.6, -0.4],
    defiUsageComposition: [
      { label: "LP Pools", sharePct: 51 },
      { label: "Lending", sharePct: 21 },
      { label: "Vaults", sharePct: 9 },
      { label: "Idle", sharePct: 19 }
    ],
    validatorConcentration: [
      { label: "Top 1", sharePct: 11 },
      { label: "Top 5", sharePct: 36 },
      { label: "Top 10", sharePct: 52 },
      { label: "Remaining", sharePct: 48 }
    ]
  }
};
