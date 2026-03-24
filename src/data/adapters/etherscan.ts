import { fetchJsonWithCache } from "./http-cache.ts";

const ETHERSCAN_BASE_URL = process.env.ETHERSCAN_BASE_URL ?? "https://api.etherscan.io/v2/api";

const ETHERSCAN_FIELDS = [
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

type EtherscanEnvelope<T> = {
  status?: string;
  message?: string;
  result?: T;
};

type EtherscanTopHolder = {
  TokenHolderAddress?: string;
  TokenHolderQuantity?: string;
};

type EtherscanTokenTransfer = {
  timeStamp?: string;
  value?: string;
};

type EtherscanLog = {
  data?: string;
};

type EtherscanGasOracle = {
  SafeGasPrice?: string;
  ProposeGasPrice?: string;
  FastGasPrice?: string;
  suggestBaseFee?: string;
};

type EtherscanRequestInput = {
  chainId: string;
  module: string;
  action: string;
  params?: Record<string, string | number | null | undefined>;
};

export type EtherscanNormalizedMetrics = {
  lstTotalSupply: number | null;
  lstHolderCount: number | null;
  lstTop10HolderShare: number | null;
  lstTransferCount24h: number | null;
  lstTransferVolume24h: number | null;
  contractAbiAvailable: boolean | null;
  contractVerified: boolean | null;
  protocolMintCount24h: number | null;
  protocolRedeemCount24h: number | null;
  protocolMintVolume24h: number | null;
  protocolRedeemVolume24h: number | null;
  protocolTreasuryNativeBalance: number | null;
  safeGasPrice: number | null;
  proposeGasPrice: number | null;
  fastGasPrice: number | null;
  suggestedBaseFee: number | null;
};

export type EtherscanMetricField = (typeof ETHERSCAN_FIELDS)[number];

export type EtherscanFieldQuality = "observed" | "derived" | "missing";

export type EtherscanFieldQualityMap = Record<EtherscanMetricField, EtherscanFieldQuality>;

export type EtherscanCollectionInput = {
  chainId: string | null;
  lstTokenAddress: string | null;
  transferMonitorAddress: string | null;
  protocolContractAddress: string | null;
  logsFromBlock: string | null;
  mintEventTopic0: string | null;
  redeemEventTopic0: string | null;
  treasuryAddress: string | null;
};

export type EtherscanCollectionResult = {
  metrics: EtherscanNormalizedMetrics;
  fieldQuality: EtherscanFieldQualityMap;
  sourceRefs: string[];
};

type ContractAbiResult = {
  contractAbiAvailable: boolean | null;
  contractVerified: boolean | null;
};

function emptyEtherscanMetrics(): EtherscanNormalizedMetrics {
  return {
    lstTotalSupply: null,
    lstHolderCount: null,
    lstTop10HolderShare: null,
    lstTransferCount24h: null,
    lstTransferVolume24h: null,
    contractAbiAvailable: null,
    contractVerified: null,
    protocolMintCount24h: null,
    protocolRedeemCount24h: null,
    protocolMintVolume24h: null,
    protocolRedeemVolume24h: null,
    protocolTreasuryNativeBalance: null,
    safeGasPrice: null,
    proposeGasPrice: null,
    fastGasPrice: null,
    suggestedBaseFee: null
  };
}

function emptyEtherscanFieldQuality(): EtherscanFieldQualityMap {
  return {
    lstTotalSupply: "missing",
    lstHolderCount: "missing",
    lstTop10HolderShare: "missing",
    lstTransferCount24h: "missing",
    lstTransferVolume24h: "missing",
    contractAbiAvailable: "missing",
    contractVerified: "missing",
    protocolMintCount24h: "missing",
    protocolRedeemCount24h: "missing",
    protocolMintVolume24h: "missing",
    protocolRedeemVolume24h: "missing",
    protocolTreasuryNativeBalance: "missing",
    safeGasPrice: "missing",
    proposeGasPrice: "missing",
    fastGasPrice: "missing",
    suggestedBaseFee: "missing"
  };
}

function toFiniteNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const normalized = Number(value);
    return Number.isFinite(normalized) ? normalized : null;
  }

  return null;
}

function parseBigIntOrNull(value: unknown): bigint | null {
  if (typeof value !== "string" || value.trim().length === 0) {
    return null;
  }

  try {
    return BigInt(value);
  } catch {
    return null;
  }
}

function normalizeHexData(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const normalized = value.trim().toLowerCase();
  if (!normalized.startsWith("0x") || normalized.length <= 2) {
    return null;
  }

  return normalized;
}

