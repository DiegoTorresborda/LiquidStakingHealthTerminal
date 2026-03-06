# Current Task

## Goal
Build the first general market-overview dashboard for PoS networks focused on liquid staking opportunity discovery.

## Product name
LST Opportunity Radar

## Context
Before building the detailed per-network evaluation layer, we need a portfolio-level dashboard that compares multiple networks using basic staking, liquid staking, and DeFi indicators.

This dashboard should help identify which networks deserve deeper analysis.

## Scope
Frontend prototype only.
Use mock data only.

## Must include
1. Dashboard header and title
2. Summary KPI bar
3. Main networks table
4. Search input
5. Sorting
6. Basic filters
7. Color-coded Health Score
8. Color-coded Opportunity Score
9. Status tags
10. Structured mock dataset with 8–12 networks

## Main visible columns
- Network
- Native Token
- Market Cap
- % Staked
- Staking APY
- # Stakers
- Global LST Health Score
- # of LSTs
- LST / Staked %
- DeFi TVL
- Opportunity Score

## Secondary fields
- FDV
- Tokens in Circulation
- Circulating Supply %
- Staked Value USD
- Validator Count
- Largest LST
- Stablecoin Liquidity USD
- Lending Presence
- LST as Collateral
- Main Bottleneck
- Main Opportunity
- Status Tag

## Important product logic
There must be two distinct scores:
- Global LST Health Score
- Opportunity Score

These should not be merged.

## UX expectations
A user should understand in under one minute:
- which networks look strongest today
- which networks are underdeveloped but promising
- which networks deserve deeper evaluation next

## Constraints
- mock data only
- no backend integration
- no live APIs
- keep code modular
- prepare the architecture for later row-to-detail drill-down

## Deliverable
A polished dark-mode dashboard prototype with a market-overview table of networks and a clear prioritization narrative.
