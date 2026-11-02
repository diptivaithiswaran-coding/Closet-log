import { CATEGORIES, type Category, type Piece } from "./types";

export const SORTS = {
  newest: "Newest first",
  "most-worn": "Most worn",
  "price-high": "Price: high to low",
  "price-low": "Price: low to high",
} as const;

export type SortKey = keyof typeof SORTS;

export type FindOptions = {
  q: string;
  category: Category | "";
  sort: SortKey;
};

// Turn the page's ?q=&category=&sort= into safe options.
export function readFindParams(params: Record<string, string | string[] | undefined>): FindOptions {
  const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";
  const category = one(params.category);
  const sort = one(params.sort);
  return {
    q: one(params.q).trim(),
    category: (CATEGORIES as readonly string[]).includes(category) ? (category as Category) : "",
    sort: sort in SORTS ? (sort as SortKey) : "newest",
  };
}

// Search by name or brand, filter by category, then sort.
// wearCounts maps piece id -> number of outfits it's in.
export function findPieces(pieces: Piece[], wearCounts: Map<number, number>, opts: FindOptions): Piece[] {
  const q = opts.q.toLowerCase();

  const matches = pieces.filter((p) => {
    if (opts.category && p.category !== opts.category) return false;
    if (!q) return true;
    return p.name.toLowerCase().includes(q) || (p.brand ?? "").toLowerCase().includes(q);
  });

  const newest = (a: Piece, b: Piece) => b.created_at.localeCompare(a.created_at);
  const price = (p: Piece) => (p.price === null ? null : Number(p.price));

  return [...matches].sort((a, b) => {
    switch (opts.sort) {
      case "most-worn":
        return (wearCounts.get(b.id) ?? 0) - (wearCounts.get(a.id) ?? 0) || newest(a, b);
      case "price-high":
      case "price-low": {
        const pa = price(a);
        const pb = price(b);
        // Pieces with no price always go last.
        if (pa === null && pb === null) return newest(a, b);
        if (pa === null) return 1;
        if (pb === null) return -1;
        return (opts.sort === "price-high" ? pb - pa : pa - pb) || newest(a, b);
      }
      default:
        return newest(a, b);
    }
  });
}