function isSuccessfulResponse<T>(envelope: EtherscanEnvelope<T>): boolean {
  return envelope.status === "1";
}

function isKnownAbiUnverifiedError(value: unknown): boolean {
  if (typeof value !== "string") {
    return false;
  }

  const normalized = value.toLowerCase();
  return normalized.includes("not verified") || normalized.includes("source code not verified");
}

function setFieldQuality(
  fieldQuality: EtherscanFieldQualityMap,
  field: EtherscanMetricField,
  value: EtherscanNormalizedMetrics[EtherscanMetricField],
  qualityIfPresent: EtherscanFieldQuality
) {
  if (typeof value === "boolean") {
    fieldQuality[field] = qualityIfPresent;
    return;
  }

  if (typeof value === "number" && Number.isFinite(value)) {
    fieldQuality[field] = qualityIfPresent;
    return;
  }

  fieldQuality[field] = "missing";
}

async function etherscanRequest<T>(input: EtherscanRequestInput): Promise<EtherscanEnvelope<T>> {
  const search = new URLSearchParams({
    chainid: input.chainId,
    module: input.module,
    action: input.action
  });

  const apiKey = process.env.ETHERSCAN_API_KEY ?? process.env.ETHERSCAN_API_V2_KEY;
  if (apiKey) {
    search.set("apikey", apiKey);
  } else {
    console.warn("[etherscan] no API key found (checked ETHERSCAN_API_KEY, ETHERSCAN_API_V2_KEY)");
  }

  for (const [key, value] of Object.entries(input.params ?? {})) {
    if (value === null || value === undefined) continue;
    search.set(key, String(value));
  }

  const url = `${ETHERSCAN_BASE_URL}?${search.toString()}`;
  console.log("[etherscan] request: chainid=%s module=%s action=%s", input.chainId, input.module, input.action);

  const envelope = await fetchJsonWithCache<EtherscanEnvelope<T>>(url);

  if (!isSuccessfulResponse(envelope)) {
    console.warn("[etherscan] error response: chainid=%s module=%s action=%s → status=%s message=%s result=%s",
      input.chainId, input.module, input.action,
      envelope.status, envelope.message, String(envelope.result ?? "").slice(0, 200));
  }

  return envelope;
}

function sourceRefFor(input: EtherscanRequestInput): string {
  const parts = [
    `etherscan:v2:module=${input.module}`,
    `action=${input.action}`,
    `chainid=${input.chainId}`
  ];

  for (const [key, value] of Object.entries(input.params ?? {})) {
    if (value === null || value === undefined || value === "") continue;
    parts.push(`${key}=${value}`);
  }

  return parts.join(":");
}

function transfersInLast24h(transfers: EtherscanTokenTransfer[]): EtherscanTokenTransfer[] {
  const nowSec = Math.floor(Date.now() / 1000);
  const threshold = nowSec - 24 * 60 * 60;

  return transfers.filter((transfer) => {
    const timestamp = toFiniteNumber(transfer.timeStamp);
    return timestamp !== null && timestamp >= threshold;
  });
}

function sumTransferValue(transfers: EtherscanTokenTransfer[]): number | null {
  if (transfers.length === 0) return null;

  let hasValue = false;
  let total = 0;

  for (const transfer of transfers) {
    const value = toFiniteNumber(transfer.value);
    if (value === null) continue;
    total += value;
    hasValue = true;
  }

  return hasValue ? total : null;
}

function topTenHolderShare(supply: number | null, holders: EtherscanTopHolder[]): number | null {
  if (supply === null || supply <= 0 || holders.length === 0) {
    return null;
  }

  let sumTopTen = 0n;
  for (const holder of holders.slice(0, 10)) {
    const quantity = parseBigIntOrNull(holder.TokenHolderQuantity);
    if (quantity !== null) {
      sumTopTen += quantity;
    }
  }

  const totalSupplyBigInt = parseBigIntOrNull(String(supply.toFixed(0)));
  if (totalSupplyBigInt === null || totalSupplyBigInt <= 0n) {
    return null;
  }

  const scaled = (sumTopTen * 1_000_000n) / totalSupplyBigInt;
  return Number(scaled) / 1_000_000;
}

function sumLogValues(logs: EtherscanLog[]): number | null {
  if (logs.length === 0) return null;

  let hasValue = false;
  let total = 0n;

  for (const log of logs) {
    const data = normalizeHexData(log.data);
    if (!data) continue;

    try {
      total += BigInt(data);
      hasValue = true;
    } catch {
      // Skip unparsable values and keep the rest.
    }
  }

  if (!hasValue) {
    return null;
  }

  const asNumber = Number(total);
  return Number.isFinite(asNumber) ? asNumber : null;
}

