import Link from "next/link";

import { getGeneratedDatasetSummary, loadAdminSyncStatus } from "@/features/admin/server/store";

export const runtime = "nodejs";

export default async function AdminHomePage() {
  const [dataset, syncStatus] = await Promise.all([getGeneratedDatasetSummary(), loadAdminSyncStatus()]);

  const statusEntries = Object.values(syncStatus.sources);

  return (
    <section className="grid gap-4 lg:grid-cols-3">
      <article className="rounded-xl border border-ink-300/20 bg-slateglass-700/40 p-4 shadow-card">
        <p className="text-xs uppercase tracking-[0.16em] text-ink-300">Dataset</p>
        <h2 className="mt-1 text-lg font-semibold text-ink-50">Latest Overview Build</h2>
        <p className="mt-2 text-sm text-ink-100">Networks: {dataset.networkCount}</p>
        <p className="text-sm text-ink-100">Updated: {dataset.lastUpdatedAt ?? "Unknown"}</p>
      </article>

      <article className="rounded-xl border border-ink-300/20 bg-slateglass-700/40 p-4 shadow-card lg:col-span-2">
        <p className="text-xs uppercase tracking-[0.16em] text-ink-300">Data Sources</p>
        <h2 className="mt-1 text-lg font-semibold text-ink-50">Last Sync Status</h2>
        {statusEntries.length === 0 ? (
          <p className="mt-2 text-sm text-ink-100">No sync runs recorded yet.</p>
        ) : (
          <div className="mt-3 grid gap-2 md:grid-cols-2">
            {statusEntries.map((status) => (
              <div key={status.source} className="rounded-lg border border-ink-300/20 bg-ink-900/25 p-3">
                <p className="text-xs uppercase tracking-[0.14em] text-ink-300">{status.source}</p>
                <p className={`text-sm font-semibold ${status.status === "ok" ? "text-mint" : "text-coral"}`}>
                  {status.status.toUpperCase()}
                </p>
                <p className="text-xs text-ink-200">Updated networks: {status.updatedNetworks}</p>
                <p className="text-xs text-ink-300">{status.endedAt}</p>
              </div>
            ))}
          </div>
        )}
      </article>

      <article className="rounded-xl border border-ink-300/20 bg-slateglass-700/40 p-4 shadow-card">
        <h3 className="text-lg font-semibold text-ink-50">Data Sync</h3>
        <p className="mt-1 text-sm text-ink-100">Trigger source updates and rebuild overview dataset.</p>
        <Link
          href="/admin/data-sync"
          className="mt-3 inline-flex rounded-lg border border-[#7baff5]/40 bg-[#7baff5]/15 px-3 py-1.5 text-sm font-semibold text-[#dcecff]"
        >
          Open Data Sync
        </Link>
      </article>

      <article className="rounded-xl border border-ink-300/20 bg-slateglass-700/40 p-4 shadow-card">
        <h3 className="text-lg font-semibold text-ink-50">Manual Data</h3>
        <p className="mt-1 text-sm text-ink-100">Edit curated staking fields used as missing-value fallback.</p>
        <Link
          href="/admin/manual-data"
          className="mt-3 inline-flex rounded-lg border border-[#7baff5]/40 bg-[#7baff5]/15 px-3 py-1.5 text-sm font-semibold text-[#dcecff]"
        >
          Open Manual Data
        </Link>
      </article>

      <article className="rounded-xl border border-ink-300/20 bg-slateglass-700/40 p-4 shadow-card">
        <h3 className="text-lg font-semibold text-ink-50">Resources & Overrides</h3>
        <p className="mt-1 text-sm text-ink-100">Update chain links and apply explicit field overrides.</p>
        <div className="mt-3 flex gap-2">
          <Link
            href="/admin/resources"
            className="inline-flex rounded-lg border border-[#7baff5]/40 bg-[#7baff5]/15 px-3 py-1.5 text-sm font-semibold text-[#dcecff]"
          >
            Resources
          </Link>
          <Link
            href="/admin/overrides"
            className="inline-flex rounded-lg border border-[#7baff5]/40 bg-[#7baff5]/15 px-3 py-1.5 text-sm font-semibold text-[#dcecff]"
          >
            Overrides
          </Link>
        </div>
      </article>
    </section>
  );
}
