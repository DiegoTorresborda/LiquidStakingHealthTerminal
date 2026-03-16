"use client";

import { useState } from "react";
import { CATEGORIES } from "@/features/admin/shared/add-chain-constants";

type FormState = {
  isL1: boolean;
  isPoS: boolean;
  networkId: string;
  network: string;
  token: string;
  coingeckoId: string;
  defillamaChain: string;
  dexscreenerChainId: string;
  etherscanChainId: string;
  hasLst: boolean;
  lstSymbol: string;
  category: string;
};

type PatchResult = {
  file: string;
  ok: boolean;
  skipped?: boolean;
  error?: string;
};

const EMPTY_FORM: FormState = {
  isL1: false,
  isPoS: false,
  networkId: "",
  network: "",
  token: "",
  coingeckoId: "",
  defillamaChain: "",
  dexscreenerChainId: "",
  etherscanChainId: "",
  hasLst: false,
  lstSymbol: "",
  category: ""
};

function Field({
  label,
  hint,
  children
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold uppercase tracking-widest text-ink-200">
        {label}
      </label>
      {hint && <p className="text-xs text-ink-400">{hint}</p>}
      {children}
    </div>
  );
}

const inputCls =
  "rounded-lg border border-ink-300/25 bg-ink-900/35 px-3 py-2 text-sm text-ink-50 placeholder-ink-400 focus:border-[#7baff5]/50 focus:outline-none focus:ring-1 focus:ring-[#7baff5]/30";

