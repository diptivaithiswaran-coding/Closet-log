import type { Category, Piece } from "./types";

export const PICK_SLOTS: { category: Category; label: string }[] = [
  { category: "top", label: "Top" },
  { category: "bottom", label: "Bottom" },
  { category: "shoes", label: "Shoes" },
];

// One random piece per slot. A slot with nothing in it comes back null.
// `random` is swappable so the result can be tested.
export function randomOutfit(pieces: Piece[], random: () => number = Math.random) {
  return PICK_SLOTS.map(({ category, label }) => {
    const options = pieces.filter((p) => p.category === category);
    const piece = options.length ? options[Math.floor(random() * options.length)] : null;
    return { category, label, piece, optionCount: options.length };
  });
}
