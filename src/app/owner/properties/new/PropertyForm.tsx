'use client';

import { useState } from 'react';
import { createListing } from '@/lib/actions';
import { SubmitButton } from '@/components/SubmitButton';
import { MapBase } from '@/components/ui';

const FACILITIES = ['Gas line', 'Lift', 'Generator', 'Parking', 'Security', 'Wi-Fi'];

export function PropertyForm({ kycVerified }: { kycVerified: boolean }) {
  const [pin, setPin] = useState({ x: 50, y: 40 });
  const [previews, setPreviews] = useState<string[]>([]);

  return (
    <form action={createListing} className="flex flex-wrap gap-6 items-start">
      <div className="flex-[999_1_560px] min-w-0 flex flex-col gap-5">
        <section className="card p-5 flex flex-col gap-4">
          <h2 className="h-section">1. Basics</h2>
          <label className="label" htmlFor="title">
            Listing title
            <input id="title" name="title" required placeholder="3 bed flat in Senpara" className="field" />
          </label>
          <div className="grid gap-3 grid-cols-[repeat(auto-fit,minmax(180px,1fr))]">
            <label className="label" htmlFor="city">City<select id="city" name="city" className="field"><option>Dhaka</option><option>Chattogram</option></select></label>
            <label className="label" htmlFor="area">Area<input id="area" name="area" required placeholder="Mirpur 10" className="field" /></label>
            <label className="label" htmlFor="tenantType">Tenant type<select id="tenantType" name="tenantType" className="field"><option>Family</option><option>Bachelor</option></select></label>
          </div>
          <label className="label" htmlFor="description">
            Description
            <textarea id="description" name="description" rows={3} className="field h-auto py-2.5" placeholder="Light, layout, what is nearby. Do not add phone numbers; renters contact you through Basha Khoj." />
          </label>
        </section>

        <section className="card p-5 flex flex-col gap-3">
          <h2 className="h-section">2. Map location</h2>
          <button
            type="button"
            aria-label="Tap the map to place the pin"
            onClick={(e) => {
              const r = e.currentTarget.getBoundingClientRect();
              setPin({ x: Math.round(((e.clientX - r.left) / r.width) * 100), y: Math.round(((e.clientY - r.top) / r.height) * 100) });
            }}
            className="block w-full p-0 cursor-crosshair text-left"
          >
            <MapBase>
              <svg className="absolute pointer-events-none" style={{ left: `calc(${pin.x}% - 16px)`, top: `calc(${pin.y}% - 40px)` }} width="32" height="42" viewBox="0 0 24 32" aria-hidden="true">
                <path d="M12 31s10-11 10-19A10 10 0 0 0 2 12c0 8 10 19 10 19z" fill="rgb(var(--brand))" />
                <circle cx="12" cy="12" r="4" fill="rgb(var(--surface))" />
              </svg>
              <span className="absolute left-3 top-3 text-[13px] font-semibold bg-surface text-ink px-2.5 py-1.5 rounded-lg">Tap the building entrance</span>
            </MapBase>
          </button>
          <input type="hidden" name="mapX" value={pin.x} />
          <input type="hidden" name="mapY" value={pin.y} />
          <span className="text-[13px] text-muted">Renters see the area and pin. The house number is shared only after a confirmed booking.</span>
        </section>

        <section className="card p-5 flex flex-col gap-4">
          <h2 className="h-section">3. Details and facilities</h2>
          <div className="grid gap-3 grid-cols-[repeat(auto-fit,minmax(120px,1fr))]">
            <label className="label" htmlFor="bedrooms">Bedrooms<input id="bedrooms" name="bedrooms" type="number" min={1} defaultValue={3} className="field" /></label>
            <label className="label" htmlFor="bathrooms">Bathrooms<input id="bathrooms" name="bathrooms" type="number" min={1} defaultValue={2} className="field" /></label>
            <label className="label" htmlFor="sizeSqft">Size (sqft)<input id="sizeSqft" name="sizeSqft" type="number" min={100} defaultValue={1000} className="field" /></label>
            <label className="label" htmlFor="floor">Floor<input id="floor" name="floor" defaultValue="4th of 8" className="field" /></label>
          </div>
          <fieldset className="border-0 p-0 m-0">
            <legend className="text-[13px] font-semibold text-muted mb-2">Facilities</legend>
            <div className="grid gap-2 grid-cols-[repeat(auto-fill,minmax(150px,1fr))]">
              {FACILITIES.map((f, i) => (
                <label key={f} htmlFor={`fac${i}`} className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-line has-[:checked]:border-brand has-[:checked]:bg-brandsoft">
                  <input id={`fac${i}`} type="checkbox" name="facilities" value={f} defaultChecked={i < 2} className="accent-[rgb(var(--brand))]" />
                  {f}
                </label>
              ))}
            </div>
          </fieldset>
        </section>

        <section className="card p-5 flex flex-col gap-3">
          <div className="flex flex-wrap justify-between items-baseline gap-2">
            <h2 className="h-section">4. Photos</h2>
            <span className="text-[13px] text-muted">{previews.length} of 20 · 5 or more recommended · first is the cover</span>
          </div>
          <div className="grid gap-2.5 grid-cols-[repeat(auto-fill,minmax(110px,1fr))]">
            {previews.map((src, i) => (
              <div key={src} className="relative h-24 rounded-xl overflow-hidden bg-bg">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt={`Photo ${i + 1}`} className="w-full h-full object-cover" />
                {i === 0 && <span className="absolute left-1.5 top-1.5 text-[11px] font-bold bg-ink text-bg px-1.5 rounded">COVER</span>}
              </div>
            ))}
            <label htmlFor="photos" className="h-24 rounded-xl border-2 border-dashed border-line flex items-center justify-center text-[13px] font-semibold text-brand cursor-pointer hover:border-brand">
              + Add photos
              <input
                id="photos"
                name="photos"
                type="file"
                accept="image/*"
                multiple
                required
                className="sr-only"
                onChange={(e) => setPreviews([...(e.target.files ?? [])].slice(0, 20).map((f) => URL.createObjectURL(f)))}
              />
            </label>
          </div>
        </section>

        <section className="card p-5 flex flex-col gap-4">
          <h2 className="h-section">5. Rent and availability</h2>
          <div className="grid gap-3 grid-cols-[repeat(auto-fit,minmax(150px,1fr))]">
            <label className="label" htmlFor="rent">Monthly rent (৳)<input id="rent" name="rent" type="number" min={1000} required defaultValue={15000} className="field" /></label>
            <label className="label" htmlFor="advance">Advance (৳)<input id="advance" name="advance" type="number" min={0} defaultValue={15000} className="field" /></label>
            <label className="label" htmlFor="serviceCharge">Service charge (৳)<input id="serviceCharge" name="serviceCharge" type="number" min={0} defaultValue={1000} className="field" /></label>
            <label className="label" htmlFor="availableFrom">Available from<input id="availableFrom" name="availableFrom" type="date" required defaultValue="2026-12-01" className="field" /></label>
            <label className="label" htmlFor="minStayMonths">Minimum stay<select id="minStayMonths" name="minStayMonths" className="field"><option value="3">3 months</option><option value="6">6 months</option><option value="12">12 months</option></select></label>
          </div>
        </section>
      </div>

      <aside className="flex-[1_1_280px] min-w-0 flex flex-col gap-4 lg:sticky lg:top-24">
        <div className="card p-5 flex flex-col gap-3">
          <span className="font-semibold">Before it goes live</span>
          <ul className="m-0 pl-5 text-sm leading-7">
            <li>Admin checks photos and details</li>
            <li className={kycVerified ? '' : 'text-warn'}>{kycVerified ? 'Your ID is verified' : 'Your ID must be verified'}</li>
            <li>Usually live within 4 hours</li>
          </ul>
          <SubmitButton pending="Submitting…">Submit for review</SubmitButton>
        </div>
      </aside>
    </form>
  );
}
