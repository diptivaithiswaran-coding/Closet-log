import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

// Use on any private page: returns the Supabase client and the logged-in user,
// or sends the visitor to /login.
export async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  return { supabase, user };
}
