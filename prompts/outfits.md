# Prompts: Outfits (feature 4)

## Prompt
> Build feature 4 from PLAN.md on the feature/outfits branch: "As a user, I want to log an outfit with the date I wore it, an occasion, and the pieces in it, so that I can track how often each piece gets worn." Use the outfits and outfit_pieces tables from section 3 of the plan. Picking pieces is the part I flagged as riskiest, so make it easy: tap photos to pick them.

## What the agent built
- `supabase/migrations/003_outfits.sql`: the `outfits` table and the `outfit_pieces` junction table, matching section 3 of my plan. Outfits and pieces are many-to-many through outfit_pieces.
  - Row-level security: you only see your own outfits, and you can only link pieces you own to outfits you own.
- Log an outfit (`/outfits/new`): date (defaults to today), occasion, notes, and a grid of my pieces I tap to pick. Category chips (All / Top / Bottom / …) narrow the grid, and picks are kept when I switch categories.
- Outfits list (`/outfits`): newest first, with little thumbnails of the pieces.
- Outfit detail (`/outfits/[id]`) with a delete button and "are you sure?" check. Deleting an outfit keeps the pieces.
- Each piece's page now says how many times it's been worn and lists the outfits it was in.
- Closet / Outfits links in the header.
- Validation: date is required and can't be in the future, and at least one piece has to be picked.

## Things that came up
- Saving an outfit is two steps (save the outfit, then link the pieces). If the second step fails, the agent deletes the outfit so there's never a half-saved one.
- The agent caught a time zone bug before shipping: the server runs on UTC, so after 4pm Pacific it thinks it's already tomorrow and would have defaulted the date wrong. "Today" is now worked out in my browser instead.
