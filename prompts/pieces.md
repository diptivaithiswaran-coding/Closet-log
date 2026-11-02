# Prompts: Closet pieces (feature 2)

## Prompt
> Build feature 2 from PLAN.md on the feature/pieces branch: "As a user, I want to add a piece with a name, category, brand, color, price, and purchase date, so that I have a record of what I own. I can view my list of pieces, open one piece's detail page, edit it, and delete it after an 'are you sure?' prompt." Use the pieces table from section 3 of the plan. Each user should only ever see their own pieces.

## What the agent built
- `supabase/migrations/002_pieces.sql`: the `pieces` table, matching section 3 of my plan (photo_url included now, so photo upload later is just the upload part). Row-level security so each user can only see, add, edit, and delete their own pieces.
- Closet page (`/`): a photo-first grid of my pieces, newest first, with an empty state.
- Add (`/pieces/new`), detail (`/pieces/[id]`), and edit (`/pieces/[id]/edit`) pages.
- Delete button that asks "Are you sure you want to delete …? This can't be undone." before deleting.

## Things that came up
- If my account was created before the users table existed, adding a piece would fail (pieces point to users). The agent added a line to the SQL that copies any existing accounts into the users table.
- Friendly "you left this blank" messages are saved for feature 3 (validation), so this PR stays one feature.
