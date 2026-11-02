"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";

// Star the piece if it isn't starred yet, unstar it if it is.
export async function toggleStar(pieceId: number, starred: boolean) {
  const { supabase, user } = await requireUser();

  if (starred) {
    await supabase.from("stars").delete().eq("user_id", user.id).eq("piece_id", pieceId);
  } else {
    await supabase.from("stars").insert({ piece_id: pieceId });
  }

  revalidatePath("/");
  revalidatePath("/starred");
  revalidatePath(`/pieces/${pieceId}`);
}
