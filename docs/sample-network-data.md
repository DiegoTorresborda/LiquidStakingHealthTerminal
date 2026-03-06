# Sample Network Data

## Purpose
This file defines a mocked network profile for the dashboard prototype.

It is based loosely on Monad as the reference ecosystem, but most analytical values in this file are intentionally synthetic and should be treated as mock data for product design and UI development.

## Reality vs mock
### Real reference facts
These are real ecosystem anchors used to ground the mock:
- Network name: Monad
- Native token: MON
- Chain type: EVM-compatible Layer 1
- Mainnet chain ID: 143

### Mock assumptions
Everything below related to:
- LST adoption
- liquidity depth
- DeFi integrations
- validator concentration
- stress resilience
- ecosystem score
- opportunities
- alerts

is mocked for prototype purposes.

---

## Network identity
- networkId: monad
- networkName: Monad
- displayName: Monad Mainnet
- nativeToken: MON
- chainType: EVM L1
- chainId: 143
- status: active
- selectedLST: stMON
- selectedLSTDisplayName: Staked MON
- dashboardMode: LP Perspective

---

## Product narrative
Monad is modeled here as a high-performance EVM L1 with strong long-term potential for liquid staking to become the monetary base of the ecosystem.

In this mock scenario:
- the network is technically attractive
- the staking base is promising
- the validator layer is reasonably healthy
- but LST liquidity, stablecoin exit depth, and DeFi collateral utility are still not mature enough for large LP allocation

This creates a strong “improvement opportunity” profile.

---

## Global summary
- globalScore: 71
- lpAttractiveness: Medium
- institutionalReadiness: Emerging
- shortDiagnosis: Strong L1 foundation and promising staking base, but limited stablecoin exit depth and insufficient DeFi moneyness keep the LST ecosystem below institutional grade.

### Summary badges
- Strong technical base
- Good validator breadth
- Weak stablecoin exit
- DeFi utility underdeveloped

---

## Module scores

### 1. Liquidity & Exit
- score: 62
- status: Constrained
- rationale: Primary LST liquidity exists, but exit to stablecoins is still too shallow for larger LP allocations.
- keyMetrics:
  - lstPoolTVLUsd: 18500000
  - lstPoolVolume24hUsd: 2100000
  - slippage100kBps: 65
  - slippage500kBps: 240
  - topLPSharePct: 48
  - baseTokenUsdcDepthUsd: 9400000
  - nativeStablecoinQuality: Medium
- keyInsight: The real bottleneck is not the LST/MON pool alone, but the MON-to-USDC conversion route.
- redFlag: Exit to USDC becomes materially inefficient at larger sizes.

### 2. Peg Stability
- score: 74
- status: Healthy
- rationale: The LST trades close to implied value most of the time, but peg robustness is still partly dependent on secondary liquidity.
- keyMetrics:
  - avgDiscount30dPct: -0.35
  - maxDiscount30dPct: -1.9
  - discountVolatilityLabel: Moderate
  - redemptionPathAvailable: true
  - estimatedRedemptionTimeDays: 4
  - queueTransparency: Medium
- keyInsight: Peg behavior is acceptable in normal conditions, but stress behavior remains only partially validated.
- redFlag: Redemption and queue behavior are not yet strong enough to fully anchor institutional confidence.

### 3. DeFi Moneyness
- score: 58
- status: Weak
- rationale: The LST exists, but it is not yet deeply embedded as collateral or base money across DeFi.
- keyMetrics:
  - lendingIntegrationsCount: 1
  - collateralEnabledProtocols: 1
  - avgLTVPct: 52
  - collateralCapsUsd: 5000000
  - vaultIntegrationsCount: 1
  - defiUsageBreakdown:
      lendingPct: 34
      lpPoolsPct: 46
      vaultsPct: 8
      idlePct: 12
- keyInsight: The LST has yield utility, but not yet broad money-like utility.
- redFlag: Collateral acceptance exists, but caps are still too small to drive strong structural demand.

### 4. Security & Governance
- score: 76
- status: Strong
- rationale: The product stack is modeled as reasonably mature from a governance and contract-risk perspective, though not yet best-in-class.
- keyMetrics:
  - auditsCount: 2
  - bugBounty: true
  - timelock: true
  - multisigTransparency: High
  - adminRisk: Medium-Low
  - upgradeability: Controlled
- keyInsight: Security posture is supportive of growth, but further hardening would improve institutional credibility.
- redFlag: Upgrade controls are acceptable, but still not at the most conservative benchmark.

### 5. Validator Decentralization
- score: 81
- status: Strong
- rationale: Delegation is reasonably diversified, with acceptable concentration and a credible validator base.
- keyMetrics:
  - activeValidators: 132
  - top5ValidatorSharePct: 29
  - top10ValidatorSharePct: 44
  - avgValidatorUptimePct: 98.7
  - slashingHistoryLabel: Low
  - delegationPolicyTransparency: High
