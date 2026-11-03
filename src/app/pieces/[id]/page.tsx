import Link from "next/link";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth";
import type { Piece } from "@/lib/types";
import { capitalize, money, niceDate } from "@/lib/format";
import Header from "../../Header";
import DeleteButton from "./DeleteButton";
import StarButton from "../../stars/StarButton";
import { getStarredIds } from "@/lib/stars";
import CategoryIcon from "@/app/art/CategoryIcon";

export default async function PiecePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { supabase, user } = await requireUser();

  // Row-level security means this only finds the piece if it belongs to the logged-in user.
  const { data: piece } = await supabase.from("pieces").select("*").eq("id", id).maybeSingle<Piece>();
  if (!piece) notFound();
  const isStarred = (await getStarredIds(supabase)).has(piece.id);

  // Every outfit this piece was part of, newest first.
  const { data: worn } = await supabase
    .from("outfit_pieces")
    .select("outfits(id, worn_on, occasion)")
    .eq("piece_id", piece.id);
  const outfits = (worn ?? [])
    .map((r) => r.outfits as unknown as { id: number; worn_on: string; occasion: string | null } | null)
    .filter((o): o is { id: number; worn_on: string; occasion: string | null } => !!o)
    .sort((a, b) => b.worn_on.localeCompare(a.worn_on));

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
              <CategoryIcon category={piece.category} size={120} />
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
              <dt>Worn</dt><dd>{outfits.length} {outfits.length === 1 ? "time" : "times"}</dd>
            </dl>
            <div className="actions">
              <StarButton pieceId={piece.id} starred={isStarred} variant="inline" />
              <Link href={`/pieces/${piece.id}/edit`} className="btn btn-secondary">Edit</Link>
              <DeleteButton id={piece.id} name={piece.name} />
            </div>
          </div>
        </div>

        {outfits.length > 0 && (
          <section className="worn-in">
            <h2>Worn in</h2>
            <ul>
              {outfits.map((o) => (
                <li key={o.id}>
                  <Link href={`/outfits/${o.id}`}>{niceDate(o.worn_on)}</Link>
                  {o.occasion && <span className="muted"> · {o.occasion}</span>}
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>
    </>
  );
}
