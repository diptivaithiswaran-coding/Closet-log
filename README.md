# Closet Log

Track what you own and what you actually wear.

I buy a lot of clothes and had no idea what I actually wear. Closet Log lets me log my pieces, log what I wore each day, and see which pieces earn their spot (cost-per-wear) and which ones I've forgotten about.

**Live app:** https://closet-log-eight.vercel.app

## What it does

- **Sign up / log in.** Every account is private. You only ever see your own closet.
- **Closet.** Add pieces with a name, category, brand, color, price, purchase date, and photo. Edit or delete them.
- **Outfits.** Log what you wore on a day by tapping the pieces in it.
- **Stars.** Star your go-to pieces and see them all on the Starred page.
- **Search, filter, sort.** Search by name or brand, filter by category, and sort by newest, most worn, or price.
- **Dashboard.** Total pieces, outfits logged, average cost-per-wear, most-worn piece, an outfits-per-week chart, and a cost-per-wear table.
- **Photos.** Add a photo to each piece (shrunk automatically before upload).
- **Not worn lately.** Pieces you haven't worn in 30+ days, plus ones with no logged wears yet. (Renamed from "Forgotten" after the stranger test.)
- **Random pick.** One random top, bottom, and pair of shoes. Shuffle, or log it as today's outfit.

## Built with

| What | Tool |
|---|---|
| Coding agent | Claude |
| App | Next.js 15 (React, TypeScript) |
| Database | Supabase (Postgres) with row-level security |
| Sign up / login | Supabase Auth (email + password) |
| Photos | Supabase Storage |
| Chart | Recharts |
| Tests | Vitest, run on every PR with GitHub Actions |
| Hosting | Vercel (redeploys on every merge to `main`) |

## How to run it yourself

You need Node.js 20+ and a free Supabase project.

1. **Get the code**
   ```bash
   git clone https://github.com/diptivaithiswaran-coding/Closet-log.git
   cd Closet-log
   npm install
   ```

2. **Set up Supabase**
   - In your Supabase project, go to **Authentication → Sign In / Providers → Email** and turn off **Confirm email**.
   - Open the **SQL Editor** and run each file in `supabase/migrations/`, in order (`001` → `005`). They create the tables, the security rules, and the photo bucket.

3. **Add your keys**
   Copy `.env.example` to `.env.local` and fill in your project's URL and publishable key (Supabase → **Connect**, or **Project Settings → API**):
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
   ```

4. **Run it**
   ```bash
   npm run dev
   ```
   Open http://localhost:3000 and sign up.

5. **Run the tests**
   ```bash
   npm test
   ```
   - `tests/dashboard.test.ts`: a $120 piece worn 4 times shows a cost-per-wear of $30.00.
   - `tests/isolation.test.ts`: signs up two new users against the real database and checks that User B can't see or edit User A's piece.

## Where things are

```
src/app/            pages (closet, pieces, outfits, starred, dashboard, forgotten, pick, login, signup)
src/lib/            shared logic: validation, search/sort, stats, forgotten, random pick
supabase/migrations SQL for every table, in the order they were built
tests/              the two tests
prompts/            my prompt log for each feature
PLAN.md             the original plan + Plan vs. Reality
schema.md           every table and how they connect
```
