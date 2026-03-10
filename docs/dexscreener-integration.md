# Dexscreener Integration Spec (v1)

## Purpose

This document defines how Dexscreener should be integrated into the dashboard data pipeline.

Dexscreener is being added to improve the dashboard’s visibility into **market microstructure**, especially around:

- token liquidity
- LST liquidity
- stablecoin exit routes
- trading activity
- pool concentration

This source is especially important for the **Exitability** pillar of the Global LST Health Score.

It should complement, not replace, the current sources:

- CoinGecko
- DefiLlama
- staking sources / manual fallbacks

---

# Why Dexscreener Matters

CoinGecko and DefiLlama are strong for:

- market cap
- price
- TVL
- protocol-level ecosystem metrics

But they are weaker for:

- actual pool-level liquidity
- exit route quality
- pair fragmentation
- DEX market structure

Dexscreener is being integrated to fill that gap.

---

# API Endpoints to Use

Use the official Dexscreener API endpoints below.

## 1. Search for pairs

Use this for discovery when needed:

`https://api.dexscreener.com/latest/dex/search?q={query}`

## 2. Get all pools for a token

Primary endpoint for token-level pool discovery:

`https://api.dexscreener.com/token-pairs/v1/{chainId}/{tokenAddress}`

## 3. Get specific pair data

Use this when pair addresses are already known:

`https://api.dexscreener.com/latest/dex/pairs/{chainId}/{pairId}`

## 4. Get one or multiple pairs by token address

Use this when batching token lookups:

`https://api.dexscreener.com/tokens/v1/{chainId}/{tokenAddresses}`

---

# Integration Goals

The Dexscreener integration should support the following use cases:

1. Detect whether a **credible stablecoin exit route** exists for a token
2. Measure **base token liquidity vs stablecoins**
3. Measure **LST liquidity and market activity**
4. Detect **pool concentration and fragmentation**
5. Provide liquidity inputs for:
   - Liquidity & Exit
   - Stress Resilience
   - partially DeFi Moneyness

---

# Data Categories to Extract

## A. Base token DEX market structure

For each network’s base token, collect:

- total DEX liquidity in USD
- 24h DEX volume in USD
- number of trading pairs
- largest pool liquidity
- pool concentration ratio
- stablecoin pair count
- best stablecoin exit pair
- best stablecoin exit liquidity

Suggested normalized fields:

- `baseTokenDexLiquidityUsd`
- `baseTokenDexVolume24hUsd`
- `baseTokenPairCount`
- `baseTokenLargestPoolLiquidityUsd`
- `baseTokenPoolConcentration`
- `baseTokenStableExitPairs`
- `baseTokenBestStableExitLiquidityUsd`

---

## B. Stablecoin exit route detection

For the base token, detect whether there are liquid routes to major stablecoins.

Target quote assets should include at least:

- USDC
- USDT
- DAI
- USDe
- other chain-relevant major stablecoins when appropriate

Derived outputs:

- `stableExitRouteExists`
- `stableExitLiquidityUsd`
- `stableExitPairAddress`
- `stableExitQuoteToken`
- `stableExitDexId`

This data should be used as an input to:
- Liquidity & Exit
- Stress Resilience

---

## C. LST market structure

For networks that already have an LST token configured, collect:

- total LST DEX liquidity in USD
- LST 24h DEX volume
- number of LST trading pairs
- largest LST pool liquidity
- LST pool concentration
- whether LST trades against base token
- whether LST trades against stablecoins

Suggested normalized fields:

- `lstDexLiquidityUsd`
- `lstDexVolume24hUsd`
- `lstPairCount`
- `lstLargestPoolLiquidityUsd`
- `lstPoolConcentration`
- `lstHasBasePair`
- `lstHasStablePair`

This data should be used as an input to:
- Liquidity & Exit
- DeFi Moneyness

---

## D. Liquidity utilization signals

For both base token and LST, compute:

- volume / liquidity ratio
- pair concentration ratio

Suggested derived fields:

- `baseTokenVolumeLiquidityRatio`
- `lstVolumeLiquidityRatio`

Interpretation:
- very low ratio may suggest dead liquidity
- very high ratio may suggest thin or highly stressed markets

---

# Scope for v1

The v1 Dexscreener integration should focus only on:

1. base token stable exit quality
2. base token DEX liquidity
3. LST DEX liquidity, if LST exists
4. pool concentration / fragmentation metrics

Do NOT attempt in v1 to estimate exact executable slippage curves unless the implementation is trivial.

Use liquidity and pool structure as a practical proxy.

---

# Architecture Requirements

## Adapter

Create a dedicated adapter:

