"use client";

import { useTransition } from "react";
import { deletePiece } from "../actions";

export default function DeleteButton({ id, name }: { id: number; name: string }) {
  const [pending, startTransition] = useTransition();

  function handleClick() {
    if (!window.confirm(`Are you sure you want to delete "${name}"? This can't be undone.`)) return;
    startTransition(() => deletePiece(id));
  }

  return (
    <button type="button" className="btn btn-danger" onClick={handleClick} disabled={pending}>
      {pending ? "Deleting…" : "Delete"}
    </button>
  );
}
