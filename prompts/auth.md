# Prompts: Sign up and login (feature 1)

## Prompt
> Build feature 1 from PLAN.md on the feature/auth branch: "As a new user, I want to create an account and log in and out, so that my closet is private to me." Use Next.js and Supabase Auth with email and password. Every account should be a row in a users table. Logged-out visitors should only see the login and sign-up pages.

## What the agent built
- A Next.js app (the starting project files), styled with my cream / near-black / dusty-rose colors and a serif heading font.
- Sign up, log in, and log out pages using Supabase Auth.
- `supabase/migrations/001_users.sql`: a `public.users` table. A trigger copies every new sign-up into it, so each account is a row in my own users table. Row-level security means each user can only read their own row.
- Middleware that sends logged-out visitors to /login and logged-in visitors away from /login and /signup.

## Things that came up
- Google Fonts couldn't be downloaded during the build, so the agent switched to bundling the fonts as packages instead. Same fonts, no outside request.
