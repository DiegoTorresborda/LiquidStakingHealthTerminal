"use client";

import { useEffect, useMemo, useState } from "react";

type SyncSource = "coingecko" | "defillama" | "dexscreener" | "explorer" | "all";

type SyncState = {
  dataset?: {
    networkCount: number;
    lastUpdatedAt: string | null;
  };
  syncStatus?: {
    updatedAt: string | null;
    sources: Record<string, { status: string; updatedNetworks: number; endedAt: string; message?: string }>;
  };
  snapshots?: Record<string, string | null>;
};

const ACTIONS: Array<{ source: SyncSource; label: string; disabled?: boolean }> = [
  { source: "coingecko", label: "Sync CoinGecko" },
  { source: "defillama", label: "Sync DefiLlama" },
  { source: "dexscreener", label: "Sync Dexscreener" },
  { source: "explorer", label: "Sync Explorer metrics", disabled: true },
  { source: "all", label: "Sync All Sources" }
];

export default function AdminDataSyncPage() {
  const [state, setState] = useState<SyncState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeSource, setActiveSource] = useState<SyncSource | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function loadState() {
    const response = await fetch("/api/admin/data-sync", { cache: "no-store" });
    const payload = (await response.json()) as SyncState;
    setState(payload);
  }

  useEffect(() => {
    loadState()
      .catch(() => setMessage("Failed to load sync status"))
      .finally(() => setIsLoading(false));
  }, []);

  async function triggerSync(source: SyncSource) {
    setMessage(null);
    setActiveSource(source);

    try {
      const response = await fetch("/api/admin/data-sync", {
        method: "POST",
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify({ source })
      });

      const payload = (await response.json().catch(() => null)) as
        | { ok?: boolean; error?: string; dataset?: SyncState["dataset"] }
        | null;

      if (!response.ok || !payload?.ok) {
        setMessage(payload?.error ?? "Sync failed");
      } else {
        setMessage(`Sync completed: ${source}`);
      }

      await loadState();
    } catch {
      setMessage("Sync request failed");
    } finally {
      setActiveSource(null);
    }
  }

  const sourceRows = useMemo(() => Object.entries(state?.syncStatus?.sources ?? {}), [state]);

  return (
    <section className="space-y-4">
      <article className="rounded-xl border border-ink-300/20 bg-slateglass-700/40 p-4 shadow-card">
        <p className="text-xs uppercase tracking-[0.16em] text-ink-300">Data Sync</p>
        <h2 className="mt-1 text-xl font-semibold text-ink-50">Run Source Refresh</h2>
        <p className="mt-2 text-sm text-ink-100">
          Each action fetches source data, stores a raw snapshot, and rebuilds `data/networks.generated.json`.
        </p>

        <div className="mt-4 grid gap-2 md:grid-cols-2 xl:grid-cols-3">
          {ACTIONS.map((action) => {
            const running = activeSource === action.source;
            return (
              <button
                key={action.source}
                type="button"
                onClick={() => triggerSync(action.source)}
                disabled={activeSource !== null || action.disabled === true}
                className="rounded-lg border border-[#7baff5]/40 bg-[#7baff5]/15 px-3 py-2 text-sm font-semibold text-[#dcecff] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {running ? "Running..." : action.label}
                {action.disabled ? " (coming soon)" : ""}
              </button>
            );
          })}
        </div>

        {message ? <p className="mt-3 text-sm text-ink-100">{message}</p> : null}
      </article>

      <article className="rounded-xl border border-ink-300/20 bg-slateglass-700/40 p-4 shadow-card">
        <h3 className="text-lg font-semibold text-ink-50">Current Status</h3>
        {isLoading ? <p className="mt-2 text-sm text-ink-100">Loading...</p> : null}

        {state?.dataset ? (
          <div className="mt-2 text-sm text-ink-100">
            <p>Networks in dataset: {state.dataset.networkCount}</p>
            <p>Last dataset update: {state.dataset.lastUpdatedAt ?? "Unknown"}</p>
          </div>
        ) : null}

        <div className="mt-4 grid gap-2 md:grid-cols-2">
          {sourceRows.length === 0 ? <p className="text-sm text-ink-100">No sync history yet.</p> : null}
          {sourceRows.map(([source, sourceStatus]) => (
            <div key={source} className="rounded-lg border border-ink-300/20 bg-ink-900/25 p-3">
              <p className="text-xs uppercase tracking-[0.14em] text-ink-300">{source}</p>
              <p className={`text-sm font-semibold ${sourceStatus.status === "ok" ? "text-mint" : "text-coral"}`}>
                {sourceStatus.status.toUpperCase()}
              </p>
              <p className="text-xs text-ink-200">Updated networks: {sourceStatus.updatedNetworks}</p>
              <p className="text-xs text-ink-300">{sourceStatus.endedAt}</p>
              {sourceStatus.message ? <p className="mt-1 text-xs text-coral">{sourceStatus.message}</p> : null}
            </div>
          ))}
        </div>

        <div className="mt-4 grid gap-2 md:grid-cols-2">
          {Object.entries(state?.snapshots ?? {}).map(([source, snapshotPath]) => (
            <div key={source} className="rounded-lg border border-ink-300/20 bg-ink-900/25 p-3">
              <p className="text-xs uppercase tracking-[0.14em] text-ink-300">Latest raw snapshot: {source}</p>
              <p className="mt-1 break-all text-xs text-ink-100">{snapshotPath ?? "No snapshot"}</p>
            </div>
          ))}
        </div>
      </article>
    </section>
  );
}
