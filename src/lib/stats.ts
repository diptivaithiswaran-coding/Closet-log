import type { Piece } from "./types";

// Cost-per-wear = price ÷ number of outfits the piece appears in.
// Returns null if the piece has no price or hasn't been worn yet.
export function costPerWear(price: number | null, wears: number): number | null {
  if (price === null || price === undefined || wears <= 0) return null;
  return Math.round((Number(price) / wears) * 100) / 100;
}

export type DashboardStats = {
  totalPieces: number;
  totalOutfits: number;
  avgCostPerWear: number | null; // across pieces that have a price and have been worn
  mostWorn: { piece: Piece; wears: number } | null;
  perPiece: { piece: Piece; wears: number; costPerWear: number | null }[];
};

export function computeStats(
  pieces: Piece[],
  wearCounts: Map<number, number>,
  totalOutfits: number
): DashboardStats {
  const perPiece = pieces.map((piece) => {
    const wears = wearCounts.get(piece.id) ?? 0;
    return { piece, wears, costPerWear: costPerWear(piece.price, wears) };
  });

  const cpws = perPiece.map((p) => p.costPerWear).filter((c): c is number => c !== null);
  const avgCostPerWear = cpws.length
    ? Math.round((cpws.reduce((a, b) => a + b, 0) / cpws.length) * 100) / 100
    : null;

  let mostWorn: DashboardStats["mostWorn"] = null;
  for (const p of perPiece) {
    if (p.wears > 0 && (!mostWorn || p.wears > mostWorn.wears)) mostWorn = { piece: p.piece, wears: p.wears };
  }

  return { totalPieces: pieces.length, totalOutfits, avgCostPerWear, mostWorn, perPiece };
}

// Monday (YYYY-MM-DD) of the week a date falls in.
function weekStart(isoDate: string): string {
  const d = new Date(`${isoDate.slice(0, 10)}T12:00:00Z`);
  const day = d.getUTCDay(); // 0 = Sunday
  d.setUTCDate(d.getUTCDate() - ((day + 6) % 7));
  return d.toISOString().slice(0, 10);
}

// Outfits logged per week for the last `weeks` weeks, oldest first.
// Weeks with no outfits show as 0 so the chart has no gaps.
export function outfitsPerWeek(wornOn: string[], today: string, weeks = 8) {
  const counts = new Map<string, number>();
  for (const d of wornOn) {
    const w = weekStart(d);
    counts.set(w, (counts.get(w) ?? 0) + 1);
  }
  const result: { week: string; label: string; count: number }[] = [];
  const current = new Date(`${weekStart(today)}T12:00:00Z`);
  for (let i = weeks - 1; i >= 0; i--) {
    const d = new Date(current);
    d.setUTCDate(d.getUTCDate() - i * 7);
    const week = d.toISOString().slice(0, 10);
    const label = d.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
    result.push({ week, label, count: counts.get(week) ?? 0 });
  }
  return result;
}

// Outfits logged per month for one year, Jan → Dec.
export function outfitsPerMonth(wornOn: string[], year: number) {
  const counts = new Array(12).fill(0);
  for (const d of wornOn) {
    if (Number(d.slice(0, 4)) === year) counts[Number(d.slice(5, 7)) - 1] += 1;
  }
  return counts.map((count, i) => ({
    week: `${year}-${String(i + 1).padStart(2, "0")}`,
    label: new Date(Date.UTC(year, i, 15)).toLocaleDateString("en-US", { month: "short", timeZone: "UTC" }),
    count,
  }));
}

// Years that have at least one outfit, newest first, always including this year.
export function outfitYears(wornOn: string[], thisYear: number): number[] {
  const years = new Set<number>([thisYear]);
  for (const d of wornOn) years.add(Number(d.slice(0, 4)));
  return [...years].sort((a, b) => b - a);
}
