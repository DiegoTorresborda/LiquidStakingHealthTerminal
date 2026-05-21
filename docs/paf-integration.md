# PAF Integration

How the [paf-toolkit](../paf-toolkit/) (Python) feeds Ethereum benchmark data and stage classifications into the Next.js dashboard.

## Architecture

```
paf-toolkit/data/benchmark/ethereum.yaml ─┐
paf-toolkit/data/networks/*.yaml          ├─► npm run data:sync:paf
                                           │   (scripts/sync-paf-data.ts)
src/lib/paf/{types,thresholds,scoring}.ts ─┘            │
                                                         ▼
                                          data/paf-data.json
                                                         │
                                                         ▼
                                          data/networks.ts (Network.paf?)
                                                         │
                                          ┌──────────────┼──────────────┐
                                          ▼              ▼              ▼
                                  /benchmarks    /network/[id]    home table
                                  (3 tabs)       (vs-ETH panel)   (stage column)
```

**Single source of truth for Ethereum**: `paf-toolkit/data/benchmark/ethereum.yaml`. Python toolkit has 9 calibration tests guaranteeing it classifies as S4.2.

**TypeScript port**: `src/lib/paf/{types,thresholds,scoring}.ts` mirrors the Python `paf/{schema,thresholds,scoring}.py`. Same threshold rules, same stage-classification logic, same trajectory algorithm.

**Build step**: `scripts/sync-paf-data.ts` reads the YAMLs, applies the engine, writes `data/paf-data.json`. Runs via `npm run data:sync:paf`. Should be added to `data:refresh:overview` pipeline once the workflow stabilizes.

## Adding a new network

1. Add the YAML in `paf-toolkit/data/networks/<ticker>.yaml`. Use `paf-toolkit/data/networks/_template.yaml` as the template.
2. (Optional) Score it with the Python toolkit first to verify: `cd paf-toolkit && .venv/bin/paf score data/networks/<ticker>.yaml`.
3. Sync: `npm run data:sync:paf` from the repo root.
4. Ensure the network exists in `data/networks.ts` with the matching `networkId`. The sync script writes its PAF data keyed by `ticker.toLowerCase()` — match this when reading from `data/paf-data.json`.

## The five funnel layers

| Layer | Question | Threshold to next stage |
|---|---|---|
| L1 Native token | Is the token adopted? | staking_ratio > 2% → S1 |
| L2 Staking security | Is the chain secured? | liquidization > 20% AND (≥3 LST issuers > 5% OR largest issuer < 70%) → S2 |
| L3 Liquid staking | Are staked positions liquid? | defi_productivity > 30% AND withdrawals enabled → S3 |
| L4.1 Restaking | Compounding security? | restaking_tvl > 5% of LST TVL → S4.1 |
| L4.2 DeFi productivity | Productive collateral? | looping in 2+ markets AND Pendle-equiv > $1B → S4.2 |

Native-liquid-staking networks (Solana, Cardano) get the **S\*** badge and skip the L3 evaluation entirely.

## Surfaces in the app

### `/benchmarks` (new route)

Three tabs:
- **Table** — every network side-by-side with stage badge, 5 conversion ratios, and gap-vs-ETH per metric.
- **Funnel positions** — Recharts scatter, x=staking%, y=liquidization%, color=stage, size ∝ √(mcap). Reference lines at the S0→S1 (2%) and S1→S2 (20%) thresholds. Ethereum has a dashed halo to mark it as the benchmark.
- **Trajectory** — Ethereum's quarterly curve (Q4'20 → Q1'26) with each emerging network overlaid as a dot. Tells you "Network X is where ETH was in Q[Y]".

### `/network/[networkId]` (vs-ETH panel)

A new panel above the V2 scoring breakdown showing:
- Stage badge + trajectory line
- 5-axis Recharts radar comparing the network's conversion ratios to Ethereum's
- Auto-derived strengths (green) and gaps (amber, max 3)
- Stage-driven BD recommendation in a sky-tinted callout

Only renders when `network.paf` is present — i.e., the network has a YAML in `paf-toolkit/data/networks/`.

