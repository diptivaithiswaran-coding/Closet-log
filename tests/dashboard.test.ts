import { describe, expect, it } from "vitest";
import { computeStats, costPerWear } from "@/lib/stats";
import { money } from "@/lib/format";
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
});
