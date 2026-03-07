# Scoring Framework

## Overview
This document defines the analytical structure of the LST Ecosystem Health Dashboard.

The framework is based on the idea that the attractiveness of a network’s liquid staking layer must be evaluated through the lens of a liquidity provider.

The dashboard should score seven modules:
1. Liquidity & Exit
2. Peg Stability
3. DeFi Moneyness
4. Security & Governance
5. Validator Decentralization
6. Incentive Sustainability
7. Stress Resilience

Each module should include:
- why it matters
- key metrics
- red flags
- sample improvement actions

Scoring logic should remain configurable.

---

## Implementation note

This document defines the conceptual framework of the dashboard and the analytical meaning of each module.

The official v1 implementation logic for Health Score is defined in:
- /docs/scoring-engine-spec.md

If there is any conflict between this framework and the scoring engine spec, the scoring engine spec takes precedence.


## 1. Liquidity & Exit

### Why it matters
This is the most important module.

A liquidity provider needs a credible path to exit.
Without real exitability, high yield is not enough.

The dashboard should evaluate whether the LST has:
- real liquidity
- sustainable market depth
- diversified LP base
- a credible route to stablecoin exit

### What to evaluate
- LST pool TVL
- LST pool 24h volume
- slippage at relevant trade sizes
- LP concentration
- route from LST to base token
- route from base token to USDC
- quality of stablecoin liquidity
- native vs bridged stablecoin exposure

### Example metrics
- TVL in main LST pools
- 24h / 7d volume
- slippage at $10k / $100k / $1M
- share of top LP wallets
- depth of base token / USDC pool
- stablecoin liquidity share in ecosystem

### Red flags
- liquidity exists only because of short-term incentives
- one or two wallets dominate LP depth
- no credible stablecoin exit route
- base token / USDC liquidity is weak
- “exit path” depends entirely on an illiquid AMM

### Example improvement actions
- deepen base token / stablecoin liquidity
- improve LST pool depth
- diversify LP base
- attract market makers
- build stablecoin routing and execution strategy

---

## 2. Peg Stability

### Why it matters
If the LST cannot maintain a credible relationship to its underlying value, it becomes much harder for LPs and DeFi protocols to trust it.

Peg stability is not only about market price.
It is about whether redemption and arbitrage mechanisms create a believable anchor.

### What to evaluate
- LST price relative to NAV
- average discount/premium
- peg volatility
- redemption path
- redemption queue visibility
- unbonding duration
- arbitrage feasibility

### Example metrics
- LST price / NAV ratio
- historical discount range
- discount volatility
- average time to redeem
- maximum known queue delay
- redemption capacity visibility

### Red flags
- no redemption path
- the only exit path is via AMM
- large and persistent discount
- redemption process is opaque
- queue behavior is unclear under stress

### Example improvement actions
- introduce or improve redemption path
- improve transparency of queues and unbonding
- reduce redemption friction
- improve arbitrage conditions
- communicate peg mechanics more clearly

---

## 3. DeFi Moneyness

### Why it matters
The LST becomes much more valuable when it is not only a yield token, but a money-like base asset inside the ecosystem.

This is where convexity appears:
the LST becomes collateral, margin, vault input, and a composable DeFi primitive.

### What to evaluate
- lending market integration
- collateral acceptance
- LTV levels
- collateral caps
- actual utilization
- integration into vaults and strategies
- potential cross-protocol usage

### Example metrics
- number of lending venues supporting LST
- collateral enabled / not enabled
- collateral cap size
- LTV
- borrow demand and utilization
- TVL in vaults using the LST
- presence in structured products or margin systems

### Red flags
- integrations exist but caps are symbolic
- collateral usage is negligible
- usage is entirely subsidized
- LST is mostly idle outside the staking wrapper

### Example improvement actions
- list the LST as collateral
- expand collateral caps
- improve oracle infrastructure
- enable vault and strategy integrations
- add more blue-chip DeFi integrations

---

## 4. Security & Governance

### Why it matters
For serious capital, the product must feel structurally safe.

Even good liquidity and good DeFi utility can be outweighed by poor governance controls, excessive admin power, or weak security posture.

### What to evaluate
- audit coverage
- bug bounty existence and seriousness
- admin roles and powers
- multisig structure
- timelock usage
- upgradeability model
- transparency around emergency powers

