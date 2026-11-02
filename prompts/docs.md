# Prompts: README and schema.md

## Prompt
> Write README.md so someone else can understand and run the app: what it does, the live URL, the tools I used, and how to run it. Write schema.md listing every table, its columns, and how the tables relate, with a simple diagram. Compare it with section 3 of PLAN.md: did the agent build what I designed?

## What the agent wrote
- `README.md`: what the app does, live URL, tools table, step-by-step setup (including turning off "Confirm email" and running the SQL files in order), how to run the tests, and where things are in the repo.
- `schema.md`: a diagram (renders on GitHub), a table for each of the 5 tables, how they connect, the privacy rules, the photo bucket, and a "plan vs. what got built" table.

## Plan vs. built (short version)
Same 5 tables, same columns, same relationships as my plan. The differences are details: ids are uuid / auto-numbered instead of text / "number," created_at has a time on it, and price has exactly 2 decimals. The agent also added a trigger and row-level security rules that my plan described in words but didn't spell out.
