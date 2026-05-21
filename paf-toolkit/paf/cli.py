"""`paf` command-line entry point."""

from __future__ import annotations

import subprocess
import sys
from pathlib import Path

import click

from .compare import build_matrix, plot_funnel_positions, plot_trajectory_overlay
from .loader import load_ethereum_benchmark, load_network
from .report import render_index_markdown, render_scorecard, wrap_html_page
from .scoring import classify_stage, trajectory_position


REPO_ROOT = Path(__file__).resolve().parents[1]
DEFAULT_BENCHMARK = REPO_ROOT / "data" / "benchmark" / "ethereum.yaml"
DEFAULT_NETWORKS_DIR = REPO_ROOT / "data" / "networks"
DEFAULT_OUTPUTS_DIR = REPO_ROOT / "outputs"


@click.group()
def cli() -> None:
    """PoS Adoption Funnel toolkit."""


@cli.command()
@click.argument("network_yaml", type=click.Path(exists=True, dir_okay=False, path_type=Path))
@click.option(
    "--benchmark", "benchmark_path",
    type=click.Path(exists=True, dir_okay=False, path_type=Path),
    default=DEFAULT_BENCHMARK,
    show_default=True,
)
@click.option(
    "--out", "out_dir",
    type=click.Path(file_okay=False, path_type=Path),
    default=DEFAULT_OUTPUTS_DIR,
    show_default=True,
)
def score(network_yaml: Path, benchmark_path: Path, out_dir: Path) -> None:
    """Score a single network YAML and emit a scorecard."""
    bench = load_ethereum_benchmark(benchmark_path)
    profile = load_network(network_yaml)
    md = render_scorecard(profile, bench)

    out_dir.mkdir(parents=True, exist_ok=True)
    md_path = out_dir / f"{profile.ticker.lower()}_scorecard.md"
    html_path = out_dir / f"{profile.ticker.lower()}_scorecard.html"
    md_path.write_text(md)
    html_path.write_text(wrap_html_page(md, title=f"{profile.name} — PAF Scorecard"))
    click.echo(md)
    click.echo(f"\nWrote {md_path}", err=True)
    click.echo(f"Wrote {html_path}", err=True)


@cli.command()
@click.option(
    "--networks-dir", "networks_dir",
    type=click.Path(exists=True, file_okay=False, path_type=Path),
    default=DEFAULT_NETWORKS_DIR,
    show_default=True,
)
@click.option(
    "--benchmark", "benchmark_path",
    type=click.Path(exists=True, dir_okay=False, path_type=Path),
    default=DEFAULT_BENCHMARK,
    show_default=True,
)
@click.option(
    "--out", "out_dir",
    type=click.Path(file_okay=False, path_type=Path),
    default=DEFAULT_OUTPUTS_DIR,
    show_default=True,
)
def compare(networks_dir: Path, benchmark_path: Path, out_dir: Path) -> None:
    """Build the cross-network matrix CSV and comparison charts."""
    bench = load_ethereum_benchmark(benchmark_path)

    yamls = sorted(p for p in networks_dir.glob("*.yaml") if not p.name.startswith("_"))
    if not yamls:
        click.echo(f"No network YAMLs found in {networks_dir}", err=True)
        sys.exit(1)

    profiles = [load_network(p) for p in yamls]
    df = build_matrix(profiles, bench)

    out_dir.mkdir(parents=True, exist_ok=True)
    csv_path = out_dir / "matrix.csv"
    df.to_csv(csv_path, index=False)
    click.echo(f"Wrote {csv_path}")

    funnel_path = plot_funnel_positions(profiles, bench, out_dir / "funnel_positions.png")
    click.echo(f"Wrote {funnel_path}")

    trajectory_path = plot_trajectory_overlay(profiles, bench.history, out_dir / "trajectory_overlay.png")
    click.echo(f"Wrote {trajectory_path}")


@cli.command()
@click.option(
    "--benchmark", "benchmark_path",
    type=click.Path(exists=True, dir_okay=False, path_type=Path),
    default=DEFAULT_BENCHMARK,
    show_default=True,
)
@click.option(
    "--networks-dir", "networks_dir",
    type=click.Path(file_okay=False, path_type=Path),
    default=DEFAULT_NETWORKS_DIR,
    show_default=True,
)
@click.option(
    "--out", "out_dir",
    type=click.Path(file_okay=False, path_type=Path),
    default=DEFAULT_OUTPUTS_DIR,
    show_default=True,
)
@click.option("--port", default=8000, show_default=True, help="Localhost port.")
@click.option(
    "--no-server", is_flag=True,
    help="Only regenerate HTML; don't start the server.",
)
def serve(
    benchmark_path: Path,
    networks_dir: Path,
    out_dir: Path,
    port: int,
    no_server: bool,
) -> None:
    """Render scorecards to HTML, build index, and serve on localhost."""
    bench = load_ethereum_benchmark(benchmark_path)
    out_dir.mkdir(parents=True, exist_ok=True)

    # Profiles: the benchmark snapshot (always) + every network YAML found.
    profiles = [bench.snapshot]
    if networks_dir.exists():
        for p in sorted(networks_dir.glob("*.yaml")):
            if p.name.startswith("_"):
                continue
            profiles.append(load_network(p))

    entries = []
    for profile in profiles:
        md_text = render_scorecard(profile, bench)
        stem = profile.ticker.lower()
        md_path = out_dir / f"{stem}_scorecard.md"
        html_path = out_dir / f"{stem}_scorecard.html"
        md_path.write_text(md_text)
        html_path.write_text(
            wrap_html_page(md_text, title=f"{profile.name} — PAF Scorecard")
        )
        entries.append({
            "name": profile.name,
            "ticker": profile.ticker,
            "stage": classify_stage(profile).value,
            "staking_pct": profile.l2.staking_ratio_pct.value,
            "liquidization": (
                f"{profile.l3.liquidization_rate_pct.value:.1f}%"
                if profile.l3 else "—"
            ),
            "trajectory": trajectory_position(profile, bench.history).replace(
                "comparable to ETH ", ""
            ),
            "href": f"{stem}_scorecard.html",
        })
        click.echo(f"Wrote {html_path}")

    index_md = render_index_markdown(entries)
    index_path = out_dir / "index.html"
    index_path.write_text(wrap_html_page(index_md, title="PAF Toolkit — Index"))
    click.echo(f"Wrote {index_path}")

    if no_server:
        return

    click.echo(f"\nServing {out_dir} at http://localhost:{port}/  (Ctrl+C to stop)")
    subprocess.run(
        [sys.executable, "-m", "http.server", str(port)],
        cwd=out_dir,
    )


@cli.command("validate-benchmark")
def validate_benchmark() -> None:
    """Run the calibration test suite (Ethereum must classify as S4.2)."""
    result = subprocess.run(
        [sys.executable, "-m", "pytest", "tests/", "-v"],
        cwd=REPO_ROOT,
    )
    sys.exit(result.returncode)


if __name__ == "__main__":
    cli()
