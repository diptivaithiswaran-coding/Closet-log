import type { SupabaseClient } from "@supabase/supabase-js";

// Total wears for each of the logged-in user's pieces:
// times worn before logging (past_wears) + logged outfits the piece is in.
export async function getWearCounts(supabase: SupabaseClient): Promise<Map<number, number>> {
  const [{ data: pieces }, { data: links }] = await Promise.all([
    supabase.from("pieces").select("id, past_wears"),
    supabase.from("outfit_pieces").select("piece_id"),
  ]);
  const counts = new Map<number, number>();
  for (const p of pieces ?? []) counts.set(p.id as number, (p.past_wears as number) ?? 0);
  for (const row of links ?? []) {
    const id = row.piece_id as number;
    counts.set(id, (counts.get(id) ?? 0) + 1);
  }
  return counts;
}
