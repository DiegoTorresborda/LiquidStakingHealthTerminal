"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

const NAV_ITEMS = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/data-sync", label: "Data Sync" },
  { href: "/admin/manual-data", label: "Manual Data" },
  { href: "/admin/resources", label: "Resources" },
  { href: "/admin/overrides", label: "Overrides" },
  { href: "/admin/add-chain", label: "Add Chain" },
  { href: "/admin/networks", label: "Networks" }
];

type AdminShellProps = {
  children: React.ReactNode;
};

export function AdminShell({ children }: AdminShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  async function handleLogout() {
    try {
      setIsLoggingOut(true);
      await fetch("/api/admin/logout", { method: "POST" });
      router.replace("/admin/login");
      router.refresh();
    } finally {
      setIsLoggingOut(false);
    }
  }

  return (
    <main className="mx-auto flex w-full max-w-[1280px] flex-col gap-6 px-4 py-6 md:px-8 md:py-8">
      <section className="surface-grid rounded-2xl border border-ink-300/20 bg-slateglass-700/45 p-5 shadow-glow backdrop-blur">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-ink-300">Internal Tooling</p>
            <h1 className="font-[var(--font-heading)] text-3xl font-semibold text-ink-50">Admin Data Control Panel</h1>
            <p className="mt-2 text-sm text-ink-100">Manage data syncs, manual fields, chain resources, and overrides.</p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="rounded-xl border border-ink-300/30 bg-ink-900/25 px-4 py-2.5 text-sm font-semibold text-ink-50 transition hover:bg-ink-900/40 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoggingOut ? "Logging out..." : "Logout"}
          </button>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition ${
                  isActive
                    ? "border-[#7baff5]/50 bg-[#7baff5]/20 text-[#dcecff]"
                    : "border-ink-300/30 bg-ink-900/20 text-ink-100 hover:bg-ink-900/35"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </section>

      {children}
    </main>
  );
}
