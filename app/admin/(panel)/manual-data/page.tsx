"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

type Scalar = string | number | boolean | null | undefined;

type ManualDataState = {
  manualData?: {
    updatedAt: string | null;
    networks: Record<string, Record<string, number | string | null | undefined>>;
  };
  manualUiFields?: {
    updatedAt: string | null;
    networks: Record<string, Record<string, number | string | boolean | null | undefined>>;
  };
  networks?: Array<{ networkId: string; network: string; token: string }>;
  dataset?: {
    networkCount: number;
    lastUpdatedAt: string | null;
  };
  records?: Array<Record<string, string | number | boolean | null>>;
};

type FieldType = "number" | "string" | "boolean";

type FieldConfig = {
  key: keyof FormState;
  label: string;
  type: FieldType;
  group: "staking" | "identity" | "strategy";
};

type FormState = {
  stakingRatioPct: string;
  stakingApyPct: string;
  validatorCount: string;
  inflationRatePct: string;
  category: string;
  status: string;
  fdvUsd: string;
  circulatingSupplyPct: string;
  stakerAddresses: string;
  lstProtocols: string;
  largestLst: string;
  lendingPresence: "" | "true" | "false";
  lstCollateralEnabled: "" | "true" | "false";
  mainBottleneck: string;
  mainOpportunity: string;
  notes: string;
};

const FIELD_CONFIGS: FieldConfig[] = [
  { key: "stakingRatioPct", label: "stakingRatioPct", type: "number", group: "staking" },
  { key: "stakingApyPct", label: "stakingApyPct", type: "number", group: "staking" },
  { key: "validatorCount", label: "validatorCount", type: "number", group: "staking" },
  { key: "inflationRatePct", label: "inflationRatePct", type: "number", group: "staking" },

  { key: "category", label: "category", type: "string", group: "identity" },
  { key: "status", label: "status", type: "string", group: "identity" },
  { key: "fdvUsd", label: "fdvUsd", type: "number", group: "identity" },
  { key: "circulatingSupplyPct", label: "circulatingSupplyPct", type: "number", group: "identity" },
  { key: "stakerAddresses", label: "stakerAddresses", type: "number", group: "identity" },
  { key: "lstProtocols", label: "lstProtocols", type: "number", group: "identity" },
  { key: "largestLst", label: "largestLst", type: "string", group: "identity" },

  { key: "lendingPresence", label: "lendingPresence", type: "boolean", group: "strategy" },
  { key: "lstCollateralEnabled", label: "lstCollateralEnabled", type: "boolean", group: "strategy" },
  { key: "mainBottleneck", label: "mainBottleneck", type: "string", group: "strategy" },
  { key: "mainOpportunity", label: "mainOpportunity", type: "string", group: "strategy" }
];

const EMPTY_FORM: FormState = {
  stakingRatioPct: "",
  stakingApyPct: "",
  validatorCount: "",
  inflationRatePct: "",
  category: "",
  status: "",
  fdvUsd: "",
  circulatingSupplyPct: "",
  stakerAddresses: "",
  lstProtocols: "",
  largestLst: "",
  lendingPresence: "",
  lstCollateralEnabled: "",
  mainBottleneck: "",
  mainOpportunity: "",
  notes: ""
};

