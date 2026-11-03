import { CATEGORIES } from "./types";

export type PieceInput = {
  name: string | null;
  category: string | null;
  category_other: string | null;
  brand: string | null;
  color: string | null;
  price: number | null;
  purchased_on: string | null;
  photo_url: string | null;
  past_wears: number;
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
  else if (p.category === "other") {
    if (!p.category_other) errors.category_other = "Tell us what it is, like \"Swimsuit\" or \"Saree.\"";
    else if (p.category_other.length > 40) errors.category_other = "Keep this under 40 characters.";
  }

  if (p.price !== null && (Number.isNaN(p.price) || p.price < 0)) {
    errors.price = "Price should be a number, $0 or more.";
  }

  if (!Number.isInteger(p.past_wears) || p.past_wears < 0) {
    errors.past_wears = "Use a whole number, 0 or more.";
  } else if (p.past_wears > 9999) {
    errors.past_wears = "That's a lot of wears. Keep it under 10,000.";
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
  const pastText = text("past_wears");
  return {
    name: text("name"),
    category: text("category"),
    // Only keep the typed-in text when "other" is picked.
    category_other: text("category") === "other" ? text("category_other") : null,
    brand: text("brand"),
    color: text("color"),
    price: priceText === null ? null : Number(priceText),
    purchased_on: text("purchased_on"),
    photo_url: text("photo_url"),
    past_wears: pastText === null ? 0 : Number(pastText),
  };
}

export type OutfitInput = {
  worn_on: string | null;
  occasion: string | null;
  notes: string | null;
  piece_ids: number[];
};

export type OutfitErrors = Partial<Record<keyof OutfitInput, string>>;

export function validateOutfit(o: OutfitInput): OutfitErrors {
  const errors: OutfitErrors = {};
  if (!o.worn_on) errors.worn_on = "Pick the day you wore this.";
  else {
    const today = new Date().toISOString().slice(0, 10);
    if (o.worn_on > today) errors.worn_on = "You can't log an outfit for a day that hasn't happened yet.";
  }
  if (o.piece_ids.length === 0) errors.piece_ids = "Pick at least one piece you wore.";
  if (o.occasion && o.occasion.length > 80) errors.occasion = "Keep the occasion under 80 characters.";
  return errors;
}

export function readOutfitForm(formData: FormData): OutfitInput {
  const text = (key: string) => {
    const v = String(formData.get(key) ?? "").trim();
    return v === "" ? null : v;
  };
  return {
    worn_on: text("worn_on"),
    occasion: text("occasion"),
    notes: text("notes"),
    piece_ids: formData.getAll("piece_ids").map(Number).filter((n) => Number.isFinite(n)),
  };
}
