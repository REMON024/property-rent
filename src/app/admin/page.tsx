import Link from 'next/link';
import type { Metadata } from 'next';
import { db } from '@/lib/data';
import { money } from '@/lib/format';
import { LISTING_TONE, PageHead, Photo, Pill, Stat } from '@/components/ui';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Admin console' };

const MARKETS = [
  ['Bangladesh', 'BDT ৳', 'English, বাংলা', 'bKash, Nagad, cards', 'NID', 'Live'],
  ['United Arab Emirates', 'AED', 'English, العربية', 'Cards, Apple Pay', 'Emirates ID', 'Pilot'],
  ['Malaysia', 'MYR', 'English, Bahasa Melayu', 'FPX, cards', 'MyKad / passport', 'Planned'],
];
const MARKET_TONE: Record<string, string> = { Live: 'bg-brandsoft text-brand', Pilot: 'bg-infosoft text-info', Planned: 'bg-sign/30 text-signink' };

export default function AdminPage() {
  const review = db.listings.filter((l) => l.status === 'In review');
  const kycOpen = db.kyc.filter((k) => k.status === 'pending');
  const confirmed = db.bookings.filter((b) => b.status === 'confirmed');
  const escrow = confirmed.reduce((s, b) => s + (db.listings.find((l) => l.id === b.listingId)?.advance ?? 0), 0);

  return (
    <div className="gutter max-w-6xl mx-auto py-6 flex flex-col gap-6">
      <PageHead eyebrow="Admin console" title="Overview" />
      <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
        <Stat label="Live listings" value={db.listings.filter((l) => l.status === 'Live').length} />
        <Stat label="Confirmed bookings" value={confirmed.length} />
        <Stat label="Advances in escrow" value={money(escrow)} />
        <Stat label="Waiting for review" value={review.length + kycOpen.length} tone={review.length + kycOpen.length ? 'bg-sign/25 border-sign' : ''} />
      </div>

      <section className="card overflow-hidden">
        <div className="px-4 py-3 border-b border-line flex justify-between items-center">
          <h2 className="h-section">Listings waiting for review</h2>
          <span className="text-sm text-muted">{review.length} waiting</span>
        </div>
        {review.length ? (
          review.map((l) => (
            <div key={l.id} className="flex flex-wrap gap-4 items-center px-4 py-3 border-t border-line first:border-t-0">
              <div className="w-24 flex-none"><Photo listing={l} className="h-16" /></div>
              <div className="flex-[1_1_200px] min-w-0">
                <div className="font-semibold">{l.title}</div>
                <div className="text-sm text-muted">{l.area} · {money(l.rent)}/month · {l.bedrooms} bed</div>
              </div>
              <Link href={`/admin/listings/${l.id}`} className="btn-primary">Review listing</Link>
            </div>
          ))
        ) : (
          <p className="px-4 py-4 m-0 text-muted">Queue is clear.</p>
        )}
      </section>

      <section className="card overflow-hidden">
        <div className="px-4 py-3 border-b border-line flex justify-between items-center">
          <h2 className="h-section">ID verification</h2>
          <span className="text-sm text-muted">{kycOpen.length} waiting · target under 4 h</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[620px] text-sm border-collapse">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wider text-muted">
                <th className="px-4 py-2.5 font-semibold">Name</th>
                <th className="px-2 py-2.5 font-semibold">Document</th>
                <th className="px-2 py-2.5 font-semibold">Country</th>
                <th className="px-2 py-2.5 font-semibold">Status</th>
                <th className="px-4 py-2.5 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {db.kyc.map((k) => (
                <tr key={k.id} className="border-t border-line">
                  <td className="px-4 py-3 font-semibold">{k.name}{k.userId === 'u-me' ? ' (you)' : ''}</td>
                  <td className="px-2 py-3">{k.documentType}</td>
                  <td className="px-2 py-3">{k.country}</td>
                  <td className="px-2 py-3">
                    <Pill tone={k.status === 'verified' ? 'bg-brandsoft text-brand' : k.status === 'rejected' ? 'bg-warnsoft text-warn' : 'bg-infosoft text-info'}>
                      {k.status === 'pending' ? 'Waiting' : k.status === 'verified' ? 'Approved' : 'Rejected'}
                    </Pill>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link href={`/admin/kyc/${k.id}`} className={k.status === 'pending' ? 'btn-primary h-9' : 'btn-ghost h-9'}>{k.status === 'pending' ? 'Review' : 'View'}</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="card overflow-hidden">
        <h2 className="h-section px-4 py-3 border-b border-line">All listings</h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-sm border-collapse">
            <tbody>
              {db.listings.filter((l) => l.status !== 'In review').map((l) => (
                <tr key={l.id} className="border-t border-line first:border-t-0">
                  <td className="px-4 py-3">
                    <Link href={`/admin/listings/${l.id}`} className="font-semibold text-ink hover:text-brand hover:underline">{l.title}</Link>
                    <div className="text-xs text-muted">{l.area}, {l.city}</div>
                  </td>
                  <td className="px-2 py-3"><Pill tone={LISTING_TONE[l.status]}>{l.status}</Pill></td>
                  <td className="px-2 py-3 text-right tabnum">{money(l.rent)}</td>
                  <td className="px-4 py-3 text-right"><Link href={`/admin/listings/${l.id}`} className="text-brand font-semibold">Open</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="card overflow-hidden">
        <h2 className="h-section px-4 py-3 border-b border-line">Country rollout</h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-sm border-collapse">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wider text-muted">
                {['Country', 'Currency', 'Languages', 'Payments', 'ID check', 'Status'].map((h) => <th key={h} className="px-4 py-2.5 font-semibold">{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {MARKETS.map((m) => (
                <tr key={m[0]} className="border-t border-line">
                  {m.slice(0, 5).map((c, i) => <td key={i} className={`px-4 py-3 ${i === 0 ? 'font-semibold' : ''}`}>{c}</td>)}
                  <td className="px-4 py-3"><Pill tone={MARKET_TONE[m[5]]}>{m[5]}</Pill></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
