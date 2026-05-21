"use client"

import { useMemo, useState } from "react"

import type { Network } from "@data/networks"
import { StageBadge } from "@/features/benchmarks/stage-badge"

import { MAX_COMPARE } from "./url-state"

type Props = {
  selectableNetworks: Network[]   // already excludes Ethereum
  selectedIds: string[]
  onToggle: (id: string) => void
  onClear: () => void
}

export function NetworkPicker({ selectableNetworks, selectedIds, onToggle, onClear }: Props) {
  const [query, setQuery] = useState("")

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return selectableNetworks
    return selectableNetworks.filter(
      (n) =>
        n.network.toLowerCase().includes(q) ||
        n.token.toLowerCase().includes(q) ||
        n.networkId.toLowerCase().includes(q),
    )
  }, [query, selectableNetworks])

  const atMax = selectedIds.length >= MAX_COMPARE

  return (
    <section className="flex flex-col gap-4 rounded-2xl border border-ink-300/20 bg-slateglass-700/45 p-5 shadow-glow backdrop-blur">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-ink-300">Select networks</p>
          <h2 className="mt-1 font-[var(--font-heading)] text-xl font-semibold text-ink-50">
            Compare up to {MAX_COMPARE} networks vs Ethereum
          </h2>
          <p className="mt-1 text-xs text-ink-300">
            Ethereum is always shown as the baseline reference. Pick any combination of emerging
            networks to overlay on top.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-ink-300">
          <span>
            {selectedIds.length} / {MAX_COMPARE} selected
          </span>
          {selectedIds.length > 0 && (
            <button
              type="button"
              onClick={onClear}
              className="rounded-md border border-ink-300/25 px-2 py-1 text-ink-100 transition-colors hover:border-rose-400/40 hover:text-rose-300"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      <input
        type="search"
        placeholder="Filter networks by name or ticker…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full rounded-md border border-ink-300/20 bg-ink-900/40 px-3 py-2 text-sm text-ink-50 placeholder:text-ink-400 focus:border-sky-400/60 focus:outline-none"
      />

      <div className="flex flex-wrap gap-2">
        {filtered.map((n) => {
          const isSelected = selectedIds.includes(n.networkId)
          const disabled = !isSelected && atMax
          return (
            <button
              key={n.networkId}
              type="button"
              onClick={() => onToggle(n.networkId)}
              disabled={disabled}
              className={`group inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition-all ${
                isSelected
                  ? "border-sky-400/70 bg-sky-500/20 text-ink-50 ring-1 ring-sky-500/30"
                  : disabled
                  ? "cursor-not-allowed border-ink-300/15 bg-ink-900/20 text-ink-400"
                  : "border-ink-300/25 bg-ink-900/30 text-ink-100 hover:border-sky-400/40 hover:bg-sky-500/10 hover:text-ink-50"
              }`}
              title={disabled ? `Max ${MAX_COMPARE} networks. Deselect one to add another.` : undefined}
            >
              <span className="font-medium">{n.network}</span>
              {n.paf && <StageBadge stage={n.paf.stage} compact />}
              <span
                className={`text-xs ${
                  isSelected ? "text-sky-200" : "text-ink-400"
                }`}
                aria-hidden
              >
                {isSelected ? "✕" : "＋"}
              </span>
            </button>
          )
        })}
        {filtered.length === 0 && (
          <p className="text-sm text-ink-300">No networks match &quot;{query}&quot;.</p>
        )}
      </div>
    </section>
  )
}
