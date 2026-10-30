import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="gutter max-w-xl mx-auto py-16 flex flex-col gap-4">
      <h1 className="font-display font-extrabold text-2xl m-0">We couldn&apos;t find that page</h1>
      <p className="m-0 text-muted">The home may have been rented or removed.</p>
      <Link href="/search" className="btn-primary self-start">Search homes</Link>
    </div>
  );
}
