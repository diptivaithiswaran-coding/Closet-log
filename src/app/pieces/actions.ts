"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { readPieceForm, toPieceRow, validatePiece, type FieldErrors } from "@/lib/validation";

export type PieceFormState = { error?: string; fieldErrors?: FieldErrors };

// Only accept photo links that point into this user's own folder in our bucket.
function safePhotoUrl(url: string | null, userId: string): string | null {
  if (!url) return null;
  const prefix = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/photos/${userId}/`;
  return url.startsWith(prefix) ? url : null;
}

export async function createPiece(_prev: PieceFormState, formData: FormData): Promise<PieceFormState> {
  const { supabase, user } = await requireUser();
  const piece = readPieceForm(formData);
  piece.photo_url = safePhotoUrl(piece.photo_url, user.id);
  const fieldErrors = validatePiece(piece);
  if (Object.keys(fieldErrors).length > 0) {
    return { error: "A couple of things need fixing before this can be saved.", fieldErrors };
  }

  const { data, error } = await supabase.from("pieces").insert(toPieceRow(piece)).select("id").single();
  if (error) return { error: "Something went wrong saving this piece. Please try again." };

  revalidatePath("/");
  redirect(`/pieces/${data.id}`);
}

export async function updatePiece(
  id: number,
  _prev: PieceFormState,
  formData: FormData
): Promise<PieceFormState> {
  const { supabase, user } = await requireUser();
  const piece = readPieceForm(formData);
  piece.photo_url = safePhotoUrl(piece.photo_url, user.id);

  // How many logged outfits already include this piece.
  const { count } = await supabase
    .from("outfit_pieces")
    .select("piece_id", { count: "exact", head: true })
    .eq("piece_id", id);
  const loggedWears = count ?? 0;

  const fieldErrors = validatePiece(piece, loggedWears);
  if (Object.keys(fieldErrors).length > 0) {
    return { error: "A couple of things need fixing before this can be saved.", fieldErrors };
  }

  const { error } = await supabase.from("pieces").update(toPieceRow(piece, loggedWears)).eq("id", id);
  if (error) return { error: "Something went wrong saving this piece. Please try again." };

  revalidatePath("/");
  revalidatePath(`/pieces/${id}`);
  redirect(`/pieces/${id}`);
}

export async function deletePiece(id: number) {
  const { supabase } = await requireUser();
  await supabase.from("pieces").delete().eq("id", id);
  revalidatePath("/");
  redirect("/");
}
