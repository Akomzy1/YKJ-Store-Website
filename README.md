# YKJ African & Caribbean Food Store

**"Taste of Home, Delivered to Your Door"**

A full-stack e-commerce website for YKJ African and Caribbean Food Store Limited — selling authentic African, Caribbean, and world foods across the UK.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router, TypeScript) |
| Styling | Tailwind CSS + shadcn/ui |
| State | Zustand (cart + wishlist, persisted to localStorage) |
| Database | Supabase (PostgreSQL + Row Level Security) |
| Auth | Supabase Auth (email/password + Google OAuth) |
| Payments | Stripe (card payments via Elements) |
| Email | Resend (order confirmations) |
| Deployment | Vercel (region: lhr1 — London) |

---

## Project Structure

```
ykj-store/
├── app/
│   ├── (shop)/          # Customer-facing pages
│   │   ├── page.tsx         # Homepage
│   │   ├── shop/            # /shop + /shop/[category]
│   │   ├── product/[slug]/  # Product detail
│   │   ├── cart/            # Cart page
│   │   ├── checkout/        # Multi-step checkout
│   │   └── deals/           # Deals page
│   ├── (account)/       # Auth-protected account pages
│   ├── (info)/          # Static info pages (about, FAQ, etc.)
│   ├── admin/           # Admin dashboard (requires is_admin = true)
│   ├── api/
│   │   ├── checkout/    # Creates Stripe PaymentIntent
│   │   └── webhook/     # Stripe webhook → Supabase order insert
│   ├── auth/callback/   # Supabase OAuth PKCE callback
│   ├── sitemap.ts       # Dynamic sitemap (auto-includes products + categories)
│   └── robots.ts        # robots.txt
├── components/
│   ├── home/            # Homepage sections
│   ├── layout/          # Header, Footer, AnnouncementBar
│   ├── shop/            # ProductCard, ProductGrid, FilterSidebar
│   └── cart/            # CartDrawer
├── lib/
│   ├── supabase.ts          # Browser + admin Supabase clients
│   ├── supabase-server.ts   # Server-side client (cookie-based auth)
│   ├── supabase-queries.ts  # Server-only query helpers (admin client)
│   ├── stripe.ts            # Stripe server client + delivery constants
│   └── utils.ts             # formatPrice, getEffectivePrice, etc.
├── store/
│   └── cartStore.ts     # Zustand cart + wishlist stores
├── supabase/
│   ├── migrations/
│   │   ├── 001_schema.sql   # Full DB schema, RLS, triggers
│   │   └── 002_storage.sql  # Storage buckets + RLS
│   └── seed.sql             # 12 categories + 20 products
└── types/
    └── index.ts         # Product, Order, Category, UserProfile types
```

---

## Local Development Setup

### 1. Install dependencies

```bash
cd ykj-store
npm install
```

### 2. Configure environment variables

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and fill in:

```env
# Supabase — Settings → API
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Stripe — Developers → API Keys
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Resend — API Keys
RESEND_API_KEY=re_...

# Site URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 3. Set up Supabase database

In the Supabase SQL Editor, run these files **in order**:

```
1. supabase/migrations/001_schema.sql   → Creates all tables, RLS, triggers
2. supabase/migrations/002_storage.sql  → Creates storage buckets
3. supabase/seed.sql                    → Inserts 12 categories + 20 products
```

### 4. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 5. Test Stripe payments locally

In a second terminal, forward Stripe webhooks:

```bash
stripe listen --forward-to localhost:3000/api/webhook
```

Copy the `whsec_...` secret it prints and paste it into `.env.local` as `STRIPE_WEBHOOK_SECRET`.

**Test card:** `4242 4242 4242 4242` — any future expiry, any CVC.

---

## Deployment to Vercel

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/your-org/ykj-store.git
git push -u origin main
```

### 2. Import project on Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import the GitHub repository
3. Vercel auto-detects Next.js — click **Deploy**

### 3. Add environment variables

In Vercel project settings → **Environment Variables**, add all variables from `.env.local.example` with production values:

| Variable | Where to find |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Settings → API |
| `STRIPE_SECRET_KEY` | Stripe Dashboard → Developers |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe Dashboard → Developers |
| `STRIPE_WEBHOOK_SECRET` | Stripe Dashboard → Webhooks (add endpoint first) |
| `RESEND_API_KEY` | resend.com → API Keys |
| `NEXT_PUBLIC_SITE_URL` | `https://ykjfoodstore.co.uk` |

### 4. Configure Stripe webhook (production)

