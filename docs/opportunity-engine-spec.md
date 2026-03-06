# Opportunity Engine Spec

## Purpose
This document defines how the network detail page should present ecosystem improvement opportunities.

The objective is not only to describe current health, but to identify the highest-leverage interventions.

This is a product-critical layer because it turns the dashboard into a consulting and strategy tool.

---

## Core principle
The dashboard should not stop at:
- current score
- current weakness
- current risk

It should also answer:
- what to improve
- why that matters
- which improvement has highest expected impact

---

## Opportunity output format
Each opportunity should contain:

- id
- title
- impact
- linkedModule
- whyItMatters
- expectedBenefit

Optional:
- implementationDifficulty
- timeHorizon
- confidenceLabel

---

## Required impact labels
Use:
- Very High
- High
- Medium
- Low

---

## Example opportunities

### Opportunity 1
title: Deepen stablecoin exit liquidity
impact: Very High
linkedModule: Liquidity & Exit
whyItMatters: Serious LPs need a credible route from LST exposure to stablecoins without large haircut.
expectedBenefit: Improves exitability and raises confidence in larger allocations.

### Opportunity 2
title: Expand LST collateral integrations
impact: Very High
linkedModule: DeFi Moneyness
whyItMatters: The LST becomes structurally more valuable when it is money-like collateral, not only a staking wrapper.
expectedBenefit: Raises demand floor and increases DeFi utility.

### Opportunity 3
title: Improve redemption transparency
impact: Medium
linkedModule: Peg Stability
whyItMatters: Better queue and redemption visibility improves peg confidence and risk perception.
expectedBenefit: Reduces uncertainty during stress.

---

## Ranking logic for v1
For now, opportunities can be mocked and manually ranked.

Codex should present them in descending priority order.

The UI should clearly distinguish:
- highest-impact opportunity
- supporting opportunities
- secondary optimization ideas

---

## UI requirements
The opportunities panel should:
- be highly visible on the detail page
- show 3–5 ranked items
- use concise language
- emphasize action and expected effect
- visually connect each opportunity to the relevant module

Recommended fields to show in UI:
- title
- impact badge
- linked module
- one-line rationale
- one-line benefit

---

## Product interpretation
The opportunities panel should let a user infer something like:

“The ecosystem is not blocked by staking demand. It is blocked by weak exit liquidity and insufficient DeFi moneyness.”

That is the kind of strategic diagnosis the product should produce.

---

## Future direction
Later, opportunities may be derived automatically from:
- module score weakness
- threshold breaches
- data quality checks
- LST penetration gaps
- liquidity fragility
- missing DeFi integrations

For v1, keep the structure compatible with future automation.
