'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';
import { money } from '@/lib/format';

const FACILITIES = ['Gas line', 'Lift', 'Generator', 'Parking', 'Security', 'Wi-Fi'];

/** Filters live in the URL so searches can be shared and the server renders results. */
export function Filters() {
  const router = useRouter();
  const path = usePathname();
  const sp = useSearchParams();
  const [q, setQ] = useState(sp.get('q') ?? '');
  const [, start] = useTransition();

  const set = (key: string, value: string | string[] | null) => {
    const next = new URLSearchParams(sp.toString());
    next.delete(key);
    if (Array.isArray(value)) value.forEach((v) => next.append(key, v));
    else if (value) next.set(key, value);
    start(() => router.replace(`${path}?${next.toString()}`, { scroll: false }));
  };

  // debounce typing in the area box
  useEffect(() => {
    const t = setTimeout(() => {
      if ((sp.get('q') ?? '') !== q) set('q', q);
    }, 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  const fac = sp.getAll('fac');
  const sel = 'field h-12 w-auto';

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-2.5">
        <label htmlFor="sq" className="flex-[3_1_240px] flex items-center gap-2 h-12 px-3.5 rounded-xl border-[1.5px] border-ink bg-surface">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
          <span className="sr-only">Area</span>
          <input id="sq" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Area: Mirpur 10, Uttara, মিরপুর…" className="flex-1 min-w-0 bg-transparent outline-none text-base" />
        </label>
        <label className="sr-only" htmlFor="smax">Max rent</label>
        <select id="smax" className={`${sel} flex-[1_1_140px]`} value={sp.get('max') ?? ''} onChange={(e) => set('max', e.target.value)}>
          <option value="">Any rent</option>
          {[10000, 15000, 20000, 25000, 50000].map((v) => (
            <option key={v} value={v}>Up to {money(v)}</option>
          ))}
        </select>
        <label className="sr-only" htmlFor="sbed">Bedrooms</label>
        <select id="sbed" className={`${sel} flex-[1_1_120px]`} value={sp.get('beds') ?? ''} onChange={(e) => set('beds', e.target.value)}>
          <option value="">Any beds</option>
          {[1, 2, 3].map((v) => (
            <option key={v} value={v}>{v}+ beds</option>
          ))}
        </select>
        <label className="sr-only" htmlFor="sfor">Tenant type</label>
        <select id="sfor" className={`${sel} flex-[1_1_150px]`} value={sp.get('tenant') ?? ''} onChange={(e) => set('tenant', e.target.value)}>
          <option value="">Family or bachelor</option>
          <option>Family</option>
          <option>Bachelor</option>
        </select>
      </div>
      <div className="flex gap-2 overflow-x-auto pb-1" role="group" aria-label="Facilities">
        {FACILITIES.map((f) => {
          const on = fac.includes(f);
          return (
            <button
              key={f}
              type="button"
              aria-pressed={on}
              onClick={() => set('fac', on ? fac.filter((x) => x !== f) : [...fac, f])}
              className={`flex-none h-9 px-3.5 rounded-full text-sm font-medium border ${on ? 'border-brand bg-brandsoft text-brand' : 'border-line bg-surface text-ink'}`}
            >
              {f}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function SortAndView({ view }: { view: string }) {
  const router = useRouter();
  const path = usePathname();
  const sp = useSearchParams();
  const set = (k: string, v: string) => {
    const n = new URLSearchParams(sp.toString());
    n.set(k, v);
    router.replace(`${path}?${n.toString()}`, { scroll: false });
  };
  return (
    <div className="flex items-center gap-2">
      <label className="flex items-center gap-2 text-sm text-muted" htmlFor="ssort">
        Sort
        <select id="ssort" className="h-10 rounded-lg border border-line bg-surface text-ink px-2" value={sp.get('sort') ?? 'new'} onChange={(e) => set('sort', e.target.value)}>
          <option value="new">Newest</option>
          <option value="low">Rent: low to high</option>
          <option value="high">Rent: high to low</option>
        </select>
      </label>
      <div role="group" aria-label="View" className="flex bg-surface border border-line rounded-lg p-0.5">
        {['list', 'map'].map((v) => (
          <button key={v} type="button" aria-pressed={view === v} onClick={() => set('view', v)} className={`h-9 px-3 rounded-md text-sm font-semibold capitalize ${view === v ? 'bg-ink text-bg' : 'text-ink'}`}>
            {v}
          </button>
        ))}
      </div>
    </div>
  );
}
