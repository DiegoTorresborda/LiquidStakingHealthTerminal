"use client";

import { FormEvent, useMemo, useState } from "react";

type SubmitState = "idle" | "submitting" | "success" | "error";

type FormState = {
  projectName: string;
  website: string;
  email: string;
  telegram: string;
};

const INITIAL_FORM: FormState = {
  projectName: "",
  website: "",
  email: "",
  telegram: ""
};

export function NetworkAssessmentCta() {
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [message, setMessage] = useState<string>("");

  const contactError = useMemo(() => {
    if (form.email.trim().length > 0 || form.telegram.trim().length > 0) {
      return "";
    }

    return "Add an email or Telegram account so we can respond.";
  }, [form.email, form.telegram]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (contactError) {
      setSubmitState("error");
      setMessage(contactError);
      return;
    }

    setSubmitState("submitting");
    setMessage("");

    try {
      const response = await fetch("/api/network-assessment", {
        method: "POST",
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify({
          projectName: form.projectName,
          website: form.website,
          email: form.email,
          telegram: form.telegram
        })
      });

      const payload = (await response.json().catch(() => null)) as { ok?: boolean; error?: string } | null;

      if (!response.ok || !payload?.ok) {
        setSubmitState("error");
        setMessage(payload?.error ?? "Failed to send request. Try again.");
        return;
      }

      setSubmitState("success");
      setMessage("Request sent. We will contact you soon.");
      setForm(INITIAL_FORM);
    } catch {
      setSubmitState("error");
      setMessage("Network error while sending request.");
    }
  }

  return (
    <section
      id="assessment-request"
      className="rounded-2xl border border-[#7baff5]/35 bg-[#7baff5]/10 p-5 shadow-card"
      aria-labelledby="assessment-request-title"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 id="assessment-request-title" className="font-[var(--font-heading)] text-2xl font-semibold text-ink-50">
          Request Network Assessment
        </h2>
        <span className="rounded-md border border-ink-300/30 bg-ink-900/25 px-2 py-1 text-xs text-ink-100">
          Sent to diego@protofire.io
        </span>
      </div>

      <p className="mt-2 max-w-3xl text-sm text-ink-100">
        Share your project details and we can evaluate your LST ecosystem opportunity profile.
      </p>

      <form onSubmit={onSubmit} className="mt-4 grid gap-3 md:grid-cols-2">
        <label className="block">
          <span className="mb-2 block text-xs uppercase tracking-[0.14em] text-ink-300">Project</span>
          <input
            required
            value={form.projectName}
            onChange={(event) => setForm((current) => ({ ...current, projectName: event.target.value }))}
            placeholder="Project name"
            className="w-full rounded-lg border border-ink-300/25 bg-slateglass-600/70 px-3 py-2 text-sm text-ink-50 outline-none ring-[#7baff5]/30 transition focus:ring"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-xs uppercase tracking-[0.14em] text-ink-300">Website</span>
          <input
            required
            type="url"
            value={form.website}
            onChange={(event) => setForm((current) => ({ ...current, website: event.target.value }))}
            placeholder="https://example.org"
            className="w-full rounded-lg border border-ink-300/25 bg-slateglass-600/70 px-3 py-2 text-sm text-ink-50 outline-none ring-[#7baff5]/30 transition focus:ring"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-xs uppercase tracking-[0.14em] text-ink-300">Email (optional)</span>
          <input
            type="email"
            value={form.email}
            onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
            placeholder="contact@project.com"
            className="w-full rounded-lg border border-ink-300/25 bg-slateglass-600/70 px-3 py-2 text-sm text-ink-50 outline-none ring-[#7baff5]/30 transition focus:ring"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-xs uppercase tracking-[0.14em] text-ink-300">Telegram (optional)</span>
          <input
            value={form.telegram}
            onChange={(event) => setForm((current) => ({ ...current, telegram: event.target.value }))}
            placeholder="@handle or t.me/link"
            className="w-full rounded-lg border border-ink-300/25 bg-slateglass-600/70 px-3 py-2 text-sm text-ink-50 outline-none ring-[#7baff5]/30 transition focus:ring"
          />
        </label>

        <div className="md:col-span-2 flex flex-wrap items-center gap-3">
          <button
            type="submit"
            disabled={submitState === "submitting"}
            className="inline-flex items-center rounded-lg border border-[#7baff5]/50 bg-[#7baff5]/25 px-3 py-2 text-sm font-semibold text-[#dcecff] transition hover:bg-[#7baff5]/35 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitState === "submitting" ? "Sending..." : "Send Assessment Request"}
          </button>

          {message ? (
            <p className={`text-sm ${submitState === "error" ? "text-coral" : "text-ink-100"}`}>{message}</p>
          ) : null}
        </div>
      </form>
    </section>
  );
}
