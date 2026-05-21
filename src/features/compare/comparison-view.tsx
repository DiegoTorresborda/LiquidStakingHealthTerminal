"use client"

import { useCallback, useMemo } from "react"
import { useRouter, useSearchParams } from "next/navigation"

import type { Network } from "@data/networks"

import { BarLeaderboards } from "./bar-leaderboards"
import { ConversionFunnels } from "./conversion-funnels"
import { GapTable } from "./gap-table"
import { KpiCards } from "./kpi-cards"
import { MultiRadar } from "./multi-radar"
import { NetworkPicker } from "./network-picker"
import { SuggestedComparisons } from "./suggested-comparisons"
import { MAX_COMPARE, parseNets, serializeNets } from "./url-state"

type Props = {
  ethereum: Network                // always the baseline
  selectableNetworks: Network[]    // already excludes Ethereum, only those with paf
}

export function ComparisonView({ ethereum, selectableNetworks }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const validIds = useMemo(
    () => new Set(selectableNetworks.map((n) => n.networkId)),
    [selectableNetworks],
  )

  const selectedIds = useMemo(
    () => parseNets(searchParams.get("nets"), validIds),
    [searchParams, validIds],
  )

  const updateUrl = useCallback(
    (nextIds: string[]) => {
      const sliced = nextIds.slice(0, MAX_COMPARE)
      const params = new URLSearchParams(searchParams.toString())
      if (sliced.length === 0) {
        params.delete("nets")
      } else {
        params.set("nets", serializeNets(sliced))
      }
      const qs = params.toString()
      router.replace(qs ? `/compare?${qs}` : "/compare", { scroll: false })
    },
    [router, searchParams],
  )

  const handleToggle = useCallback(
    (id: string) => {
      if (selectedIds.includes(id)) {
        updateUrl(selectedIds.filter((x) => x !== id))
      } else {
        if (selectedIds.length >= MAX_COMPARE) return
        updateUrl([...selectedIds, id])
      }
    },
    [selectedIds, updateUrl],
  )

  const handleClear = useCallback(() => updateUrl([]), [updateUrl])

  // Resolve picked Networks (preserve user's pick order)
  const pickedNetworks = useMemo(() => {
    const byId = new Map(selectableNetworks.map((n) => [n.networkId, n]))
    return selectedIds.flatMap((id) => {
      const n = byId.get(id)
      return n ? [n] : []
    })
  }, [selectableNetworks, selectedIds])

  // Final entity list: picked networks + ETH baseline
  const entities = useMemo(() => [...pickedNetworks, ethereum], [pickedNetworks, ethereum])

  return (
    <div className="flex flex-col gap-6">
      <NetworkPicker
        selectableNetworks={selectableNetworks}
        selectedIds={selectedIds}
        onToggle={handleToggle}
        onClear={handleClear}
      />

      {pickedNetworks.length === 0 ? (
        <>
          <SuggestedComparisons selectableNetworks={selectableNetworks} />
          <EmptyState />
        </>
      ) : (
        <>
          <KpiCards entities={entities} />
          <MultiRadar entities={entities} />
          <BarLeaderboards entities={entities} />
          <ConversionFunnels entities={entities} />
          <GapTable entities={entities} />
        </>
      )}
    </div>
  )
}

function EmptyState() {
  return (
    <section className="rounded-2xl border border-dashed border-ink-300/25 bg-slateglass-700/20 p-8 text-center">
      <p className="text-sm text-ink-300">
        Or pick networks individually from the chips above to build a custom comparison.
      </p>
    </section>
  )
}
