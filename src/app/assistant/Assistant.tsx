'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import type { Listing } from '@/lib/types';
import { parseQuery, type Parsed } from '@/lib/parseQuery';
import { money } from '@/lib/format';
import { Photo } from '@/components/ui';

const EXAMPLE = 'মিরপুর ১০ মেট্রোর কাছে ৩ বেডের ফ্যামিলি বাসা, under 20k. Gas line must. December move in.';
const MONTH_NUM: Record<string, string> = { January: '01', February: '02', March: '03', April: '04', May: '05', June: '06', July: '07', August: '08', September: '09', October: '10', November: '11', December: '12' };

function score(l: Listing, p: Parsed) {
  const misses: string[] = [];
  const hits: string[] = [];
  if (p.area) (l.area === p.area ? hits : misses).push(l.area === p.area ? `In ${l.area}` : `In ${l.area}, not ${p.area}`);
  if (p.maxRent) (l.rent <= p.maxRent ? hits : misses).push(l.rent <= p.maxRent ? `${money(l.rent)}, within budget` : `${money(l.rent)}, over budget`);
  if (p.beds) (l.bedrooms >= p.beds ? hits : misses).push(l.bedrooms >= p.beds ? `${l.bedrooms} bedrooms` : `Only ${l.bedrooms} bedroom${l.bedrooms > 1 ? 's' : ''}`);
  if (p.tenant && l.tenantType !== p.tenant) misses.push(`${l.tenantType} only`);
  p.facilities.forEach((f) => (l.facilities.includes(f) ? hits.push(f) : misses.push(`No ${f.toLowerCase()}`)));
  if (p.month) {
    const m = MONTH_NUM[p.month];
    const ok = l.availableFrom.slice(5, 7) <= m || l.availableFrom.slice(0, 4) < '2026';
    (ok ? hits : misses).push(ok ? `Free for ${p.month}` : `Free only from ${l.availableFrom}`);
  }
  const total = hits.length + misses.length || 1;
  return { fit: Math.round((hits.length / total) * 100), hits, misses };
}

export function Assistant({ listings }: { listings: Listing[] }) {
  const [text, setText] = useState(EXAMPLE);
  const [asked, setAsked] = useState(EXAMPLE);
  const [lift, setLift] = useState<boolean | null>(null);

  const parsed = useMemo(() => {
    const p = parseQuery(asked);
    if (lift && !p.facilities.includes('Lift')) p.facilities = [...p.facilities, 'Lift'];
    return p;
  }, [asked, lift]);

  const results = useMemo(
    () =>
      listings
        .map((l) => ({ l, ...score(l, parsed) }))
        .filter((r) => r.fit >= 50)
        .sort((a, b) => b.fit - a.fit)
        .slice(0, 6),
    [listings, parsed],
  );

  const askLift = lift === null && !parsed.facilities.includes('Lift') && results.some((r) => !r.l.facilities.includes('Lift'));

  const chips = [
    parsed.area && `${parsed.nearMetro ? 'Near the metro, ' : ''}${parsed.area}`,
    parsed.beds && `${parsed.beds}+ bedrooms`,
    parsed.tenant,
    parsed.maxRent && `Up to ${money(parsed.maxRent)}`,
    ...parsed.facilities.map((f) => `${f} required`),
    parsed.month && `Move in ${parsed.month}`,
  ].filter(Boolean) as string[];

  return (
    <div className="flex flex-wrap gap-6 items-start">
      <section aria-label="Assistant" className="flex-[1_1_360px] min-w-0 card p-4 flex flex-col gap-4">
        <div className="self-end max-w-[90%] bg-ink text-bg px-3.5 py-3 rounded-2xl rounded-br-sm leading-relaxed">{asked}</div>
        <div className="flex flex-col gap-3">
          <span>Here is what I understood:</span>
          <div className="flex flex-wrap gap-1.5">
            {chips.length ? chips.map((c) => <span key={c} className="text-[13px] font-semibold px-2.5 py-1 rounded-lg bg-brandsoft text-brand border border-brand/30">{c}</span>) : <span className="text-muted text-sm">Nothing yet. Try an area, budget and number of rooms.</span>}
          </div>
          {askLift && (
            <>
              <span>One question: do you need a lift? Some good matches are without one.</span>
              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={() => setLift(true)} className="h-10 px-4 rounded-full border-[1.5px] border-ink font-semibold text-sm">Yes, lift needed</button>
                <button type="button" onClick={() => setLift(false)} className="h-10 px-4 rounded-full border border-line font-semibold text-sm">Any floor is fine</button>
              </div>
            </>
          )}
          {lift !== null && <span className="text-muted text-sm">{lift ? 'Got it. Only homes with a lift.' : 'Got it. Any floor works.'}</span>}
        </div>
        <form
          className="flex items-center gap-2 border-[1.5px] border-ink rounded-xl p-1.5 pl-3.5"
          onSubmit={(e) => {
            e.preventDefault();
            setAsked(text);
            setLift(null);
          }}
        >
          <label htmlFor="ask" className="sr-only">Describe the home you want</label>
          <input id="ask" value={text} onChange={(e) => setText(e.target.value)} className="flex-1 min-w-0 bg-transparent outline-none" placeholder="e.g. 2 bed bachelor flat in Badda under 15k with Wi-Fi" />
          <button aria-label="Send" className="w-10 h-10 rounded-lg bg-ink text-bg flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
          </button>
        </form>
      </section>

      <section aria-label="Matches" className="flex-[999_1_520px] min-w-0 flex flex-col gap-3">
        <h2 className="font-display font-extrabold text-2xl m-0">{results.length} {results.length === 1 ? 'home fits' : 'homes fit'} what you asked</h2>
        {results.map(({ l, fit, hits, misses }) => (
          <Link key={l.id} href={`/listings/${l.id}`} className="card p-3.5 flex flex-wrap gap-4 hover:border-brand">
            <div className="relative w-40 flex-none max-w-full">
              <Photo listing={l} className="h-28" />
              <span className="absolute left-2 top-2 font-display font-bold text-[13px] bg-sign text-signink px-2 py-0.5 rounded-md">{fit}% fit</span>
            </div>
            <div className="flex-[1_1_220px] min-w-0 flex flex-col gap-1">
              <div className="flex flex-wrap justify-between gap-2">
                <span className="font-display font-bold text-lg">{l.title}</span>
                <span className="font-display font-extrabold text-lg tabnum">{money(l.rent)}</span>
              </div>
              <span className="text-sm text-muted">{l.bedrooms} bed · {l.bathrooms} bath · {l.area}</span>
              <span className="text-sm">{hits.join(' · ')}</span>
              {misses.length > 0 && <span className="text-sm text-warn">{misses.join(' · ')}</span>}
            </div>
          </Link>
        ))}
        {results.length === 0 && <div className="card p-8 text-muted text-center">No close matches. Try a higher budget or another area.</div>}
      </section>
    </div>
  );
}
