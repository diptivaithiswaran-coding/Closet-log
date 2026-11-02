import Link from "next/link";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth";
import type { Piece } from "@/lib/types";
import { capitalize, money, niceDate } from "@/lib/format";
import Header from "../../Header";
import DeleteButton from "./DeleteButton";

export default async function PiecePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { supabase, user } = await requireUser();

  // Row-level security means this only finds the piece if it belongs to the logged-in user.
  const { data: piece } = await supabase.from("pieces").select("*").eq("id", id).maybeSingle<Piece>();
  if (!piece) notFound();

  return (
    <>
      <Header email={user.email ?? ""} />
      <main className="page narrow">
        <Link href="/" className="small">← Back to closet</Link>

        <div className="detail">
          <div className="photo photo-lg">
            {piece.photo_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={piece.photo_url} alt={piece.name} />
            ) : (
              <span className="photo-empty">{capitalize(piece.category)}</span>
            )}
          </div>

          <div className="stack">
            <p className="eyebrow">{capitalize(piece.category)}</p>
            <h1>{piece.name}</h1>
            <dl className="facts">
              <dt>Brand</dt><dd>{piece.brand ?? "—"}</dd>
              <dt>Color</dt><dd>{piece.color ?? "—"}</dd>
              <dt>Price</dt><dd>{money(piece.price)}</dd>
              <dt>Bought</dt><dd>{niceDate(piece.purchased_on)}</dd>
            </dl>
            <div className="actions">
              <Link href={`/pieces/${piece.id}/edit`} className="btn btn-secondary">Edit</Link>
              <DeleteButton id={piece.id} name={piece.name} />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
