'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { db, getListing, ME } from './data';
import { canTransition, HOLDS_DATES } from './booking';
import { rangesOverlap } from './format';
import type { BookingStatus, ListingStatus, TenantType } from './types';

const today = () => new Date().toISOString().slice(0, 10);

/** Demo storage: files become data URLs. Replace with S3 upload + URL in production. */
async function toDataUrl(f: FormDataEntryValue | null) {
  if (!f || typeof f === 'string' || f.size === 0) return undefined;
  const buf = Buffer.from(await f.arrayBuffer());
  return `data:${f.type || 'image/jpeg'};base64,${buf.toString('base64')}`;
}

function refreshAll() {
  ['/', '/search', '/bookings', '/owner', '/admin'].forEach((p) => revalidatePath(p));
  revalidatePath('/listings/[id]', 'page');
  revalidatePath('/owner/properties/[id]', 'page');
  revalidatePath('/admin/listings/[id]', 'page');
}

function move(id: string, to: BookingStatus) {
  const b = db.bookings.find((x) => x.id === id);
  if (!b) throw new Error('Booking not found');
  if (!canTransition(b.status, to)) throw new Error(`Cannot move a ${b.status} booking to ${to}`);
  b.status = to;
  return b;
}

/* ---------- renter ---------- */
export async function requestBooking(formData: FormData) {
  const listingId = Number(formData.get('listingId'));
  const startDate = String(formData.get('startDate'));
  const months = Number(formData.get('months'));
  const l = getListing(listingId);
  if (!l || l.status !== 'Live') throw new Error('This home is not available');
  if (startDate < l.availableFrom) throw new Error('Move-in is before the home is available');
  if (months < l.minStayMonths) throw new Error(`Minimum stay is ${l.minStayMonths} months`);
  const clash = db.bookings.some(
    (b) => b.listingId === listingId && HOLDS_DATES.includes(b.status) && b.status !== 'requested' && rangesOverlap(startDate, months, b.startDate, b.months),
  );
  if (clash) throw new Error('Those dates are already booked');
  db.bookings.unshift({
    id: `BK-00${db.nextBooking++}`,
    listingId,
    renterId: ME,
    renterLabel: 'You',
    startDate,
    months,
    status: 'requested',
    createdAt: today(),
  });
  refreshAll();
  redirect('/bookings?sent=1');
}

export async function cancelBooking(id: string) {
  move(id, 'cancelled');
  refreshAll();
}

export async function payAdvance(formData: FormData) {
  const b = move(String(formData.get('bookingId')), 'confirmed');
  b.paymentMethod = String(formData.get('method') || 'bKash');
  refreshAll();
}

/* ---------- owner ---------- */
export async function acceptBooking(id: string) {
  const b = db.bookings.find((x) => x.id === id);
  if (!b) return;
  move(id, 'accepted');
  // other open requests for overlapping dates on the same home are auto-rejected
  db.bookings
    .filter((o) => o.id !== id && o.listingId === b.listingId && o.status === 'requested' && rangesOverlap(o.startDate, o.months, b.startDate, b.months))
    .forEach((o) => (o.status = 'rejected'));
  refreshAll();
}

export async function rejectBooking(id: string) {
  move(id, 'rejected');
  refreshAll();
}

export async function setListingStatus(id: number, status: ListingStatus) {
  const l = getListing(id);
  if (!l) return;
  const allowed: Record<ListingStatus, ListingStatus[]> = {
    Live: ['Paused', 'Rented'],
    Paused: ['Live'],
    Rented: ['Live'],
    Draft: ['In review'],
    'In review': [],
  };
  if (!allowed[l.status].includes(status)) throw new Error(`Cannot move a ${l.status} listing to ${status}`);
  l.status = status;
  l.log.push({ who: 'Owner', what: `Set to ${status}`, at: today() });
  refreshAll();
}

