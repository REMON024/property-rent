import type { Metadata } from 'next';
import { db } from '@/lib/data';
import { PageHead } from '@/components/ui';
import { Assistant } from './Assistant';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Describe your home' };

/** Concept C: describe the home in any language; filters are extracted and results ranked by fit. */
export default function AssistantPage() {
  return (
    <div className="gutter max-w-6xl mx-auto py-6 flex flex-col gap-5">
      <PageHead eyebrow="Search assistant" title="Describe the home you want, in any language" />
      <Assistant listings={db.listings.filter((l) => l.status === 'Live')} />
    </div>
  );
}
