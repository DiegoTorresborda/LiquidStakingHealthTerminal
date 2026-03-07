#!/usr/bin/env node

import { readFile, writeFile } from "node:fs/promises";

const COINGECKO_PATH = new URL("../data/coingecko-basics.json", import.meta.url);
const DOMAIN_PATH = new URL("../data/dashboard-domain-overrides.json", import.meta.url);
const OUTPUT_PATH = new URL("../data/overview-overrides.json", import.meta.url);

function round(value, digits = 2) {
  if (typeof value !== "number" || !Number.isFinite(value)) return null;
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

function toNumberOrNull(value) {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function calculateStakedValueUsd(marketCapUsd, stakingRatioPct) {
  if (marketCapUsd === null || stakingRatioPct === null) return null;
  return round((marketCapUsd * stakingRatioPct) / 100, 0);
}

function calculatePercent(numerator, denominator) {
  if (numerator === null || denominator === null || denominator <= 0) return null;
  return round((numerator / denominator) * 100, 2);
}

async function readJson(path) {
  const content = await readFile(path, "utf8");
  return JSON.parse(content);
}

async function main() {
  const coingecko = await readJson(COINGECKO_PATH);
  const domain = await readJson(DOMAIN_PATH);

  const networkIds = new Set([...Object.keys(coingecko.networks ?? {}), ...Object.keys(domain.networks ?? {})]);

  const networks = {};

  for (const networkId of networkIds) {
    const cg = coingecko.networks?.[networkId] ?? null;
    const dm = domain.networks?.[networkId] ?? null;

    const marketCapUsd = toNumberOrNull(cg?.marketCapUsd);
    const fdvUsd = toNumberOrNull(cg?.fdvUsd);
    const circulatingSupply = toNumberOrNull(cg?.circulatingSupply);
    const circulatingSupplyPct = toNumberOrNull(cg?.circulatingSupplyPct);

    const stakingRatioPct = toNumberOrNull(dm?.stakingRatioPct);
    const stakingApyPct = toNumberOrNull(dm?.stakingApyPct);
    const stakerAddresses = toNumberOrNull(dm?.stakerAddresses);
    const validatorCount = toNumberOrNull(dm?.validatorCount);

    const lstProtocols = toNumberOrNull(dm?.lstProtocols);
    const largestLst = typeof dm?.largestLst === "string" ? dm.largestLst : null;
    const lstTvlUsd = toNumberOrNull(dm?.lstTvlUsd);

    const defiTvlUsd = toNumberOrNull(dm?.defiTvlUsd);
    const stablecoinLiquidityUsd = toNumberOrNull(dm?.stablecoinLiquidityUsd);
    const lendingPresence = typeof dm?.lendingPresence === "boolean" ? dm.lendingPresence : null;
    const lstCollateralEnabled = typeof dm?.lstCollateralEnabled === "boolean" ? dm.lstCollateralEnabled : null;

    const stakedValueUsd = calculateStakedValueUsd(marketCapUsd, stakingRatioPct);
    const lstPenetrationPct = calculatePercent(lstTvlUsd, stakedValueUsd);
    const tvlToMcapPct = calculatePercent(defiTvlUsd, marketCapUsd);

    networks[networkId] = {
      sourceStatus: {
        coingecko: cg?.status ?? "missing",
        domain: dm ? "ok" : "missing"
      },
      marketCapUsd,
      fdvUsd,
      circulatingSupply,
      circulatingSupplyPct,
      stakingRatioPct,
      stakingApyPct,
      stakerAddresses,
      validatorCount,
      stakedValueUsd,
      lstProtocols,
      largestLst,
      lstTvlUsd,
      lstPenetrationPct,
      defiTvlUsd,
      tvlToMcapPct,
      stablecoinLiquidityUsd,
      lendingPresence,
      lstCollateralEnabled
    };
  }

  const output = {
    source: "overview-merge",
    generatedAt: new Date().toISOString(),
    inputs: {
      coingeckoGeneratedAt: coingecko.generatedAt ?? null,
      domainGeneratedAt: domain.generatedAt ?? null
    },
    networks
  };

  await writeFile(OUTPUT_PATH, `${JSON.stringify(output, null, 2)}\n`, "utf8");
  console.log(`[build-overview-overrides] Wrote ${OUTPUT_PATH.pathname}`);
}

main().catch((error) => {
  console.error("[build-overview-overrides] Failed:", error);
  process.exitCode = 1;
});
