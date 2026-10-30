import Link from 'next/link';
import { Suspense } from 'react';
import type { Metadata } from 'next';
import { searchListings } from '@/lib/data';
import { ListingCard, MapBase, Photo } from '@/components/ui';
import { money } from '@/lib/format';
import { Filters, SortAndView } from './Filters';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Search homes' };

type SP = Record<string, string | string[] | undefined>;
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);
const many = (v: string | string[] | undefined) => (Array.isArray(v) ? v : v ? [v] : []);
const shortRent = (n: number) => (n >= 1000 ? `${(n / 1000).toFixed(n % 1000 ? 1 : 0)}k` : String(n));

export default function SearchPage({ searchParams }: { searchParams: SP }) {
  const results = searchListings({
    q: one(searchParams.q),
    max: Number(one(searchParams.max)) || undefined,
    beds: Number(one(searchParams.beds)) || undefined,
    tenant: one(searchParams.tenant),
    facilities: many(searchParams.fac),
    sort: (one(searchParams.sort) as 'new' | 'low' | 'high') ?? 'new',
  });
  const view = one(searchParams.view) === 'map' ? 'map' : 'list';
  const selId = Number(one(searchParams.sel)) || results[0]?.id;
  const sel = results.find((r) => r.id === selId) ?? results[0];
  const q = one(searchParams.q);

  const selHref = (id: number) => {
    const p = new URLSearchParams();
    Object.entries(searchParams).forEach(([k, v]) => many(v).forEach((x) => p.append(k, x)));
    p.set('view', 'map');
    p.set('sel', String(id));
    return `/search?${p.toString()}`;
  };

  return (
    <>
      <div className="bg-surface border-b border-line">
        <div className="gutter max-w-6xl mx-auto py-4">
          <Suspense>
            <Filters />
          </Suspense>
        </div>
      </div>

      <div className="gutter max-w-6xl mx-auto py-5 flex flex-col gap-4">
        <div className="flex flex-wrap justify-between items-center gap-3">
          <span className="text-muted">
            <b className="text-ink">{results.length} {results.length === 1 ? 'home' : 'homes'}</b>
            {q ? ` matching “${q}”` : ' in Dhaka'}
          </span>
          <Suspense>
            <SortAndView view={view} />
          </Suspense>
        </div>

        {results.length === 0 && (
          <div className="card p-10 text-center text-muted">
            No homes match. Try a nearby area, raise the rent limit or remove a facility.{' '}
            <Link href="/assistant" className="text-brand font-semibold">Ask the assistant</Link>
          </div>
        )}

        {results.length > 0 && view === 'list' && (
          <div className="flex flex-wrap gap-6 items-start">
            <div className="flex-[999_1_520px] min-w-0 grid gap-4 grid-cols-[repeat(auto-fill,minmax(240px,1fr))]">
              {results.map((l) => (
                <ListingCard key={l.id} l={l} />
              ))}
            </div>
            <aside aria-label="Map" className="flex-[1_1_300px] min-w-0 lg:sticky lg:top-24">
              <MapBase className="h-[420px] lg:h-[520px]">
                {results.map((l) => (
                  <Link key={l.id} href={`/listings/${l.id}`} className="absolute h-8 px-2.5 rounded-full border-2 border-ink bg-surface text-ink text-[13px] font-bold tabnum flex items-center hover:bg-ink hover:text-bg" style={{ left: `${Math.min(l.mapX, 82)}%`, top: `${l.mapY}%` }}>
                    {shortRent(l.rent)}
                  </Link>
                ))}
              </MapBase>
            </aside>
          </div>
        )}

        {results.length > 0 && view === 'map' && sel && (
          /* Concept A: map-first */
          <div className="flex flex-wrap card overflow-hidden">
            <ul className="list-none m-0 p-0 flex-[1_1_320px] min-w-0 max-h-[640px] overflow-y-auto border-line md:border-r">
              {results.map((l) => (
                <li key={l.id}>
                  <Link href={selHref(l.id)} scroll={false} aria-current={l.id === sel.id ? 'true' : undefined} className={`flex gap-3 p-3.5 border-b border-line ${l.id === sel.id ? 'bg-brandsoft' : ''}`}>
                    <div className="w-24 flex-none"><Photo listing={l} className="h-20" /></div>
                    <div className="min-w-0 flex flex-col">
                      <span className="font-display font-extrabold tabnum">{money(l.rent)}</span>
                      <span className="font-semibold text-[15px] truncate">{l.title}</span>
                      <span className="text-sm text-muted">{l.bedrooms} bed · {l.area}</span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
            <div className="flex-[999_1_480px] min-w-0">
              <MapBase className="h-[480px] md:h-[640px] !rounded-none !border-0">
                {results.map((l) => (
                  <Link key={l.id} href={selHref(l.id)} scroll={false} className={`absolute h-8 px-2.5 rounded-full border-2 border-ink text-[13px] font-bold tabnum flex items-center ${l.id === sel.id ? 'bg-ink text-bg' : 'bg-surface text-ink'}`} style={{ left: `${Math.min(l.mapX, 82)}%`, top: `${l.mapY}%` }}>
                    {shortRent(l.rent)}
                  </Link>
                ))}
                <div className="absolute right-4 bottom-4 left-4 sm:left-auto sm:w-72 bg-surface rounded-2xl shadow-xl overflow-hidden">
                  <Photo listing={sel} className="h-28 !rounded-none" />
                  <div className="p-3.5 flex flex-col gap-1">
                    <span className="font-display font-extrabold text-lg tabnum">{money(sel.rent)}<span className="font-sans font-normal text-xs text-muted"> /month</span></span>
                    <span className="font-semibold">{sel.title}</span>
                    <span className="text-sm text-muted">{sel.bedrooms} bed · {sel.bathrooms} bath · {sel.area}</span>
                    <Link href={`/listings/${sel.id}`} className="btn-primary mt-2">View and book</Link>
                  </div>
                </div>
              </MapBase>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
