import type { RadarKpis } from "@/features/radar/types";
import { formatInteger, formatPercent, formatUsdCompact } from "@/features/radar/utils";

type KpiSummaryBarProps = {
  kpis: RadarKpis;
};

export function KpiSummaryBar({ kpis }: KpiSummaryBarProps) {
  const cards = [
    {
      label: "Tracked Networks",
      value: formatInteger(kpis.trackedNetworks),
      accent: "border-[#7baff5]/35 bg-[#7baff5]/12 text-[#a9ceff]"
    },
    {
      label: "Total Market Cap",
      value: formatUsdCompact(kpis.totalMarketCapUsd),
      accent: "border-ink-300/30 bg-ink-900/25 text-ink-50"
    },
    {
      label: "Total Staked Value",
      value: formatUsdCompact(kpis.totalStakedValueUsd),
      accent: "border-mint/35 bg-mint/12 text-mint"
    },
    {
      label: "Avg Staking Ratio",
      value: formatPercent(kpis.avgStakingRatioPct),
      accent: "border-amber/35 bg-amber/12 text-amber"
    },
    {
      label: "Avg LST Penetration",
      value: formatPercent(kpis.avgLstPenetrationPct),
      accent: "border-[#7baff5]/35 bg-[#7baff5]/12 text-[#a9ceff]"
    },
    {
      label: "Total DeFi TVL",
      value: formatUsdCompact(kpis.totalDefiTvlUsd),
      accent: "border-ink-300/30 bg-ink-900/25 text-ink-50"
    }
  ] as const;

  return (
    <section>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-6">
        {cards.map((card) => (
          <article key={card.label} className="rounded-xl border border-ink-300/20 bg-slateglass-600/60 p-4 shadow-card">
            <p className="text-xs uppercase tracking-[0.16em] text-ink-300">{card.label}</p>
            <p className={`mt-2 inline-flex rounded-lg border px-2.5 py-1 text-xl font-semibold ${card.accent}`}>
              {card.value}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
