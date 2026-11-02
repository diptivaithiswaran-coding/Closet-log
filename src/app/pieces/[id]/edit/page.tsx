import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth";
import type { Piece } from "@/lib/types";
import Header from "../../../Header";
import PieceForm from "../../PieceForm";
import { updatePiece } from "../../actions";

export default async function EditPiecePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { supabase, user } = await requireUser();

  const { data: piece } = await supabase.from("pieces").select("*").eq("id", id).maybeSingle<Piece>();
  if (!piece) notFound();

  return (
    <>
      <Header email={user.email ?? ""} />
      <main className="page narrow">
        <h1>Edit piece</h1>
        <PieceForm
          action={updatePiece.bind(null, piece.id)}
          piece={piece}
          submitLabel="Save changes"
          cancelHref={`/pieces/${piece.id}`}
        />
      </main>
    </>
  );
}
