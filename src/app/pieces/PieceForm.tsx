"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { CATEGORIES, type Piece } from "@/lib/types";
import { capitalize } from "@/lib/format";
import { readPieceForm, validatePiece, type FieldErrors } from "@/lib/validation";
import type { PieceFormState } from "./actions";
import PhotoPicker from "./PhotoPicker";

type Props = {
  action: (prev: PieceFormState, formData: FormData) => Promise<PieceFormState>;
  piece?: Piece;
  loggedWears?: number; // logged outfits this piece is already in
  submitLabel: string;
  cancelHref: string;
};

export default function PieceForm({ action, piece, loggedWears = 0, submitLabel, cancelHref }: Props) {
  const [state, formAction, pending] = useActionState(action, {});
  const [clientErrors, setClientErrors] = useState<FieldErrors>({});
  const [category, setCategory] = useState<string>(piece?.category ?? "");

  // Errors from the browser check win; server errors are the backup.
  const errors: FieldErrors = { ...state.fieldErrors, ...clientErrors };
  const hasErrors = Object.keys(clientErrors).length > 0 || !!state.error;

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    const found = validatePiece(readPieceForm(new FormData(e.currentTarget)), loggedWears);
    setClientErrors(found);
    if (Object.keys(found).length > 0) {
      e.preventDefault(); // stop here, keep what they typed
      const first = Object.keys(found)[0];
      e.currentTarget.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
    }
  }

  // Clear a field's message as soon as they start fixing it.
  function clearError(field: keyof FieldErrors) {
    if (clientErrors[field]) {
      const next = { ...clientErrors };
      delete next[field];
      setClientErrors(next);
    }
  }

  return (
    <form action={formAction} onSubmit={handleSubmit} className="card stack form" noValidate>
      {hasErrors && (
        <p className="error" role="alert">
          {Object.keys(clientErrors).length > 0
            ? "A couple of things need fixing before this can be saved."
            : state.error}
        </p>
      )}

      <PhotoPicker initialUrl={piece?.photo_url ?? null} />

      <Field label="Name" required error={errors.name}>
        <input
          name="name"
          defaultValue={piece?.name ?? ""}
          placeholder="e.g. Black wide-leg trousers"
          aria-invalid={!!errors.name}
          onChange={() => clearError("name")}
        />
      </Field>

      <Field label="Category" required error={errors.category}>
        <select
          name="category"
          defaultValue={piece?.category ?? ""}
          aria-invalid={!!errors.category}
          onChange={(e) => {
            setCategory(e.target.value);
            clearError("category");
          }}
        >
          <option value="">Pick one…</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{capitalize(c)}</option>
          ))}
        </select>
      </Field>

      {category === "other" && (
        <Field label="What is it?" required error={errors.category_other}>
          <input
            name="category_other"
            defaultValue={piece?.category_other ?? ""}
            placeholder="e.g. Swimsuit, saree, lehenga"
            maxLength={40}
            autoFocus={!piece}
            aria-invalid={!!errors.category_other}
            onChange={() => clearError("category_other")}
          />
        </Field>
      )}

      <div className="row">
        <Field label="Brand">
          <input name="brand" defaultValue={piece?.brand ?? ""} placeholder="e.g. Aritzia" />
        </Field>
        <Field label="Color">
          <input name="color" defaultValue={piece?.color ?? ""} placeholder="e.g. Black" />
        </Field>
      </div>

      <div className="row">
        <Field label="Price ($)" error={errors.price}>
          <input
            name="price"
            type="number"
            step="0.01"
            min="0"
            defaultValue={piece?.price ?? ""}
            aria-invalid={!!errors.price}
            onChange={() => clearError("price")}
          />
        </Field>
        <Field label="Purchase date" error={errors.purchased_on}>
          <input
            name="purchased_on"
            type="date"
            defaultValue={piece?.purchased_on ?? ""}
            aria-invalid={!!errors.purchased_on}
            onChange={() => clearError("purchased_on")}
          />
        </Field>
      </div>

      <Field label="Number of times worn" error={errors.times_worn}>
        <input
          name="times_worn"
          type="number"
          inputMode="numeric"
          step="1"
          min={loggedWears}
          defaultValue={(piece?.past_wears ?? 0) + loggedWears}
          aria-invalid={!!errors.times_worn}
          aria-describedby="times-worn-hint"
          onChange={() => clearError("times_worn")}
        />
        <span id="times-worn-hint" className="muted small">
          {loggedWears > 0
            ? `Includes ${loggedWears} logged ${loggedWears === 1 ? "outfit" : "outfits"}. A rough guess for the rest is fine.`
            : "A rough guess is fine. Each outfit you log adds 1."}
        </span>
      </Field>

      <div className="actions">
        <button className="btn" disabled={pending}>{pending ? "Saving…" : submitLabel}</button>
        <Link href={cancelHref} className="btn btn-secondary">Cancel</Link>
      </div>
    </form>
  );
}

function Field({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className={error ? "field has-error" : "field"}>
      <span>
        {label}
        {required && <span className="required"> *</span>}
      </span>
      {children}
      {error && <span className="field-error">{error}</span>}
    </label>
  );
}
