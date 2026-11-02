import { requireUser } from "@/lib/auth";
import Header from "../../Header";
import PieceForm from "../PieceForm";
import { createPiece } from "../actions";

export default async function NewPiecePage() {
  const { user } = await requireUser();
  return (
    <>
      <Header email={user.email ?? ""} />
      <main className="page narrow">
        <h1>Add a piece</h1>
        <PieceForm action={createPiece} submitLabel="Save piece" cancelHref="/" />
      </main>
    </>
  );
}
