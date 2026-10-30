'use client';

import Link from 'next/link';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="gutter max-w-xl mx-auto py-16 flex flex-col gap-4">
      <h1 className="font-display font-extrabold text-2xl m-0">That didn&apos;t work</h1>
      <p className="m-0 text-muted">{error.message || 'Something went wrong.'}</p>
      <div className="flex gap-2">
        <button onClick={reset} className="btn-primary">Try again</button>
        <Link href="/" className="btn-ghost">Go home</Link>
      </div>
    </div>
  );
}
