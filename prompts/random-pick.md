# Prompts: Random outfit pick (feature 10, my feature #3)

## Prompt
> Build feature 10 from PLAN.md on the feature/random-pick branch: "As a user, I want a button that pulls one random top, bottom, and pair of shoes, so that I get unstuck on busy mornings."

## What the agent built
- A Random pick page (`/pick`), linked in the header.
- Shows one random top, one random bottom, and one random pair of shoes, side by side with photos.
- 🎲 Shuffle button for a new combo.
- "Wear this today" button that logs the combo as today's outfit (occasion: "Random pick"). It goes straight into Outfits, the dashboard, and cost-per-wear.
- If a category is empty (e.g. no shoes yet), that slot says "No shoes yet. Add one" instead of breaking.
- `src/lib/pick.ts` holds the pick logic.

## Things that came up
- Added "Wear this today" beyond what the plan said, so a random pick actually counts as a wear. That was the agent's idea; I kept it.
- The first pick happens in the browser, not on the server, so the page doesn't show the same combo every time it loads.
- No database changes.