export async function getTokenSupply(chainId: string, tokenAddress: string): Promise<number | null> {
  const response = await etherscanRequest<string>({
    chainId,
    module: "stats",
    action: "tokensupply",
    params: {
      contractaddress: tokenAddress
    }
  });

  if (!isSuccessfulResponse(response)) return null;
  return toFiniteNumber(response.result);
}

export async function getTokenHolderCount(chainId: string, tokenAddress: string): Promise<number | null> {
  const response = await etherscanRequest<string>({
    chainId,
    module: "token",
    action: "tokenholdercount",
    params: {
      contractaddress: tokenAddress
    }
  });

  if (!isSuccessfulResponse(response)) return null;
  return toFiniteNumber(response.result);
}

export async function getTopTokenHolders(
  chainId: string,
  tokenAddress: string,
  limit: number
): Promise<EtherscanTopHolder[]> {
  const response = await etherscanRequest<EtherscanTopHolder[]>({
    chainId,
    module: "token",
    action: "topholders",
    params: {
      contractaddress: tokenAddress,
      offset: limit
    }
  });

  if (!isSuccessfulResponse(response) || !Array.isArray(response.result)) return [];
  return response.result;
}

export async function getTokenTransfersByAddress(
  chainId: string,
  address: string,
  tokenAddress: string,
  options?: { page?: number; offset?: number; startblock?: number; endblock?: number; sort?: "asc" | "desc" }
): Promise<EtherscanTokenTransfer[]> {
  const response = await etherscanRequest<EtherscanTokenTransfer[]>({
    chainId,
    module: "account",
    action: "tokentx",
    params: {
      address,
      contractaddress: tokenAddress,
      page: options?.page ?? 1,
      offset: options?.offset ?? 100,
      startblock: options?.startblock ?? 0,
      endblock: options?.endblock ?? 99999999,
      sort: options?.sort ?? "desc"
    }
  });

  if (!isSuccessfulResponse(response) || !Array.isArray(response.result)) return [];
  return response.result;
}

export async function getContractAbi(chainId: string, contractAddress: string): Promise<ContractAbiResult> {
  const response = await etherscanRequest<string>({
    chainId,
    module: "contract",
    action: "getabi",
    params: {
      address: contractAddress
    }
  });

  if (isSuccessfulResponse(response)) {
    return {
      contractAbiAvailable: true,
      contractVerified: true
    };
  }

  if (isKnownAbiUnverifiedError(response.result)) {
    return {
      contractAbiAvailable: false,
      contractVerified: false
    };
  }

  return {
    contractAbiAvailable: null,
    contractVerified: null
  };
}

export async function getLogs(
  chainId: string,
  contractAddress: string,
  fromBlock: string,
  toBlock: string,
  topics?: { topic0?: string | null }
): Promise<EtherscanLog[]> {
  const response = await etherscanRequest<EtherscanLog[]>({
    chainId,
    module: "logs",
    action: "getLogs",
    params: {
      address: contractAddress,
      fromBlock,
      toBlock,
      topic0: topics?.topic0 ?? null
    }
  });

  if (!isSuccessfulResponse(response) || !Array.isArray(response.result)) return [];
  return response.result;
}

export async function getNativeBalance(chainId: string, address: string): Promise<number | null> {
  const response = await etherscanRequest<string>({
    chainId,
    module: "account",
    action: "balance",
    params: {
      address,
      tag: "latest"
    }
  });

  if (!isSuccessfulResponse(response)) return null;

  const wei = toFiniteNumber(response.result);
  if (wei === null) return null;
  return wei / 1e18;
}

async function getGasPriceViaProxy(chainId: string): Promise<EtherscanGasOracle | null> {
  const response = await etherscanRequest<string>({
    chainId,
    module: "proxy",
    action: "eth_gasPrice"
  });

  const hex = response.result;
  if (typeof hex !== "string" || !hex.startsWith("0x")) return null;

  const gweiValue = Number(BigInt(hex)) / 1e9;
  if (!Number.isFinite(gweiValue)) return null;

  const gweiStr = gweiValue.toFixed(6);
  return {
    SafeGasPrice: gweiStr,
    ProposeGasPrice: gweiStr,
    FastGasPrice: gweiStr,
    suggestBaseFee: gweiStr
  };
}

