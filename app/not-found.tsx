import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[60vh] w-full max-w-[920px] flex-col items-center justify-center gap-4 px-4 text-center">
      <p className="text-xs uppercase tracking-[0.2em] text-ink-300">Not Found</p>
      <h1 className="font-[var(--font-heading)] text-3xl font-semibold text-ink-50">Network profile not available</h1>
      <p className="max-w-xl text-sm text-ink-200">
        The requested network route does not exist in the current mock dataset.
      </p>
      <Link
        href="/"
        className="rounded-lg border border-ink-300/30 bg-slateglass-600/50 px-4 py-2 text-sm font-medium text-ink-50 hover:bg-slateglass-600/75"
      >
        Back to LST Opportunity Radar
      </Link>
    </main>
  );
}
