"""Cross-network comparison: KPI matrix + funnel/trajectory plots."""

from __future__ import annotations

from pathlib import Path
from typing import Iterable

import matplotlib.pyplot as plt
import pandas as pd

from .schema import EthereumBenchmark, HistoricalSnapshot, NetworkProfile, Stage
from .scoring import (
    classify_stage,
    compute_conversion_ratios,
    score_vs_ethereum,
)


# ---------------------------------------------------------------------------
# Matrix
# ---------------------------------------------------------------------------

def _row(profile: NetworkProfile, eth_benchmark: EthereumBenchmark) -> dict:
    stage = classify_stage(profile)
    ratios = compute_conversion_ratios(profile)
    scores = score_vs_ethereum(profile, eth_benchmark)
    row = {
        "name": profile.name,
        "ticker": profile.ticker,
        "consensus": profile.consensus_type.value,
        "native_ls": profile.native_liquid_staking_flag,
        "stage": stage.value,
        # L1
        "circ_supply": profile.l1.circulating_supply.value,
        "market_cap_usd": profile.l1.market_cap_usd.value,
        "active_addresses_30d": profile.l1.active_addresses_30d.value,
        # L2
        "total_staked": profile.l2.total_staked.value,
        "staking_ratio_pct": profile.l2.staking_ratio_pct.value,
        "active_validators": profile.l2.active_validators.value,
        "nakamoto_coefficient": profile.l2.nakamoto_coefficient.value,
        "nominal_yield_pct": profile.l2.nominal_yield_pct.value,
        # L3
        "lst_tvl_usd": profile.l3.lst_tvl_usd.value if profile.l3 else None,
        "liquidization_rate_pct": (
            profile.l3.liquidization_rate_pct.value if profile.l3 else None
        ),
        "largest_lst_issuer_share_pct": (
            profile.l3.largest_lst_issuer_share_pct.value if profile.l3 else None
        ),
        "native_redemption": (
            profile.l3.native_redemption_available.value if profile.l3 else None
        ),
        # L4.1
        "restaking_tvl_usd": (
            profile.l41.restaking_tvl_usd.value if profile.l41 else None
        ),
        "restaking_rate_pct": (
            profile.l41.restaking_rate_pct.value if profile.l41 else None
        ),
        # L4.2
        "defi_productivity_rate_pct": (
            profile.l42.defi_productivity_rate_pct.value if profile.l42 else None
        ),
        "pendle_equivalent_tvl_usd": (
            profile.l42.pendle_equivalent_tvl_usd.value if profile.l42 else None
        ),
        # Conversion ratios
        **{f"ratio_{k}": v for k, v in ratios.items()},
        # Scores
        **{f"score_{k}": v for k, v in scores.items()},
    }
    return row


def build_matrix(
    networks: Iterable[NetworkProfile],
    eth_benchmark: EthereumBenchmark,
) -> pd.DataFrame:
    """One row per network: all KPIs + stage + conversion ratios + scores."""
    rows = [_row(p, eth_benchmark) for p in networks]
    return pd.DataFrame(rows)


# ---------------------------------------------------------------------------
# Plots
# ---------------------------------------------------------------------------

_STAGE_COLORS = {
    Stage.S0.value: "#9CA3AF",     # gray
    Stage.S1.value: "#60A5FA",     # blue
    Stage.S2.value: "#34D399",     # green
    Stage.S3.value: "#FBBF24",     # amber
    Stage.S4_1.value: "#F97316",   # orange
    Stage.S4_2.value: "#EF4444",   # red
    Stage.S_STAR.value: "#A78BFA", # violet
}


def plot_funnel_positions(
    networks: Iterable[NetworkProfile],
    eth_benchmark: EthereumBenchmark,
    output_path: Path,
) -> Path:
    """Scatter: x=staking ratio, y=liquidization, color=stage, size=market cap."""
    rows = [_row(p, eth_benchmark) for p in networks]
    df = pd.DataFrame(rows)

    # Scale market cap to bubble size: sqrt scaling, clipped.
    sizes = (df["market_cap_usd"].fillna(1e6) ** 0.5) / 1_000
    sizes = sizes.clip(lower=20, upper=600)

    fig, ax = plt.subplots(figsize=(9, 6))
    for stage_label, color in _STAGE_COLORS.items():
        mask = df["stage"] == stage_label
        if not mask.any():
            continue
        ax.scatter(
            df.loc[mask, "staking_ratio_pct"],
            df.loc[mask, "liquidization_rate_pct"].fillna(0),
            s=sizes[mask],
            color=color,
            alpha=0.7,
            edgecolor="black",
            linewidth=0.5,
            label=stage_label,
        )

    for _, r in df.iterrows():
        ax.annotate(
            r["ticker"],
            (r["staking_ratio_pct"], r["liquidization_rate_pct"] or 0),
            xytext=(5, 4),
            textcoords="offset points",
            fontsize=8,
        )

    # Threshold guides
    ax.axvline(2.0, color="#9CA3AF", linestyle=":", linewidth=0.8)
    ax.axhline(20.0, color="#9CA3AF", linestyle=":", linewidth=0.8)
    ax.text(2.0, ax.get_ylim()[1] * 0.95, " S0→S1", fontsize=7, color="#6B7280")
    ax.text(ax.get_xlim()[1] * 0.95, 20.0, "S1→S2 ", fontsize=7, color="#6B7280", ha="right")

    ax.set_xlabel("Staking ratio (%)")
    ax.set_ylabel("Liquidization rate (%)")
    ax.set_title("PoS funnel positions — bubble size ∝ √(market cap)")
    ax.legend(title="Stage", loc="upper left", fontsize=8)
    ax.grid(alpha=0.3)

    output_path = Path(output_path)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    fig.tight_layout()
    fig.savefig(output_path, dpi=150)
    plt.close(fig)
    return output_path


def plot_trajectory_overlay(
    networks: Iterable[NetworkProfile],
    eth_history: list[HistoricalSnapshot],
    output_path: Path,
) -> Path:
    """Overlay each network on Ethereum's historical staking × liquidization curve."""
    fig, ax = plt.subplots(figsize=(9, 6))

    # ETH historical curve
    eth_x = [s.staking_ratio_pct for s in eth_history]
    eth_y = [s.liquidization_rate_pct or 0 for s in eth_history]
    ax.plot(eth_x, eth_y, color="#4B5563", linewidth=2, label="Ethereum trajectory")
    for s in eth_history:
        ax.annotate(
            s.quarter[2:],  # "23-Q2"
            (s.staking_ratio_pct, s.liquidization_rate_pct or 0),
            xytext=(3, -10),
            textcoords="offset points",
            fontsize=7,
            color="#4B5563",
        )

    # Networks
    for p in networks:
        if p.l3 is None:
            continue
        x = p.l2.staking_ratio_pct.value
        y = p.l3.liquidization_rate_pct.value
        stage = classify_stage(p)
        ax.scatter(x, y, s=120, color=_STAGE_COLORS.get(stage.value, "#000"), edgecolor="black", zorder=3)
        ax.annotate(p.ticker, (x, y), xytext=(6, 6), textcoords="offset points", fontsize=9, fontweight="bold")

    ax.set_xlabel("Staking ratio (%)")
    ax.set_ylabel("Liquidization rate (%)")
    ax.set_title("Networks vs Ethereum historical trajectory")
    ax.legend(loc="upper left", fontsize=8)
    ax.grid(alpha=0.3)

    output_path = Path(output_path)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    fig.tight_layout()
    fig.savefig(output_path, dpi=150)
    plt.close(fig)
    return output_path
