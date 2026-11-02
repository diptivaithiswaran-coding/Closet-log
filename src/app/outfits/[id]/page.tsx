import Link from "next/link";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth";
import type { OutfitWithPieces } from "@/lib/types";
import { niceDate } from "@/lib/format";
import Header from "../../Header";
import PieceCard from "../../PieceCard";
import DeleteOutfitButton from "../DeleteOutfitButton";

export default async function OutfitPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { supabase, user } = await requireUser();

  const { data: outfit } = await supabase
    .from("outfits")
    .select("*, pieces(*)")
    .eq("id", id)
    .maybeSingle<OutfitWithPieces>();
  if (!outfit) notFound();

  return (
    <>
      <Header email={user.email ?? ""} />
      <main className="page">
        <Link href="/outfits" className="small">← All outfits</Link>
        <div className="page-head" style={{ marginTop: "1rem" }}>
          <div>
            <p className="eyebrow">{outfit.occasion ?? "Outfit"}</p>
            <h1>{niceDate(outfit.worn_on)}</h1>
            {outfit.notes && <p className="muted">{outfit.notes}</p>}
          </div>
          <DeleteOutfitButton id={outfit.id} />
        </div>
        <div className="grid">
          {outfit.pieces.map((p) => <PieceCard key={p.id} piece={p} />)}
        </div>
      </main>
    </>
  );
}
