# Overview Dashboard Data Map (Phase 1)

This document defines how each `Network` field in the radar dataset is treated during ingestion.

## Classification
- **Observed**: fetched from an external source as-is.
- **Derived**: computed from observed/manual values.
- **Curated**: maintained manually for now (product judgement / narrative values).

## Current source plan (Phase 1-3)

| Field | Class | Source plan | Refresh |
|---|---|---|---|
| `networkId`, `network`, `token`, `category` | Curated | Local baseline | Manual |
| `marketCapUsd`, `fdvUsd`, `circulatingSupply`, `circulatingSupplyPct` | Observed | CoinGecko snapshot (`data/coingecko-basics.json`) | On-demand |
| `stakingRatioPct`, `stakingApyPct`, `stakerAddresses`, `validatorCount` | Curated (transitioning to observed) | Domain override snapshot (`data/dashboard-domain-overrides.json`) | Manual |
| `stakedValueUsd` | Derived | `marketCapUsd * stakingRatioPct` when available, fallback local | On-demand/manual |
| `lstProtocols`, `largestLst`, `lstTvlUsd` | Curated (transitioning to observed) | Domain override snapshot | Manual |
| `lstPenetrationPct` | Derived | `lstTvlUsd / stakedValueUsd` when available, fallback local | On-demand/manual |
| `defiTvlUsd` | Curated (transitioning to observed) | Domain override snapshot | Manual |
| `tvlToMcapPct` | Derived | `defiTvlUsd / marketCapUsd` when available, fallback local | On-demand/manual |
| `stablecoinLiquidityUsd`, `lendingPresence`, `lstCollateralEnabled` | Curated (transitioning to observed) | Domain override snapshot | Manual |
| `globalLstHealthScore`, `opportunityScore` | Curated / scoring output | Existing scoring workflow | Manual/scoring |
| `mainBottleneck`, `mainOpportunity`, `status` | Curated | Product narrative | Manual |

## Guardrails
- Do not overwrite a field with `null` from an external snapshot.
- Preserve local baseline when a source record is unavailable.
- Keep observed data and curated narrative fields separate.
- Prefer explicit status markers (`ok`, `partial`, `missing_*`) over silent fallback.
