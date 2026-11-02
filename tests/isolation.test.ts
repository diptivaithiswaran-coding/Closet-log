import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// This test talks to the real Supabase database, the same one the live app uses,
// with the same public key. It signs up two brand-new users each run.
const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

function newClient() {
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

async function signUpNewUser(label: string): Promise<SupabaseClient> {
  const client = newClient();
  const email = `closetlog.test+${label}-${Date.now()}-${Math.floor(Math.random() * 1e6)}@gmail.com`;
  const { data, error } = await client.auth.signUp({ email, password: "test-password-123" });
  if (error) throw new Error(`Sign-up for User ${label} failed: ${error.message}`);
  if (!data.session) throw new Error("Sign-up worked but didn't log in. Is 'Confirm email' turned off in Supabase?");
  return client;
}

describe("Data isolation: User B can't see User A's data", () => {
  let userA: SupabaseClient;
  let userB: SupabaseClient;
  let pieceId: number;

  beforeAll(async () => {
    // Given: User A signs up and adds a piece
    userA = await signUpNewUser("a");
    const { data, error } = await userA
      .from("pieces")
      .insert({ name: "User A's secret jacket", category: "outerwear", price: 120 })
      .select("id")
      .single();
    if (error) throw new Error(`User A couldn't add a piece: ${error.message}`);
    pieceId = data.id;

    // When: User B signs up and logs in
    userB = await signUpNewUser("b");
  });

  afterAll(async () => {
    // Clean up User A's test piece.
    if (pieceId) await userA.from("pieces").delete().eq("id", pieceId);
  });

  it("User A can see their own piece (so we know the piece really exists)", async () => {
    const { data } = await userA.from("pieces").select("id, name").eq("id", pieceId).maybeSingle();
    expect(data?.name).toBe("User A's secret jacket");
  });

  it("User B's closet is empty", async () => {
    // Same query the closet page runs.
    const { data, error } = await userB.from("pieces").select("*");
    expect(error).toBeNull();
    expect(data).toEqual([]);
  });

  it("User B opening User A's piece gets nothing back (the page shows 'not found')", async () => {
    // Same query the piece page runs. When it returns null, the page shows a 404.
    const { data } = await userB.from("pieces").select("*").eq("id", pieceId).maybeSingle();
    expect(data).toBeNull();
  });

  it("User B can't edit User A's piece", async () => {
    await userB.from("pieces").update({ name: "Hacked" }).eq("id", pieceId);
    const { data } = await userA.from("pieces").select("name").eq("id", pieceId).single();
    expect(data?.name).toBe("User A's secret jacket");
  });
});
