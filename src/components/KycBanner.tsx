import Link from 'next/link';
import { me, myKyc } from '@/lib/data';

export function KycBanner() {
  const status = me().kyc;
  if (status === 'verified')
    return (
      <div className="flex items-center gap-2 text-sm text-brand font-semibold">
        <span className="w-2.5 h-2.5 rounded-full bg-brand" />
        ID verified · your listings can go live
      </div>
    );
  const copy = {
    none: ['bg-sign/25 border-sign', 'Verify your ID to publish listings', 'Takes about 3 minutes: a photo of your ID and a selfie.', 'Start verification'],
    pending: ['bg-infosoft border-info/40', 'ID verification in review', 'Usually done within 4 hours. You can keep drafting listings.', 'View status'],
    rejected: ['bg-warnsoft border-warn/40', 'ID verification needs another try', myKyc()?.reason ?? 'See the reason and resubmit.', 'Fix and resubmit'],
  }[status];
  return (
    <div className={`rounded-2xl border ${copy[0]} p-4 flex flex-wrap gap-3 items-center justify-between`}>
      <div className="min-w-0">
        <div className="font-semibold">{copy[1]}</div>
        <div className="text-sm text-muted">{copy[2]}</div>
      </div>
      <Link href="/owner/kyc" className="btn-primary">{copy[3]}</Link>
    </div>
  );
}
