import type { DetailMiniVisuals } from "@/features/network-detail/types";

type MiniVisualsPanelProps = {
  miniVisuals?: DetailMiniVisuals;
};

export function MiniVisualsPanel({ miniVisuals }: MiniVisualsPanelProps) {
  if (!miniVisuals) {
    return null;
  }

  return (
    <section>
      <div className="mb-4 flex items-end justify-between">
        <h2 className="font-[var(--font-heading)] text-2xl font-semibold text-ink-50">Supporting Mini-Visuals</h2>
        <p className="text-xs uppercase tracking-[0.16em] text-ink-300">Narrative support only</p>
      </div>

      <div className="grid gap-4 xl:grid-cols-4">
        {miniVisuals.slippageCurve ? <MiniBarCard title="Slippage Curve" bars={miniVisuals.slippageCurve.map((p) => ({ label: `$${p.tradeSizeUsd / 1000}k`, value: p.slippagePct, suffix: "%" }))} /> : null}
        {miniVisuals.pegDeviation ? <MiniBars title="Peg Deviation" values={miniVisuals.pegDeviation.map((v, idx) => ({ label: `D${idx + 1}`, value: Math.abs(v) }))} /> : null}
        {miniVisuals.defiUsageComposition ? <MiniBarCard title="DeFi Usage" bars={miniVisuals.defiUsageComposition.map((p) => ({ label: p.label, value: p.sharePct, suffix: "%" }))} /> : null}
        {miniVisuals.validatorConcentration ? <MiniBarCard title="Validator Concentration" bars={miniVisuals.validatorConcentration.map((p) => ({ label: p.label, value: p.sharePct, suffix: "%" }))} /> : null}
      </div>
    </section>
  );
}

type Bar = {
  label: string;
  value: number;
  suffix: string;
};

type MiniBarCardProps = {
  title: string;
  bars: Bar[];
};

function MiniBarCard({ title, bars }: MiniBarCardProps) {
  return (
    <article className="rounded-2xl border border-ink-300/20 bg-slateglass-600/60 p-4 shadow-card">
      <h3 className="font-semibold text-ink-50">{title}</h3>
      <div className="mt-4 space-y-2">
        {bars.map((bar) => (
          <div key={bar.label}>
            <div className="mb-1 flex items-center justify-between text-xs text-ink-200">
              <span>{bar.label}</span>
              <span>
                {bar.value}
                {bar.suffix}
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-ink-900/60">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#7baff5] to-mint"
                style={{ width: `${Math.min(bar.value, 100)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}

type MiniBarsProps = {
  title: string;
  values: { label: string; value: number }[];
};

function MiniBars({ title, values }: MiniBarsProps) {
  const maxValue = Math.max(...values.map((v) => v.value), 1);

  return (
    <article className="rounded-2xl border border-ink-300/20 bg-slateglass-600/60 p-4 shadow-card">
      <h3 className="font-semibold text-ink-50">{title}</h3>
      <div className="mt-4 flex h-28 items-end gap-2 rounded-xl border border-ink-300/20 bg-ink-900/25 p-3">
        {values.map((item) => (
          <div key={item.label} className="flex flex-1 flex-col items-center justify-end gap-1">
            <div
              className="w-full rounded-t-md bg-gradient-to-t from-coral/80 to-amber/70"
              style={{ height: `${(item.value / maxValue) * 100}%` }}
            />
            <span className="text-[10px] text-ink-300">{item.label}</span>
          </div>
        ))}
      </div>
    </article>
  );
}
