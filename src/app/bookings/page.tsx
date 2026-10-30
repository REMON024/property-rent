import Link from 'next/link';
import type { Metadata } from 'next';
import { db, ME } from '@/lib/data';
import { BookingCard } from '@/components/BookingCard';
import { PageHead } from '@/components/ui';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'My bookings' };

const TABS = [
  { key: 'upcoming', label: 'Upcoming', match: ['requested', 'accepted', 'confirmed'] },
  { key: 'active', label: 'Active', match: ['rented'] },
  { key: 'past', label: 'Past', match: ['completed', 'rejected', 'expired', 'cancelled'] },
];

export default function BookingsPage({ searchParams }: { searchParams: { tab?: string; sent?: string } }) {
  const tab = TABS.find((t) => t.key === searchParams.tab) ?? TABS[0];
  const mine = db.bookings.filter((b) => b.renterId === ME);
  const shown = mine.filter((b) => tab.match.includes(b.status));

  return (
    <div className="gutter max-w-5xl mx-auto py-6 flex flex-col gap-5">
      <PageHead title="My bookings" />
      {searchParams.sent && (
        <div role="status" className="rounded-2xl border border-brand/40 bg-brandsoft p-4 text-brand font-semibold">
          Request sent. The owner has 24 hours to reply, and you will get an SMS.
        </div>
      )}
      <div role="tablist" className="flex gap-1 border-b border-line overflow-x-auto">
        {TABS.map((t) => {
          const n = mine.filter((b) => t.match.includes(b.status)).length;
          const on = t.key === tab.key;
          return (
            <Link key={t.key} role="tab" aria-selected={on} href={`/bookings?tab=${t.key}`} className={`h-11 px-4 flex items-center whitespace-nowrap ${on ? 'border-b-2 border-ink font-semibold' : 'text-muted'}`}>
              {t.label} · {n}
            </Link>
          );
        })}
      </div>
      {shown.length ? (
        shown.map((b) => <BookingCard key={b.id} b={b} as="renter" />)
      ) : (
        <div className="card p-10 text-center text-muted">
          Nothing here yet. <Link href="/search" className="text-brand font-semibold">Find a home</Link> and request your dates.
        </div>
      )}
    </div>
  );
}