In Stripe Dashboard → Developers → Webhooks → **Add endpoint**:
- URL: `https://ykjfoodstore.co.uk/api/webhook`
- Events to listen to: `payment_intent.succeeded`

Copy the signing secret → paste as `STRIPE_WEBHOOK_SECRET` in Vercel.

### 5. Configure Supabase Auth redirect URLs

In Supabase → Authentication → URL Configuration:
- **Site URL:** `https://ykjfoodstore.co.uk`
- **Redirect URLs:** `https://ykjfoodstore.co.uk/auth/callback`

For Google OAuth: Supabase → Authentication → Providers → Google — add your OAuth client ID and secret.

---

## Admin Panel

The admin panel lives at `/admin` and requires `is_admin = true` in the `profiles` table.

**Grant admin access:**

```sql
-- Run in Supabase SQL Editor
UPDATE profiles
SET is_admin = true
WHERE email = 'your-email@example.com';
```

**Admin features:**
- `/admin` — KPI dashboard (total products, orders, today's revenue)
- `/admin/products` — product list with edit links
- `/admin/products/new` — add a product
- `/admin/products/[id]/edit` — edit or delete a product
- `/admin/orders` — view all orders, update status inline

---

## Adding Products

### Option A: Admin Panel (recommended)

1. Log in as an admin user → go to `/admin/products/new`
2. Fill in name, slug (auto-generated), description, price, category, stock
3. Upload the product image: Supabase Dashboard → Storage → `product-images` → Upload
4. Copy the public URL and add it to the product via `/admin/products/[id]/edit`

### Option B: Supabase SQL Editor

```sql
INSERT INTO products (name, slug, description, price, category_id, category, stock_qty, is_halal, images)
VALUES (
  'Fresh Yam',
  'fresh-yam',
  'Nigerian white yam — perfect for pounded yam.',
  3.99,
  '10000000-0000-0000-0000-000000000003',  -- Vegetables
  'Vegetables',
  50,
  true,
  ARRAY[]::text[]
);
```

**Category UUIDs:**
| Category | UUID |
|---|---|
| Meat | `10000000-0000-0000-0000-000000000001` |
| Fish & Seafood | `10000000-0000-0000-0000-000000000002` |
| Vegetables | `10000000-0000-0000-0000-000000000003` |
| Grains & Flour | `10000000-0000-0000-0000-000000000004` |
| Spices & Seasonings | `10000000-0000-0000-0000-000000000005` |
| Canned & Packets | `10000000-0000-0000-0000-000000000006` |
| Cooking Oil | `10000000-0000-0000-0000-000000000007` |
| Drinks | `10000000-0000-0000-0000-000000000008` |
| Frozen Foods | `10000000-0000-0000-0000-000000000009` |
| Sauces & Paste | `10000000-0000-0000-0000-000000000010` |
| Snacks | `10000000-0000-0000-0000-000000000011` |
| Beauty & Household | `10000000-0000-0000-0000-000000000012` |

---

## Architecture Notes

- **No `<Database>` generic on Supabase clients** — our `Database` type lacks `Relationships` arrays, causing all query return types to collapse to `never`. Workaround: cast results via `as unknown as AnyRow[]` throughout `lib/supabase-queries.ts`.
- **Server queries use admin client** (`SUPABASE_SERVICE_ROLE_KEY`) — bypasses RLS. Never import `lib/supabase-queries.ts` from Client Components.
- **ISR on all product pages** — `export const revalidate = 300` (5 min). Products refresh without a full rebuild.
- **Stripe PaymentIntent flow** — `/api/checkout` creates a PaymentIntent; client confirms with `stripe.confirmCardPayment()`; `/api/webhook` handles `payment_intent.succeeded` to write the order to Supabase.
- **Cart/wishlist in localStorage** — Zustand `persist` middleware keeps cart across page refreshes without a server round-trip.

---

## Still Needed from Client

- [ ] Business registered address and phone number
- [ ] Social media handles (Instagram, Facebook, TikTok)
- [ ] Product photos (upload to Supabase Storage → `product-images` bucket)
- [ ] Category banner images (upload to `category-images` bucket)
- [ ] `ykj-hero-poster.jpg` — extract first frame of `ykj-hero-video.mp4` as video fallback
- [ ] Google OAuth app credentials (Client ID + Secret)
- [ ] Verified sender domain for Resend (e.g. `noreply@ykjfoodstore.co.uk`)
- [ ] Target domain / DNS access for Vercel connection

---

*YKJ African and Caribbean Food Store Limited — © 2026*
