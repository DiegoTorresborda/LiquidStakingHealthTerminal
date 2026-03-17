import type { NetworkDetailData } from "@/features/network-detail/types";

export const varaDetail: NetworkDetailData = {
  summary: {
    networkId: "vara",
    networkName: "Vara",
    token: "VARA",
    category: "WASM-native L1",
    marketCapUsd: 4_973_758,
    stakingRatioPct: 39.34,
    stakingApyPct: 8.4,
    defiTvlUsd: 350_000,
    globalLstHealthScore: 0,       // computed by v2 engine
    opportunityScore: 0,           // computed by v2 engine
    lpAttractiveness: "Cautious",
    diagnosis:
      "Vara is an early-stage WASM-native L1 with healthy staking economics and a growing DeFi base (Invariant DEX, vStreet lending), but has no LST protocol yet. The single highest-leverage action is launching a liquid staking protocol — it would transition the network to LST-active scoring mode and unlock institutional LP demand."
  },

  modules: [
    {
      name: "Liquidity & Exit",
      score: 0,                    // computed by v2 engine
      rationale:
        "In pre-LST mode, exits are anchored to base-token DEX depth and the Vara–Ethereum bridge stable route. Both are functional but thin given the $5M market cap.",
      keyMetrics: [
        { label: "Base Token DEX Liquidity", value: "~$200K", description: "Estimated across Invariant and Rivr DEX" },
        { label: "Stable Exit Route", value: "Yes (wUSDC via ETH bridge)" },
        { label: "Stable Exit Liquidity", value: "~$100K" },
        { label: "Staking Ratio", value: "39.3%" }
      ],
      keyInsight:
        "Exit infrastructure is functional for small tickets but cannot support institutional-scale flows. Launching an LST would add a redemption anchor and a second exit dimension.",
      riskWarning:
        "Very small market cap means any meaningful sell pressure will cause outsized slippage."
    },
    {
      name: "Peg Stability",
      score: 0,
      rationale: "Not applicable in pre-LST mode — Peg Stability requires a live LST with a redemption mechanism.",
      keyMetrics: [],
      keyInsight: "This module activates once an LST is deployed. Launching an LST is the critical first step."
    },
    {
      name: "DeFi Moneyness",
      score: 0,                    // computed by v2 engine
      rationale:
        "Vara's DeFi ecosystem is nascent but structurally promising: the Invariant concentrated liquidity DEX and vStreet lending protocol are live, giving VARA more DeFi surface area than most pre-LST chains at this market cap.",
      keyMetrics: [
        { label: "DeFi TVL", value: "~$350K" },
        { label: "DeFi / Market Cap", value: "~7%" },
        { label: "Lending Presence", value: "Yes (vStreet)" },
        { label: "LST Collateral", value: "No" }
      ],
      keyInsight:
        "vStreet lending gives VARA an unusual advantage for a chain this size — lending infrastructure already exists for the LST to integrate into immediately after launch.",
      riskWarning:
        "DeFi TVL is very small in absolute terms. An LST launch must be accompanied by liquidity seeding to avoid thin-pool risk."
    },
    {
      name: "Security & Governance",
      score: 0,                    // computed by v2 engine
      rationale:
        "Pre-LST Security scoring is based on economic security (market cap) and decentralization (validator count). Vara's $5M market cap gives it very low economic security, though 59 validators provides moderate network decentralization.",
      keyMetrics: [
        { label: "Market Cap", value: "$4.97M", description: "Primary driver of economic security score in pre-LST mode" },
        { label: "Active Validators", value: "59" },
        { label: "Nomination Pools", value: "63" },
        { label: "Gear Protocol Audits", value: "Multiple (underlying infra)" }
      ],
      keyInsight:
        "The Gear Protocol — Vara's underlying execution engine — has been audited extensively, but the LST-specific codebase will require its own audits before launch.",
      riskWarning:
        "Economic security score will remain constrained until market cap grows significantly above the $50M threshold."
    },
    {
      name: "Validator Decentralization",
      score: 0,                    // computed by v2 engine
      rationale:
        "59 active validators is a reasonable starting set for a Substrate NPoS chain. The NPoS election algorithm provides natural stake distribution across elected validators.",
      keyMetrics: [
        { label: "Active Validators", value: "59" },
        { label: "Waiting Validators", value: "8" },
        { label: "Benchmark Commission", value: "5%" },
        { label: "Nomination Pools", value: "63 open" }
      ],
      keyInsight:
        "NPoS ensures even stake distribution among elected validators — decentralization quality is higher than raw count suggests. Growing to 100+ validators would further strengthen censorship resistance.",
      riskWarning:
        "Nominator concentration in a small number of popular pools could create indirect centralization pressure."
    },
    {
      name: "Incentive Sustainability",
      score: 0,                    // computed by v2 engine
      rationale:
        "With 8.4% staking APY and ~3.5% token inflation, VARA stakers earn a healthy real yield of approximately +4.9% — one of the stronger real yield profiles in the pre-LST universe. This makes VARA an attractive base for an LST yield product.",
      keyMetrics: [
        { label: "Staking APY", value: "8.4%" },
        { label: "Token Inflation", value: "~3.5%" },
        { label: "Real Yield (est.)", value: "+4.9%" },
        { label: "Staking Ratio", value: "39.3%" }
      ],
      keyInsight:
        "Positive real yield is a major advantage. An LST can pass this through to holders with a fee, creating a sustainable and competitive product from day one.",
      riskWarning:
        "Inflation rate is estimated from token issuance dynamics. Actual dilution may vary if treasury allocations or ecosystem funds are factored in."
    }
  ],

  opportunities: [],               // dynamically generated from v2 engine

  redFlags: [],                    // dynamically generated from v2 scoring

  stressSnapshot: {
    scenario: "Market drawdown — VARA price -60% in 30 days",
    estimatedLstDiscount: "N/A (no LST deployed)",
    estimatedExitHaircutToUsdc: "8–15% (thin stable exit at $100K depth)",
    estimatedRedeemQueueDelay: "N/A (no redemption mechanism)",
    contagionRisk: "Low"
  },

  miniVisuals: {
    validatorConcentration: [
      { label: "Top 10 validators", sharePct: 32 },
      { label: "Validators 11–30", sharePct: 35 },
      { label: "Validators 31–59", sharePct: 33 }
    ],
    defiUsageComposition: [
      { label: "Invariant DEX", sharePct: 45 },
      { label: "vStreet Lending", sharePct: 30 },
      { label: "Rivr DEX", sharePct: 15 },
      { label: "Other", sharePct: 10 }
    ]
  }
};
