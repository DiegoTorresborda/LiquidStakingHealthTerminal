"""YAML loaders for NetworkProfile and EthereumBenchmark."""

from __future__ import annotations

from pathlib import Path
from typing import Union

import yaml

from .schema import EthereumBenchmark, NetworkProfile


def load_network(path: Union[str, Path]) -> NetworkProfile:
    """Load a network YAML file into a NetworkProfile.

    Accepts either a bare NetworkProfile YAML or a benchmark-shaped YAML
    (one with a top-level `snapshot:` key) — in the latter case the snapshot
    is returned. This lets `paf score data/benchmark/ethereum.yaml` work as
    a smoke test without needing a separate command.
    """
    data = yaml.safe_load(Path(path).read_text())
    if isinstance(data, dict) and "snapshot" in data and "history" in data:
        return NetworkProfile.model_validate(data["snapshot"])
    return NetworkProfile.model_validate(data)


def load_ethereum_benchmark(path: Union[str, Path]) -> EthereumBenchmark:
    """Load the Ethereum reference YAML (current snapshot + quarterly history)."""
    data = yaml.safe_load(Path(path).read_text())
    return EthereumBenchmark.model_validate(data)
