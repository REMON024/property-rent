'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NAV, activeNav } from './nav';

/** Phone-only tab bar; desktop uses the header nav. */
export function BottomNav() {
  const active = activeNav(usePathname());
  return (
    <nav
      aria-label="Mobile"
      className="md:hidden fixed inset-x-0 bottom-0 z-40 bg-surface border-t border-line grid grid-cols-5"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      {NAV.map((n) => {
        const on = active === n.href;
        return (
          <Link
            key={n.href}
            href={n.href}
            aria-current={on ? 'page' : undefined}
            className={`flex flex-col items-center justify-center gap-0.5 h-16 text-xs ${on ? 'text-brand font-semibold' : 'text-muted'}`}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d={n.icon} />
            </svg>
            {n.label}
          </Link>
        );
      })}
    </nav>
  );
}
