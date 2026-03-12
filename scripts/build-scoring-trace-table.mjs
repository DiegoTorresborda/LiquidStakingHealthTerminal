#!/usr/bin/env node

import { readFile, writeFile } from "node:fs/promises";

const NETWORKS_TS_PATH = new URL("../data/networks.ts", import.meta.url);
const GENERATED_PATH = new URL("../data/networks.generated.json", import.meta.url);
const OUTPUT_JSON_PATH = new URL("../data/scoring-trace-table.json", import.meta.url);
const OUTPUT_MD_PATH = new URL("../docs/scoring-trace-table.md", import.meta.url);

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function round(value) {
  return Math.round(clamp(value, 0, 100));
}

function scale(value, min, max) {
  if (max <= min) return 0;
  const normalized = (value - min) / (max - min);
  return clamp(normalized * 100, 0, 100);
}

function toRange(value, minIn, maxIn, minOut, maxOut) {
  const normalized = scale(value, minIn, maxIn) / 100;
  return minOut + normalized * (maxOut - minOut);
}

function weighted(scores) {
  return scores.reduce((sum, item) => sum + item.score * item.weight, 0);
}

function toFiniteNumber(value) {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function toNullableBoolean(value) {
  return typeof value === "boolean" ? value : null;
}

function toNullableString(value) {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function finalizeScore(raw, penalties = [], caps = []) {
  const rawScore = round(raw);
  const penaltyPoints = penalties.reduce((sum, penalty) => sum + penalty.points, 0);
  const scoreAfterPenalties = round(rawScore - penaltyPoints);

  const sortedCaps = [...caps].sort((a, b) => a.value - b.value);
  const capApplied = sortedCaps.find((cap) => cap.value < scoreAfterPenalties);
  const cappedScore = capApplied ? round(capApplied.value) : scoreAfterPenalties;

  return {
    rawScore,
    penaltyPoints,
    scoreAfterPenalties,
    cappedScore,
    finalScore: cappedScore,
    penalties,
    capsConsidered: sortedCaps,
    capApplied
  };
}

function extractBaseNetworks(source) {
  const marker = "const baseNetworks: Network[] = ";
  const start = source.indexOf(marker);
  if (start < 0) throw new Error("Could not find baseNetworks in data/networks.ts");

  const assignmentIndex = source.indexOf("=", start);
  if (assignmentIndex < 0) throw new Error("Could not find assignment for baseNetworks");

  const arrayStart = source.indexOf("[", assignmentIndex);
  if (arrayStart < 0) throw new Error("Could not find opening [ for baseNetworks");

  let depth = 0;
  let endIndex = -1;
  for (let i = arrayStart; i < source.length; i += 1) {
    const char = source[i];
    if (char === "[") depth += 1;
    if (char === "]") {
      depth -= 1;
      if (depth === 0) {
        endIndex = i;
        break;
      }
    }
  }

  if (endIndex < 0) throw new Error("Could not find closing ] for baseNetworks");

  const arrayLiteral = source.slice(arrayStart, endIndex + 1);
  const evaluator = new Function(`"use strict"; return (${arrayLiteral});`);
  return evaluator();
}

function applyDerivedMetrics(network) {
  const hasTokenRatioInputs =
    typeof network.stakedTokens === "number" &&
    Number.isFinite(network.stakedTokens) &&
    typeof network.circulatingSupply === "number" &&
    Number.isFinite(network.circulatingSupply) &&
    network.circulatingSupply > 0;

  const derivedTokenRatioPct = hasTokenRatioInputs ? (network.stakedTokens / network.circulatingSupply) * 100 : null;
  const isDerivedTokenRatioUsable =
    typeof derivedTokenRatioPct === "number" &&
    Number.isFinite(derivedTokenRatioPct) &&
    derivedTokenRatioPct >= 0 &&
    derivedTokenRatioPct <= 100;

  const resolvedStakingRatioPct = isDerivedTokenRatioUsable ? derivedTokenRatioPct : network.stakingRatioPct;

  const stakedValueUsd = (network.marketCapUsd * resolvedStakingRatioPct) / 100;
  const tvlToMcapPct = network.marketCapUsd > 0 ? (network.defiTvlUsd / network.marketCapUsd) * 100 : network.tvlToMcapPct;
  const lstPenetrationPct = stakedValueUsd > 0 ? (network.lstTvlUsd / stakedValueUsd) * 100 : network.lstPenetrationPct;

  return {
    ...network,
    stakingRatioPct: Number(resolvedStakingRatioPct.toFixed(2)),
    stakedValueUsd: Number(stakedValueUsd.toFixed(0)),
    tvlToMcapPct: Number(tvlToMcapPct.toFixed(1)),
    lstPenetrationPct: Number(lstPenetrationPct.toFixed(1))
  };
}

function mergeNetworks(baseNetworks, generatedRecords) {
  const generatedById = new Map(generatedRecords.map((entry) => [entry.networkId, entry]));

  return baseNetworks.map((base) => {
    const live = generatedById.get(base.networkId);

    const merged = {
      ...base,
      category: toNullableString(live?.category) ?? base.category,
      status: toNullableString(live?.status) ?? base.status,
      fdvUsd: toFiniteNumber(live?.fdvUsd) ?? base.fdvUsd,
      circulatingSupplyPct: toFiniteNumber(live?.circulatingSupplyPct) ?? base.circulatingSupplyPct,
      stakerAddresses: toFiniteNumber(live?.stakerAddresses) ?? base.stakerAddresses,
      lstProtocols: toFiniteNumber(live?.lstProtocols) ?? base.lstProtocols,
      largestLst: toNullableString(live?.largestLst) ?? base.largestLst,
      lendingPresence: toNullableBoolean(live?.lendingPresence) ?? base.lendingPresence,
      lstCollateralEnabled: toNullableBoolean(live?.lstCollateralEnabled) ?? base.lstCollateralEnabled,
      mainBottleneck: toNullableString(live?.mainBottleneck) ?? base.mainBottleneck,
      mainOpportunity: toNullableString(live?.mainOpportunity) ?? base.mainOpportunity,
      marketCapUsd: toFiniteNumber(live?.marketCapUsd) ?? base.marketCapUsd,
      circulatingSupply: toFiniteNumber(live?.circulatingSupply) ?? base.circulatingSupply,
      stakedTokens: toFiniteNumber(live?.stakedTokens) ?? base.stakedTokens ?? null,
      priceUsd: toFiniteNumber(live?.priceUsd) ?? base.priceUsd ?? null,
      volume24hUsd: toFiniteNumber(live?.volume24hUsd) ?? base.volume24hUsd ?? null,
      stakingRatioPct: toFiniteNumber(live?.stakingRatioPct) ?? base.stakingRatioPct,
      stakingApyPct: toFiniteNumber(live?.stakingApyPct) ?? base.stakingApyPct,
      defiTvlUsd: toFiniteNumber(live?.defiTvlUsd) ?? base.defiTvlUsd,
      stablecoinLiquidityUsd: toFiniteNumber(live?.stablecoinLiquidityUsd) ?? base.stablecoinLiquidityUsd,
      validatorCount: toFiniteNumber(live?.validatorCount) ?? base.validatorCount,
      lstTvlUsd: toFiniteNumber(live?.lstTvlUsd) ?? base.lstTvlUsd,
      globalLstHealthScore: toFiniteNumber(live?.globalLstHealthScore) ?? base.globalLstHealthScore,
      opportunityScore: toFiniteNumber(live?.opportunityScore) ?? base.opportunityScore,
      fieldQuality: typeof live?.fieldQuality === "object" && live?.fieldQuality !== null ? live.fieldQuality : {},
      __live: live ?? null
    };

    return applyDerivedMetrics(merged);
  });
}

function deriveSignals(network) {
  const stableRatio = network.stablecoinLiquidityUsd / Math.max(network.stakedValueUsd, 1);
  const stableDepthSignal = toRange(stableRatio, 0.03, 0.2, -5, 6);
  const defiDepthSignal = toRange(network.tvlToMcapPct, 7, 34, 0, 8);
  const governanceSignal = toRange(network.validatorCount, 60, 135, -2, 5);
  const validatorSignal =
    toRange(network.validatorCount, 60, 135, -3, 6) + toRange(network.stakerAddresses, 40000, 220000, -2, 4);
  const yieldSignal = toRange(9.5 - network.stakingApyPct, 0, 4, -3, 4);
  const redemptionSignal = network.lstProtocols >= 2 ? 2 : -4;
  const penetrationSignal = network.lstPenetrationPct >= 14 ? 1 : -2;

  return {
    stableRatio,
    stableDepthSignal,
    defiDepthSignal,
    governanceSignal,
    validatorSignal,
    yieldSignal,
    redemptionSignal,
    penetrationSignal
  };
}

function deriveBaselines(network, signals) {
  const base = network.globalLstHealthScore;

  return {
    "Liquidity & Exit": round(
      clamp(base - 8 + signals.stableDepthSignal + signals.redemptionSignal + signals.penetrationSignal, 30, 92)
    ),
    "Peg Stability": round(clamp(base + 2 + signals.stableDepthSignal / 2 + signals.redemptionSignal, 30, 92)),
    "DeFi Moneyness": round(
      clamp(
        base - 15 +
          signals.defiDepthSignal +
          (network.lendingPresence ? 2 : -3) +
          (network.lstCollateralEnabled ? 3 : -4),
        25,
        90
      )
    ),
    "Security & Governance": round(
      clamp(base + 5 + signals.governanceSignal + (network.lendingPresence ? 1 : 0), 35, 92)
    ),
    "Validator Decentralization": round(clamp(base + 7 + signals.validatorSignal, 30, 95)),
    "Incentive Sustainability": round(
      clamp(
        base - 8 + signals.yieldSignal + (network.lstCollateralEnabled ? 1 : -2) + (network.lendingPresence ? 1 : 0),
        25,
        88
      )
    ),
    "Stress Resilience": round(
      clamp(
        base - 6 +
          signals.stableDepthSignal / 2 +
          (network.validatorCount >= 90 ? 2 : 0) +
          (network.stablecoinLiquidityUsd >= 120_000_000 ? 1 : -2),
        25,
        90
      )
    )
  };
}

function deriveFlags(network) {
  const stablecoinExitExists = network.stablecoinLiquidityUsd >= 70_000_000;
  const redemptionPathExists = network.lstProtocols >= 2;

  return {
    stablecoinExitExists,
    redemptionPathExists,
    extremeLpConcentrationPenalty:
      network.lstProtocols === 1 ? (network.lstPenetrationPct < 10 ? 10 : 5) : 0,
    persistentLargeDiscount: !redemptionPathExists || network.stablecoinLiquidityUsd < 60_000_000,
    extremeVolatilityPenalty:
      network.stablecoinLiquidityUsd < 30_000_000 ? 10 : network.stablecoinLiquidityUsd < 60_000_000 ? 5 : 0,
    redemptionUnavailable: !redemptionPathExists,
    lstUsedAsCollateral: network.lstCollateralEnabled,
    noAudits: network.marketCapUsd < 1_200_000_000 && network.lstProtocols === 1,
    noTimelockUpgrades: !network.lendingPresence && !network.lstCollateralEnabled,
    extremeConcentration: network.validatorCount < 65,
    emissionsDominate: network.stakingApyPct >= 8.8 && !network.lstCollateralEnabled
  };
}

function computeModuleBreakdowns(baselines, flags) {
  const modules = {};

  modules["Liquidity & Exit"] = finalizeScore(
    baselines["Liquidity & Exit"],
    flags.extremeLpConcentrationPenalty
      ? [{ reason: "Extreme LP concentration", points: flags.extremeLpConcentrationPenalty }]
      : [],
    [
      ...(!flags.stablecoinExitExists ? [{ reason: "No stablecoin exit route", value: 55 }] : []),
      ...(!flags.redemptionPathExists ? [{ reason: "No redemption path", value: 60 }] : [])
    ]
  );

  modules["Peg Stability"] = finalizeScore(
    baselines["Peg Stability"],
    flags.extremeVolatilityPenalty
      ? [{ reason: "Extreme discount volatility", points: flags.extremeVolatilityPenalty }]
      : [],
    [
      ...(!flags.redemptionPathExists ? [{ reason: "No redemption path", value: 55 }] : []),
      ...(flags.persistentLargeDiscount ? [{ reason: "Persistent large discount", value: 45 }] : [])
    ]
  );

  modules["DeFi Moneyness"] = finalizeScore(
    baselines["DeFi Moneyness"],
    [],
    [...(!flags.lstUsedAsCollateral ? [{ reason: "LST not used as collateral", value: 55 }] : [])]
  );

  modules["Security & Governance"] = finalizeScore(
    baselines["Security & Governance"],
    [],
    [
      ...(flags.noAudits ? [{ reason: "No audits", value: 50 }] : []),
      ...(flags.noTimelockUpgrades ? [{ reason: "No timelock upgrades", value: 55 }] : [])
    ]
  );

  modules["Validator Decentralization"] = finalizeScore(
    baselines["Validator Decentralization"],
    [],
    [...(flags.extremeConcentration ? [{ reason: "Extreme validator concentration", value: 55 }] : [])]
  );

  modules["Incentive Sustainability"] = finalizeScore(
    baselines["Incentive Sustainability"],
    [],
    [...(flags.emissionsDominate ? [{ reason: "Emissions dominate ecosystem attractiveness", value: 55 }] : [])]
  );

  modules["Stress Resilience"] = finalizeScore(
    baselines["Stress Resilience"],
    [],
    [...(flags.redemptionUnavailable ? [{ reason: "Redemption unavailable", value: 50 }] : [])]
  );

  return modules;
}

function fieldOrigin(network, field) {
  const live = network.__live;
  const hasLiveValue = live && live[field] !== null && live[field] !== undefined;

  if (field === "stakedValueUsd" || field === "tvlToMcapPct" || field === "lstPenetrationPct") {
    return "derived(app)";
  }

  if (hasLiveValue) {
    const quality = network.fieldQuality?.[field] ?? "generated";
    return quality;
  }

  return "base-seed";
}

function formatValue(value) {
  if (typeof value === "number") {
    if (Math.abs(value) >= 1000) return value.toLocaleString("en-US", { maximumFractionDigits: 2 });
    return Number(value.toFixed(4)).toString();
  }
  if (typeof value === "boolean") return value ? "true" : "false";
  if (value === null || value === undefined) return "null";
  return String(value);
}

function sourceList(network, moduleName) {
  const byModule = {
    "Liquidity & Exit": ["globalLstHealthScore", "stablecoinLiquidityUsd", "stakedValueUsd", "lstProtocols", "lstPenetrationPct"],
    "Peg Stability": ["globalLstHealthScore", "stablecoinLiquidityUsd", "stakedValueUsd", "lstProtocols"],
    "DeFi Moneyness": ["globalLstHealthScore", "tvlToMcapPct", "lendingPresence", "lstCollateralEnabled"],
    "Security & Governance": ["globalLstHealthScore", "validatorCount", "lendingPresence", "marketCapUsd", "lstProtocols", "lstCollateralEnabled"],
    "Validator Decentralization": ["globalLstHealthScore", "validatorCount", "stakerAddresses"],
    "Incentive Sustainability": ["globalLstHealthScore", "stakingApyPct", "lendingPresence", "lstCollateralEnabled"],
    "Stress Resilience": ["globalLstHealthScore", "stablecoinLiquidityUsd", "stakedValueUsd", "validatorCount", "lstProtocols"]
  };

  return byModule[moduleName].map((field) => ({
    field,
    value: network[field],
    origin: fieldOrigin(network, field)
  }));
}

function signalList(signals, moduleName) {
  if (moduleName === "Liquidity & Exit") {
    return [
      ["stableDepthSignal", signals.stableDepthSignal],
      ["redemptionSignal", signals.redemptionSignal],
      ["penetrationSignal", signals.penetrationSignal]
    ];
  }
  if (moduleName === "Peg Stability") {
    return [
      ["stableDepthSignal", signals.stableDepthSignal],
      ["redemptionSignal", signals.redemptionSignal]
    ];
  }
  if (moduleName === "DeFi Moneyness") {
    return [["defiDepthSignal", signals.defiDepthSignal]];
  }
  if (moduleName === "Security & Governance") {
    return [["governanceSignal", signals.governanceSignal]];
  }
  if (moduleName === "Validator Decentralization") {
    return [["validatorSignal", signals.validatorSignal]];
  }
  if (moduleName === "Incentive Sustainability") {
    return [["yieldSignal", signals.yieldSignal]];
  }
  return [["stableDepthSignal", signals.stableDepthSignal]];
}

function safeMd(text) {
  return String(text).replaceAll("|", "\\|");
}

async function main() {
  const [networksTsRaw, generatedRaw] = await Promise.all([
    readFile(NETWORKS_TS_PATH, "utf8"),
    readFile(GENERATED_PATH, "utf8")
  ]);

  const baseNetworks = extractBaseNetworks(networksTsRaw);
  const generatedRecords = JSON.parse(generatedRaw);
  const networks = mergeNetworks(baseNetworks, generatedRecords);

  const moduleOrder = [
    "Liquidity & Exit",
    "Peg Stability",
    "DeFi Moneyness",
    "Security & Governance",
    "Validator Decentralization",
    "Incentive Sustainability",
    "Stress Resilience"
  ];

  const traces = [];

  for (const network of networks) {
    const signals = deriveSignals(network);
    const baselines = deriveBaselines(network, signals);
    const flags = deriveFlags(network);
    const moduleBreakdowns = computeModuleBreakdowns(baselines, flags);

    const exitability = round(
      weighted([
        { score: moduleBreakdowns["Liquidity & Exit"].finalScore, weight: 0.5 },
        { score: moduleBreakdowns["Peg Stability"].finalScore, weight: 0.3 },
        { score: moduleBreakdowns["Stress Resilience"].finalScore, weight: 0.2 }
      ])
    );

    const moneyness = round(moduleBreakdowns["DeFi Moneyness"].finalScore);
    const credibility = round(
      weighted([
        { score: moduleBreakdowns["Security & Governance"].finalScore, weight: 0.4 },
        { score: moduleBreakdowns["Validator Decentralization"].finalScore, weight: 0.3 },
        { score: moduleBreakdowns["Incentive Sustainability"].finalScore, weight: 0.3 }
      ])
    );

    const global = finalizeScore(
      weighted([
        { score: exitability, weight: 0.45 },
        { score: moneyness, weight: 0.3 },
        { score: credibility, weight: 0.25 }
      ]),
      [],
      [
        ...(exitability < 50 ? [{ reason: "Exitability below 50", value: 60 }] : []),
        ...(moduleBreakdowns["Peg Stability"].finalScore < 45 ? [{ reason: "Peg Stability below 45", value: 55 }] : []),
        ...(moduleBreakdowns["Security & Governance"].finalScore < 50
          ? [{ reason: "Security & Governance below 50", value: 60 }]
          : [])
      ]
    );

    traces.push({
      networkId: network.networkId,
      network: network.network,
      bases: {
        globalLstHealthScore: network.globalLstHealthScore,
        opportunityScore: network.opportunityScore
      },
      derivedInputs: {
        stakingRatioPct: network.stakingRatioPct,
        stakedValueUsd: network.stakedValueUsd,
        tvlToMcapPct: network.tvlToMcapPct,
        lstPenetrationPct: network.lstPenetrationPct
      },
      signals,
      flags,
      modules: Object.fromEntries(
        moduleOrder.map((moduleName) => [
          moduleName,
          {
            baseline: baselines[moduleName],
            sources: sourceList(network, moduleName),
            signals: signalList(signals, moduleName).map(([name, value]) => ({ name, value })),
            ...moduleBreakdowns[moduleName]
          }
        ])
      ),
      pillars: {
        exitability,
        moneyness,
        credibility
      },
      global
    });
  }

  await writeFile(OUTPUT_JSON_PATH, `${JSON.stringify(traces, null, 2)}\n`, "utf8");

  const lines = [];
  lines.push("# Scoring Trace Table");
  lines.push("");
  lines.push("Vista única para auditar: **campo origen -> señal -> módulo -> penalty/cap**.");
  lines.push("");
  lines.push("Fuente efectiva: merge `data/networks.generated.json` + fallback `data/networks.ts` + métricas derivadas de app.");
  lines.push("");
  lines.push("| Red | Módulo | Campo origen | Señal | Baseline | Penalty | Cap aplicado | Final |");
  lines.push("|---|---|---|---|---:|---|---|---:|");

  for (const trace of traces) {
    for (const moduleName of moduleOrder) {
      const moduleTrace = trace.modules[moduleName];
      const sourceText = moduleTrace.sources
        .map((item) => `${item.field}=${formatValue(item.value)} [${item.origin}]`)
        .join("; ");
      const signalText = moduleTrace.signals.map((item) => `${item.name}=${formatValue(item.value)}`).join("; ");
      const penaltyText =
        moduleTrace.penalties.length > 0
          ? moduleTrace.penalties.map((penalty) => `${penalty.reason} (-${penalty.points})`).join(" + ")
          : "—";
      const capText = moduleTrace.capApplied
        ? `${moduleTrace.capApplied.reason} (<=${moduleTrace.capApplied.value})`
        : "—";

      lines.push(
        `| ${safeMd(trace.network)} | ${safeMd(moduleName)} | ${safeMd(sourceText)} | ${safeMd(signalText)} | ${moduleTrace.rawScore} | ${safeMd(penaltyText)} | ${safeMd(capText)} | ${moduleTrace.finalScore} |`
      );
    }

    lines.push(
      `| ${safeMd(trace.network)} | GLOBAL | exitability=${trace.pillars.exitability}; moneyness=${trace.pillars.moneyness}; credibility=${trace.pillars.credibility} | globalRaw=0.45*exit+0.30*money+0.25*cred | ${trace.global.rawScore} | — | ${trace.global.capApplied ? safeMd(`${trace.global.capApplied.reason} (<=${trace.global.capApplied.value})`) : "—"} | ${trace.global.finalScore} |`
    );
  }

  await writeFile(OUTPUT_MD_PATH, `${lines.join("\n")}\n`, "utf8");

  console.log(`[build-scoring-trace-table] Wrote ${OUTPUT_JSON_PATH.pathname}`);
  console.log(`[build-scoring-trace-table] Wrote ${OUTPUT_MD_PATH.pathname}`);
}

main().catch((error) => {
  console.error("[build-scoring-trace-table] Failed:", error);
  process.exitCode = 1;
});
