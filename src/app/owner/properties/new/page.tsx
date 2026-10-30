import type { Metadata } from 'next';
import { me } from '@/lib/data';
import { PageHead } from '@/components/ui';
import { PropertyForm } from './PropertyForm';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'New property' };

export default function NewProperty() {
  return (
    <div className="gutter max-w-6xl mx-auto py-6 flex flex-col gap-5">
      <PageHead back={{ href: '/owner', label: 'Back to my properties' }} title="New property" />
      <PropertyForm kycVerified={me().kyc === 'verified'} />
    </div>
  );
}
