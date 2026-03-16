import type { RadarOverviewRecord } from "@/data/radar-overview-schema";
import type { V2ScoringResult } from "@/features/scoring/v2/index";
import type { ModuleScoreResult } from "@/features/scoring/v2/types";
import type { ImprovementOpportunity, ImprovementCategory } from "./types";
import { matchService } from "./service-catalog";
import { simulateScore, simulateMultiple } from "./simulator";

type V2ModuleKey = keyof V2ScoringResult["moduleScores"];

// ─── Cap-removal definitions ─────────────────────────────────────────────────

type CapFix = {
  capReason: string;
  title: string;
  description: string;
  whyItMatters: string;
  expectedBenefit: string;
  module: V2ModuleKey;
  overrides: (r: RadarOverviewRecord) => Partial<RadarOverviewRecord>;
  effort: ImprovementOpportunity["effort"];
  timeHorizon: string;
};

const CAP_FIXES: CapFix[] = [
  {
    capReason: "Sin auditorías",
    title: "Coordinate security audits",
    description:
      "Complete 2+ security audits on the LST protocol to remove the score cap on Security & Governance.",
    whyItMatters:
      "Security audits are a prerequisite for institutional LP confidence. Without them the protocol's score is hard-capped regardless of any other improvement.",
    expectedBenefit:
      "Removes the Security & Governance cap, unlocking the module's full scoring potential and signaling protocol maturity to partners.",
    module: "Security & Governance",
    overrides: () => ({ auditCount: 2 }),
    effort: "Medium",
    timeHorizon: "4-8 weeks",
  },
  {
    capReason: "Sin timelock",
    title: "Implement governance timelock",
    description:
      "Add timelock controls to protocol upgrades, removing the governance score cap.",
    whyItMatters:
      "Unconstrained admin keys represent a critical exploit surface. LPs treat any protocol without timelocks as fundamentally unsafe.",
    expectedBenefit:
      "Removes the governance cap on Security & Governance, improving risk perception and enabling enterprise-grade integrations.",
    module: "Security & Governance",
    overrides: () => ({ hasTimelock: true }),
    effort: "Medium",
    timeHorizon: "3-6 weeks",
  },
  {
    capReason: "Sin ruta stable documentada",
    title: "Establish stable exit route",
    description:
      "Deploy stablecoin liquidity pools to create a reliable exit path for the base token.",
    whyItMatters:
      "Without a documented stable exit path, LPs cannot exit without taking on price risk — a hard blocker for conservative capital allocation.",
    expectedBenefit:
      "Unlocks the Liquidity & Exit module and gives LPs a reliable USDC/USDT path under any market condition.",
    module: "Liquidity & Exit",
    overrides: (r) => ({
      stableExitRouteExists: true,
      stableExitLiquidityUsd: (r.marketCapUsd ?? 1_000_000) * 0.01,
    }),
    effort: "Medium",
    timeHorizon: "3-6 weeks",
  },
  {
    capReason: "Sin ruta stable",
    title: "Establish stable exit route",
    description:
      "Deploy stablecoin liquidity pools for reliable LST-to-stable exit path.",
    whyItMatters:
      "Without a stable exit route the Liquidity & Exit module is hard-capped. LPs require a clear path to USDC/USDT before allocating capital.",
    expectedBenefit:
      "Removes the stable-exit cap and establishes the foundational exit infrastructure for LP participation.",
    module: "Liquidity & Exit",
    overrides: (r) => ({
      stableExitRouteExists: true,
      stableExitLiquidityUsd: (r.marketCapUsd ?? 1_000_000) * 0.01,
    }),
    effort: "Medium",
    timeHorizon: "3-6 weeks",
  },
  {
    capReason: "Sin redención nativa",
    title: "Build native redemption mechanism",
    description:
      "Implement a native LST redemption path with reasonable unbonding to anchor the peg.",
    whyItMatters:
      "Without native redemption the LST has no hard price floor. Secondary-market exits dominate during stress, creating persistent discounts.",
    expectedBenefit:
      "Creates an arbitrage floor for the LST price and improves Peg Stability scores by enabling reliable redemption at par.",
    module: "Liquidity & Exit",
    overrides: () => ({ hasLst: true, unbondingDays: 7 }),
    effort: "High",
    timeHorizon: "8-10 weeks",
  },
  {
    capReason: "LST no usado como colateral",
    title: "Enable LST as lending collateral",
    description:
      "Integrate the LST as accepted collateral in lending protocols to unlock structural demand.",
    whyItMatters:
      "Collateral acceptance is the primary driver of money-like demand. Without it, LST utility is limited to yield farming — capping DeFi Moneyness potential.",
    expectedBenefit:
      "Unlocks the collateral cap on DeFi Moneyness and creates sustainable borrow-loop demand that doesn't depend on incentive emissions.",
    module: "DeFi Moneyness",
    overrides: () => ({ lstCollateralEnabled: true }),
    effort: "High",
    timeHorizon: "6-8 weeks",
  },
  {
    capReason: "Concentración extrema de validadores",
    title: "Expand validator set",
    description:
      "Deploy additional validators to improve decentralization above the critical 20-node threshold.",
    whyItMatters:
      "Extreme validator concentration is a censorship and liveness risk. Networks below 20 active validators face a hard cap on security scoring.",
    expectedBenefit:
      "Removes the Validator Decentralization cap and signals network maturity to institutional stakers.",
    module: "Validator Decentralization",
    overrides: () => ({ validatorCount: 50 }),
    effort: "Medium",
    timeHorizon: "4-8 weeks",
  },
  {
    capReason: "Yield negativo sin demanda estructural",
    title: "Build structural demand drivers",
    description:
      "Enable lending presence and collateral use to create organic demand that offsets negative real yield.",
    whyItMatters:
      "Negative real yield combined with no structural demand is unsustainable. LPs cannot count on yield that evaporates once emissions stop.",
    expectedBenefit:
      "Establishes lending and collateral demand as a durable foundation for LST yield, removing the Incentive Sustainability cap.",
    module: "Incentive Sustainability",
    overrides: () => ({ lendingPresence: true, lstCollateralEnabled: true }),
    effort: "High",
    timeHorizon: "6-8 weeks",
  },
];

