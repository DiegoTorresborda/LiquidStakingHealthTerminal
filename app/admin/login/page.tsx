"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [nextPath, setNextPath] = useState("/admin");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const next = params.get("next");
    if (next && next.startsWith("/")) {
      setNextPath(next);
    }
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify({ password })
      });

      const payload = (await response.json().catch(() => null)) as { error?: string } | null;

      if (!response.ok) {
        setError(payload?.error ?? "Login failed");
        return;
      }

      router.replace(nextPath);
      router.refresh();
    } catch {
      setError("Unable to reach auth endpoint");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-[520px] flex-col justify-center px-4 py-8 md:px-8">
      <section className="surface-grid rounded-2xl border border-ink-300/20 bg-slateglass-700/45 p-6 shadow-glow backdrop-blur">
        <p className="text-xs uppercase tracking-[0.2em] text-ink-300">Internal Access</p>
        <h1 className="mt-2 font-[var(--font-heading)] text-3xl font-semibold text-ink-50">Admin Login</h1>
        <p className="mt-2 text-sm text-ink-100">Use the admin password from environment variables.</p>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3">
          <label className="text-xs uppercase tracking-[0.16em] text-ink-300" htmlFor="admin-password">
            Password
          </label>
          <input
            id="admin-password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            className="w-full rounded-xl border border-ink-300/25 bg-slateglass-600/70 px-4 py-2.5 text-sm text-ink-50 outline-none ring-[#7baff5]/30 transition focus:ring"
          />

          {error ? <p className="text-sm text-coral">{error}</p> : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-1 rounded-xl border border-[#7baff5]/45 bg-[#7baff5]/20 px-4 py-2.5 text-sm font-semibold text-[#dcecff] transition hover:bg-[#7baff5]/30 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </section>
    </main>
  );
}
