# Prompts: Photo upload (feature 8, my feature #1)

## Prompt
> Build feature 8 from PLAN.md on the feature/photos branch: "As a user, I want to add a photo to each piece, so that my closet looks like my closet and not a spreadsheet." Use Supabase Storage. The photo_url column already exists on pieces.

## What the agent built
- `supabase/migrations/005_photos.sql`: a `photos` storage bucket. Each user uploads into their own folder and can only add or remove files there. Only JPG, PNG, and WebP, up to 5 MB.
- An "Add photo" button at the top of the add and edit forms, with a preview. "Change photo" and "Remove photo" once one is added.
- Phone photos get shrunk in the browser before uploading (max 1200px, JPEG), so they upload fast and stay under the size limit.
- The photo then shows everywhere a piece does: closet grid, piece page, outfit picker, outfit thumbnails, Starred.

## Things that came up
- Security: the photo link is sent with the form, so someone could paste in any web address. The server now only saves photo links that point into the logged-in user's own folder.
- No new column needed. photo_url was in my plan from the start, so this feature only needed the storage part, like I wrote in my Risks and cuts section.
