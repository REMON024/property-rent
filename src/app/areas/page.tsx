import Link from 'next/link';
import type { Metadata } from 'next';
import { db } from '@/lib/data';
import { money } from '@/lib/format';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Neighbourhood guide' };

/** Concept B: pick the area first. Commute and area facts are dummy data. */
const AREAS = [
  { name: 'Mirpur 10', blurb: 'Busy and well connected, with the metro and a big market. Good value for families.', commute: { Gulshan: 35, Motijheel: 30, Uttara: 25 }, schools: 'Many', gas: 'Yes', flooding: 'Some roads', bachelor: 'Mixed', tint: '#CFE1D8' },
  { name: 'Uttara', blurb: 'Planned sectors, wide roads and lots of schools. Long ride to the south of the city.', commute: { Gulshan: 30, Motijheel: 50, Uttara: 5 }, schools: 'Many', gas: 'Most', flooding: 'Rare', bachelor: 'Few', tint: '#D6DDEA' },
  { name: 'Badda', blurb: 'Central and good value, with quick access to Gulshan over the link road.', commute: { Gulshan: 15, Motijheel: 30, Uttara: 35 }, schools: 'Several', gas: 'Yes', flooding: 'Some roads', bachelor: 'Mixed', tint: '#FFD9CC' },
  { name: 'Banasree', blurb: 'Quiet blocks and many schools. Calmer, but a longer commute at peak hours.', commute: { Gulshan: 35, Motijheel: 30, Uttara: 45 }, schools: 'Many', gas: 'Yes', flooding: 'Rare', bachelor: 'Few', tint: '#E3D5F0' },
  { name: 'Dhanmondi', blurb: 'Green, lake-side and central, with the highest rents on this list.', commute: { Gulshan: 35, Motijheel: 25, Uttara: 55 }, schools: 'Many', gas: 'Yes', flooding: 'Some roads', bachelor: 'Few', tint: '#D4E9DE' },
];
const WORK = ['Gulshan', 'Motijheel', 'Uttara'] as const;

export default function Areas({ searchParams }: { searchParams: { work?: string; budget?: string; who?: string } }) {
  const work = (WORK as readonly string[]).includes(searchParams.work ?? '') ? (searchParams.work as (typeof WORK)[number]) : 'Gulshan';
  const budget = Number(searchParams.budget) || 20000;
  const who = searchParams.who === 'Bachelor' ? 'Bachelor' : 'Family';

  const ranked = AREAS.map((a) => {
    const homes = db.listings.filter((l) => l.status === 'Live' && l.area === a.name && l.tenantType === who);
    const inBudget = homes.filter((l) => l.rent <= budget);
    const rents = homes.map((l) => l.rent);
    const score = 100 - a.commute[work] + inBudget.length * 15;
    return { ...a, homes, inBudget, low: rents.length ? Math.min(...rents) : null, high: rents.length ? Math.max(...rents) : null, score };
  }).sort((x, y) => y.score - x.score);

  return (
    <>
      <section className="bg-[#24152E] text-[#FBF8F6]">
        <div className="gutter max-w-6xl mx-auto py-10 md:py-14 flex flex-col gap-6">
          <h1 className="font-display font-extrabold text-4xl md:text-6xl leading-[.98] tracking-tight m-0 max-w-[16ch]">Pick the area first. The home follows.</h1>
          <p className="m-0 text-lg text-[#D9CBE0] max-w-[54ch]">Tell us where you work and your budget. We rank areas by commute and by homes free in your range.</p>
          <form className="flex flex-wrap gap-2.5 max-w-3xl">
            <label htmlFor="work" className="flex-[2_1_200px] flex flex-col gap-1 bg-[#3A2647] rounded-xl px-3.5 py-2 text-xs font-semibold text-[#D9CBE0]">
              I work near
              <select id="work" name="work" defaultValue={work} className="bg-transparent text-[#FBF8F6] text-base font-medium outline-none">
                {WORK.map((w) => <option key={w} className="text-ink">{w}</option>)}
              </select>
            </label>
            <label htmlFor="budget" className="flex-[1_1_150px] flex flex-col gap-1 bg-[#3A2647] rounded-xl px-3.5 py-2 text-xs font-semibold text-[#D9CBE0]">
              Monthly budget (৳)
              <input id="budget" name="budget" type="number" min={3000} step={500} defaultValue={budget} className="bg-transparent text-[#FBF8F6] text-base font-medium outline-none min-w-0" />
            </label>
            <label htmlFor="who" className="flex-[1_1_150px] flex flex-col gap-1 bg-[#3A2647] rounded-xl px-3.5 py-2 text-xs font-semibold text-[#D9CBE0]">
              Who&apos;s moving
              <select id="who" name="who" defaultValue={who} className="bg-transparent text-[#FBF8F6] text-base font-medium outline-none">
                <option className="text-ink">Family</option>
                <option className="text-ink">Bachelor</option>
              </select>
            </label>
            <button className="flex-[1_1_120px] min-h-[56px] rounded-xl bg-[#FF6B4A] text-[#24152E] font-bold">Rank areas</button>
          </form>
        </div>
      </section>

      <div className="gutter max-w-6xl mx-auto py-10 flex flex-col gap-10">
        <section className="flex flex-col gap-4">
          <div className="flex flex-wrap justify-between items-baseline gap-2">
            <h2 className="font-display font-extrabold text-2xl m-0">Best areas for you</h2>
            <span className="text-sm text-muted">Commute times are sample data</span>
          </div>
          <div className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(280px,1fr))]">
            {ranked.slice(0, 3).map((a, i) => (
              <Link key={a.name} href={`/search?q=${encodeURIComponent(a.name)}&max=${budget}&tenant=${who}`} className="card overflow-hidden flex flex-col">
                <div className="h-28 relative" style={{ background: a.tint }}>
                  <span className="absolute left-4 top-3 font-display font-extrabold text-4xl text-[#24152E]/80">{i + 1}</span>
                </div>
                <div className="p-4 flex flex-col gap-3">
                  <span className="font-display font-extrabold text-2xl">{a.name}</span>
                  <span className="text-muted">{a.blurb}</span>
                  <div className="grid grid-cols-3 gap-2 border-t border-line pt-3 text-sm">
                    <div><div className="text-xs text-muted">Rent seen</div><div className="font-semibold tabnum">{a.low ? `${money(a.low)}+` : '—'}</div></div>
                    <div><div className="text-xs text-muted">To {work}</div><div className="font-semibold tabnum">{a.commute[work]} min</div></div>
                    <div><div className="text-xs text-muted">In budget</div><div className="font-semibold tabnum">{a.inBudget.length}</div></div>
                  </div>
                  <span className="text-sm font-semibold text-[#C2410C]">See homes in {a.name}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="font-display font-extrabold text-2xl m-0">Compare at a glance</h2>
          <div className="card overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm border-collapse">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wider text-muted">
                  {['Area', `To ${work}`, 'Schools', 'Gas line common', 'Monsoon flooding', 'Bachelor-friendly'].map((h) => <th key={h} className="px-4 py-3 font-semibold">{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {ranked.map((a) => (
                  <tr key={a.name} className="border-t border-line">
                    <td className="px-4 py-3 font-semibold">{a.name}</td>
                    <td className="px-4 py-3 tabnum">{a.commute[work]} min</td>
                    <td className="px-4 py-3">{a.schools}</td>
                    <td className="px-4 py-3">{a.gas}</td>
                    <td className="px-4 py-3">{a.flooding}</td>
                    <td className="px-4 py-3">{a.bachelor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </>
  );
}
