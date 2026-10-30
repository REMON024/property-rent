'use client';

import { useState } from 'react';
import { submitKyc } from '@/lib/actions';
import { SubmitButton } from '@/components/SubmitButton';

function Upload({ name, label, hint, capture, required }: { name: string; label: string; hint: string; capture?: 'user'; required?: boolean }) {
  const [src, setSrc] = useState<string>();
  return (
    <label htmlFor={`kyc-${name}`} className="flex flex-col gap-2 cursor-pointer">
      <span className="text-[13px] font-semibold text-muted">{label}</span>
      <span className="h-36 rounded-xl border-2 border-dashed border-line hover:border-brand flex flex-col items-center justify-center gap-1 text-center px-3 overflow-hidden">
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt={`${label} preview`} className="w-full h-full object-cover" />
        ) : (
          <>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="rgb(var(--brand))" strokeWidth="1.8" aria-hidden="true">
              <rect x="3" y="6" width="18" height="13" rx="2" />
              <circle cx="12" cy="12.5" r="3.2" />
              <path d="M8 6l1.5-2h5L16 6" />
            </svg>
            <span className="text-sm font-semibold text-brand">Upload or take photo</span>
            <span className="text-xs text-muted">{hint}</span>
          </>
        )}
      </span>
      <input
        id={`kyc-${name}`}
        name={name}
        type="file"
        accept="image/*"
        capture={capture}
        required={required}
        className="sr-only"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) setSrc(URL.createObjectURL(f));
        }}
      />
    </label>
  );
}

export function KycForm() {
  return (
    <form action={submitKyc} className="flex flex-col gap-5">
      <section className="card p-5 flex flex-col gap-4">
        <h2 className="h-section">1. Your document</h2>
        <div className="grid gap-3 grid-cols-[repeat(auto-fit,minmax(200px,1fr))]">
          <label className="label" htmlFor="country">Issuing country<select id="country" name="country" className="field"><option>Bangladesh</option><option>United Arab Emirates</option><option>Malaysia</option></select></label>
          <label className="label" htmlFor="documentType">Document type<select id="documentType" name="documentType" className="field"><option>National ID</option><option>Passport</option><option>Driving licence</option></select></label>
          <label className="label" htmlFor="name">Full name as on document<input id="name" name="name" required autoComplete="name" className="field" placeholder="As printed on your ID" /></label>
          <label className="label" htmlFor="documentNumber">Document number<input id="documentNumber" name="documentNumber" required inputMode="numeric" className="field" placeholder="10, 13 or 17 digits for NID" /></label>
          <label className="label" htmlFor="dateOfBirth">Date of birth<input id="dateOfBirth" name="dateOfBirth" type="date" required className="field" /></label>
        </div>
        <div className="grid gap-3 grid-cols-[repeat(auto-fit,minmax(200px,1fr))]">
          <Upload name="front" label="Front of document" hint="Flat, all four corners visible" required />
          <Upload name="back" label="Back of document" hint="Not needed for a passport" />
        </div>
      </section>
      <section className="card p-5 flex flex-col gap-4">
        <h2 className="h-section">2. Selfie</h2>
        <div className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(200px,1fr))] items-start">
          <Upload name="selfie" label="Selfie holding your document" hint="Face and document both clear" capture="user" required />
          <ul className="m-0 pl-5 text-sm text-muted leading-7">
            <li>Good light, no hat or sunglasses</li>
            <li>Hold the document next to your face</li>
            <li>We compare the selfie with the ID photo</li>
          </ul>
        </div>
      </section>
      <section className="card p-5 flex flex-col gap-4">
        <h2 className="h-section">3. Review and submit</h2>
        <label htmlFor="consent" className="flex gap-3 items-start text-sm">
          <input id="consent" name="consent" type="checkbox" required className="mt-1 accent-[rgb(var(--brand))]" />
          I confirm these documents are mine and agree to Basha Khoj checking them with the issuing authority.
        </label>
        <SubmitButton className="btn-primary self-start" pending="Uploading…">Submit for verification</SubmitButton>
      </section>
    </form>
  );
}
