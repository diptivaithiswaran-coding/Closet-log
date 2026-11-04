# Prompts: Dashboard test for past wears

## Why
While writing my reflection, I realized my dashboard test only checked a piece with 0 past wears. After I changed cost-per-wear to include wears from before I used the app, a bug in that math wouldn't have been caught.

## Prompt
> Yes (update the dashboard test to cover past wears).

## What the agent did
- Pulled the "add past wears + logged outfits" math into its own function (`combineWears` in `src/lib/wears.ts`) so a test can check it directly. The app uses the same function.
- Added two tests to `tests/dashboard.test.ts`:
  1. **Given** a $120 piece with 2 past wears and 2 logged outfits, **when** the dashboard loads, **then** it shows 4 wears and $30.00 cost-per-wear.
  2. When I type 4 as the total on the edit form and 2 outfits are already logged, only 2 get saved as past wears.
- Checked that the new test fails if past wears are ignored (it got 2 wears / $60.00 instead of 4 / $30.00), then put the code back.
