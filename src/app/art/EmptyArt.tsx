// Small drawings for empty pages. Pure SVG, palette colors only.
const P = "#3b0a2a";
const H = "#e8337a";
const F = "#ffc2d8";
const T = "#ff8a3d";
const s = { stroke: P, strokeWidth: 4, strokeLinejoin: "round" as const, strokeLinecap: "round" as const };

function Hanger({ x, tilt = 0 }: { x: number; tilt?: number }) {
  return (
    <g transform={`rotate(${tilt} ${x} 40)`}>
      <path d={`M ${x} 52 V 44 a 7 7 0 1 1 7 -7`} fill="none" {...s} strokeWidth={3.5} />
      <path d={`M ${x - 24} 70 L ${x} 50 L ${x + 24} 70 Z`} fill="none" {...s} strokeWidth={3.5} />
    </g>
  );
}

function Sparkle({ x, y, r, fill }: { x: number; y: number; r: number; fill: string }) {
  const k = r * 0.28;
  return (
    <path
      d={`M ${x} ${y - r} Q ${x + k} ${y - k} ${x + r} ${y} Q ${x + k} ${y + k} ${x} ${y + r} Q ${x - k} ${y + k} ${x - r} ${y} Q ${x - k} ${y - k} ${x} ${y - r} Z`}
      fill={fill}
    />
  );
}

const art = {
  // empty rail with swinging hangers
  closet: (
    <>
      <rect x="20" y="30" width="200" height="8" rx="4" fill={P} />
      <Hanger x={64} tilt={-6} />
      <Hanger x={120} />
      <Hanger x={176} tilt={8} />
      <Sparkle x={210} y={92} r={10} fill={T} />
      <Sparkle x={34} y={100} r={7} fill={H} />
    </>
  ),
  // a tee and trousers waiting to be paired
  outfits: (
    <>
      <path d="M 62 34 L 76 28 Q 90 40 104 28 L 118 34 L 134 52 L 122 62 L 114 54 L 114 110 L 66 110 L 66 54 L 58 62 L 46 52 Z" fill={F} {...s} />
      <path d="M 134 40 L 182 40 L 190 120 L 166 120 L 158 72 L 150 120 L 126 120 Z" fill={P} {...s} />
      <path d="M 150 22 l 0 10 M 145 27 l 10 0" stroke={T} strokeWidth="4" strokeLinecap="round" />
      <Sparkle x={36} y={104} r={8} fill={T} />
    </>
  ),
  // a big outlined star on a hanger
  starred: (
    <>
      <g transform="translate(120 0) scale(0.72) translate(-120 0)">
        <path d="M 120 30 V 22 a 7 7 0 1 1 7 -7" fill="none" {...s} strokeWidth={4.5} />
        <path d="M 120 32 l 18 36 40 6 -29 28 7 40 -36 -19 -36 19 7 -40 -29 -28 40 -6 z" fill={F} {...s} strokeWidth={5} />
      </g>
      <Sparkle x={196} y={40} r={10} fill={H} />
      <Sparkle x={44} y={96} r={8} fill={T} />
    </>
  ),
  // magnifying glass over a folded tee
  search: (
    <>
      <path d="M 70 70 L 150 70 L 150 118 L 70 118 Z" fill={F} {...s} />
      <path d="M 70 86 L 150 86" {...s} strokeWidth={3} />
      <circle cx="150" cy="58" r="30" fill="#fff" {...s} />
      <line x1="171" y1="79" x2="194" y2="102" {...s} strokeWidth={8} />
      <Sparkle x={150} y={58} r={10} fill={T} />
    </>
  ),
};

export type EmptyKind = keyof typeof art;

export default function EmptyArt({ kind }: { kind: EmptyKind }) {
  return (
    <svg viewBox="0 0 240 130" className="empty-art" aria-hidden="true">
      {art[kind]}
    </svg>
  );
}
