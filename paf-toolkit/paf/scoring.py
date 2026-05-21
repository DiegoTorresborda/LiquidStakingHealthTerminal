"""Stage classification, conversion ratios, vs-Ethereum scoring, trajectory."""

from __future__ import annotations

import math
from typing import Optional

from .schema import (
    EthereumBenchmark,
    HistoricalSnapshot,
    NetworkProfile,
    Stage,
)
from .thresholds import TRANSITIONS


# ---------------------------------------------------------------------------
# Stage classification
# ---------------------------------------------------------------------------

def classify_stage(profile: NetworkProfile) -> Stage:
    """Walk the threshold ladder from S0 upward, returning the highest stage met.

    Native-liquid-staking networks return S_STAR if they pass L1+L2 thresholds
    but the L3 evaluation is skipped by design (their staked positions are
    already liquid by protocol construction).
    """
    if profile.native_liquid_staking_flag:
        # Native LS networks still need a minimum stake ratio to count as "secured".
        if profile.l2.staking_ratio_pct.value <= 2.0:
            return Stage.S0
        return Stage.S_STAR

    current = Stage.S0
    for t in TRANSITIONS:
        if t.from_stage != current:
            continue
        if t.check(profile):
            current = t.to_stage
        else:
            break
    return current


# ---------------------------------------------------------------------------
# Conversion ratios
# ---------------------------------------------------------------------------

def compute_conversion_ratios(profile: NetworkProfile) -> dict[str, Optional[float]]:
    """Return the five funnel conversion ratios (all as percentages or None).

    Keys:
      - staking_participation_pct    (L1 → L2)
      - liquidization_pct            (L2 → L3)
      - defi_productivity_pct        (L3 → L4.2)
      - restaking_pct                (L3 → L4.1)
      - looping_depth_pct            (heuristic: pendle_tvl / lst_tvl)
    """
    ratios: dict[str, Optional[float]] = {
        "staking_participation_pct": profile.l2.staking_ratio_pct.value,
        "liquidization_pct": None,
        "defi_productivity_pct": None,
        "restaking_pct": None,
        "looping_depth_pct": None,
    }

    if profile.l3 is not None:
        ratios["liquidization_pct"] = profile.l3.liquidization_rate_pct.value

    if profile.l42 is not None:
        ratios["defi_productivity_pct"] = profile.l42.defi_productivity_rate_pct.value

    if profile.l41 is not None and profile.l3 is not None:
        lst_tvl = profile.l3.lst_tvl_usd.value
        if lst_tvl > 0:
            ratios["restaking_pct"] = (
                profile.l41.restaking_tvl_usd.value / lst_tvl * 100.0
            )

    if profile.l42 is not None and profile.l3 is not None:
        lst_tvl = profile.l3.lst_tvl_usd.value
        if lst_tvl > 0:
            ratios["looping_depth_pct"] = (
                profile.l42.pendle_equivalent_tvl_usd.value / lst_tvl * 100.0
            )

    return ratios


# ---------------------------------------------------------------------------
# vs-Ethereum scoring
# ---------------------------------------------------------------------------

def _log_scale_score(network_value: float, eth_value: float, cap: float = 150.0) -> float:
    """Score on a log scale: 100 = parity with Ethereum, capped at `cap`.

    score = 100 * (1 + log10(network / eth))  clamped to [0, cap]
    so:
      - network = eth        → 100
      - network = 10x eth    → 200 → capped to 150
      - network = 0.1x eth   → 0
      - network = 0.5x eth   → ~70
    """
    if eth_value <= 0 or network_value <= 0:
        return 0.0
    raw = 100.0 * (1.0 + math.log10(network_value / eth_value))
    return max(0.0, min(cap, raw))


def score_vs_ethereum(
    profile: NetworkProfile,
    eth_benchmark: EthereumBenchmark,
) -> dict[str, float]:
    """Per-layer 0–150 scores comparing the network to Ethereum's current snapshot.

    Each layer score is the score of its single most-load-bearing KPI
    (chosen because it's the one that drives funnel-stage progression):

      L1   → market_cap_usd                       (token adoption depth)
      L2   → staking_ratio_pct                    (security participation)
      L3   → liquidization_rate_pct               (LST adoption depth)
      L4.1 → restaking_rate_pct                   (restaking depth)
      L4.2 → defi_productivity_rate_pct           (productive deployment)
    """
    eth = eth_benchmark.snapshot
    scores: dict[str, float] = {}

    scores["L1"] = _log_scale_score(
        profile.l1.market_cap_usd.value,
        eth.l1.market_cap_usd.value,
    )
    scores["L2"] = _log_scale_score(
        profile.l2.staking_ratio_pct.value,
        eth.l2.staking_ratio_pct.value,
    )
    if profile.l3 is not None and eth.l3 is not None:
        scores["L3"] = _log_scale_score(
            profile.l3.liquidization_rate_pct.value,
            eth.l3.liquidization_rate_pct.value,
        )
    else:
        scores["L3"] = 0.0

    if profile.l41 is not None and eth.l41 is not None:
        scores["L4.1"] = _log_scale_score(
            profile.l41.restaking_rate_pct.value,
            eth.l41.restaking_rate_pct.value,
        )
    else:
        scores["L4.1"] = 0.0

    if profile.l42 is not None and eth.l42 is not None:
        scores["L4.2"] = _log_scale_score(
            profile.l42.defi_productivity_rate_pct.value,
            eth.l42.defi_productivity_rate_pct.value,
        )
    else:
        scores["L4.2"] = 0.0

    scores["overall"] = sum(scores.values()) / len(scores)
    return scores


# ---------------------------------------------------------------------------
# Trajectory positioning
# ---------------------------------------------------------------------------

def _snapshot_distance(profile: NetworkProfile, snap: HistoricalSnapshot) -> float:
    """Distance between a profile and a historical ETH snapshot.

    We compare on three normalized dimensions (staking, liquidization, defi
    productivity), each clipped to [0, 100]. Missing dimensions are skipped;
    distance is mean absolute difference of the available pairs.
    """
    diffs: list[float] = []

    diffs.append(abs(profile.l2.staking_ratio_pct.value - snap.staking_ratio_pct))

    if profile.l3 is not None and snap.liquidization_rate_pct is not None:
        diffs.append(
            abs(profile.l3.liquidization_rate_pct.value - snap.liquidization_rate_pct)
        )

    if profile.l42 is not None and snap.defi_productivity_rate_pct is not None:
        diffs.append(
            abs(
                profile.l42.defi_productivity_rate_pct.value
                - snap.defi_productivity_rate_pct
            )
        )

    return sum(diffs) / len(diffs) if diffs else float("inf")


def trajectory_position(
    profile: NetworkProfile,
    eth_history: list[HistoricalSnapshot],
) -> str:
    """Find the ETH quarter whose funnel state most resembles this profile.

    Returns a short human-readable string like:
        "comparable to ETH 2022-Q3 (Merge era)"
    """
    if not eth_history:
        return "no benchmark history available"

    nearest = min(eth_history, key=lambda s: _snapshot_distance(profile, s))
    suffix = f" — {nearest.note}" if nearest.note else ""
    return f"comparable to ETH {nearest.quarter}{suffix}"