export default function AdminManualDataPage() {
  const [state, setState] = useState<ManualDataState | null>(null);
  const [selectedNetworkId, setSelectedNetworkId] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);

  const loadState = useCallback(async () => {
    const response = await fetch("/api/admin/manual-data", { cache: "no-store" });
    const payload = (await response.json()) as ManualDataState;
    setState(payload);

    setSelectedNetworkId((current) => {
      if (current) {
        return current;
      }

      return payload.networks && payload.networks.length > 0 ? payload.networks[0].networkId : "";
    });
  }, []);

  useEffect(() => {
    loadState().catch(() => setMessage("Failed to load manual data"));
  }, [loadState]);

  const recordsByNetwork = useMemo(() => {
    const map = new Map<string, Record<string, string | number | boolean | null>>();

    for (const record of state?.records ?? []) {
      if (typeof record.networkId === "string") {
        map.set(record.networkId, record);
      }
    }

    return map;
  }, [state]);

  const selectedManualStaking = useMemo(() => {
    if (!selectedNetworkId) return null;
    return state?.manualData?.networks?.[selectedNetworkId] ?? null;
  }, [selectedNetworkId, state]);

  const selectedManualUi = useMemo(() => {
    if (!selectedNetworkId) return null;
    return state?.manualUiFields?.networks?.[selectedNetworkId] ?? null;
  }, [selectedNetworkId, state]);

  const selectedRecord = useMemo(() => {
    if (!selectedNetworkId) return null;
    return recordsByNetwork.get(selectedNetworkId) ?? null;
  }, [recordsByNetwork, selectedNetworkId]);

  useEffect(() => {
    if (!selectedNetworkId) {
      setForm(EMPTY_FORM);
      return;
    }

    const next: FormState = { ...EMPTY_FORM };
    const nextMutable = next as Record<keyof FormState, string>;

    for (const field of FIELD_CONFIGS) {
      const manualValue =
        selectedManualUi?.[field.key] ??
        selectedManualStaking?.[field.key as keyof typeof selectedManualStaking] ??
        undefined;

      const currentValue = selectedRecord?.[field.key as string];
      const resolved = manualValue !== undefined ? manualValue : currentValue;

      nextMutable[field.key] = serializeValueForInput(field.type, resolved);
    }

    next.notes =
      typeof selectedManualStaking?.notes === "string"
        ? selectedManualStaking.notes
        : (typeof selectedRecord?.notes === "string" ? selectedRecord.notes : "");

    setForm(next);
  }, [selectedManualStaking, selectedManualUi, selectedNetworkId, selectedRecord]);

  async function saveManualData() {
    if (!selectedNetworkId) {
      setMessage("Select a network first");
      return;
    }

    setIsSaving(true);
    setMessage(null);

    try {
      const response = await fetch("/api/admin/manual-data", {
        method: "POST",
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify({
          networkId: selectedNetworkId,
          stakingRatioPct: form.stakingRatioPct,
          stakingApyPct: form.stakingApyPct,
          validatorCount: form.validatorCount,
          inflationRatePct: form.inflationRatePct,
          category: form.category,
          status: form.status,
          fdvUsd: form.fdvUsd,
          circulatingSupplyPct: form.circulatingSupplyPct,
          stakerAddresses: form.stakerAddresses,
          lstProtocols: form.lstProtocols,
          largestLst: form.largestLst,
          lendingPresence: form.lendingPresence,
          lstCollateralEnabled: form.lstCollateralEnabled,
          mainBottleneck: form.mainBottleneck,
          mainOpportunity: form.mainOpportunity,
          notes: form.notes
        })
      });

      const payload = (await response.json().catch(() => null)) as { ok?: boolean; error?: string } | null;

      if (!response.ok || !payload?.ok) {
        setMessage(payload?.error ?? "Failed to save manual data");
        return;
      }

      setMessage("Manual data saved and dataset rebuilt");
      await loadState();
    } catch {
      setMessage("Save request failed");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <section className="space-y-4">
      <article className="rounded-xl border border-ink-300/20 bg-slateglass-700/40 p-4 shadow-card">
        <p className="text-xs uppercase tracking-[0.16em] text-ink-300">Manual Data</p>
        <h2 className="mt-1 text-xl font-semibold text-ink-50">Manual Network Data Editor</h2>
        <p className="mt-2 text-sm text-ink-100">
          All editable manual fields are prefilled with current values for easier updates.
        </p>

        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <label>
            <span className="mb-2 block text-xs uppercase tracking-[0.14em] text-ink-300">Network</span>
            <select
              value={selectedNetworkId}
              onChange={(event) => setSelectedNetworkId(event.target.value)}
              className="w-full rounded-lg border border-ink-300/25 bg-slateglass-600/70 px-3 py-2 text-sm text-ink-50"
            >
              {(state?.networks ?? []).map((network) => (
                <option key={network.networkId} value={network.networkId}>
                  {network.network} ({network.token})
                </option>
              ))}
            </select>
          </label>
        </div>

        <FieldGroup title="Staking Fallback Fields">
          {FIELD_CONFIGS.filter((field) => field.group === "staking").map((field) => (
            <FieldInput
              key={field.key}
              field={field}
              value={form[field.key]}
              currentValue={selectedRecord?.[field.key as string]}
              onChange={(value) => setForm((current) => ({ ...current, [field.key]: value }))}
            />
          ))}
        </FieldGroup>

        <FieldGroup title="Network Identity Fields">
          {FIELD_CONFIGS.filter((field) => field.group === "identity").map((field) => (
            <FieldInput
              key={field.key}
              field={field}
              value={form[field.key]}
              currentValue={selectedRecord?.[field.key as string]}
              onChange={(value) => setForm((current) => ({ ...current, [field.key]: value }))}
            />
          ))}
        </FieldGroup>

        <FieldGroup title="Strategy Fields">
          {FIELD_CONFIGS.filter((field) => field.group === "strategy").map((field) => (
            <FieldInput
              key={field.key}
              field={field}
              value={form[field.key]}
              currentValue={selectedRecord?.[field.key as string]}
              onChange={(value) => setForm((current) => ({ ...current, [field.key]: value }))}
            />
          ))}
        </FieldGroup>

        <label className="mt-3 block">
          <span className="mb-2 block text-xs uppercase tracking-[0.14em] text-ink-300">notes</span>
          <textarea
            value={form.notes}
            onChange={(event) => setForm((current) => ({ ...current, notes: event.target.value }))}
            rows={3}
            className="w-full rounded-lg border border-ink-300/25 bg-slateglass-600/70 px-3 py-2 text-sm text-ink-50"
          />
        </label>

        <button
          type="button"
          onClick={saveManualData}
          disabled={isSaving}
          className="mt-4 rounded-lg border border-[#7baff5]/40 bg-[#7baff5]/15 px-3 py-2 text-sm font-semibold text-[#dcecff] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSaving ? "Saving..." : "Save Manual Data"}
        </button>

        {message ? <p className="mt-3 text-sm text-ink-100">{message}</p> : null}
        <p className="mt-1 text-xs text-ink-300">Dataset updated: {state?.dataset?.lastUpdatedAt ?? "Unknown"}</p>
      </article>
    </section>
  );
}

function FieldGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-5 rounded-xl border border-ink-300/20 bg-ink-900/25 p-3">
      <p className="text-xs uppercase tracking-[0.14em] text-ink-300">{title}</p>
      <div className="mt-3 grid gap-3 md:grid-cols-2">{children}</div>
    </div>
  );
}

function FieldInput({
  field,
  value,
  currentValue,
  onChange
}: {
  field: FieldConfig;
  value: string;
  currentValue: Scalar;
  onChange: (value: string) => void;
}) {
  return (
    <label>
      <span className="mb-2 block text-xs uppercase tracking-[0.14em] text-ink-300">{field.label}</span>
      <p className="mb-2 text-xs text-ink-300">Current: {formatCurrentValue(currentValue)}</p>

      {field.type === "boolean" ? (
        <select
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="w-full rounded-lg border border-ink-300/25 bg-slateglass-600/70 px-3 py-2 text-sm text-ink-50"
        >
          <option value="">null</option>
          <option value="true">true</option>
          <option value="false">false</option>
        </select>
      ) : (
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={field.type === "number" ? "0" : "value"}
          className="w-full rounded-lg border border-ink-300/25 bg-slateglass-600/70 px-3 py-2 text-sm text-ink-50"
        />
      )}
    </label>
  );
}

function serializeValueForInput(type: FieldType, value: Scalar): string {
  if (value === undefined || value === null) {
    return "";
  }

  if (type === "boolean") {
    if (typeof value === "boolean") {
      return value ? "true" : "false";
    }

    if (typeof value === "string") {
      const lowered = value.toLowerCase();
      if (lowered === "true" || lowered === "false") {
        return lowered;
      }
    }

    return "";
  }

  return String(value);
}

function formatCurrentValue(value: Scalar): string {
  if (value === undefined) {
    return "N/A";
  }

  if (value === null) {
    return "null";
  }

  if (typeof value === "string" && value.length === 0) {
    return "(empty string)";
  }

  return String(value);
}
