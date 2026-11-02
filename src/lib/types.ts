export const CATEGORIES = [
  "top",
  "bottom",
  "dress",
  "outerwear",
  "shoes",
  "bag",
  "accessory",
] as const;

export type Category = (typeof CATEGORIES)[number];

export type Piece = {
  id: number;
  user_id: string;
  name: string;
  category: Category;
  brand: string | null;
  color: string | null;
  price: number | null;
  purchased_on: string | null;
  photo_url: string | null;
  created_at: string;
};