- keyInsight: This is one of the ecosystem’s strongest pillars.
- redFlag: Concentration is not alarming, but still worth monitoring as TVL scales.

### 6. Incentive Sustainability
- score: 64
- status: Mixed
- rationale: Current adoption is supported by incentives more than ideal, though there are early signs of organic demand.
- keyMetrics:
  - realYieldPct: 3.4
  - emissionsYieldPct: 4.9
  - emissionsSharePct: 59
  - tvlDecayAfterIncentiveReductionPct: 18
  - feeBasedDemandLabel: Emerging
- keyInsight: Incentives are still a bridge, not yet fully a booster on top of organic usage.
- redFlag: A large part of current attractiveness still depends on rewards rather than deep utility.

### 7. Stress Resilience
- score: 66
- status: Watchlist
- rationale: The ecosystem appears resilient under moderate stress, but stablecoin exit and collateral contagion remain key areas of vulnerability.
- keyMetrics:
  - stressScenarioBaseDropPct: -40
  - estimatedLstDiscountUnderStressPct: -4.8
  - estimatedExitHaircutToUsdcPct: 7.2
  - estimatedRedeemQueueDays: 8
  - contagionRiskLabel: Medium
- keyInsight: The ecosystem likely bends before it breaks, but larger LP exits would still face meaningful friction.
- redFlag: Stablecoin flight remains the clearest stress vulnerability.

---

## Opportunity rankings
These should feed the “Top Opportunities” panel in the UI.

### Opportunity 1
- title: Deepen MON-to-USDC exit liquidity
- impact: Very High
- module: Liquidity & Exit
- whyItMatters: This is the primary gating factor for serious LP deployment and clean stablecoin exits.
- expectedBenefit: Improves LP confidence, lowers haircut risk, and raises the practical capacity of the LST ecosystem.

### Opportunity 2
- title: Expand LST collateral usage in lending
- impact: Very High
- module: DeFi Moneyness
- whyItMatters: The LST needs stronger money-like utility, not just staking yield.
- expectedBenefit: Increases structural demand floor and improves capital efficiency.

### Opportunity 3
- title: Reduce incentive dependence
- impact: High
- module: Incentive Sustainability
- whyItMatters: Durable TVL should come increasingly from utility and fees rather than emissions.
- expectedBenefit: Makes liquidity more trustworthy and improves long-term ecosystem quality.

### Opportunity 4
- title: Improve redemption transparency and queue visibility
- impact: Medium
- module: Peg Stability
- whyItMatters: Better visibility improves peg confidence and institutional comfort.
- expectedBenefit: Strengthens trust in stress conditions and reduces perceived exit uncertainty.

### Opportunity 5
- title: Add a second major DeFi venue using the LST as collateral
- impact: High
- module: DeFi Moneyness
- whyItMatters: One integration is not enough to make the LST feel systemically relevant.
- expectedBenefit: Improves composability and broadens demand.

---

## Red flags
These should feed the “Alerts / Red Flags” panel.

- Stablecoin exit depth remains below institutional comfort.
- LST utility is still too concentrated in basic LP usage.
- Incentive support is still doing too much of the adoption work.
- Stress scenario suggests USDC exit haircut can become significant.
- Collateral caps remain too small to create a strong demand floor.

---

## Suggested hero text
Use something like this in the dashboard hero:

“Monad shows strong L1 fundamentals and a promising validator base, but its LST ecosystem remains one layer short of institutional readiness. The clearest upgrade path is deeper stablecoin exit liquidity plus stronger DeFi collateral integration.”

---

## Suggested UI labels
- Health Score: 71
- LP Attractiveness: Medium
- Best Module: Validator Decentralization
- Weakest Module: DeFi Moneyness
- Primary Bottleneck: Stablecoin Exit Depth
- Main Strategic Upgrade: Lending Collateral Expansion

---

## Optional mini-chart data

### Slippage curve
- 10000: 0.12
- 25000: 0.28
- 50000: 0.44
- 100000: 0.65
- 250000: 1.45
- 500000: 2.40
- 1000000: 4.90

### Peg deviation over time
- day1: -0.10
- day2: -0.15
- day3: -0.08
- day4: -0.22
- day5: -0.35
- day6: -0.40
- day7: -0.31
- day8: -0.27
- day9: -0.18
- day10: -0.12

### DeFi usage composition
- Lending: 34
- LP Pools: 46
- Vaults: 8
- Idle: 12

### Validator concentration
- Top 1: 8
- Top 5: 29
- Top 10: 44
- Remaining: 56

---

## Product interpretation
This mocked Monad profile should visually tell the following story:

- Monad is attractive as a foundation for a strong LST ecosystem.
- The ecosystem is not broken.
- The opportunity is not to “fix staking.”
- The opportunity is to make the LST more money-like.
- The two highest-value upgrades are:
  1. better stablecoin exit liquidity
  2. stronger DeFi collateral utility
