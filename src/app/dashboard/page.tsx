import Link from "next/link";
import { requireUser } from "@/lib/auth";
import type { Piece } from "@/lib/types";
import { computeStats, outfitsPerWeek } from "@/lib/stats";
import { getWearCounts } from "@/lib/wears";
import { money } from "@/lib/format";
import Header from "../Header";
import WeekChart from "./WeekChart";

export default async function DashboardPage() {
  const { supabase, user } = await requireUser();

  const [{ data: pieceRows }, { data: outfitRows }, wearCounts] = await Promise.all([
    supabase.from("pieces").select("*"),
    supabase.from("outfits").select("worn_on"),
    getWearCounts(supabase),
  ]);
  const pieces = (pieceRows ?? []) as Piece[];
  const wornOn = (outfitRows ?? []).map((o) => o.worn_on as string);

  const stats = computeStats(pieces, wearCounts, wornOn.length);
  // Pacific "today", so the current week is right in the evening too.
  const today = new Date().toLocaleDateString("en-CA", { timeZone: "America/Los_Angeles" });
  const weeks = outfitsPerWeek(wornOn, today, 8);

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
        </div>

        <section className="tiles">
          <div className="tile card">
            <p className="tile-label">Pieces</p>
            <p className="tile-value">{stats.totalPieces}</p>
          </div>
          <div className="tile card">
            <p className="tile-label">Outfits logged</p>
            <p className="tile-value">{stats.totalOutfits}</p>
          </div>
          <div className="tile card">
            <p className="tile-label">Avg cost-per-wear</p>
            <p className="tile-value" data-testid="avg-cpw">{money(stats.avgCostPerWear)}</p>
            <p className="muted small">Across pieces with a price that you've worn</p>
          </div>
          <div className="tile card">
            <p className="tile-label">Most worn</p>
            {stats.mostWorn ? (
              <>
                <p className="tile-value tile-value-sm">
                  <Link href={`/pieces/${stats.mostWorn.piece.id}`}>{stats.mostWorn.piece.name}</Link>
                </p>
                <p className="muted small">
                  {stats.mostWorn.wears} {stats.mostWorn.wears === 1 ? "wear" : "wears"}
                </p>
              </>
            ) : (
              <p className="tile-value tile-value-sm muted">—</p>
            )}
          </div>
        </section>

        <section className="card chart-card">
          <h2>Outfits per week</h2>
          <p className="muted small">Last 8 weeks</p>
          <WeekChart data={weeks} />
        </section>

        <section className="card chart-card">
          <h2>Cost-per-wear</h2>
          <p className="muted small">Price ÷ times worn. Lower means the piece is earning its keep.</p>
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
