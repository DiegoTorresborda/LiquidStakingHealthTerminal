"use client";

import { useEffect, useState, useCallback } from "react";
import networksGenerated from "@data/networks.generated.json";
import { networks as networkUniverse } from "@data/networks";
import type { RadarOverviewRecord } from "@/data/radar-overview-schema";

const radarRecords = networksGenerated as unknown as RadarOverviewRecord[];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function fmt(v: number | null | undefined, suffix = ""): string {
  if (v == null) return "—";
  if (v === 0) return `0${suffix}`;
  if (Math.abs(v) >= 1_000_000_000) return `$${(v / 1_000_000_000).toFixed(1)}B`;
  if (Math.abs(v) >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`;
  if (Math.abs(v) >= 1_000) return `$${(v / 1_000).toFixed(1)}K`;
  return `${v.toFixed(2)}${suffix}`;
}

function fmtPct(v: number | null | undefined): string {
  if (v == null) return "—";
  return `${v.toFixed(1)}%`;
}

function fmtNum(v: number | null | undefined): string {
  if (v == null) return "—";
  if (v === 0) return "0";
  return new Intl.NumberFormat("en-US", { notation: "compact" }).format(v);
}

function fmtBool(v: boolean | null | undefined): string {
  if (v == null) return "—";
  return v ? "Yes" : "No";
}

type CellVariant = "value" | "zero" | "missing";

function cellVariant(v: unknown): CellVariant {
  if (v == null) return "missing";
  if (v === 0 || v === false) return "zero";
  return "value";
}

const CELL_CLS: Record<CellVariant, string> = {
  value: "text-ink-100",
  zero: "text-amber-400/70",
  missing: "text-ink-500 italic",
};

function Cell({ v, fmt: formatter }: { v: unknown; fmt: string }) {
  const variant = cellVariant(v);
  return (
    <td className={`whitespace-nowrap px-3 py-2 text-xs tabular-nums ${CELL_CLS[variant]}`}>
      {formatter}
    </td>
  );
}

// ─── Main page ───────────────────────────────────────────────────────────────

export default function NetworksPage() {
  const [hiddenIds, setHiddenIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/network-visibility")
      .then((r) => r.json())
      .then((d) => setHiddenIds(d.hidden ?? []))
      .finally(() => setLoading(false));
  }, []);

  const toggle = useCallback(
    async (networkId: string) => {
      const isHidden = hiddenIds.includes(networkId);
      setToggling(networkId);
      try {
        const res = await fetch("/api/admin/network-visibility", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ networkId, hidden: !isHidden }),
        });
        const data = await res.json();
        if (data.ok) setHiddenIds(data.hidden);
      } finally {
        setToggling(null);
      }
    },
    [hiddenIds]
  );

  return (
    <div className="flex flex-col gap-6">
      {/* ── Visibility section ──────────────────────────────────────────────── */}
      <section className="rounded-2xl border border-ink-300/20 bg-slateglass-700/45 p-5 shadow-card">
        <div className="mb-4">
          <h2 className="font-[var(--font-heading)] text-2xl font-semibold text-ink-50">
            Network Visibility
          </h2>
          <p className="mt-1 text-sm text-ink-300">
            Hidden networks are excluded from the public dashboard. Toggle to show or hide.
          </p>
        </div>

        {loading ? (
          <p className="text-sm text-ink-400">Loading…</p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {networkUniverse.map((n) => {
              const isHidden = hiddenIds.includes(n.networkId);
              const isBusy = toggling === n.networkId;
              return (
                <div
                  key={n.networkId}
                  className={`rounded-xl border p-4 transition-colors ${
                    isHidden
                      ? "border-red-400/20 bg-red-900/10 opacity-60"
                      : "border-ink-300/20 bg-ink-900/20"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-ink-50">{n.network}</p>
                      <p className="text-xs text-ink-400">{n.token} · {n.category}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggle(n.networkId)}
                      disabled={isBusy}
                      className={`shrink-0 rounded-full border px-2.5 py-1 text-xs font-semibold transition disabled:cursor-wait ${
                        isHidden
                          ? "border-red-400/30 bg-red-900/25 text-red-300 hover:bg-red-900/40"
                          : "border-emerald-400/30 bg-emerald-900/25 text-emerald-300 hover:bg-emerald-900/40"
                      }`}
                    >
                      {isBusy ? "…" : isHidden ? "Hidden" : "Visible"}
                    </button>
                  </div>

                  {isHidden && (
                    <p className="mt-2 text-[10px] uppercase tracking-widest text-red-400/60">
                      Hidden from dashboard
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ── Data overview table ─────────────────────────────────────────────── */}
      <section className="rounded-2xl border border-ink-300/20 bg-slateglass-700/45 p-5 shadow-card">
        <div className="mb-4">
          <h2 className="font-[var(--font-heading)] text-2xl font-semibold text-ink-50">
            Network Data Overview
          </h2>
          <p className="mt-1 text-sm text-ink-300">
            Key fields per chain.{" "}
            <span className="text-amber-400/80">Amber = zero</span>,{" "}
            <span className="text-ink-500">gray italic = missing</span>.
          </p>
        </div>

        <div className="overflow-x-auto rounded-xl border border-ink-300/15">
          <table className="w-full border-collapse text-left text-xs">
            <thead>
              <tr className="border-b border-ink-300/15 bg-ink-900/40">
                {[
                  "Network", "Token", "Mkt Cap", "Price", "Vol 24h",
                  "Staking %", "APY", "Validators", "DeFi TVL",
                  "LST TVL", "LST Pen%", "Audits", "Timelock",
                  "Coverage", "Quality", "Status"
                ].map((h) => (
                  <th
                    key={h}
                    className="whitespace-nowrap px-3 py-2.5 text-[10px] font-semibold uppercase tracking-widest text-ink-400"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {networkUniverse.map((n) => {
                const r = radarRecords.find((rec) => rec.networkId === n.networkId);
                const isHidden = hiddenIds.includes(n.networkId);
                return (
                  <tr
                    key={n.networkId}
                    className={`border-b border-ink-300/10 transition-colors hover:bg-ink-900/20 ${
                      isHidden ? "opacity-40" : ""
                    }`}
                  >
                    <td className="whitespace-nowrap px-3 py-2 text-xs font-semibold text-ink-50">
                      {n.network}
                      {isHidden && (
                        <span className="ml-1.5 rounded border border-red-400/30 px-1 py-0.5 text-[9px] text-red-400">
                          hidden
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-2 text-xs text-ink-300">{n.token}</td>
                    <Cell v={r?.marketCapUsd} fmt={fmt(r?.marketCapUsd)} />
                    <Cell v={r?.priceUsd} fmt={r?.priceUsd != null ? `$${r.priceUsd.toFixed(4)}` : "—"} />
                    <Cell v={r?.volume24hUsd} fmt={fmt(r?.volume24hUsd)} />
                    <Cell v={r?.stakingRatioPct} fmt={fmtPct(r?.stakingRatioPct)} />
                    <Cell v={r?.stakingApyPct} fmt={fmtPct(r?.stakingApyPct)} />
                    <Cell v={r?.validatorCount} fmt={fmtNum(r?.validatorCount)} />
                    <Cell v={r?.defiTvlUsd} fmt={fmt(r?.defiTvlUsd)} />
                    <Cell v={r?.lstTvlUsd} fmt={fmt(r?.lstTvlUsd)} />
                    <Cell v={r?.lstPenetrationPct} fmt={fmtPct(r?.lstPenetrationPct)} />
                    <Cell v={r?.auditCount} fmt={r?.auditCount != null ? String(r.auditCount) : "—"} />
                    <Cell v={r?.hasTimelock} fmt={fmtBool(r?.hasTimelock)} />
                    <Cell
                      v={r?.dataCoveragePct ?? 0}
                      fmt={r?.dataCoveragePct != null ? `${r.dataCoveragePct.toFixed(0)}%` : "—"}
                    />
                    <td className="px-3 py-2 text-xs">
                      <span
                        className={`rounded border px-1.5 py-0.5 text-[10px] font-medium ${
                          r?.quality === "observed"
                            ? "border-emerald-400/30 text-emerald-400"
                            : r?.quality === "inferred"
                              ? "border-amber-400/30 text-amber-400"
                              : "border-ink-400/30 text-ink-400"
                        }`}
                      >
                        {r?.quality ?? "—"}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-xs text-ink-300">{n.status}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
