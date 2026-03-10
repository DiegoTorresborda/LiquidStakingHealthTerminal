import { fetchJsonWithCache } from "./http-cache.ts";

const DEXSCREENER_BASE_URL = "https://api.dexscreener.com";

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

const STABLE_PRIORITY = ["USDC", "USDT", "DAI", "USDE"] as const;

type StableCandidate = {
  pair: DexscreenerPair;
  stableToken: DexscreenerToken;
  liquidityUsd: number;
  volume24hUsd: number;
  priority: number;
};

export type DexscreenerToken = {
  address?: string;
  symbol?: string;
  name?: string;
};

export type DexscreenerPair = {
  chainId?: string;
  dexId?: string;
  pairAddress?: string;
  baseToken?: DexscreenerToken;
  quoteToken?: DexscreenerToken;
  volume?: {
    h24?: number;
  };
  liquidity?: {
    usd?: number;
  };
};

export type DexscreenerNormalizedMetrics = {
  baseTokenDexLiquidityUsd: number | null;
  baseTokenDexVolume24hUsd: number | null;
  baseTokenPairCount: number | null;
  baseTokenLargestPoolLiquidityUsd: number | null;
  baseTokenPoolConcentration: number | null;
  stableExitRouteExists: boolean | null;
  stableExitLiquidityUsd: number | null;
  stableExitPairAddress: string | null;
  stableExitQuoteToken: string | null;
  stableExitDexId: string | null;
  lstDexLiquidityUsd: number | null;
  lstDexVolume24hUsd: number | null;
  lstPairCount: number | null;
  lstLargestPoolLiquidityUsd: number | null;
  lstPoolConcentration: number | null;
  lstHasBasePair: boolean | null;
  lstHasStablePair: boolean | null;
  baseTokenVolumeLiquidityRatio: number | null;
  lstVolumeLiquidityRatio: number | null;
};

export type DexscreenerMetricField = (typeof DEX_FIELDS)[number];

export type DexscreenerFieldQuality = "observed" | "derived" | "missing";

export type DexscreenerFieldQualityMap = Record<DexscreenerMetricField, DexscreenerFieldQuality>;

export type DexscreenerCollectionInput = {
  chainId: string | null;
  baseTokenAddress: string | null;
  lstTokenAddress?: string | null;
};

export type DexscreenerCollectionResult = {
  metrics: DexscreenerNormalizedMetrics;
  fieldQuality: DexscreenerFieldQualityMap;
  sourceRefs: string[];
};

type DexscreenerApiResponse =
  | DexscreenerPair[]
  | {
      pairs?: DexscreenerPair[];
    };

type StableExitMetrics = {
  stableExitRouteExists: boolean;
  stableExitLiquidityUsd: number | null;
  stableExitPairAddress: string | null;
  stableExitQuoteToken: string | null;
  stableExitDexId: string | null;
};

function emptyDexMetrics(): DexscreenerNormalizedMetrics {
  return {
    baseTokenDexLiquidityUsd: null,
    baseTokenDexVolume24hUsd: null,
    baseTokenPairCount: null,
    baseTokenLargestPoolLiquidityUsd: null,
    baseTokenPoolConcentration: null,
    stableExitRouteExists: null,
    stableExitLiquidityUsd: null,
    stableExitPairAddress: null,
    stableExitQuoteToken: null,
    stableExitDexId: null,
    lstDexLiquidityUsd: null,
    lstDexVolume24hUsd: null,
    lstPairCount: null,
    lstLargestPoolLiquidityUsd: null,
    lstPoolConcentration: null,
    lstHasBasePair: null,
    lstHasStablePair: null,
    baseTokenVolumeLiquidityRatio: null,
    lstVolumeLiquidityRatio: null
  };
}

