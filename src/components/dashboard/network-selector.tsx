type NetworkOption = {
  id: string;
  name: string;
  lstSymbol: string;
};

type NetworkSelectorProps = {
  networks: NetworkOption[];
  selectedId: string;
  onChange: (id: string) => void;
};

export function NetworkSelector({ networks, selectedId, onChange }: NetworkSelectorProps) {
  const isSingleOption = networks.length <= 1;

  return (
    <label className="group flex items-center gap-3 rounded-xl border border-ink-300/30 bg-slateglass-600/70 px-4 py-2 text-sm text-ink-100 shadow-card">
      <span className="text-xs uppercase tracking-[0.16em] text-ink-300">Network</span>
      <select
        value={selectedId}
        onChange={(event) => onChange(event.target.value)}
        disabled={isSingleOption}
        className="cursor-pointer bg-transparent font-medium text-ink-50 outline-none disabled:cursor-default disabled:text-ink-300"
      >
        {networks.map((network) => (
          <option key={network.id} value={network.id} className="bg-slateglass-700 text-ink-50">
            {network.name} ({network.lstSymbol})
          </option>
        ))}
      </select>
    </label>
  );
}