### Example metrics
- number of audits
- quality/reputation of auditors
- bug bounty available yes/no
- timelock yes/no
- multisig signer transparency
- upgradeable yes/no
- documented admin powers yes/no

### Red flags
- no timelock
- opaque signers
- admin can arbitrarily change critical parameters
- no documented emergency process
- no serious security posture despite meaningful TVL

### Example improvement actions
- add timelock
- improve signer transparency
- reduce admin powers
- publish governance controls
- commission audits
- launch bug bounty

---

## 5. Validator Decentralization

### Why it matters
A weak validator/delegation structure increases operational risk and slashing correlation.

This affects both the true safety of the LST and the confidence that LPs can place in it.

### What to evaluate
- number of validators receiving delegation
- delegation concentration
- top validator share
- validator performance
- uptime
- slashing history
- selection policy transparency

### Example metrics
- validator count
- top 5 validator delegation share
- average uptime
- slashing incidents
- share delegated to independent operators
- concentration index

### Red flags
- strong concentration in a few validators
- opaque validator selection policy
- poor uptime profile
- correlated slashing risk
- weak diversification

### Example improvement actions
- diversify validator set
- formalize delegation criteria
- improve monitoring
- reduce top-validator concentration
- add clearer validator policy disclosure

---

## 6. Incentive Sustainability

### Why it matters
Short-term incentives can create misleading signals.
The dashboard should distinguish between durable adoption and temporary mercenary capital.

### What to evaluate
- how much of yield comes from emissions
- how much comes from organic revenue or usage
- how TVL behaves when incentives decline
- whether liquidity persists after rewards fade

### Example metrics
- real yield vs emissions yield
- emissions share of total yield
- TVL stability after incentive reductions
- volume stability after incentive changes
- protocol fee contribution

### Red flags
- most demand disappears when incentives end
- emissions represent the overwhelming share of returns
- ecosystem activity collapses without farming rewards
- LP depth is fragile and mercenary

### Example improvement actions
- reduce dependence on emissions
- improve fee-based usage
- redesign incentives to target durable behavior
- increase real utility before increasing emissions
- improve incentive efficiency

---

## 7. Stress Resilience

### Why it matters
The ecosystem should be tested not only in normal conditions but under stress.

An LP wants to know:
- what breaks first
- how bad the haircut could get
- where contagion might come from

### What to evaluate
- price shock sensitivity
- liquidity evaporation risk
- queue congestion
- stablecoin exit stress
- cross-protocol contagion risk
- oracle and liquidation vulnerabilities

### Example scenarios
#### Scenario A: Base token drops 40% in 24h
Evaluate:
- likely LST discount widening
- liquidity deterioration
- potential redemption pressure

#### Scenario B: Run to stables
Evaluate:
- stablecoin exit route
- haircut to reach USDC
- whether USDC liquidity is real and deep
- bridge/native stablecoin risk

#### Scenario C: Contract or protocol incident
Evaluate:
- contagion through lending integrations
- oracle risk
- liquidation cascade risk
- emergency governance response quality

### Example outputs
- estimated exit haircut
- estimated peg deviation under stress
- redemption queue stress indicator
- contagion risk label

### Red flags
- stress creates permanent or near-permanent discount
- stablecoin exit route breaks down quickly
- DeFi integrations amplify fragility
- governance cannot respond safely
- oracles / liquidation systems are weak

### Example improvement actions
- strengthen stablecoin routes
- improve queue transparency
- improve lending risk controls
- reduce integration contagion risk
- add more conservative collateral parameters

---

## Suggested score interpretation
This is only a placeholder for v1 and should remain configurable.

- 85–100: Institutional grade
- 70–84: Strong
- 55–69: Usable but constrained
- 40–54: Fragile
- Below 40: Avoid / redesign needed

---

## Suggested v1 weighting
These weights are provisional and should remain configurable.

- Liquidity & Exit: 25%
- Peg Stability: 15%
- DeFi Moneyness: 15%
- Security & Governance: 15%
- Validator Decentralization: 10%
- Incentive Sustainability: 10%
- Stress Resilience: 10%

Reasoning:
Liquidity & Exit deserves the highest weight because it is the key gating condition for serious LP participation.

---

## Scoring design guidance
- Prefer transparent heuristics over false precision
- Show score explanation wherever possible
- Distinguish raw metrics from derived scores
- Handle missing data explicitly
- Allow human overrides later if needed
