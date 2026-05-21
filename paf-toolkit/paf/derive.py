"""Derive internally-consistent USD values from native quantities + price.

Why this exists: USD-denominated TVL figures get stale fast when token prices
move. The benchmark cites `$47B LST TVL` at an implicit ~$2,738/ETH but ETH
trades at $2,100 today — making the stored value off by ~$11B (30%).

This module computes USD values from the native-unit quantities (which don't
move with price) and a single canonical price input (`l1.native_price_usd`).
The `consistency_report()` function then flags YAML values that drift from
their derived counterparts by more than a tolerance.

Quantities that are inherently USD (Pendle TVL, CEX/DEX depth) cannot be
re-derived this way — they are owned by their original source and just carry
forward.
"""

from __future__ import annotations

from dataclasses import dataclass
from typing import Optional

from .schema import NetworkProfile


@dataclass(frozen=True)
class DerivedUSD:
    """USD values recomputed from native quantities + price."""

    native_price_usd: float
    market_cap_usd: float
    lst_tvl_usd: Optional[float] = None
    lst_in_defi_tvl_usd: Optional[float] = None
    restaking_tvl_usd: Optional[float] = None


def derive_consistent_usd(profile: NetworkProfile) -> DerivedUSD:
    """Recompute internally-consistent USD values.

    Math:
        market_cap_usd      = circulating_supply × native_price_usd
        lst_tvl_native      = (liquidization_rate / 100) × total_staked
        lst_tvl_usd         = lst_tvl_native × native_price_usd
        lst_in_defi_tvl_usd = (defi_productivity_rate / 100) × lst_tvl_usd
        restaking_tvl_usd   = (restaking_rate / 100) × lst_tvl_usd
    """
    price = profile.l1.native_price_usd.value
    circ = profile.l1.circulating_supply.value
    staked = profile.l2.total_staked.value

    market_cap = circ * price

    lst_tvl: Optional[float] = None
    lst_in_defi: Optional[float] = None
    restaking_tvl: Optional[float] = None

    if profile.l3 is not None:
        lst_native = (profile.l3.liquidization_rate_pct.value / 100.0) * staked
        lst_tvl = lst_native * price

        if profile.l42 is not None:
            lst_in_defi = (profile.l42.defi_productivity_rate_pct.value / 100.0) * lst_tvl

        if profile.l41 is not None:
            restaking_tvl = (profile.l41.restaking_rate_pct.value / 100.0) * lst_tvl

    return DerivedUSD(
        native_price_usd=price,
        market_cap_usd=market_cap,
        lst_tvl_usd=lst_tvl,
        lst_in_defi_tvl_usd=lst_in_defi,
        restaking_tvl_usd=restaking_tvl,
    )


@dataclass(frozen=True)
class Discrepancy:
    field: str
    stored: float
    derived: float
    pct_off: float


def consistency_report(
    profile: NetworkProfile,
    tolerance_pct: float = 5.0,
) -> list[Discrepancy]:
    """List USD KPIs in `profile` that drift from derived values by > tolerance_pct."""
    derived = derive_consistent_usd(profile)
    discrepancies: list[Discrepancy] = []

    def _check(field: str, stored: float, derived_val: Optional[float]) -> None:
        if derived_val is None or derived_val == 0:
            return
        pct_off = abs(stored - derived_val) / derived_val * 100.0
        if pct_off > tolerance_pct:
            discrepancies.append(
                Discrepancy(field=field, stored=stored, derived=derived_val, pct_off=pct_off)
            )

    _check("l1.market_cap_usd", profile.l1.market_cap_usd.value, derived.market_cap_usd)

    if profile.l3 is not None:
        _check("l3.lst_tvl_usd", profile.l3.lst_tvl_usd.value, derived.lst_tvl_usd)

    if profile.l42 is not None:
        _check(
            "l42.lst_in_defi_tvl_usd",
            profile.l42.lst_in_defi_tvl_usd.value,
            derived.lst_in_defi_tvl_usd,
        )

    if profile.l41 is not None:
        _check(
            "l41.restaking_tvl_usd",
            profile.l41.restaking_tvl_usd.value,
            derived.restaking_tvl_usd,
        )

    return discrepancies