// ─── Input-level fix definitions (shared by passes 2, 3, and 4) ─────────────

type InputFix = {
  breakdownKey: string;
  module: V2ModuleKey;
  title: string;
  description: string;
  whyItMatters: string;
  expectedBenefit: string;
  /** Overrides for low-input (< 30) — aggressive improvement target */
  overrides: (r: RadarOverviewRecord) => Partial<RadarOverviewRecord>;
  /** Overrides for growth (30-70) — more ambitious target to reach excellence */
  growthOverrides?: (r: RadarOverviewRecord) => Partial<RadarOverviewRecord>;
  effort: ImprovementOpportunity["effort"];
  growthEffort?: ImprovementOpportunity["effort"];
  timeHorizon: string;
  growthTimeHorizon?: string;
  /** Title override for growth-opportunity category */
  growthTitle?: string;
  growthDescription?: string;
  growthWhyItMatters?: string;
  growthExpectedBenefit?: string;
};

const INPUT_FIXES: InputFix[] = [
  {
    breakdownKey: "lstLiquidity",
    module: "Liquidity & Exit",
    title: "Deepen LST DEX liquidity",
    description:
      "Increase LST liquidity on DEXes to improve exit capacity and reduce slippage.",
    whyItMatters:
      "Thin LST liquidity means large exits trigger material slippage, making the LST unusable as institutional collateral.",
    expectedBenefit:
      "Reduces exit slippage for large positions, improving LP confidence and raising the Liquidity & Exit sub-score.",
    overrides: (r) => ({
      lstDexLiquidityUsd: (r.lstTvlUsd ?? 1_000_000) * 0.08,
    }),
    growthOverrides: (r) => ({
      lstDexLiquidityUsd: (r.lstTvlUsd ?? 1_000_000) * 0.15,
    }),
    growthTitle: "Scale LST DEX liquidity to top-tier depth",
    growthDescription:
      "Push LST liquidity to 15%+ of TVL for institutional-grade exit capacity with minimal slippage.",
    growthWhyItMatters:
      "Institutional LPs require near-zero slippage for positions above $1M. Shallow depth is the primary barrier to large-scale adoption.",
    growthExpectedBenefit:
      "Achieving 15%+ of TVL in DEX liquidity enables institutional position sizing without meaningful market impact.",
    effort: "Medium",
    growthEffort: "High",
    timeHorizon: "3-6 weeks",
    growthTimeHorizon: "6-8 weeks",
  },
  {
    breakdownKey: "stableExit",
    module: "Liquidity & Exit",
    title: "Improve stable exit depth",
    description:
      "Increase stablecoin liquidity for smoother LST-to-stable exits.",
    whyItMatters:
      "Shallow stable exits expose LPs to token price risk on exit — a gating factor for conservative capital allocation.",
    expectedBenefit:
      "Enables LPs to exit to USDC/USDT at scale without haircut, improving the stableExit sub-score and risk perception.",
    overrides: (r) => ({
      stableExitLiquidityUsd: (r.marketCapUsd ?? 1_000_000) * 0.02,
    }),
    growthOverrides: (r) => ({
      stableExitLiquidityUsd: (r.marketCapUsd ?? 1_000_000) * 0.04,
    }),
    growthTitle: "Scale stable exit to premium depth",
    growthDescription:
      "Grow stablecoin exit liquidity to 4%+ of market cap for large-scale LP exits without haircut.",
    growthWhyItMatters:
      "Top-tier protocols maintain 4%+ of market cap in stable liquidity to absorb stress selling without price impact.",
    growthExpectedBenefit:
      "Reaches premium depth that supports exits even during coordinated selling events.",
    effort: "Medium",
    growthEffort: "High",
    timeHorizon: "3-6 weeks",
    growthTimeHorizon: "6-8 weeks",
  },
  {
    breakdownKey: "stableExitDepth",
    module: "Liquidity & Exit",
    title: "Improve stable exit depth",
    description:
      "Increase stablecoin liquidity for smoother base token exits.",
    whyItMatters:
      "Shallow stable exits expose LPs to token price risk on exit — a gating factor for conservative capital allocation.",
    expectedBenefit:
      "Enables LPs to exit to USDC/USDT at scale without haircut, improving the stableExitDepth sub-score.",
    overrides: (r) => ({
      stableExitLiquidityUsd: (r.marketCapUsd ?? 1_000_000) * 0.02,
    }),
    growthOverrides: (r) => ({
      stableExitLiquidityUsd: (r.marketCapUsd ?? 1_000_000) * 0.04,
    }),
    growthTitle: "Scale stable exit to premium depth",
    growthDescription:
      "Grow stablecoin exit depth to 4%+ of market cap for institutional exits.",
    growthWhyItMatters:
      "Top-tier protocols maintain 4%+ of market cap in stable liquidity to absorb stress selling without price impact.",
    growthExpectedBenefit:
      "Reaches premium depth that supports exits even during coordinated selling events.",
    effort: "Medium",
    growthEffort: "High",
    timeHorizon: "3-6 weeks",
    growthTimeHorizon: "6-8 weeks",
  },
  {
    breakdownKey: "collateralIntegration",
    module: "DeFi Moneyness",
    title: "Enable LST collateral integration",
    description:
      "List the LST as collateral in lending protocols to grow DeFi utility.",
    whyItMatters:
      "Without collateral acceptance, the LST has limited DeFi utility and cannot generate the borrow-loop demand that sustains top protocols.",
    expectedBenefit:
      "Opens borrow-loop demand patterns, growing LST penetration and improving the DeFi Moneyness score.",
    overrides: () => ({ lstCollateralEnabled: true, lstPenetrationPct: 5 }),
    growthOverrides: () => ({ lstCollateralEnabled: true, lstPenetrationPct: 12 }),
    growthTitle: "Deepen LST collateral penetration",
    growthDescription:
      "Expand LST collateral usage to 12%+ penetration across multiple lending venues.",
    growthWhyItMatters:
      "Deep collateral penetration (12%+) signals the LST is embedded in the ecosystem's financial fabric.",
    growthExpectedBenefit:
      "Reaches institutional-grade DeFi utility with multiple lending venues and deep, durable collateral usage.",
    effort: "High",
    growthEffort: "High",
    timeHorizon: "6-8 weeks",
    growthTimeHorizon: "3-6 months",
  },
  {
    breakdownKey: "defiDepth",
    module: "DeFi Moneyness",
    title: "Grow LST DeFi integrations",
    description:
      "Integrate the LST into more DeFi protocols (vaults, AMMs, yield aggregators).",
    whyItMatters:
      "Low LST TVL relative to DeFi TVL signals poor adoption. DeFi integrations are the primary distribution channel for durable LST demand.",
    expectedBenefit:
      "Increases the defiDepth sub-score and validates LST demand from organic DeFi activity.",
    overrides: (r) => ({
      lstTvlUsd: (r.defiTvlUsd ?? 1_000_000) * 0.05,
    }),
    growthOverrides: (r) => ({
      lstTvlUsd: (r.defiTvlUsd ?? 1_000_000) * 0.08,
    }),
    growthTitle: "Scale LST presence across DeFi ecosystem",
    growthDescription:
      "Grow LST TVL to 8%+ of DeFi TVL through vault strategies, yield aggregators, and AMM partnerships.",
    growthWhyItMatters:
      "Top-tier LSTs capture 8%+ of DeFi TVL, indicating deep embedding across vaults, AMMs, and yield strategies.",
    growthExpectedBenefit:
      "Positions the LST as a first-class DeFi primitive with diversified usage across multiple protocol types.",
    effort: "Medium",
    growthEffort: "High",
    timeHorizon: "6-8 weeks",
    growthTimeHorizon: "3-6 months",
  },
  {
    breakdownKey: "operatorQuality",
    module: "Validator Decentralization",
    title: "Onboard verified staking providers",
    description:
      "Attract professional staking operators to improve validator quality ratio.",
    whyItMatters:
      "A high ratio of unverified validators signals permissive node operation. Institutional validators provide reliability guarantees that improve protocol credibility.",
    expectedBenefit:
      "Improves the operatorQuality sub-score and signals professional network operations to enterprise stakers.",
    overrides: (r) => ({
      verifiedProviders: Math.max((r.verifiedProviders ?? 0) + 10, 15),
    }),
    growthOverrides: (r) => ({
      verifiedProviders: Math.max((r.verifiedProviders ?? 0) + 25, 30),
    }),
    growthTitle: "Build premium validator ecosystem",
    growthDescription:
      "Attract 30+ verified professional operators to reach top-tier decentralization quality.",
    growthWhyItMatters:
      "Premium validator ecosystems with 30+ verified operators attract institutional stakers and reduce operational concentration risk.",
    growthExpectedBenefit:
      "Builds a world-class validator ecosystem with geographic diversity and institutional-grade SLAs.",
    effort: "Medium",
    growthEffort: "High",
    timeHorizon: "4-8 weeks",
    growthTimeHorizon: "3-6 months",
  },
  {
    breakdownKey: "lendingInfrastructure",
    module: "DeFi Moneyness",
    title: "Deploy lending infrastructure",
    description:
      "Launch or integrate lending protocols on the chain to support DeFi composability.",
    whyItMatters:
      "Without on-chain lending the DeFi ecosystem can't support the borrow-loop demand model that drives sustainable LST adoption.",
    expectedBenefit:
      "Enables collateral-based borrowing patterns required for money-like LST demand, improving the DeFi Moneyness score.",
    overrides: () => ({ lendingPresence: true }),
    effort: "High",
    timeHorizon: "6-8 weeks",
  },
  {
    breakdownKey: "validatorBreadth",
    module: "Validator Decentralization",
    title: "Expand validator count",
    description:
      "Increase the number of active validators to strengthen network decentralization.",
    whyItMatters:
      "Low validator count creates censorship risk and limits network security. It directly constrains the Validator Decentralization module.",
    expectedBenefit:
      "Improves the validatorBreadth sub-score and enhances censorship resistance for enterprise-grade deployments.",
    overrides: (r) => ({
      validatorCount: Math.max((r.validatorCount ?? 0) * 2, 80),
    }),
    growthOverrides: (r) => ({
      validatorCount: Math.max((r.validatorCount ?? 0) * 3, 150),
    }),
    growthTitle: "Scale to 150+ validators",
    growthDescription:
      "Grow the validator set to 150+ for strong censorship resistance and geographic distribution.",
    growthWhyItMatters:
      "Networks with 150+ validators achieve meaningful censorship resistance and geographic distribution across jurisdictions.",
    growthExpectedBenefit:
      "Reaches a validator count that satisfies institutional compliance requirements for decentralization.",
    effort: "Medium",
    growthEffort: "High",
    timeHorizon: "4-8 weeks",
    growthTimeHorizon: "3-6 months",
  },
  {
    breakdownKey: "redemptionAnchor",
    module: "Liquidity & Exit",
    title: "Optimize unbonding period",
    description:
      "Reduce unbonding time to improve the redemption anchor score and LST peg confidence.",
    whyItMatters:
      "Long unbonding delays weaken the LST price anchor. When arbitrage is slow, peg discounts can persist for days, eroding LP confidence.",
    expectedBenefit:
      "Improves the redemptionAnchor sub-score and strengthens the peg floor by enabling faster arbitrage cycles.",
    overrides: () => ({ unbondingDays: 7 }),
    growthOverrides: () => ({ unbondingDays: 2 }),
    growthTitle: "Achieve fast-track unbonding",
    growthDescription:
      "Reduce unbonding to ≤2 days for maximum redemption score — enables instant-like exits.",
    growthWhyItMatters:
      "Sub-2-day unbonding enables near-instant arbitrage that keeps the LST trading within 10bps of par.",
    growthExpectedBenefit:
      "Achieves money-market quality exit mechanics that enable institutional deployment without peg discount risk.",
    effort: "High",
    growthEffort: "High",
    timeHorizon: "6-8 weeks",
    growthTimeHorizon: "3-6 months",
  },
  {
    breakdownKey: "stableBuffer",
    module: "Peg Stability",
    title: "Grow stable buffer reserves",
    description:
      "Increase stablecoin reserves relative to market cap to strengthen peg defense.",
    whyItMatters:
      "Thin stable reserves mean the peg can break under selling pressure. A well-funded buffer acts as an automatic stabilizer.",
    expectedBenefit:
      "Improves the stableBuffer sub-score and provides a visible peg defense mechanism that LPs can rely on.",
    overrides: (r) => ({
      stableExitLiquidityUsd: (r.marketCapUsd ?? 1_000_000) * 0.02,
    }),
    growthOverrides: (r) => ({
      stableExitLiquidityUsd: (r.marketCapUsd ?? 1_000_000) * 0.04,
    }),
    growthTitle: "Build deep peg defense buffer",
    growthDescription:
      "Scale stable reserves to 4%+ of market cap for robust peg defense under stress conditions.",
    growthWhyItMatters:
      "Top-tier peg defense requires 4%+ stable buffer to absorb coordinated sells without de-pegging.",
    growthExpectedBenefit:
      "Creates a robust automatic stabilizer that maintains peg integrity through market stress events.",
    effort: "Medium",
    growthEffort: "High",
    timeHorizon: "3-6 weeks",
    growthTimeHorizon: "6-8 weeks",
  },
  {
    breakdownKey: "defiEcosystem",
    module: "DeFi Moneyness",
    title: "Expand DeFi ecosystem breadth",
    description:
      "Grow the on-chain DeFi ecosystem to support deeper LST integration.",
    whyItMatters:
      "A thin DeFi ecosystem limits the venues where the LST can be deployed. Ecosystem breadth is a leading indicator of future LST demand.",
    expectedBenefit:
      "Grows the defiEcosystem sub-score and expands the addressable market for LST integration.",
    overrides: (r) => ({
      defiTvlUsd: (r.marketCapUsd ?? 1_000_000) * 0.15,
    }),
    growthOverrides: (r) => ({
      defiTvlUsd: (r.marketCapUsd ?? 1_000_000) * 0.25,
    }),
    growthTitle: "Scale DeFi TVL to 25%+ of market cap",
    growthDescription:
      "Grow the DeFi ecosystem to provide a deep and diverse environment for LST composability.",
    growthWhyItMatters:
      "A DeFi TVL / market cap ratio above 25% signals a thriving ecosystem with deep, diverse integration opportunities.",
    growthExpectedBenefit:
      "Creates a rich composability layer that supports multiple LST use cases across multiple protocol types.",
    effort: "High",
    growthEffort: "High",
    timeHorizon: "3-6 months",
    growthTimeHorizon: "6-12 months",
  },
  {
    breakdownKey: "defiDepth",
    module: "Peg Stability",
    title: "Grow DeFi depth for peg support",
    description:
      "Increase DeFi TVL to strengthen the token's price anchoring in the ecosystem.",
    whyItMatters:
      "Shallow DeFi TVL means there's limited buying pressure to defend the base token price, weakening the peg stability foundation.",
    expectedBenefit:
      "Increases DeFi TVL as a peg anchor, improving the defiDepth sub-score in Peg Stability.",
    overrides: (r) => ({
      defiTvlUsd: (r.marketCapUsd ?? 1_000_000) * 0.15,
    }),
    effort: "High",
    timeHorizon: "3-6 months",
  },
  {
    breakdownKey: "ecosystemBreadth",
    module: "DeFi Moneyness",
    title: "Broaden DeFi ecosystem",
    description:
      "Attract more DeFi protocols to provide breadth for the LST composability layer.",
    whyItMatters:
      "Ecosystem breadth determines how many venues can absorb LST supply. Narrow ecosystems lead to concentrated liquidity risks.",
    expectedBenefit:
      "Expands the DeFi footprint, improving the ecosystemBreadth sub-score and reducing integration concentration risk.",
    overrides: (r) => ({
      defiTvlUsd: (r.marketCapUsd ?? 1_000_000) * 0.15,
    }),
    growthOverrides: (r) => ({
      defiTvlUsd: (r.marketCapUsd ?? 1_000_000) * 0.25,
    }),
    growthTitle: "Scale DeFi breadth for maximum LST composability",
    growthDescription:
      "Grow DeFi TVL / market cap ratio to 25%+ for a rich, diverse LST integration surface.",
    growthWhyItMatters:
      "A 25%+ DeFi/market cap ratio positions the chain as a top-tier LST destination for multi-venue strategies.",
    growthExpectedBenefit:
      "Establishes the chain as a preferred LST ecosystem with diversified, protocol-resilient demand.",
    effort: "High",
    growthEffort: "High",
    timeHorizon: "3-6 months",
    growthTimeHorizon: "6-12 months",
  },
  {
    breakdownKey: "realYieldQuality",
    module: "Incentive Sustainability",
    title: "Improve real yield economics",
    description:
      "Optimize staking rewards and inflation to improve real yield attractiveness.",
    whyItMatters:
      "Negative or near-zero real yield means stakers are being diluted by inflation. This caps LST attractiveness and adoption ceilings.",
    expectedBenefit:
      "Improves the realYieldQuality sub-score, making the LST attractive to yield-seeking institutional capital.",
    overrides: () => ({ stakingApyPct: 6, inflationRatePct: 2 }),
    growthOverrides: () => ({ stakingApyPct: 8, inflationRatePct: 1 }),
    growthTitle: "Achieve premium real yield",
    growthDescription:
      "Target 7%+ real yield through protocol fee sharing and optimized emission schedules.",
    growthWhyItMatters:
      "Premium real yield (7%+) is a top-quartile position that activates institutional allocation mandates.",
    growthExpectedBenefit:
      "Achieves a best-in-class real yield profile that commands premium LP interest and reduces dependency on inflation.",
    effort: "High",
    growthEffort: "High",
    timeHorizon: "6-8 weeks",
    growthTimeHorizon: "6-12 months",
  },
  {
    breakdownKey: "adoptionDepth",
    module: "Incentive Sustainability",
    title: "Grow LST adoption",
    description:
      "Increase LST penetration through incentive programs and DeFi integrations.",
    whyItMatters:
      "Low LST penetration means the protocol hasn't achieved product-market fit. It limits the Incentive Sustainability score and signals weak demand.",
    expectedBenefit:
      "Improves the adoptionDepth sub-score and demonstrates organic demand that reduces reliance on external incentives.",
    overrides: () => ({ lstPenetrationPct: 5 }),
    growthOverrides: () => ({ lstPenetrationPct: 10 }),
    growthTitle: "Drive LST to 10%+ penetration",
    growthDescription:
      "Scale LST adoption to 10%+ of staked value through ecosystem partnerships and yield strategies.",
    growthWhyItMatters:
      "10%+ penetration marks the inflection point where network effects kick in and adoption becomes self-sustaining.",
    growthExpectedBenefit:
      "Activates ecosystem partnerships, listing opportunities, and institutional coverage.",
    effort: "Medium",
    growthEffort: "High",
    timeHorizon: "2-3 months",
    growthTimeHorizon: "4-8 months",
  },
  {
    breakdownKey: "marketCompetitiveness",
    module: "Validator Decentralization",
    title: "Optimize validator commission structure",
    description:
      "Encourage competitive commission rates to improve the market competitiveness score.",
    whyItMatters:
      "Uncompetitive commission rates deter delegators and reduce network participation, weakening the decentralization scoring.",
    expectedBenefit:
      "Improves the marketCompetitiveness sub-score by creating incentives for broader delegation and validator diversity.",
    overrides: () => ({ benchmarkCommissionPct: 10 }),
    growthOverrides: () => ({ benchmarkCommissionPct: 5 }),
    growthTitle: "Achieve best-in-class commission rates",
    growthDescription:
      "Drive benchmark commission to <5% for maximum delegator attractiveness.",
    growthWhyItMatters:
      "Best-in-class commission rates (<5%) position the chain as the most economically attractive for delegators.",
    growthExpectedBenefit:
      "Achieves top-tier market competitiveness that maximizes delegation distribution and validator diversity.",
    effort: "Low",
    growthEffort: "Medium",
    timeHorizon: "3-6 weeks",
    growthTimeHorizon: "6-8 weeks",
  },
];

