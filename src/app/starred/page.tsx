import Link from "next/link";
import { requireUser } from "@/lib/auth";
import type { Piece } from "@/lib/types";
import Header from "../Header";
import PieceCard from "../PieceCard";

export default async function StarredPage() {
  const { supabase, user } = await requireUser();

  // Go through the stars table to the pieces it points at, newest star first.
  const { data } = await supabase
    .from("stars")
    .select("created_at, pieces(*)")
    .order("created_at", { ascending: false });
  const pieces = (data ?? [])
    .map((r) => r.pieces as unknown as Piece | null)
    .filter((p): p is Piece => !!p);

  return (
    <>
      <Header email={user.email ?? ""} />
      <main className="page">
        <div className="page-head">
          <div>
            <h1>Starred</h1>
            <p className="muted">Your go-tos · {pieces.length} {pieces.length === 1 ? "piece" : "pieces"}</p>
          </div>
        </div>

        {pieces.length === 0 ? (
          <div className="empty card">
            <h2>Nothing starred yet</h2>
            <p className="muted">Tap the ☆ on any piece in your closet to save it here.</p>
            <Link href="/" className="btn">Go to closet</Link>
          </div>
        ) : (
          <div className="grid">
            {pieces.map((p) => <PieceCard key={p.id} piece={p} starred />)}
          </div>
        )}
      </main>
    </>
  );
}