function emptyDexFieldQuality(): DexscreenerFieldQualityMap {
  return {
    baseTokenDexLiquidityUsd: "missing",
    baseTokenDexVolume24hUsd: "missing",
    baseTokenPairCount: "missing",
    baseTokenLargestPoolLiquidityUsd: "missing",
    baseTokenPoolConcentration: "missing",
    stableExitRouteExists: "missing",
    stableExitLiquidityUsd: "missing",
    stableExitPairAddress: "missing",
    stableExitQuoteToken: "missing",
    stableExitDexId: "missing",
    lstDexLiquidityUsd: "missing",
    lstDexVolume24hUsd: "missing",
    lstPairCount: "missing",
    lstLargestPoolLiquidityUsd: "missing",
    lstPoolConcentration: "missing",
    lstHasBasePair: "missing",
    lstHasStablePair: "missing",
    baseTokenVolumeLiquidityRatio: "missing",
    lstVolumeLiquidityRatio: "missing"
  };
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function toNumberOrNull(value: unknown): number | null {
  return isFiniteNumber(value) ? value : null;
}

function normalizeAddress(value: string | undefined | null): string | null {
  if (!value) return null;
  return value.trim().toLowerCase();
}

function normalizePairs(payload: DexscreenerApiResponse): DexscreenerPair[] {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (payload && Array.isArray(payload.pairs)) {
    return payload.pairs;
  }

  return [];
}

function extractPairLiquidityUsd(pair: DexscreenerPair): number | null {
  return toNumberOrNull(pair.liquidity?.usd);
}

function extractPairVolume24hUsd(pair: DexscreenerPair): number | null {
  return toNumberOrNull(pair.volume?.h24);
}

function pairIncludesToken(pair: DexscreenerPair, tokenAddress: string): boolean {
  const target = normalizeAddress(tokenAddress);
  if (!target) return false;

  const baseAddress = normalizeAddress(pair.baseToken?.address);
  const quoteAddress = normalizeAddress(pair.quoteToken?.address);

  return baseAddress === target || quoteAddress === target;
}

function getCounterpartyToken(pair: DexscreenerPair, tokenAddress: string): DexscreenerToken | null {
  const target = normalizeAddress(tokenAddress);
  if (!target) return null;

  const baseAddress = normalizeAddress(pair.baseToken?.address);
  const quoteAddress = normalizeAddress(pair.quoteToken?.address);

  if (baseAddress === target) {
    return pair.quoteToken ?? null;
  }

  if (quoteAddress === target) {
    return pair.baseToken ?? null;
  }

  return null;
}

function stablePriority(token: DexscreenerToken | null): number {
  const symbol = String(token?.symbol ?? "").toUpperCase();

  for (let index = 0; index < STABLE_PRIORITY.length; index += 1) {
    if (symbol.includes(STABLE_PRIORITY[index])) {
      return index + 1;
    }
  }

  if (symbol.includes("USD")) {
    return 100;
  }

  return Number.POSITIVE_INFINITY;
}

function isStableToken(token: DexscreenerToken | null): boolean {
  return Number.isFinite(stablePriority(token));
}

export async function searchPairs(query: string): Promise<DexscreenerPair[]> {
  const normalized = query.trim();
  if (!normalized) return [];

  const url = `${DEXSCREENER_BASE_URL}/latest/dex/search?q=${encodeURIComponent(normalized)}`;
  const payload = await fetchJsonWithCache<DexscreenerApiResponse>(url);
  return normalizePairs(payload);
}

export async function getTokenPairs(chainId: string, tokenAddress: string): Promise<DexscreenerPair[]> {
  const url = `${DEXSCREENER_BASE_URL}/token-pairs/v1/${encodeURIComponent(chainId)}/${encodeURIComponent(tokenAddress)}`;
  const payload = await fetchJsonWithCache<DexscreenerApiResponse>(url);
  return normalizePairs(payload);
}

export async function getPairById(chainId: string, pairId: string): Promise<DexscreenerPair[]> {
  const url = `${DEXSCREENER_BASE_URL}/latest/dex/pairs/${encodeURIComponent(chainId)}/${encodeURIComponent(pairId)}`;
  const payload = await fetchJsonWithCache<DexscreenerApiResponse>(url);
  return normalizePairs(payload);
}

export async function getPairsByTokenAddresses(chainId: string, tokenAddresses: string[]): Promise<DexscreenerPair[]> {
  const addresses = tokenAddresses.map((address) => address.trim()).filter(Boolean);
  if (addresses.length === 0) return [];

  const encodedAddresses = addresses.map((address) => encodeURIComponent(address)).join(",");
  const url = `${DEXSCREENER_BASE_URL}/tokens/v1/${encodeURIComponent(chainId)}/${encodedAddresses}`;
  const payload = await fetchJsonWithCache<DexscreenerApiResponse>(url);
  return normalizePairs(payload);
}

export function extractStableExitMetrics(pairs: DexscreenerPair[], tokenAddress: string | null): StableExitMetrics {
  if (!tokenAddress) {
    return {
      stableExitRouteExists: false,
      stableExitLiquidityUsd: null,
      stableExitPairAddress: null,
      stableExitQuoteToken: null,
      stableExitDexId: null
    };
  }

  const candidates: StableCandidate[] = [];

  for (const pair of pairs) {
    if (!pairIncludesToken(pair, tokenAddress)) {
      continue;
    }

    const counterparty = getCounterpartyToken(pair, tokenAddress);
    if (!isStableToken(counterparty)) {
      continue;
    }

    candidates.push({
      pair,
      stableToken: counterparty as DexscreenerToken,
      liquidityUsd: extractPairLiquidityUsd(pair) ?? 0,
      volume24hUsd: extractPairVolume24hUsd(pair) ?? 0,
      priority: stablePriority(counterparty)
    });
  }

  if (candidates.length === 0) {
    return {
      stableExitRouteExists: false,
      stableExitLiquidityUsd: null,
      stableExitPairAddress: null,
      stableExitQuoteToken: null,
      stableExitDexId: null
    };
  }

  candidates.sort((left, right) => {
    if (right.liquidityUsd !== left.liquidityUsd) {
      return right.liquidityUsd - left.liquidityUsd;
    }

    if (right.volume24hUsd !== left.volume24hUsd) {
      return right.volume24hUsd - left.volume24hUsd;
    }

    return left.priority - right.priority;
  });

  const winner = candidates[0];

  return {
    stableExitRouteExists: true,
    stableExitLiquidityUsd: winner.liquidityUsd,
    stableExitPairAddress: winner.pair.pairAddress ?? null,
    stableExitQuoteToken: winner.stableToken.symbol ?? null,
    stableExitDexId: winner.pair.dexId ?? null
  };
}

export function extractBaseTokenDexMetrics(
  pairs: DexscreenerPair[],
  tokenAddress: string | null
): Pick<
  DexscreenerNormalizedMetrics,
  | "baseTokenDexLiquidityUsd"
  | "baseTokenDexVolume24hUsd"
  | "baseTokenPairCount"
  | "baseTokenLargestPoolLiquidityUsd"
  | "baseTokenPoolConcentration"
  | "stableExitRouteExists"
  | "stableExitLiquidityUsd"
  | "stableExitPairAddress"
  | "stableExitQuoteToken"
  | "stableExitDexId"
  | "baseTokenVolumeLiquidityRatio"
> {
  if (!tokenAddress) {
    return {
      baseTokenDexLiquidityUsd: null,
      baseTokenDexVolume24hUsd: null,
      baseTokenPairCount: null,
      baseTokenLargestPoolLiquidityUsd: null,
      baseTokenPoolConcentration: null,
      stableExitRouteExists: null,
      stableExitLiquidityUsd: null,
      stableExitPairAddress: null,
      stableExitQuoteToken: null,
      stableExitDexId: null,
      baseTokenVolumeLiquidityRatio: null
    };
  }

  let totalLiquidity = 0;
  let totalVolume = 0;
  let largestPool = 0;

  for (const pair of pairs) {
    const liquidity = extractPairLiquidityUsd(pair) ?? 0;
    const volume = extractPairVolume24hUsd(pair) ?? 0;

    totalLiquidity += liquidity;
    totalVolume += volume;

    if (liquidity > largestPool) {
      largestPool = liquidity;
    }
  }

  const stableExit = extractStableExitMetrics(pairs, tokenAddress);

  return {
    baseTokenDexLiquidityUsd: totalLiquidity,
    baseTokenDexVolume24hUsd: totalVolume,
    baseTokenPairCount: pairs.length,
    baseTokenLargestPoolLiquidityUsd: largestPool,
    baseTokenPoolConcentration: totalLiquidity > 0 ? largestPool / totalLiquidity : null,
    stableExitRouteExists: stableExit.stableExitRouteExists,
    stableExitLiquidityUsd: stableExit.stableExitLiquidityUsd,
    stableExitPairAddress: stableExit.stableExitPairAddress,
    stableExitQuoteToken: stableExit.stableExitQuoteToken,
    stableExitDexId: stableExit.stableExitDexId,
    baseTokenVolumeLiquidityRatio: totalLiquidity > 0 ? totalVolume / totalLiquidity : null
  };
}

export function extractLstDexMetrics(
  pairs: DexscreenerPair[],
  lstTokenAddress: string | null,
  baseTokenAddress: string | null
): Pick<
  DexscreenerNormalizedMetrics,
  | "lstDexLiquidityUsd"
  | "lstDexVolume24hUsd"
  | "lstPairCount"
  | "lstLargestPoolLiquidityUsd"
  | "lstPoolConcentration"
  | "lstHasBasePair"
  | "lstHasStablePair"
  | "lstVolumeLiquidityRatio"
> {
  if (!lstTokenAddress) {
    return {
      lstDexLiquidityUsd: null,
      lstDexVolume24hUsd: null,
      lstPairCount: null,
      lstLargestPoolLiquidityUsd: null,
      lstPoolConcentration: null,
      lstHasBasePair: null,
      lstHasStablePair: null,
      lstVolumeLiquidityRatio: null
    };
  }

  let totalLiquidity = 0;
  let totalVolume = 0;
  let largestPool = 0;

  for (const pair of pairs) {
    const liquidity = extractPairLiquidityUsd(pair) ?? 0;
    const volume = extractPairVolume24hUsd(pair) ?? 0;

    totalLiquidity += liquidity;
    totalVolume += volume;

    if (liquidity > largestPool) {
      largestPool = liquidity;
    }
  }

  const normalizedBaseTokenAddress = normalizeAddress(baseTokenAddress);
  const normalizedLstTokenAddress = normalizeAddress(lstTokenAddress);

  const lstHasBasePair = normalizedBaseTokenAddress
    ? pairs.some((pair) => {
        const baseAddress = normalizeAddress(pair.baseToken?.address);
        const quoteAddress = normalizeAddress(pair.quoteToken?.address);

        return (
          (baseAddress === normalizedLstTokenAddress && quoteAddress === normalizedBaseTokenAddress) ||
          (quoteAddress === normalizedLstTokenAddress && baseAddress === normalizedBaseTokenAddress)
        );
      })
    : null;

  const lstHasStablePair = pairs.some((pair) => {
    if (!pairIncludesToken(pair, lstTokenAddress)) {
      return false;
    }

    const counterparty = getCounterpartyToken(pair, lstTokenAddress);
    return isStableToken(counterparty);
  });

  return {
    lstDexLiquidityUsd: totalLiquidity,
    lstDexVolume24hUsd: totalVolume,
    lstPairCount: pairs.length,
    lstLargestPoolLiquidityUsd: largestPool,
    lstPoolConcentration: totalLiquidity > 0 ? largestPool / totalLiquidity : null,
    lstHasBasePair,
    lstHasStablePair,
    lstVolumeLiquidityRatio: totalLiquidity > 0 ? totalVolume / totalLiquidity : null
  };
}

function isMetricPresent(value: unknown): boolean {
  if (typeof value === "number") {
    return Number.isFinite(value);
  }

  if (typeof value === "boolean") {
    return true;
  }

  if (typeof value === "string") {
    return value.trim().length > 0;
  }

  return value !== null && value !== undefined;
}

function setFieldQuality(
  fieldQuality: DexscreenerFieldQualityMap,
  field: DexscreenerMetricField,
  value: DexscreenerNormalizedMetrics[DexscreenerMetricField],
  presentQuality: DexscreenerFieldQuality
) {
  fieldQuality[field] = isMetricPresent(value) ? presentQuality : "missing";
}

export async function collectDexscreenerMetrics(input: DexscreenerCollectionInput): Promise<DexscreenerCollectionResult> {
  const metrics = emptyDexMetrics();
  const fieldQuality = emptyDexFieldQuality();
  const sourceRefs: string[] = [];

  if (!input.chainId || !input.baseTokenAddress) {
    return { metrics, fieldQuality, sourceRefs };
  }

  const chainId = input.chainId;

  const baseSourceRef = `dexscreener:token-pairs:v1:${chainId}:${input.baseTokenAddress}`;
  sourceRefs.push(baseSourceRef);

  try {
    const basePairs = await getTokenPairs(chainId, input.baseTokenAddress);
    const baseMetrics = extractBaseTokenDexMetrics(basePairs, input.baseTokenAddress);

    metrics.baseTokenDexLiquidityUsd = baseMetrics.baseTokenDexLiquidityUsd;
    metrics.baseTokenDexVolume24hUsd = baseMetrics.baseTokenDexVolume24hUsd;
    metrics.baseTokenPairCount = baseMetrics.baseTokenPairCount;
    metrics.baseTokenLargestPoolLiquidityUsd = baseMetrics.baseTokenLargestPoolLiquidityUsd;
    metrics.baseTokenPoolConcentration = baseMetrics.baseTokenPoolConcentration;
    metrics.stableExitRouteExists = baseMetrics.stableExitRouteExists;
    metrics.stableExitLiquidityUsd = baseMetrics.stableExitLiquidityUsd;
    metrics.stableExitPairAddress = baseMetrics.stableExitPairAddress;
    metrics.stableExitQuoteToken = baseMetrics.stableExitQuoteToken;
    metrics.stableExitDexId = baseMetrics.stableExitDexId;
    metrics.baseTokenVolumeLiquidityRatio = baseMetrics.baseTokenVolumeLiquidityRatio;

    setFieldQuality(fieldQuality, "baseTokenDexLiquidityUsd", metrics.baseTokenDexLiquidityUsd, "derived");
    setFieldQuality(fieldQuality, "baseTokenDexVolume24hUsd", metrics.baseTokenDexVolume24hUsd, "derived");
    setFieldQuality(fieldQuality, "baseTokenPairCount", metrics.baseTokenPairCount, "derived");
    setFieldQuality(fieldQuality, "baseTokenLargestPoolLiquidityUsd", metrics.baseTokenLargestPoolLiquidityUsd, "derived");
    setFieldQuality(fieldQuality, "baseTokenPoolConcentration", metrics.baseTokenPoolConcentration, "derived");
    setFieldQuality(fieldQuality, "stableExitRouteExists", metrics.stableExitRouteExists, "derived");
    setFieldQuality(fieldQuality, "stableExitLiquidityUsd", metrics.stableExitLiquidityUsd, "observed");
    setFieldQuality(fieldQuality, "stableExitPairAddress", metrics.stableExitPairAddress, "observed");
    setFieldQuality(fieldQuality, "stableExitQuoteToken", metrics.stableExitQuoteToken, "observed");
    setFieldQuality(fieldQuality, "stableExitDexId", metrics.stableExitDexId, "observed");
    setFieldQuality(fieldQuality, "baseTokenVolumeLiquidityRatio", metrics.baseTokenVolumeLiquidityRatio, "derived");

    if (metrics.stableExitPairAddress) {
      sourceRefs.push(`dexscreener:pair:${chainId}:${metrics.stableExitPairAddress}`);
    }
  } catch {
    // keep null metrics when source is unavailable
  }

  if (input.lstTokenAddress) {
    const lstSourceRef = `dexscreener:token-pairs:v1:${chainId}:${input.lstTokenAddress}`;
    sourceRefs.push(lstSourceRef);

    try {
      const lstPairs = await getTokenPairs(chainId, input.lstTokenAddress);
      const lstMetrics = extractLstDexMetrics(lstPairs, input.lstTokenAddress, input.baseTokenAddress);

      metrics.lstDexLiquidityUsd = lstMetrics.lstDexLiquidityUsd;
      metrics.lstDexVolume24hUsd = lstMetrics.lstDexVolume24hUsd;
      metrics.lstPairCount = lstMetrics.lstPairCount;
      metrics.lstLargestPoolLiquidityUsd = lstMetrics.lstLargestPoolLiquidityUsd;
      metrics.lstPoolConcentration = lstMetrics.lstPoolConcentration;
      metrics.lstHasBasePair = lstMetrics.lstHasBasePair;
      metrics.lstHasStablePair = lstMetrics.lstHasStablePair;
      metrics.lstVolumeLiquidityRatio = lstMetrics.lstVolumeLiquidityRatio;

      setFieldQuality(fieldQuality, "lstDexLiquidityUsd", metrics.lstDexLiquidityUsd, "derived");
      setFieldQuality(fieldQuality, "lstDexVolume24hUsd", metrics.lstDexVolume24hUsd, "derived");
      setFieldQuality(fieldQuality, "lstPairCount", metrics.lstPairCount, "derived");
      setFieldQuality(fieldQuality, "lstLargestPoolLiquidityUsd", metrics.lstLargestPoolLiquidityUsd, "derived");
      setFieldQuality(fieldQuality, "lstPoolConcentration", metrics.lstPoolConcentration, "derived");
      setFieldQuality(fieldQuality, "lstHasBasePair", metrics.lstHasBasePair, "derived");
      setFieldQuality(fieldQuality, "lstHasStablePair", metrics.lstHasStablePair, "derived");
      setFieldQuality(fieldQuality, "lstVolumeLiquidityRatio", metrics.lstVolumeLiquidityRatio, "derived");
    } catch {
      // keep null metrics when source is unavailable
    }
  }

  return {
    metrics,
    fieldQuality,
    sourceRefs: [...new Set(sourceRefs)]
  };
}
