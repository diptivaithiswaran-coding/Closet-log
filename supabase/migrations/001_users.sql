-- Feature 1: Sign up and login
-- Supabase Auth keeps logins in auth.users. This mirrors every account
-- into our own public.users table, so each account is a row we can join to.

create table if not exists public.users (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  created_at timestamptz not null default now()
);

alter table public.users enable row level security;

-- Each user can only see their own row.
create policy "Users can read their own row"
  on public.users for select
  using (auth.uid() = id);

-- When someone signs up, add them to public.users automatically.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.users (id, email) values (new.id, new.email);
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
