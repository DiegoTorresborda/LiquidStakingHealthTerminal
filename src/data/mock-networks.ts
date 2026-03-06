import { ModuleName } from "@/config/scoring";

export type ScoreTone = "positive" | "warning" | "risk";

export type ModuleMetric = {
  label: string;
  value: string;
};

export type ModuleSnapshot = {
  name: ModuleName;
  score: number;
  status: "Strong" | "Healthy" | "Mixed" | "Watchlist" | "Constrained" | "Weak";
  rationale: string;
  metrics: ModuleMetric[];
  keyInsight: string;
  redFlag: string;
};

export type Opportunity = {
  title: string;
  module: ModuleName;
  impact: "Very High" | "High" | "Medium";
  whyItMatters: string;
  expectedBenefit: string;
};

export type RedFlag = {
  title: string;
  module: ModuleName;
  severity: "High" | "Medium";
  detail: string;
};

export type NetworkSnapshot = {
  id: string;
  name: string;
  displayName: string;
  nativeToken: string;
  chainType: string;
  chainId: number;
  status: "active";
  lstSymbol: string;
  lstDisplayName: string;
  dashboardMode: string;
  updatedAt: string;
  dataMode: "Mocked";
  globalScore: number;
  lpAttractiveness: "Medium" | "High" | "Low";
  lpAttractivenessTone: ScoreTone;
  institutionalReadiness: string;
  diagnosis: string;
  heroText: string;
  highlights: string[];
  uiLabels: {
    bestModule: string;
    weakestModule: string;
    primaryBottleneck: string;
    mainStrategicUpgrade: string;
  };
  strategicContrast: {
    strengths: { title: string; detail: string }[];
    bottlenecks: { title: string; detail: string }[];
  };
  supportingSignals: {
    slippageCurve: { tradeSizeUsd: number; slippagePct: number }[];
    pegDeviation: number[];
    defiUsage: { label: string; share: number }[];
    validatorConcentration: { label: string; share: number }[];
    stressSnapshot: {
      scenario: string;
      exitHaircut: string;
      lstDiscount: string;
      redemptionQueue: string;
      contagionRisk: string;
    };
  };
  modules: ModuleSnapshot[];
  opportunities: Opportunity[];
  redFlags: RedFlag[];
};

