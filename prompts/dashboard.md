# Prompts: Dashboard (feature 7)

## Prompt
> Build feature 7 from PLAN.md on the feature/dashboard branch: "As a user, I want a chart of outfits logged per week, plus total pieces, average cost-per-wear, and my most-worn piece, so that I can see my habits at a glance." Cost-per-wear = price ÷ number of outfits the piece appears in, calculated not stored. Use Recharts.

## What the agent built
- A Dashboard page (`/dashboard`), linked in the header.
- Four stat tiles: total pieces, outfits logged, average cost-per-wear, and most-worn piece (with its wear count).
- A dusty-rose bar chart of outfits per week for the last 8 weeks (weeks start Monday; empty weeks show as 0). Hovering a bar shows "Week of Oct 26 · 2 outfits."
- A cost-per-wear table: every piece with a price that's been worn, cheapest-per-wear first.
- `src/lib/stats.ts` holds all the math in one place, so the dashboard test can check it directly.

## Checking the math
I asked the agent to check the example from my plan's test: a $120 piece worn 4 times → $30.00. `costPerWear(120, 4)` returns 30. ✅

## Decisions
- Average cost-per-wear only counts pieces that have a price AND have been worn at least once. A piece worn 0 times has no cost-per-wear (you can't divide by zero), so it's left out instead of counting as $0 or infinity.
- No database changes.
