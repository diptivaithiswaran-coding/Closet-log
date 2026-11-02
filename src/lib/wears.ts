import type { SupabaseClient } from "@supabase/supabase-js";

// How many outfits each of the logged-in user's pieces appears in.
export async function getWearCounts(supabase: SupabaseClient): Promise<Map<number, number>> {
  const { data } = await supabase.from("outfit_pieces").select("piece_id");
  const counts = new Map<number, number>();
  for (const row of data ?? []) {
    const id = row.piece_id as number;
    counts.set(id, (counts.get(id) ?? 0) + 1);
  }
  return counts;
}
