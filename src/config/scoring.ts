export const MODULE_ORDER = [
  "Liquidity & Exit",
  "Peg Stability",
  "DeFi Moneyness",
  "Security & Governance",
  "Validator Decentralization",
  "Incentive Sustainability",
  "Stress Resilience"
] as const;

export type ModuleName = (typeof MODULE_ORDER)[number];

export const MODULE_WEIGHTS: Record<ModuleName, number> = {
  "Liquidity & Exit": 0.25,
  "Peg Stability": 0.15,
  "DeFi Moneyness": 0.15,
  "Security & Governance": 0.15,
  "Validator Decentralization": 0.1,
  "Incentive Sustainability": 0.1,
  "Stress Resilience": 0.1
};

export const SCORE_BANDS = [
  { min: 85, label: "Institutional Grade", tone: "positive" as const },
  { min: 70, label: "Strong", tone: "positive" as const },
  { min: 55, label: "Usable but Constrained", tone: "warning" as const },
  { min: 40, label: "Fragile", tone: "warning" as const },
  { min: 0, label: "Avoid / Redesign Needed", tone: "risk" as const }
];
