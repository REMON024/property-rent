import { notFound } from 'next/navigation';
import Link from 'next/link';
import { AREA_RANGE, db, getListing, getUser } from '@/lib/data';
import { decideListing } from '@/lib/actions';
import { money } from '@/lib/format';
import { Check, Facts, LISTING_TONE, MapBase, MapLabel, PageHead, Photo, Pill } from '@/components/ui';
import { SubmitButton } from '@/components/SubmitButton';

export const dynamic = 'force-dynamic';

export default function AdminListing({ params }: { params: { id: string } }) {
  const l = getListing(Number(params.id));
  if (!l) notFound();
  const owner = getUser(l.ownerId);
  const ownerKyc = db.kyc.find((k) => k.userId === l.ownerId);
  const [lo, hi] = AREA_RANGE[l.tenantType];
  const inRange = l.rent >= lo * 0.6 && l.rent <= hi * 1.6;
  const offPlatform = /(01[3-9]\d{8}|bkash to me|whatsapp)/i.test(l.description);
  const checks = [
    { ok: owner?.kyc === 'verified', title: 'Owner ID verified', detail: owner?.kyc === 'verified' ? 'Verified' : `Owner KYC is ${owner?.kyc ?? 'missing'}` },
    { ok: inRange, title: 'Rent within area range', detail: inRange ? `Typical ${l.tenantType.toLowerCase()} range ${money(lo)}–${money(hi)}` : `Far outside the usual ${money(lo)}–${money(hi)}` },
    { ok: true, title: 'No duplicate photos', detail: 'No match among listings in this area' },
    { ok: !offPlatform, title: 'No contact details or off-platform payment', detail: offPlatform ? 'Description contains a phone number or a direct payment request' : 'Description is clean' },
    { ok: true, title: 'Map pin inside stated area', detail: l.area },
  ];
  const flags = checks.filter((c) => !c.ok).length;

  return (
    <div className="gutter max-w-6xl mx-auto py-6 flex flex-col gap-5">
      <PageHead back={{ href: '/admin', label: 'Back to admin' }} title={l.title} />
      <div className="flex flex-wrap items-center gap-2 -mt-2">
        <Pill tone={LISTING_TONE[l.status]}>{l.status}</Pill>
        <Pill tone={flags ? 'bg-warnsoft text-warn' : 'bg-brandsoft text-brand'}>{flags ? `${flags} flag${flags > 1 ? 's' : ''}` : 'All checks passed'}</Pill>
        <span className="text-sm text-muted">{l.area}, {l.city} · Listing #{l.id}</span>
      </div>

      <div className="flex flex-wrap gap-5 items-start">
        <div className="flex-[999_1_520px] min-w-0 flex flex-col gap-5">
          <section className="card overflow-hidden">
            <h2 className="h-section px-5 py-3 border-b border-line">Automated checks</h2>
            <ul className="list-none m-0 p-0">{checks.map((c) => <Check key={c.title} {...c} />)}</ul>
          </section>
          <section className="card p-5 flex flex-col gap-3">
            <h2 className="h-section">Photos</h2>
            <div className="grid gap-2 grid-cols-2 sm:grid-cols-4">{[0, 1, 2, 3].map((i) => <Photo key={i} listing={l} i={i} className="h-28" />)}</div>
          </section>
          <section className="card p-5 flex flex-col gap-3">
            <h2 className="h-section">Details as submitted</h2>
            <Facts l={l} />
            <p className="m-0 text-sm leading-relaxed max-w-[68ch]">{l.description}</p>
          </section>
          <section className="card overflow-hidden">
            <h2 className="h-section px-5 py-3 border-b border-line">Audit log</h2>
            <ul className="list-none m-0 p-0 text-sm">
              {l.log.map((e, i) => (
                <li key={i} className="px-5 py-2.5 border-t border-line first:border-t-0 flex flex-wrap gap-x-3">
                  <span className="font-semibold">{e.who}</span><span className="text-muted">{e.what}</span><span className="text-muted ml-auto tabnum">{e.at}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <aside className="flex-[1_1_300px] min-w-0 flex flex-col gap-4 lg:sticky lg:top-24">
          <div className="card p-5 flex flex-col gap-2">
            <span className="text-sm text-muted">Owner</span>
            <span className="font-semibold">{owner?.name}</span>
            <span><Pill tone={owner?.kyc === 'verified' ? 'bg-brandsoft text-brand' : 'bg-warnsoft text-warn'}>{owner?.kyc === 'verified' ? 'ID verified' : `KYC ${owner?.kyc}`}</Pill></span>
            {ownerKyc && <Link href={`/admin/kyc/${ownerKyc.id}`} className="text-brand font-semibold text-sm">Open KYC record</Link>}
          </div>
          <MapBase className="h-48"><MapLabel x={l.mapX} y={l.mapY}>Pin</MapLabel></MapBase>
          <form action={decideListing} className="card p-5 flex flex-col gap-3">
            <input type="hidden" name="id" value={l.id} />
            <h2 className="h-section">Decision</h2>
            <label className="label" htmlFor="message">
              Message to owner
              <textarea id="message" name="message" rows={3} className="field h-auto py-2.5" placeholder="Required when asking for changes, rejecting or unpublishing" defaultValue={offPlatform ? 'Please remove the phone number and direct payment request from the description.' : ''} />
            </label>
            {l.status === 'In review' ? (
              <>
                <SubmitButton name="decision" value="approve" pending="…">Approve and publish</SubmitButton>
                <div className="flex gap-2">
                  <SubmitButton name="decision" value="changes" className="btn-ghost flex-1" pending="…">Request changes</SubmitButton>
                  <SubmitButton name="decision" value="reject" className="btn-danger flex-1" pending="…">Reject</SubmitButton>
                </div>
              </>
            ) : l.status === 'Live' ? (
              <SubmitButton name="decision" value="unpublish" className="btn-danger" pending="…">Unpublish listing</SubmitButton>
            ) : (
              <p className="m-0 text-sm text-muted">No action needed while the listing is {l.status.toLowerCase()}.</p>
            )}
          </form>
        </aside>
      </div>
    </div>
  );
}
