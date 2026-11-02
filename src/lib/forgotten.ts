import type { Piece } from "./types";

export type ForgottenPiece = { piece: Piece; lastWorn: string | null; daysSince: number };

function daysBetween(from: string, to: string) {
  const a = Date.parse(`${from.slice(0, 10)}T12:00:00Z`);
  const b = Date.parse(`${to.slice(0, 10)}T12:00:00Z`);
  return Math.round((b - a) / 86_400_000);
}

// lastWorn maps piece id -> the most recent date it was worn (YYYY-MM-DD).
// Returns two lists:
//  - notWorn: worn before, but not in the last `days` days (longest-forgotten first)
//  - neverWorn: never been in an outfit (oldest in the closet first)
export function findForgotten(pieces: Piece[], lastWorn: Map<number, string>, today: string, days = 30) {
  const notWorn: ForgottenPiece[] = [];
  const neverWorn: ForgottenPiece[] = [];

  for (const piece of pieces) {
    const last = lastWorn.get(piece.id) ?? null;
    if (last) {
      const since = daysBetween(last, today);
      if (since >= days) notWorn.push({ piece, lastWorn: last, daysSince: since });
    } else {
      const added = piece.purchased_on ?? piece.created_at;
      neverWorn.push({ piece, lastWorn: null, daysSince: Math.max(0, daysBetween(added, today)) });
    }
  }

  notWorn.sort((a, b) => b.daysSince - a.daysSince);
  neverWorn.sort((a, b) => b.daysSince - a.daysSince);
  return { notWorn, neverWorn };
}
