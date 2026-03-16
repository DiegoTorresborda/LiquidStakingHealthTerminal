import type { ProtofireService } from "./types";

export const SERVICE_CATALOG: ProtofireService[] = [
  {
    id: "lst-protocol-dev",
    name: "LST Protocol Development",
    category: "LST Protocol Development",
    description:
      "Design and build a liquid staking protocol with native redemption mechanism, including smart contract development and deployment.",
    typicalTimeline: "3-6 months",
    relatedFields: ["hasLst", "unbondingDays", "lstTvlUsd", "lstPenetrationPct"],
  },
  {
    id: "security-audit",
    name: "Security Audit Coordination",
    category: "Security",
    description:
      "Coordinate and manage security audits with top-tier audit firms for the LST protocol smart contracts.",
    typicalTimeline: "1-3 months",
    relatedFields: ["auditCount"],
  },
  {
    id: "timelock-governance",
    name: "Timelock & Governance Implementation",
    category: "Security",
    description:
      "Implement timelock mechanisms and governance controls for protocol upgrades and parameter changes.",
    typicalTimeline: "1-2 months",
    relatedFields: ["hasTimelock"],
  },
  {
    id: "dex-liquidity",
    name: "DEX Liquidity Strategy",
    category: "Liquidity Strategy",
    description:
      "Design and deploy LST liquidity pools across DEXes, including stable pair routing and incentive programs.",
    typicalTimeline: "1-2 months",
    relatedFields: [
      "lstDexLiquidityUsd",
      "stableExitLiquidityUsd",
      "stableExitRouteExists",
    ],
  },
  {
    id: "lending-integration",
    name: "Lending Protocol Integration",
    category: "DeFi Integration",
    description:
      "Integrate the LST as collateral in lending protocols (Aave, Compound forks, etc.) to unlock leveraged staking and structural demand.",
    typicalTimeline: "2-4 months",
    relatedFields: ["lendingPresence", "lstCollateralEnabled"],
  },
  {
    id: "validator-infra",
    name: "Validator Infrastructure",
    category: "Validator Infrastructure",
    description:
      "Deploy and manage additional validator nodes to improve network decentralization and staking quality.",
    typicalTimeline: "1-3 months",
    relatedFields: ["validatorCount", "verifiedProviders"],
  },
];

/** Find the best-matching service for a set of override keys */
export function matchService(
  overrideKeys: string[]
): ProtofireService | undefined {
  let best: ProtofireService | undefined;
  let bestOverlap = 0;

  for (const service of SERVICE_CATALOG) {
    const overlap = service.relatedFields.filter((f) =>
      overrideKeys.includes(f)
    ).length;
    if (overlap > bestOverlap) {
      bestOverlap = overlap;
      best = service;
    }
  }

  return best;
}
