import type { BookingStatus } from './types';

/**
 * Allowed booking transitions (SRS section 3). Anything else is refused.
 * requested → accepted → confirmed → rented → completed
 * requested → rejected | expired | cancelled
 * accepted  → expired | cancelled
 * confirmed → cancelled (refund per policy)
 */
const TRANSITIONS: Record<BookingStatus, BookingStatus[]> = {
  requested: ['accepted', 'rejected', 'expired', 'cancelled'],
  accepted: ['confirmed', 'expired', 'cancelled'],
  confirmed: ['rented', 'cancelled'],
  rented: ['completed'],
  completed: [],
  rejected: [],
  expired: [],
  cancelled: [],
};

export function canTransition(from: BookingStatus, to: BookingStatus) {
  return TRANSITIONS[from].includes(to);
}

/** Statuses that hold the listing's dates against other bookings. */
export const HOLDS_DATES: BookingStatus[] = ['requested', 'accepted', 'confirmed', 'rented'];

export const STATUS_LABEL: Record<BookingStatus, string> = {
  requested: 'Waiting for owner',
  accepted: 'Accepted · pay advance',
  confirmed: 'Confirmed',
  rented: 'Rented',
  completed: 'Completed',
  rejected: 'Rejected',
  expired: 'Expired',
  cancelled: 'Cancelled',
};

export const STATUS_TONE: Record<BookingStatus, string> = {
  requested: 'bg-infosoft text-info',
  accepted: 'bg-sign/30 text-signink',
  confirmed: 'bg-brandsoft text-brand',
  rented: 'bg-ink text-bg',
  completed: 'bg-bg text-muted border border-line',
  rejected: 'bg-warnsoft text-warn',
  expired: 'bg-warnsoft text-warn',
  cancelled: 'bg-warnsoft text-warn',
};
