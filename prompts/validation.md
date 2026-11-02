# Prompts: Validation (feature 3)

## Prompt
> Build feature 3 from PLAN.md on the feature/validation branch: "As a user, I want a friendly message if I leave the name or category blank, so that I don't save half-empty pieces." Show the message next to the field that needs fixing, and don't wipe what I already typed.

## What the agent built
- `src/lib/validation.ts`: one set of rules used in two places (the form in the browser, and the server before saving).
  - Name is required (and under 100 characters).
  - Category is required, and has to be one from the list.
  - Price, if filled in, has to be $0 or more.
  - Purchase date can't be in the future.
- The form checks before sending. If something's wrong, it stops, shows a message under that field in red, and puts the cursor there. Everything else I typed stays.
- The message under a field disappears as soon as I start fixing it.
- Required fields have a small * next to the label.
- The server checks again before saving, so the rules hold even if someone skips the form.

## Things that came up
- The agent noticed the form would clear itself after a failed save (that's how React forms behave by default), so it checks in the browser first and only sends the form once it passes.
- Database errors now show a plain "Something went wrong" message instead of technical text.
