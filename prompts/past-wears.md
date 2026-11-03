# Prompts: Past wears

## Prompt
> Can we have a worn option while editing, to input number of times worn?

The agent pointed out that wear counts come from logged outfits, so a plain "times worn" box would go out of sync as soon as I logged another outfit. It offered two options:
1. **Add past wears:** a box for "worn before I started logging," and total = that + logged outfits.
2. **Replace the count:** whatever I type is the count, and outfits stop affecting it.

I picked **add past wears**.

## What the agent built
- `supabase/migrations/007_past_wears.sql`: a `past_wears` column on pieces (whole number, default 0, can't be negative).
- A "Worn before I started logging" box on the add and edit forms, with a hint that a rough guess is fine.
- Total wears = past wears + logged outfits, used everywhere: the piece page ("Worn 12 times (10 before Closet Log + 2 logged)"), Most worn sort, the dashboard's most-worn piece, and cost-per-wear.
- Forgotten page: the second section is now "No logged wears yet." A piece with past wears but no logged outfit says "Worn 10× before Closet Log, not since" instead of "Never worn."
- Updated schema.md.

## Plan vs. reality
My plan said cost-per-wear = price ÷ number of outfits. Now it's price ÷ (past wears + outfits), because my closet existed before the app did, and old favorites looked like I never wore them.
