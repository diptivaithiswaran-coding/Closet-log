import Link from "next/link";
import { requireUser } from "@/lib/auth";
import type { Piece } from "@/lib/types";
import { findPieces, readFindParams } from "@/lib/find";
import { getStarredIds } from "@/lib/stars";
import { getWearCounts } from "@/lib/wears";
import Header from "./Header";
import PieceCard from "./PieceCard";
import FindBar from "./FindBar";

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export default async function Home({ searchParams }: Props) {
  const { supabase, user } = await requireUser();
  const opts = readFindParams(await searchParams);

  const [{ data }, starred, wearCounts] = await Promise.all([
    supabase.from("pieces").select("*"),
    getStarredIds(supabase),
    getWearCounts(supabase),
  ]);
  const all = (data ?? []) as Piece[];
  const pieces = findPieces(all, wearCounts, opts);

  return (
    <>
      <Header email={user.email ?? ""} />
      <main className="page">
        <div className="page-head">
          <div>
            <h1>My closet</h1>
            <p className="muted">
              {pieces.length === all.length
                ? `${all.length} ${all.length === 1 ? "piece" : "pieces"}`
                : `Showing ${pieces.length} of ${all.length}`}
            </p>
          </div>
          <Link href="/pieces/new" className="btn">+ Add piece</Link>
        </div>

        {all.length === 0 ? (
          <div className="empty card">
            <h2>Your closet is empty</h2>
            <p className="muted">Add your first piece to get started.</p>
            <Link href="/pieces/new" className="btn">+ Add piece</Link>
          </div>
        ) : (
          <>
            <FindBar initial={opts} />
            {pieces.length === 0 ? (
              <div className="empty card">
                <h2>No matches</h2>
                <p className="muted">Nothing in your closet matches that. Try a different word or category.</p>
              </div>
            ) : (
              <div className="grid">
                {pieces.map((p) => (
                  <PieceCard
                    key={p.id}
                    piece={p}
                    starred={starred.has(p.id)}
                    wears={opts.sort === "most-worn" ? wearCounts.get(p.id) ?? 0 : undefined}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </>
  );
}
