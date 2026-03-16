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
    module: "Security & Governance",
    overrides: () => ({ auditCount: 2 }),
    effort: "Medium",
    timeHorizon: "1-3 months",
  },
  {
    capReason: "Sin timelock",
    title: "Implement governance timelock",
    description:
      "Add timelock controls to protocol upgrades, removing the governance score cap.",
    module: "Security & Governance",
    overrides: () => ({ hasTimelock: true }),
    effort: "Medium",
    timeHorizon: "1-2 months",
  },
  {
    capReason: "Sin ruta stable documentada",
    title: "Establish stable exit route",
    description:
      "Deploy stablecoin liquidity pools to create a reliable exit path for the base token.",
    module: "Liquidity & Exit",
    overrides: (r) => ({
      stableExitRouteExists: true,
      stableExitLiquidityUsd: (r.marketCapUsd ?? 1_000_000) * 0.01,
    }),
    effort: "Medium",
    timeHorizon: "1-2 months",
  },
  {
    capReason: "Sin ruta stable",
    title: "Establish stable exit route",
    description:
      "Deploy stablecoin liquidity pools for reliable LST-to-stable exit path.",
    module: "Liquidity & Exit",
    overrides: (r) => ({
      stableExitRouteExists: true,
      stableExitLiquidityUsd: (r.marketCapUsd ?? 1_000_000) * 0.01,
    }),
    effort: "Medium",
    timeHorizon: "1-2 months",
  },
  {
    capReason: "Sin redención nativa",
    title: "Build native redemption mechanism",
    description:
      "Implement a native LST redemption path with reasonable unbonding to anchor the peg.",
    module: "Liquidity & Exit",
    overrides: () => ({ hasLst: true, unbondingDays: 7 }),
    effort: "High",
    timeHorizon: "3-6 months",
  },
  {
    capReason: "LST no usado como colateral",
    title: "Enable LST as lending collateral",
    description:
      "Integrate the LST as accepted collateral in lending protocols to unlock structural demand.",
    module: "DeFi Moneyness",
    overrides: () => ({ lstCollateralEnabled: true }),
    effort: "High",
    timeHorizon: "2-4 months",
  },
  {
    capReason: "Concentración extrema de validadores",
    title: "Expand validator set",
    description:
      "Deploy additional validators to improve decentralization above the critical 20-node threshold.",
    module: "Validator Decentralization",
    overrides: () => ({ validatorCount: 50 }),
    effort: "Medium",
    timeHorizon: "1-3 months",
  },
  {
    capReason: "Yield negativo sin demanda estructural",
    title: "Build structural demand drivers",
    description:
      "Enable lending presence and collateral use to create organic demand that offsets negative real yield.",
    module: "Incentive Sustainability",
    overrides: () => ({ lendingPresence: true, lstCollateralEnabled: true }),
    effort: "High",
    timeHorizon: "2-4 months",
  },
];

// ─── Input-level fix definitions (shared by passes 2, 3, and 4) ─────────────

type InputFix = {
  breakdownKey: string;
  module: V2ModuleKey;
  title: string;
  description: string;
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
};

