import Link from 'next/link';
import { notFound } from 'next/navigation';
import { db, getListing, me } from '@/lib/data';
import { setListingStatus } from '@/lib/actions';
import { BookingCard } from '@/components/BookingCard';
import { SubmitButton } from '@/components/SubmitButton';
import { Facts, LISTING_TONE, MapBase, MapLabel, PageHead, Photo, Pill, Stat } from '@/components/ui';

export const dynamic = 'force-dynamic';

export default function OwnerProperty({ params, searchParams }: { params: { id: string }; searchParams: { submitted?: string } }) {
  const l = getListing(Number(params.id));
  if (!l) notFound();
  const bookings = db.bookings.filter((b) => b.listingId === l.id);
  const quality: [string, boolean][] = [
    ['Map pin placed', true],
    ['At least 5 photos', l.photos.length >= 5 || l.photos.length === 0],
    ['Description over 80 characters', l.description.length > 80],
    ['Owner ID verified', me().kyc === 'verified'],
  ];

  const statusBtn = (to: 'Live' | 'Paused' | 'Rented', label: string, cls = 'btn-ghost') => (
    <form action={setListingStatus.bind(null, l.id, to)}>
      <SubmitButton className={cls} pending="…">{label}</SubmitButton>
    </form>
  );

  return (
    <div className="gutter max-w-6xl mx-auto py-6 flex flex-col gap-5">
      <PageHead back={{ href: '/owner', label: 'Back to my properties' }} title={l.title}>
        <Link href={`/listings/${l.id}`} className="btn-ghost">View public page</Link>
        {l.status === 'Live' && statusBtn('Paused', 'Pause')}
        {l.status === 'Live' && statusBtn('Rented', 'Mark as rented', 'btn-primary')}
        {l.status === 'Paused' && statusBtn('Live', 'Resume', 'btn-primary')}
        {l.status === 'Rented' && statusBtn('Live', 'Relist', 'btn-primary')}
      </PageHead>
      <div className="flex flex-wrap items-center gap-3 -mt-2">
        <Pill tone={LISTING_TONE[l.status]}>{l.status}</Pill>
        <span className="text-muted text-sm">{l.area}, {l.city}</span>
      </div>
      {searchParams.submitted && (
        <div role="status" className="rounded-2xl border border-info/40 bg-infosoft p-4">
          <div className="font-semibold">Submitted for review</div>
          <div className="text-sm text-muted">Our team checks new listings within 4 hours. {me().kyc !== 'verified' && <Link href="/owner/kyc" className="text-brand font-semibold">Verify your ID</Link>}</div>
        </div>
      )}

      <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
        <Stat label="Views (30 days)" value={l.views} />
        <Stat label="Saved by renters" value={Math.round(l.views / 18)} />
        <Stat label="Booking requests" value={bookings.filter((b) => b.status === 'requested').length} />
        <Stat label="Confirmed bookings" value={bookings.filter((b) => b.status === 'confirmed').length} />
      </div>

      <div className="flex flex-wrap gap-5 items-start">
        <div className="flex-[999_1_520px] min-w-0 flex flex-col gap-5">
          <section className="card p-5 flex flex-col gap-3">
            <h2 className="h-section">Photos</h2>
            <div className="grid gap-2 grid-cols-2 sm:grid-cols-4">
              {[0, 1, 2, 3].map((i) => <Photo key={i} listing={l} i={i} className="h-28" />)}
            </div>
          </section>
          <section className="card p-5 flex flex-col gap-3">
            <h2 className="h-section">Details</h2>
            <Facts l={l} />
            <div className="flex flex-wrap gap-2">{l.facilities.map((f) => <span key={f} className="px-2.5 py-1 rounded-lg border border-line text-sm">{f}</span>)}</div>
            <p className="m-0 text-sm leading-relaxed max-w-[68ch]">{l.description}</p>
          </section>
          <section className="flex flex-col gap-3">
            <h2 className="h-section">Bookings for this property</h2>
            {bookings.length ? bookings.map((b) => <BookingCard key={b.id} b={b} as="owner" />) : <div className="card p-5 text-muted">No bookings yet.</div>}
          </section>
        </div>
        <aside className="flex-[1_1_300px] min-w-0 flex flex-col gap-4">
          <MapBase className="h-56"><MapLabel x={l.mapX} y={l.mapY}>Your pin</MapLabel></MapBase>
          <div className="card p-5 flex flex-col gap-3">
            <span className="font-semibold">Listing quality</span>
            <ul className="list-none m-0 p-0 flex flex-col gap-2 text-sm">
              {quality.map(([t, ok]) => (
                <li key={t} className="flex gap-2 items-center">
                  <span className={`w-2.5 h-2.5 rounded-full ${ok ? 'bg-brand' : 'bg-warn'}`} />
                  <span className={ok ? '' : 'text-warn'}>{t}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="card p-5 flex flex-col gap-2">
            <span className="font-semibold">History</span>
            <ul className="list-none m-0 p-0 text-sm flex flex-col gap-1.5">
              {l.log.map((e, i) => <li key={i}><span className="font-semibold">{e.who}</span> <span className="text-muted">{e.what} · {e.at}</span></li>)}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
