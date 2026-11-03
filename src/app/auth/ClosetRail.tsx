// Hand-drawn clothes rail for the login / sign-up page.
// Pure SVG, no images to load. Colors come from the hot pink palette.

const PLUM = "#3b0a2a";
const TANGERINE = "#ff8a3d";
const BLUSH = "#fff1f5";
const PINK_LIGHT = "#ffc2d8";
const HOT = "#e8337a";

function Hook({ cx }: { cx: number }) {
  return (
    <path
      d={`M ${cx} 116 V 104 a 10 10 0 1 1 10 -10`}
      fill="none"
      stroke={PLUM}
      strokeWidth="4"
      strokeLinecap="round"
    />
  );
}

function Hanger({ cx }: { cx: number }) {
  return (
    <>
      <Hook cx={cx} />
      <path
        d={`M ${cx - 42} 142 L ${cx} 114 L ${cx + 42} 142 Z`}
        fill="none"
        stroke={PLUM}
        strokeWidth="4"
        strokeLinejoin="round"
      />
    </>
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

const outline = { stroke: PLUM, strokeWidth: 4, strokeLinejoin: "round" as const };

export default function ClosetRail() {
  return (
    <svg
      className="closet-rail"
      viewBox="0 0 480 480"
      role="img"
      aria-label="Illustration of a clothes rail with a dress, a striped tee, trousers, and a cardigan, and a pair of heels below"
    >
      {/* rail */}
      <rect x="24" y="86" width="432" height="12" rx="6" fill={PLUM} />
      <circle cx="24" cy="92" r="10" fill={PLUM} />
      <circle cx="456" cy="92" r="10" fill={PLUM} />

      {/* slip dress */}
      <g className="swing swing-1">
        <Hanger cx={96} />
        <path d="M 78 142 L 74 128 M 114 142 L 118 128" stroke={PLUM} strokeWidth="3" strokeLinecap="round" />
        <path d="M 70 142 L 122 142 L 128 180 L 156 326 Q 96 344 36 326 L 64 180 Z" fill={TANGERINE} {...outline} />
        <path d="M 64 182 Q 96 196 128 182" fill="none" stroke={PLUM} strokeWidth="3" />
      </g>

      {/* striped tee */}
      <g className="swing swing-2">
        <Hanger cx={196} />
        <path
          d="M 158 142 L 176 134 Q 196 150 216 134 L 234 142 L 258 168 L 240 184 L 230 176 L 230 274 L 162 274 L 162 176 L 152 184 L 134 168 Z"
          fill={BLUSH}
          {...outline}
        />
        {[196, 218, 240, 262].map((y) => (
          <line key={y} x1="164" x2="228" y1={y} y2={y} stroke={HOT} strokeWidth="7" />
        ))}
      </g>

      {/* trousers on a clip hanger */}
      <g className="swing swing-3">
        <Hook cx={296} />
        <line x1="254" x2="338" y1="134" y2="134" stroke={PLUM} strokeWidth="5" strokeLinecap="round" />
        <rect x="262" y="132" width="10" height="16" rx="2" fill={PLUM} />
        <rect x="320" y="132" width="10" height="16" rx="2" fill={PLUM} />
        <path d="M 260 146 L 332 146 L 346 336 L 308 336 L 296 198 L 284 336 L 246 336 Z" fill={PLUM} {...outline} />
        <line x1="262" x2="330" y1="160" y2="160" stroke={HOT} strokeWidth="3" />
      </g>

      {/* cropped cardigan */}
      <g className="swing swing-4">
        <Hanger cx={396} />
        <path
          d="M 358 142 L 378 134 Q 396 154 414 134 L 434 142 L 452 236 L 432 240 L 426 192 L 426 252 L 366 252 L 366 192 L 360 240 L 340 236 Z"
          fill={PINK_LIGHT}
          {...outline}
        />
        <line x1="396" x2="396" y1="150" y2="252" stroke={PLUM} strokeWidth="3" />
        {[176, 202, 228].map((y) => (
          <circle key={y} cx="404" cy={y} r="4.5" fill={TANGERINE} stroke={PLUM} strokeWidth="2" />
        ))}
      </g>

      {/* floor + heels */}
      <line x1="60" x2="420" y1="430" y2="430" stroke={PLUM} strokeWidth="3" strokeLinecap="round" opacity="0.35" />
      {[0, 74].map((dx) => (
        <g key={dx} transform={`translate(${dx} 0)`}>
          <path d="M 170 428 L 174 404 L 182 404 L 182 428 Z" fill={PLUM} />
          <path d="M 172 404 Q 196 386 222 412 L 246 418 Q 258 421 256 428 L 214 428 Q 200 410 172 410 Z" fill={BLUSH} {...outline} />
        </g>
      ))}

      {/* sparkles */}
      <Sparkle x={428} y={318} r={18} fill={BLUSH} />
      <Sparkle x={448} y={364} r={9} fill={TANGERINE} />
      <Sparkle x={52} y={384} r={13} fill={BLUSH} />
      <Sparkle x={112} y={40} r={10} fill={TANGERINE} />
      <Sparkle x={372} y={34} r={14} fill={BLUSH} />
    </svg>
  );
}
