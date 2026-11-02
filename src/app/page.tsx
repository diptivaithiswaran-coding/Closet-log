import Link from "next/link";
import { requireUser } from "@/lib/auth";
import type { Piece } from "@/lib/types";
import Header from "./Header";
import PieceCard from "./PieceCard";
import { getStarredIds } from "@/lib/stars";

export default async function Home() {
  const { supabase, user } = await requireUser();

  const { data } = await supabase
    .from("pieces")
    .select("*")
    .order("created_at", { ascending: false });
  const pieces = (data ?? []) as Piece[];
  const starred = await getStarredIds(supabase);

  return (
    <>
      <Header email={user.email ?? ""} />
      <main className="page">
        <div className="page-head">
          <div>
            <h1>My closet</h1>
            <p className="muted">{pieces.length} {pieces.length === 1 ? "piece" : "pieces"}</p>
          </div>
          <Link href="/pieces/new" className="btn">+ Add piece</Link>
        </div>

        {pieces.length === 0 ? (
          <div className="empty card">
            <h2>Your closet is empty</h2>
            <p className="muted">Add your first piece to get started.</p>
            <Link href="/pieces/new" className="btn">+ Add piece</Link>
          </div>
        ) : (
          <div className="grid">
            {pieces.map((p) => <PieceCard key={p.id} piece={p} starred={starred.has(p.id)} />)}
          </div>
        )}
      </main>
    </>
  );
}