// ─── Strategic / agentic analysis definitions ────────────────────────────────

type StrategicRule = {
  id: string;
  title: string;
  description: string;
  whyItMatters: string;
  expectedBenefit: string;
  module: string;
  /** Returns overrides if this rule applies, null otherwise */
  detect: (
    r: RadarOverviewRecord,
    v2: V2ScoringResult
  ) => Partial<RadarOverviewRecord> | null;
  effort: ImprovementOpportunity["effort"];
  timeHorizon: string;
};

const STRATEGIC_RULES: StrategicRule[] = [
  // Pre-LST → LST-active mode transition
  {
    id: "strategic-launch-lst",
    title: "Launch an LST protocol",
    description:
      "This network has no LST yet. Launching one would unlock LST-active scoring mode with higher potential across all modules — the single highest-leverage move.",
    whyItMatters:
      "No LST means the chain is in pre-LST mode with a structurally lower scoring ceiling. An LST unlocks the highest-potential path and positions the chain for institutional LP demand.",
    expectedBenefit:
      "Transitions the network to LST-active scoring mode, unlocking higher module ceilings and enabling the full improvement roadmap.",
    module: "All Modules",
    detect: (r, v2) => {
      if (v2.mode !== "pre-lst") return null;
      return {
        hasLst: true,
        unbondingDays: 7,
        lstTvlUsd: (r.marketCapUsd ?? 1_000_000) * 0.02,
        lstPenetrationPct: 2,
        lstDexLiquidityUsd: (r.marketCapUsd ?? 1_000_000) * 0.005,
        auditCount: 1,
      };
    },
    effort: "High",
    timeHorizon: "4-8 months",
  },
  // Exitability bottleneck: both L&E and Peg are weak, improving stable exit helps both
  {
    id: "strategic-exitability-unlock",
    title: "Unlock exitability across Liquidity & Peg",
    description:
      "Both Liquidity & Exit and Peg Stability are constrained by shallow stable liquidity. A unified stable exit strategy would improve two modules simultaneously.",
    whyItMatters:
      "When both Exitability modules are weak, the entire pillar is suppressed — the primary reason LPs avoid allocation to this chain.",
    expectedBenefit:
      "A unified stable liquidity strategy lifts two modules simultaneously, delivering the highest per-effort improvement to the Exitability pillar.",
    module: "Liquidity & Exit + Peg Stability",
    detect: (r, v2) => {
      const le = v2.moduleScores["Liquidity & Exit"].finalScore;
      const peg = v2.moduleScores["Peg Stability"].finalScore;
      if (le >= 60 || peg >= 60) return null;
      return {
        stableExitRouteExists: true,
        stableExitLiquidityUsd: (r.marketCapUsd ?? 1_000_000) * 0.03,
      };
    },
    effort: "Medium",
    timeHorizon: "4-8 weeks",
  },
  // Credibility gap: all 3 credibility modules below 50
  {
    id: "strategic-credibility-package",
    title: "Credibility acceleration package",
    description:
      "Security, Validator, and Incentive modules are all below 50. A combined audit + timelock + validator expansion package would lift the entire Credibility pillar.",
    whyItMatters:
      "When all Credibility modules are below 50, the entire pillar is in distress — this compound weakness signals unreliability to LPs and institutional stakers.",
    expectedBenefit:
      "A combined security + governance + validator effort delivers compounding score improvements across the full Credibility pillar.",
    module: "Security + Validator + Incentive",
    detect: (r, v2) => {
      const sec = v2.moduleScores["Security & Governance"].finalScore;
      const val = v2.moduleScores["Validator Decentralization"].finalScore;
      const inc = v2.moduleScores["Incentive Sustainability"].finalScore;
      if (sec >= 50 || val >= 50 || inc >= 50) return null;
      return {
        auditCount: 2,
        hasTimelock: true,
        validatorCount: Math.max((r.validatorCount ?? 0) * 2, 60),
        verifiedProviders: Math.max((r.verifiedProviders ?? 0) + 15, 20),
      };
    },
    effort: "High",
    timeHorizon: "2-3 months",
  },
  // DeFi + Incentive synergy: enabling collateral + lending helps both modules
  {
    id: "strategic-defi-flywheel",
    title: "DeFi demand flywheel",
    description:
      "Enabling LST as collateral AND lending presence creates a compounding effect: it improves DeFi Moneyness and Incentive Sustainability simultaneously by driving structural demand.",
    whyItMatters:
      "LST collateral + lending creates a borrow-loop that doesn't depend on incentive emissions — the foundation for sustainable, organic LST demand.",
    expectedBenefit:
      "Simultaneously improves DeFi Moneyness and Incentive Sustainability, creating a compounding flywheel that grows usage without increasing emissions.",
    module: "DeFi Moneyness + Incentive Sustainability",
    detect: (r, v2) => {
      if (v2.mode !== "lst-active") return null;
      const collateralEnabled = r.lstCollateralEnabled ?? false;
      const lending = r.lendingPresence ?? false;
      if (collateralEnabled && lending) return null;
      const defi = v2.moduleScores["DeFi Moneyness"].finalScore;
      const inc = v2.moduleScores["Incentive Sustainability"].finalScore;
      if (defi >= 70 && inc >= 70) return null;
      return {
        lstCollateralEnabled: true,
        lendingPresence: true,
        lstPenetrationPct: Math.max(r.lstPenetrationPct ?? 0, 5),
      };
    },
    effort: "High",
    timeHorizon: "6-8 weeks",
  },
  // Fast unbonding upgrade: if unbonding is >7 days, optimizing it helps L&E and Peg
  {
    id: "strategic-fast-unbonding",
    title: "Fast unbonding upgrade",
    description:
      "Reducing unbonding from >7 days to ≤2 days improves both Liquidity & Exit and Peg Stability — the two components of the Exitability pillar.",
    whyItMatters:
      "Long unbonding periods (>7 days) weaken the peg anchor and force LPs to accept queue risk. This is a structural ceiling on both Exitability modules.",
    expectedBenefit:
      "Reducing to ≤2 days enables near-instant arbitrage, improving both Liquidity & Exit and Peg Stability through tighter peg maintenance.",
    module: "Liquidity & Exit + Peg Stability",
    detect: (r, v2) => {
      if (v2.mode !== "lst-active") return null;
      const days = r.unbondingDays;
      if (days == null || days <= 7) return null;
      return { unbondingDays: 2 };
    },
    effort: "High",
    timeHorizon: "6-8 weeks",
  },
  // Full security posture: audit + timelock combined
  {
    id: "strategic-security-hardening",
    title: "Full security hardening",
    description:
      "Combining audits AND timelock in a single security initiative removes all Security & Governance caps and maximizes the module score.",
    whyItMatters:
      "Missing both audits and timelock means multiple active caps on Security & Governance. Individual fixes help, but the combined package is more efficient.",
    expectedBenefit:
      "A single initiative removes all Security & Governance caps, maximizing the module score and signaling institutional-grade security posture.",
    module: "Security & Governance",
    detect: (_r, v2) => {
      if (v2.mode !== "lst-active") return null;
      const sec = v2.moduleScores["Security & Governance"];
      const hasBothCaps =
        sec.breakdown.auditPosture?.score < 50 &&
        sec.breakdown.governanceControls?.score < 50;
      if (!hasBothCaps) return null;
      return { auditCount: 3, hasTimelock: true };
    },
    effort: "High",
    timeHorizon: "6-8 weeks",
  },
];