const INPUT_FIXES: InputFix[] = [
  {
    breakdownKey: "lstLiquidity",
    module: "Liquidity & Exit",
    title: "Deepen LST DEX liquidity",
    description:
      "Increase LST liquidity on DEXes to improve exit capacity and reduce slippage.",
    overrides: (r) => ({
      lstDexLiquidityUsd: (r.lstTvlUsd ?? 1_000_000) * 0.08,
    }),
    growthOverrides: (r) => ({
      lstDexLiquidityUsd: (r.lstTvlUsd ?? 1_000_000) * 0.15,
    }),
    growthTitle: "Scale LST DEX liquidity to top-tier depth",
    growthDescription:
      "Push LST liquidity to 15%+ of TVL for institutional-grade exit capacity with minimal slippage.",
    effort: "Medium",
    growthEffort: "High",
    timeHorizon: "1-2 months",
    growthTimeHorizon: "2-4 months",
  },
  {
    breakdownKey: "stableExit",
    module: "Liquidity & Exit",
    title: "Improve stable exit depth",
    description:
      "Increase stablecoin liquidity for smoother LST-to-stable exits.",
    overrides: (r) => ({
      stableExitLiquidityUsd: (r.marketCapUsd ?? 1_000_000) * 0.02,
    }),
    growthOverrides: (r) => ({
      stableExitLiquidityUsd: (r.marketCapUsd ?? 1_000_000) * 0.04,
    }),
    growthTitle: "Scale stable exit to premium depth",
    growthDescription:
      "Grow stablecoin exit liquidity to 4%+ of market cap for large-scale LP exits without haircut.",
    effort: "Medium",
    growthEffort: "High",
    timeHorizon: "1-2 months",
    growthTimeHorizon: "2-4 months",
  },
  {
    breakdownKey: "stableExitDepth",
    module: "Liquidity & Exit",
    title: "Improve stable exit depth",
    description:
      "Increase stablecoin liquidity for smoother base token exits.",
    overrides: (r) => ({
      stableExitLiquidityUsd: (r.marketCapUsd ?? 1_000_000) * 0.02,
    }),
    growthOverrides: (r) => ({
      stableExitLiquidityUsd: (r.marketCapUsd ?? 1_000_000) * 0.04,
    }),
    growthTitle: "Scale stable exit to premium depth",
    growthDescription:
      "Grow stablecoin exit depth to 4%+ of market cap for institutional exits.",
    effort: "Medium",
    growthEffort: "High",
    timeHorizon: "1-2 months",
    growthTimeHorizon: "2-4 months",
  },
  {
    breakdownKey: "collateralIntegration",
    module: "DeFi Moneyness",
    title: "Enable LST collateral integration",
    description:
      "List the LST as collateral in lending protocols to grow DeFi utility.",
    overrides: () => ({ lstCollateralEnabled: true, lstPenetrationPct: 5 }),
    growthOverrides: () => ({ lstCollateralEnabled: true, lstPenetrationPct: 12 }),
    growthTitle: "Deepen LST collateral penetration",
    growthDescription:
      "Expand LST collateral usage to 12%+ penetration across multiple lending venues.",
    effort: "High",
    growthEffort: "High",
    timeHorizon: "2-4 months",
    growthTimeHorizon: "3-6 months",
  },
  {
    breakdownKey: "defiDepth",
    module: "DeFi Moneyness",
    title: "Grow LST DeFi integrations",
    description:
      "Integrate the LST into more DeFi protocols (vaults, AMMs, yield aggregators).",
    overrides: (r) => ({
      lstTvlUsd: (r.defiTvlUsd ?? 1_000_000) * 0.05,
    }),
    growthOverrides: (r) => ({
      lstTvlUsd: (r.defiTvlUsd ?? 1_000_000) * 0.08,
    }),
    growthTitle: "Scale LST presence across DeFi ecosystem",
    growthDescription:
      "Grow LST TVL to 8%+ of DeFi TVL through vault strategies, yield aggregators, and AMM partnerships.",
    effort: "Medium",
    growthEffort: "High",
    timeHorizon: "2-3 months",
    growthTimeHorizon: "3-6 months",
  },
  {
    breakdownKey: "operatorQuality",
    module: "Validator Decentralization",
    title: "Onboard verified staking providers",
    description:
      "Attract professional staking operators to improve validator quality ratio.",
    overrides: (r) => ({
      verifiedProviders: Math.max((r.verifiedProviders ?? 0) + 10, 15),
    }),
    growthOverrides: (r) => ({
      verifiedProviders: Math.max((r.verifiedProviders ?? 0) + 25, 30),
    }),
    growthTitle: "Build premium validator ecosystem",
    growthDescription:
      "Attract 30+ verified professional operators to reach top-tier decentralization quality.",
    effort: "Medium",
    growthEffort: "High",
    timeHorizon: "1-3 months",
    growthTimeHorizon: "3-6 months",
  },
  {
    breakdownKey: "lendingInfrastructure",
    module: "DeFi Moneyness",
    title: "Deploy lending infrastructure",
    description:
      "Launch or integrate lending protocols on the chain to support DeFi composability.",
    overrides: () => ({ lendingPresence: true }),
    effort: "High",
    timeHorizon: "2-4 months",
  },
  {
    breakdownKey: "validatorBreadth",
    module: "Validator Decentralization",
    title: "Expand validator count",
    description:
      "Increase the number of active validators to strengthen network decentralization.",
    overrides: (r) => ({
      validatorCount: Math.max((r.validatorCount ?? 0) * 2, 80),
    }),
    growthOverrides: (r) => ({
      validatorCount: Math.max((r.validatorCount ?? 0) * 3, 150),
    }),
    growthTitle: "Scale to 150+ validators",
    growthDescription:
      "Grow the validator set to 150+ for strong censorship resistance and geographic distribution.",
    effort: "Medium",
    growthEffort: "High",
    timeHorizon: "1-3 months",
    growthTimeHorizon: "3-6 months",
  },
  {
    breakdownKey: "redemptionAnchor",
    module: "Liquidity & Exit",
    title: "Optimize unbonding period",
    description:
      "Reduce unbonding time to improve the redemption anchor score and LST peg confidence.",
    overrides: () => ({ unbondingDays: 7 }),
    growthOverrides: () => ({ unbondingDays: 2 }),
    growthTitle: "Achieve fast-track unbonding",
    growthDescription:
      "Reduce unbonding to ≤2 days for maximum redemption score — enables instant-like exits.",
    effort: "High",
    growthEffort: "High",
    timeHorizon: "2-4 months",
    growthTimeHorizon: "3-6 months",
  },
  {
    breakdownKey: "stableBuffer",
    module: "Peg Stability",
    title: "Grow stable buffer reserves",
    description:
      "Increase stablecoin reserves relative to market cap to strengthen peg defense.",
    overrides: (r) => ({
      stableExitLiquidityUsd: (r.marketCapUsd ?? 1_000_000) * 0.02,
    }),
    growthOverrides: (r) => ({
      stableExitLiquidityUsd: (r.marketCapUsd ?? 1_000_000) * 0.04,
    }),
    growthTitle: "Build deep peg defense buffer",
    growthDescription:
      "Scale stable reserves to 4%+ of market cap for robust peg defense under stress conditions.",
    effort: "Medium",
    growthEffort: "High",
    timeHorizon: "1-2 months",
    growthTimeHorizon: "2-4 months",
  },
  {
    breakdownKey: "defiEcosystem",
    module: "DeFi Moneyness",
    title: "Expand DeFi ecosystem breadth",
    description:
      "Grow the on-chain DeFi ecosystem to support deeper LST integration.",
    overrides: (r) => ({
      defiTvlUsd: (r.marketCapUsd ?? 1_000_000) * 0.15,
    }),
    growthOverrides: (r) => ({
      defiTvlUsd: (r.marketCapUsd ?? 1_000_000) * 0.25,
    }),
    growthTitle: "Scale DeFi TVL to 25%+ of market cap",
    growthDescription:
      "Grow the DeFi ecosystem to provide a deep and diverse environment for LST composability.",
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
    overrides: (r) => ({
      defiTvlUsd: (r.marketCapUsd ?? 1_000_000) * 0.15,
    }),
    growthOverrides: (r) => ({
      defiTvlUsd: (r.marketCapUsd ?? 1_000_000) * 0.25,
    }),
    growthTitle: "Scale DeFi breadth for maximum LST composability",
    growthDescription:
      "Grow DeFi TVL / market cap ratio to 25%+ for a rich, diverse LST integration surface.",
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
    overrides: () => ({ stakingApyPct: 6, inflationRatePct: 2 }),
    growthOverrides: () => ({ stakingApyPct: 8, inflationRatePct: 1 }),
    growthTitle: "Achieve premium real yield",
    growthDescription:
      "Target 7%+ real yield through protocol fee sharing and optimized emission schedules.",
    effort: "High",
    growthEffort: "High",
    timeHorizon: "3-6 months",
    growthTimeHorizon: "6-12 months",
  },
  {
    breakdownKey: "adoptionDepth",
    module: "Incentive Sustainability",
    title: "Grow LST adoption",
    description:
      "Increase LST penetration through incentive programs and DeFi integrations.",
    overrides: () => ({ lstPenetrationPct: 5 }),
    growthOverrides: () => ({ lstPenetrationPct: 10 }),
    growthTitle: "Drive LST to 10%+ penetration",
    growthDescription:
      "Scale LST adoption to 10%+ of staked value through ecosystem partnerships and yield strategies.",
    effort: "Medium",
    growthEffort: "High",
    timeHorizon: "2-4 months",
    growthTimeHorizon: "4-8 months",
  },
  {
    breakdownKey: "marketCompetitiveness",
    module: "Validator Decentralization",
    title: "Optimize validator commission structure",
    description:
      "Encourage competitive commission rates to improve the market competitiveness score.",
    overrides: () => ({ benchmarkCommissionPct: 10 }),
    growthOverrides: () => ({ benchmarkCommissionPct: 5 }),
    growthTitle: "Achieve best-in-class commission rates",
    growthDescription:
      "Drive benchmark commission to <5% for maximum delegator attractiveness.",
    effort: "Low",
    growthEffort: "Medium",
    timeHorizon: "1-2 months",
    growthTimeHorizon: "2-4 months",
  },
];

