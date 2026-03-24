import { execFile } from "node:child_process";
import { promisify } from "node:util";
import path from "node:path";

import {
  GENERATED_DATASET_PATH,
  readJsonWithFallback,
  upsertAdminSyncStatuses,
  writeRawSnapshot
} from "@/features/admin/server/store";
import type { SyncSourceKey, SyncSourceStatus } from "@/features/admin/server/types";

const execFileAsync = promisify(execFile);

const DEX_FIELDS = [
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
  "lstVolumeLiquidityRatio"
] as const;

const EXPLORER_FIELDS = [
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

type SyncLog = {
  command: string;
  stdout: string;
  stderr: string;
};

type SyncResult = {
  startedAt: string;
  endedAt: string;
  statuses: SyncSourceStatus[];
  logs: SyncLog[];
};

async function runNpmScript(scriptName: string): Promise<SyncLog> {
  const command = `npm run ${scriptName}`;
  console.log("[sync] running script: %s", command);
  const start = Date.now();

  try {
    const { stdout, stderr } = await execFileAsync("npm", ["run", scriptName], {
      cwd: process.cwd(),
      env: process.env,
      maxBuffer: 1024 * 1024 * 10
    });

    console.log("[sync] script %s completed in %dms (stdout: %d chars, stderr: %d chars)",
      scriptName, Date.now() - start, stdout.length, stderr.length);

    if (stderr && stderr.trim().length > 0) {
      console.warn("[sync] script %s stderr:\n%s", scriptName, stderr.trim().slice(0, 500));
    }

    return { command, stdout, stderr };
  } catch (error) {
    console.error("[sync] script %s failed after %dms:", scriptName, Date.now() - start,
      error instanceof Error ? error.message : error);
    throw error;
  }
}

async function snapshotFromJsonFile(source: "coingecko" | "defillama", filePath: string, startedAt: string, endedAt: string) {
  console.log("[sync] reading %s snapshot from %s", source, filePath);
  const payload = await readJsonWithFallback<Record<string, unknown>>(filePath, {});

  const payloadKeys = Object.keys(payload);
  console.log("[sync] %s payload keys: [%s] (%d top-level keys)", source, payloadKeys.join(", "), payloadKeys.length);

  await writeRawSnapshot(source, payload, endedAt);
  console.log("[sync] %s raw snapshot written (timestamp: %s)", source, endedAt);

  const networks = payload.networks;
  let updatedNetworks = 0;
  let totalNetworks = 0;

  if (networks && typeof networks === "object") {
    const networkEntries = Object.entries(networks as Record<string, { status?: unknown }>);
    totalNetworks = networkEntries.length;

    for (const [networkId, entry] of networkEntries) {
      const status = typeof entry?.status === "string" ? entry.status : "";
      if (status === "ok" || status === "partial") {
        updatedNetworks += 1;
      } else if (status && status !== "ok" && status !== "partial") {
        console.warn("[sync] %s — network %s has status: %s", source, networkId, status);
      }
    }
  }

  console.log("[sync] %s — %d/%d networks updated successfully", source, updatedNetworks, totalNetworks);

  const status: SyncSourceStatus = {
    source,
    status: "ok",
    updatedNetworks,
    startedAt,
    endedAt
  };

  return status;
}

function pickFields(record: Record<string, unknown>, fields: readonly string[]) {
  const output: Record<string, unknown> = {
    networkId: record.networkId ?? null,
    asOf: record.asOf ?? null
  };

  for (const field of fields) {
    output[field] = record[field] ?? null;
  }

  return output;
}

function countUpdated(records: Record<string, unknown>[], fields: readonly string[]): number {
  return records.filter((record) => {
    return fields.some((field) => {
      const value = record[field];
      if (value === null || value === undefined) {
        return false;
      }

      if (typeof value === "number") {
        return Number.isFinite(value);
      }

      if (typeof value === "string") {
        return value.trim().length > 0;
      }

      if (typeof value === "boolean") {
        return true;
      }

      return false;
    });
  }).length;
}

export async function runDatasetRebuildOnly(): Promise<SyncLog> {
  return runNpmScript("data:build:dataset");
}

export async function executeDataSync(source: SyncSourceKey): Promise<SyncResult> {
  const startedAt = new Date().toISOString();
  const logs: SyncLog[] = [];
  const statuses: SyncSourceStatus[] = [];

  console.log("[sync] ========== starting data sync for source: %s ==========", source);
  console.log("[sync] started at %s", startedAt);

  try {
    if (source === "coingecko" || source === "all") {
      console.log("[sync] --- fetching CoinGecko data ---");
      logs.push(await runNpmScript("data:sync:coingecko"));
      const endedAt = new Date().toISOString();
      const status = await snapshotFromJsonFile(
        "coingecko",
        path.join(process.cwd(), "data", "coingecko-basics.json"),
        startedAt,
        endedAt
      );
      statuses.push(status);
      console.log("[sync] CoinGecko sync finished: %d networks updated", status.updatedNetworks);
    }

    if (source === "defillama" || source === "all") {
      console.log("[sync] --- fetching DefiLlama data ---");
      logs.push(await runNpmScript("data:sync:defillama"));
      const endedAt = new Date().toISOString();
      const status = await snapshotFromJsonFile(
        "defillama",
        path.join(process.cwd(), "data", "defillama-basics.json"),
        startedAt,
        endedAt
      );
      statuses.push(status);
      console.log("[sync] DefiLlama sync finished: %d networks updated", status.updatedNetworks);
    }

    console.log("[sync] --- rebuilding generated dataset ---");
    logs.push(await runDatasetRebuildOnly());

    const dataset = await readJsonWithFallback<Array<Record<string, unknown>>>(GENERATED_DATASET_PATH, []);
    console.log("[sync] dataset loaded: %d records from %s", dataset.length, GENERATED_DATASET_PATH);

    if (source === "dexscreener" || source === "all") {
      console.log("[sync] --- extracting Dexscreener snapshot from dataset ---");
      const endedAt = new Date().toISOString();
      const payload = {
        source: "dexscreener",
        generatedAt: endedAt,
        records: dataset.map((record) => pickFields(record, DEX_FIELDS))
      };

      await writeRawSnapshot("dexscreener", payload, endedAt);
      const dexUpdated = countUpdated(dataset, DEX_FIELDS);

      statuses.push({
        source: "dexscreener",
        status: "ok",
        updatedNetworks: dexUpdated,
        startedAt,
        endedAt
      });
      console.log("[sync] Dexscreener snapshot written: %d networks with data (%d fields tracked)", dexUpdated, DEX_FIELDS.length);
    }

    if (source === "explorer" || source === "all") {
      console.log("[sync] --- extracting Explorer snapshot from dataset ---");
      const endedAt = new Date().toISOString();
      const payload = {
        source: "explorer",
        generatedAt: endedAt,
        records: dataset.map((record) => pickFields(record, EXPLORER_FIELDS))
      };

      await writeRawSnapshot("explorer", payload, endedAt);
      const explorerUpdated = countUpdated(dataset, EXPLORER_FIELDS);

      statuses.push({
        source: "explorer",
        status: "ok",
        updatedNetworks: explorerUpdated,
        startedAt,
        endedAt
      });
      console.log("[sync] Explorer snapshot written: %d networks with data (%d fields tracked)", explorerUpdated, EXPLORER_FIELDS.length);
    }

    if (source === "coingecko" || source === "defillama") {
      if (statuses.length === 0) {
        const endedAt = new Date().toISOString();
        statuses.push({
          source,
          status: "ok",
          updatedNetworks: 0,
          startedAt,
          endedAt,
          message: "Sync completed"
        });
        console.log("[sync] %s completed with 0 updated networks (no snapshot file produced)", source);
      }
    }

    if (source !== "all" && source !== "coingecko" && source !== "defillama" && statuses.length === 0) {
      const endedAt = new Date().toISOString();
      statuses.push({
        source,
        status: "ok",
        updatedNetworks: 0,
        startedAt,
        endedAt,
        message: "Sync completed"
      });
      console.log("[sync] %s completed with 0 updated networks", source);
    }

    await upsertAdminSyncStatuses(statuses);

    const totalElapsed = Date.now() - new Date(startedAt).getTime();
    console.log("[sync] ========== sync complete for %s — %d source(s) processed in %dms ==========",
      source, statuses.length, totalElapsed);

    return {
      startedAt,
      endedAt: new Date().toISOString(),
      statuses,
      logs
    };
  } catch (error) {
    const endedAt = new Date().toISOString();
    const failedSource = source === "all" ? "coingecko" : source;
    const totalElapsed = Date.now() - new Date(startedAt).getTime();

    console.error("[sync] ========== SYNC FAILED for %s after %dms ==========", source, totalElapsed);
    console.error("[sync] failed source: %s", failedSource);
    console.error("[sync] error:", error instanceof Error ? error.stack ?? error.message : error);

    const failure: SyncSourceStatus = {
      source: failedSource,
      status: "error",
      updatedNetworks: 0,
      startedAt,
      endedAt,
      message: error instanceof Error ? error.message : "Unknown sync error"
    };

    await upsertAdminSyncStatuses([failure]);

    throw error;
  }
}
