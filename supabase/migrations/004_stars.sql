-- Feature 5: Stars
-- One stars table for everyone. Each row means "this user starred this piece."
-- It's a junction table between users and pieces (many-to-many).

create table if not exists public.stars (
  user_id uuid not null default auth.uid() references public.users (id) on delete cascade,
  piece_id bigint not null references public.pieces (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, piece_id)
);

create index if not exists stars_piece_id_idx on public.stars (piece_id);

alter table public.stars enable row level security;

create policy "Users see their own stars"
  on public.stars for select
  using (auth.uid() = user_id);

-- You can only star pieces you own.
create policy "Users star their own pieces"
  on public.stars for insert
  with check (
    auth.uid() = user_id
    and exists (select 1 from public.pieces p where p.id = piece_id and p.user_id = auth.uid())
  );

create policy "Users unstar their own stars"
  on public.stars for delete
  using (auth.uid() = user_id);
