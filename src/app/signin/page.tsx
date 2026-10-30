'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function SignIn() {
  const router = useRouter();
  const [role, setRole] = useState<'rent' | 'list'>('rent');
  const [step, setStep] = useState<'phone' | 'code'>('phone');
  const [cc, setCc] = useState('+880');
  const [phone, setPhone] = useState('');

  return (
    <div className="flex flex-wrap min-h-[calc(100vh-64px)]">
      <section className="flex-[1_1_360px] bg-hero text-heroink gutter py-10 flex flex-col justify-between gap-8">
        <div className="flex flex-col gap-3 max-w-[40ch]">
          <h1 className="font-display font-extrabold text-3xl md:text-4xl leading-tight m-0">One account to rent or to list.</h1>
          <p className="m-0 opacity-80">Sign in with your phone number. Owners verify a government ID once before their first listing goes live.</p>
        </div>
        <span className="text-sm opacity-70">Available in English, বাংলা and العربية</span>
      </section>

      <div className="flex-[2_1_420px] flex items-center justify-center gutter py-10">
        <div className="w-full max-w-md card p-6 flex flex-col gap-5">
          <h2 className="font-display font-extrabold text-2xl m-0">{role === 'rent' ? 'Sign in to rent' : 'Sign in to list your property'}</h2>
          <div role="group" aria-label="I want to" className="grid grid-cols-2 gap-1.5 bg-bg p-1 rounded-xl">
            {(['rent', 'list'] as const).map((r) => (
              <button key={r} type="button" aria-pressed={role === r} onClick={() => setRole(r)} className={`h-10 rounded-lg text-sm font-semibold ${role === r ? 'bg-surface text-ink shadow-sm' : 'text-muted'}`}>
                {r === 'rent' ? 'Rent a home' : 'List a property'}
              </button>
            ))}
          </div>

          {step === 'phone' ? (
            <form
              className="flex flex-col gap-4"
              onSubmit={(e) => {
                e.preventDefault();
                setStep('code');
              }}
            >
              <label className="label" htmlFor="phone">
                Phone number
                <div className="flex gap-2">
                  <select aria-label="Country code" value={cc} onChange={(e) => setCc(e.target.value)} className="field w-28 flex-none">
                    <option value="+880">BD +880</option>
                    <option value="+971">AE +971</option>
                    <option value="+60">MY +60</option>
                    <option value="+44">GB +44</option>
                  </select>
                  <input id="phone" required inputMode="tel" autoComplete="tel-national" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="1711 000001" className="field" />
                </div>
              </label>
              <button className="btn-primary h-12">Send code</button>
              <div className="flex items-center gap-3 text-sm text-muted"><span className="flex-1 h-px bg-line" />or<span className="flex-1 h-px bg-line" /></div>
              <button type="button" className="btn-ghost">Continue with Google</button>
              <button type="button" className="btn-ghost">Continue with email</button>
            </form>
          ) : (
            <form
              className="flex flex-col gap-4"
              onSubmit={(e) => {
                e.preventDefault();
                router.push(role === 'rent' ? '/bookings' : '/owner');
              }}
            >
              <p className="m-0">Enter the 6-digit code sent to {cc} {phone}.</p>
              <label className="label" htmlFor="code">
                Code
                <input id="code" required inputMode="numeric" autoComplete="one-time-code" pattern="[0-9 ]{6,7}" placeholder="482 913" className="field h-14 text-2xl font-display font-bold tracking-[.3em]" />
              </label>
              <button className="btn-primary h-12">Verify and continue</button>
              <button type="button" onClick={() => setStep('phone')} className="text-brand font-semibold text-sm">Use a different number</button>
            </form>
          )}
          <p className="text-xs text-muted m-0">By continuing you agree to the <Link href="/" className="underline">Terms</Link> and <Link href="/" className="underline">Privacy Policy</Link>.</p>
        </div>
      </div>
    </div>
  );
}
