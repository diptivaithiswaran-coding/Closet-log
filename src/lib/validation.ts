import { CATEGORIES } from "./types";

export type PieceInput = {
  name: string | null;
  category: string | null;
  brand: string | null;
  color: string | null;
  price: number | null;
  purchased_on: string | null;
};

export type FieldErrors = Partial<Record<keyof PieceInput, string>>;

// Shared by the form (before sending) and the server (before saving),
// so the rules live in one place.
export function validatePiece(p: PieceInput): FieldErrors {
  const errors: FieldErrors = {};

  if (!p.name) errors.name = "Give this piece a name, like \"Black wide-leg trousers.\"";
  else if (p.name.length > 100) errors.name = "Keep the name under 100 characters.";

  if (!p.category) errors.category = "Pick a category so you can filter by it later.";
  else if (!(CATEGORIES as readonly string[]).includes(p.category)) errors.category = "Pick a category from the list.";

  if (p.price !== null && (Number.isNaN(p.price) || p.price < 0)) {
    errors.price = "Price should be a number, $0 or more.";
  }

  if (p.purchased_on) {
    const today = new Date().toISOString().slice(0, 10);
    if (p.purchased_on > today) errors.purchased_on = "The purchase date can't be in the future.";
  }

  return errors;
}

export function readPieceForm(formData: FormData): PieceInput {
  const text = (key: string) => {
    const v = String(formData.get(key) ?? "").trim();
    return v === "" ? null : v;
  };
  const priceText = text("price");
  return {
    name: text("name"),
    category: text("category"),
    brand: text("brand"),
    color: text("color"),
    price: priceText === null ? null : Number(priceText),
    purchased_on: text("purchased_on"),
  };
}
