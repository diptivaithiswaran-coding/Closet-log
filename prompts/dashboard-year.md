# Prompts: Dashboard year filter

## Prompt
> Is there a way to filter by year?

The agent asked where (dashboard, outfits page, or closet by purchase year). I picked the **dashboard**.

## What the agent built
- A dropdown at the top right of the dashboard: **Last 8 weeks** (default) or any year I've logged outfits in (plus this year).
- Picking a year:
  - the chart switches to **outfits per month**, January to December
  - "Outfits logged" becomes "Outfits logged in 2026"
  - "Most worn" becomes "Most worn in 2026," counted from that year's logged outfits only
- The cost-per-wear table stays **all time** and says so, because wears from before I started logging don't have dates.
- The choice is saved in the address bar (`/dashboard?range=2026`), so refreshing keeps it.

## Why it came up
3 of my 6 outfits were from before mid-September, so they counted in "Outfits logged" but didn't show on the 8-week chart.

No database changes.
