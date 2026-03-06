# AGENTS.md

## Project
Build an **LST Ecosystem Health Dashboard** for PoS networks.

## Objective
Evaluate opportunities to improve an L1, its liquid staking layer, and its DeFi stack under the thesis that **liquid staking is the key monetary layer of the ecosystem**.

This product should help identify:
- why a network is or is not attractive for liquidity providers
- where the main bottlenecks are
- what concrete improvements can increase LP attractiveness, LST adoption, and DeFi utility

## Core users
- L1 foundations
- DeFi ecosystem teams
- Liquidity providers
- Protofire internal strategy / advisory team

## Product thesis
A liquidity provider is not simply buying staking yield.

A liquidity provider is buying a combination of:
1. Carry (staking yield net of fees)
2. Moneyness / utility (ability to use the LST across DeFi)
3. Liquidity and exitability (ability to exit without major haircut)
4. Controlled risk (smart contracts, governance, slashing, liquidity stress)

If exitability is weak, high APR alone is not enough.

The dashboard must evaluate the ecosystem from this perspective.

## Product principles
- Score-first UX
- Highlight bottlenecks, not only metrics
- Every metric should map to an actionable improvement
- Focus on LP attractiveness, exitability, and DeFi moneyness
- Prefer clarity over dashboard clutter
- Expose uncertainty and missing data clearly
- Avoid generic “crypto analytics dashboard” patterns that show too many disconnected metrics

## Mandatory reading before work
Before making architectural, product, or UI decisions, read in this order:
1. /docs/product-brief.md
2. /docs/scoring-framework.md
3. /docs/ui-reference.md
4. /tasks/current-task.md

## Decision priority
If instructions conflict, use this priority:
1. /tasks/current-task.md
2. /docs/product-brief.md
3. /docs/scoring-framework.md
4. /docs/ui-reference.md
5. /AGENTS.md

## Expected product behavior
The dashboard should:
- produce a global LST ecosystem score
- show module-level scores
- explain why each score is high or low
- identify concrete opportunities for ecosystem improvement
- surface red flags and structural weaknesses
- support comparisons across networks over time

The dashboard is not just descriptive analytics.
It is a strategic decision tool for:
- advisory
- ecosystem design
- DeFi/LST product planning
- commercial opportunity discovery

## Core modules
The system should be organized around these seven analytical modules:
1. Liquidity & Exit
2. Peg Stability
3. DeFi Moneyness
4. Security & Governance
5. Validator Decentralization
6. Incentive Sustainability
7. Stress Resilience

## Tech assumptions
- Frontend: Next.js
- UI: Tailwind CSS
- Component model: modular and reusable
- Charts: Recharts
- Backend/data layer: Python + Postgres
- Scoring engine: configurable and modular
- Data sources: external APIs, subgraphs, indexers, manual overrides

## Guardrails
- Do not invent data sources silently
- If data is missing, surface it explicitly in the UI
- Do not reduce the product to one opaque score without drill-down
- Keep the scoring framework configurable
- Keep components reusable across multiple L1s
- Do not hardcode a single network assumption into the architecture
- Distinguish between observed metrics, inferred metrics, and simulated outputs
- Avoid overclaiming precision when data quality is weak

## UX guardrails
- The homepage should tell a story in seconds
- The most important thing is not the amount of data, but the clarity of diagnosis
- Users should quickly understand:
  - how healthy the ecosystem is
  - why
  - what to improve first
- Use visual hierarchy aggressively
- Prioritize scorecards, flags, opportunities, and scenario outputs over raw tables

## Analytical guardrails
Each module should ideally contain:
- score
- metric breakdown
- red flags
- strengths
- suggested actions

Each suggested action should ideally connect to a product or strategy angle, such as:
- improve LST liquidity
- add redemption path
- deepen stablecoin liquidity
- integrate LST into lending
- reduce admin risk
- diversify validator delegation
- redesign incentives
- improve risk controls

## Expected implementation style
When building features:
- start with the product narrative first
- then define the data requirements
- then define scoring logic
- then define the UI

Avoid building isolated widgets with no role in the decision flow.

## Output style for agents
When proposing features or changes:
- explain the product rationale
- identify which module it belongs to
- state whether data is real, mocked, inferred, or simulated
- prefer implementation that can scale to additional L1s
