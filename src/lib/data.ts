import type { Booking, KycRecord, Listing, User } from './types';

/**
 * Dummy data store.
 * Lives in server memory (kept on globalThis so dev hot-reload doesn't wipe it).
 * Swap these functions for Prisma queries later; prisma/schema.prisma has the tables.
 */
interface Store {
  users: User[];
  listings: Listing[];
  bookings: Booking[];
  kyc: KycRecord[];
  nextListingId: number;
  nextBooking: number;
}

/** The signed-in demo user: renter, owner and admin in one, so every screen is reachable. */
export const ME = 'u-me';

const L = (p: Partial<Listing> & Pick<Listing, 'id' | 'title' | 'area' | 'rent'>): Listing => ({
  ownerId: 'u-owner1',
  city: 'Dhaka',
  country: 'Bangladesh',
  currency: 'BDT',
  advance: p.rent,
  serviceCharge: 1000,
  bedrooms: 3,
  bathrooms: 2,
  sizeSqft: 1000,
  floor: '3rd of 6',
  tenantType: 'Family',
  facilities: ['Gas line'],
  availableFrom: '2026-12-01',
  minStayMonths: 6,
  status: 'Live',
  mapX: 50,
  mapY: 50,
  views: 120,
  description: '',
  photos: [],
  log: [{ who: 'Owner', what: 'Submitted for review', at: '2026-10-20' }, { who: 'Admin', what: 'Approved and published', at: '2026-10-20' }],
  ...p,
});

function seed(): Store {
  return {
    users: [
      { id: ME, name: 'You (demo)', kyc: 'none' },
      { id: 'u-owner1', name: 'Rahim Hossain', kyc: 'verified' },
    ],
    listings: [
      L({ id: 1, ownerId: ME, title: '3 bed flat in Senpara', area: 'Mirpur 10', rent: 18000, serviceCharge: 1500, sizeSqft: 1050, floor: '5th of 9', facilities: ['Gas line', 'Lift', 'Generator', 'Security'], mapX: 24, mapY: 20, views: 214, description: 'Bright south-facing flat with drawing and dining space, two balconies and a Titas gas line. Lift, full generator backup and a guard at the gate. 6 min walk to Mirpur 10 metro.' }),
      L({ id: 2, title: 'Family flat on Road 7', area: 'Mirpur 10', rent: 22500, serviceCharge: 2000, bathrooms: 3, sizeSqft: 1250, floor: '3rd of 7', facilities: ['Gas line', 'Lift', 'Parking'], minStayMonths: 12, mapX: 58, mapY: 24, views: 188, description: 'Spacious corner flat with a servant room and one car parking. Quiet road close to Mirpur 10 market.' }),
      L({ id: 3, ownerId: ME, title: '2 bed flat in Kazipara', area: 'Mirpur 10', rent: 13500, bedrooms: 2, sizeSqft: 850, floor: '4th of 6', availableFrom: '2026-12-15', mapX: 32, mapY: 56, views: 168, description: 'Compact flat for a small family, 4 min walk to the metro. No lift.' }),
      L({ id: 4, title: 'Bachelor room near stadium', area: 'Mirpur 2', rent: 7500, serviceCharge: 0, bedrooms: 1, bathrooms: 1, sizeSqft: null, floor: '3rd', tenantType: 'Bachelor', facilities: ['Gas line', 'Wi-Fi'], availableFrom: '2026-11-15', minStayMonths: 3, mapX: 14, mapY: 78, views: 96, description: 'Single room with attached bath for a job holder or student. Shared kitchen with cylinder gas, Wi-Fi included.' }),
      L({ id: 5, title: 'Uttara Sector 11 family flat', area: 'Uttara', rent: 22000, serviceCharge: 1800, sizeSqft: 1250, floor: '3rd of 8', facilities: ['Gas line', 'Lift', 'Parking'], minStayMonths: 12, mapX: 72, mapY: 14, views: 240, description: 'Road 12, Sector 11. Lift, gas line and parking. Close to schools and the Uttara metro.' }),
      L({ id: 6, title: 'Dhanmondi 27 apartment', area: 'Dhanmondi', rent: 42000, advance: 84000, serviceCharge: 4000, bathrooms: 3, sizeSqft: 1600, floor: '7th of 10', facilities: ['Gas line', 'Lift', 'Generator', 'Parking', 'Security'], availableFrom: '2026-11-20', minStayMonths: 12, mapX: 44, mapY: 82, views: 310, description: 'Premium apartment near Rapa Plaza with 24/7 security, generator and car parking.' }),
      L({ id: 7, title: 'Banasree C block flat', area: 'Banasree', rent: 16000, serviceCharge: 1200, floor: '2nd of 6', facilities: ['Gas line', 'Generator'], mapX: 84, mapY: 60, views: 132, description: 'Road 3, C block. Calm residential area with many schools nearby.' }),
      L({ id: 8, ownerId: ME, title: 'Shewrapara studio', area: 'Mirpur 10', rent: 11000, serviceCharge: 800, bedrooms: 1, bathrooms: 1, sizeSqft: 520, floor: '6th of 9', tenantType: 'Bachelor', facilities: ['Lift', 'Wi-Fi'], status: 'In review', mapX: 66, mapY: 70, views: 0, description: 'Small studio with lift access, suits a single professional. Call 01711000001 or pay advance by bKash to me directly.', log: [{ who: 'Owner', what: 'Submitted for review', at: '2026-10-30' }] }),
      L({ id: 9, title: 'Badda link road flat', area: 'Badda', rent: 17500, floor: '6th of 8', facilities: ['Gas line', 'Lift'], mapX: 78, mapY: 36, views: 150, description: 'Close to the Gulshan link road with quick access to offices in Gulshan and Banani.' }),
    ],
    bookings: [
      { id: 'BK-00418', listingId: 2, renterId: ME, renterLabel: 'You', startDate: '2026-12-01', months: 12, status: 'accepted', createdAt: '2026-10-29' },
      { id: 'BK-00431', listingId: 1, renterId: 'u-r1', renterLabel: 'Family of 4 · ID verified', startDate: '2026-12-15', months: 6, status: 'requested', createdAt: '2026-10-30' },
      { id: 'BK-00437', listingId: 3, renterId: 'u-r2', renterLabel: 'Couple · ID verified', startDate: '2026-12-15', months: 12, status: 'requested', createdAt: '2026-10-30' },
      { id: 'BK-00402', listingId: 1, renterId: 'u-r3', renterLabel: 'Student · ID pending', startDate: '2027-01-01', months: 6, status: 'rejected', createdAt: '2026-10-21' },
    ],
    kyc: [
      { id: 1, userId: 'u-k1', name: 'Nasima Akter', country: 'Bangladesh', documentType: 'National ID', documentNumberMasked: '•••• 4821', dateOfBirth: '1984-03-12', expiry: null, phoneMasked: '+880 17•• •••112', nameMatches: true, faceMatch: 'High', files: {}, status: 'pending', submittedAt: '2026-10-30T19:50' },
      { id: 2, userId: 'u-k2', name: 'Al Noor Properties LLC', country: 'United Arab Emirates', documentType: 'Trade licence', documentNumberMasked: '••••7730', dateOfBirth: '', expiry: '2027-02-14', phoneMasked: '+971 5• ••• •412', nameMatches: true, faceMatch: 'Not needed', files: {}, status: 'pending', submittedAt: '2026-10-30T21:40' },
      { id: 3, userId: 'u-k3', name: 'Kamal Uddin', country: 'Bangladesh', documentType: 'Passport', documentNumberMasked: '••••• 391', dateOfBirth: '1990-08-02', expiry: '2026-09-30', phoneMasked: '+880 18•• •••233', nameMatches: false, faceMatch: 'Medium', files: {}, status: 'pending', submittedAt: '2026-10-30T22:35' },
    ],
    nextListingId: 10,
    nextBooking: 440,
  };
}

