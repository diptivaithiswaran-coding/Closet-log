export const CATEGORIES = [
  "top",
  "bottom",
  "dress",
  "jumpsuit",
  "romper",
  "outerwear",
  "shoes",
  "bag",
  "accessory",
  "other",
] as const;

export type Category = (typeof CATEGORIES)[number];

export type Piece = {
  id: number;
  user_id: string;
  name: string;
  category: Category;
  category_other: string | null; // what the user typed when category is "other"
  brand: string | null;
  color: string | null;
  price: number | null;
  purchased_on: string | null;
  photo_url: string | null;
  past_wears: number; // worn before I started logging outfits
  created_at: string;
};

export type Outfit = {
  id: number;
  user_id: string;
  worn_on: string;
  occasion: string | null;
  notes: string | null;
  created_at: string;
};

// An outfit with the pieces in it, as returned by
// .select("*, pieces(*)") through the outfit_pieces junction table.
export type OutfitWithPieces = Outfit & { pieces: Piece[] };

// What to show for a piece's category: the typed-in text for "other",
// otherwise the category with a capital letter.
export function categoryLabel(piece: Pick<Piece, "category" | "category_other">): string {
  if (piece.category === "other" && piece.category_other) return piece.category_other;
  return piece.category.charAt(0).toUpperCase() + piece.category.slice(1);
}
