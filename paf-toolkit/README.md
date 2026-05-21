# paf-toolkit — PoS Adoption Funnel

Analytical framework for evaluating Proof-of-Stake networks across a 4-layer adoption funnel, calibrated against Ethereum.

## Framework

| Layer | Question | Threshold to next stage |
|---|---|---|
| **L1** Native token | Is the token adopted? | staking_ratio > 2% → **S1** |
| **L2** Staking security | Is the chain economically secured? | liquidization > 20% AND (≥3 LST issuers > 5% OR largest issuer < 70%) → **S2** |
| **L3** Liquid staking | Are staked positions liquid? | defi_productivity > 30% AND withdrawals enabled → **S3** |
| **L4.1** Restaking / LRT | Is restaking compounding security? | restaking_tvl > 5% of LST TVL → **S4.1** |
| **L4.2** DeFi productivity | Are LSTs productive collateral? | looping in 2+ markets AND Pendle-equiv > $1B → **S4.2** |

Networks with native liquid staking (Solana, Cardano) classify as **S\*** and skip the L3 evaluation entirely.

The thresholds and their values are calibrated against [Ethereum_benckmark.md](../Ethereum_benckmark.md). All five gates were observed crossing during Ethereum's 2020–2024 trajectory; the same gates can be replayed against any emerging PoS network to locate it on the funnel.

### Why the S1→S2 rule has two clauses

The benchmark spec calls for "≥3 LST issuers with >5% share each". At Ethereum maturity (Q1 2026), natural consolidation has left only 2 issuers above that bar (Lido ~55%, Binance wBETH ~22%). The original rule would falsely fail Ethereum. We therefore added an OR clause: a network also passes if its largest issuer is < 70% of the LST market — capturing the anti-monopoly intent without falsely failing mature networks. See `_liquidization_and_diverse_issuers` in [src/paf/thresholds.py](src/paf/thresholds.py) for full reasoning.

## Layout

```
paf-toolkit/
├── data/
│   ├── benchmark/ethereum.yaml        # Q1 2026 snapshot + quarterly history Q4 2020 → Q1 2026
│   └── networks/_template.yaml        # copy this to add a new network
├── src/paf/
│   ├── schema.py                      # Pydantic models (KPI envelope, layers, NetworkProfile)
│   ├── thresholds.py                  # stage transition rules
│   ├── scoring.py                     # classify_stage, conversion ratios, vs-ETH scoring, trajectory
│   ├── report.py                      # scorecard renderer (Jinja2)
│   ├── compare.py                     # cross-network matrix + plots
│   ├── loader.py                      # YAML → Pydantic
│   └── cli.py                         # `paf` command
├── templates/scorecard.md.j2          # one-page funnel card template
├── tests/test_ethereum_calibration.py # Ethereum must classify as S4.2
└── outputs/                           # generated scorecards, CSVs, charts
```

## Quickstart

```bash
cd paf-toolkit
python3 -m venv .venv
.venv/bin/pip install -e ".[dev]"

# Validate calibration — Ethereum must classify as S4.2
.venv/bin/paf validate-benchmark

# Score Ethereum (smoke test)
.venv/bin/paf score data/benchmark/ethereum.yaml

# Score a new network
cp data/networks/_template.yaml data/networks/aptos.yaml
# ... fill in the KPIs ...
.venv/bin/paf score data/networks/aptos.yaml

# Build the cross-network comparison matrix + charts
.venv/bin/paf compare
```

## Adding a network

1. Copy `data/networks/_template.yaml` to `data/networks/<ticker>.yaml`.
2. Fill in every required KPI. Each value carries an `as_of` date, a `source` citation, and a `confidence` tag (`high | medium | low | data_gap | contested`).
3. Omit `l3`, `l41`, or `l42` blocks entirely if those layers don't exist yet for the network — the threshold ladder stops at the first missing layer.
4. Run `paf score data/networks/<ticker>.yaml`. The scorecard ends with a stage-driven BD recommendation.

### How to interpret the outputs

**Stage** — where on the S0..S4.2 ladder the network sits. The BD playbook flips at each stage; the spreadsheet of "best BD targets" is networks at **S1→S2** (securing but pre-liquidization).

**Conversion ratios** — the five quantitative gates as percentages. Compare side-by-side with Ethereum's current snapshot.

**vs-Ethereum scores** — log-scaled 0–150 per layer, where 100 = parity. Capped at 150 for outperformance (so a network with 2× Ethereum's staking ratio doesn't dominate the chart).

**Trajectory** — which quarter in Ethereum's history this network most resembles. E.g., "comparable to ETH 2022-Q3 — The Merge" means the network is approximately where Ethereum was at Merge time.

**Strengths / gaps** — auto-generated from threshold proximity. The single most useful entry is usually the "next gate" line.

**Confidence notes** — KPIs flagged `data_gap`, `contested`, or `low` are surfaced separately so reviewers can sanity-check the load-bearing inputs.

## Sources

The Ethereum reference YAML cites primary sources from the benchmark document: Everstake annual reports, CoinDesk, The Block, The Defiant, DefiLlama, Beaconcha.in, Lido and EigenLayer official sources, plus Galaxy/Blockworks secondary citations. See [Ethereum_benckmark.md](../Ethereum_benckmark.md) for the full citation trail and methodological caveats.

## Out of scope (this iteration)

- API integrations (DefiLlama, CoinGecko) — manual YAML input only.
- Web dashboard.
- Time-series forecasting.
