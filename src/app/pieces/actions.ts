"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { readPieceForm, validatePiece, type FieldErrors } from "@/lib/validation";

export type PieceFormState = { error?: string; fieldErrors?: FieldErrors };

export async function createPiece(_prev: PieceFormState, formData: FormData): Promise<PieceFormState> {
  const { supabase } = await requireUser();
  const piece = readPieceForm(formData);
  const fieldErrors = validatePiece(piece);
  if (Object.keys(fieldErrors).length > 0) {
    return { error: "A couple of things need fixing before this can be saved.", fieldErrors };
  }

  const { data, error } = await supabase.from("pieces").insert(piece).select("id").single();
  if (error) return { error: "Something went wrong saving this piece. Please try again." };

  revalidatePath("/");
  redirect(`/pieces/${data.id}`);
}

export async function updatePiece(
  id: number,
  _prev: PieceFormState,
  formData: FormData
): Promise<PieceFormState> {
  const { supabase } = await requireUser();
  const piece = readPieceForm(formData);
  const fieldErrors = validatePiece(piece);
  if (Object.keys(fieldErrors).length > 0) {
    return { error: "A couple of things need fixing before this can be saved.", fieldErrors };
  }

  const { error } = await supabase.from("pieces").update(piece).eq("id", id);
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
