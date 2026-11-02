"use client";

import Link from "next/link";
import { useActionState, useEffect, useState } from "react";
import { CATEGORIES, type Piece } from "@/lib/types";
import { capitalize } from "@/lib/format";
import { readOutfitForm, validateOutfit, type OutfitErrors } from "@/lib/validation";
import type { OutfitFormState } from "./actions";

type Props = {
  action: (prev: OutfitFormState, formData: FormData) => Promise<OutfitFormState>;
  pieces: Piece[];
};

export default function OutfitForm({ action, pieces }: Props) {
  const [state, formAction, pending] = useActionState(action, {});
  const [clientErrors, setClientErrors] = useState<OutfitErrors>({});
  const [picked, setPicked] = useState<Set<number>>(new Set());
  const [filter, setFilter] = useState<string>("all");

  const errors: OutfitErrors = { ...state.fieldErrors, ...clientErrors };
  // "Today" in the user's own time zone. Worked out in the browser, because the
  // server runs on UTC and would say it's tomorrow on a late-night log.
  const [today, setToday] = useState("");
  useEffect(() => setToday(new Date().toLocaleDateString("en-CA")), []);

  function toggle(id: number) {
    const next = new Set(picked);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setPicked(next);
    if (clientErrors.piece_ids) setClientErrors({ ...clientErrors, piece_ids: undefined });
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    const found = validateOutfit(readOutfitForm(new FormData(e.currentTarget)));
    // drop empty keys
    Object.keys(found).forEach((k) => found[k as keyof OutfitErrors] === undefined && delete found[k as keyof OutfitErrors]);
    setClientErrors(found);
    if (Object.keys(found).length > 0) e.preventDefault();
  }

  const shown = filter === "all" ? pieces : pieces.filter((p) => p.category === filter);
  const usedCategories = CATEGORIES.filter((c) => pieces.some((p) => p.category === c));
  const hasClientErrors = Object.values(clientErrors).some(Boolean);

  return (
    <form action={formAction} onSubmit={handleSubmit} className="card stack form" noValidate>
      {(hasClientErrors || state.error) && (
        <p className="error" role="alert">
          {hasClientErrors ? "A couple of things need fixing before this can be saved." : state.error}
        </p>
      )}

      <div className="row">
        <label className={errors.worn_on ? "field has-error" : "field"}>
          <span>Date worn<span className="required"> *</span></span>
          <input key={today} name="worn_on" type="date" defaultValue={today} max={today || undefined} />
          {errors.worn_on && <span className="field-error">{errors.worn_on}</span>}
        </label>
        <label className={errors.occasion ? "field has-error" : "field"}>
          <span>Occasion</span>
          <input name="occasion" placeholder="e.g. Class, dinner, BFFF event" />
          {errors.occasion && <span className="field-error">{errors.occasion}</span>}
        </label>
      </div>

      <fieldset className={errors.piece_ids ? "picker has-error" : "picker"}>
        <legend>
          What did you wear?<span className="required"> *</span>
          <span className="muted small"> {picked.size} picked</span>
        </legend>

        {pieces.length === 0 ? (
          <p className="muted">
            You don't have any pieces yet. <Link href="/pieces/new">Add a piece</Link> first.
          </p>
        ) : (
          <>
            <div className="chips">
              <button type="button" className={filter === "all" ? "chip on" : "chip"} onClick={() => setFilter("all")}>All</button>
              {usedCategories.map((c) => (
                <button key={c} type="button" className={filter === c ? "chip on" : "chip"} onClick={() => setFilter(c)}>
                  {capitalize(c)}
                </button>
              ))}
            </div>
            <div className="pick-grid">
              {shown.map((p) => (
                <label key={p.id} className={picked.has(p.id) ? "pick on" : "pick"}>
                  <input
                    type="checkbox"
                    name="piece_ids"
                    value={p.id}
                    checked={picked.has(p.id)}
                    onChange={() => toggle(p.id)}
                  />
                  <span className="photo">
                    {p.photo_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={p.photo_url} alt="" />
                    ) : (
                      <span className="photo-empty">{capitalize(p.category)}</span>
                    )}
                  </span>
                  <span className="pick-name">{p.name}</span>
                </label>
              ))}
            </div>
            {/* keep picks from other categories in the form when filtered */}
            {[...picked]
              .filter((id) => !shown.some((p) => p.id === id))
              .map((id) => <input key={id} type="hidden" name="piece_ids" value={id} />)}
          </>
        )}
        {errors.piece_ids && <span className="field-error">{errors.piece_ids}</span>}
      </fieldset>

      <label className="field">
        <span>Notes</span>
        <textarea name="notes" rows={2} placeholder="Anything to remember about this look?" />
      </label>

      <div className="actions">
        <button className="btn" disabled={pending}>{pending ? "Saving…" : "Save outfit"}</button>
        <Link href="/outfits" className="btn btn-secondary">Cancel</Link>
      </div>
    </form>
  );
}