const g = globalThis as unknown as { __bkStore?: Store };
export const db: Store = g.__bkStore ?? (g.__bkStore = seed());

/* ---------- read helpers ---------- */
export const getListing = (id: number) => db.listings.find((l) => l.id === id);
export const getUser = (id: string) => db.users.find((u) => u.id === id);
export const me = () => getUser(ME)!;
export const myKyc = () => db.kyc.find((k) => k.userId === ME);

export interface SearchFilters {
  q?: string;
  max?: number;
  beds?: number;
  tenant?: string;
  facilities?: string[];
  sort?: 'new' | 'low' | 'high';
}

export function searchListings(f: SearchFilters) {
  const q = (f.q ?? '').trim().toLowerCase();
  let r = db.listings.filter(
    (l) =>
      l.status === 'Live' &&
      (!q || `${l.title} ${l.area} ${l.city}`.toLowerCase().includes(q)) &&
      (!f.max || l.rent <= f.max) &&
      (!f.beds || l.bedrooms >= f.beds) &&
      (!f.tenant || l.tenantType === f.tenant) &&
      (f.facilities ?? []).every((x) => l.facilities.includes(x)),
  );
  if (f.sort === 'low') r = [...r].sort((a, b) => a.rent - b.rent);
  if (f.sort === 'high') r = [...r].sort((a, b) => b.rent - a.rent);
  return r;
}

export const FACILITIES = ['Gas line', 'Lift', 'Generator', 'Parking', 'Security', 'Wi-Fi'];

/** Typical monthly rent by tenant type, used by admin's "rent within area range" check. */
export const AREA_RANGE: Record<string, [number, number]> = { Family: [12000, 28000], Bachelor: [5000, 12000] };

export { TINTS } from './tints';
