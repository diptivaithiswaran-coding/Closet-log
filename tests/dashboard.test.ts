import { describe, expect, it } from "vitest";
import { computeStats, costPerWear } from "@/lib/stats";
import { money } from "@/lib/format";
import { combineWears } from "@/lib/wears";
import { toPieceRow } from "@/lib/validation";
import type { Piece } from "@/lib/types";

// A made-up piece. Only id and price matter for this test.
function piece(id: number, price: number | null): Piece {
  return {
    id,
    user_id: "test-user",
    name: `Piece ${id}`,
    category: "top",
    category_other: null,
    brand: null,
    color: null,
    price,
    purchased_on: null,
    photo_url: null,
    past_wears: 0,
    created_at: "2026-11-01T00:00:00Z",
  };
}

describe("Dashboard: cost-per-wear", () => {
  it("Given a $120 piece in 4 outfits, when the dashboard loads, then its cost-per-wear shows $30.00", () => {
    // Given: one piece that cost $120, worn in 4 outfits
    const jacket = piece(1, 120);
    const wearCounts = new Map([[jacket.id, 4]]);

    // When: the dashboard works out its stats (same function the page uses)
    const stats = computeStats([jacket], wearCounts, 4);
    const row = stats.perPiece.find((p) => p.piece.id === jacket.id)!;

    // Then: it shows $30.00, and the average (only one piece) is $30.00 too
    expect(money(row.costPerWear)).toBe("$30.00");
    expect(money(stats.avgCostPerWear)).toBe("$30.00");
  });

  it("leaves out pieces that haven't been worn, instead of dividing by zero", () => {
    expect(costPerWear(50, 0)).toBeNull();
    const stats = computeStats([piece(1, 120), piece(2, 50)], new Map([[1, 4]]), 4);
    expect(money(stats.avgCostPerWear)).toBe("$30.00");
  });

  it("Given a $120 piece with 2 past wears and 2 logged outfits, when the dashboard loads, then its cost-per-wear shows $30.00", () => {
    // Given: a $120 piece I wore twice before using the app, plus 2 logged outfits
    const jacket = { ...piece(1, 120), past_wears: 2 };
    const loggedOutfits = [{ piece_id: 1 }, { piece_id: 1 }];

    // When: the dashboard adds up wears and works out its stats
    const wearCounts = combineWears([jacket], loggedOutfits);
    const stats = computeStats([jacket], wearCounts, loggedOutfits.length);
    const row = stats.perPiece.find((p) => p.piece.id === jacket.id)!;

    // Then: 4 wears total, $120 / 4 = $30.00
    expect(row.wears).toBe(4);
    expect(money(row.costPerWear)).toBe("$30.00");
  });

  it("saves only the extra wears when I type a total on the edit form", () => {
    // I type 4 total; 2 are already logged outfits, so 2 get saved as past wears.
    const form = {
      name: "Jacket", category: "outerwear", category_other: null, brand: null, color: null,
      price: 120, purchased_on: null, photo_url: null, times_worn: 4,
    };
    expect(toPieceRow(form, 2).past_wears).toBe(2);
  });
});
