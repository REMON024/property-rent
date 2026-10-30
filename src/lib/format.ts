const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function money(n: number | null | undefined, currency = 'BDT') {
  if (n == null) return '—';
  const sym: Record<string, string> = { BDT: '৳', AED: 'AED ', MYR: 'RM ', USD: '$' };
  return (sym[currency] ?? currency + ' ') + Math.round(n).toLocaleString(currency === 'BDT' ? 'en-IN' : 'en-US');
}

/** "2026-12-01" → "1 Dec 2026" without timezone drift. */
export function fmtDate(iso: string) {
  const [y, m, d] = iso.slice(0, 10).split('-').map(Number);
  return `${d} ${MONTHS[m - 1]} ${y}`;
}

/** Last day of a stay that starts on `start` and lasts `months`. */
export function endDate(start: string, months: number) {
  const [y, m, d] = start.split('-').map(Number);
  const e = new Date(Date.UTC(y, m - 1 + months, d));
  e.setUTCDate(e.getUTCDate() - 1);
  return e.toISOString().slice(0, 10);
}

export function period(start: string, months: number) {
  return `${fmtDate(start)} – ${fmtDate(endDate(start, months))}`;
}

export function rangesOverlap(aStart: string, aMonths: number, bStart: string, bMonths: number) {
  return aStart <= endDate(bStart, bMonths) && bStart <= endDate(aStart, aMonths);
}
