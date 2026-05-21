"""Scorecard rendering. Pulls together stage, ratios, scores, and a BD note."""

from __future__ import annotations

from datetime import datetime, timezone
from pathlib import Path
from typing import Optional

import markdown as md
from jinja2 import Environment, FileSystemLoader, select_autoescape

from .schema import (
    Confidence,
    EthereumBenchmark,
    NetworkProfile,
    Stage,
)
from .scoring import (
    classify_stage,
    compute_conversion_ratios,
    score_vs_ethereum,
    trajectory_position,
)
from .thresholds import transition_for


TEMPLATE_DIR = Path(__file__).resolve().parents[1] / "templates"

_RATIO_LABELS = [
    ("staking_participation_pct", "Staking participation (L1→L2)"),
    ("liquidization_pct", "Liquidization (L2→L3)"),
    ("defi_productivity_pct", "DeFi productivity (L3→L4.2)"),
    ("restaking_pct", "Restaking (L3→L4.1)"),
    ("looping_depth_pct", "Looping depth (proxy)"),
]


# ---------------------------------------------------------------------------
# Formatters used inside the Jinja template
# ---------------------------------------------------------------------------

def _fmt_n(n: float) -> str:
    """Format a count with magnitude suffix: 37_300_000 → '37.3M'."""
    if n is None:
        return "n/a"
    for unit, divisor in [("B", 1e9), ("M", 1e6), ("K", 1e3)]:
        if abs(n) >= divisor:
            return f"{n / divisor:.2f}{unit}".rstrip("0").rstrip(".")
    return f"{n:.0f}"


def _fmt_usd(n: float) -> str:
    if n is None:
        return "n/a"
    return f"${_fmt_n(n)}"


def _fmt_pct(v: Optional[float]) -> str:
    if v is None:
        return "—"
    return f"{v:.1f}%"


def _fmt_gap(network: Optional[float], eth: Optional[float]) -> str:
    if network is None or eth is None:
        return "—"
    diff = network - eth
    sign = "+" if diff >= 0 else ""
    return f"{sign}{diff:.1f} pp"


# ---------------------------------------------------------------------------
# Strengths, gaps, confidence notes, BD note
# ---------------------------------------------------------------------------

def _strengths_and_gaps(
    profile: NetworkProfile,
    eth_benchmark: EthereumBenchmark,
    stage: Stage,
) -> tuple[list[str], list[str]]:
    strengths: list[str] = []
    gaps: list[str] = []

    eth = eth_benchmark.snapshot

    # Staking ratio comparison
    ratio = profile.l2.staking_ratio_pct.value
    eth_ratio = eth.l2.staking_ratio_pct.value
    if ratio >= eth_ratio:
        strengths.append(
            f"Staking ratio {ratio:.1f}% meets/exceeds Ethereum's {eth_ratio:.1f}%."
        )
    elif ratio < 0.5 * eth_ratio:
        gaps.append(
            f"Staking ratio {ratio:.1f}% is less than half Ethereum's {eth_ratio:.1f}% — security thin."
        )

    # LST market diversity
    if profile.l3 is not None:
        if profile.l3.largest_lst_issuer_share_pct.value >= 70.0:
            gaps.append(
                f"LST market dominated by single issuer ({profile.l3.largest_lst_issuer_share_pct.value:.0f}% share) — anti-monopoly red flag."
            )
        if profile.l3.liquidization_rate_pct.value >= 30.0:
            strengths.append(
                f"Liquidization rate {profile.l3.liquidization_rate_pct.value:.0f}% is healthy (S2-mature)."
            )

    # Withdrawals
    if profile.l3 is not None and not profile.l3.native_redemption_available.value:
        gaps.append("Native LST redemption not yet enabled — S2→S3 blocker.")

    # DeFi productivity
    if profile.l42 is not None:
        prod = profile.l42.defi_productivity_rate_pct.value
        if prod >= 30.0:
            strengths.append(f"DeFi productivity {prod:.0f}% clears the S3 threshold.")
        elif prod < 10.0:
            gaps.append(f"DeFi productivity {prod:.0f}% is low — LST is not yet productive collateral.")

    # Proximity-to-next-stage tip
    next_t = transition_for(stage)
    if next_t is not None:
        gaps.append(f"Next gate: {next_t.from_stage.value} → {next_t.to_stage.value} requires {next_t.rule}.")

    return strengths, gaps


def _confidence_notes(profile: NetworkProfile) -> list[str]:
    notes: list[str] = []
    flagged = {Confidence.DATA_GAP, Confidence.CONTESTED, Confidence.LOW}

    def _walk(layer_name: str, layer_obj) -> None:
        if layer_obj is None:
            return
        for field_name, value in layer_obj:
            if hasattr(value, "confidence") and value.confidence in flagged:
                notes.append(
                    f"`{layer_name}.{field_name}` flagged {value.confidence.value.upper()} — {value.source}"
                )

    _walk("L1", profile.l1)
    _walk("L2", profile.l2)
    _walk("L3", profile.l3)
    _walk("L4.1", profile.l41)
    _walk("L4.2", profile.l42)
    return notes


