import Link from 'next/link';
import { db } from '@/lib/data';
import { ListingCard } from '@/components/ui';
import { money } from '@/lib/format';

export const dynamic = 'force-dynamic';

const CITIES = [
  { name: 'Dhaka', country: 'Bangladesh', status: 'Live', tint: '#CFE1D8' },
  { name: 'Chattogram', country: 'Bangladesh', status: 'Coming soon', tint: '#D6DDEA' },
  { name: 'Dubai', country: 'UAE', status: 'Coming soon', tint: '#E7DCC2' },
  { name: 'Kuala Lumpur', country: 'Malaysia', status: 'Coming soon', tint: '#E3D6E6' },
  { name: 'London', country: 'United Kingdom', status: 'Coming soon', tint: '#D9E6D0' },
  { name: 'Toronto', country: 'Canada', status: 'Coming soon', tint: '#EADBD2' },
];

export default function Home() {
  const live = db.listings.filter((l) => l.status === 'Live');
  return (
    <>
      <section className="bg-hero text-heroink">
        <div className="gutter max-w-6xl mx-auto py-12 md:py-16 flex flex-col gap-5">
          <span className="self-start font-display font-extrabold text-xs tracking-[.12em] bg-sign text-signink px-2.5 py-1 rounded-sm -rotate-2">
            TO-LET, WITHOUT THE PHONE CALLS
          </span>
          <h1 className="font-display font-extrabold text-4xl md:text-6xl leading-[1.05] max-w-[18ch] m-0 [text-wrap:balance]">
            Find a home to rent. Book it for the dates you need.
          </h1>
          <p className="text-lg opacity-80 max-w-[56ch] m-0">
            Verified owners, real photos and a map pin on every listing. Request your dates, the owner confirms, and the home is yours.
          </p>
          <form action="/search" className="bg-surface text-ink rounded-2xl p-2.5 flex flex-wrap gap-2.5 max-w-3xl">
            <label htmlFor="hq" className="flex-[3_1_240px] flex flex-col px-3 py-1.5 rounded-xl bg-bg">
              <span className="text-xs font-semibold text-muted">City or area</span>
              <input id="hq" name="q" placeholder="Mirpur 10, Uttara, Dhanmondi…" className="bg-transparent outline-none text-base font-medium min-w-0" />
            </label>
            <label htmlFor="hmax" className="flex-[1_1_150px] flex flex-col px-3 py-1.5 rounded-xl bg-bg">
              <span className="text-xs font-semibold text-muted">Max rent</span>
              <select id="hmax" name="max" className="bg-transparent outline-none text-[15px]">
                <option value="">Any</option>
                {[15000, 25000, 50000].map((v) => (
                  <option key={v} value={v}>
                    {money(v)}
                  </option>
                ))}
              </select>
            </label>
            <button className="btn-primary flex-[1_1_120px] h-auto min-h-[52px]">Search</button>
          </form>
          <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm opacity-90">
            <Link href="/assistant" className="underline underline-offset-4">Describe your home to the assistant</Link>
            <Link href="/areas" className="underline underline-offset-4">Not sure which area? Compare neighbourhoods</Link>
          </div>
        </div>
      </section>

      <div className="gutter max-w-6xl mx-auto py-10 flex flex-col gap-12">
        <section className="flex flex-col gap-4">
          <div className="flex flex-wrap justify-between items-baseline gap-2">
            <h2 className="font-display font-extrabold text-2xl m-0">New in Dhaka</h2>
            <Link href="/search" className="font-semibold text-brand">See all {live.length} homes</Link>
          </div>
          <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(240px,1fr))]">
            {live.slice(0, 4).map((l) => (
              <ListingCard key={l.id} l={l} />
            ))}
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="font-display font-extrabold text-2xl m-0">Cities</h2>
          <div className="grid gap-3 grid-cols-[repeat(auto-fill,minmax(160px,1fr))]">
            {CITIES.map((c) => (
              <Link key={c.name} href={c.status === 'Live' ? '/search' : '/'} className="card overflow-hidden">
                <div className="h-20" style={{ background: c.tint }} />
                <div className="p-3">
                  <div className="font-display font-bold">{c.name}</div>
                  <div className="text-sm text-muted">{c.country} · {c.status}</div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="font-display font-extrabold text-2xl m-0">How renting works</h2>
          <ol className="list-none p-0 m-0 grid gap-4 grid-cols-[repeat(auto-fit,minmax(220px,1fr))]">
            {[
              ['Search and compare', 'Filter by area, rent, rooms and facilities. See photos and the map pin first.'],
              ['Request your dates', 'Pick a move-in date and stay length. The owner replies within 24 hours.'],
              ['Pay the advance, move in', 'Pay with bKash, Nagad or card. The advance is held until move-in.'],
            ].map(([t, d], i) => (
              <li key={t} className="card p-5 flex flex-col gap-2">
                <span className="font-display font-extrabold text-3xl text-brand">{i + 1}</span>
                <span className="font-semibold text-lg">{t}</span>
                <span className="text-muted">{d}</span>
              </li>
            ))}
          </ol>
        </section>

        <section className="bg-sign text-signink rounded-3xl p-6 md:p-8 flex flex-wrap gap-5 justify-between items-center">
          <div className="max-w-[56ch]">
            <h2 className="font-display font-extrabold text-2xl m-0 mb-2">Own a property? List it free.</h2>
            <p className="m-0">Add photos and a map pin, set rent and dates, and approve tenants from one dashboard.</p>
          </div>
          <Link href="/owner/properties/new" className="btn bg-hero text-heroink">List your property</Link>
        </section>
      </div>
    </>
  );
}
