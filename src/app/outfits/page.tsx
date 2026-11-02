import Link from "next/link";
import { requireUser } from "@/lib/auth";
import type { OutfitWithPieces } from "@/lib/types";
import { capitalize, niceDate } from "@/lib/format";
import Header from "../Header";

export default async function OutfitsPage() {
  const { supabase, user } = await requireUser();
  const { data } = await supabase
    .from("outfits")
    .select("*, pieces(*)")
    .order("worn_on", { ascending: false })
    .order("created_at", { ascending: false });
  const outfits = (data ?? []) as OutfitWithPieces[];

  return (
    <>
      <Header email={user.email ?? ""} />
      <main className="page">
        <div className="page-head">
          <div>
            <h1>Outfits</h1>
            <p className="muted">{outfits.length} logged</p>
          </div>
          <Link href="/outfits/new" className="btn">+ Log outfit</Link>
        </div>

        {outfits.length === 0 ? (
          <div className="empty card">
            <h2>No outfits yet</h2>
            <p className="muted">Log what you wore today. It's how the app counts wears and cost-per-wear.</p>
            <Link href="/outfits/new" className="btn">+ Log outfit</Link>
          </div>
        ) : (
          <ul className="outfit-list">
            {outfits.map((o) => (
              <li key={o.id}>
                <Link href={`/outfits/${o.id}`} className="outfit-row card">
                  <div className="outfit-when">
                    <strong>{niceDate(o.worn_on)}</strong>
                    <span className="muted small">{o.occasion ?? "—"}</span>
                  </div>
                  <div className="thumbs">
                    {o.pieces.slice(0, 5).map((p) => (
                      <span key={p.id} className="thumb" title={p.name}>
                        {p.photo_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={p.photo_url} alt={p.name} />
                        ) : (
                          capitalize(p.category).slice(0, 1)
                        )}
                      </span>
                    ))}
                    {o.pieces.length > 5 && <span className="muted small">+{o.pieces.length - 5}</span>}
                  </div>
                  <span className="muted small outfit-names">{o.pieces.map((p) => p.name).join(", ")}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>
    </>
  );
}
