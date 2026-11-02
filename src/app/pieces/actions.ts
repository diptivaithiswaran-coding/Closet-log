"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";

export type PieceFormState = { error?: string };

function readForm(formData: FormData) {
  const text = (key: string) => {
    const v = String(formData.get(key) ?? "").trim();
    return v === "" ? null : v;
  };
  const priceText = text("price");
  return {
    name: text("name"),
    category: text("category"),
    brand: text("brand"),
    color: text("color"),
    price: priceText === null ? null : Number(priceText),
    purchased_on: text("purchased_on"),
  };
}

export async function createPiece(_prev: PieceFormState, formData: FormData): Promise<PieceFormState> {
  const { supabase } = await requireUser();
  const piece = readForm(formData);

  const { data, error } = await supabase.from("pieces").insert(piece).select("id").single();
  if (error) return { error: error.message };

  revalidatePath("/");
  redirect(`/pieces/${data.id}`);
}

export async function updatePiece(
  id: number,
  _prev: PieceFormState,
  formData: FormData
): Promise<PieceFormState> {
  const { supabase } = await requireUser();
  const piece = readForm(formData);

  const { error } = await supabase.from("pieces").update(piece).eq("id", id);
  if (error) return { error: error.message };

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
