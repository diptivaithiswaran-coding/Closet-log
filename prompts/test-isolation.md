# Prompts: Data isolation test

## Prompt
> Write the data isolation test from section 4 of PLAN.md: "Given User A has added a piece, when User B logs in and opens their closet, then User B sees zero pieces, and opening User A's piece page shows 'not found.'" Then help me temporarily break it so I can see it fail, and put it back.

## What the agent built
`tests/isolation.test.ts` runs against my real Supabase database (same public key the live site uses):
1. Signs up a brand-new User A and has them add a piece ("User A's secret jacket").
2. Signs up a brand-new User B.
3. Checks:
   - User A can see their piece (so the piece really exists).
   - User B's closet query returns nothing.
   - User B looking up User A's piece by its id gets nothing (the piece page shows "not found" when this happens).
   - User B trying to rename User A's piece doesn't change it.
4. Deletes User A's test piece afterward.

## How the isolation actually works
The app code doesn't filter by user. The database does, with row-level security on the pieces table: `auth.uid() = user_id`. So the "break" has to happen in the database, not the code.

## Red, then green
- Break: in the Supabase SQL Editor, added an extra policy that lets anyone read every piece. Re-ran the tests: they failed because User B could see User A's jacket.
- Revert: dropped that policy. Re-ran the tests: they passed.

## Side effect
Each run creates two test accounts (closetlog.test+...@gmail.com) in my users table. No emails get sent because "Confirm email" is off.
