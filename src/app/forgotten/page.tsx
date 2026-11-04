import Link from "next/link";
import { requireUser } from "@/lib/auth";
import type { Piece } from "@/lib/types";
import { findForgotten, type ForgottenPiece } from "@/lib/forgotten";
import { getStarredIds } from "@/lib/stars";
import { niceDate } from "@/lib/format";
import Header from "../Header";
import PieceCard from "../PieceCard";

export default async function ForgottenPage() {
  const { supabase, user } = await requireUser();

  const [{ data: pieceRows }, { data: wornRows }, starred] = await Promise.all([
    supabase.from("pieces").select("*"),
    supabase.from("outfit_pieces").select("piece_id, outfits(worn_on)"),
    getStarredIds(supabase),
  ]);

  // Most recent date each piece was worn.
  const lastWorn = new Map<number, string>();
  for (const row of wornRows ?? []) {
    const date = (row.outfits as unknown as { worn_on: string } | null)?.worn_on;
    if (!date) continue;
    const prev = lastWorn.get(row.piece_id as number);
    if (!prev || date > prev) lastWorn.set(row.piece_id as number, date);
  }

  const today = new Date().toLocaleDateString("en-CA", { timeZone: "America/Los_Angeles" });
  const { notWorn, neverWorn } = findForgotten((pieceRows ?? []) as Piece[], lastWorn, today, 30);

  return (
    <>
      <Header email={user.email ?? ""} />
      <main className="page">
        <div className="page-head">
          <div>
            <h1>Not worn lately</h1>
            <p className="page-intro">
              Clothes you haven't worn in 30+ days. Wear them again, or think about letting them go.
            </p>
          </div>
        </div>

        <section className="forgotten-section">
          <h2>Not worn in 30+ days</h2>
          {notWorn.length === 0 ? (
            <p className="muted">Nothing here. Everything you've worn has been out in the last month. 👏</p>
          ) : (
            <Grid items={notWorn} starred={starred} note={(f) => `Last worn ${niceDate(f.lastWorn)} · ${f.daysSince} days ago`} />
          )}
        </section>

        <section className="forgotten-section">
          <h2>No logged wears yet</h2>
          {neverWorn.length === 0 ? (
            <p className="muted">Every piece is in at least one logged outfit.</p>
          ) : (
            <>
              <p className="muted small">Not in any outfit you've logged.</p>
              <Grid items={neverWorn} starred={starred} note={(f) =>
                  f.piece.past_wears > 0
                    ? `Worn ${f.piece.past_wears}× before Closet Log, not since`
                    : `Never worn · in closet ${f.daysSince} ${f.daysSince === 1 ? "day" : "days"}`
                } />
            </>
          )}
        </section>

        <p className="muted small">
          Wore one today? <Link href="/outfits/new">Log an outfit</Link> and it'll drop off this list.
        </p>
      </main>
    </>
  );
}

function Grid({
  items,
  starred,
  note,
}: {
  items: ForgottenPiece[];
  starred: Set<number>;
  note: (f: ForgottenPiece) => string;
}) {
  return (
    <div className="grid">
      {items.map((f) => (
        <div key={f.piece.id}>
          <PieceCard piece={f.piece} starred={starred.has(f.piece.id)} />
          <p className="forgotten-note small">{note(f)}</p>
        </div>
      ))}
    </div>
  );
}
