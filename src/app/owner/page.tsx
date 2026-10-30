import Link from 'next/link';
import type { Metadata } from 'next';
import { db, ME } from '@/lib/data';
import { money } from '@/lib/format';
import { BookingCard } from '@/components/BookingCard';
import { KycBanner } from '@/components/KycBanner';
import { LISTING_TONE, PageHead, Pill, Stat } from '@/components/ui';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Owner dashboard' };

export default function OwnerPage() {
  const mine = db.listings.filter((l) => l.ownerId === ME);
  const ids = new Set(mine.map((l) => l.id));
  const requests = db.bookings.filter((b) => ids.has(b.listingId) && b.status === 'requested');
  const held = db.bookings.filter((b) => ids.has(b.listingId) && b.status === 'confirmed');
  const rentMonth = mine.filter((l) => l.status === 'Rented').reduce((s, l) => s + l.rent, 0);

  return (
    <div className="gutter max-w-6xl mx-auto py-6 flex flex-col gap-6">
      <PageHead eyebrow="Owner dashboard" title="My properties">
        <Link href="/owner/properties/new" className="btn-primary">Add property</Link>
      </PageHead>
      <KycBanner />

      <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
        <Stat label="Live listings" value={mine.filter((l) => l.status === 'Live').length} />
        <Stat label="Rent this month" value={money(rentMonth)} />
        <Stat label="Advances held" value={held.length} />
        <Stat label="Needs your reply" value={requests.length} tone={requests.length ? 'bg-sign/25 border-sign' : ''} />
      </div>

      <section className="flex flex-col gap-3">
        <h2 className="font-display font-bold text-xl m-0">Booking requests</h2>
        {requests.length ? requests.map((b) => <BookingCard key={b.id} b={b} as="owner" />) : <div className="card p-6 text-muted">No requests waiting. New requests appear here and by SMS.</div>}
      </section>

      <section className="card overflow-hidden">
        <div className="px-4 py-3 border-b border-line flex justify-between items-center">
          <h2 className="font-display font-bold text-lg m-0">Listings</h2>
          <Link href="/owner/properties/new" className="text-brand font-semibold text-sm">Add property</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[620px] text-sm border-collapse">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wider text-muted">
                <th className="px-4 py-2.5 font-semibold">Property</th>
                <th className="px-2 py-2.5 font-semibold">Status</th>
                <th className="px-2 py-2.5 font-semibold text-right">Rent</th>
                <th className="px-2 py-2.5 font-semibold text-right">Views (30 d)</th>
                <th className="px-4 py-2.5 font-semibold text-right">Requests</th>
              </tr>
            </thead>
            <tbody>
              {mine.map((l) => (
                <tr key={l.id} className="border-t border-line">
                  <td className="px-4 py-3">
                    <Link href={`/owner/properties/${l.id}`} className="font-semibold text-ink hover:text-brand hover:underline">{l.title}</Link>
                    <div className="text-xs text-muted">{l.area}, {l.city}</div>
                  </td>
                  <td className="px-2 py-3"><Pill tone={LISTING_TONE[l.status]}>{l.status}</Pill></td>
                  <td className="px-2 py-3 text-right tabnum">{money(l.rent)}</td>
                  <td className="px-2 py-3 text-right tabnum">{l.views || '—'}</td>
                  <td className="px-4 py-3 text-right tabnum">{db.bookings.filter((b) => b.listingId === l.id && b.status === 'requested').length}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
