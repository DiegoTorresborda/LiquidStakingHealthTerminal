"use client";

import { useEffect, useMemo, useState } from "react";

import { networks } from "@data/networks";

type ResourceEntry = {
  label: string;
  url: string;
  category: string;
  priority: number;
  description?: string;
};

const CATEGORIES = [
  "official",
  "docs",
  "explorer",
  "staking",
  "governance",
  "developer",
  "ecosystem",
  "analytics",
  "community",
  "validators",
  "liquidity",
  "bridges"
];

export default function AdminResourcesPage() {
  const [registry, setRegistry] = useState<Record<string, ResourceEntry[]>>({});
  const [selectedNetworkId, setSelectedNetworkId] = useState(networks[0]?.networkId ?? "");
  const [rows, setRows] = useState<ResourceEntry[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function loadRegistry() {
    const response = await fetch("/api/admin/resources", { cache: "no-store" });
    const payload = (await response.json()) as { resources?: Record<string, ResourceEntry[]> };
    setRegistry(payload.resources ?? {});
  }

  useEffect(() => {
    loadRegistry().catch(() => setMessage("Failed to load chain resources"));
  }, []);

  useEffect(() => {
    setRows(registry[selectedNetworkId] ?? []);
  }, [registry, selectedNetworkId]);

  const networkName = useMemo(() => networks.find((item) => item.networkId === selectedNetworkId)?.network, [selectedNetworkId]);

  function updateRow(index: number, patch: Partial<ResourceEntry>) {
    setRows((current) => current.map((row, rowIndex) => (rowIndex === index ? { ...row, ...patch } : row)));
  }

  function addRow() {
    setRows((current) => [
      ...current,
      {
        label: "",
        url: "",
        category: "official",
        priority: 1,
        description: ""
      }
    ]);
  }

  function removeRow(index: number) {
    setRows((current) => current.filter((_, rowIndex) => rowIndex !== index));
  }

  async function save() {
    if (!selectedNetworkId) {
      setMessage("Select a network first");
      return;
    }

    setIsSaving(true);
    setMessage(null);

    try {
      const response = await fetch("/api/admin/resources", {
        method: "POST",
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify({
          networkId: selectedNetworkId,
          resources: rows
        })
      });

      const payload = (await response.json().catch(() => null)) as
        | { ok?: boolean; error?: string; resources?: Record<string, ResourceEntry[]> }
        | null;

      if (!response.ok || !payload?.ok) {
        setMessage(payload?.error ?? "Failed to save resources");
        return;
      }

      setRegistry(payload.resources ?? {});
      setMessage("Resources saved");
    } catch {
      setMessage("Save request failed");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <section className="space-y-4">
      <article className="rounded-xl border border-ink-300/20 bg-slateglass-700/40 p-4 shadow-card">
        <p className="text-xs uppercase tracking-[0.16em] text-ink-300">Chain Resources</p>
        <h2 className="mt-1 text-xl font-semibold text-ink-50">Resources Registry Editor</h2>
        <p className="mt-2 text-sm text-ink-100">Edit curated links by network and category.</p>

        <label className="mt-4 block max-w-sm">
          <span className="mb-2 block text-xs uppercase tracking-[0.14em] text-ink-300">Network</span>
          <select
            value={selectedNetworkId}
            onChange={(event) => setSelectedNetworkId(event.target.value)}
            className="w-full rounded-lg border border-ink-300/25 bg-slateglass-600/70 px-3 py-2 text-sm text-ink-50"
          >
            {networks.map((network) => (
              <option key={network.networkId} value={network.networkId}>
                {network.network} ({network.token})
              </option>
            ))}
          </select>
        </label>

        <p className="mt-3 text-sm text-ink-100">Editing: {networkName ?? selectedNetworkId}</p>

        <div className="mt-3 space-y-2">
          {rows.length === 0 ? <p className="text-sm text-ink-300">No resources configured for this network.</p> : null}
          {rows.map((row, index) => (
            <div key={`${row.label}-${index}`} className="grid gap-2 rounded-lg border border-ink-300/20 bg-ink-900/25 p-3 lg:grid-cols-12">
              <input
                value={row.label}
                onChange={(event) => updateRow(index, { label: event.target.value })}
                placeholder="Label"
                className="rounded-md border border-ink-300/25 bg-slateglass-600/70 px-2 py-1.5 text-sm text-ink-50 lg:col-span-2"
              />
              <input
                value={row.url}
                onChange={(event) => updateRow(index, { url: event.target.value })}
                placeholder="URL"
                className="rounded-md border border-ink-300/25 bg-slateglass-600/70 px-2 py-1.5 text-sm text-ink-50 lg:col-span-4"
              />
              <select
                value={row.category}
                onChange={(event) => updateRow(index, { category: event.target.value })}
                className="rounded-md border border-ink-300/25 bg-slateglass-600/70 px-2 py-1.5 text-sm text-ink-50 lg:col-span-2"
              >
                {CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <input
                value={row.priority}
                onChange={(event) => updateRow(index, { priority: Number(event.target.value) })}
                placeholder="Priority"
                type="number"
                className="rounded-md border border-ink-300/25 bg-slateglass-600/70 px-2 py-1.5 text-sm text-ink-50 lg:col-span-1"
              />
              <input
                value={row.description ?? ""}
                onChange={(event) => updateRow(index, { description: event.target.value })}
                placeholder="Description (optional)"
                className="rounded-md border border-ink-300/25 bg-slateglass-600/70 px-2 py-1.5 text-sm text-ink-50 lg:col-span-2"
              />
              <button
                type="button"
                onClick={() => removeRow(index)}
                className="rounded-md border border-coral/40 bg-coral/15 px-2 py-1.5 text-xs font-semibold text-coral lg:col-span-1"
              >
                Delete
              </button>
            </div>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={addRow}
            className="rounded-lg border border-ink-300/30 bg-ink-900/25 px-3 py-2 text-sm font-semibold text-ink-50"
          >
            Add resource
          </button>
          <button
            type="button"
            onClick={save}
            disabled={isSaving}
            className="rounded-lg border border-[#7baff5]/40 bg-[#7baff5]/15 px-3 py-2 text-sm font-semibold text-[#dcecff] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSaving ? "Saving..." : "Save resources"}
          </button>
        </div>

        {message ? <p className="mt-3 text-sm text-ink-100">{message}</p> : null}
      </article>
    </section>
  );
}
