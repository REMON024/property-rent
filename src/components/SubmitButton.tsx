'use client';

import { useFormStatus } from 'react-dom';

/** Submit button that disables itself while its form's server action runs. */
export function SubmitButton({
  children,
  pending = 'Saving…',
  className = 'btn-primary',
  name,
  value,
}: {
  children: React.ReactNode;
  pending?: string;
  className?: string;
  name?: string;
  value?: string;
}) {
  const { pending: busy } = useFormStatus();
  return (
    <button type="submit" name={name} value={value} disabled={busy} className={className} aria-busy={busy}>
      {busy ? pending : children}
    </button>
  );
}
