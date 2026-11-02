# Prompts: Dashboard test

## Prompt
> Write the dashboard test from section 4 of PLAN.md: "Given a piece that cost $120 and appears in 4 outfits, when the dashboard loads, then that piece's cost-per-wear shows $30.00." Use Vitest. Then temporarily break cost-per-wear so I can see the test fail, and put it back so I can see it pass.

## What the agent built
- Vitest, plus `npm test` to run it.
- `tests/dashboard.test.ts`:
  1. Makes one $120 piece worn in 4 outfits, runs the same stats function the dashboard page uses, and checks it shows "$30.00" (both the piece's cost-per-wear and the average).
  2. Checks that a piece worn 0 times is left out of the average instead of dividing by zero.
- A GitHub Action (`.github/workflows/tests.yml`) that runs the tests on every PR and every merge to main, so the red/green results are saved on GitHub.

## Red, then green
- Break: changed `price / wears` to `price / (wears + 1)` in `src/lib/stats.ts` ("off by one" on the wear count). $120 ÷ 5 = $24.00, so the test failed.
- Revert: put it back to `price / wears`. Test passed again.
