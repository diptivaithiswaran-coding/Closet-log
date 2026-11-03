# Prompts: Dashboard caption fix

## What happened
I sent the agent a screenshot of my dashboard. It noticed the cost-per-wear caption read "Price + times worn": the ÷ sign looks like a + in the DM Sans font that came with the redesign.

## Fix
Changed the caption to "Price divided by times worn." Also updated a code comment that still said cost-per-wear only counts outfits (it now includes past wears).