export async function createListing(formData: FormData) {
  const photos = (await Promise.all(formData.getAll('photos').map(toDataUrl))).filter(Boolean) as string[];
  const rent = Number(formData.get('rent'));
  const id = db.nextListingId++;
  db.listings.push({
    id,
    ownerId: ME,
    title: String(formData.get('title')),
    area: String(formData.get('area')),
    city: String(formData.get('city') || 'Dhaka'),
    country: 'Bangladesh',
    currency: 'BDT',
    rent,
    advance: Number(formData.get('advance')) || rent,
    serviceCharge: Number(formData.get('serviceCharge')) || 0,
    bedrooms: Number(formData.get('bedrooms')),
    bathrooms: Number(formData.get('bathrooms')),
    sizeSqft: Number(formData.get('sizeSqft')) || null,
    floor: String(formData.get('floor') || ''),
    tenantType: String(formData.get('tenantType')) as TenantType,
    facilities: formData.getAll('facilities').map(String),
    availableFrom: String(formData.get('availableFrom')),
    minStayMonths: Number(formData.get('minStayMonths')),
    status: 'In review',
    mapX: Number(formData.get('mapX') || 50),
    mapY: Number(formData.get('mapY') || 50),
    views: 0,
    description: String(formData.get('description') || ''),
    photos,
    log: [{ who: 'Owner', what: 'Submitted for review', at: today() }],
  });
  refreshAll();
  redirect(`/owner/properties/${id}?submitted=1`);
}

export async function submitKyc(formData: FormData) {
  const number = String(formData.get('documentNumber'));
  const record = {
    id: 99,
    userId: ME,
    name: String(formData.get('name')),
    country: String(formData.get('country')),
    documentType: String(formData.get('documentType')),
    documentNumberMasked: '•••• ' + number.slice(-4),
    dateOfBirth: String(formData.get('dateOfBirth')),
    expiry: null,
    phoneMasked: '+880 17•• •••001',
    nameMatches: true,
    faceMatch: 'High' as const,
    files: {
      front: await toDataUrl(formData.get('front')),
      back: await toDataUrl(formData.get('back')),
      selfie: await toDataUrl(formData.get('selfie')),
    },
    status: 'pending' as const,
    submittedAt: new Date().toISOString().slice(0, 16),
  };
  db.kyc = db.kyc.filter((k) => k.userId !== ME);
  db.kyc.unshift(record);
  db.users.find((u) => u.id === ME)!.kyc = 'pending';
  refreshAll();
  revalidatePath('/owner/kyc');
  redirect('/owner/kyc');
}

/* ---------- admin ---------- */
export async function decideKyc(formData: FormData) {
  const k = db.kyc.find((x) => x.id === Number(formData.get('id')));
  if (!k) return;
  const decision = String(formData.get('decision'));
  const reason = String(formData.get('reason') || '');
  if (decision === 'reject' && !reason) throw new Error('Choose a reason before rejecting');
  k.status = decision === 'approve' ? 'verified' : 'rejected';
  k.reason = decision === 'reject' ? reason : undefined;
  const u = db.users.find((x) => x.id === k.userId);
  if (u) u.kyc = k.status;
  refreshAll();
  revalidatePath('/owner/kyc');
  redirect('/admin');
}

export async function decideListing(formData: FormData) {
  const l = getListing(Number(formData.get('id')));
  if (!l) return;
  const decision = String(formData.get('decision'));
  const message = String(formData.get('message') || '').trim();
  if (decision !== 'approve' && !message) throw new Error('Add a message to the owner first');
  if (decision === 'approve') {
    l.status = 'Live';
    l.log.push({ who: 'Admin', what: 'Approved and published', at: today() });
  } else if (decision === 'changes') {
    l.status = 'Draft';
    l.log.push({ who: 'Admin', what: `Asked for changes: ${message}`, at: today() });
  } else if (decision === 'unpublish') {
    l.status = 'Paused';
    l.log.push({ who: 'Admin', what: `Unpublished: ${message}`, at: today() });
  } else if (decision === 'reject') {
    db.listings = db.listings.filter((x) => x.id !== l.id);
  }
  refreshAll();
  redirect('/admin');
}