export default function AdminAddChainPage() {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [isSaving, setIsSaving] = useState(false);
  const [results, setResults] = useState<PatchResult[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm(prev => ({ ...prev, [key]: value }));
  }

  const networkIdError =
    form.networkId && !/^[a-z][a-z0-9-]*$/.test(form.networkId)
      ? "Must be lowercase kebab-case (e.g. my-chain)"
      : null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    setResults(null);

    try {
      const response = await fetch("/api/admin/add-chain", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          ...form,
          token: form.token.toUpperCase(),
          lstSymbol: form.lstSymbol.toUpperCase() || `st${form.token.toUpperCase()}`,
          etherscanChainId: form.etherscanChainId.trim() || null
        })
      });

      const payload = await response.json() as { ok: boolean; error?: string; conflicts?: string[]; results?: PatchResult[] };

      if (!payload.ok) {
        let msg = payload.error ?? "Unknown error";
        if (payload.conflicts?.length) {
          msg += `\n\nAlready exists in:\n• ${payload.conflicts.join("\n• ")}`;
        }
        setError(msg);
        return;
      }

      setResults(payload.results ?? []);
      setForm(EMPTY_FORM);
    } catch {
      setError("Request failed");
    } finally {
      setIsSaving(false);
    }
  }

  const isEligible = form.isL1 && form.isPoS;
  const isReady =
    isEligible &&
    form.networkId &&
    !networkIdError &&
    form.network &&
    form.token &&
    form.coingeckoId &&
    form.defillamaChain &&
    form.dexscreenerChainId &&
    form.category;

  return (
    <section className="surface-grid rounded-2xl border border-ink-300/20 bg-slateglass-700/40 p-5 shadow-glow backdrop-blur">
      <div className="mb-6">
        <h2 className="font-[var(--font-heading)] text-xl font-semibold text-ink-50">Add New Chain</h2>
        <p className="mt-1 text-sm text-ink-300">
          Registers a new L1 network across all configuration files. Only L1 networks with validator-based consensus (PoS or BFT) are eligible.
        </p>
      </div>

      {/* Eligibility gates */}
      <article className="mb-6 rounded-xl border border-amber-400/20 bg-amber-400/5 p-4">
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-amber-300">Eligibility Check</p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <label className="flex cursor-pointer items-center gap-2 text-sm text-ink-100">
            <input
              type="checkbox"
              checked={form.isL1}
              onChange={e => set("isL1", e.target.checked)}
              className="h-4 w-4 rounded accent-[#7baff5]"
            />
            This is an L1 blockchain (not a rollup or L2)
          </label>
          <label className="flex cursor-pointer items-center gap-2 text-sm text-ink-100">
            <input
              type="checkbox"
              checked={form.isPoS}
              onChange={e => set("isPoS", e.target.checked)}
              className="h-4 w-4 rounded accent-[#7baff5]"
            />
            Uses validator-based consensus (PoS or BFT)
          </label>
        </div>
        {form.isL1 && form.isPoS && (
          <p className="mt-2 text-xs text-emerald-400">✓ Eligible — proceed with chain details</p>
        )}
        {(form.isL1 || form.isPoS) && !(form.isL1 && form.isPoS) && (
          <p className="mt-2 text-xs text-amber-400">Both conditions must be met to add a chain.</p>
        )}
      </article>

      <form onSubmit={handleSubmit} className={`flex flex-col gap-8 ${!isEligible ? "pointer-events-none opacity-40" : ""}`}>
        {/* Identity */}
        <article className="rounded-xl border border-ink-300/15 bg-ink-900/20 p-4">
          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-ink-300">Chain Identity</p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Field label="Network ID" hint="kebab-case, becomes the URL slug (e.g. my-chain)">
              <input
                className={`${inputCls} ${networkIdError ? "border-red-400/50" : ""}`}
                value={form.networkId}
                onChange={e => set("networkId", e.target.value.toLowerCase())}
                placeholder="my-chain"
                required
              />
              {networkIdError && <p className="mt-1 text-xs text-red-400">{networkIdError}</p>}
            </Field>
            <Field label="Display Name">
              <input className={inputCls} value={form.network} onChange={e => set("network", e.target.value)} placeholder="My Chain" required />
            </Field>
            <Field label="Token Symbol" hint="Will be uppercased automatically">
              <input className={inputCls} value={form.token} onChange={e => set("token", e.target.value.toUpperCase())} placeholder="MCH" required />
            </Field>
            <Field label="Category" hint="Network classification">
              <select
                className={inputCls}
                value={form.category}
                onChange={e => set("category", e.target.value)}
                required
              >
                <option value="">Select category…</option>
                {CATEGORIES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </Field>
          </div>
        </article>

        {/* Data Sources */}
        <article className="rounded-xl border border-ink-300/15 bg-ink-900/20 p-4">
          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-ink-300">Data Source IDs</p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="CoinGecko Coin ID" hint="e.g. ethereum, monad-testnet">
              <input className={inputCls} value={form.coingeckoId} onChange={e => set("coingeckoId", e.target.value)} placeholder="my-chain" required />
            </Field>
            <Field label="DefiLlama Chain Name" hint="Exact name used by DefiLlama API (e.g. Ethereum)">
              <input className={inputCls} value={form.defillamaChain} onChange={e => set("defillamaChain", e.target.value)} placeholder="MyChain" required />
            </Field>
            <Field label="DexScreener Chain Slug" hint="e.g. ethereum, monad">
              <input className={inputCls} value={form.dexscreenerChainId} onChange={e => set("dexscreenerChainId", e.target.value)} placeholder="mychain" required />
            </Field>
            <Field label="EVM Chain ID (Etherscan)" hint="Numeric ID for EVM chains — leave blank if not applicable">
              <input className={inputCls} value={form.etherscanChainId} onChange={e => set("etherscanChainId", e.target.value)} placeholder="1 (optional)" />
            </Field>
          </div>
        </article>

        {/* LST */}
        <article className="rounded-xl border border-ink-300/15 bg-ink-900/20 p-4">
          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-ink-300">LST Status</p>
          <div className="flex flex-col gap-4">
            <label className="flex cursor-pointer items-center gap-2 text-sm text-ink-100">
              <input
                type="checkbox"
                checked={form.hasLst}
                onChange={e => set("hasLst", e.target.checked)}
                className="h-4 w-4 rounded accent-[#7baff5]"
              />
              This chain already has an LST deployed
            </label>
            {form.hasLst && (
              <Field label="LST Token Symbol" hint={`Defaults to st${form.token || "TOKEN"} if left blank`}>
                <input
                  className={inputCls}
                  value={form.lstSymbol}
                  onChange={e => set("lstSymbol", e.target.value.toUpperCase())}
                  placeholder={`st${form.token || "TOKEN"}`}
                />
              </Field>
            )}
            {!form.hasLst && (
              <p className="text-xs text-ink-400">
                Without an LST, this chain will score in <span className="text-amber-300">pre-LST mode</span> — the first 3 scoring modules will include a 15% lstReadiness penalty.
              </p>
            )}
          </div>
        </article>

        {/* Error / Results */}
        {error && (
          <div className="rounded-xl border border-red-400/30 bg-red-400/5 p-4">
            <p className="text-sm font-semibold text-red-400">Error</p>
            <pre className="mt-1 whitespace-pre-wrap text-xs text-red-300">{error}</pre>
          </div>
        )}

        {results && (
          <div className="rounded-xl border border-emerald-400/30 bg-emerald-400/5 p-4">
            <p className="mb-3 text-sm font-semibold text-emerald-400">
              ✓ Chain added successfully
            </p>
            <ul className="flex flex-col gap-1">
              {results.map((r, i) => (
                <li key={i} className="flex items-center gap-2 text-xs">
                  <span className={r.ok ? (r.skipped ? "text-ink-400" : "text-emerald-400") : "text-red-400"}>
                    {r.ok ? (r.skipped ? "SKIP" : " OK ") : "ERR "}
                  </span>
                  <span className="font-mono text-ink-200">{r.file}</span>
                  {r.skipped && <span className="text-ink-400">(hasLst=true)</span>}
                  {r.error && <span className="text-red-300">{r.error}</span>}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs text-ink-300">
              Next: go to <span className="font-semibold text-ink-100">Data Sync</span> and run CoinGecko + DefiLlama + Rebuild to populate live data.
            </p>
          </div>
        )}

        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={!isReady || isSaving || !!networkIdError}
            className="rounded-xl border border-[#7baff5]/40 bg-[#7baff5]/15 px-5 py-2.5 text-sm font-semibold text-[#dcecff] transition hover:bg-[#7baff5]/25 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSaving ? "Adding chain…" : "Add Chain"}
          </button>
          {!isEligible && (
            <p className="text-xs text-amber-400">Confirm eligibility above to enable the form.</p>
          )}
        </div>
      </form>
    </section>
  );
}