// ─── Helper: create opportunity from simulation ─────────────────────────────

function buildOpportunity(
  id: string,
  title: string,
  description: string,
  whyItMatters: string,
  expectedBenefit: string,
  module: string,
  category: ImprovementCategory,
  overrides: Partial<RadarOverviewRecord>,
  record: RadarOverviewRecord,
  v2Result: V2ScoringResult,
  effort: ImprovementOpportunity["effort"],
  timeHorizon: string
): ImprovementOpportunity | null {
  const projected = simulateScore(record, overrides);

  // For strategic opportunities that span multiple modules, use the global score
  const moduleKey = module as V2ModuleKey;
  const currentModule =
    v2Result.moduleScores[moduleKey]?.finalScore ?? v2Result.globalScore;
  const projectedModule =
    projected.moduleScores[moduleKey]?.finalScore ?? projected.globalScore;

  const globalDelta = projected.globalScore - v2Result.globalScore;
  if (globalDelta <= 0) return null;

  return {
    id,
    title,
    description,
    whyItMatters,
    expectedBenefit,
    module,
    category,
    overrides,
    currentModuleScore: currentModule,
    projectedModuleScore: projectedModule,
    currentGlobalScore: v2Result.globalScore,
    projectedGlobalScore: projected.globalScore,
    globalDelta,
    marginalDelta: globalDelta, // placeholder; overwritten after deduplication
    serviceId: matchService(Object.keys(overrides))?.id ?? "lst-protocol-dev",
    effort,
    timeHorizon,
  };
}

