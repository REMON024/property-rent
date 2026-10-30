export type TenantType = 'Family' | 'Bachelor';
export type ListingStatus = 'Draft' | 'In review' | 'Live' | 'Paused' | 'Rented';
export type BookingStatus = 'requested' | 'accepted' | 'confirmed' | 'rented' | 'completed' | 'rejected' | 'expired' | 'cancelled';
export type KycStatus = 'none' | 'pending' | 'verified' | 'rejected';

export interface Listing {
  id: number;
  ownerId: string;
  title: string;
  area: string;
  city: string;
  country: string;
  currency: string;
  rent: number;
  advance: number;
  serviceCharge: number;
  bedrooms: number;
  bathrooms: number;
  sizeSqft: number | null;
  floor: string;
  tenantType: TenantType;
  facilities: string[];
  availableFrom: string; // ISO date
  minStayMonths: number;
  status: ListingStatus;
  mapX: number; // demo map position in %, replaced by lat/lng with a real map
  mapY: number;
  views: number;
  description: string;
  photos: string[];
  log: { who: string; what: string; at: string }[];
}

export interface Booking {
  id: string;
  listingId: number;
  renterId: string;
  renterLabel: string;
  startDate: string;
  months: number;
  status: BookingStatus;
  createdAt: string;
  paymentMethod?: string;
}

export interface KycRecord {
  id: number;
  userId: string;
  name: string;
  country: string;
  documentType: string;
  documentNumberMasked: string;
  dateOfBirth: string;
  expiry: string | null; // ISO date, null = no expiry
  phoneMasked: string;
  nameMatches: boolean;
  faceMatch: 'High' | 'Medium' | 'Low' | 'Not needed';
  files: { front?: string; back?: string; selfie?: string };
  status: Exclude<KycStatus, 'none'>;
  reason?: string;
  submittedAt: string;
}

export interface User {
  id: string;
  name: string;
  kyc: KycStatus;
}
