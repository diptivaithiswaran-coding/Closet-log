import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Header from "./Header";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return (
    <>
      <Header email={user.email ?? ""} />
      <main className="page">
        <h1>My closet</h1>
        <p className="muted">You're logged in. Your pieces will show up here.</p>
      </main>
    </>
  );
}
