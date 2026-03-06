import { MODULE_ORDER, MODULE_WEIGHTS, SCORE_BANDS } from "@/config/scoring";
import { ModuleSnapshot } from "@/data/mock-networks";

export function computeGlobalScore(modules: ModuleSnapshot[]): number {
  const weighted = modules.reduce((sum, module) => {
    return sum + module.score * MODULE_WEIGHTS[module.name];
  }, 0);

  return Math.round(weighted);
}

export function resolveScoreBand(score: number) {
  return SCORE_BANDS.find((band) => score >= band.min) ?? SCORE_BANDS[SCORE_BANDS.length - 1];
}

export function orderModules(modules: ModuleSnapshot[]): ModuleSnapshot[] {
  const orderMap = new Map(MODULE_ORDER.map((name, index) => [name, index]));

  return [...modules].sort((a, b) => {
    return (orderMap.get(a.name) ?? 0) - (orderMap.get(b.name) ?? 0);
  });
}

export function toneClasses(tone: "positive" | "warning" | "risk") {
  if (tone === "positive") {
    return "text-mint bg-mint/10 border-mint/35";
  }

  if (tone === "warning") {
    return "text-amber bg-amber/10 border-amber/35";
  }

  return "text-coral bg-coral/10 border-coral/35";
}
