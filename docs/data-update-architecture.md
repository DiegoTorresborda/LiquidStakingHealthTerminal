# Data Update Architecture

## Overview

The dashboard relies on a normalized dataset generated from multiple sources.

These sources include:

1. external APIs
2. manually curated data
3. temporary mock data
4. manual overrides

The system merges these layers into a single dataset used by the UI.

---

# Data Source Layers

## 1. Raw API Data

Fetched from external services:

Examples:

- CoinGecko
- DefiLlama
- Dexscreener
- chain explorers

Stored as snapshots:

/data/raw/<source>/<date>.json

Example:

/data/raw/coingecko/2026-03-12.json

---

## 2. Manual Data

Some metrics are not easily accessible via APIs.

These values are manually curated.

Stored in:

/data/manual/manual-network-data.json

Examples:

- validatorCount
- stakingRatioPct
- stakingApyPct
- lockupPeriodDays

---

## 3. Mock Data

During early development some fields may be mocked.

Mock values must be clearly marked:

quality: simulated

Mock data should gradually be replaced by real sources.

---

## 4. Overrides

Overrides allow administrators to correct data.

Stored in:

/data/manual/overrides.json

Example:

{
  "networkId": "shardeum",
  "field": "validatorCount",
  "value": 920,
  "reason": "Explorer data delayed",
  "timestamp": "2026-03-12"
}

Overrides always take precedence over other sources.

---

# Dataset Generation

A build script merges all layers.

Script example:

scripts/build-overview-dataset.ts

Pipeline steps:

1. load raw API data
2. normalize fields
3. merge manual data
4. apply overrides
5. compute scores
6. export normalized dataset

Output file:

/data/networks.generated.json

This is the dataset used by the dashboard UI.

---

# Admin Interaction

Admin actions affect the pipeline:

## Sync API

Admin triggers API fetch.

New raw snapshots are created.

Dataset is rebuilt.

---

## Edit Manual Data

Manual values updated.

Dataset rebuilt.

---

## Edit Resources

Updates:

/data/chain-resources.json

No dataset rebuild required.

---

# Design Principles

The architecture follows common data pipeline practices:

- separate ingestion from transformation
- keep raw snapshots immutable
- isolate manual corrections
- rebuild normalized datasets

This improves reliability and traceability.
