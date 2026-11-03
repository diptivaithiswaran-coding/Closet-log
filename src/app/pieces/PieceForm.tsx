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
  submitLabel: string;
  cancelHref: string;
};

export default function PieceForm({ action, piece, submitLabel, cancelHref }: Props) {
  const [state, formAction, pending] = useActionState(action, {});
  const [clientErrors, setClientErrors] = useState<FieldErrors>({});
  const [category, setCategory] = useState<string>(piece?.category ?? "");

  // Errors from the browser check win; server errors are the backup.
  const errors: FieldErrors = { ...state.fieldErrors, ...clientErrors };
  const hasErrors = Object.keys(clientErrors).length > 0 || !!state.error;

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    const found = validatePiece(readPieceForm(new FormData(e.currentTarget)));
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

      <Field label="Worn before I started logging" error={errors.past_wears}>
        <input
          name="past_wears"
          type="number"
          inputMode="numeric"
          step="1"
          min="0"
          defaultValue={piece?.past_wears ?? 0}
          aria-invalid={!!errors.past_wears}
          aria-describedby="past-wears-hint"
          onChange={() => clearError("past_wears")}
        />
        <span id="past-wears-hint" className="muted small">
          Rough guess is fine. Outfits you log from now on get added on top.
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
