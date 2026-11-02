# Prompts: Find things (feature 6)

## Prompt
> Build feature 6 from PLAN.md on the feature/find branch: "As a user, I want to search pieces by name or brand, filter by category, and sort by newest, most worn, or price, so that I can find something in a big closet."

## What the agent built
- A bar above my closet grid with:
  - a search box (name or brand, searches as I type)
  - a category filter (All, Top, Bottom, …)
  - a sort menu: Newest first, Most worn, Price high to low, Price low to high
- "Showing 2 of 5" when a search or filter is on, plus a Clear button.
- When sorting by Most worn, each card says "Worn N times."
- Everything is saved in the page address (like `/?category=top&sort=price-high`), so refreshing keeps the view.
- `src/lib/find.ts` holds the search / filter / sort logic in one place so it's easy to test.

## Things that came up
- Pieces with no price would sort to the top when sorting by price low to high. The agent made pieces with no price always go last.
- No database changes in this one.
