"use client"

import { useMemo, useState } from "react"
import Link from "next/link"

import type { Network } from "@data/networks"
import type { Stage } from "@/lib/paf/types"
import { StageBadge, STAGE_ORDER } from "./stage-badge"

type Row = {
  networkId: string
  network: string
  ticker: string
  stage: Stage | null
  stakingPct: number
  liquidizationPct: number | null
  defiProductivityPct: number | null
  restakingPct: number | null
  marketCapUsd: number
  trajectory: string | null
  isBenchmark: boolean
}

type SortKey =
  | "name"
  | "stage"
  | "stakingPct"
  | "liquidizationPct"
  | "defiProductivityPct"
  | "marketCapUsd"

function fmtPct(v: number | null): string {
  if (v == null) return "—"
  return `${v.toFixed(1)}%`
}

function fmtUsd(v: number): string {
  if (v >= 1e9) return `$${(v / 1e9).toFixed(1)}B`
  if (v >= 1e6) return `$${(v / 1e6).toFixed(1)}M`
  return `$${v.toFixed(0)}`
}

function fmtGap(network: number | null, eth: number | null): string {
  if (network == null || eth == null) return "—"
  const diff = network - eth
  const sign = diff >= 0 ? "+" : ""
  return `${sign}${diff.toFixed(1)} pp`
}

export function BenchmarkTable({ networks }: { networks: Network[] }) {
  const [sortKey, setSortKey] = useState<SortKey>("stage")
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc")

  const rows: Row[] = useMemo(() => {
    return networks.map((n) => ({
      networkId: n.networkId,
      network: n.network,
      ticker: n.token,
      stage: n.paf?.stage ?? null,
      stakingPct: n.stakingRatioPct,
      liquidizationPct: n.paf?.conversionRatios.liquidizationPct ?? null,
      defiProductivityPct: n.paf?.conversionRatios.defiProductivityPct ?? null,
      restakingPct: n.paf?.conversionRatios.restakingPct ?? null,
      marketCapUsd: n.marketCapUsd,
      trajectory: n.paf?.trajectory ?? null,
      isBenchmark: n.isBenchmark === true,
    }))
  }, [networks])

  const eth = rows.find((r) => r.isBenchmark)
  const ethRatios = {
    stakingPct: eth?.stakingPct ?? null,
    liquidizationPct: eth?.liquidizationPct ?? null,
    defiProductivityPct: eth?.defiProductivityPct ?? null,
  }

  const sortedRows = useMemo(() => {
    const stageIdx = (s: Stage | null) => (s ? STAGE_ORDER.indexOf(s) : -1)
    const cmp = (a: Row, b: Row) => {
      let aVal: number | string
      let bVal: number | string
      switch (sortKey) {
        case "name":
          aVal = a.network
          bVal = b.network
          break
        case "stage":
          aVal = stageIdx(a.stage)
          bVal = stageIdx(b.stage)
          break
        case "stakingPct":
          aVal = a.stakingPct
          bVal = b.stakingPct
          break
        case "liquidizationPct":
          aVal = a.liquidizationPct ?? -1
          bVal = b.liquidizationPct ?? -1
          break
        case "defiProductivityPct":
          aVal = a.defiProductivityPct ?? -1
          bVal = b.defiProductivityPct ?? -1
          break
        case "marketCapUsd":
          aVal = a.marketCapUsd
          bVal = b.marketCapUsd
          break
      }
      if (aVal === bVal) return 0
      const result = aVal < bVal ? -1 : 1
      return sortDir === "asc" ? result : -result
    }
    return [...rows].sort(cmp)
  }, [rows, sortKey, sortDir])

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"))
    } else {
      setSortKey(key)
      setSortDir(key === "name" ? "asc" : "desc")
    }
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-ink-300/20 bg-slateglass-700/30 backdrop-blur">
      <table className="w-full text-sm">
        <thead className="text-xs uppercase tracking-wider text-ink-300">
          <tr className="border-b border-ink-300/20">
            <Th label="Network" sortKey="name" current={sortKey} dir={sortDir} onClick={toggleSort} />
            <Th label="Stage" sortKey="stage" current={sortKey} dir={sortDir} onClick={toggleSort} />
            <Th label="Staking %" sortKey="stakingPct" current={sortKey} dir={sortDir} onClick={toggleSort} />
            <Th label="Liquidization %" sortKey="liquidizationPct" current={sortKey} dir={sortDir} onClick={toggleSort} />
            <Th label="DeFi Prod %" sortKey="defiProductivityPct" current={sortKey} dir={sortDir} onClick={toggleSort} />
            <Th label="Restaking %" sortKey="stage" current={sortKey} dir={sortDir} onClick={toggleSort} />
            <Th label="Market Cap" sortKey="marketCapUsd" current={sortKey} dir={sortDir} onClick={toggleSort} />
            <th className="px-4 py-3 text-left">Trajectory vs ETH</th>
          </tr>
        </thead>
        <tbody className="text-ink-100">
          {sortedRows.map((r) => (
            <tr
              key={r.networkId}
              className={`border-b border-ink-300/10 hover:bg-ink-300/5 ${r.isBenchmark ? "bg-rose-500/5" : ""}`}
            >
              <td className="whitespace-nowrap px-4 py-3 font-medium">
                <Link href={`/network/${r.networkId}`} className="hover:text-sky-300">
                  {r.network}
                  {r.isBenchmark && (
                    <span className="ml-2 rounded border border-rose-500/30 bg-rose-500/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-rose-300">
                      Benchmark
                    </span>
                  )}
                </Link>
              </td>
              <td className="px-4 py-3">{r.stage ? <StageBadge stage={r.stage} /> : <span className="text-ink-400">—</span>}</td>
              <td className="px-4 py-3">
                {fmtPct(r.stakingPct)}
                {!r.isBenchmark && (
                  <span className="ml-1 text-xs text-ink-400">({fmtGap(r.stakingPct, ethRatios.stakingPct)})</span>
                )}
              </td>
              <td className="px-4 py-3">
                {fmtPct(r.liquidizationPct)}
                {!r.isBenchmark && r.liquidizationPct != null && (
                  <span className="ml-1 text-xs text-ink-400">({fmtGap(r.liquidizationPct, ethRatios.liquidizationPct)})</span>
                )}
              </td>
              <td className="px-4 py-3">
                {fmtPct(r.defiProductivityPct)}
                {!r.isBenchmark && r.defiProductivityPct != null && (
                  <span className="ml-1 text-xs text-ink-400">({fmtGap(r.defiProductivityPct, ethRatios.defiProductivityPct)})</span>
                )}
              </td>
              <td className="px-4 py-3">{fmtPct(r.restakingPct)}</td>
              <td className="whitespace-nowrap px-4 py-3">{fmtUsd(r.marketCapUsd)}</td>
              <td className="max-w-xs truncate px-4 py-3 text-xs text-ink-200">{r.trajectory ?? "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function Th({
  label,
  sortKey,
  current,
  dir,
  onClick,
}: {
  label: string
  sortKey: SortKey
  current: SortKey
  dir: "asc" | "desc"
  onClick: (k: SortKey) => void
}) {
  const active = current === sortKey
  return (
    <th
      className="cursor-pointer select-none whitespace-nowrap px-4 py-3 text-left text-xs font-medium uppercase tracking-wider"
      onClick={() => onClick(sortKey)}
    >
      <span className={active ? "text-ink-50" : ""}>{label}</span>
      {active && <span className="ml-1 text-ink-300">{dir === "asc" ? "▲" : "▼"}</span>}
    </th>
  )
}
