# Prompts: Forgotten pieces (feature 9, my feature #2)

## Prompt
> Build feature 9 from PLAN.md on the feature/forgotten branch: "As a user, I want a list of pieces I haven't worn in 30+ days, so that I can either wear them or let them go."

## What the agent built
- A Forgotten page (`/forgotten`), linked in the header, with two sections:
  - **Not worn in 30+ days:** pieces whose last outfit was 30 or more days ago, longest-forgotten first, with "Last worn Sep 1 · 62 days ago" under each.
  - **Never worn yet:** pieces that haven't been in any outfit, oldest first, with "In closet N days."
- `src/lib/forgotten.ts` holds the logic.

## Decision: what about pieces I've never worn?
My plan said "pieces I haven't worn in 30+ days." But a piece I've never worn has no "last worn" date, so it wouldn't show up under that rule, and those are often the most forgotten pieces. The agent made this call on its own: never-worn pieces get their own section instead of being hidden or lumped in. That way, things I just added today don't look "forgotten," but they're still visible. (Agent's decision, not mine. I went along with it.)

## Things that came up
- "Days since" uses Pacific time for "today," so the count doesn't jump a day early in the evening.
- No database changes.
