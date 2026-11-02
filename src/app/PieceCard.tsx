import Link from "next/link";
import type { Piece } from "@/lib/types";
import { capitalize, money } from "@/lib/format";
import StarButton from "./stars/StarButton";

export default function PieceCard({
  piece,
  starred,
  wears,
}: {
  piece: Piece;
  starred?: boolean;
  wears?: number;
}) {
  return (
    <div className="piece-wrap">
      <Link href={`/pieces/${piece.id}`} className="piece-card">
        <div className="photo">
          {piece.photo_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={piece.photo_url} alt={piece.name} />
          ) : (
            <span className="photo-empty">{capitalize(piece.category)}</span>
          )}
        </div>
        <div className="piece-meta">
          <p className="piece-name">{piece.name}</p>
          <p className="muted small">
            {[piece.brand, money(piece.price)].filter((x) => x && x !== "—").join(" · ") || capitalize(piece.category)}
          </p>
          {wears !== undefined && (
            <p className="muted small">Worn {wears} {wears === 1 ? "time" : "times"}</p>
          )}
        </div>
      </Link>
      {starred !== undefined && <StarButton pieceId={piece.id} starred={starred} />}
    </div>
  );
}
