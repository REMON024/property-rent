import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getListing, getUser } from '@/lib/data';
import { requestBooking } from '@/lib/actions';
import { money } from '@/lib/format';
import { MapBase, MapLabel, Photo } from '@/components/ui';
import { SubmitButton } from '@/components/SubmitButton';

export const dynamic = 'force-dynamic';

export function generateMetadata({ params }: { params: { id: string } }) {
  const l = getListing(Number(params.id));
  return { title: l ? `${l.title}, ${l.area}` : 'Home not found' };
}

export default function ListingPage({ params }: { params: { id: string } }) {
  const l = getListing(Number(params.id));
  if (!l) notFound();
  const owner = getUser(l.ownerId);
  const bookable = l.status === 'Live';

  return (
    <div className="gutter max-w-6xl mx-auto py-5 flex flex-col gap-5">
      <nav aria-label="Breadcrumb" className="text-sm text-muted flex flex-wrap gap-1.5">
        <Link href="/search" className="text-brand">Search</Link><span>/</span>
        <Link href={`/search?q=${encodeURIComponent(l.area)}`} className="text-brand">{l.area}</Link><span>/</span>
        <span>{l.title}</span>
      </nav>

      <div className="flex flex-col gap-1">
        <span className="text-xs font-semibold tracking-[.08em] text-brand uppercase">
          {l.tenantType} {l.bedrooms > 1 ? 'flat' : 'room'}{owner?.kyc === 'verified' ? ' · ID-verified owner' : ''}
        </span>
        <h1 className="font-display font-extrabold text-2xl md:text-3xl m-0 [text-wrap:balance]">{l.title}, {l.area}</h1>
        <span className="text-muted">{l.area}, {l.city} · House number shared after booking is confirmed</span>
      </div>

      <div className="grid gap-2 grid-cols-2 md:grid-cols-4">
        <div className="col-span-2 md:row-span-2"><Photo listing={l} className="h-56 md:h-full min-h-[14rem]" /></div>
        {['Bedroom', 'Kitchen', 'Bathroom', 'Balcony'].map((t, i) => (
          <Photo key={t} listing={l} i={i + 1} className="h-28" label={l.photos[i + 1] ? undefined : t} />
        ))}
      </div>

      <div className="flex flex-wrap gap-6 items-start">
        <div className="flex-[999_1_520px] min-w-0 flex flex-col gap-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 card overflow-hidden">
            {[['Bedrooms', l.bedrooms], ['Bathrooms', l.bathrooms], ['Size', l.sizeSqft ? `${l.sizeSqft.toLocaleString()} sqft` : '—'], ['Floor', l.floor]].map(([k, v], i) => (
              <div key={k} className={`p-4 border-line ${i % 2 === 0 ? 'border-r' : 'sm:border-r'} ${i < 2 ? 'border-b sm:border-b-0' : ''} last:border-r-0`}>
                <div className="font-display font-bold text-xl tabnum">{v}</div>
                <div className="text-sm text-muted">{k}</div>
              </div>
            ))}
          </div>
          <section className="flex flex-col gap-2 max-w-[68ch]">
            <h2 className="h-section">About this home</h2>
            <p className="m-0 leading-relaxed">{l.description}</p>
          </section>
          <section className="flex flex-col gap-2">
            <h2 className="h-section">Facilities</h2>
            <div className="flex flex-wrap gap-2">
              {l.facilities.map((f) => (
                <span key={f} className="px-3 py-1.5 rounded-lg border border-line bg-surface text-sm">{f}</span>
              ))}
            </div>
          </section>
          <section className="flex flex-col gap-2">
            <h2 className="h-section">Location</h2>
            <MapBase><MapLabel x={l.mapX} y={l.mapY}>This home</MapLabel></MapBase>
          </section>
          <section className="flex flex-col gap-2">
            <h2 className="h-section">House rules</h2>
            <ul className="m-0 pl-5 leading-7">
              <li>{l.tenantType === 'Family' ? 'Families only' : 'Bachelors welcome'}</li>
              <li>Main gate closes at 11:30 pm</li>
              <li>Electricity and gas bills paid by tenant</li>
            </ul>
          </section>
        </div>

        <aside aria-label="Book this home" className="flex-[1_1_320px] min-w-0 card p-5 flex flex-col gap-4 lg:sticky lg:top-24">
          <div className="flex items-baseline gap-1.5">
            <span className="font-display font-extrabold text-3xl tabnum">{money(l.rent, l.currency)}</span>
            <span className="text-muted">/ month</span>
          </div>
          {bookable ? (
            <form action={requestBooking} className="flex flex-col gap-4">
              <input type="hidden" name="listingId" value={l.id} />
              <label className="label" htmlFor="startDate">
                Move-in date
                <input id="startDate" name="startDate" type="date" min={l.availableFrom} defaultValue={l.availableFrom} className="field" required />
              </label>
              <fieldset className="border-0 p-0 m-0">
                <legend className="text-[13px] font-semibold text-muted mb-1.5">Stay length (minimum {l.minStayMonths} months)</legend>
                <div className="grid grid-cols-3 gap-2">
                  {[6, 12, 24].map((m) => (
                    <label key={m} className="relative">
                      <input type="radio" name="months" value={m} defaultChecked={m === Math.max(12, l.minStayMonths)} disabled={m < l.minStayMonths} className="peer sr-only" />
                      <span className="flex items-center justify-center h-11 rounded-xl border border-line text-sm font-semibold cursor-pointer peer-checked:border-2 peer-checked:border-brand peer-checked:bg-brandsoft peer-checked:text-brand peer-disabled:opacity-40 peer-focus-visible:ring-2 peer-focus-visible:ring-brand">
                        {m} months
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>
              <div className="flex flex-col gap-2 text-sm border-y border-line py-3">
                <div className="flex justify-between"><span className="text-muted">Service charge</span><span className="tabnum">{money(l.serviceCharge)} / month</span></div>
                <div className="flex justify-between font-semibold"><span>Advance after acceptance</span><span className="font-display font-extrabold tabnum">{money(l.advance)}</span></div>
              </div>
              <SubmitButton className="btn-primary h-12" pending="Sending…">Request to book</SubmitButton>
              <span className="text-[13px] text-muted">No payment now. The owner replies within 24 hours, then you pay the advance.</span>
            </form>
          ) : (
            <p className="m-0 text-muted">This home is {l.status.toLowerCase()} and not taking bookings.</p>
          )}
          <div className="flex items-center gap-3 border-t border-line pt-4">
            <div className="w-11 h-11 rounded-full bg-ink text-bg font-display font-bold flex items-center justify-center">
              {(owner?.name ?? 'O').split(' ').map((p) => p[0]).slice(0, 2).join('')}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold truncate">{owner?.name}</div>
              <div className="text-xs text-muted">{owner?.kyc === 'verified' ? 'NID verified · ' : ''}replies in about 2 hours</div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
