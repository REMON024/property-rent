# Basha Khoj

Rental marketplace web app: renters search and book a home for a set period, owners list and manage properties, admins verify IDs and moderate listings.

Next.js 14 (App Router) · TypeScript · Tailwind CSS · server actions · dummy data · Prisma schema ready for PostgreSQL.

## Run it

```bash
npm install
npm run dev
# open http://localhost:3000
```

Requires Node.js 18.17 or newer. The demo user is renter, owner and admin at once, so every screen is reachable without signing in. Data lives in server memory and resets when the server restarts.

## Screens

| Route | Screen |
| --- | --- |
| `/` | Home: search, new listings, cities, how it works, owner call to action |
| `/search` | Search with filters in the URL; list + map, or map-first view (`?view=map`) |
| `/listings/[id]` | Property details, photos, map, rules, booking panel |
| `/signin` | Phone OTP sign-in (renter or owner) |
| `/bookings` | Renter bookings with tabs, progress steps, pay advance, cancel |
| `/owner` | Owner dashboard: KYC banner, stats, booking requests, listings |
| `/owner/properties/[id]` | Owner property details: stats, photos, bookings, pause / rented / relist, history |
| `/owner/properties/new` | Add property: details, map pin, facilities, photo upload, rent and availability |
| `/owner/kyc` | Owner ID verification: document, selfie, status |
| `/admin` | Admin overview: listing queue, KYC queue, all listings, country rollout |
| `/admin/kyc/[id]` | KYC review: documents, extracted details, automated checks, decision |
| `/admin/listings/[id]` | Listing review: automated checks, owner KYC, audit log, approve / changes / reject / unpublish |
| `/areas` | Neighbourhood guide: rank areas by commute and budget |
| `/assistant` | Describe-your-home search (Bangla, English or mixed) ranked by fit |

## Try the full flow

1. **Owner KYC:** Owner → Start verification → submit.
2. **Approve it:** Admin → ID verification → Review → Approve.
3. **Add a property:** Owner → Add property → submit with photos.
4. **Publish it:** Admin → Review listing → Approve and publish. It now shows in search.
5. **Book:** open any home → Request to book.
6. **Accept:** requests on your own listings (Senpara, Kazipara) appear in Owner → Accept.
7. **Pay:** Bookings → Pay advance → Confirmed.

## Project layout

```
src/
  app/            routes (see table above)
  components/     Header, BottomNav, BookingCard, KycBanner, SubmitButton, ui (cards, pills, map, facts)
  lib/
    data.ts       dummy data store + read helpers  ← replace with Prisma queries
    actions.ts    server actions: booking, payments, listings, KYC, moderation
    booking.ts    booking state machine (allowed transitions)
    parseQuery.ts free-text search parser for /assistant
    format.ts     money and date helpers
    types.ts      shared types
prisma/schema.prisma  production schema (PostgreSQL)
```

## Theming

All colours are CSS variables in `src/app/globals.css` with light and dark values, mapped to Tailwind names (`bg-brand`, `text-muted`, `border-line`…) in `tailwind.config.ts`. Change a market's brand by changing tokens, not components.

## Next steps to production

- Set `DATABASE_URL`, run `npm run db:migrate`, and swap `src/lib/data.ts` helpers for Prisma.
- Auth: phone OTP via an SMS gateway (or NextAuth / Supabase Auth).
- Payments: bKash, Nagad and a card gateway; hold advances in escrow (see SRS FR-PAY).
- Storage: upload photos and KYC documents to S3, not data URLs.
- Maps: replace `MapBase` with Google Maps or Mapbox using real lat/lng.
- Jobs: 24-hour expiry for unanswered requests and unpaid advances.
- i18n: move UI strings to translation files for বাংলা and العربية (RTL).
