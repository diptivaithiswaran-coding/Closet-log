import type { Category } from "@/lib/types";

// A simple drawn garment for each category, shown when a piece has no photo.
// Plum outline, hot pink fill, tangerine details. Pure SVG.
const P = "#3b0a2a";
const F = "#ffc2d8";
const T = "#ff8a3d";
const s = { stroke: P, strokeWidth: 3, strokeLinejoin: "round" as const, strokeLinecap: "round" as const };

const shapes: Record<Category, React.ReactNode> = {
  top: (
    <path d="M 32 22 L 42 18 Q 50 26 58 18 L 68 22 L 82 38 L 72 46 L 66 40 L 66 82 L 34 82 L 34 40 L 28 46 L 18 38 Z" fill={F} {...s} />
  ),
  bottom: (
    <>
      <path d="M 30 18 L 70 18 L 76 84 L 56 84 L 50 40 L 44 84 L 24 84 Z" fill={F} {...s} />
      <line x1="30" x2="70" y1="27" y2="27" {...s} />
    </>
  ),
  dress: (
    <>
      <path d="M 40 16 L 42 26 M 60 16 L 58 26" {...s} />
      <path d="M 38 26 L 62 26 L 64 42 L 80 84 Q 50 92 20 84 L 36 42 Z" fill={F} {...s} />
      <path d="M 36 43 Q 50 50 64 43" fill="none" {...s} />
    </>
  ),
  jumpsuit: (
    <>
      <path d="M 40 14 L 42 26 M 60 14 L 58 26" {...s} />
      <path d="M 36 26 L 64 26 L 66 50 L 72 88 L 56 88 L 50 56 L 44 88 L 28 88 L 34 50 Z" fill={F} {...s} />
      <line x1="34" x2="66" y1="48" y2="48" stroke={T} strokeWidth="4" />
    </>
  ),
  romper: (
    <>
      <path d="M 36 22 L 44 18 Q 50 26 56 18 L 64 22 L 76 34 L 68 42 L 64 38 L 66 56 L 72 76 L 54 78 L 50 64 L 46 78 L 28 76 L 34 56 L 36 38 L 32 42 L 24 34 Z" fill={F} {...s} />
      <line x1="35" x2="65" y1="54" y2="54" stroke={T} strokeWidth="4" />
    </>
  ),
  outerwear: (
    <>
      <path d="M 34 20 L 44 16 L 50 30 L 56 16 L 66 20 L 80 34 L 84 80 L 72 80 L 68 46 L 68 84 L 32 84 L 32 46 L 28 80 L 16 80 L 20 34 Z" fill={F} {...s} />
      <line x1="50" x2="50" y1="30" y2="84" {...s} />
      <circle cx="56" cy="46" r="2.5" fill={T} />
      <circle cx="56" cy="60" r="2.5" fill={T} />
      <circle cx="56" cy="74" r="2.5" fill={T} />
    </>
  ),
  shoes: (
    <>
      <path d="M 22 74 L 24 58 L 30 58 L 30 74 Z" fill={P} />
      <path d="M 22 58 Q 38 46 54 62 L 72 66 Q 82 68 80 74 L 50 74 Q 42 62 22 62 Z" fill={F} {...s} />
    </>
  ),
  bag: (
    <>
      <path d="M 36 40 Q 36 20 50 20 Q 64 20 64 40" fill="none" {...s} />
      <path d="M 24 40 L 76 40 L 72 82 L 28 82 Z" fill={F} {...s} />
      <rect x="45" y="50" width="10" height="7" rx="1.5" fill={T} stroke={P} strokeWidth="2" />
    </>
  ),
  other: (
    <>
      <path d="M 50 28 V 22 a 6 6 0 1 1 6 -6" fill="none" {...s} />
      <path d="M 18 52 L 50 30 L 82 52 Z" fill="none" {...s} />
      <path d="M 40 66 Q 40 58 50 58 Q 60 58 60 66 Q 60 72 50 74 L 50 78" fill="none" stroke={T} strokeWidth="4.5" strokeLinecap="round" />
      <circle cx="50" cy="86" r="3" fill={T} />
    </>
  ),
  accessory: (
    <>
      <path d="M 30 28 Q 50 58 70 28" fill="none" {...s} />
      <circle cx="50" cy="64" r="10" fill={F} {...s} />
      <circle cx="50" cy="64" r="4" fill={T} />
    </>
  ),
};

export default function CategoryIcon({ category, size = 72 }: { category: Category; size?: number }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} aria-hidden="true" className="cat-icon">
      {shapes[category] ?? shapes.top}
    </svg>
  );
}
