# LST Health Scoring Model (v1)

## Purpose

This document defines the **Global LST Health Score** used by the dashboard.

The score evaluates the health of a network's Liquid Staking ecosystem from the perspective of a **Liquidity Provider (LP)**.

The key question is:

> How viable is it for a liquidity provider to hold, use, and exit exposure to this LST ecosystem?

This scoring model prioritizes **exitability and liquidity quality**, not speculative upside.

---

# Model Philosophy

A strong Liquid Staking ecosystem must satisfy three conditions:

1. **Exitability**  
LPs must be able to unwind exposure with limited slippage.

2. **Moneyness**  
The LST must function as a usable financial asset inside DeFi.

3. **Credibility**  
The protocol must be operationally trustworthy.

These three dimensions form the pillars of the scoring system.

---

# Scoring Architecture

Modules -> Pillars -> Global Score

There are:

7 Modules  
3 Pillars  
1 Global Score

---

# Pillars

## Exitability

Measures the ability to exit LST exposure safely.

Exitability =  
0.50 x Liquidity & Exit  
+ 0.30 x Peg Stability  
+ 0.20 x Stress Resilience  

---

## Moneyness

Measures whether the LST behaves as a financial asset.

Moneyness =  
DeFi Moneyness

---

## Credibility

Measures governance and operational trustworthiness.

Credibility =  
0.40 x Security & Governance  
+ 0.30 x Validator Decentralization  
+ 0.30 x Incentive Sustainability  

---

# Global LST Health Score

Global LST Health Score =  
0.45 x Exitability  
+ 0.30 x Moneyness  
+ 0.25 x Credibility  

Score range:

0 - 100

---

# Score Interpretation

85-100 -> Institutional Grade  
70-84 -> Strong  
55-69 -> Usable but Constrained  
40-54 -> Fragile  
<40 -> Unhealthy

---

# Modules

The scoring engine calculates seven modules.

1. Liquidity & Exit  
2. Peg Stability  
3. Stress Resilience  
4. DeFi Moneyness  
5. Security & Governance  
6. Validator Decentralization  
7. Incentive Sustainability  

Each module produces a score between **0 and 100**.

---

# Module 1 - Liquidity & Exit

### Purpose

Measures the credibility of exiting LST exposure.

### Formula

Liquidity & Exit =  
0.30 x LST Market Depth  
+ 0.20 x Base Exit Quality  
+ 0.25 x Stable Exit Quality  
+ 0.15 x Redemption Anchor  
+ 0.10 x Liquidity Durability  

---

## LST Market Depth

LST Market Depth =  
0.35 x Pool Depth  
+ 0.30 x Slippage Quality  
+ 0.20 x Volume Quality  
+ 0.15 x LP Diversification  

---

## Base Exit Quality

Base Exit Quality =  
0.50 x LST/Base Slippage  
+ 0.30 x LST/Base Depth  
+ 0.20 x Route Redundancy  

---

## Stable Exit Quality

Stable Exit Quality =  
0.35 x Base/Stable Depth  
+ 0.35 x Exit Slippage  
+ 0.20 x Stablecoin Quality  
+ 0.10 x Route Redundancy  

---

## Redemption Anchor

Redemption Anchor =  
0.35 x Redemption Availability  
+ 0.25 x Queue Transparency  
+ 0.20 x Redemption Friction  
+ 0.20 x Arbitrage Viability  

---

## Liquidity Durability

Liquidity Durability =  
0.40 x Incentive Dependence  
+ 0.30 x TVL Persistence  
+ 0.20 x Organic Volume Quality  
+ 0.10 x LP Stability  

---

### Hard Rules

If stablecoin exit does not exist:

Liquidity & Exit cap = 55

If redeem path does not exist:

Liquidity & Exit cap = 60

Extreme LP concentration may trigger:

Penalty = -5 to -10

---

# Module 2 - Peg Stability

### Purpose

Measures how closely the LST price tracks its underlying value.

### Formula

