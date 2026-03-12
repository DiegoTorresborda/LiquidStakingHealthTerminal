import Link from "next/link";

import type { NetworkStatus } from "@data/networks";

import type { BinaryFilter, RadarFilters } from "@/features/radar/types";

type RadarHeaderProps = {
  filters: RadarFilters;
  statusOptions: NetworkStatus[];
  visibleCount: number;
  totalCount: number;
  onQueryChange: (value: string) => void;
  onStatusChange: (value: RadarFilters["status"]) => void;
  onLendingChange: (value: BinaryFilter) => void;
  onCollateralChange: (value: BinaryFilter) => void;
  onReset: () => void;
};

export function RadarHeader({
  filters,
  statusOptions,
  visibleCount,
  totalCount,
  onQueryChange,
  onStatusChange,
  onLendingChange,
  onCollateralChange,
  onReset
}: RadarHeaderProps) {
  return (
    <section className="surface-grid rounded-2xl border border-ink-300/20 bg-slateglass-700/45 p-5 shadow-glow backdrop-blur">
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-ink-300">Market Overview</p>
            <h1 className="font-[var(--font-heading)] text-3xl font-semibold text-ink-50 md:text-4xl">
              LST Opportunity Radar
            </h1>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-ink-100 md:text-base">
              Portfolio-level scan of PoS ecosystems to identify where liquid staking strategy and product interventions
              can unlock the highest upside.
            </p>
          </div>

          <div className="flex flex-col gap-3 lg:items-end">
            <div className="rounded-xl border border-ink-300/25 bg-ink-900/30 px-4 py-3 text-sm text-ink-100">
              <p className="text-xs uppercase tracking-[0.16em] text-ink-300">Coverage</p>
              <p className="font-semibold text-ink-50">
                {visibleCount} / {totalCount} networks in current view
              </p>
            </div>
            <div className="flex flex-wrap gap-2 lg:justify-end">
              <Link
                href="/liquid-staking"
                className="inline-flex items-center justify-center rounded-xl border border-[#7baff5]/45 bg-[#7baff5]/20 px-4 py-2 text-sm font-semibold text-[#dcecff] transition hover:bg-[#7baff5]/30"
              >
                Why Liquid Staking
              </Link>
              <Link
                href="/methodology"
                className="inline-flex items-center justify-center rounded-xl border border-ink-300/30 bg-ink-900/25 px-4 py-2 text-sm font-semibold text-ink-100 transition hover:bg-ink-900/40"
              >
                Open Methodology
              </Link>
            </div>
          </div>
        </div>

        <div className="grid gap-3 lg:grid-cols-12">
          <label className="lg:col-span-5">
            <span className="mb-2 block text-xs uppercase tracking-[0.16em] text-ink-300">Search</span>
            <input
              value={filters.query}
              onChange={(event) => onQueryChange(event.target.value)}
              placeholder="Search by network, token, or category"
              className="w-full rounded-xl border border-ink-300/25 bg-slateglass-600/70 px-4 py-2.5 text-sm text-ink-50 placeholder:text-ink-300/80 outline-none ring-[#7baff5]/30 transition focus:ring"
            />
          </label>

          <label className="lg:col-span-2">
            <span className="mb-2 block text-xs uppercase tracking-[0.16em] text-ink-300">Status</span>
            <select
              value={filters.status}
              onChange={(event) => onStatusChange(event.target.value as RadarFilters["status"])}
              className="w-full rounded-xl border border-ink-300/25 bg-slateglass-600/70 px-3 py-2.5 text-sm text-ink-50 outline-none"
            >
              <option value="all">All</option>
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </label>

          <label className="lg:col-span-2">
            <span className="mb-2 block text-xs uppercase tracking-[0.16em] text-ink-300">Lending</span>
            <select
              value={filters.lending}
              onChange={(event) => onLendingChange(event.target.value as BinaryFilter)}
              className="w-full rounded-xl border border-ink-300/25 bg-slateglass-600/70 px-3 py-2.5 text-sm text-ink-50 outline-none"
            >
              <option value="all">All</option>
              <option value="yes">With Lending</option>
              <option value="no">No Lending</option>
            </select>
          </label>

          <label className="lg:col-span-2">
            <span className="mb-2 block text-xs uppercase tracking-[0.16em] text-ink-300">LST Collateral</span>
            <select
              value={filters.collateral}
              onChange={(event) => onCollateralChange(event.target.value as BinaryFilter)}
              className="w-full rounded-xl border border-ink-300/25 bg-slateglass-600/70 px-3 py-2.5 text-sm text-ink-50 outline-none"
            >
              <option value="all">All</option>
              <option value="yes">Enabled</option>
              <option value="no">Disabled</option>
            </select>
          </label>

          <div className="flex items-end lg:col-span-1">
            <button
              type="button"
              onClick={onReset}
              className="w-full rounded-xl border border-ink-300/30 bg-ink-900/25 px-3 py-2.5 text-sm font-medium text-ink-50 transition hover:bg-ink-900/40"
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