// ─── Strategic / agentic analysis definitions ────────────────────────────────

type StrategicRule = {
  id: string;
  title: string;
  description: string;
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
    timeHorizon: "1-3 months",
  },
  // Credibility gap: all 3 credibility modules below 50
  {
    id: "strategic-credibility-package",
    title: "Credibility acceleration package",
    description:
      "Security, Validator, and Incentive modules are all below 50. A combined audit + timelock + validator expansion package would lift the entire Credibility pillar.",
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
    timeHorizon: "3-6 months",
  },
  // DeFi + Incentive synergy: enabling collateral + lending helps both modules
  {
    id: "strategic-defi-flywheel",
    title: "DeFi demand flywheel",
    description:
      "Enabling LST as collateral AND lending presence creates a compounding effect: it improves DeFi Moneyness and Incentive Sustainability simultaneously by driving structural demand.",
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
    timeHorizon: "3-6 months",
  },
  // Fast unbonding upgrade: if unbonding is >7 days, optimizing it helps L&E and Peg
  {
    id: "strategic-fast-unbonding",
    title: "Fast unbonding upgrade",
    description:
      "Reducing unbonding from >7 days to ≤2 days improves both Liquidity & Exit and Peg Stability — the two components of the Exitability pillar.",
    module: "Liquidity & Exit + Peg Stability",
    detect: (r, v2) => {
      if (v2.mode !== "lst-active") return null;
      const days = r.unbondingDays;
      if (days == null || days <= 7) return null;
      return { unbondingDays: 2 };
    },
    effort: "High",
    timeHorizon: "3-6 months",
  },
  // Full security posture: audit + timelock combined
  {
    id: "strategic-security-hardening",
    title: "Full security hardening",
    description:
      "Combining audits AND timelock in a single security initiative removes all Security & Governance caps and maximizes the module score.",
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
    timeHorizon: "2-4 months",
  },
];

// ─── Helper: create opportunity from simulation ─────────────────────────────

function buildOpportunity(
  id: string,
  title: string,
  description: string,
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
    module,
    category,
    overrides,
    currentModuleScore: currentModule,
    projectedModuleScore: projectedModule,
    currentGlobalScore: v2Result.globalScore,
    projectedGlobalScore: projected.globalScore,
    globalDelta,
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

  // Sort by global impact descending
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

  return deduplicated;
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
