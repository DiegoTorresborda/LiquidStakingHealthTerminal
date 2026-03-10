# StakingRewards Data Source

We use manual snapshots from stakingrewards.com to obtain staking metrics.

Reason:
The official API is paid and not publicly accessible.

Data collection workflow:

1. Navigate to:
https://stakingrewards.com/assets/{network}

2. Take screenshot

3. Extract the following fields manually:

- rewardRatePct
- price
- stakingMarketCapUsd
- stakingRatioPct
- stakedTokens
- inflationRatePct
- validators
- verifiedProviders
- benchmarkCommissionPct

4. Insert values into:

/data/manual/stakingrewards.json

5. Commit dataset.

Data quality:

quality: observed-manual  
source: stakingrewards.com

This dataset feeds:

- staking analytics
- validator decentralization
- LST opportunity scoring
