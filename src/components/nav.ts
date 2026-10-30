export const NAV = [
  { href: '/', label: 'Home', icon: 'M3 11 12 4l9 7M5 10v10h14V10' },
  { href: '/search', label: 'Search', icon: 'M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM20 20l-3.5-3.5' },
  { href: '/bookings', label: 'Bookings', icon: 'M4 6h16v14H4zM4 10h16M9 3v4M15 3v4' },
  { href: '/owner', label: 'Owner', icon: 'M4 20V9l8-5 8 5v11M9 20v-6h6v6' },
  { href: '/admin', label: 'Admin', icon: 'M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z' },
] as const;

/** Which nav item a path belongs to: /listings/* sits under Search. */
export function activeNav(path: string) {
  if (path.startsWith('/listings')) return '/search';
  const hit = NAV.filter((n) => n.href !== '/' && path.startsWith(n.href));
  return hit.length ? hit[0].href : path === '/' ? '/' : '';
}
