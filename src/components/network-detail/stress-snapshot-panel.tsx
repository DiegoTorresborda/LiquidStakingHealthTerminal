import type { StressSnapshot } from "@/features/network-detail/types";
import { contagionClass } from "@/features/network-detail/utils";

type StressSnapshotPanelProps = {
  stress: StressSnapshot;
};

export function StressSnapshotPanel({ stress }: StressSnapshotPanelProps) {
  return (
    <section className="rounded-2xl border border-amber/35 bg-gradient-to-br from-amber/12 to-slateglass-600/45 p-5 shadow-card">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-[var(--font-heading)] text-xl font-semibold text-ink-50">Stress Snapshot</h2>
        <span className="rounded-md border border-amber/35 bg-amber/12 px-2 py-1 text-xs font-semibold text-amber">
          Compact Stress View
        </span>
      </div>

      <div className="space-y-3 rounded-xl border border-ink-300/20 bg-ink-900/30 p-4 text-sm text-ink-100">
        <div>
          <p className="text-xs uppercase tracking-[0.14em] text-ink-300">Scenario</p>
          <p className="mt-1 font-semibold text-ink-50">{stress.scenario}</p>
        </div>

        <div className="grid gap-2 sm:grid-cols-2">
          <Metric label="Estimated LST Discount" value={stress.estimatedLstDiscount} />
          <Metric label="Exit Haircut to USDC" value={stress.estimatedExitHaircutToUsdc} />
          <Metric label="Redeem Queue Delay" value={stress.estimatedRedeemQueueDelay} />
          <div>
            <p className="text-xs uppercase tracking-[0.14em] text-ink-300">Contagion Risk</p>
            <span className={`mt-1 inline-flex rounded-md border px-2 py-1 text-xs font-semibold ${contagionClass(stress.contagionRisk)}`}>
              {stress.contagionRisk}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

type MetricProps = {
  label: string;
  value: string;
};

function Metric({ label, value }: MetricProps) {
  return (
    <div>
      <p className="text-xs uppercase tracking-[0.14em] text-ink-300">{label}</p>
      <p className="mt-1 font-semibold text-ink-50">{value}</p>
    </div>
  );
}
