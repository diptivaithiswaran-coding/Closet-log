"use client";

import Link from "next/link";
import { useActionState, useEffect, useState } from "react";
import type { Piece } from "@/lib/types";
import { randomOutfit } from "@/lib/pick";
import { capitalize } from "@/lib/format";
import { createOutfit, type OutfitFormState } from "../outfits/actions";

export default function Picker({ pieces }: { pieces: Piece[] }) {
  // Start empty and pick in the browser, so the first pick isn't fixed by the server render.
  const [slots, setSlots] = useState<ReturnType<typeof randomOutfit> | null>(null);
  const [today, setToday] = useState("");
  const [state, formAction, pending] = useActionState<OutfitFormState, FormData>(createOutfit, {});

  useEffect(() => {
    setSlots(randomOutfit(pieces));
    setToday(new Date().toLocaleDateString("en-CA"));
  }, [pieces]);

  if (!slots) return <div className="pick-row" aria-busy="true" />;

  const picked = slots.filter((s) => s.piece);
  const missing = slots.filter((s) => !s.piece);

  return (
    <>
      <div className="pick-row">
        {slots.map((s) => (
          <div key={s.category} className="pick-slot">
            <p className="eyebrow">{s.label}</p>
            {s.piece ? (
              <Link href={`/pieces/${s.piece.id}`} className="piece-card">
                <div className="photo">
                  {s.piece.photo_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={s.piece.photo_url} alt={s.piece.name} />
                  ) : (
                    <span className="photo-empty">{capitalize(s.piece.category)}</span>
                  )}
                </div>
                <p className="piece-name" style={{ marginTop: "0.5rem" }}>{s.piece.name}</p>
              </Link>
            ) : (
              <div className="photo pick-missing">
                <span className="muted small">No {s.label.toLowerCase()} yet.<br /><Link href="/pieces/new">Add one</Link></span>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="actions pick-actions">
        <button type="button" className="btn" onClick={() => setSlots(randomOutfit(pieces))}>
          🎲 Shuffle
        </button>
        {picked.length > 0 && (
          <form action={formAction}>
            <input type="hidden" name="worn_on" value={today} />
            <input type="hidden" name="occasion" value="Random pick" />
            {picked.map((s) => <input key={s.piece!.id} type="hidden" name="piece_ids" value={s.piece!.id} />)}
            <button className="btn btn-secondary" disabled={pending || !today}>
              {pending ? "Saving…" : "Wear this today"}
            </button>
          </form>
        )}
      </div>
      {state.error && <p className="error" role="alert" style={{ marginTop: "1rem" }}>{state.error}</p>}
      {missing.length > 0 && picked.length > 0 && (
        <p className="muted small" style={{ marginTop: "1rem" }}>
          Add a {missing.map((m) => m.label.toLowerCase()).join(" and ")} to get a full outfit.
        </p>
      )}
    </>
  );
}
