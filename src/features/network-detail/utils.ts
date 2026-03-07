import type {
  ContagionRiskLabel,
  DetailOpportunity,
  DetailRedFlag,
  LpAttractivenessLabel
} from "@/features/network-detail/types";
import { formatUsdCompactStable } from "@/lib/number-format";

export function formatUsdCompact(value: number): string {
  return formatUsdCompactStable(value);
}

export function formatUsd(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(value);
}

export function formatPercent(value: number, digits = 1): string {
  return `${value.toFixed(digits)}%`;
}

export function healthScoreClass(score: number): string {
  if (score >= 72) return "border-mint/40 bg-mint/12 text-mint";
  if (score >= 60) return "border-amber/40 bg-amber/12 text-amber";
  return "border-coral/40 bg-coral/12 text-coral";
}

export function opportunityScoreClass(score: number): string {
  if (score >= 85) return "border-[#7baff5]/40 bg-[#7baff5]/15 text-[#a9ceff]";
  if (score >= 70) return "border-amber/40 bg-amber/12 text-amber";
  return "border-ink-300/35 bg-ink-300/10 text-ink-200";
}

export function lpAttractivenessClass(label: LpAttractivenessLabel): string {
  switch (label) {
    case "Strong":
      return "border-mint/40 bg-mint/12 text-mint";
    case "Medium":
      return "border-amber/40 bg-amber/12 text-amber";
    case "Opportunistic":
      return "border-[#7baff5]/40 bg-[#7baff5]/15 text-[#a9ceff]";
    case "Cautious":
      return "border-coral/40 bg-coral/12 text-coral";
    default:
      return "border-ink-300/35 bg-ink-300/10 text-ink-200";
  }
}

export function moduleScoreClass(score: number): string {
  if (score >= 72) return "border-mint/40 bg-mint/12 text-mint";
  if (score >= 60) return "border-amber/40 bg-amber/12 text-amber";
  return "border-coral/40 bg-coral/12 text-coral";
}

export function opportunityImpactClass(impact: DetailOpportunity["impact"]): string {
  switch (impact) {
    case "Very High":
      return "border-[#7baff5]/40 bg-[#7baff5]/15 text-[#a9ceff]";
    case "High":
      return "border-mint/40 bg-mint/12 text-mint";
    case "Medium":
      return "border-amber/40 bg-amber/12 text-amber";
    case "Low":
      return "border-ink-300/35 bg-ink-300/10 text-ink-200";
    default:
      return "border-ink-300/35 bg-ink-300/10 text-ink-200";
  }
}

export function redFlagSeverityClass(severity: DetailRedFlag["severity"]): string {
  if (severity === "High") return "border-coral/40 bg-coral/12 text-coral";
  if (severity === "Medium") return "border-amber/40 bg-amber/12 text-amber";
  return "border-ink-300/35 bg-ink-300/10 text-ink-200";
}

export function contagionClass(risk: ContagionRiskLabel): string {
  if (risk === "High") return "border-coral/40 bg-coral/12 text-coral";
  if (risk === "Medium") return "border-amber/40 bg-amber/12 text-amber";
  return "border-mint/40 bg-mint/12 text-mint";
}
