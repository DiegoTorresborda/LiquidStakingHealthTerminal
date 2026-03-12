# AGENTS.md

## Project
Build an **LST Ecosystem Intelligence Platform** for PoS networks.

## Product layers
The product has two connected layers:

### 1. LST Opportunity Radar
A market-overview dashboard for comparing PoS networks using high-level staking, liquid staking, and DeFi indicators.

Purpose:
- scan the market
- compare networks
- prioritize where to go deeper
- identify promising targets for liquid staking ecosystem development

### 2. Network Detail Diagnosis
A per-network diagnostic page that evaluates the health of the network’s LST ecosystem and identifies the most important improvement opportunities.

Purpose:
- explain current ecosystem health
- surface bottlenecks and risks
- identify the highest-impact interventions

### 3. Admin Data Control Panel
An internal admin layer for managing the data powering the dashboard.

Purpose:
- trigger API source refresh
- edit manual curated data
- manage chain resources
- apply overrides
- rebuild generated datasets

This layer exists to make the dashboard maintainable without editing code directly.

## Core objective
Evaluate opportunities to improve an L1, its liquid staking layer, and its DeFi stack under the thesis that **liquid staking is the key monetary layer of the ecosystem**.

The product should help answer:
- which networks are most interesting to evaluate
- how healthy each LST ecosystem is today
- what the main LP-facing risks are
- what improvements would make the biggest difference

## Core users
- L1 foundations
- DeFi ecosystem teams
- Liquidity providers
- Protofire internal strategy / advisory team

## Product thesis
A liquidity provider is not simply buying staking yield.

A liquidity provider is buying a combination of:
1. Carry
2. Moneyness / utility
3. Liquidity and exitability
4. Controlled risk

If exitability is weak, high APR alone is not enough.

## Core product logic
There are two distinct scores in the system:

### Global LST Health Score
Represents the current health and investability of the network’s LST ecosystem.

### Opportunity Score
Represents how attractive the network is as a target for ecosystem improvement, product intervention, or strategic development.

These two scores must remain distinct.
Do not merge them conceptually or visually.

## Product flow
The intended user flow is:

1. User lands on the LST Opportunity Radar dashboard
2. User compares networks across high-level indicators
3. User clicks a network
4. User opens /network/[networkId]
5. User sees a full diagnostic page:
   - summary
   - Health Score
   - Opportunity Score
   - 7 module cards
   - Top Opportunities
   - Red Flags
   - Stress Snapshot

## Seven diagnostic modules
1. Liquidity & Exit
2. Peg Stability
3. DeFi Moneyness
4. Security & Governance
5. Validator Decentralization
6. Incentive Sustainability
7. Stress Resilience

## Product principles
- Score-first UX
- Highlight bottlenecks, not only metrics
- Every metric should map to an actionable improvement
- Focus on LP attractiveness, exitability, and DeFi moneyness
- Prefer clarity over dashboard clutter
- Expose uncertainty and missing data clearly

## Data architecture principles
- keep overview data separate from detail data
- keep raw API snapshots separate from normalized generated datasets
- keep manual curated data external and structured
- keep overrides external and explicit
- use reusable schemas
- support future row-to-detail drill-down
- make it easy to replace mock data with real data sources later
- preserve data provenance, confidence, and source quality where possible

## Mandatory reading before work
Before making architectural, product, or UI decisions, read in this order:
1. /docs/product-brief.md
2. /docs/scoring-framework.md
3. /docs/ui-reference.md
4. /tasks/current-task.md

Also read, when relevant:
- /docs/sample-network-universe.md
- /docs/network-detail-spec.md
- /docs/opportunity-engine-spec.md
- /docs/scoring-engine-spec.md or /docs/lst-health-scoring.md
- /docs/chain-resources-spec.md
- /docs/admin-feature-spec.md
- /docs/data-update-architecture.md

## Decision priority
If instructions conflict, use this priority:
1. /tasks/current-task.md
2. /docs/lst-health-scoring.md or /docs/scoring-engine-spec.md
3. /docs/admin-feature-spec.md
4. /docs/data-update-architecture.md
5. /docs/chain-resources-spec.md
6. /docs/network-detail-spec.md
7. /docs/opportunity-engine-spec.md
8. /docs/product-brief.md
9. /docs/scoring-framework.md
10. /docs/ui-reference.md
11. /AGENTS.md

## Tech assumptions
- Frontend: Next.js
- UI: Tailwind CSS
- Charts: Recharts
- Data: external structured files for now
- Backend/data integration later

## Guardrails
- Do not invent data sources silently
- If data is missing, surface it explicitly in the UI
- Do not reduce the product to one opaque score without drill-down
- Keep the scoring framework configurable
- Keep components reusable across multiple L1s
- Do not hardcode a single network assumption into the architecture
- Distinguish between observed metrics, inferred metrics, and simulated outputs
- Avoid overclaiming precision when data quality is weak
- Do not turn the product into a generic KPI dashboard

## UX guardrails
- The homepage should tell a story quickly
- The network detail page should explain why the network is strong or weak
- Do not write directly into generated datasets from admin UI flows
- Admin actions must update source layers (API snapshots, manual data, overrides) and then rebuild generated datasets
- Keep curated registries such as chain resources external to the UI
- Users should quickly understand:
  - how healthy the ecosystem is
  - what the biggest risks are
  - what to improve first

## Expected implementation style
When building features:
- start from product narrative
- then define data requirements
- then define scoring logic
- then define UI

Avoid isolated widgets with no role in the decision flow.

## Scoring document priority

For conceptual module definitions, read:
- /docs/scoring-framework.md

For the actual v1 Health Score implementation, use:
- /docs/scoring-engine-spec.md

If these conflict, /docs/scoring-engine-spec.md is the source of truth for scoring formulas, weights, penalties, caps, and implementation logic.
