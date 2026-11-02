import { requireUser } from "@/lib/auth";
import type { Piece } from "@/lib/types";
import Header from "../Header";
import Picker from "./Picker";

export default async function PickPage() {
  const { supabase, user } = await requireUser();
  const { data } = await supabase.from("pieces").select("*").in("category", ["top", "bottom", "shoes"]);

  return (
    <>
      <Header email={user.email ?? ""} />
      <main className="page">
        <div className="page-head">
          <div>
            <h1>Random pick</h1>
            <p className="muted">Stuck? Let your closet decide.</p>
          </div>
        </div>
        <Picker pieces={(data ?? []) as Piece[]} />
      </main>
    </>
  );
}
