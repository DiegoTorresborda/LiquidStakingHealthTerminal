import type { NetworkDetailData } from "@/features/network-detail/types";

export const zigchainDetail: NetworkDetailData = {
  summary: {
    networkId: "zigchain",
    networkName: "ZigChain",
    token: "ZIG",
    category: "DeFi-native L1",
    marketCapUsd: 53_598_810,
    stakingRatioPct: 16.19,
    stakingApyPct: 7.0,
    defiTvlUsd: 14_000_000,
    globalLstHealthScore: 0,        // computed by v2 engine
    opportunityScore: 0,            // computed by v2 engine
    lpAttractiveness: "Cautious",
    diagnosis:
      "ZigChain is a Cosmos SDK L1 launched in June 2025, purpose-built for decentralized wealth generation. Valdora Finance already runs a live liquid staking protocol (stZIG) with $8M TVL and 2 OAK Security audits — a strong foundation for a very young chain. The critical gap is that stZIG has no DEX trading pairs yet, meaning holders can only exit via the 21-day native unbonding. Until stZIG liquidity is seeded on Oroswap, the LST is not truly liquid. The next milestone — Permapod lending going live — would add collateral utility and meaningfully deepen demand for stZIG."
  },

  modules: [
    {
      name: "Liquidity & Exit",
      score: 0,                     // computed by v2 engine
      rationale:
        "stZIG has no confirmed DEX pairs on DexScreener or Oroswap. The only exit path for stZIG holders is the native 21-day Valdora unbonding queue — a significant liquidity constraint. Stablecoin depth on ZigChain mainnet is also very thin, limiting USDC exit quality for ZIG base token holders.",
      keyMetrics: [
        { label: "stZIG DEX Liquidity", value: "None (not yet listed)", description: "No stZIG trading pairs identified on DexScreener or ZigChain native DEX" },
        { label: "Stable Exit Depth (on-chain)", value: "~$50K est.", description: "Very thin USDC/stablecoin pools on Oroswap — ZIG stablecoin pairs mostly on Ethereum/BSC" },
        { label: "Unbonding Period", value: "21 days", description: "Native Valdora redemption takes 21 days — only exit path until DEX pairs exist" },
        { label: "Redemption Mechanism", value: "Yes (Valdora)", description: "Native burn-and-queue redemption confirmed in Valdora docs" }
      ],
      keyInsight:
        "The LST exists but lacks secondary market liquidity. Seeding a stZIG/ZIG or stZIG/USDC pool on Oroswap is the single most impactful near-term action for improving this module.",
      riskWarning:
        "Without DEX liquidity, any holder needing to exit before 21 days has no option. This is a critical product risk for institutional LPs evaluating stZIG."
    },
    {
      name: "Peg Stability",
      score: 0,                     // computed by v2 engine
      rationale:
        "Peg Stability is fully active given Valdora's live LST. The score is anchored by the 21-day unbonding period (slower than ideal but within Cosmos norms) and the very thin stablecoin buffer on ZigChain. OAK Security's 2 audits provide baseline confidence in the smart contract peg mechanism.",
      keyMetrics: [
        { label: "Redemption", value: "Native (Valdora)", description: "Burn stZIG → receive ZIG after 21-day unbonding queue" },
        { label: "Unbonding Period", value: "21 days", description: "Cosmos SDK unbonding — standard for Tendermint chains" },
        { label: "Stable Exit Buffer", value: "~$50K est.", description: "Thin stablecoin pool — limited protection against ZIG/USD exit pressure" },
        { label: "Audits", value: "2 (OAK Security)", description: "OAK Security is the leading auditor for Cosmos/CosmWasm protocols" }
      ],
      keyInsight:
        "Peg mechanics are sound at the protocol level. The main risk is thin stablecoin exit depth, which would amplify ZIG price impact during any LST sell event.",
      riskWarning:
        "21-day redemption is standard for Cosmos but creates meaningful peg risk if stZIG ever trades at significant discount — no fast unbonding mechanism documented."
    },
    {
      name: "DeFi Moneyness",
      score: 0,                     // computed by v2 engine
      rationale:
        "With $14M combined DeFi TVL (chain base + Valdora), ZigChain has a surprisingly healthy TVL-to-marketcap ratio of ~26% for a 9-month-old chain. However, Permapod lending (the key integration target for stZIG collateral) is not yet live, and lstCollateralEnabled remains false. The DeFi moneyness score is capped until stZIG becomes usable as collateral.",
      keyMetrics: [
        { label: "DeFi TVL", value: "$14M est.", description: "DefiLlama chain TVL ($6.14M) + Valdora ($7.99M)" },
        { label: "DeFi / Market Cap", value: "~26.1%", description: "Strong ratio for a chain this young" },
        { label: "LST Collateral Enabled", value: "No", description: "Permapod lending upcoming — not yet live" },
        { label: "Lending Presence", value: "No (Permapod upcoming)", description: "Permapod will accept RWAs and DeFi collateral; stZIG integration not confirmed yet" },
        { label: "Native DEX", value: "Oroswap (AI DEX)", description: "Live/beta — AI-powered conversational DEX on ZigChain" }
      ],
      keyInsight:
        "ZigChain's TVL/market cap ratio is exceptional for its age. When Permapod launches and accepts stZIG as collateral, this module will see its largest single improvement.",
      riskWarning:
        "Most current TVL is attributable to Valdora staking — not broad DeFi composability. Until more protocols integrate stZIG, the LST's utility as a money-market primitive is limited."
    },
    {
      name: "Security & Governance",
      score: 0,                     // computed by v2 engine
      rationale:
        "Valdora Finance has 2 completed OAK Security audits — a strong start for a protocol launched in early 2025. Governance timelock status is undocumented in publicly accessible Valdora docs (governance page returned 404). LST penetration at 14.9% of market cap signals healthy but not yet mature adoption.",
      keyMetrics: [
        { label: "Security Audits", value: "2 (OAK Security)", description: "OAK Security is the leading auditor for Cosmos/CosmWasm — DefiLlama confirmed 2 audits" },
        { label: "Governance Timelock", value: "Unknown", description: "Not documented in publicly accessible Valdora docs" },
        { label: "stZIG Penetration", value: "14.9%", description: "stZIG TVL ($8M) / ZIG market cap ($53.6M)" },
        { label: "Multi-sig Security", value: "Yes (documented)", description: "Valdora docs mention multi-sig for critical operations and emergency circuit breakers" }
      ],
      keyInsight:
        "Two OAK audits is a strong signal for a protocol less than a year old. Adding a documented governance timelock would remove the main remaining security uncertainty and unlock additional institutional confidence.",
      riskWarning:
        "No public timelock documentation means admin keys may have unconstrained upgrade capability — a risk that needs to be clarified with the Valdora team."
    },
    {
      name: "Validator Decentralization",
      score: 0,                     // computed by v2 engine
      rationale:
        "ZigChain mainnet launched with 33 active validators — a modest but functional set for a Tendermint BFT chain. Minimum self-delegation of 100,000 ZIG creates a meaningful economic barrier to entry. Commission structure is flexible (governance-adjustable) with examples ranging from 5–10%.",
      keyMetrics: [
        { label: "Active Validators", value: "33", description: "Top 33 by staked ZIG form the active set" },
        { label: "Min Self-Delegation", value: "100,000 ZIG", description: "Economic entry barrier for validator participation" },
        { label: "Benchmark Commission", value: "~5–10%", description: "Inferred from docs examples; exact benchmark not published" },
        { label: "Verified Providers", value: "Unknown", description: "No public verified provider list identified" }
      ],
      keyInsight:
        "33 validators is a minimal but workable decentralization floor for Tendermint BFT. Growing to 50+ validators and publishing a verified provider list would materially improve this score.",
      riskWarning:
        "Small validator set means Valdora's delegation policy has outsized influence on stake concentration. If the LST concentrates stake in a few validators, network security assumptions could be challenged."
    },
    {
      name: "Incentive Sustainability",
      score: 0,                     // computed by v2 engine
      rationale:
        "ZIG staking delivers a real yield of approximately +5.89% (7.0% APY minus 1.11% inflation) — a competitive and genuinely positive signal. LST adoption at 14.9% penetration is strong for a 9-month-old protocol. The main drag is the demand signal: with no lending integration and no collateral use case yet, stZIG demand is driven purely by yield, not by DeFi composability.",
      keyMetrics: [
        { label: "Staking APY", value: "7.0%", description: "Source: staking-explorer.com" },
        { label: "Token Inflation", value: "1.11%", description: "Coded inflation rate — max cap 15%, currently far below ceiling" },
        { label: "Real Yield (est.)", value: "+5.89%", description: "APY minus coded inflation — strong positive real return" },
        { label: "LST Adoption", value: "14.9%", description: "stZIG TVL / ZIG market cap — impressive for a protocol launched mid-2025" },
        { label: "DeFi Demand Signal", value: "Low", description: "No active lending or collateral integration drives additional stZIG demand" }
      ],
      keyInsight:
        "Real yield of +5.89% is among the strongest in the ZIG ecosystem. Once Permapod lending launches and accepts stZIG, the demand signal component will improve significantly — this module has significant room to grow.",
      riskWarning:
        "Cosmos SDK dynamic inflation means rates can shift. If bonded supply grows significantly, inflation could decrease further — which is positive for real yield but depends on protocol parameters staying within designed bounds."
    }
  ],

  opportunities: [],                // dynamically generated from v2 engine

  redFlags: [],                     // dynamically generated from v2 scoring

  stressSnapshot: {
    scenario: "Market drawdown — ZIG price -60% in 30 days",
    estimatedLstDiscount: "5–12% (no DEX pairs for stZIG — price discovery requires native queue)",
    estimatedExitHaircutToUsdc: "8–18% (thin on-chain USDC depth; most ZIG liquidity on Ethereum/BSC, not ZigChain native)",
    estimatedRedeemQueueDelay: "21+ days (native Valdora unbonding is the only reliable exit)",
    contagionRisk: "Medium"
  },

  miniVisuals: {
    validatorConcentration: [
      { label: "Top 5 validators", sharePct: 38 },
      { label: "Validators 6–15", sharePct: 35 },
      { label: "Validators 16–33", sharePct: 27 }
    ],
    defiUsageComposition: [
      { label: "Valdora (stZIG)", sharePct: 57 },
      { label: "Oroswap DEX", sharePct: 30 },
      { label: "Other", sharePct: 13 }
    ]
  }
};
