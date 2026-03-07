import { fetchJsonWithCache } from "./http-cache.ts";

export type CoingeckoMetric = {
  marketCapUsd: number | null;
  circulatingSupply: number | null;
  priceUsd: number | null;
  volume24hUsd: number | null;
  sourceRef: string;
};

type CoinsMarketsResponse = Array<{
  id: string;
  market_cap: number | null;
  circulating_supply: number | null;
  current_price: number | null;
  total_volume: number | null;
}>;

const COINGECKO_MARKETS_URL = "https://api.coingecko.com/api/v3/coins/markets";

export async function fetchCoingeckoMetricsByNetwork(
  coinIdByNetwork: Record<string, string>
): Promise<Record<string, CoingeckoMetric>> {
  const ids = Object.values(coinIdByNetwork);
  if (ids.length === 0) return {};

  const query = new URLSearchParams({
    vs_currency: "usd",
    ids: ids.join(","),
    sparkline: "false"
  });

  const url = `${COINGECKO_MARKETS_URL}?${query.toString()}`;
  const markets = await fetchJsonWithCache<CoinsMarketsResponse>(url, {
    headers: {
      accept: "application/json",
      ...(process.env.COINGECKO_API_KEY ? { "x-cg-demo-api-key": process.env.COINGECKO_API_KEY } : {})
    }
  });

  const byCoinId = new Map(markets.map((entry) => [entry.id, entry]));

  const result: Record<string, CoingeckoMetric> = {};
  for (const [networkId, coinId] of Object.entries(coinIdByNetwork)) {
    const market = byCoinId.get(coinId);
    result[networkId] = {
      marketCapUsd: market?.market_cap ?? null,
      circulatingSupply: market?.circulating_supply ?? null,
      priceUsd: market?.current_price ?? null,
      volume24hUsd: market?.total_volume ?? null,
      sourceRef: `coingecko:coins/markets:${coinId}`
    };
  }

  return result;
}