// ─── Main detection function ─────────────────────────────────────────────────

export function detectOpportunities(
  record: RadarOverviewRecord,
  v2Result: V2ScoringResult
): ImprovementOpportunity[] {
  const opportunities: ImprovementOpportunity[] = [];
  const seenTitles = new Set<string>();

  const modules = v2Result.moduleScores;

  // ═══ Pass 1: Cap removals (highest impact) ═══
  for (const [moduleName, moduleResult] of Object.entries(modules) as [
    V2ModuleKey,
    ModuleScoreResult,
  ][]) {
    if (!moduleResult.capApplied) continue;

    const capReason = moduleResult.capApplied.reason;
    const fix = CAP_FIXES.find(
      (f) => f.capReason === capReason && f.module === moduleName
    );
    if (!fix || seenTitles.has(fix.title)) continue;

    const overrides = fix.overrides(record);
    const opp = buildOpportunity(
      `cap-${moduleName}-${capReason}`.replace(/\s+/g, "-").toLowerCase(),
      fix.title,
      fix.description,
      fix.whyItMatters,
      fix.expectedBenefit,
      moduleName,
      "cap-removal",
      overrides,
      record,
      v2Result,
      fix.effort,
      fix.timeHorizon
    );

    if (opp) {
      opportunities.push(opp);
      seenTitles.add(fix.title);
    }
  }

  // ═══ Pass 2: Low-scoring inputs (score < 30) ═══
  for (const [moduleName, moduleResult] of Object.entries(modules) as [
    V2ModuleKey,
    ModuleScoreResult,
  ][]) {
    for (const [key, breakdown] of Object.entries(moduleResult.breakdown)) {
      if (breakdown.score >= 30) continue;

      const fix = INPUT_FIXES.find(
        (f) => f.breakdownKey === key && f.module === moduleName
      );
      if (!fix || seenTitles.has(fix.title)) continue;

      const overrides = fix.overrides(record);
      const opp = buildOpportunity(
        `low-${moduleName}-${key}`.replace(/\s+/g, "-").toLowerCase(),
        fix.title,
        fix.description,
        fix.whyItMatters,
        fix.expectedBenefit,
        moduleName,
        "low-input",
        overrides,
        record,
        v2Result,
        fix.effort,
        fix.timeHorizon
      );

      if (opp) {
        opportunities.push(opp);
        seenTitles.add(fix.title);
      }
    }
  }

  // ═══ Pass 3: Missing data (source = "missing") ═══
  for (const [moduleName, moduleResult] of Object.entries(modules) as [
    V2ModuleKey,
    ModuleScoreResult,
  ][]) {
    for (const [key, breakdown] of Object.entries(moduleResult.breakdown)) {
      if (breakdown.source !== "missing") continue;

      const fix = INPUT_FIXES.find(
        (f) => f.breakdownKey === key && f.module === moduleName
      );
      if (!fix || seenTitles.has(fix.title)) continue;

      const overrides = fix.overrides(record);
      const opp = buildOpportunity(
        `missing-${moduleName}-${key}`.replace(/\s+/g, "-").toLowerCase(),
        fix.title,
        fix.description,
        fix.whyItMatters,
        fix.expectedBenefit,
        moduleName,
        "missing-data",
        overrides,
        record,
        v2Result,
        fix.effort,
        fix.timeHorizon
      );

      if (opp) {
        opportunities.push(opp);
        seenTitles.add(fix.title);
      }
    }
  }

  // ═══ Pass 4: Growth opportunities (score 30-70, room to improve) ═══
  for (const [moduleName, moduleResult] of Object.entries(modules) as [
    V2ModuleKey,
    ModuleScoreResult,
  ][]) {
    for (const [key, breakdown] of Object.entries(moduleResult.breakdown)) {
      if (breakdown.score < 30 || breakdown.score > 70) continue;

      const fix = INPUT_FIXES.find(
        (f) => f.breakdownKey === key && f.module === moduleName
      );
      if (!fix || !fix.growthOverrides || seenTitles.has(fix.growthTitle ?? fix.title))
        continue;

      const overrides = fix.growthOverrides(record);
      const title = fix.growthTitle ?? fix.title;
      const opp = buildOpportunity(
        `growth-${moduleName}-${key}`.replace(/\s+/g, "-").toLowerCase(),
        title,
        fix.growthDescription ?? fix.description,
        fix.growthWhyItMatters ?? fix.whyItMatters,
        fix.growthExpectedBenefit ?? fix.expectedBenefit,
        moduleName,
        "growth-opportunity",
        overrides,
        record,
        v2Result,
        fix.growthEffort ?? fix.effort,
        fix.growthTimeHorizon ?? fix.timeHorizon
      );

      if (opp) {
        opportunities.push(opp);
        seenTitles.add(title);
      }
    }
  }

  // ═══ Pass 5: Strategic / agentic analysis (cross-module, contextual) ═══
  for (const rule of STRATEGIC_RULES) {
    if (seenTitles.has(rule.title)) continue;

    const overrides = rule.detect(record, v2Result);
    if (!overrides) continue;

    const opp = buildOpportunity(
      rule.id,
      rule.title,
      rule.description,
      rule.whyItMatters,
      rule.expectedBenefit,
      rule.module,
      "strategic",
      overrides,
      record,
      v2Result,
      rule.effort,
      rule.timeHorizon
    );

    if (opp) {
      opportunities.push(opp);
      seenTitles.add(rule.title);
    }
  }

  // Sort by individual global impact descending
  opportunities.sort((a, b) => b.globalDelta - a.globalDelta);

  // Deduplicate by override fields: keep only the highest-delta opportunity per field.
  // This removes redundant improvements that modify the same underlying data (e.g.,
  // "Improve stable exit depth" and "Grow stable buffer reserves" both patch
  // stableExitLiquidityUsd — selecting both gives the same score as selecting only one).
  const claimedFields = new Set<string>();
  const deduplicated = opportunities.filter((opp) => {
    const fields = Object.keys(opp.overrides);
    if (fields.some((f) => claimedFields.has(f))) return false;
    fields.forEach((f) => claimedFields.add(f));
    return true;
  });

  // Compute marginal delta for each opportunity in priority order.
  // marginalDelta[i] = the additional score gained by adding opportunity i
  // on top of all higher-priority opportunities already applied.
  // This guarantees: sum(marginalDeltas) == Score Potential − Current Score.
  const cumulativeOverrides: Partial<RadarOverviewRecord>[] = [];
  let previousScore = v2Result.globalScore;

  const withMarginal = deduplicated.map((opp) => {
    cumulativeOverrides.push(opp.overrides);
    const newScore = simulateMultiple(record, cumulativeOverrides).globalScore;
    const marginalDelta = Math.max(0, newScore - previousScore);
    previousScore = newScore;
    return { ...opp, marginalDelta };
  });

  return withMarginal;
}

// ─── Max potential score (all improvements combined) ─────────────────────────

/**
 * Returns the global score achievable if every detected improvement is implemented.
 * Uses deduplicated opportunities so overlapping overrides don't conflict.
 */
export function computeMaxPotentialScore(
  record: RadarOverviewRecord,
  v2Result: V2ScoringResult
): number {
  const opportunities = detectOpportunities(record, v2Result);
  if (opportunities.length === 0) return v2Result.globalScore;
  return simulateMultiple(record, opportunities.map((o) => o.overrides)).globalScore;
}
