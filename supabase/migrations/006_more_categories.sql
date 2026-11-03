-- More categories: jumpsuit, romper, other
-- New categories need no database change (category is text; the app checks
-- the list). "Other" needs somewhere to keep what the user typed in.

alter table public.pieces add column if not exists category_other text;
