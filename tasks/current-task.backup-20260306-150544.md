# Current Task

## Goal
Build the first interactive prototype of the LST Ecosystem Health Dashboard homepage.

## Context
This product evaluates opportunities to improve a PoS network, its liquid staking layer, and its DeFi stack under the thesis that liquid staking is the key monetary layer of the ecosystem.

The homepage should communicate:
- overall ecosystem health
- module-level strengths and weaknesses
- top red flags
- highest-leverage improvement opportunities

## Scope
Frontend prototype only.

Use mock data.
Do not wait for backend or production integrations.

## Must include
1. Global LST Health Score
2. LP Attractiveness label
3. Selected network control
4. Seven module cards:
   - Liquidity & Exit
   - Peg Stability
   - DeFi Moneyness
   - Security & Governance
   - Validator Decentralization
   - Incentive Sustainability
   - Stress Resilience
5. Opportunities panel
6. Red flags / alerts panel

## Nice to have
- slippage mini chart
- peg deviation mini chart
- DeFi usage composition card
- validator concentration mini chart
- stress scenario snapshot

## Constraints
- use mock data only
- prioritize UI quality and structure over backend integration
- keep components modular and reusable
- keep scoring schema externally configurable
- preserve dark modern design direction inspired by agents-beat

## Deliverable
A working frontend prototype with:
- reusable components
- realistic mock data
- strong visual hierarchy
- clear score-first narrative

## Acceptance criteria
A user should understand in under one minute:
- whether the ecosystem looks strong or weak
- which modules are weakest
- what the key red flags are
- what the top improvement opportunities are

## Suggested implementation order
1. app shell / page layout
2. hero summary section
3. module score cards
4. opportunities panel
5. alerts panel
6. optional supporting mini charts

## Notes
Do not overbuild.
The goal is a high-quality prototype that demonstrates the product narrative clearly.
