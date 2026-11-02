import { requireUser } from "@/lib/auth";
import type { Piece } from "@/lib/types";
import Header from "../../Header";
import OutfitForm from "../OutfitForm";
import { createOutfit } from "../actions";

export default async function NewOutfitPage() {
  const { supabase, user } = await requireUser();
  const { data } = await supabase.from("pieces").select("*").order("category").order("name");

  return (
    <>
      <Header email={user.email ?? ""} />
      <main className="page narrow">
        <h1>Log an outfit</h1>
        <OutfitForm action={createOutfit} pieces={(data ?? []) as Piece[]} />
      </main>
    </>
  );
}
