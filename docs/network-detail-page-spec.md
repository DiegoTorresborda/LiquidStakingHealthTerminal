# Network Detail Page Spec

## Purpose
This document defines the product and UI requirements for the per-network diagnostic page that extends the LST Opportunity Radar dashboard.

This page should render when a user clicks a network row from the overview dashboard.

Example routes:
- /network/monad
- /network/sei
- /network/sui

The page is the diagnostic layer of the product.

It should answer:
- How healthy is this network’s LST ecosystem today?
- What are the main weaknesses?
- What should be improved first?
- What risks matter most for a liquidity provider?

---

## Core page objective
Translate a network from a simple row in the market-overview dashboard into a full LST ecosystem diagnosis.

The page should not feel like a generic analytics page.
It should feel like a strategic evaluation surface.

---

## Core page structure

### 1. Network Header
The top section should include:
- Network name
- Native token
- Category
- Market cap
- % staked
- Staking APY
- DeFi TVL
- Global LST Health Score
- Opportunity Score
- LP Attractiveness label
- 1–2 line diagnosis summary

Example diagnosis:
“Monad shows strong validator decentralization and security posture, but the LST ecosystem remains constrained by shallow stablecoin exit depth and limited DeFi collateral integration.”

---

### 2. Seven Module Cards
The page must render seven module cards:

1. Liquidity & Exit
2. Peg Stability
3. DeFi Moneyness
4. Security & Governance
5. Validator Decentralization
6. Incentive Sustainability
7. Stress Resilience

Each module card should include:
- module name
- score
- short rationale
- 2–4 key metrics
- one key insight
- one risk or warning if relevant

The cards should be visually scannable and reusable.

---

### 3. Top Opportunities Panel
This section is critical.

It should rank the main ecosystem improvements that would most increase LP attractiveness or ecosystem maturity.

Each opportunity item should include:
- title
- impact label (Very High / High / Medium)
- linked module
- short why-it-matters explanation
- expected benefit

Examples:
- Deepen stablecoin exit liquidity
- Expand LST collateral usage in lending
- Improve redemption transparency
- Reduce incentive dependence

---

### 4. Red Flags Panel
This section highlights structural weaknesses.

Each red flag should be concise and action-oriented.

Examples:
- Stablecoin exit depth remains below institutional comfort
- LST utility is still too concentrated in LP pools
- Incentive support is still doing too much of the adoption work
- Stress scenario suggests USDC exit haircut can become significant

---

### 5. Stress Snapshot
The page should contain a compact stress view.

At minimum include:
- base token down scenario
- estimated LST discount under stress
- estimated exit haircut to USDC
- estimated redemption queue delay
- contagion risk label

This does not need to be a complex simulator in v1.
It can be rendered from mock structured data.

---

### 6. Supporting Mini-Visuals
Optional but useful:
- slippage curve
- peg deviation chart
- DeFi usage composition
- validator concentration snapshot

These visuals should support the diagnosis rather than dominate the page.

---

## Routing behavior
The network detail page should be reachable from the overview dashboard.

Expected behavior:
- clicking a row opens /network/[networkId]
- clicking a detail button also opens /network/[networkId]

The code should make it easy later to support deep links.

---

## UX priorities
A user should understand in under one minute:
- whether the network is healthy or fragile
- what its strongest and weakest modules are
- what the highest-priority opportunities are
- what the biggest LP-facing risks are

---

## Design direction
- premium dark theme
- strategic / analytical feel
- strong information hierarchy
- score-first layout
- card-based structure
- avoid clutter
- avoid giant dense tables on this page

---

## Product interpretation
The page should visually tell a story like:

“This network has strong technical or staking fundamentals, but its LST layer is still one or two structural upgrades away from becoming truly money-like and LP-friendly.”

---

## v1 constraints
- use mock data only
- support one mocked data file per network
- no live APIs yet
- no production simulation logic yet
- focus on polish, layout, and narrative clarity

---

## Implementation notes
The page should read data from a structured detail dataset, for example:

- data/network-details/monad.ts
- data/network-details/sei.ts
- data/network-details/sui.ts

Each detail file should include:
- summary
- module scores
- metrics
- opportunities
- red flags
- stress data
- optional mini-chart series
