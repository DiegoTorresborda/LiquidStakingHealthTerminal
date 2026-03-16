export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-8 border-t border-ink-300/10 px-4 py-6 md:px-8">
      <div className="mx-auto flex w-full max-w-[1360px] flex-col items-center justify-between gap-2 text-xs text-ink-400 sm:flex-row">
        <p>© {year} Protofire. All rights reserved.</p>
        <p>LST Ecosystem Health Dashboard</p>
      </div>
    </footer>
  );
}
