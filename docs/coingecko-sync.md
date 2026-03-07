# CoinGecko Basic Market Sync

This project can update a subset of overview dashboard market fields from CoinGecko on demand.

## Scope (v1)
Targets:
- XDC (`xdc`)
- Monad (`monad`)
- Sei (`sei`)
- Shardeum (`shardeum`)
- Sui (`sui`)
- Aptos (`aptos`)
- Berachain (`berachain`)
- Core (`core`)
- Mantra (`mantra`)
- Sonic (`sonic`)

Updated fields (when available):
- `marketCapUsd`
- `fdvUsd`
- `circulatingSupply`
- `circulatingSupplyPct` (derived from circulating / max supply, or circulating / total supply)

Other fields remain under local control and are not overwritten.

## Manual execution

```bash
npm run data:sync:coingecko
```

The command writes snapshot output to:

- `data/coingecko-basics.json`

At runtime, `data/networks.ts` applies CoinGecko overrides only for the five target networks when a snapshot record is usable (`status: "ok"` or `status: "partial"`).

If CoinGecko does not return a value, the existing base value in `data/networks.ts` is preserved.

## Direct endpoint for concrete IDs

If you want to inspect CoinGecko's market payload directly (without running the script), use:

```bash
curl -s "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=xdce-crowd-sale,monad,sei-network,shardeum-2,sui,aptos,berachain-bera,coredaoorg,mantra-dao,sonic-3&sparkline=false"
```

This includes all current project targets in one request.

## Connectivity / API key notes

If your environment blocks direct access to `api.coingecko.com`, run from your local machine.

You can also configure:

- `COINGECKO_BASE_URL` (custom API base)
- `COINGECKO_API_KEY` (sent as `x-cg-demo-api-key`)
