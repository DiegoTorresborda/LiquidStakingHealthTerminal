import { fetchJsonWithCache } from "./http-cache.ts";

export type DefillamaMetric = {
  defiTvlUsd: number | null;
  stablecoinLiquidityUsd: number | null;
  lstTvlUsd: number | null;
  sourceRefs: string[];
};

type ChainsResponse = Array<{
  name?: string;
  tvl?: number;
  tokenSymbol?: string;
}>;

type ProtocolsResponse = Array<{
  chain?: string;
  category?: string;
  tvl?: number;
}>;

type StablecoinsResponse = {
  peggedAssets?: Array<{
    chainCirculating?: Record<string, { circulating?: { peggedUSD?: number } }>;
  }>;
};

const CHAINS_URL = "https://api.llama.fi/chains";
const PROTOCOLS_URL = "https://api.llama.fi/protocols";
const STABLECOINS_URL = "https://stablecoins.llama.fi/stablecoins";

function normalizeChainKey(value: string): string {
  return value.trim().toLowerCase();
}

export async function fetchDefillamaMetricsByNetwork(
  chainNameByNetwork: Record<string, string>
): Promise<Record<string, DefillamaMetric>> {
  const [chains, protocols, stablecoins] = await Promise.all([
    fetchJsonWithCache<ChainsResponse>(CHAINS_URL),
    fetchJsonWithCache<ProtocolsResponse>(PROTOCOLS_URL),
    fetchJsonWithCache<StablecoinsResponse>(STABLECOINS_URL)
  ]);

  const chainTvlByName = new Map<string, number>();
  for (const chain of chains) {
    if (!chain.name || typeof chain.tvl !== "number") continue;
    chainTvlByName.set(normalizeChainKey(chain.name), chain.tvl);
  }

  const lstTvlByChain = new Map<string, number>();
  for (const protocol of protocols) {
    if (!protocol.chain || typeof protocol.tvl !== "number") continue;
    if (normalizeChainKey(protocol.category ?? "") !== "liquid staking") continue;
    const key = normalizeChainKey(protocol.chain);
    lstTvlByChain.set(key, (lstTvlByChain.get(key) ?? 0) + protocol.tvl);
  }

  const stableByChain = new Map<string, number>();
  for (const asset of stablecoins.peggedAssets ?? []) {
    for (const [chainName, payload] of Object.entries(asset.chainCirculating ?? {})) {
      const amount = payload?.circulating?.peggedUSD;
      if (typeof amount !== "number") continue;
      const key = normalizeChainKey(chainName);
      stableByChain.set(key, (stableByChain.get(key) ?? 0) + amount);
    }
  }

  const result: Record<string, DefillamaMetric> = {};
  for (const [networkId, chainName] of Object.entries(chainNameByNetwork)) {
    const key = normalizeChainKey(chainName);
    result[networkId] = {
      defiTvlUsd: chainTvlByName.get(key) ?? null,
      stablecoinLiquidityUsd: stableByChain.get(key) ?? null,
      lstTvlUsd: lstTvlByChain.get(key) ?? null,
      sourceRefs: [
        `defillama:chains:${chainName}`,
        `defillama:protocols:category=liquid staking:chain=${chainName}`,
        `defillama:stablecoins:${chainName}`
      ]
    };
  }

  return result;
}
