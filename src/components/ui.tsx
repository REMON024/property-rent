import Link from 'next/link';
import type { Listing } from '@/lib/types';
import { TINTS } from '@/lib/tints';
import { fmtDate, money } from '@/lib/format';

export function Pill({ children, tone }: { children: React.ReactNode; tone: string }) {
  return <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-md ${tone}`}>{children}</span>;
}

export const LISTING_TONE: Record<string, string> = {
  Live: 'bg-brandsoft text-brand',
  'In review': 'bg-infosoft text-info',
  Rented: 'bg-ink text-bg',
  Paused: 'bg-bg text-muted border border-line',
  Draft: 'bg-sign/30 text-signink',
};

/** Photo, or a tinted placeholder when the dummy listing has none. */
export function Photo({ listing, i = 0, className = 'h-40', label }: { listing: Listing; i?: number; className?: string; label?: string }) {
  const src = listing.photos[i];
  if (src) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={label ?? `${listing.title} photo ${i + 1}`} className={`${className} w-full object-cover rounded-xl`} />;
  }
  return (
    <div className={`${className} rounded-xl flex items-center justify-center text-sm text-[#56645D]`} style={{ background: TINTS[(listing.id + i) % TINTS.length] }}>
      {label ?? (
        <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#15231D" strokeOpacity=".45" strokeWidth="1.3" aria-hidden="true">
          <path d="M3 11 12 4l9 7" />
          <path d="M5 10v10h14V10" />
          <path d="M10 20v-6h4v6" />
        </svg>
      )}
    </div>
  );
}

export function ListingCard({ l }: { l: Listing }) {
  return (
    <Link href={`/listings/${l.id}`} className="card overflow-hidden flex flex-col hover:border-brand">
      <div className="relative">
        <Photo listing={l} className="h-40 !rounded-none" />
        <span className="absolute left-2.5 top-2.5 bg-surface text-brand text-xs font-semibold px-2 py-0.5 rounded-md">
          From {fmtDate(l.availableFrom).replace(/ \d{4}$/, '')}
        </span>
      </div>
      <div className="p-3.5 flex flex-col gap-1">
        <span className="font-display font-extrabold text-lg tabnum">
          {money(l.rent, l.currency)}
          <span className="font-sans font-normal text-xs text-muted"> /month</span>
        </span>
        <span className="font-semibold">{l.title}</span>
        <span className="text-sm text-muted">
          {l.bedrooms} bed · {l.bathrooms} bath{l.sizeSqft ? ` · ${l.sizeSqft.toLocaleString()} sqft` : ''} · {l.area}
        </span>
        <span className="flex flex-wrap gap-1.5 mt-1">
          <Pill tone={l.tenantType === 'Bachelor' ? 'bg-warnsoft text-warn' : 'bg-brandsoft text-brand'}>{l.tenantType}</Pill>
        </span>
      </div>
    </Link>
  );
}

/** Stylised map used until a real map provider is wired in (MAPS_API_KEY). */
export function MapBase({ children, className = 'h-64' }: { children?: React.ReactNode; className?: string }) {
  return (
    <div className={`${className} rounded-2xl border border-line bg-map relative overflow-hidden`}>
      <div className="absolute inset-x-0 top-[38%] h-4 bg-road" />
      <div className="absolute inset-x-0 top-[72%] h-2.5 bg-road" />
      <div className="absolute inset-y-0 left-[46%] w-3.5 bg-road" />
      <div className="absolute inset-y-0 left-[18%] w-2 bg-road" />
      <div className="absolute left-[58%] top-[46%] w-[26%] h-[16%] rounded-lg bg-park" />
      <span className="absolute left-[3%] top-[41%] text-xs text-muted">Begum Rokeya Ave</span>
      {children}
    </div>
  );
}

export function MapLabel({ x, y, children }: { x: number; y: number; children: React.ReactNode }) {
  return (
    <span className="absolute bg-ink text-bg text-sm font-semibold px-2.5 py-1 rounded-lg" style={{ left: `${Math.min(x, 72)}%`, top: `${y}%` }}>
      {children}
    </span>
  );
}

export function Stat({ label, value, tone = '' }: { label: string; value: React.ReactNode; tone?: string }) {
  return (
    <div className={`card p-4 ${tone}`}>
      <div className="text-sm text-muted">{label}</div>
      <div className="font-display font-extrabold text-2xl md:text-3xl tabnum">{value}</div>
    </div>
  );
}

export function Facts({ l }: { l: Listing }) {
  const rows: [string, React.ReactNode][] = [
    ['Rent', `${money(l.rent, l.currency)}/mo`],
    ['Advance', money(l.advance, l.currency)],
    ['Service charge', money(l.serviceCharge, l.currency)],
    ['Bedrooms', l.bedrooms],
    ['Bathrooms', l.bathrooms],
    ['Size', l.sizeSqft ? `${l.sizeSqft} sqft` : '—'],
    ['Floor', l.floor || '—'],
    ['Tenant', l.tenantType],
    ['Available', fmtDate(l.availableFrom)],
    ['Minimum stay', `${l.minStayMonths} months`],
  ];
  return (
    <dl className="grid gap-x-6 gap-y-3 grid-cols-[repeat(auto-fit,minmax(140px,1fr))] m-0 text-sm">
      {rows.map(([k, v]) => (
        <div key={k}>
          <dt className="text-muted">{k}</dt>
          <dd className="m-0 font-semibold tabnum">{v}</dd>
        </div>
      ))}
    </dl>
  );
}

export function Check({ ok, title, detail }: { ok: boolean; title: string; detail: string }) {
  return (
    <li className="flex items-start gap-3 px-5 py-3 border-t border-line first:border-t-0">
      <span className={`mt-1.5 w-2.5 h-2.5 rounded-full flex-none ${ok ? 'bg-brand' : 'bg-warn'}`} />
      <div className="min-w-0">
        <div className="font-semibold">{title}</div>
        <div className={`text-sm ${ok ? 'text-muted' : 'text-warn'}`}>{detail}</div>
      </div>
    </li>
  );
}

export function PageHead({ back, eyebrow, title, children }: { back?: { href: string; label: string }; eyebrow?: string; title: string; children?: React.ReactNode }) {
  return (
    <div className="flex flex-wrap justify-between items-end gap-3">
      <div className="min-w-0">
        {back && (
          <Link href={back.href} className="text-sm text-brand">
            {back.label}
          </Link>
        )}
        {eyebrow && <div className="text-sm text-muted">{eyebrow}</div>}
        <h1 className="font-display font-extrabold text-2xl md:text-3xl m-0 [text-wrap:balance]">
          {title}
        </h1>
      </div>
      {children && <div className="flex flex-wrap gap-2">{children}</div>}
    </div>
  );
}
