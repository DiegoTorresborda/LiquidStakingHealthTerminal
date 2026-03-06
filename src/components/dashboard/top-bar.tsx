import { NetworkSelector } from "@/components/dashboard/network-selector";

type TopBarProps = {
  selectedNetworkId: string;
  onSelectNetwork: (id: string) => void;
  networks: { id: string; name: string; lstSymbol: string }[];
  displayName: string;
  chainMeta: string;
  selectedLST: string;
  dashboardMode: string;
  updatedAt: string;
  dataMode: string;
};

export function TopBar({
  selectedNetworkId,
  onSelectNetwork,
  networks,
  displayName,
  chainMeta,
  selectedLST,
  dashboardMode,
  updatedAt,
  dataMode
}: TopBarProps) {
  return (
    <header className="surface-grid rounded-2xl border border-ink-300/20 bg-slateglass-700/45 p-5 shadow-glow backdrop-blur">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-ink-300">LST Intelligence</p>
          <h1 className="font-[var(--font-heading)] text-2xl font-semibold text-ink-50 md:text-3xl">
            LST Ecosystem Health Dashboard
          </h1>
          <p className="mt-1 text-sm text-ink-200">
            {displayName} · {chainMeta}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <NetworkSelector
            networks={networks}
            selectedId={selectedNetworkId}
            onChange={onSelectNetwork}
          />
          <div className="rounded-xl border border-ink-300/25 bg-slateglass-600/70 px-4 py-2 text-sm text-ink-100">
            <p className="text-xs uppercase tracking-[0.16em] text-ink-300">Selected LST</p>
            <p className="font-medium text-ink-50">{selectedLST}</p>
          </div>
          <div className="rounded-xl border border-ink-300/25 bg-slateglass-600/70 px-4 py-2 text-sm text-ink-100">
            <p className="text-xs uppercase tracking-[0.16em] text-ink-300">Mode</p>
            <p className="font-medium text-ink-50">{dashboardMode}</p>
          </div>
          <div className="rounded-xl border border-ink-300/25 bg-slateglass-600/70 px-4 py-2 text-sm text-ink-100">
            <p className="text-xs uppercase tracking-[0.16em] text-ink-300">Data Mode</p>
            <p className="font-medium text-ink-50">{dataMode}</p>
          </div>
          <div className="rounded-xl border border-ink-300/25 bg-slateglass-600/70 px-4 py-2 text-sm text-ink-100">
            <p className="text-xs uppercase tracking-[0.16em] text-ink-300">Freshness</p>
            <p className="font-medium text-ink-50">{updatedAt}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
