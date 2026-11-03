# Prompts: Category icons + empty state drawings

## Prompt
> (After seeing the hot pink login illustration) Sure, please do that! — add drawings to the empty pages and category icons for pieces without photos.

## What the agent built
- `src/app/art/CategoryIcon.tsx`: a small drawing for each of the 7 categories (tee, trousers, slip dress, jacket, heel, tote, necklace). It shows up anywhere a piece has no photo yet: closet grid, piece page, outfit picker, outfit thumbnails, random pick.
- `src/app/art/EmptyArt.tsx`: drawings for empty pages:
  - empty closet → an empty rail with hangers
  - no outfits → a tee and trousers waiting to be paired
  - nothing starred → a star on a hanger
  - no search matches → a magnifying glass over a folded tee
- All drawn in code (SVG) in the hot pink palette, so nothing extra to download.

## Things that came up
- The agent rendered the drawings and checked them before shipping: the first version had the hangers overlapping and the star cut off at the bottom, so it fixed both.
- No database changes.
