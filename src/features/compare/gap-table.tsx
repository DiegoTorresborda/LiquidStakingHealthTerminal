"use client"

import { useMemo, useState } from "react"

import type { Network } from "@data/networks"

const RATIOS: Array<{
  key: keyof NonNullable<Network["paf"]>["conversionRatios"]
  short: string
}> = [
  { key: "stakingParticipationPct", short: "Staking" },
  { key: "liquidizationPct", short: "Liquid." },
  { key: "defiProductivityPct", short: "DeFi" },
  { key: "restakingPct", short: "Restake" },
  { key: "loopingDepthPct", short: "Loop" },
]

type Row = {
  networkId: string
  label: string
  gaps: Record<string, number | null> // pp difference (network - ETH); null = data missing
  meanAbsGap: number
}

type SortKey = "label" | "meanAbsGap" | (typeof RATIOS)[number]["key"]

function buildRow(network: Network, eth: Network): Row {
  const ethRatios = eth.paf?.conversionRatios
  const nRatios = network.paf?.conversionRatios
  const gaps: Record<string, number | null> = {}
  const absVals: number[] = []
  for (const { key } of RATIOS) {
    const e = ethRatios?.[key]
    const n = nRatios?.[key]
    if (e == null || n == null) {
      gaps[key] = null
      continue
    }
    const diff = n - e
    gaps[key] = diff
    absVals.push(Math.abs(diff))
  }
  const meanAbsGap = absVals.length > 0 ? absVals.reduce((a, b) => a + b, 0) / absVals.length : 0
  return { networkId: network.networkId, label: network.network, gaps, meanAbsGap }
}

function fmtGap(v: number | null): string {
  if (v == null) return "—"
  const sign = v >= 0 ? "+" : ""
  return `${sign}${v.toFixed(1)} pp`
}

function gapColor(v: number | null): string {
  if (v == null) return "text-ink-400"
  if (v >= 5) return "text-emerald-300"
  if (v <= -5) return "text-rose-300"
  return "text-ink-100"
}

export function GapTable({ entities }: { entities: Network[] }) {
  const eth = entities.find((e) => e.isBenchmark === true)
  const networks = entities.filter((e) => !e.isBenchmark)

  const [sortKey, setSortKey] = useState<SortKey>("meanAbsGap")
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc")

  const rows = useMemo(() => {
    if (!eth) return []
    return networks.map((n) => buildRow(n, eth))
  }, [networks, eth])

  const sortedRows = useMemo(() => {
    const ranked = [...rows]
    ranked.sort((a, b) => {
      let av: number | string
      let bv: number | string
      if (sortKey === "label") {
        av = a.label
        bv = b.label
      } else if (sortKey === "meanAbsGap") {
        av = a.meanAbsGap
        bv = b.meanAbsGap
      } else {
        av = a.gaps[sortKey] ?? -Infinity
        bv = b.gaps[sortKey] ?? -Infinity
      }
      if (av === bv) return 0
      const r = av < bv ? -1 : 1
      return sortDir === "asc" ? r : -r
    })
    return ranked
  }, [rows, sortKey, sortDir])

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"))
    } else {
      setSortKey(key)
      setSortDir(key === "label" ? "asc" : "desc")
    }
  }

  if (!eth || rows.length === 0) {
    return (
      <section className="rounded-2xl border border-ink-300/20 bg-slateglass-700/45 p-5 shadow-glow backdrop-blur">
        <p className="text-sm text-ink-300">
          Add at least one non-Ethereum network to compute gaps.
        </p>
      </section>
    )
  }

  return (
    <section className="rounded-2xl border border-ink-300/20 bg-slateglass-700/45 p-5 shadow-glow backdrop-blur">
      <div className="mb-4 flex flex-col gap-1">
        <p className="text-xs uppercase tracking-[0.22em] text-ink-300">Gap matrix</p>
        <h2 className="font-[var(--font-heading)] text-xl font-semibold text-ink-50">
          Deviation vs Ethereum (pp)
        </h2>
        <p className="text-xs text-ink-300">
          Positive (green) = network exceeds Ethereum on that ratio. Negative (red) = trails.
          Mean absolute gap quantifies overall distance — smaller is closer to ETH.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-xs uppercase tracking-wider text-ink-300">
            <tr className="border-b border-ink-300/20">
              <Th label="Network" sortKey="label" current={sortKey} dir={sortDir} onClick={toggleSort} align="left" />
              {RATIOS.map((ratio) => (
                <Th
                  key={ratio.key}
                  label={ratio.short}
                  sortKey={ratio.key}
                  current={sortKey}
                  dir={sortDir}
                  onClick={toggleSort}
                  align="right"
                />
              ))}
              <Th label="Mean |Δ|" sortKey="meanAbsGap" current={sortKey} dir={sortDir} onClick={toggleSort} align="right" />
            </tr>
          </thead>
          <tbody className="text-ink-100">
            {sortedRows.map((row) => (
              <tr key={row.networkId} className="border-b border-ink-300/10 hover:bg-ink-300/5">
                <td className="px-3 py-2 font-medium">{row.label}</td>
                {RATIOS.map((ratio) => {
                  const v = row.gaps[ratio.key]
                  return (
                    <td
                      key={ratio.key}
                      className={`px-3 py-2 text-right font-mono ${gapColor(v)}`}
                    >
                      {fmtGap(v)}
                    </td>
                  )
                })}
                <td className="px-3 py-2 text-right font-mono text-ink-100">
                  {row.meanAbsGap.toFixed(1)} pp
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

function Th({
  label,
  sortKey,
  current,
  dir,
  onClick,
  align,
}: {
  label: string
  sortKey: SortKey
  current: SortKey
  dir: "asc" | "desc"
  onClick: (k: SortKey) => void
  align: "left" | "right"
}) {
  const active = current === sortKey
  return (
    <th
      className={`cursor-pointer select-none whitespace-nowrap px-3 py-2 text-xs font-medium uppercase tracking-wider ${
        align === "right" ? "text-right" : "text-left"
      }`}
      onClick={() => onClick(sortKey)}
    >
      <span className={active ? "text-ink-50" : ""}>{label}</span>
      {active && <span className="ml-1 text-ink-300">{dir === "asc" ? "▲" : "▼"}</span>}
    </th>
  )
}
