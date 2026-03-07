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
```

The command writes snapshot output to:

- `data/coingecko-basics.json`

At runtime, `data/networks.ts` applies CoinGecko overrides only for the five target networks, and only for records with `status: "ok"`.

If CoinGecko does not return a value, the existing base value in `data/networks.ts` is preserved.