export async function getGasOracle(chainId: string): Promise<EtherscanGasOracle | null> {
  const response = await etherscanRequest<EtherscanGasOracle>({
    chainId,
    module: "gastracker",
    action: "gasoracle"
  });

  if (isSuccessfulResponse(response) && response.result && typeof response.result === "object") {
    return response.result;
  }

  console.log("[etherscan] gastracker not available for chainId=%s, falling back to eth_gasPrice", chainId);
  return getGasPriceViaProxy(chainId);
}

export async function collectEtherscanMetrics(input: EtherscanCollectionInput): Promise<EtherscanCollectionResult> {
  const metrics = emptyEtherscanMetrics();
  const fieldQuality = emptyEtherscanFieldQuality();
  const sourceRefs: string[] = [];

  if (!input.chainId) {
    console.log("[etherscan] skipping — no chainId configured");
    return {
      metrics,
      fieldQuality,
      sourceRefs
    };
  }

  const chainId = input.chainId;
  console.log("[etherscan] collecting metrics for chainId=%s lstToken=%s protocol=%s treasury=%s",
    chainId, input.lstTokenAddress ?? "none", input.protocolContractAddress ?? "none", input.treasuryAddress ?? "none");

  const gasRequest: EtherscanRequestInput = {
    chainId,
    module: "gastracker",
    action: "gasoracle"
  };
  sourceRefs.push(sourceRefFor(gasRequest));

  try {
    const gas = await getGasOracle(chainId);
    metrics.safeGasPrice = toFiniteNumber(gas?.SafeGasPrice);
    metrics.proposeGasPrice = toFiniteNumber(gas?.ProposeGasPrice);
    metrics.fastGasPrice = toFiniteNumber(gas?.FastGasPrice);
    metrics.suggestedBaseFee = toFiniteNumber(gas?.suggestBaseFee);
    console.log("[etherscan] gas oracle chainId=%s → safe=%s propose=%s fast=%s baseFee=%s",
      chainId, metrics.safeGasPrice, metrics.proposeGasPrice, metrics.fastGasPrice, metrics.suggestedBaseFee);
  } catch (error) {
    console.error("[etherscan] gas oracle failed for chainId=%s:", chainId, error instanceof Error ? error.message : error);
  }

  setFieldQuality(fieldQuality, "safeGasPrice", metrics.safeGasPrice, "observed");
  setFieldQuality(fieldQuality, "proposeGasPrice", metrics.proposeGasPrice, "observed");
  setFieldQuality(fieldQuality, "fastGasPrice", metrics.fastGasPrice, "observed");
  setFieldQuality(fieldQuality, "suggestedBaseFee", metrics.suggestedBaseFee, "observed");

  if (input.lstTokenAddress) {
    const supplyRequest: EtherscanRequestInput = {
      chainId,
      module: "stats",
      action: "tokensupply",
      params: {
        contractaddress: input.lstTokenAddress
      }
    };
    const holderCountRequest: EtherscanRequestInput = {
      chainId,
      module: "token",
      action: "tokenholdercount",
      params: {
        contractaddress: input.lstTokenAddress
      }
    };
    const topHoldersRequest: EtherscanRequestInput = {
      chainId,
      module: "token",
      action: "topholders",
      params: {
        contractaddress: input.lstTokenAddress,
        offset: 10
      }
    };

    sourceRefs.push(sourceRefFor(supplyRequest), sourceRefFor(holderCountRequest), sourceRefFor(topHoldersRequest));

    try {
      metrics.lstTotalSupply = await getTokenSupply(chainId, input.lstTokenAddress);
    } catch {
      // Leave null when request fails.
    }

    try {
      metrics.lstHolderCount = await getTokenHolderCount(chainId, input.lstTokenAddress);
    } catch {
      // Leave null when request fails (PRO endpoint may be unavailable).
    }

    try {
      const topHolders = await getTopTokenHolders(chainId, input.lstTokenAddress, 10);
      metrics.lstTop10HolderShare = topTenHolderShare(metrics.lstTotalSupply, topHolders);
    } catch {
      // Leave null when request fails.
    }

    setFieldQuality(fieldQuality, "lstTotalSupply", metrics.lstTotalSupply, "observed");
    setFieldQuality(fieldQuality, "lstHolderCount", metrics.lstHolderCount, "observed");
    setFieldQuality(fieldQuality, "lstTop10HolderShare", metrics.lstTop10HolderShare, "derived");

    if (input.transferMonitorAddress) {
      const transferRequest: EtherscanRequestInput = {
        chainId,
        module: "account",
        action: "tokentx",
        params: {
          address: input.transferMonitorAddress,
          contractaddress: input.lstTokenAddress,
          page: 1,
          offset: 100,
          startblock: 0,
          endblock: 99999999,
          sort: "desc"
        }
      };
      sourceRefs.push(sourceRefFor(transferRequest));

      try {
        const transfers = await getTokenTransfersByAddress(
          chainId,
          input.transferMonitorAddress,
          input.lstTokenAddress,
          {
            page: 1,
            offset: 100,
            sort: "desc"
          }
        );

        const transfers24h = transfersInLast24h(transfers);
        metrics.lstTransferCount24h = transfers24h.length;
        metrics.lstTransferVolume24h = sumTransferValue(transfers24h);
      } catch {
        // Leave null when request fails.
      }
    }
  }

  setFieldQuality(fieldQuality, "lstTransferCount24h", metrics.lstTransferCount24h, "derived");
  setFieldQuality(fieldQuality, "lstTransferVolume24h", metrics.lstTransferVolume24h, "derived");

  if (input.protocolContractAddress) {
    const abiRequest: EtherscanRequestInput = {
      chainId,
      module: "contract",
      action: "getabi",
      params: {
        address: input.protocolContractAddress
      }
    };
    sourceRefs.push(sourceRefFor(abiRequest));

    try {
      const contractResult = await getContractAbi(chainId, input.protocolContractAddress);
      metrics.contractAbiAvailable = contractResult.contractAbiAvailable;
      metrics.contractVerified = contractResult.contractVerified;
    } catch {
      // Leave null when request fails.
    }

    if (input.logsFromBlock && input.mintEventTopic0) {
      const mintRequest: EtherscanRequestInput = {
        chainId,
        module: "logs",
        action: "getLogs",
        params: {
          address: input.protocolContractAddress,
          fromBlock: input.logsFromBlock,
          toBlock: "latest",
          topic0: input.mintEventTopic0
        }
      };
      sourceRefs.push(sourceRefFor(mintRequest));

      try {
        const mintLogs = await getLogs(
          chainId,
          input.protocolContractAddress,
          input.logsFromBlock,
          "latest",
          { topic0: input.mintEventTopic0 }
        );
        metrics.protocolMintCount24h = mintLogs.length;
        metrics.protocolMintVolume24h = sumLogValues(mintLogs);
      } catch {
        // Leave null when request fails.
      }
    }

    if (input.logsFromBlock && input.redeemEventTopic0) {
      const redeemRequest: EtherscanRequestInput = {
        chainId,
        module: "logs",
        action: "getLogs",
        params: {
          address: input.protocolContractAddress,
          fromBlock: input.logsFromBlock,
          toBlock: "latest",
          topic0: input.redeemEventTopic0
        }
      };
      sourceRefs.push(sourceRefFor(redeemRequest));

      try {
        const redeemLogs = await getLogs(
          chainId,
          input.protocolContractAddress,
          input.logsFromBlock,
          "latest",
          { topic0: input.redeemEventTopic0 }
        );
        metrics.protocolRedeemCount24h = redeemLogs.length;
        metrics.protocolRedeemVolume24h = sumLogValues(redeemLogs);
      } catch {
        // Leave null when request fails.
      }
    }
  }

  if (input.treasuryAddress) {
    const balanceRequest: EtherscanRequestInput = {
      chainId,
      module: "account",
      action: "balance",
      params: {
        address: input.treasuryAddress,
        tag: "latest"
      }
    };
    sourceRefs.push(sourceRefFor(balanceRequest));

    try {
      metrics.protocolTreasuryNativeBalance = await getNativeBalance(chainId, input.treasuryAddress);
    } catch {
      // Leave null when request fails.
    }
  }

  setFieldQuality(fieldQuality, "contractAbiAvailable", metrics.contractAbiAvailable, "observed");
  setFieldQuality(fieldQuality, "contractVerified", metrics.contractVerified, "observed");
  setFieldQuality(fieldQuality, "protocolMintCount24h", metrics.protocolMintCount24h, "derived");
  setFieldQuality(fieldQuality, "protocolRedeemCount24h", metrics.protocolRedeemCount24h, "derived");
  setFieldQuality(fieldQuality, "protocolMintVolume24h", metrics.protocolMintVolume24h, "derived");
  setFieldQuality(fieldQuality, "protocolRedeemVolume24h", metrics.protocolRedeemVolume24h, "derived");
  setFieldQuality(
    fieldQuality,
    "protocolTreasuryNativeBalance",
    metrics.protocolTreasuryNativeBalance,
    "observed"
  );

  return {
    metrics,
    fieldQuality,
    sourceRefs: [...new Set(sourceRefs)]
  };
}

