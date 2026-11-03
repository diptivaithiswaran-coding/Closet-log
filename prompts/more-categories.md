# Prompts: More categories (jumpsuit, romper, other)

## Prompt
> We need to add jumpsuit, romper, and other to category. Other should show a box to enter information.

## What the agent built
- Three new categories: **Jumpsuit**, **Romper**, and **Other** (10 total).
- Picking **Other** opens a "What is it?" box right under the category (e.g. "Swimsuit," "Saree," "Lehenga"). It's required when Other is picked, up to 40 characters.
- Whatever I type shows up as the piece's category everywhere: the label on the piece page, and under the name in the closet grid when there's no brand or price.
- Search also matches what I typed, so searching "saree" finds it.
- New drawings for jumpsuit, romper, and other (a hanger with a question mark).
- `supabase/migrations/006_more_categories.sql`: adds a `category_other` column to pieces.
- Updated schema.md.

## Decision
The agent kept the category list fixed (so filtering still works) and stored the typed-in text in its own column, instead of letting "other" pieces have any category text at all. That way the category filter still has one "Other" option that catches all of them.

## Plan vs. reality
My plan had 7 categories. Once I started adding my real closet, some pieces didn't fit any of them.
