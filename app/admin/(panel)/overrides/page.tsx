"use client";

import { useEffect, useMemo, useState } from "react";

import { networks } from "@data/networks";

import {
  OVERRIDE_FIELD_CATALOG,
  OVERRIDE_FIELD_METADATA,
  OVERRIDE_FIELDS_BY_GROUP,
  type OverrideValueType
} from "@/features/admin/override-field-catalog";

type OverrideEntry = {
  id: string;
  networkId: string;
  field: string;
  value: string | number | boolean | null;
  reason: string;
  timestamp: string;
};

type OverridesPayload = {
  overrides?: {
    updatedAt: string | null;
    overrides: OverrideEntry[];
  };
  dataset?: {
    lastUpdatedAt: string | null;
  };
  records?: Array<Record<string, string | number | boolean | null>>;
};

type ScalarValue = string | number | boolean | null | undefined;

const DEFAULT_FIELD = "stakingRatioPct";

export default function AdminOverridesPage() {
  const [payload, setPayload] = useState<OverridesPayload | null>(null);
  const [selectedNetworkId, setSelectedNetworkId] = useState(networks[0]?.networkId ?? "");
  const [fieldQuery, setFieldQuery] = useState("");
  const [field, setField] = useState(DEFAULT_FIELD);
  const [valueInput, setValueInput] = useState("");
  const [useNullValue, setUseNullValue] = useState(false);
  const [reason, setReason] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function loadOverrides() {
    const response = await fetch("/api/admin/overrides", { cache: "no-store" });
    const data = (await response.json()) as OverridesPayload;
    setPayload(data);
  }

  useEffect(() => {
    loadOverrides().catch(() => setMessage("Failed to load overrides"));
  }, []);

  const overrides = useMemo(() => payload?.overrides?.overrides ?? [], [payload]);

  const recordsByNetwork = useMemo(() => {
    const map = new Map<string, Record<string, string | number | boolean | null>>();

    for (const record of payload?.records ?? []) {
      const networkId = typeof record.networkId === "string" ? record.networkId : null;
      if (!networkId) continue;
      map.set(networkId, record);
    }

    return map;
  }, [payload]);

  const selectedFieldMeta = OVERRIDE_FIELD_METADATA[field] ?? OVERRIDE_FIELD_CATALOG[0];
  const valueType: OverrideValueType = selectedFieldMeta?.valueType ?? "string";

  const currentValue = useMemo(() => {
    const record = recordsByNetwork.get(selectedNetworkId);
    return record?.[field] as ScalarValue;
  }, [recordsByNetwork, selectedNetworkId, field]);

  const groupedFieldOptions = useMemo(() => {
    const query = fieldQuery.trim().toLowerCase();

    return Object.entries(OVERRIDE_FIELDS_BY_GROUP)
      .map(([groupLabel, options]) => {
        const filtered = options.filter((option) => {
          if (!query) return true;
          return option.label.toLowerCase().includes(query) || option.field.toLowerCase().includes(query);
        });

        return [groupLabel, filtered] as const;
      })
      .filter(([, options]) => options.length > 0);
  }, [fieldQuery]);

  useEffect(() => {
    if (currentValue === null) {
      setUseNullValue(false);
      setValueInput(defaultInputValueForType(valueType));
      return;
    }

    setUseNullValue(false);

    if (currentValue === undefined) {
      setValueInput("");
      return;
    }

    if (valueType === "number" && typeof currentValue === "number") {
      setValueInput(String(currentValue));
      return;
    }

    if (valueType === "boolean" && typeof currentValue === "boolean") {
      setValueInput(currentValue ? "true" : "false");
      return;
    }

    setValueInput(String(currentValue));
  }, [currentValue, valueType]);

  function parseValue(): string | number | boolean | null {
    if (useNullValue) {
      return null;
    }

    if (valueType === "boolean") {
      return valueInput.toLowerCase() === "true";
    }

    if (valueType === "number") {
      const parsed = Number(valueInput);
      return Number.isFinite(parsed) ? parsed : null;
    }

    return valueInput;
  }

  async function addOverride() {
    if (!selectedNetworkId || !field.trim() || !reason.trim()) {
      setMessage("network, field and reason are required");
      return;
    }

    if (!useNullValue && valueType === "number") {
      const parsed = Number(valueInput);
      if (!Number.isFinite(parsed)) {
        setMessage("value must be a valid number for this field");
        return;
      }
    }

    setIsSaving(true);
    setMessage(null);

    try {
      const response = await fetch("/api/admin/overrides", {
        method: "POST",
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify({
          networkId: selectedNetworkId,
          field: field.trim(),
          value: parseValue(),
          reason: reason.trim()
        })
      });

      const result = (await response.json().catch(() => null)) as { ok?: boolean; error?: string } | null;

      if (!response.ok || !result?.ok) {
        setMessage(result?.error ?? "Failed to add override");
        return;
      }

      setMessage("Override added and dataset rebuilt");
      setReason("");
      await loadOverrides();
    } catch {
      setMessage("Override request failed");
    } finally {
      setIsSaving(false);
    }
  }

  async function deleteOverride(id: string) {
    setMessage(null);

    const response = await fetch("/api/admin/overrides", {
      method: "DELETE",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({ id })
    });

    const result = (await response.json().catch(() => null)) as { ok?: boolean; error?: string } | null;

    if (!response.ok || !result?.ok) {
      setMessage(result?.error ?? "Failed to delete override");
      return;
    }

    setMessage("Override removed and dataset rebuilt");
    await loadOverrides();
  }

  return (
    <section className="space-y-4">
      <article className="rounded-xl border border-ink-300/20 bg-slateglass-700/40 p-4 shadow-card">
        <p className="text-xs uppercase tracking-[0.16em] text-ink-300">Overrides</p>
        <h2 className="mt-1 text-xl font-semibold text-ink-50">Manual Override Layer</h2>
        <p className="mt-2 text-sm text-ink-100">Overrides are applied after normalization and force final values.</p>

        <div className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          <label>
            <span className="mb-2 block text-xs uppercase tracking-[0.14em] text-ink-300">Network</span>
            <select
              value={selectedNetworkId}
              onChange={(event) => setSelectedNetworkId(event.target.value)}
              className="w-full rounded-lg border border-ink-300/25 bg-slateglass-600/70 px-3 py-2 text-sm text-ink-50"
            >
              {networks.map((network) => (
                <option key={network.networkId} value={network.networkId}>
                  {network.network} ({network.token})
                </option>
              ))}
            </select>
          </label>

          <label>
            <span className="mb-2 block text-xs uppercase tracking-[0.14em] text-ink-300">Field Search</span>
            <input
              value={fieldQuery}
              onChange={(event) => setFieldQuery(event.target.value)}
              placeholder="Search field by name"
              className="w-full rounded-lg border border-ink-300/25 bg-slateglass-600/70 px-3 py-2 text-sm text-ink-50"
            />
          </label>

          <label>
            <span className="mb-2 block text-xs uppercase tracking-[0.14em] text-ink-300">Field</span>
            <select
              value={field}
              onChange={(event) => setField(event.target.value)}
              className="w-full rounded-lg border border-ink-300/25 bg-slateglass-600/70 px-3 py-2 text-sm text-ink-50"
            >
              {groupedFieldOptions.map(([groupLabel, options]) => (
                <optgroup key={groupLabel} label={groupLabel}>
                  {options.map((option) => (
                    <option key={option.field} value={option.field}>
                      {option.label} ({option.field})
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </label>

          <label>
            <span className="mb-2 block text-xs uppercase tracking-[0.14em] text-ink-300">Value Type</span>
            <div className="rounded-lg border border-ink-300/25 bg-ink-900/35 px-3 py-2 text-sm text-ink-50">
              {valueType}
            </div>
          </label>

          <label className="flex items-center gap-2 pt-6">
            <input
              type="checkbox"
              checked={useNullValue}
              onChange={(event) => setUseNullValue(event.target.checked)}
              className="h-4 w-4 rounded border-ink-300/30 bg-ink-900/40"
            />
            <span className="text-sm text-ink-100">Set value to null</span>
          </label>

          <div className="rounded-lg border border-ink-300/25 bg-ink-900/30 px-3 py-2 text-sm text-ink-100">
            <p className="text-xs uppercase tracking-[0.14em] text-ink-300">Current Value</p>
            <p className="mt-1 break-all text-ink-50">{formatCurrentValue(currentValue)}</p>
          </div>

          {!useNullValue ? (
            <label className="md:col-span-2 lg:col-span-1">
              <span className="mb-2 block text-xs uppercase tracking-[0.14em] text-ink-300">Value</span>

              {valueType === "boolean" ? (
                <select
                  value={valueInput || "false"}
                  onChange={(event) => setValueInput(event.target.value)}
                  className="w-full rounded-lg border border-ink-300/25 bg-slateglass-600/70 px-3 py-2 text-sm text-ink-50"
                >
                  <option value="true">true</option>
                  <option value="false">false</option>
                </select>
              ) : (
                <input
                  value={valueInput}
                  onChange={(event) => setValueInput(event.target.value)}
                  placeholder={valueType === "number" ? "0" : "value"}
                  className="w-full rounded-lg border border-ink-300/25 bg-slateglass-600/70 px-3 py-2 text-sm text-ink-50"
                />
              )}
            </label>
          ) : null}

          <label className="md:col-span-2 lg:col-span-2">
            <span className="mb-2 block text-xs uppercase tracking-[0.14em] text-ink-300">Reason</span>
            <input
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              className="w-full rounded-lg border border-ink-300/25 bg-slateglass-600/70 px-3 py-2 text-sm text-ink-50"
            />
          </label>
        </div>

        <button
          type="button"
          onClick={addOverride}
          disabled={isSaving}
          className="mt-4 rounded-lg border border-[#7baff5]/40 bg-[#7baff5]/15 px-3 py-2 text-sm font-semibold text-[#dcecff] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSaving ? "Saving..." : "Add override"}
        </button>

        {message ? <p className="mt-3 text-sm text-ink-100">{message}</p> : null}
        <p className="mt-1 text-xs text-ink-300">Dataset updated: {payload?.dataset?.lastUpdatedAt ?? "Unknown"}</p>
      </article>

      <article className="rounded-xl border border-ink-300/20 bg-slateglass-700/40 p-4 shadow-card">
        <h3 className="text-lg font-semibold text-ink-50">Existing Overrides</h3>

        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[860px] border-separate border-spacing-y-2">
            <thead>
              <tr>
                <th className="text-left text-xs uppercase tracking-[0.14em] text-ink-300">Network</th>
                <th className="text-left text-xs uppercase tracking-[0.14em] text-ink-300">Field</th>
                <th className="text-left text-xs uppercase tracking-[0.14em] text-ink-300">Value</th>
                <th className="text-left text-xs uppercase tracking-[0.14em] text-ink-300">Reason</th>
                <th className="text-left text-xs uppercase tracking-[0.14em] text-ink-300">Timestamp</th>
                <th className="text-right text-xs uppercase tracking-[0.14em] text-ink-300">Action</th>
              </tr>
            </thead>
            <tbody>
              {overrides.map((override) => (
                <tr key={override.id} className="rounded-lg border border-ink-300/20 bg-ink-900/25">
                  <td className="px-2 py-2 text-sm text-ink-50">{override.networkId}</td>
                  <td className="px-2 py-2 text-sm text-ink-50">{override.field}</td>
                  <td className="px-2 py-2 text-sm text-ink-50">{String(override.value)}</td>
                  <td className="px-2 py-2 text-sm text-ink-100">{override.reason}</td>
                  <td className="px-2 py-2 text-xs text-ink-300">{override.timestamp}</td>
                  <td className="px-2 py-2 text-right">
                    <button
                      type="button"
                      onClick={() => deleteOverride(override.id)}
                      className="rounded-md border border-coral/40 bg-coral/15 px-2 py-1 text-xs font-semibold text-coral"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {overrides.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-2 py-3 text-sm text-ink-300">
                    No overrides configured.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </article>
    </section>
  );
}

function defaultInputValueForType(valueType: OverrideValueType): string {
  if (valueType === "number") {
    return "0";
  }

  if (valueType === "boolean") {
    return "false";
  }

  return "";
}

function formatCurrentValue(value: ScalarValue): string {
  if (value === undefined) {
    return "No current value in generated dataset";
  }

  if (value === null) {
    return "null";
  }

  if (typeof value === "string" && value.length === 0) {
    return "(empty string)";
  }

  return String(value);
}
