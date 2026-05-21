"""Calibration tests — Ethereum benchmark must produce expected stage/ratios/history."""

from __future__ import annotations

from pathlib import Path

import pytest

from paf.derive import consistency_report, derive_consistent_usd
from paf.loader import load_ethereum_benchmark
from paf.scoring import classify_stage, compute_conversion_ratios
from paf.schema import Stage
from paf.thresholds import TRANSITIONS, transition_for


BENCHMARK_PATH = Path(__file__).resolve().parents[1] / "data" / "benchmark" / "ethereum.yaml"


@pytest.fixture(scope="module")
def benchmark():
    return load_ethereum_benchmark(BENCHMARK_PATH)


def test_ethereum_classifies_as_s42(benchmark):
    """Ethereum's Q1 2026 snapshot must classify as S4.2 (composable/mature)."""
    stage = classify_stage(benchmark.snapshot)
    assert stage == Stage.S4_2, f"expected S4.2, got {stage}"


def test_ethereum_conversion_ratios_within_benchmark_ranges(benchmark):
    """Conversion ratios should match the values reported in Ethereum_benckmark.md TL;DR."""
    r = compute_conversion_ratios(benchmark.snapshot)

    # TL;DR: staking participation 29–30%
    assert 28.0 <= r["staking_participation_pct"] <= 32.0

    # TL;DR: liquidization ~46% (Lido Aug 2025)
    assert 40.0 <= r["liquidization_pct"] <= 50.0

    # TL;DR: DeFi productivity 40–50%
    assert 40.0 <= r["defi_productivity_pct"] <= 50.0

    # Restaking is contested (16–20% ETH-eq, ~38% USD-denom from BlockEden)
    # Accept either reading; just enforce > the S3→S4.1 5% trigger.
    assert r["restaking_pct"] > 5.0


def test_thresholds_against_eth_history(benchmark):
    """Replaying ETH's history should trigger stage transitions at documented dates.

    From benchmark "Key Findings":
      S0 → S1  ~Q2 2021 (staking ratio >2%)
      S1 → S2  ~Q3 2021 (Lido 1M ETH milestone)
      S2 → S3  ~Q2 2023 (Shapella + Aave/Pendle integrations)
      S3 → S4.1 ~Q1 2024 (EigenLayer LST cap removal)
      S4.1 → S4.2 ~Q2 2024 (LRT-collateralized looping + Pendle ATH)
    """
    history_by_q = {h.quarter: h for h in benchmark.history}

    # The history table stamps the stage on each quarter. We assert that
    # the stage progression observed in our snapshots matches the doc's narrative.
    progression_expectations = [
        ("2020-Q4", Stage.S0),    # genesis
        ("2021-Q4", Stage.S1),    # in S1 after crossing 2% (passed Q1-Q2 2021)
        ("2022-Q4", Stage.S2),    # LST market dominant pre-withdrawals
        ("2023-Q2", Stage.S3),    # Shapella enables withdrawals + Aave/Pendle live
        ("2024-Q1", Stage.S4_1),  # EigenLayer LST cap removed Apr 17 (Q2) — Q1 row is
                                  # last quarter without S4.1 OR first with it; benchmark
                                  # marks it as S4.1 since restaking TVL passed 5% threshold
        ("2024-Q2", Stage.S4_2),  # EigenLayer peak + Pendle ATH
        ("2026-Q1", Stage.S4_2),  # current
    ]

    for quarter, expected in progression_expectations:
        assert quarter in history_by_q, f"missing history quarter {quarter}"
        snap = history_by_q[quarter]
        assert snap.stage == expected, (
            f"{quarter}: expected {expected}, got {snap.stage}"
        )


def test_history_is_monotonic(benchmark):
    """ETH should not regress: once a quarter reaches stage X, no later quarter < X."""
    stage_order = {
        Stage.S0: 0,
        Stage.S1: 1,
        Stage.S2: 2,
        Stage.S3: 3,
        Stage.S4_1: 4,
        Stage.S4_2: 5,
    }
    sorted_history = sorted(benchmark.history, key=lambda h: h.as_of)
    max_seen = -1
    for snap in sorted_history:
        rank = stage_order[snap.stage]
        assert rank >= max_seen, f"{snap.quarter}: regressed to {snap.stage}"
        max_seen = rank


def test_all_transitions_are_unique(benchmark):
    """The threshold ladder must be a strict sequence, one per from_stage."""
    seen = set()
    for t in TRANSITIONS:
        assert t.from_stage not in seen
        seen.add(t.from_stage)


def test_s0_classification_with_low_staking(benchmark):
    """Sanity: if we force staking_ratio < 2%, classification drops to S0."""
    eth = benchmark.snapshot
    forced = eth.model_copy(
        update={"l2": eth.l2.model_copy(
            update={"staking_ratio_pct": eth.l2.staking_ratio_pct.model_copy(update={"value": 1.5})}
        )}
    )
    assert classify_stage(forced) == Stage.S0


def test_stored_usd_values_consistent_with_derived(benchmark):
    """USD KPIs stored in the YAML must match values derived from native_price_usd.

    Tolerance is 2% — anything bigger means the YAML has gone stale relative
    to the canonical price and the user should reprice.
    """
    discrepancies = consistency_report(benchmark.snapshot, tolerance_pct=2.0)
    assert not discrepancies, (
        "Stored USD values drift from derived values:\n"
        + "\n".join(
            f"  {d.field}: stored=${d.stored:,.0f} derived=${d.derived:,.0f} ({d.pct_off:.1f}% off)"
            for d in discrepancies
        )
    )


def test_derive_math_for_ethereum(benchmark):
    """Explicit sanity check on the derivation math with ETH=$2,100."""
    d = derive_consistent_usd(benchmark.snapshot)
    # 121.5M × $2,100 = $255.15B
    assert d.market_cap_usd == pytest.approx(255_150_000_000, rel=1e-6)
    # 46.0% × 37.3M × $2,100 = $36.0318B
    assert d.lst_tvl_usd == pytest.approx(36_031_800_000, rel=1e-6)
    # 45.0% × $36.0318B = $16.2143B
    assert d.lst_in_defi_tvl_usd == pytest.approx(16_214_310_000, rel=1e-6)
    # 38.3% × $36.0318B = $13.80B
    assert d.restaking_tvl_usd == pytest.approx(13_800_180_000, rel=1e-4)


def test_transition_for_returns_known_gates():
    """`transition_for` should resolve every stage in the ladder except the terminal one."""
    assert transition_for(Stage.S0).to_stage == Stage.S1
    assert transition_for(Stage.S1).to_stage == Stage.S2
    assert transition_for(Stage.S2).to_stage == Stage.S3
    assert transition_for(Stage.S3).to_stage == Stage.S4_1
    assert transition_for(Stage.S4_1).to_stage == Stage.S4_2
    assert transition_for(Stage.S4_2) is None  # terminal
