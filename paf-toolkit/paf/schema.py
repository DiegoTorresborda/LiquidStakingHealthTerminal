"""Data models for the PoS Adoption Funnel toolkit.

Every KPI is wrapped in a `KPI[T]` envelope carrying value, as_of date,
source citation, and confidence enum. Layers (L1..L4.2) are explicit
models, and `NetworkProfile` is the top-level aggregate.
"""

from __future__ import annotations

from datetime import date
from enum import Enum
from typing import Generic, Optional, TypeVar

from pydantic import BaseModel, ConfigDict, Field

T = TypeVar("T")


class Confidence(str, Enum):
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"
    DATA_GAP = "data_gap"
    CONTESTED = "contested"


class Stage(str, Enum):
    S0 = "S0"
    S1 = "S1"
    S2 = "S2"
    S3 = "S3"
    S4_1 = "S4.1"
    S4_2 = "S4.2"
    S_STAR = "S*"  # native liquid staking — L3 evaluation skipped


class ConsensusType(str, Enum):
    POS = "pos"
    DPOS = "dpos"
    NPOS = "npos"   # Nominated PoS (Polkadot, Kusama)
    LPOS = "lpos"   # Liquid PoS (Tezos)
    BFT_POS = "bft_pos"
    OTHER = "other"


class KPI(BaseModel, Generic[T]):
    """A single observation: value + provenance + confidence."""

    model_config = ConfigDict(frozen=True)

    value: T
    as_of: date
    source: str = Field(min_length=1)
    confidence: Confidence


class SourceBreakdown(BaseModel):
    """Where the stake comes from. Percentages should sum to ~100."""

    model_config = ConfigDict(frozen=True)

    solo_pct: float
    liquid_staking_pct: float
    cex_pct: float
    other_pct: float


class LayerL1(BaseModel):
    """Native token adoption.

    `native_price_usd` is the spot price of the native token. All USD-denominated
    KPIs below should be internally consistent with this price — `paf.derive`
    provides a helper to recompute and a test asserts the YAML values match the
    derived ones within tolerance.
    """

    circulating_supply: KPI[float]
    native_price_usd: KPI[float]
    market_cap_usd: KPI[float]
    net_issuance_annualized_pct: KPI[float]
    holder_count: KPI[int]
    active_addresses_30d: KPI[int]
    top100_concentration_ex_protocols_pct: KPI[float]
    cex_dex_depth_2pct_usd: KPI[float]
    token_age_months: KPI[int]


class LayerL2(BaseModel):
    """Staking security."""

    total_staked: KPI[float]
    staking_ratio_pct: KPI[float]
    active_validators: KPI[int]
    distinct_operators: KPI[int]
    nakamoto_coefficient: KPI[int]
    nominal_yield_pct: KPI[float]
    real_yield_pct: KPI[float]
    slashing_events_cumulative: KPI[int]
    eth_slashed_cumulative: KPI[float]
    unbonding_period_days: KPI[float]
    min_stake_native: KPI[float]
    client_diversity_hhi: KPI[float]
    source_breakdown: KPI[SourceBreakdown]


class LayerL3(BaseModel):
    """Liquid staking."""

    lst_tvl_usd: KPI[float]
    liquidization_rate_pct: KPI[float]
    num_lst_issuers_above_5pct: KPI[int]
    lst_issuer_hhi: KPI[float]
    largest_lst_issuer_share_pct: KPI[float]
    median_peg_deviation_90d_bps: KPI[float]
    native_redemption_available: KPI[bool]


class LayerL41(BaseModel):
    """Restaking / LRT — optional. Networks pre-S4.1 set this to None."""

    restaking_tvl_usd: KPI[float]
    restaking_rate_pct: KPI[float]
    lrt_count: KPI[int]
    lrt_hhi: KPI[float]
    avs_count_live: KPI[int]


class LayerL42(BaseModel):
    """LST productivity in DeFi."""

    lst_in_defi_tvl_usd: KPI[float]
    defi_productivity_rate_pct: KPI[float]
    num_lending_integrations: KPI[int]
    num_amm_integrations: KPI[int]
    num_cdp_integrations: KPI[int]
    looping_supported: KPI[bool]
    pendle_equivalent_tvl_usd: KPI[float]
    l2_lst_bridged_usd: Optional[KPI[float]] = None  # n/a for non-rollup-host chains


class NetworkProfile(BaseModel):
    """Top-level network description: metadata + 5 funnel layers."""

    model_config = ConfigDict(frozen=True)

    # Metadata
    name: str
    ticker: str
    genesis_date: date
    consensus_type: ConsensusType
    native_liquid_staking_flag: bool = False  # if True, L3 evaluation maps to S*

    # Layers
    l1: LayerL1
    l2: LayerL2
    l3: Optional[LayerL3] = None       # may be absent for very early networks
    l41: Optional[LayerL41] = None     # restaking is optional
    l42: Optional[LayerL42] = None     # DeFi productivity is optional


class HistoricalSnapshot(BaseModel):
    """One quarterly observation on the reference (Ethereum) trajectory."""

    model_config = ConfigDict(frozen=True)

    quarter: str            # e.g. "2023-Q2"
    as_of: date
    stage: Stage
    staking_ratio_pct: float
    liquidization_rate_pct: Optional[float] = None
    defi_productivity_rate_pct: Optional[float] = None
    restaking_rate_pct: Optional[float] = None
    lst_tvl_usd: Optional[float] = None
    restaking_tvl_usd: Optional[float] = None
    note: Optional[str] = None


class EthereumBenchmark(BaseModel):
    """Calibration reference: current snapshot + quarterly history."""

    model_config = ConfigDict(frozen=True)

    snapshot: NetworkProfile
    history: list[HistoricalSnapshot]
