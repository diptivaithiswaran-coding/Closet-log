# PLAN.md — Closet Log

## 1. Pitch
I'm building a closet log because I buy a lot of clothes and have no idea what I actually wear. I want to see what earns its spot and what's just taking up hanger space. I'll use it most days: log what I wore, and add new pieces when I buy them.

## 2. Features
In build order.

**Spine**
1. **Sign up and login.** As a new user, I want to create an account and log in and out, so that my closet is private to me.
2. **Closet pieces (data model + CRUD).** As a user, I want to add a piece with a name, category, brand, color, price, and purchase date, so that I have a record of what I own. I can view my list of pieces, open one piece's detail page, edit it, and delete it after an "are you sure?" prompt.
3. **Validation.** As a user, I want a friendly message if I leave the name or category blank, so that I don't save half-empty pieces.
4. **Outfits.** As a user, I want to log an outfit with the date I wore it, an occasion, and the pieces in it, so that I can track how often each piece gets worn.
5. **Stars.** As a user, I want to star my favorite pieces and see them in a "Starred" view, so that I can find my go-tos fast.
6. **Find things.** As a user, I want to search pieces by name or brand, filter by category, and sort by newest, most worn, or price, so that I can find something in a big closet.
7. **Dashboard.** As a user, I want a chart of outfits logged per week, plus total pieces, average cost-per-wear, and my most-worn piece, so that I can see my habits at a glance.

**My 3 features**
8. **Photo upload.** As a user, I want to add a photo to each piece, so that my closet looks like my closet and not a spreadsheet.
9. **Forgotten pieces.** As a user, I want a list of pieces I haven't worn in 30+ days, so that I can either wear them or let them go.
10. **Random outfit pick.** As a user, I want a button that pulls one random top, bottom, and pair of shoes, so that I get unstuck on busy mornings.

## 3. Database

| Table | Columns (type) | Notes |
|---|---|---|
| **users** | id (text, PK), email (text), created_at (date) | Managed by Supabase Auth |
| **pieces** | id (number, PK), user_id (text, FK → users), name (text), category (text), brand (text), color (text), price (number), purchased_on (date), photo_url (text), created_at (date) | My main item |
| **outfits** | id (number, PK), user_id (text, FK → users), worn_on (date), occasion (text), notes (text), created_at (date) | One outfit = one day I wore something |
| **outfit_pieces** | outfit_id (number, FK → outfits), piece_id (number, FK → pieces) | PK is the pair. Junction table |
| **stars** | user_id (text, FK → users), piece_id (number, FK → pieces), created_at (date) | PK is the pair. One table for everyone |

**How they connect**
- A user has many pieces and many outfits (one-to-many).
- Outfits and pieces are many-to-many through `outfit_pieces`: one outfit has several pieces, and one piece shows up in many outfits.
- Users and pieces are also many-to-many through `stars`: "this user starred this piece."

```
users ──< pieces >──< outfit_pieces >──< outfits >── users
  └──────< stars >──── pieces
```

**Categories:** top, bottom, dress, outerwear, shoes, bag, accessory.
**Cost-per-wear** = price ÷ number of outfits the piece appears in. It's calculated, not stored.

## 4. Tests
1. **Data isolation.** Given User A has added a piece, when User B logs in and opens their closet, then User B sees zero pieces, and opening User A's piece page shows "not found."
2. **Dashboard.** Given a piece that cost $120 and appears in 4 outfits, when the dashboard loads, then that piece's cost-per-wear shows $30.00.

## 5. Technologies
- **Coding agent:** Claude. It writes the code on feature branches, and I review and merge each PR.
- **Framework:** Next.js (React). It's one project for pages and server logic, and it deploys easily to Vercel.
- **Database:** Supabase (Postgres). It's a real relational database with row-level security, so each user only sees their own rows.
- **Sign up and login:** Supabase Auth with email and password. It's built in, so I don't have to roll my own.
- **Photos:** Supabase Storage. It lives in the same place as my data.
- **Charts:** Recharts. It's simple and works well in React.
- **Tests:** Vitest. It's fast and easy to read.
- **Hosting:** Vercel. It's free and redeploys automatically every time I merge to main, so the live URL stays current.

## 6. Design
Clean, editorial, and photo-first. Pieces show as a grid of cards, like a shop page.
- **Colors:** cream background (#FAF7F2), near-black text (#1C1C1C), one dusty-rose accent (#C98B8B) for stars and buttons.
- **Type:** a serif for headings and a clean sans-serif for everything else.
- **Inspiration:** Pinterest (the grid of photos) and the Indyx and Whering closet apps (how they organize a wardrobe).

## 7. Risks and cuts
- **Least sure I can build:** picking pieces for an outfit. It's a many-to-many form, the trickiest part of the data model.
- **Cut first if I run out of time:** the random outfit pick. Second would be photo upload; I'd keep the photo_url column and add it later.

---

## Plan vs. Reality
*(Filled in at the end.)*

| Planned feature | Shipped / Changed / Cut | Status (Done/Backlogged) | Learning | What changed and why (one line) |
|---|---|---|---|---|
| | | | | |
