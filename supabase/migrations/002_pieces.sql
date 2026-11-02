-- Feature 2: Closet pieces
-- One row per piece of clothing. Each piece belongs to one user.

create table if not exists public.pieces (
  id bigint generated always as identity primary key,
  user_id uuid not null default auth.uid() references public.users (id) on delete cascade,
  name text not null,
  category text not null,
  brand text,
  color text,
  price numeric(10, 2),
  purchased_on date,
  photo_url text,
  created_at timestamptz not null default now()
);

create index if not exists pieces_user_id_idx on public.pieces (user_id);

alter table public.pieces enable row level security;

-- Each user can only see, add, change, and delete their own pieces.
create policy "Users manage their own pieces"
  on public.pieces for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Safety net: copy in any accounts that signed up before the users table existed.
insert into public.users (id, email)
select id, email from auth.users
on conflict (id) do nothing;
