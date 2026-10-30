import Link from 'next/link';
import type { Metadata } from 'next';
import { me, myKyc } from '@/lib/data';
import { fmtDate } from '@/lib/format';
import { PageHead, Pill } from '@/components/ui';
import { KycForm } from './KycForm';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Verify your identity' };

export default function KycPage() {
  const status = me().kyc;
  const rec = myKyc();
  const at = status === 'none' || status === 'rejected' ? 0 : 2;

  return (
    <div className="gutter max-w-3xl mx-auto py-6 flex flex-col gap-5">
      <PageHead back={{ href: '/owner', label: 'Back to dashboard' }} title="Verify your identity" />
      <p className="text-muted m-0 -mt-2 max-w-[60ch]">
        Owners verify once before their first listing goes live. Documents are encrypted and seen only by our verification team.
      </p>
      <ol aria-label="Steps" className="list-none p-0 m-0 grid grid-cols-3 gap-2">
        {['Document', 'Selfie', 'Review'].map((s, i) => (
          <li key={s} className="flex flex-col gap-1.5">
            <span className={`h-1.5 rounded-full ${i <= at ? 'bg-brand' : 'bg-line'}`} />
            <span className={`text-xs ${i <= at ? 'text-ink font-semibold' : 'text-muted'}`}>{i + 1}. {s}</span>
          </li>
        ))}
      </ol>

      {(status === 'pending' || status === 'verified') && rec ? (
        <div className="card p-5 flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <Pill tone={status === 'verified' ? 'bg-brandsoft text-brand' : 'bg-infosoft text-info'}>{status === 'verified' ? 'Verified' : 'In review'}</Pill>
            <span className="text-sm text-muted">Submitted {fmtDate(rec.submittedAt)}</span>
          </div>
          <div className="font-display font-bold text-xl">{status === 'verified' ? 'You are verified. Your listings can go live.' : 'We are checking your documents.'}</div>
          <dl className="grid gap-x-6 gap-y-3 grid-cols-[repeat(auto-fit,minmax(180px,1fr))] m-0 text-sm">
            {[['Country', rec.country], ['Document', rec.documentType], ['Name on document', rec.name], ['Document number', rec.documentNumberMasked]].map(([k, v]) => (
              <div key={k}><dt className="text-muted">{k}</dt><dd className="m-0 font-semibold">{v}</dd></div>
            ))}
          </dl>
          {status === 'verified' ? (
            <Link href="/owner/properties/new" className="btn-primary self-start">Add a property</Link>
          ) : (
            <div className="text-sm text-muted border-t border-line pt-3">
              Demo: open <Link href={`/admin/kyc/${rec.id}`} className="text-brand font-semibold">the admin review</Link> to approve or reject it.
            </div>
          )}
        </div>
      ) : (
        <>
          {status === 'rejected' && (
            <div className="rounded-2xl border border-warn/40 bg-warnsoft p-4">
              <div className="font-semibold text-warn">Not approved</div>
              <div className="text-sm">{rec?.reason}. Please upload new photos.</div>
            </div>
          )}
          <KycForm />
        </>
      )}
    </div>
  );
}
