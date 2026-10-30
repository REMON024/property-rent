import Link from 'next/link';
import type { Booking } from '@/lib/types';
import { getListing } from '@/lib/data';
import { STATUS_LABEL, STATUS_TONE } from '@/lib/booking';
import { fmtDate, money, period } from '@/lib/format';
import { acceptBooking, cancelBooking, payAdvance, rejectBooking } from '@/lib/actions';
import { Photo, Pill } from './ui';
import { SubmitButton } from './SubmitButton';

const STEPS = ['requested', 'accepted', 'confirmed', 'rented'] as const;

export function BookingCard({ b, as }: { b: Booking; as: 'renter' | 'owner' }) {
  const l = getListing(b.listingId);
  if (!l) return null;
  const at = STEPS.indexOf(b.status as (typeof STEPS)[number]);

  let action: React.ReactNode = null;
  if (as === 'renter') {
    if (b.status === 'accepted')
      action = (
        <form action={payAdvance} className="flex flex-col gap-2">
          <input type="hidden" name="bookingId" value={b.id} />
          <label className="label" htmlFor={`pm-${b.id}`}>
            Pay {money(l.advance)} with
            <select id={`pm-${b.id}`} name="method" className="field">
              <option>bKash</option>
              <option>Nagad</option>
              <option>Visa / Mastercard</option>
            </select>
          </label>
          <SubmitButton pending="Paying…">Pay advance</SubmitButton>
        </form>
      );
    else if (b.status === 'requested')
      action = (
        <form action={cancelBooking.bind(null, b.id)}>
          <SubmitButton className="btn-danger w-full" pending="Cancelling…">Cancel request</SubmitButton>
        </form>
      );
    else if (b.status === 'confirmed')
      action = (
        <>
          <span className="text-sm">Advance paid{b.paymentMethod ? ` by ${b.paymentMethod}` : ''}. Held until move-in.</span>
          <span className="text-sm text-muted">House number: Road 4, House 12/B</span>
        </>
      );
  } else if (b.status === 'requested') {
    action = (
      <div className="flex gap-2">
        <form action={rejectBooking.bind(null, b.id)} className="flex-1">
          <SubmitButton className="btn-ghost w-full" pending="…">Reject</SubmitButton>
        </form>
        <form action={acceptBooking.bind(null, b.id)} className="flex-1">
          <SubmitButton className="btn-primary w-full" pending="…">Accept</SubmitButton>
        </form>
      </div>
    );
  }

  return (
    <article className="card overflow-hidden">
      <div className="p-4 flex flex-wrap gap-4 items-center">
        <div className="w-28 flex-none"><Photo listing={l} className="h-20" /></div>
        <div className="flex-[1_1_220px] min-w-0 flex flex-col gap-1">
          <div className="flex flex-wrap gap-2 items-center">
            <Pill tone={STATUS_TONE[b.status]}>{STATUS_LABEL[b.status]}</Pill>
            <span className="text-[13px] text-muted">{b.id}</span>
          </div>
          <Link href={as === 'owner' ? `/owner/properties/${l.id}` : `/listings/${l.id}`} className="font-display font-bold text-lg text-ink hover:text-brand">
            {l.title}
          </Link>
          <span className="text-sm text-muted tabnum">
            {as === 'owner' ? `${b.renterLabel} · ` : ''}
            {period(b.startDate, b.months)} · {b.months} months · {money(l.rent)}/month
          </span>
        </div>
        {action && <div className="flex-[0_1_240px] w-full flex flex-col gap-2">{action}</div>}
      </div>
      {as === 'renter' && at >= 0 && (
        <ol aria-label="Booking progress" className="list-none m-0 px-4 py-3 border-t border-line bg-bg grid grid-cols-2 sm:grid-cols-4 gap-2 text-[13px]">
          {['Requested', 'Owner accepted', 'Advance paid', `Move in ${fmtDate(b.startDate).replace(/ \d{4}$/, '')}`].map((s, i) => (
            <li key={s} className={`flex items-center gap-2 ${i <= at ? 'text-ink font-semibold' : 'text-muted'}`}>
              <span className={`w-5 h-5 rounded-full flex-none ${i <= at ? 'bg-brand' : 'border-2 border-line'}`} />
              {s}
            </li>
          ))}
        </ol>
      )}
    </article>
  );
}