def _bd_recommendation(stage: Stage, profile: NetworkProfile) -> str:
    """Stage-driven BD playbook line. Mirrors the benchmark doc's recommendations."""
    if stage == Stage.S0:
        return (
            "**Watch list, not active target.** Network has not crossed the 2% staking-ratio "
            "floor. Ethereum reached this in ~6 months thanks to brand + locked withdrawals; without "
            "those tailwinds S0 can stall 24+ months. Revisit if a staking-incentive program or "
            "consensus-upgrade catalyst is announced."
        )
    if stage == Stage.S1:
        return (
            "**Highest-leverage BD opportunity.** Network is securing but pre-liquidization. "
            "This is where Lido captured 33% on Ethereum. Pitch a liquid-staking product before a "
            "dominant issuer emerges. Look for staking ratio >5% with no LST above 15%."
        )
    if stage == Stage.S2:
        return (
            "**Active BD target.** LST market is forming. Push for DeFi integrations (lending + AMM) "
            "to break the 30% defi-productivity barrier and unlock withdrawals-enabled DeFi flywheel. "
            "Per benchmark: Ethereum's analog moment was Q1 2023, pre-Shapella."
        )
    if stage == Stage.S3:
        return (
            "**Productive integrations stage.** Network has DeFi-productive LSTs and withdrawals. "
            "Restaking primitives are the next gate but the benchmark warns against premature restaking "
            "investment — wait 18–24 months of LST market stability before bullish on restaking pitches."
        )
    if stage == Stage.S4_1:
        return (
            "**Restaking-era opportunity, with caution.** Restaking is live but funnel is fragile "
            "(see EigenLayer Apr 2025 slashing crash). Pitch composability primitives — yield "
            "tokenization, looping markets, LRT-collateralized lending. Avoid bundling pitches with "
            "restaking-only narratives."
        )
    if stage == Stage.S4_2:
        return (
            "**Mature funnel.** All conversion ratios qualify for category-leadership pitches. "
            "BD focus should shift to differentiated yield products (Pendle-equivalents), "
            "cross-chain LST distribution, and institutional structured products."
        )
    if stage == Stage.S_STAR:
        return (
            "**Native liquid staking — non-standard funnel.** Staked positions are inherently liquid; "
            "L3 evaluation does not apply. Focus BD on L4.2 productivity and L4.1 restaking analogs."
        )
    return "No specific recommendation."


def _classification_confidence(profile: NetworkProfile) -> str:
    """Aggregate confidence: lowest confidence across stage-defining KPIs."""
    relevant: list[Confidence] = [
        profile.l2.staking_ratio_pct.confidence,
    ]
    if profile.l3 is not None:
        relevant.append(profile.l3.liquidization_rate_pct.confidence)
        relevant.append(profile.l3.largest_lst_issuer_share_pct.confidence)
    if profile.l42 is not None:
        relevant.append(profile.l42.defi_productivity_rate_pct.confidence)
    if profile.l41 is not None:
        relevant.append(profile.l41.restaking_tvl_usd.confidence)

    rank = {
        Confidence.HIGH: 4,
        Confidence.MEDIUM: 3,
        Confidence.LOW: 2,
        Confidence.CONTESTED: 1,
        Confidence.DATA_GAP: 0,
    }
    worst = min(relevant, key=lambda c: rank[c])
    return worst.value


# ---------------------------------------------------------------------------
# Public entry point
# ---------------------------------------------------------------------------

def render_scorecard(
    profile: NetworkProfile,
    eth_benchmark: EthereumBenchmark,
    template_dir: Path = TEMPLATE_DIR,
) -> str:
    """Render a Markdown scorecard for a single network."""
    env = Environment(
        loader=FileSystemLoader(template_dir),
        autoescape=select_autoescape(disabled_extensions=("md", "j2")),
        trim_blocks=False,
        lstrip_blocks=False,
    )
    env.globals.update(fmt_n=_fmt_n, fmt_usd=_fmt_usd, fmt_pct=_fmt_pct, fmt_gap=_fmt_gap)
    template = env.get_template("scorecard.md.j2")

    stage = classify_stage(profile)
    ratios = compute_conversion_ratios(profile)
    eth_ratios = compute_conversion_ratios(eth_benchmark.snapshot)
    scores = score_vs_ethereum(profile, eth_benchmark)
    strengths, gaps = _strengths_and_gaps(profile, eth_benchmark, stage)
    confidence_notes = _confidence_notes(profile)
    bd_recommendation = _bd_recommendation(stage, profile)
    trajectory = trajectory_position(profile, eth_benchmark.history)

    return template.render(
        profile=profile,
        stage=stage,
        ratios=ratios,
        eth_ratios=eth_ratios,
        ratio_labels=_RATIO_LABELS,
        scores=scores,
        strengths=strengths,
        gaps=gaps,
        confidence_notes=confidence_notes,
        classification_confidence=_classification_confidence(profile),
        bd_recommendation=bd_recommendation,
        trajectory=trajectory,
        generated_at=datetime.now(timezone.utc).strftime("%Y-%m-%d"),
    )


# ---------------------------------------------------------------------------
# HTML wrapper for localhost viewing
# ---------------------------------------------------------------------------

def _md_to_html(markdown_text: str) -> str:
    return md.markdown(markdown_text, extensions=["tables", "fenced_code"])


def wrap_html_page(
    markdown_body: str,
    title: str,
    template_dir: Path = TEMPLATE_DIR,
) -> str:
    """Convert a Markdown scorecard or index to a styled standalone HTML page."""
    env = Environment(
        loader=FileSystemLoader(template_dir),
        autoescape=select_autoescape(disabled_extensions=("j2",)),
    )
    page = env.get_template("page.html.j2")
    return page.render(title=title, body=_md_to_html(markdown_body))


def render_index_markdown(
    entries: list[dict],
    template_dir: Path = TEMPLATE_DIR,
) -> str:
    """Render the index page as Markdown (then wrap_html_page converts to HTML)."""
    env = Environment(
        loader=FileSystemLoader(template_dir),
        autoescape=select_autoescape(disabled_extensions=("md", "j2")),
        trim_blocks=False,
        lstrip_blocks=False,
    )
    template = env.get_template("index.html.j2")
    return template.render(
        entries=entries,
        generated_at=datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M UTC"),
    )
