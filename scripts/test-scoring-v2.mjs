#!/usr/bin/env node
// Quick v2 scoring test — reads networks.generated.json, runs all 6 modules, prints table

import { readFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import { createRequire } from "node:module";

// --- inline normalizers (mirror of normalizers.ts) ---
const TICKET = 1_000_000;

function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

function logScale(val, floor, ceiling) {
  if (val <= 0 || floor <= 0 || ceiling <= floor) return 0;
  const logV = Math.log(val);
  const logF = Math.log(floor);
  const logC = Math.log(ceiling);
  return clamp((logV - logF) / (logC - logF) * 100, 0, 100);
}

function linScale(val, floor, ceiling) {
  if (ceiling <= floor) return 0;
  return clamp((val - floor) / (ceiling - floor) * 100, 0, 100);
}

function execScore(val, ticket = TICKET) {
  return logScale(val, ticket * 2, ticket * 25);
}

function usdScore(val, marketRef, relFloor, relCeiling, ticket = TICKET) {
  if (val <= 0) return 0;
  const exec = execScore(val, ticket);
  const rel = marketRef != null && marketRef > 0
    ? logScale(val / marketRef, relFloor, relCeiling)
    : 0;
  return exec * 0.6 + rel * 0.4;
}

// --- inline engine ---

function scoreRedemption(exists, unbondingDays) {
  if (!exists) return 0;
  if (unbondingDays === null) return 50;
  if (unbondingDays <= 2) return 100;
  if (unbondingDays <= 7) return 80;
  if (unbondingDays <= 21) return 60;
  return 35;
}

function detectMode(n) {
  if (n.hasLst != null) return n.hasLst ? "lst-active" : "pre-lst";
  return (n.lstProtocols ?? 0) >= 1 && (n.lstTvlUsd ?? 0) > 100_000 ? "lst-active" : "pre-lst";
}

function resolveStableExit(n) {
  if (n.stableExitLiquidityUsd != null) return n.stableExitLiquidityUsd;
  if (n.stablecoinLiquidityUsd != null) return n.stablecoinLiquidityUsd * 0.05;
  return null;
}

function scoreLiquidityExit(n, mode) {
  if (mode === "pre-lst") {
    const baseVal = n.baseTokenDexLiquidityUsd ?? n.volume24hUsd ?? 0;
    const stableVal = resolveStableExit(n) ?? 0;
    const baseScore = usdScore(baseVal, n.marketCapUsd, 0.005, 0.10);
    const stableScore = usdScore(stableVal, n.marketCapUsd, 0.003, 0.05);
    const stakingScore = linScale(n.stakingRatioPct ?? 0, 5, 60);
    const raw = Math.round(baseScore * 0.40 + stableScore * 0.40 + stakingScore * 0.20);
    const stableExitExists = n.stableExitRouteExists ?? (stableVal > 500_000);
    const CAP = 45;
    return stableExitExists ? raw : Math.min(raw, CAP);
  }
  // lst-active
  const lstLiq = n.lstDexLiquidityUsd ?? 0;
  const lstScore = usdScore(lstLiq, n.lstTvlUsd, 0.005, 0.15);
  const stableVal = resolveStableExit(n) ?? 0;
  const stableScore = usdScore(stableVal, n.marketCapUsd, 0.003, 0.05);
  const redemptionExists = n.hasLst ?? (n.lstProtocols ?? 0) >= 1;
  const redemptionScore = scoreRedemption(redemptionExists, n.unbondingDays ?? null);
  const raw = Math.round(lstScore * 0.40 + stableScore * 0.35 + redemptionScore * 0.25);
  const stableExitExists = n.stableExitRouteExists ?? (stableVal > 500_000);
  const CAP = 55;
  return stableExitExists ? raw : Math.min(raw, CAP);
}

function scorePegStability(n, mode) {
  if (mode === "pre-lst") {
    const ecosystemScore = logScale(
      n.defiTvlUsd != null && n.marketCapUsd ? n.defiTvlUsd / n.marketCapUsd : 0, 0.02, 0.30
    );
    const stakingScore = linScale(n.stakingRatioPct ?? 0, 20, 70);
    return Math.round(ecosystemScore * 0.50 + stakingScore * 0.50);
  }
  const stableVal = resolveStableExit(n) ?? 0;
  const redemptionExists = n.hasLst ?? (n.lstProtocols ?? 0) >= 1;
  const redemptionScore = scoreRedemption(redemptionExists, n.unbondingDays ?? null);
  const bufferScore = logScale(
    stableVal > 0 && n.marketCapUsd ? stableVal / n.marketCapUsd : 0, 0.003, 0.05
  );
  return Math.round(redemptionScore * 0.65 + bufferScore * 0.35);
}

function scoreDefiMoneyness(n, mode) {
  if (mode === "pre-lst") {
    const defiScore = logScale(
      n.defiTvlUsd != null && n.marketCapUsd ? n.defiTvlUsd / n.marketCapUsd : 0, 0.02, 0.30
    );
    const lendingScore = n.lendingPresence ? 80 : 20;
    return Math.round(defiScore * 0.60 + lendingScore * 0.40);
  }
  const collateralScore = !n.lstCollateralEnabled ? 0 : logScale(n.lstPenetrationPct ?? 0, 0.005, 0.15);
  const defiDepthScore = n.lstTvlUsd != null && n.defiTvlUsd
    ? logScale(n.lstTvlUsd / n.defiTvlUsd, 0.005, 0.10) : 0;
  const breadthScore = logScale(
    n.defiTvlUsd != null && n.marketCapUsd ? n.defiTvlUsd / n.marketCapUsd : 0, 0.02, 0.30
  );
  const raw = Math.round(collateralScore * 0.45 + defiDepthScore * 0.35 + breadthScore * 0.20);
  const CAP = 55;
  return !n.lstCollateralEnabled && raw > CAP ? CAP : raw;
}

function scoreSecurityGovernance(n, mode) {
  if (mode === "pre-lst") {
    const econScore = logScale(n.marketCapUsd ?? 0, 50_000_000, 5_000_000_000);
    const decentScore = logScale(n.validatorCount ?? 0, 15, 200);
    return Math.round(econScore * 0.50 + decentScore * 0.50);
  }
  const auditScore = n.auditCount == null ? 30 : linScale(n.auditCount, 0, 3);
  const timelockScore = n.hasTimelock === null ? 40 : n.hasTimelock ? 80 : 10;
  const maturityScore = logScale(n.lstPenetrationPct ?? 0, 0.001, 0.15);
  const raw = Math.round(auditScore * 0.40 + timelockScore * 0.35 + maturityScore * 0.25);
  const caps = [];
  if ((n.auditCount ?? 0) === 0 && n.auditCount !== null) caps.push(50);
  if (n.hasTimelock === false) caps.push(55);
  const minCap = caps.length ? Math.min(...caps) : Infinity;
  return Math.min(raw, minCap);
}

function scoreValidatorDecentralization(n) {
  const validatorScore = logScale(n.validatorCount ?? 0, 15, 300);
  const providerScore = logScale(n.verifiedProviders ?? 0, 5, 80);
  const commissionScore = linScale(100 - (n.benchmarkCommissionPct ?? 100), 80, 100);
  const raw = Math.round(validatorScore * 0.50 + providerScore * 0.35 + commissionScore * 0.15);
  const CAP = 55;
  return (n.validatorCount ?? 0) < 20 && raw > CAP ? CAP : raw;
}

function scoreIncentiveSustainability(n, mode) {
  if (mode === "pre-lst") {
    const apyScore = linScale(n.stakingApyPct ?? 0, 3, 15);
    const inflationPenalty = n.inflationRatePct != null && n.stakingApyPct != null
      ? Math.max(0, n.inflationRatePct - n.stakingApyPct) : 0;
    const inflationScore = Math.max(0, 100 - inflationPenalty * 10);
    const stakingScore = linScale(n.stakingRatioPct ?? 0, 20, 70);
    return Math.round(apyScore * 0.35 + inflationScore * 0.35 + stakingScore * 0.30);
  }
  const apyScore = linScale(n.stakingApyPct ?? 0, 3, 15);
  const inflationPenalty = n.inflationRatePct != null && n.stakingApyPct != null
    ? Math.max(0, n.inflationRatePct - n.stakingApyPct) : 0;
  const inflationScore = Math.max(0, 100 - inflationPenalty * 10);
  const penetrationScore = logScale(n.lstPenetrationPct ?? 0, 0.01, 0.30);
  const utilityBonus = (n.lstCollateralEnabled ? 15 : 0) + (n.lendingPresence ? 10 : 0);
  const raw = Math.round(apyScore * 0.30 + inflationScore * 0.30 + penetrationScore * 0.25 + Math.min(utilityBonus, 25) * 0.15);
  const CAP = 55;
  return !n.lstCollateralEnabled && !n.lendingPresence && raw > CAP ? CAP : raw;
}

function computeGlobal(scores) {
  const { le, peg, defi, sec, val, inc } = scores;
  const weighted =
    le * 0.25 + peg * 0.15 + defi * 0.15 + sec * 0.15 + val * 0.10 + inc * 0.10;
  return Math.round(weighted / 0.90);
}

// --- main ---

const data = JSON.parse(await readFile("data/networks.generated.json", "utf8"));

const WEIGHTS = { le: "25%", peg: "15%", defi: "15%", sec: "15%", val: "10%", inc: "10%" };

console.log("\n=== Scoring v2 — Full run ===\n");
console.log("Network       | M  |  L&E | Peg  | DeFi | Sec  | Val  | Inc  | GLOBAL");
console.log("--------------|----:|-----:|-----:|-----:|-----:|-----:|-----:|-------:");

for (const n of data) {
  const mode = detectMode(n);
  const m = mode === "lst-active" ? "A" : "P";

  const le  = scoreLiquidityExit(n, mode);
  const peg = scorePegStability(n, mode);
  const defi = scoreDefiMoneyness(n, mode);
  const sec  = scoreSecurityGovernance(n, mode);
  const val  = scoreValidatorDecentralization(n);
  const inc  = scoreIncentiveSustainability(n, mode);
  const glob = computeGlobal({ le, peg, defi, sec, val, inc });

  const name = n.network.padEnd(13);
  const fmt = (v) => String(v).padStart(4);
  console.log(`${name} | ${m} | ${fmt(le)} | ${fmt(peg)} | ${fmt(defi)} | ${fmt(sec)} | ${fmt(val)} | ${fmt(inc)} | ${fmt(glob)}`);
}

console.log("\nWeights: L&E=25%, Peg=15%, DeFi=15%, Sec=15%, Val=10%, Inc=10% | global = sum/0.90\n");
