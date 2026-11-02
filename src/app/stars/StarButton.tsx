"use client";

import { useOptimistic, useTransition } from "react";
import { toggleStar } from "./actions";

type Props = { pieceId: number; starred: boolean; variant?: "overlay" | "inline" };

export default function StarButton({ pieceId, starred, variant = "overlay" }: Props) {
  const [, startTransition] = useTransition();
  // Flip the star right away; the server catches up a moment later.
  const [shown, setShown] = useOptimistic(starred);

  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    startTransition(async () => {
      setShown(!shown);
      await toggleStar(pieceId, shown);
    });
  }

  const label = shown ? "Unstar" : "Star";
  return (
    <button
      type="button"
      onClick={handleClick}
      className={`star star-${variant}${shown ? " on" : ""}`}
      aria-pressed={shown}
      aria-label={label}
      title={label}
    >
      <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
        <path d="M12 3.5l2.6 5.3 5.9.9-4.25 4.1 1 5.85L12 16.9l-5.25 2.75 1-5.85L3.5 9.7l5.9-.9z" />
      </svg>
      {variant === "inline" && <span>{shown ? "Starred" : "Star"}</span>}
    </button>
  );
}
