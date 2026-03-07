# CoinGecko Basic Market Sync

This project can update a subset of overview dashboard market fields from CoinGecko on demand.

## Scope (v1)
Targets:
- XDC (`xdc`)
- Monad (`monad`)
- Sei (`sei`)
- Shardeum (`shardeum`)
- Sui (`sui`)

Updated fields (when available):
- `marketCapUsd`
- `fdvUsd`
- `circulatingSupply`
- `circulatingSupplyPct` (derived from circulating / max supply, or circulating / total supply)

Other fields remain under local control and are not overwritten.

## Manual execution

```bash
npm run data:sync:coingecko
npm run data:build:overview
npm run data:build:dataset
```

These commands write snapshot outputs to:

- `data/coingecko-basics.json`
- `data/overview-overrides.json`
- `data/networks.generated.json`

At runtime, `data/networks.ts` first applies CoinGecko market data and then applies merged overview overrides from `data/overview-overrides.json`.

If CoinGecko does not return a value, the existing base value in `data/networks.ts` is preserved.

## Direct endpoint for concrete IDs

If you want to inspect CoinGecko's market payload directly (without running the script), use:

```bash
curl -s "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=xdce-crowd-sale,sei-network,sui,monad,shardeum&sparkline=false"
```

This includes all current project targets (XDC, Sei, Sui, Monad, Shardeum) in one request.

## Connectivity / API key notes

If your environment blocks direct access to `api.coingecko.com`, run from your local machine.

You can also configure:

- `COINGECKO_BASE_URL` (custom API base)
- `COINGECKO_API_KEY` (sent as `x-cg-demo-api-key`)
