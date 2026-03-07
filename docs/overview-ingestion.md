# Deterministic Overview Ingestion Layer

Pipeline:

RAW APIs → adapters → normalized metrics → generated dataset → dashboard

## Adapters

- `src/data/adapters/coingecko.ts`
- `src/data/adapters/defillama.ts`
- `src/data/adapters/stakingRewards.ts`
- `src/data/adapters/manualFallback.ts`

All adapters are deterministic and use fixed source mappings.

## Generated dataset

Build command:

```bash
npm run data:build:dataset
```

Output:

- `data/networks.generated.json`

## Cache

External API responses are cached for 10 minutes in:

- `.cache/ingestion/`

## Notes

- If APIs fail, the builder falls back to local snapshot/manual data.
- Dashboard reads generated records through `data/networks.ts` merge logic.