Peg Stability =  
0.35 x Discount Level  
+ 0.25 x Discount Volatility  
+ 0.20 x Arbitrage Efficiency  
+ 0.20 x Peg Recovery  

---

## Arbitrage Efficiency

Arbitrage Efficiency =  
0.40 x Redemption Availability  
+ 0.30 x Redemption Friction  
+ 0.30 x Arbitrage Capacity  

---

### Hard Rules

If redeem path does not exist:

Peg Stability cap = 55

Persistent large discount:

Peg Stability cap = 45

Extreme volatility may trigger:

Penalty = -5 to -10

---

# Module 3 - Stress Resilience

### Purpose

Measures ecosystem stability during extreme conditions.

### Formula

Stress Resilience =  
0.30 x Liquidity Shock Resistance  
+ 0.25 x Redemption Capacity  
+ 0.25 x Stable Exit Capacity  
+ 0.20 x DeFi Contagion Risk  

---

## Liquidity Shock Resistance

Liquidity Shock Resistance =  
0.40 x LP Diversification  
+ 0.35 x Pool Depth  
+ 0.25 x Venue Diversity  

---

## Redemption Capacity

Redemption Capacity =  
0.40 x Queue Throughput  
+ 0.30 x Redemption Transparency  
+ 0.30 x Unbonding Duration  

---

## Stable Exit Capacity

Stable Exit Capacity =  
0.40 x Base/Stable Depth  
+ 0.30 x Exit Slippage  
+ 0.20 x Stablecoin Diversity  
+ 0.10 x Stablecoin Quality  

---

## DeFi Contagion Risk

DeFi Contagion Risk =  
0.40 x Lending Risk Design  
+ 0.30 x Oracle Robustness  
+ 0.30 x Leverage Exposure  

---

### Hard Rules

If redemption unavailable:

Stress Resilience cap = 50

---

# Module 4 - DeFi Moneyness

### Purpose

Measures whether the LST functions as a money-like asset.

### Formula

DeFi Moneyness =  
0.40 x Collateral Utility  
+ 0.25 x DeFi Integration Breadth  
+ 0.20 x Usage Depth  
+ 0.15 x Demand Quality  

---

### Hard Rules

If LST not used as collateral:

DeFi Moneyness cap = 55

---

# Module 5 - Security & Governance

### Purpose

Measures security posture and governance maturity.

### Formula

Security & Governance =  
0.30 x Audit Posture  
+ 0.30 x Admin Control Quality  
+ 0.20 x Upgrade Safety  
+ 0.20 x Operational Transparency  

---

### Hard Rules

No audits:

Security & Governance cap = 50

No timelock upgrades:

Security & Governance cap = 55

---

# Module 6 - Validator Decentralization

### Purpose

Measures validator diversification.

### Formula

Validator Decentralization =  
0.35 x Delegation Distribution  
+ 0.25 x Validator Set Breadth  
+ 0.20 x Operator Quality  
+ 0.20 x Slashing Risk Management  

---

### Hard Rules

Extreme validator concentration:

Validator Decentralization cap = 55

---

# Module 7 - Incentive Sustainability

### Purpose

Measures ecosystem durability when incentives decline.

### Formula

Incentive Sustainability =  
0.35 x Yield Quality  
+ 0.30 x Liquidity Durability  
+ 0.20 x Usage Persistence  
+ 0.15 x Revenue Support  

---

### Hard Rules

If emissions dominate ecosystem attractiveness:

Incentive Sustainability cap = 55

---

# Global Hard Rules

After computing the global score:

If Exitability < 50:

Global Score cap = 60

If Peg Stability < 45:

Global Score cap = 55

If Security & Governance < 50:

Global Score cap = 60

---

# Engine Requirements

The scoring engine must expose:

- raw module scores  
- pillar scores  
- penalties applied  
- caps applied  
- final capped score  

---

# Dashboard Requirements

The network page must display:

- Global LST Health Score  
- Exitability  
- Moneyness  
- Credibility  
- all module scores  
- triggered warnings and caps  

---

# Version

Model Version: v1  
Approach: LP-centric  
Data: mock data only
