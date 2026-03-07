#!/usr/bin/env node

import { readFile, writeFile } from "node:fs/promises";

import type { RadarOverviewRecord } from "../src/data/radar-overview-schema.ts";

type FieldDataClass = "observed" | "inferred" | "simulated" | "missing";

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
  "lstTvlUsd",
  "tvlToMarketCap",
  "lstPenetrationPct"
] as const;

function initClassCounter(): Record<FieldDataClass, number> {
  return { observed: 0, inferred: 0, simulated: 0, missing: 0 };
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
    const fallbackFields = AUDITED_FIELDS.filter((field) => record.fieldQuality[field] === "inferred");
    const observedFields = AUDITED_FIELDS.filter((field) => record.fieldQuality[field] === "observed");

    return {
      networkId: record.networkId,
      coveragePct: record.dataCoveragePct,
      confidence: record.confidence,
      quality: record.quality,
      observedCount: observedFields.length,
      inferredCount: fallbackFields.length,
      missingCount: missingFields.length,
      observedFields,
      fallbackFields,
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
  lines.push("| Network | Coverage % | Quality | Confidence | Observed | Inferred | Missing |");
  lines.push("|---|---:|---|---|---:|---:|---:|");
  for (const network of perNetwork) {
    lines.push(
      `| ${network.networkId} | ${network.coveragePct.toFixed(1)} | ${network.quality} | ${network.confidence} | ${network.observedCount} | ${network.inferredCount} | ${network.missingCount} |`
    );
  }

  lines.push("");
  lines.push("## Per-field coverage classes");
  lines.push("");
  lines.push("| Field | observed | inferred | simulated | missing |");
  lines.push("|---|---:|---:|---:|---:|");
  for (const field of AUDITED_FIELDS) {
    const counter = perField[field];
    lines.push(`| ${field} | ${counter.observed} | ${counter.inferred} | ${counter.simulated} | ${counter.missing} |`);
  }

  await writeFile("docs/coverage-report.md", `${lines.join("\n")}\n`, "utf8");

  console.log("[audit-overview-dataset] Wrote data/networks.coverage.json and docs/coverage-report.md");
}

main().catch((error) => {
  console.error("[audit-overview-dataset] Failed:", error);
  process.exitCode = 1;
});
