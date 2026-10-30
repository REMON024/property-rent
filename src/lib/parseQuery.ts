/**
 * Turns a free-text home request (Bangla, English or mixed) into filters.
 * Rule-based for the demo; in production send the text to an LLM with
 * a JSON schema and keep this as a fast fallback.
 */
export interface Parsed {
  area?: string;
  maxRent?: number;
  beds?: number;
  tenant?: 'Family' | 'Bachelor';
  facilities: string[];
  month?: string;
  nearMetro?: boolean;
}

const AREAS: Record<string, string[]> = {
  'Mirpur 10': ['mirpur 10', 'মিরপুর ১০', 'mirpur10'],
  'Mirpur 2': ['mirpur 2', 'মিরপুর ২'],
  Uttara: ['uttara', 'উত্তরা'],
  Dhanmondi: ['dhanmondi', 'ধানমন্ডি'],
  Banasree: ['banasree', 'banashree', 'বনশ্রী'],
  Badda: ['badda', 'বাড্ডা'],
};
const FAC: Record<string, RegExp> = {
  'Gas line': /gas|গ্যাস/,
  Lift: /lift|elevator|লিফট/,
  Generator: /generator|জেনারেটর/,
  Parking: /parking|পার্কিং/,
  Security: /security|guard|সিকিউরিটি|দারোয়ান/,
  'Wi-Fi': /wi-?fi|internet|ওয়াইফাই/,
};
const MONTHS = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
const BN_MONTHS = ['জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'];

const bnDigits = (s: string) => s.replace(/[০-৯]/g, (d) => String('০১২৩৪৫৬৭৮৯'.indexOf(d)));

export function parseQuery(raw: string): Parsed {
  const t = bnDigits(raw).toLowerCase();
  const out: Parsed = { facilities: [] };

  for (const [name, keys] of Object.entries(AREAS)) {
    if (keys.some((k) => bnDigits(k).toLowerCase() && t.includes(bnDigits(k).toLowerCase()))) {
      out.area = name;
      break;
    }
  }
  if (!out.area && /mirpur|মিরপুর/.test(t)) out.area = 'Mirpur 10';

  const k = t.match(/(\d{1,3})\s*(k|হাজার)\b/);
  const n = t.match(/(?:under|below|max|within|এর মধ্যে|পর্যন্ত)?\s*(\d{4,6})/);
  if (k) out.maxRent = Number(k[1]) * 1000;
  else if (n) out.maxRent = Number(n[1]);

  const b = t.match(/(\d)\s*(bed|bedroom|room|বেড|রুম)/);
  if (b) out.beds = Number(b[1]);

  if (/bachelor|ব্যাচেলর|student|single/.test(t)) out.tenant = 'Bachelor';
  else if (/family|ফ্যামিলি|পরিবার/.test(t)) out.tenant = 'Family';

  for (const [name, re] of Object.entries(FAC)) if (re.test(t)) out.facilities.push(name);

  MONTHS.forEach((m, i) => {
    if (!out.month && (t.includes(m) || t.includes(m.slice(0, 3) + ' ') || raw.includes(BN_MONTHS[i]))) out.month = MONTHS[i][0].toUpperCase() + MONTHS[i].slice(1);
  });
  out.nearMetro = /metro|মেট্রো/.test(t);
  return out;
}
