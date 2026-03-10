#!/usr/bin/env node

import { readFile, writeFile } from "node:fs/promises";

import type { FieldDataClass, RadarOverviewRecord } from "../src/data/radar-overview-schema.ts";

type FieldSummary = Record<string, Record<FieldDataClass, number>>;

const AUDITED_FIELDS = [
  "marketCapUsd",
  "circulatingSupply",
  "priceUsd",
  "volume24hUsd",
  "defiTvlUsd",
  "stablecoinLiquidityUsd",
  "validatorCount",
  "stakingRatioPct",
  "stakingApyPct",
  "rewardRatePct",
  "stakingMarketCapUsd",
  "stakedTokens",
  "inflationRatePct",
  "verifiedProviders",
  "benchmarkCommissionPct",
  "lstTvlUsd",
  "tvlToMarketCap",
  "lstPenetrationPct",
  "baseTokenDexLiquidityUsd",
  "baseTokenDexVolume24hUsd",
  "baseTokenPairCount",
  "baseTokenLargestPoolLiquidityUsd",
  "baseTokenPoolConcentration",
  "stableExitRouteExists",
  "stableExitLiquidityUsd",
  "stableExitPairAddress",
  "stableExitQuoteToken",
  "stableExitDexId",
  "lstDexLiquidityUsd",
  "lstDexVolume24hUsd",
  "lstPairCount",
  "lstLargestPoolLiquidityUsd",
  "lstPoolConcentration",
  "lstHasBasePair",
  "lstHasStablePair",
  "baseTokenVolumeLiquidityRatio",
  "lstVolumeLiquidityRatio",
  "lstTotalSupply",
  "lstHolderCount",
  "lstTop10HolderShare",
  "lstTransferCount24h",
  "lstTransferVolume24h",
  "contractAbiAvailable",
  "contractVerified",
  "protocolMintCount24h",
  "protocolRedeemCount24h",
  "protocolMintVolume24h",
  "protocolRedeemVolume24h",
  "protocolTreasuryNativeBalance",
  "safeGasPrice",
  "proposeGasPrice",
  "fastGasPrice",
  "suggestedBaseFee"
] as const;

function initClassCounter(): Record<FieldDataClass, number> {
  return { observed: 0, derived: 0, inferred: 0, simulated: 0, missing: 0 };
}

async function main() {
  const raw = await readFile("data/networks.generated.json", "utf8");
  const records = JSON.parse(raw) as RadarOverviewRecord[];

  const perField: FieldSummary = Object.fromEntries(AUDITED_FIELDS.map((field) => [field, initClassCounter()]));

  const perNetwork = records.map((record) => {
    for (const field of AUDITED_FIELDS) {
      const klass = record.fieldQuality[field] ?? "missing";
      perField[field][klass] += 1;
    }

    const missingFields = AUDITED_FIELDS.filter((field) => record.fieldQuality[field] === "missing");
    const inferredFields = AUDITED_FIELDS.filter((field) => record.fieldQuality[field] === "inferred");
    const observedFields = AUDITED_FIELDS.filter(
      (field) => record.fieldQuality[field] === "observed" || record.fieldQuality[field] === "derived"
    );

    return {
      networkId: record.networkId,
      coveragePct: record.dataCoveragePct,
      confidence: record.confidence,
      quality: record.quality,
      observedCount: observedFields.length,
      inferredCount: inferredFields.length,
      missingCount: missingFields.length,
      observedFields,
      inferredFields,
      missingFields
    };
  });

  const report = {
    generatedAt: new Date().toISOString(),
    networkCount: records.length,
    auditedFields: AUDITED_FIELDS,
    perNetwork,
    perField
  };

  await writeFile("data/networks.coverage.json", `${JSON.stringify(report, null, 2)}\n`, "utf8");

  const lines: string[] = [];
  lines.push("# Overview Dataset Coverage Report");
  lines.push("");
  lines.push(`Generated at: ${report.generatedAt}`);
  lines.push("");
  lines.push("## Per-network coverage");
  lines.push("");
  lines.push("| Network | Coverage % | Quality | Confidence | Observed+Derived | Inferred | Missing |");
  lines.push("|---|---:|---|---|---:|---:|---:|");
  for (const network of perNetwork) {
    lines.push(
      `| ${network.networkId} | ${network.coveragePct.toFixed(1)} | ${network.quality} | ${network.confidence} | ${network.observedCount} | ${network.inferredCount} | ${network.missingCount} |`
    );
  }

  lines.push("");
  lines.push("## Per-field coverage classes");
  lines.push("");
  lines.push("| Field | observed | derived | inferred | simulated | missing |");
  lines.push("|---|---:|---:|---:|---:|---:|");
  for (const field of AUDITED_FIELDS) {
    const counter = perField[field];
    lines.push(
      `| ${field} | ${counter.observed} | ${counter.derived} | ${counter.inferred} | ${counter.simulated} | ${counter.missing} |`
    );
  }

  await writeFile("docs/coverage-report.md", `${lines.join("\n")}\n`, "utf8");

  console.log("[audit-overview-dataset] Wrote data/networks.coverage.json and docs/coverage-report.md");
}

main().catch((error) => {
  console.error("[audit-overview-dataset] Failed:", error);
  process.exitCode = 1;
});
