#!/usr/bin/env node

import { readFile, writeFile } from "node:fs/promises";

const GENERATED_DATASET_PATH = new URL("../data/networks.generated.json", import.meta.url);
const MANUAL_NETWORK_DATA_PATH = new URL("../data/manual/manual-network-data.json", import.meta.url);
const OVERRIDES_PATH = new URL("../data/manual/overrides.json", import.meta.url);

function toFiniteNumber(value) {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function calculateRatio(numerator, denominator) {
  if (numerator === null || denominator === null || denominator <= 0) {
    return null;
  }

  return Number((numerator / denominator).toFixed(4));
}

function resolveDerivedQuality(value) {
  if (typeof value === "number") {
    return Number.isFinite(value) ? "derived" : "missing";
  }

  if (typeof value === "boolean") {
    return "derived";
  }

  if (typeof value === "string") {
    return value.trim().length > 0 ? "derived" : "missing";
  }

  return "missing";
}

async function readJson(path, fallback) {
  try {
    const raw = await readFile(path, "utf8");
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function isMissingValue(value) {
  return value === null || value === undefined;
}

function applyManualEntry(record, manualEntry, sourceRef) {
  if (!manualEntry || typeof manualEntry !== "object") return;

  const fields = ["stakingRatioPct", "stakingApyPct", "validatorCount", "inflationRatePct"];

  for (const field of fields) {
    const manualValue = manualEntry[field];

    if (manualValue === undefined) {
      continue;
    }

    if (!isMissingValue(record[field])) {
      continue;
    }

    record[field] = manualValue;

    if (!record.fieldQuality || typeof record.fieldQuality !== "object") {
      record.fieldQuality = {};
    }

    record.fieldQuality[field] = "inferred";
    record.sourceRefs.push(`${sourceRef}:${field}`);

    if (!record.staking || typeof record.staking !== "object") {
      record.staking = {};
    }

    if (field === "validatorCount") {
      record.staking.validators = manualValue;
    }

    if (field === "stakingRatioPct") {
      record.staking.stakingRatioPct = manualValue;
    }

    if (field === "stakingApyPct") {
      record.staking.rewardRatePct = manualValue;
      if (isMissingValue(record.rewardRatePct)) {
        record.rewardRatePct = manualValue;
      }
    }

    if (field === "inflationRatePct") {
      record.staking.inflationRatePct = manualValue;
    }
  }
}

function applyOverrides(record, overrideEntries) {
  if (!Array.isArray(overrideEntries) || overrideEntries.length === 0) {
    return;
  }

  for (const override of overrideEntries) {
    const field = typeof override.field === "string" ? override.field.trim() : "";
    if (!field) continue;

    if (!(field in record)) {
      continue;
    }

    record[field] = override.value;

    if (!record.fieldQuality || typeof record.fieldQuality !== "object") {
      record.fieldQuality = {};
    }

    record.fieldQuality[field] = "inferred";
    record.sourceRefs.push(`manual-override:${field}:${override.timestamp}`);

    if (!record.staking || typeof record.staking !== "object") {
      record.staking = {};
    }

    if (field === "validatorCount") {
      record.staking.validators = override.value;
    }

    if (field === "stakingRatioPct") {
      record.staking.stakingRatioPct = override.value;
    }

    if (field === "stakingApyPct") {
      record.staking.rewardRatePct = override.value;
    }

    if (field === "inflationRatePct") {
      record.staking.inflationRatePct = override.value;
    }
  }
}

function recalculateDerived(record) {
  const marketCapUsd = toFiniteNumber(record.marketCapUsd);
  const stakingRatioPct = toFiniteNumber(record.stakingRatioPct);
  const defiTvlUsd = toFiniteNumber(record.defiTvlUsd);
  const lstTvlUsd = toFiniteNumber(record.lstTvlUsd);

  const stakedValueUsd =
    marketCapUsd !== null && stakingRatioPct !== null ? (marketCapUsd * stakingRatioPct) / 100 : null;

  record.tvlToMarketCap = calculateRatio(defiTvlUsd, marketCapUsd);
  record.lstPenetrationPct = calculateRatio(lstTvlUsd, stakedValueUsd);

  if (!record.fieldQuality || typeof record.fieldQuality !== "object") {
    record.fieldQuality = {};
  }

  record.fieldQuality.tvlToMarketCap = resolveDerivedQuality(record.tvlToMarketCap);
  record.fieldQuality.lstPenetrationPct = resolveDerivedQuality(record.lstPenetrationPct);
}

function recalculateSummary(record) {
  const fieldQuality =
    record.fieldQuality && typeof record.fieldQuality === "object" ? Object.values(record.fieldQuality) : [];

  if (fieldQuality.length === 0) {
    return;
  }

  const coverageCount = fieldQuality.filter((quality) => quality !== "missing").length;
  const observedCount = fieldQuality.filter((quality) => quality === "observed").length;
  const derivedCount = fieldQuality.filter((quality) => quality === "derived").length;
  const inferredCount = fieldQuality.filter((quality) => quality === "inferred").length;

  const dataCoveragePct = Number(((coverageCount / fieldQuality.length) * 100).toFixed(1));

  let quality = "simulated";
  if (observedCount + derivedCount >= fieldQuality.length * 0.7) {
    quality = "observed";
  } else if (observedCount + derivedCount + inferredCount >= fieldQuality.length * 0.55) {
    quality = "inferred";
  }

  let confidence = "low";
  if (dataCoveragePct >= 80) {
    confidence = "high";
  } else if (dataCoveragePct >= 55) {
    confidence = "medium";
  }

  record.dataCoveragePct = dataCoveragePct;
  record.quality = quality;
  record.confidence = confidence;
}

async function main() {
  const generated = await readJson(GENERATED_DATASET_PATH, []);

  if (!Array.isArray(generated)) {
    throw new Error("data/networks.generated.json is not an array");
  }

  const manualFile = await readJson(MANUAL_NETWORK_DATA_PATH, {
    source: "manual-network-data",
    updatedAt: null,
    networks: {}
  });
  const overrideFile = await readJson(OVERRIDES_PATH, {
    source: "manual-overrides",
    updatedAt: null,
    overrides: []
  });

  const manualNetworks = manualFile.networks && typeof manualFile.networks === "object" ? manualFile.networks : {};
  const manualSourceRef = `manual-network-data:${manualFile.updatedAt ?? "unknown"}`;

  const overridesByNetwork = new Map();

  if (Array.isArray(overrideFile.overrides)) {
    for (const override of overrideFile.overrides) {
      const networkId = typeof override.networkId === "string" ? override.networkId : "";
      if (!networkId) continue;

      if (!overridesByNetwork.has(networkId)) {
        overridesByNetwork.set(networkId, []);
      }

      overridesByNetwork.get(networkId).push(override);
    }
  }

  const merged = generated.map((record) => {
    if (!record || typeof record !== "object") {
      return record;
    }

    const networkId = typeof record.networkId === "string" ? record.networkId : "";

    if (!Array.isArray(record.sourceRefs)) {
      record.sourceRefs = [];
    }

    applyManualEntry(record, manualNetworks[networkId], manualSourceRef);
    applyOverrides(record, overridesByNetwork.get(networkId));
    recalculateDerived(record);
    recalculateSummary(record);

    record.sourceRefs = [...new Set(record.sourceRefs)];

    return record;
  });

  await writeFile(GENERATED_DATASET_PATH, `${JSON.stringify(merged, null, 2)}\n`, "utf8");
  console.log("[apply-manual-overlays] Applied manual data and overrides to data/networks.generated.json");
}

main().catch((error) => {
  console.error("[apply-manual-overlays] Failed:", error);
  process.exitCode = 1;
});
