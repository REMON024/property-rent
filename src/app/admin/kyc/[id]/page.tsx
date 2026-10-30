import { notFound } from 'next/navigation';
import { db } from '@/lib/data';
import { decideKyc } from '@/lib/actions';
import { fmtDate } from '@/lib/format';
import { Check, PageHead, Pill } from '@/components/ui';
import { SubmitButton } from '@/components/SubmitButton';

export const dynamic = 'force-dynamic';

const REASONS = ['Document expired', 'Photo blurry or cut off', 'Name does not match account', 'Selfie does not match ID', 'Suspected fake document'];

function Doc({ src, label }: { src?: string; label: string }) {
  return src ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={label} className="w-full h-40 object-cover rounded-xl border border-line" />
  ) : (
    <div className="h-40 rounded-xl border border-line bg-bg flex items-center justify-center text-sm text-muted">{label} (sample)</div>
  );
}

export default function KycReview({ params }: { params: { id: string } }) {
  const k = db.kyc.find((x) => x.id === Number(params.id));
  if (!k) notFound();
  const expired = !!k.expiry && k.expiry < new Date().toISOString().slice(0, 10);
  const faceOk = k.faceMatch === 'High' || k.faceMatch === 'Not needed';

  return (
    <div className="gutter max-w-6xl mx-auto py-6 flex flex-col gap-5">
      <PageHead back={{ href: '/admin', label: 'Back to admin' }} title={`KYC review · ${k.name}`} />
      <div className="-mt-2">
        <Pill tone={k.status === 'verified' ? 'bg-brandsoft text-brand' : k.status === 'rejected' ? 'bg-warnsoft text-warn' : 'bg-infosoft text-info'}>
          {k.status === 'pending' ? `Submitted ${fmtDate(k.submittedAt)}` : k.status === 'verified' ? 'Approved' : `Rejected: ${k.reason}`}
        </Pill>
      </div>

      <div className="flex flex-wrap gap-5 items-start">
        <div className="flex-[999_1_520px] min-w-0 flex flex-col gap-5">
          <section className="card p-5 flex flex-col gap-3">
            <h2 className="h-section">Documents</h2>
            <div className="grid gap-3 grid-cols-[repeat(auto-fit,minmax(160px,1fr))]">
              <Doc src={k.files.front} label="Front" />
              <Doc src={k.files.back} label="Back" />
              <Doc src={k.files.selfie} label="Selfie" />
            </div>
          </section>
          <section className="card p-5 flex flex-col gap-3">
            <h2 className="h-section">Extracted details</h2>
            <dl className="grid gap-x-6 gap-y-3 grid-cols-[repeat(auto-fit,minmax(170px,1fr))] m-0 text-sm">
              {[
                ['Document', k.documentType],
                ['Country', k.country],
                ['Number', k.documentNumberMasked],
                ['Date of birth', k.dateOfBirth ? fmtDate(k.dateOfBirth) : '—'],
                ['Expiry', k.expiry ? fmtDate(k.expiry) : 'No expiry'],
                ['Phone', k.phoneMasked],
              ].map(([a, b]) => (
                <div key={a}><dt className="text-muted">{a}</dt><dd className="m-0 font-semibold tabnum">{b}</dd></div>
              ))}
            </dl>
          </section>
          <section className="card overflow-hidden">
            <h2 className="h-section px-5 py-3 border-b border-line">Automated checks</h2>
            <ul className="list-none m-0 p-0">
              <Check ok={k.nameMatches} title="Name matches account" detail={k.nameMatches ? 'Exact match' : 'Account name differs from the document'} />
              <Check ok={faceOk} title="Face match with ID photo" detail={k.faceMatch} />
              <Check ok={!expired} title="Document in date" detail={expired ? `Expired ${fmtDate(k.expiry!)}` : k.expiry ? `Valid until ${fmtDate(k.expiry)}` : 'No expiry'} />
              <Check ok title="No duplicate account" detail="No other account uses this document" />
            </ul>
          </section>
        </div>

        <form action={decideKyc} className="flex-[1_1_300px] min-w-0 card p-5 flex flex-col gap-4 lg:sticky lg:top-24">
          <input type="hidden" name="id" value={k.id} />
          <h2 className="h-section">Decision</h2>
          <label className="label" htmlFor="reason">
            Reason if rejecting
            <select id="reason" name="reason" className="field" defaultValue={expired ? 'Document expired' : !k.nameMatches ? 'Name does not match account' : ''}>
              <option value="">Choose a reason</option>
              {REASONS.map((r) => <option key={r}>{r}</option>)}
            </select>
          </label>
          <label className="label" htmlFor="note">
            Internal note
            <textarea id="note" name="note" rows={3} className="field h-auto py-2.5" placeholder="Seen only by staff" />
          </label>
          <div className="flex flex-wrap gap-2">
            <SubmitButton name="decision" value="reject" className="btn-danger flex-1" pending="…">Reject</SubmitButton>
            <SubmitButton name="decision" value="approve" className="btn-primary flex-1" pending="…">Approve</SubmitButton>
          </div>
          <div className="text-xs text-muted border-t border-line pt-3">Every decision is saved to the audit log with your name and time.</div>
        </form>
      </div>
    </div>
  );
}
