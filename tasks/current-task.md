# Current Task

## Goal
Implement the full drill-down flow from the LST Opportunity Radar dashboard into per-network diagnostic pages.

## Scope
Frontend prototype only.
Use mock data only.

## User flow
1. User lands on the LST Opportunity Radar dashboard
2. User reviews the list of networks
3. User clicks a network row
4. User is taken to /network/[networkId]
5. User sees a full LST ecosystem diagnostic page for that network

## Must implement

### A. Routing
- Add clickable behavior from the overview dashboard table to a network detail route
- Use routes like /network/[networkId]

### B. Detail page layout
For each network detail page, render:
- header summary
- Global LST Health Score
- Opportunity Score
- LP Attractiveness label
- short diagnosis sentence
- 7 module cards
- Top Opportunities panel
- Red Flags panel
- Stress Snapshot panel

### C. Data architecture
Use structured mock detail data per network.

Suggested file structure:
- data/network-details/monad.ts
- data/network-details/sei.ts
- data/network-details/sui.ts
- data/network-details/berachain.ts

At minimum, fully implement:
- Monad
- Sei
- Berachain

Optional:
- Sui
- Aptos
- Mantra

### D. Reusable components
Create reusable components for:
- Network detail header
- Module score card
- Opportunity item
- Red flag list
- Stress snapshot
- Optional mini-chart card

## Required page content

### Header
Include:
- network name
- token
- category
- market cap
- % staked
- staking APY
- DeFi TVL
- Health Score
- Opportunity Score
- LP Attractiveness
- 1–2 line diagnosis

### Module cards
Must render:
1. Liquidity & Exit
2. Peg Stability
3. DeFi Moneyness
4. Security & Governance
5. Validator Decentralization
6. Incentive Sustainability
7. Stress Resilience

### Opportunities panel
Must show ranked ecosystem improvement opportunities.

### Red flags panel
Must show concise structural warnings.

### Stress snapshot
Must show:
- scenario
- estimated LST discount
- exit haircut to USDC
- redeem queue delay
- contagion risk label

## Constraints
- mock data only
- no backend
- no live API integration
- no overbuilt charts
- prioritize design quality and information hierarchy

## Acceptance criteria
A user should be able to:
- click from the radar to a detail page
- understand the network’s strongest and weakest dimensions
- identify the top 3 opportunities
- identify the main LP-facing risks
- understand the stress summary in under one minute

## Design expectations
- premium dark-mode UI
- strong hierarchy
- card-based layout
- clear score visualization
- concise but high-signal text
- polished enough to demonstrate the full product flow