`/src/data/adapters/dexscreener.ts`

It should expose deterministic functions, not ad hoc fetch logic scattered across the app.

Suggested functions:

- `searchPairs(query)`
- `getTokenPairs(chainId, tokenAddress)`
- `getPairsByTokenAddresses(chainId, tokenAddresses)`
- `extractBaseTokenDexMetrics(...)`
- `extractStableExitMetrics(...)`
- `extractLstDexMetrics(...)`

---

## Dataset integration

Update the dataset generation pipeline so Dexscreener metrics can be added into:

`/data/networks.generated.json`

Dexscreener-derived fields should be categorized as:

- `observed` when directly fetched
- `derived` when computed from fetched pool data

Do not label them as simulated.

---

## Metadata

Each record should preserve:

- `asOf`
- `sourceRefs`
- `quality`
- `confidence`

For Dexscreener-derived metrics, `sourceRefs` should include the relevant endpoint and, if practical, the pair address used for the winning stable exit route.

---

# Source of Truth Rules

Dexscreener should be the primary source for:

- DEX liquidity
- pool structure
- token/stable exit route detection

DefiLlama should remain the primary source for:

- DeFi TVL
- protocol-level ecosystem TVL
- stablecoin totals when used at ecosystem level

CoinGecko should remain the primary source for:

- market cap
- circulating supply
- token price

---

# Normalization Rules

## Stable exit detection

When scanning token pairs, prefer quote assets in this order unless chain-specific overrides exist:

1. native USDC
2. native USDT
3. DAI
4. other major chain-relevant stablecoins

If multiple stable pairs exist, choose the best one using:

1. highest liquidity.usd
2. then highest volume.h24
3. then most established / expected quote token

---

## Pool concentration

For a token:

`largest pool liquidity / total token liquidity`

Suggested normalized field:

- `poolConcentration`

Interpretation:
- high concentration = fragile market structure
- lower concentration = more diversified liquidity

---

## Volume / liquidity ratio

For a token:

`volume.h24 / total liquidity.usd`

Suggested normalized field:

- `volumeLiquidityRatio`

Interpretation:
- too low = dead liquidity
- too high = potentially thin or stressed market

Do not over-interpret this metric in v1; use it as a supporting signal only.

---

# Chain Mapping

The adapter must support a deterministic mapping between internal network IDs and Dexscreener chain IDs.

Create a mapping file if needed, for example:

`/src/data/mappings/dexscreenerChains.ts`

Do not try to guess chain IDs at runtime.

---

# LST Token Configuration

For v1, LST token discovery should remain deterministic.

If a network has a known LST token, define it in config.

Suggested config file:

`/src/data/config/lstTokens.ts`

Example structure:

- networkId
- lstSymbol
- lstTokenAddress
- dexscreenerChainId

Do NOT attempt to auto-discover LST tokens in v1.

---

# Fallback Behavior

If Dexscreener data is missing:

- do not invent values
- return null
- preserve metadata
- let the UI display Missing / N/A

This is especially important for smaller or newer networks.

---

# Caching

Cache Dexscreener responses for at least 10 minutes.

Reason:
- avoid unnecessary repeated calls
- reduce instability in local development
- reduce rate-limit risk

---

# Dashboard Usage

The dashboard should use Dexscreener-derived metrics to improve interpretation of:

## Radar overview
Possible new fields:
- stable exit route exists
- stable exit liquidity
- base token DEX liquidity

## Network detail
Possible new displays:
- best stable exit pair
- base token market structure
- LST liquidity structure
- pool concentration
- DEX liquidity confidence signals

---

# Relationship to Scoring

Dexscreener metrics should be used as inputs for the scoring engine, especially:

## Liquidity & Exit
- base token stable exit liquidity
- LST liquidity depth
- pool concentration
- route redundancy if available

## Stress Resilience
- pool concentration
- volume / liquidity ratio
- dependence on one dominant pool

## DeFi Moneyness (secondary support only)
- whether the LST is actively tradable
- whether it has a base pair and/or stable pair

Dexscreener should not be used for:
- validator metrics
- staking APY
- governance quality
- security posture

---

# v1 Deliverables

The v1 implementation should produce:

1. a Dexscreener adapter
2. deterministic chain mapping
3. deterministic LST token config
4. new Dexscreener fields inside the generated dataset
5. UI support for null / missing values
6. no live source discovery beyond configured mappings

---

# Constraints

- Use official Dexscreener API endpoints only
- Do not scrape the website
- Do not infer random pair mappings from token symbols alone if token addresses are known
- Prefer deterministic token-address-based queries
- Keep the implementation modular and replaceable
