"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { readOutfitForm, validateOutfit, type OutfitErrors } from "@/lib/validation";

export type OutfitFormState = { error?: string; fieldErrors?: OutfitErrors };

export async function createOutfit(_prev: OutfitFormState, formData: FormData): Promise<OutfitFormState> {
  const { supabase } = await requireUser();
  const input = readOutfitForm(formData);
  const fieldErrors = validateOutfit(input);
  if (Object.keys(fieldErrors).length > 0) {
    return { error: "A couple of things need fixing before this can be saved.", fieldErrors };
  }

  // 1. Save the outfit itself.
  const { data: outfit, error } = await supabase
    .from("outfits")
    .insert({ worn_on: input.worn_on, occasion: input.occasion, notes: input.notes })
    .select("id")
    .single();
  if (error) return { error: "Something went wrong saving this outfit. Please try again." };

  // 2. Link each picked piece to it (one row per piece in outfit_pieces).
  const links = input.piece_ids.map((piece_id) => ({ outfit_id: outfit.id, piece_id }));
  const { error: linkError } = await supabase.from("outfit_pieces").insert(links);
  if (linkError) {
    // Don't leave a half-saved outfit behind.
    await supabase.from("outfits").delete().eq("id", outfit.id);
    return { error: "Something went wrong saving the pieces in this outfit. Please try again." };
  }

  revalidatePath("/outfits");
  revalidatePath("/");
  redirect(`/outfits/${outfit.id}`);
}

export async function deleteOutfit(id: number) {
  const { supabase } = await requireUser();
  await supabase.from("outfits").delete().eq("id", id);
  revalidatePath("/outfits");
  revalidatePath("/");
  redirect("/outfits");
}
