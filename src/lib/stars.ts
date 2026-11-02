import type { SupabaseClient } from "@supabase/supabase-js";

// The ids of every piece the logged-in user has starred.
export async function getStarredIds(supabase: SupabaseClient): Promise<Set<number>> {
  const { data } = await supabase.from("stars").select("piece_id");
  return new Set((data ?? []).map((r) => r.piece_id as number));
}
