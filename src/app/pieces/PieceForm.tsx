"use client";

import Link from "next/link";
import { useActionState } from "react";
import { CATEGORIES, type Piece } from "@/lib/types";
import { capitalize } from "@/lib/format";
import type { PieceFormState } from "./actions";

type Props = {
  action: (prev: PieceFormState, formData: FormData) => Promise<PieceFormState>;
  piece?: Piece;
  submitLabel: string;
  cancelHref: string;
};

export default function PieceForm({ action, piece, submitLabel, cancelHref }: Props) {
  const [state, formAction, pending] = useActionState(action, {});

  return (
    <form action={formAction} className="card stack form">
      <label>
        Name
        <input name="name" defaultValue={piece?.name ?? ""} placeholder="e.g. Black wide-leg trousers" />
      </label>

      <label>
        Category
        <select name="category" defaultValue={piece?.category ?? ""}>
          <option value="">Pick one…</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{capitalize(c)}</option>
          ))}
        </select>
      </label>

      <div className="row">
        <label>
          Brand
          <input name="brand" defaultValue={piece?.brand ?? ""} placeholder="e.g. Aritzia" />
        </label>
        <label>
          Color
          <input name="color" defaultValue={piece?.color ?? ""} placeholder="e.g. Black" />
        </label>
      </div>

      <div className="row">
        <label>
          Price ($)
          <input name="price" type="number" step="0.01" min="0" defaultValue={piece?.price ?? ""} />
        </label>
        <label>
          Purchase date
          <input name="purchased_on" type="date" defaultValue={piece?.purchased_on ?? ""} />
        </label>
      </div>

      {state.error && <p className="error" role="alert">{state.error}</p>}

      <div className="actions">
        <button className="btn" disabled={pending}>{pending ? "Saving…" : submitLabel}</button>
        <Link href={cancelHref} className="btn btn-secondary">Cancel</Link>
      </div>
    </form>
  );
}
