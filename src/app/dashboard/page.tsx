import Link from "next/link";
import { requireUser } from "@/lib/auth";
import type { Piece } from "@/lib/types";
import { computeStats, outfitsPerMonth, outfitsPerWeek, outfitYears } from "@/lib/stats";
import { getWearCounts } from "@/lib/wears";
import { money } from "@/lib/format";
import Header from "../Header";
import WeekChart from "./WeekChart";
import RangePicker from "./RangePicker";

type Props = { searchParams: Promise<{ range?: string }> };

export default async function DashboardPage({ searchParams }: Props) {
  const { supabase, user } = await requireUser();
  const { range: rangeParam } = await searchParams;

  const [{ data: pieceRows }, { data: outfitRows }, { data: linkRows }, wearCounts] = await Promise.all([
    supabase.from("pieces").select("*"),
    supabase.from("outfits").select("worn_on"),
    supabase.from("outfit_pieces").select("piece_id, outfits(worn_on)"),
    getWearCounts(supabase),
  ]);
  const pieces = (pieceRows ?? []) as Piece[];
  const wornOn = (outfitRows ?? []).map((o) => o.worn_on as string);

  const stats = computeStats(pieces, wearCounts, wornOn.length);
  // Pacific "today", so the current week is right in the evening too.
  const today = new Date().toLocaleDateString("en-CA", { timeZone: "America/Los_Angeles" });
  const thisYear = Number(today.slice(0, 4));
  const years = outfitYears(wornOn, thisYear);

  // Which range is picked: last 8 weeks (default) or one year.
  const year = rangeParam && years.includes(Number(rangeParam)) ? Number(rangeParam) : null;
  const chartData = year ? outfitsPerMonth(wornOn, year) : outfitsPerWeek(wornOn, today, 8);
  const outfitsInRange = year ? wornOn.filter((d) => Number(d.slice(0, 4)) === year).length : stats.totalOutfits;

  // In a year: most worn = most logged outfits that year (past wears have no date).
  let mostWorn = stats.mostWorn;
  if (year) {
    const counts = new Map<number, number>();
    for (const row of linkRows ?? []) {
      const d = (row.outfits as unknown as { worn_on: string } | null)?.worn_on;
      if (d && Number(d.slice(0, 4)) === year) counts.set(row.piece_id as number, (counts.get(row.piece_id as number) ?? 0) + 1);
    }
    mostWorn = null;
    for (const [id, wears] of counts) {
      const piece = pieces.find((p) => p.id === id);
      if (piece && (!mostWorn || wears > mostWorn.wears)) mostWorn = { piece, wears };
    }
  }

  const ranked = stats.perPiece
    .filter((p) => p.costPerWear !== null)
    .sort((a, b) => (a.costPerWear ?? 0) - (b.costPerWear ?? 0));

  return (
    <>
      <Header email={user.email ?? ""} />
      <main className="page">
        <div className="page-head">
          <div>
            <h1>Dashboard</h1>
            <p className="muted">What earns its spot in your closet.</p>
          </div>
          <RangePicker value={year ? String(year) : "8w"} years={years} />
        </div>

        <section className="tiles">
          <div className="tile card">
            <p className="tile-label">Pieces</p>
            <p className="tile-value">{stats.totalPieces}</p>
          </div>
          <div className="tile card">
            <p className="tile-label">Outfits logged{year ? ` in ${year}` : ""}</p>
            <p className="tile-value">{outfitsInRange}</p>
          </div>
          <div className="tile card">
            <p className="tile-label">Avg cost-per-wear</p>
            <p className="tile-value" data-testid="avg-cpw">{money(stats.avgCostPerWear)}</p>
            <p className="muted small">Across pieces with a price that you've worn</p>
          </div>
          <div className="tile card">
            <p className="tile-label">Most worn{year ? ` in ${year}` : ""}</p>
            {mostWorn ? (
              <>
                <p className="tile-value tile-value-sm">
                  <Link href={`/pieces/${mostWorn.piece.id}`}>{mostWorn.piece.name}</Link>
                </p>
                <p className="muted small">
                  {mostWorn.wears} {mostWorn.wears === 1 ? "wear" : "wears"}
                </p>
              </>
            ) : (
              <p className="tile-value tile-value-sm muted">—</p>
            )}
          </div>
        </section>

        <section className="card chart-card">
          <h2>{year ? `Outfits per month in ${year}` : "Outfits per week"}</h2>
          <p className="muted small">{year ? "January to December" : "Last 8 weeks"}</p>
          <WeekChart data={chartData} tooltipPrefix={year ? "" : "Week of "} />
        </section>

        <section className="card chart-card">
          <h2>Cost-per-wear{year ? " (all time)" : ""}</h2>
          <p className="muted small">Price divided by times worn. Lower means the piece is earning its keep.</p>
          {ranked.length === 0 ? (
            <p className="muted">Log a few outfits with pieces that have a price to see this.</p>
          ) : (
            <table className="cpw-table">
              <thead>
                <tr><th>Piece</th><th>Price</th><th>Wears</th><th>Cost-per-wear</th></tr>
              </thead>
              <tbody>
                {ranked.map(({ piece, wears, costPerWear }) => (
                  <tr key={piece.id}>
                    <td><Link href={`/pieces/${piece.id}`}>{piece.name}</Link></td>
                    <td>{money(piece.price)}</td>
                    <td>{wears}</td>
                    <td><strong>{money(costPerWear)}</strong></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </main>
    </>
  );
}
