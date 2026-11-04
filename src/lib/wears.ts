import type { SupabaseClient } from "@supabase/supabase-js";

// Total wears per piece = past wears (typed in) + logged outfits that include it.
// Kept separate from the database call so the dashboard test can check the math.
export function combineWears(
  pieces: { id: number; past_wears: number | null }[],
  links: { piece_id: number }[]
): Map<number, number> {
  const counts = new Map<number, number>();
  for (const p of pieces) counts.set(p.id, p.past_wears ?? 0);
  for (const l of links) counts.set(l.piece_id, (counts.get(l.piece_id) ?? 0) + 1);
  return counts;
}

// Total wears for each of the logged-in user's pieces.
export async function getWearCounts(supabase: SupabaseClient): Promise<Map<number, number>> {
  const [{ data: pieces }, { data: links }] = await Promise.all([
    supabase.from("pieces").select("id, past_wears"),
    supabase.from("outfit_pieces").select("piece_id"),
  ]);
  return combineWears(
    (pieces ?? []) as { id: number; past_wears: number | null }[],
    (links ?? []) as { piece_id: number }[]
  );
}
