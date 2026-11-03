-- Past wears: times a piece was worn before I started logging outfits.
-- Total wears = past_wears + number of logged outfits the piece is in.

alter table public.pieces
  add column if not exists past_wears integer not null default 0
  check (past_wears >= 0);