### Home networks table (stage column)

A new "Funnel Stage" column between Global LST Health and # of LSTs. Compact badge (just `S4.2` etc.). Networks without PAF data show `—`. Sortable by stage rank (S0 < S1 < ... < S4.2 < S\*).

## Ethereum as a Network

ETH is added to `data/networks.ts` as a first-class Network with:
- `isBenchmark: true` and `status: "Benchmark"` (badge in the table)
- `category: "Reference benchmark"`
- All scale-dependent fields (market cap, staked tokens, validator count) pulled from `paf-data.json`
- V2 health-score inputs (DEX liquidity, stable exit liquidity, etc.) hardcoded with representative order-of-magnitude values. **The V2 health score for ETH is approximate** — PAF measures funnel-level KPIs (HHI, integration counts) while V2 measures specific-protocol granularity (per-LST peg deviation, per-pool DEX liquidity). The two are complementary, not interchangeable.

The Ethereum visibility default is **visible everywhere** (table, charts, /benchmarks). To hide ETH from the home table only, add `"ethereum"` to `data/manual/network-visibility.json` `hidden` array.

## Two lenses, not one

The toolkit keeps **two complementary scoring lenses** running independently:

| Lens | Source | Output | Question answered |
|---|---|---|---|
| **LSHT Health Score V2** | `src/features/scoring/v2/` | 0–100 + band (Institutional / Strong / Usable / Fragile / Avoid) | "Is this LST safe and usable today?" |
| **PAF Funnel Stage** | `src/lib/paf/` | S0 … S4.2 (or S\*) | "Where is this network in the adoption arc?" |

A network can be S4.2 (mature funnel) with a mediocre V2 score (a mature LST with operational problems) or S1 (just-securing) with a high V2 score (a small but well-built LST). Surfacing both lets BD pick targets across the dimensions independently.

## Calibration note: S1 → S2 rule

The Python and TS versions both use a two-clause rule:

> liquidization > 20% **AND** (≥3 LST issuers > 5% **OR** largest issuer < 70%)

The original benchmark spec was `≥3 LST issuers > 5%` only. At Ethereum maturity (Q1 2026), natural consolidation has left only 2 issuers above 5% (Lido ~55%, Binance wBETH ~22%) — the original rule would falsely fail Ethereum despite the LST market being unambiguously healthy. The OR clause (`largest issuer < 70%`) captures the anti-monopoly intent without false-failing mature networks.

See [paf-toolkit/paf/thresholds.py](../paf-toolkit/paf/thresholds.py) and [src/lib/paf/thresholds.ts](../src/lib/paf/thresholds.ts) — both files document this trade-off in code comments.

## Price consistency

The Python toolkit's `paf.derive` module recomputes USD KPIs from native quantities × `native_price_usd`. A pytest (`test_stored_usd_values_consistent_with_derived`) fails if the stored YAML values drift more than 2% from the derived ones. **Always run `cd paf-toolkit && .venv/bin/paf validate-benchmark` after touching a YAML's price-dependent fields.**

When ETH price changes, edit `paf-toolkit/data/benchmark/ethereum.yaml` `l1.native_price_usd.value` and the 4 dependent USD fields (`market_cap_usd`, `lst_tvl_usd`, `lst_in_defi_tvl_usd`, `restaking_tvl_usd`). The test will tell you exactly which fields drifted.

## Files

| File | Purpose |
|---|---|
| `paf-toolkit/` | Python toolkit — canonical YAMLs + calibration tests |
| `scripts/sync-paf-data.ts` | YAML → JSON sync step |
| `data/paf-data.json` | Generated; do not edit by hand |
| `src/lib/paf/types.ts` | TS types (Stage, PafExtension, etc.) |
| `src/lib/paf/thresholds.ts` | Stage transition rules |
| `src/lib/paf/scoring.ts` | classifyStage, ratios, trajectory, BD rec |
| `src/features/benchmarks/` | UI components (table, scatter, trajectory, vs-ETH panel, stage badge) |
| `app/benchmarks/page.tsx` | New route |
| `data/networks.ts` | Extended `Network` type + Ethereum entry |
