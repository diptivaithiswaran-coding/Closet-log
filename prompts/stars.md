# Prompts: Stars (feature 5)

## Prompt
> Build feature 5 from PLAN.md on the feature/stars branch: "As a user, I want to star my favorite pieces and see them in a 'Starred' view, so that I can find my go-tos fast." All stars live in one stars table (a junction table): each row is "this user starred this piece." One table for everyone.

## What the agent built
- `supabase/migrations/004_stars.sql`: one `stars` table with user_id + piece_id (the pair is the primary key, so you can't star the same piece twice). Row-level security: you only see your own stars, and you can only star pieces you own.
- A ☆ button on every piece in the closet grid, and a "Star / Starred" button on each piece's page. It fills in dusty rose right away when tapped.
- A Starred page (`/starred`), linked in the header, showing starred pieces newest-star first.

## Things that came up
- The star sits on top of the piece card, which is a link. The agent made the star button stop the click from also opening the piece.
