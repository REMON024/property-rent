'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NAV, activeNav } from './nav';

export function Header() {
  const active = activeNav(usePathname());
  return (
    <header className="sticky top-0 z-40 bg-surface border-b border-line" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
      <div className="gutter max-w-6xl mx-auto flex items-center justify-between gap-3 py-3">
        <Link href="/" className="flex items-center gap-2.5 text-ink">
          <span className="font-display font-extrabold text-[11px] tracking-[.1em] bg-sign text-signink px-2 py-0.5 rounded-sm -rotate-3">
            TO-LET
          </span>
          <span className="font-display font-extrabold text-xl">Basha Khoj</span>
        </Link>
        <nav aria-label="Main" className="hidden md:flex items-center gap-1 text-[15px]">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              aria-current={active === n.href ? 'page' : undefined}
              className={`px-3 py-2 rounded-lg ${active === n.href ? 'bg-brandsoft text-brand font-semibold' : 'text-ink hover:bg-bg'}`}
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <Link href="/signin" className="h-10 px-4 rounded-lg border border-ink text-ink font-semibold text-sm flex items-center">Sign in</Link>
      </div>
    </header>
  );
}
