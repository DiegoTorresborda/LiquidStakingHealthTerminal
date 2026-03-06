type SupportingSignalsProps = {
  slippageCurve: { tradeSizeUsd: number; slippagePct: number }[];
  pegDeviation: number[];
  defiUsage: { label: string; share: number }[];
  validatorConcentration: { label: string; share: number }[];
  stressSnapshot: {
    scenario: string;
    exitHaircut: string;
    lstDiscount: string;
    redemptionQueue: string;
    contagionRisk: string;
  };
};

export function SupportingSignals({
  slippageCurve,
  pegDeviation,
  defiUsage,
  validatorConcentration,
  stressSnapshot
}: SupportingSignalsProps) {
  const pegValues = pegDeviation.map((value) => Math.abs(value));
  const maxPeg = Math.max(...pegValues, 1);
  const formatTradeSize = (tradeSizeUsd: number) => {
    if (tradeSizeUsd >= 1000000) {
      return `$${tradeSizeUsd / 1000000}M`;
    }

    return `$${tradeSizeUsd / 1000}k`;
  };

  return (
    <section>
      <div className="mb-4 flex items-end justify-between">
        <h2 className="font-[var(--font-heading)] text-2xl font-semibold text-ink-50">Supporting Signals</h2>
        <p className="text-xs uppercase tracking-[0.16em] text-ink-300">Mock mini charts</p>
      </div>

      <div className="grid gap-4 xl:grid-cols-5">
        <article className="rounded-2xl border border-ink-300/20 bg-slateglass-600/60 p-4 shadow-card">
          <h3 className="font-semibold text-ink-50">Slippage Curve</h3>
          <div className="mt-4 space-y-2">
            {slippageCurve.map((point) => (
              <div key={point.tradeSizeUsd}>
                <div className="mb-1 flex items-center justify-between text-xs text-ink-200">
                  <span>{formatTradeSize(point.tradeSizeUsd)}</span>
                  <span>{point.slippagePct.toFixed(1)}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-ink-900/60">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-mint to-amber"
                    style={{ width: `${Math.min(point.slippagePct * 9, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-2xl border border-ink-300/20 bg-slateglass-600/60 p-4 shadow-card">
          <h3 className="font-semibold text-ink-50">Peg Deviation (10d)</h3>
          <div className="mt-4 flex h-20 items-end gap-2 rounded-xl border border-ink-300/20 bg-ink-900/25 p-3">
            {pegDeviation.map((value, index) => (
              <div key={`${value}-${index}`} className="flex flex-1 items-end">
                <div
                  className="w-full rounded-t-md bg-gradient-to-t from-coral/80 to-amber/70"
                  style={{ height: `${(Math.abs(value) / maxPeg) * 100}%` }}
                  title={`${value}%`}
                />
              </div>
            ))}
          </div>
          <p className="mt-2 text-xs text-ink-300">Higher bar = larger discount from NAV.</p>
        </article>

        <article className="rounded-2xl border border-ink-300/20 bg-slateglass-600/60 p-4 shadow-card">
          <h3 className="font-semibold text-ink-50">DeFi Usage Mix</h3>
          <div className="mt-4 space-y-2">
            {defiUsage.map((item) => (
              <div key={item.label}>
                <div className="mb-1 flex items-center justify-between text-xs text-ink-200">
                  <span>{item.label}</span>
                  <span>{item.share}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-ink-900/60">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#7baff5] to-mint"
                    style={{ width: `${item.share}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-2xl border border-ink-300/20 bg-slateglass-600/60 p-4 shadow-card">
          <h3 className="font-semibold text-ink-50">Validator Concentration</h3>
          <div className="mt-4 space-y-2">
            {validatorConcentration.map((item) => (
              <div key={item.label}>
                <div className="mb-1 flex items-center justify-between text-xs text-ink-200">
                  <span>{item.label}</span>
                  <span>{item.share}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-ink-900/60">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#7baff5] to-mint"
                    style={{ width: `${item.share}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-2xl border border-ink-300/20 bg-slateglass-600/60 p-4 shadow-card">
          <h3 className="font-semibold text-ink-50">Stress Snapshot</h3>
          <div className="mt-3 space-y-3 rounded-xl border border-ink-300/20 bg-ink-900/25 p-3 text-sm text-ink-100">
            <p className="font-medium text-ink-50">{stressSnapshot.scenario}</p>
            <p>{stressSnapshot.exitHaircut}</p>
            <p>{stressSnapshot.lstDiscount}</p>
            <p>{stressSnapshot.redemptionQueue}</p>
            <p className="pt-2 text-xs text-ink-300">{stressSnapshot.contagionRisk}</p>
          </div>
        </article>
      </div>
    </section>
  );
}
