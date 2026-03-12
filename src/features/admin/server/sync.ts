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
  const { stdout, stderr } = await execFileAsync("npm", ["run", scriptName], {
    cwd: process.cwd(),
    env: process.env,
    maxBuffer: 1024 * 1024 * 10
  });

  return {
    command,
    stdout,
    stderr
  };
}

async function snapshotFromJsonFile(source: "coingecko" | "defillama", filePath: string, startedAt: string, endedAt: string) {
  const payload = await readJsonWithFallback<Record<string, unknown>>(filePath, {});
  await writeRawSnapshot(source, payload, endedAt);

  const networks = payload.networks;
  let updatedNetworks = 0;

  if (networks && typeof networks === "object") {
    for (const entry of Object.values(networks as Record<string, { status?: unknown }>)) {
      const status = typeof entry?.status === "string" ? entry.status : "";
      if (status === "ok" || status === "partial") {
        updatedNetworks += 1;
      }
    }
  }

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

  try {
    if (source === "coingecko" || source === "all") {
      logs.push(await runNpmScript("data:sync:coingecko"));
      const endedAt = new Date().toISOString();
      const status = await snapshotFromJsonFile(
        "coingecko",
        path.join(process.cwd(), "data", "coingecko-basics.json"),
        startedAt,
        endedAt
      );
      statuses.push(status);
    }

    if (source === "defillama" || source === "all") {
      logs.push(await runNpmScript("data:sync:defillama"));
      const endedAt = new Date().toISOString();
      const status = await snapshotFromJsonFile(
        "defillama",
        path.join(process.cwd(), "data", "defillama-basics.json"),
        startedAt,
        endedAt
      );
      statuses.push(status);
    }

    logs.push(await runDatasetRebuildOnly());

    const dataset = await readJsonWithFallback<Array<Record<string, unknown>>>(GENERATED_DATASET_PATH, []);

    if (source === "dexscreener" || source === "all") {
      const endedAt = new Date().toISOString();
      const payload = {
        source: "dexscreener",
        generatedAt: endedAt,
        records: dataset.map((record) => pickFields(record, DEX_FIELDS))
      };

      await writeRawSnapshot("dexscreener", payload, endedAt);

      statuses.push({
        source: "dexscreener",
        status: "ok",
        updatedNetworks: countUpdated(dataset, DEX_FIELDS),
        startedAt,
        endedAt
      });
    }

    if (source === "explorer" || source === "all") {
      const endedAt = new Date().toISOString();
      const payload = {
        source: "explorer",
        generatedAt: endedAt,
        records: dataset.map((record) => pickFields(record, EXPLORER_FIELDS))
      };

      await writeRawSnapshot("explorer", payload, endedAt);

      statuses.push({
        source: "explorer",
        status: "ok",
        updatedNetworks: countUpdated(dataset, EXPLORER_FIELDS),
        startedAt,
        endedAt
      });
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
    }

    await upsertAdminSyncStatuses(statuses);

    return {
      startedAt,
      endedAt: new Date().toISOString(),
      statuses,
      logs
    };
  } catch (error) {
    const endedAt = new Date().toISOString();
    const failedSource = source === "all" ? "coingecko" : source;

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
