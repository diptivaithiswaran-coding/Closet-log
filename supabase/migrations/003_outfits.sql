-- Feature 4: Outfits
-- An outfit is one day I wore something. outfit_pieces connects outfits
-- and pieces (many-to-many): one outfit has several pieces, and one piece
-- shows up in many outfits.

create table if not exists public.outfits (
  id bigint generated always as identity primary key,
  user_id uuid not null default auth.uid() references public.users (id) on delete cascade,
  worn_on date not null,
  occasion text,
  notes text,
  created_at timestamptz not null default now()
);

create index if not exists outfits_user_id_idx on public.outfits (user_id);

create table if not exists public.outfit_pieces (
  outfit_id bigint not null references public.outfits (id) on delete cascade,
  piece_id bigint not null references public.pieces (id) on delete cascade,
  primary key (outfit_id, piece_id)
);

create index if not exists outfit_pieces_piece_id_idx on public.outfit_pieces (piece_id);

alter table public.outfits enable row level security;
alter table public.outfit_pieces enable row level security;

-- Each user can only see and change their own outfits.
create policy "Users manage their own outfits"
  on public.outfits for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- A link row is visible only if the user owns the outfit, and can only be
-- added if they own both the outfit and the piece.
create policy "Users see links on their own outfits"
  on public.outfit_pieces for select
  using (exists (select 1 from public.outfits o where o.id = outfit_id and o.user_id = auth.uid()));

create policy "Users link their own outfits and pieces"
  on public.outfit_pieces for insert
  with check (
    exists (select 1 from public.outfits o where o.id = outfit_id and o.user_id = auth.uid())
    and exists (select 1 from public.pieces p where p.id = piece_id and p.user_id = auth.uid())
  );

create policy "Users unlink their own outfits"
  on public.outfit_pieces for delete
  using (exists (select 1 from public.outfits o where o.id = outfit_id and o.user_id = auth.uid()));
