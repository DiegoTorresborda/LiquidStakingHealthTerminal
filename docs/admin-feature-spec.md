# Admin Data Control Panel

## Purpose

The Admin Data Control Panel allows authorized users to manage and update the data powering the Liquid Staking Radar dashboard.

The dashboard combines multiple types of data sources:

- API data (CoinGecko, DefiLlama, Dexscreener, explorers, etc.)
- manually curated data
- temporary mock data

The admin panel provides a simple interface to:

1. trigger API data refresh
2. edit manual data
3. manage chain resources
4. override incorrect values

This ensures the dashboard remains accurate and maintainable without editing code.

---

# Admin Authentication

Admin access should be protected by a **simple password login**.

Requirements:

- login page: `/admin/login`
- password stored in environment variable
- session stored via HTTP-only cookie
- all `/admin/*` routes protected by middleware

This is intentionally lightweight because the tool is internal.

---

# Admin Pages

## `/admin`

Main control panel landing page.

Displays:

- quick links to all admin tools
- last dataset update time
- data source status

Sections:

- Data Sync
- Manual Data
- Chain Resources
- Overrides

---

# Data Sync

Route:

`/admin/data-sync`

Purpose:

Allow administrators to trigger refresh of external API sources.

Example actions:

- Sync CoinGecko
- Sync DefiLlama
- Sync Dexscreener
- Sync Explorer metrics
- Sync All Sources

Each sync action should:

1. fetch data from the API
2. store raw snapshot
3. update normalized dataset

The page should show:

- last sync time
- status
- number of networks updated

---

# Manual Data Editor

Route:

`/admin/manual-data`

Purpose:

Allow editing of manually curated network metrics.

Example editable fields:

- stakingRatioPct
- stakingApyPct
- validatorCount
- inflationRatePct
- notes

UI behavior:

- select network
- edit fields
- save changes

Manual edits should update:

`/data/manual/manual-network-data.json`

These values should override missing API data during dataset generation.

---

# Chain Resources Editor

Route:

`/admin/resources`

Purpose:

Allow editing of the chain resource registry.

Admin should be able to:

- add resource
- edit resource
- delete resource
- change category
- change priority

Changes should update:

`/data/chain-resources.json`

---

# Overrides Layer

Route:

`/admin/overrides`

Purpose:

Allow manual override of API-derived values.

Use case:

When API data is wrong or delayed.

Example overrides:

- stakingRatioPct
- validatorCount
- defiTvlUsd
- stablecoinLiquidityUsd

Each override should store:

- networkId
- field
- value
- reason
- timestamp

Overrides should be applied after API data normalization.

---

# Scope

This admin panel is intended for internal use.

Do NOT implement:

- multi-user accounts
- role-based permissions
- public access
- automatic scraping

Future versions may add:

- audit logs
- data validation rules
- sync scheduling
