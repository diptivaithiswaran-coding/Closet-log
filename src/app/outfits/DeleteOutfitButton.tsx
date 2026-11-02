"use client";

import { useTransition } from "react";
import { deleteOutfit } from "./actions";

export default function DeleteOutfitButton({ id }: { id: number }) {
  const [pending, startTransition] = useTransition();
  return (
    <button
      type="button"
      className="btn btn-danger"
      disabled={pending}
      onClick={() => {
        if (!window.confirm("Are you sure you want to delete this outfit? The pieces stay in your closet.")) return;
        startTransition(() => deleteOutfit(id));
      }}
    >
      {pending ? "Deleting…" : "Delete outfit"}
    </button>
  );
}