export const NETWORK_SNAPSHOTS: NetworkSnapshot[] = [
  {
    id: "monad",
    name: "Monad",
    displayName: "Monad Mainnet",
    nativeToken: "MON",
    chainType: "EVM L1",
    chainId: 143,
    status: "active",
    lstSymbol: "stMON",
    lstDisplayName: "Staked MON",
    dashboardMode: "LP Perspective",
    updatedAt: "2026-03-06 14:20 UTC",
    dataMode: "Mocked",
    globalScore: 71,
    lpAttractiveness: "Medium",
    lpAttractivenessTone: "warning",
    institutionalReadiness: "Emerging",
    diagnosis:
      "Strong L1 foundation and promising staking base, but limited stablecoin exit depth and insufficient DeFi moneyness keep the LST ecosystem below institutional grade.",
    heroText:
      "Monad shows strong L1 fundamentals and a promising validator base, but its LST ecosystem remains one layer short of institutional readiness. The clearest upgrade path is deeper stablecoin exit liquidity plus stronger DeFi collateral integration.",
    highlights: ["Strong technical base", "Good validator breadth", "Weak stablecoin exit", "DeFi utility underdeveloped"],
    uiLabels: {
      bestModule: "Validator Decentralization",
      weakestModule: "DeFi Moneyness",
      primaryBottleneck: "Stablecoin Exit Depth",
      mainStrategicUpgrade: "Lending Collateral Expansion"
    },
    strategicContrast: {
      strengths: [
        {
          title: "Validator Decentralization (81)",
          detail: "Delegation breadth, uptime profile, and concentration levels are strong relative to the rest of the stack."
        },
        {
          title: "Security & Governance (76)",
          detail: "Timelock, multisig transparency, and bounty posture support institutional trust building."
        }
      ],
      bottlenecks: [
        {
          title: "Liquidity & Exit (62)",
          detail: "MON-to-USDC depth remains the main gate for larger LP exits."
        },
        {
          title: "DeFi Moneyness (58)",
          detail: "Collateral utility is present but too shallow to create a strong demand floor."
        },
        {
          title: "Primary bottleneck: Stablecoin Exit Depth",
          detail: "Exit friction rises quickly with size, limiting serious capital deployment confidence."
        }
      ]
    },
    supportingSignals: {
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
      defiUsage: [
        { label: "Lending", share: 34 },
        { label: "LP Pools", share: 46 },
        { label: "Vaults", share: 8 },
        { label: "Idle", share: 12 }
      ],
      validatorConcentration: [
        { label: "Top 1", share: 8 },
        { label: "Top 5", share: 29 },
        { label: "Top 10", share: 44 },
        { label: "Remaining", share: 56 }
      ],
      stressSnapshot: {
        scenario: "Base token drops 40% in 24h",
        exitHaircut: "Estimated exit haircut to USDC: 7.2%",
        lstDiscount: "Estimated LST discount under stress: -4.8%",
        redemptionQueue: "Estimated redemption queue: 8 days",
        contagionRisk: "Contagion risk: Medium"
      }
    },
    modules: [
      {
        name: "Liquidity & Exit",
        score: 62,
        status: "Constrained",
        rationale:
          "Primary LST liquidity exists, but exit to stablecoins is still too shallow for larger LP allocations.",
        metrics: [
          { label: "LST Pool TVL", value: "$18.5M" },
          { label: "Slippage @ $500k", value: "2.40%" }
        ],
        keyInsight: "The real bottleneck is not the LST/MON pool alone, but the MON-to-USDC conversion route.",
        redFlag: "Exit to USDC becomes materially inefficient at larger sizes."
      },
      {
        name: "Peg Stability",
        score: 74,
        status: "Healthy",
        rationale:
          "The LST trades close to implied value most of the time, but peg robustness is still partly dependent on secondary liquidity.",
        metrics: [
          { label: "Avg Discount (30d)", value: "-0.35%" },
          { label: "Redeem Time", value: "4 days" }
        ],
        keyInsight: "Peg behavior is acceptable in normal conditions, but stress behavior remains only partially validated.",
        redFlag: "Redemption and queue behavior are not yet strong enough to fully anchor institutional confidence."
      },
      {
        name: "DeFi Moneyness",
        score: 58,
        status: "Weak",
        rationale:
          "The LST exists, but it is not yet deeply embedded as collateral or base money across DeFi.",
        metrics: [
          { label: "Lending Integrations", value: "1" },
          { label: "Collateral Caps", value: "$5.0M" }
        ],
        keyInsight: "The LST has yield utility, but not yet broad money-like utility.",
        redFlag: "Collateral acceptance exists, but caps are still too small to drive strong structural demand."
      },
      {
        name: "Security & Governance",
        score: 76,
        status: "Strong",
        rationale:
          "The product stack is reasonably mature from a governance and contract-risk perspective, though not yet best-in-class.",
        metrics: [
          { label: "Audits", value: "2" },
          { label: "Timelock", value: "Yes" }
        ],
        keyInsight: "Security posture is supportive of growth, but further hardening would improve institutional credibility.",
        redFlag: "Upgrade controls are acceptable, but still not at the most conservative benchmark."
      },
      {
        name: "Validator Decentralization",
        score: 81,
        status: "Strong",
        rationale:
          "Delegation is reasonably diversified, with acceptable concentration and a credible validator base.",
        metrics: [
          { label: "Active Validators", value: "132" },
          { label: "Top-5 Share", value: "29%" }
        ],
        keyInsight: "This is one of the ecosystem's strongest pillars.",
        redFlag: "Concentration is not alarming, but still worth monitoring as TVL scales."
      },
      {
        name: "Incentive Sustainability",
        score: 64,
        status: "Mixed",
        rationale:
          "Current adoption is supported by incentives more than ideal, though there are early signs of organic demand.",
        metrics: [
          { label: "Emissions Share", value: "59%" },
          { label: "TVL Decay Post-Cut", value: "18%" }
        ],
        keyInsight: "Incentives are still a bridge, not yet fully a booster on top of organic usage.",
        redFlag: "A large part of current attractiveness still depends on rewards rather than deep utility."
      },
      {
        name: "Stress Resilience",
        score: 66,
        status: "Watchlist",
        rationale:
          "The ecosystem appears resilient under moderate stress, but stablecoin exit and collateral contagion remain key vulnerabilities.",
        metrics: [
          { label: "Exit Haircut to USDC", value: "7.2%" },
          { label: "Redeem Queue", value: "8 days" }
        ],
        keyInsight: "The ecosystem likely bends before it breaks, but larger LP exits would still face meaningful friction.",
        redFlag: "Stablecoin flight remains the clearest stress vulnerability."
      }
    ],
    opportunities: [
      {
        title: "Deepen MON-to-USDC exit liquidity",
        impact: "Very High",
        module: "Liquidity & Exit",
        whyItMatters: "This is the primary gating factor for serious LP deployment and clean stablecoin exits.",
        expectedBenefit:
          "Improves LP confidence, lowers haircut risk, and raises the practical capacity of the LST ecosystem."
      },
      {
        title: "Expand LST collateral usage in lending",
        impact: "Very High",
        module: "DeFi Moneyness",
        whyItMatters: "The LST needs stronger money-like utility, not just staking yield.",
        expectedBenefit: "Increases structural demand floor and improves capital efficiency."
      },
      {
        title: "Reduce incentive dependence",
        impact: "High",
        module: "Incentive Sustainability",
        whyItMatters: "Durable TVL should come increasingly from utility and fees rather than emissions.",
        expectedBenefit: "Makes liquidity more trustworthy and improves long-term ecosystem quality."
      },
      {
        title: "Improve redemption transparency and queue visibility",
        impact: "Medium",
        module: "Peg Stability",
        whyItMatters: "Better visibility improves peg confidence and institutional comfort.",
        expectedBenefit: "Strengthens trust in stress conditions and reduces perceived exit uncertainty."
      },
      {
        title: "Add a second major DeFi venue using the LST as collateral",
        impact: "High",
        module: "DeFi Moneyness",
        whyItMatters: "One integration is not enough to make the LST feel systemically relevant.",
        expectedBenefit: "Improves composability and broadens demand."
      }
    ],
    redFlags: [
      {
        title: "Stablecoin exit depth remains below institutional comfort.",
        module: "Liquidity & Exit",
        severity: "High",
        detail: "Exit quality degrades quickly as order size scales toward treasury-level deployment."
      },
      {
        title: "LST utility is still too concentrated in basic LP usage.",
        module: "DeFi Moneyness",
        severity: "High",
        detail: "Collateral and strategy integrations are too limited to support broad money-like demand."
      },
      {
        title: "Incentive support is still doing too much of the adoption work.",
        module: "Incentive Sustainability",
        severity: "Medium",
        detail: "A large share of current participation remains emissions-led rather than fee-led."
      },
      {
        title: "Stress scenario suggests USDC exit haircut can become significant.",
        module: "Stress Resilience",
        severity: "High",
        detail: "Modeled stress conditions imply non-trivial loss to reach stablecoin safety."
      },
      {
        title: "Collateral caps remain too small to create a strong demand floor.",
        module: "DeFi Moneyness",
        severity: "Medium",
        detail: "Current cap structure limits institutional borrowing and dampens structural LST demand."
      }
    ]
  }
];

export const PRIMARY_DEMO_NETWORK_ID = "monad";
