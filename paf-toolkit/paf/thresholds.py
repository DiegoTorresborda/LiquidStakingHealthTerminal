"""Stage transition thresholds, calibrated to Ethereum's trajectory.

Source: Ethereum_benckmark.md, "Operationalized funnel stage thresholds".
Each threshold has a `check(profile)` predicate returning True iff the
profile satisfies the rule. A profile is assigned the highest stage
whose threshold (and all prior thresholds) it satisfies.
"""

from __future__ import annotations

from dataclasses import dataclass
from typing import Callable, Optional

from .schema import NetworkProfile, Stage


@dataclass(frozen=True)
class Threshold:
    from_stage: Stage
    to_stage: Stage
    rule: str
    check: Callable[[NetworkProfile], bool]


def _staking_ratio_above_2(profile: NetworkProfile) -> bool:
    """S0 → S1: staking_ratio > 2%."""
    return profile.l2.staking_ratio_pct.value > 2.0


def _liquidization_and_diverse_issuers(profile: NetworkProfile) -> bool:
    """S1 → S2: liquidization_rate > 20% AND market is not a monopoly.

    The original spec was "≥3 LST issuers with >5% share". That clause was
    chosen to prevent one-issuer markets from counting as healthy. But at
    Ethereum maturity (Q1 2026), natural consolidation leaves only 2 issuers
    above 5% (Lido ~55%, Binance wBETH ~22%) while the market is unambiguously
    healthy. We therefore accept *either* signal of competition:

      - ≥3 issuers with >5% share (the original diverse-issuers rule), OR
      - largest issuer < 70% of the LST market (anti-monopoly rule)

    A network with a 95%-share LST would fail both checks.
    """
    if profile.l3 is None:
        return False
    if profile.l3.liquidization_rate_pct.value <= 20.0:
        return False
    diverse = profile.l3.num_lst_issuers_above_5pct.value >= 3
    non_dominant_leader = profile.l3.largest_lst_issuer_share_pct.value < 70.0
    return diverse or non_dominant_leader


def _defi_productive_and_withdrawals(profile: NetworkProfile) -> bool:
    """S2 → S3: defi_productivity_rate > 30% AND withdrawals enabled."""
    if profile.l42 is None or profile.l3 is None:
        return False
    return (
        profile.l42.defi_productivity_rate_pct.value > 30.0
        and profile.l3.native_redemption_available.value is True
    )


def _restaking_above_5pct(profile: NetworkProfile) -> bool:
    """S3 → S4.1: restaking_tvl > 5% of lst_tvl."""
    if profile.l41 is None or profile.l3 is None:
        return False
    lst_tvl = profile.l3.lst_tvl_usd.value
    if lst_tvl <= 0:
        return False
    ratio = profile.l41.restaking_tvl_usd.value / lst_tvl
    return ratio > 0.05


def _composable_mature(profile: NetworkProfile) -> bool:
    """S4.1 → S4.2: looping in 2+ lending markets AND pendle-equivalent > $1B."""
    if profile.l42 is None:
        return False
    return (
        profile.l42.looping_supported.value is True
        and profile.l42.num_lending_integrations.value >= 2
        and profile.l42.pendle_equivalent_tvl_usd.value > 1_000_000_000.0
    )


# Order matters — each transition is layered on top of the previous one.
TRANSITIONS: list[Threshold] = [
    Threshold(Stage.S0, Stage.S1, "staking_ratio > 2%", _staking_ratio_above_2),
    Threshold(
        Stage.S1,
        Stage.S2,
        "liquidization_rate > 20% AND (≥3 LST issuers > 5% OR largest issuer < 70%)",
        _liquidization_and_diverse_issuers,
    ),
    Threshold(
        Stage.S2,
        Stage.S3,
        "defi_productivity_rate > 30% AND withdrawals enabled",
        _defi_productive_and_withdrawals,
    ),
    Threshold(
        Stage.S3,
        Stage.S4_1,
        "restaking_tvl > 5% of lst_tvl",
        _restaking_above_5pct,
    ),
    Threshold(
        Stage.S4_1,
        Stage.S4_2,
        "looping in 2+ lending markets AND pendle-equivalent > $1B",
        _composable_mature,
    ),
]


def transition_for(from_stage: Stage) -> Optional[Threshold]:
    for t in TRANSITIONS:
        if t.from_stage == from_stage:
            return t
    return None
