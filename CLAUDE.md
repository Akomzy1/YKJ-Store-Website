# CLAUDE.md — YKJ African & Caribbean Food Store Website

## Project Overview

Build a modern, vibrant, and fully functional e-commerce website for **YKJ African and Caribbean Food Store** — an online grocery store specialising in authentic African, Caribbean, and world foods. The site should feel culturally rich, trustworthy, and easy to shop from on both desktop and mobile.

**Reference competitors studied:**
- [Lilbea Foods](https://lilbeafoods.com) — good product categorisation, free delivery incentive banner, WooCommerce-based
- [Samis Online](https://samisonline.com) — clean modern UI, "Products by Nationality" navigation, strong trust signals

---

## Tech Stack

- **Framework:** Next.js 14+ (App Router)
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **State Management:** Zustand (cart, wishlist)
- **Database:** Supabase (products, orders, users)
- **Auth:** Supabase Auth (email/password + Google OAuth)
- **Payments:** Stripe (card payments) + optional PayPal
- **Image Hosting:** Cloudinary or Supabase Storage
- **Email:** Resend (transactional emails — order confirmation, newsletters)
- **Deployment:** Vercel

---

## Brand Identity

| Element       | Value                                                        |
|---------------|--------------------------------------------------------------|
| **Store Name**  | YKJ African and Caribbean Food Store Limited              |
| **Tagline**     | *"Taste of Home, Delivered to Your Door"*                |
| **Primary Color** | Brand Terracotta/Brown `#A0522D` — extracted from logo (shopping cart, palm tree, YKJ lettering) |
| **Primary Dark** | `#7B3F1A` — darker shade for hover states, footer        |
| **Primary Light** | `#C8784A` — lighter tint for backgrounds, highlights   |
| **Secondary Color** | Warm Gold `#F59E0B` (deals badges, CTA buttons, Caribbean warmth) |
| **Accent Color** | Vibrant Red `#DC2626` (sale tags, urgency, countdown timers) |
| **Background** | Off-white `#FAFAF8`                                         |
| **Surface**    | White `#FFFFFF` (cards, modals)                             |
| **Text**       | Dark Charcoal `#1C1C1C`                                     |
| **Text Muted** | `#6B7280`                                                   |
| **Font — Headings** | `Playfair Display` (warm, cultural, premium)         |
| **Font — Body** | `Inter` (clean, readable, modern)                          |

### Logo Asset

- **File:** `public/assets/ykj-logo.jpg` (provided — see attached)
- **Description:** Shopping cart icon with palm tree growing from it, "YKJ" lettering inside the cart, all in brand terracotta/brown on white/light background. Full wordmark reads "African and Caribbean Food Store Limited" beneath the icon.
- **Usage:**
  - Header: Use the icon mark + "YKJ" text only (compact) at `h-10` / `40px` height
  - Footer: Full logo with tagline at `h-14`
  - Favicon: Crop to just the cart+palm icon, export as 32×32 and 180×180 (Apple touch icon)
  - Dark backgrounds: Apply a white filter (`filter: brightness(0) invert(1)`) or use a white variant
- **DO NOT** stretch or recolour the logo. Always maintain aspect ratio.
- **Clear space:** Minimum padding equal to the height of the "Y" letter around all sides

```
Logo colour reference (from file):
  Cart/palm/letters: ~#A0522D (Sienna/Terracotta)
  Background: White / transparent
```

---

## Site Architecture

```
/                          → Homepage
/shop                      → All Products (filterable/sortable)
/shop/[category]           → Category page
/product/[slug]            → Product detail page
/cart                      → Shopping cart
/checkout                  → Checkout flow
/account                   → User account dashboard
/account/orders            → Order history
/deals                     → Daily/weekly deals
/recipes                   → Recipes blog (optional Phase 2)
/about                     → About YKJ
/contact                   → Contact page
/blog                      → News & tips (optional Phase 2)
/faq                       → FAQ
/delivery-info             → Delivery & returns info
/privacy-policy            → Privacy policy
/terms                     → Terms & conditions
```

---

## Page-by-Page Specifications

### 1. Homepage (`/`)

**Sections (top to bottom):**

1. **Top Announcement Bar**
   - Scrolling ticker: free delivery thresholds, current promotions
   - Background: Primary Green. Text: White.
   - Example: "🚚 Free delivery on orders over £60 | 🌍 Authentic African & Caribbean groceries | 📦 Fast UK delivery"

2. **Header / Navigation**
   - Logo (left): YKJ wordmark + icon (e.g., a stylised mortar & pestle or African pot)
   - Search bar (centre): prominent, with category dropdown filter
   - Right icons: Account, Wishlist (heart), Cart (bag with item count badge)
   - Below header: horizontal scrollable category nav (Meat, Fish, Vegetables, Grains, Spices, Drinks, etc.)

3. **Hero Banner — Video Background**
   - **Asset:** `public/assets/ykj-hero-video.mp4` (provided — branded YKJ promotional video)
   - Full-viewport-width video hero (`min-h-[85vh]` on desktop, `min-h-[60vh]` on mobile)
   - Video plays **autoplay, muted, loop, playsInline** — no controls shown
   - Apply a **dark gradient overlay** on top of video: `bg-gradient-to-r from-black/70 via-black/50 to-transparent` so text is always legible
   - **Fallback:** If video fails to load, use a high-quality food photography image as `poster` attribute and CSS background fallback
   - **Performance:** Lazy-load the video on mobile. Consider serving a static image poster for mobile users to avoid data usage, with option to play on tap.

   **Hero content (overlaid on video, left-aligned, centred on mobile):**
   ```
   Eyebrow tag: "🌍 Authentic African & Caribbean Groceries"
   H1: "Taste of Home,"
       "Delivered to Your Door"
   Subheadline: "Fresh, quality groceries from across Africa and the Caribbean — 
                  delivered fast across the UK."
   CTA Row:
     [Shop Now →]  (primary button — brand terracotta bg, white text)
     [View Today's Deals]  (secondary — white outline, white text)
   ```

   **Implementation:**
   ```tsx
   // components/home/HeroBanner.tsx
   <section className="relative min-h-[85vh] flex items-center overflow-hidden">
     <video
       autoPlay
       muted
       loop
       playsInline
       poster="/assets/ykj-hero-poster.jpg"
       className="absolute inset-0 w-full h-full object-cover"
     >
       <source src="/assets/ykj-hero-video.mp4" type="video/mp4" />
     </video>
     {/* Gradient overlay */}
     <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
     {/* Content */}
     <div className="relative z-10 container mx-auto px-4 md:px-8">
       ...hero text and CTAs...
     </div>
   </section>
   ```

   - On mobile (`< md`), switch overlay to `from-black/75 to-black/50` for full readability
   - Add subtle **scroll-down chevron** animation at bottom of hero
   - Hero section should be the **first thing users see** — no top padding wasted

4. **Trust Badges Strip**
   - 4 icons in a row: 🚚 Fast Delivery | 🌿 Quality Products | 💷 Fair Prices | ⭐ Trusted by Customers

5. **Category Grid**
   - 3×3 or 4×3 responsive card grid
   - Each card: category image, category name, "Shop Now" link
   - Categories: Meat, Fish & Seafood, Vegetables, Grains & Flour, Spices & Seasonings, Canned & Packets, Cooking Oil, Drinks, Frozen Foods, Beauty & Household, Snacks, Sauces & Paste

6. **Deals of the Day**
   - Countdown timer per deal
   - Product cards with original price struck through, discount badge
   - "View All Deals" CTA

7. **Featured / New Arrivals Products**
   - Tabbed section: "New Arrivals" | "Best Sellers" | "On Offer"
   - Horizontally scrollable product cards on mobile, 4-column grid on desktop
   - Each card: image, category tag, product name, price, "Add to Cart" button, wishlist icon

8. **Shop by Nationality / Origin** *(differentiator — inspired by Samis)*
   - Flag + region chips: 🇳🇬 Nigerian | 🇬🇭 Ghanaian | 🇯🇲 Jamaican | 🇨🇲 Cameroonian | 🇿🇦 South African | 🇿🇼 Zimbabwean | 🇨🇩 Congolese | 🌍 Pan-African
   - Clicking filters products to that origin

9. **Promotional Banner** (mid-page)
   - Full-width banner: "🌿 Fresh Vegetables & Frozen Meat — Order before 2PM for next-day delivery"

10. **Testimonials / Reviews**
    - 3-column card layout of Google Reviews with star ratings and customer names
    - "Read more reviews on Google" CTA

11. **Newsletter Sign-Up**
    - Bold section: "Get Weekly Deals in Your Inbox"
    - Email input + Subscribe button
    - Reassurance: "No spam. Unsubscribe anytime."

12. **Footer**
    - Logo + short brand description
    - Links: Quick Links | Help & Support | Legal
    - Contact: address, phone, email
    - Social icons: Instagram, Facebook, TikTok, WhatsApp
    - Payment icons: Visa, Mastercard, PayPal, Apple Pay
    - Copyright

---

### 2. Shop / Category Pages

- Left sidebar (desktop): filters by Price Range, Origin/Nationality, Brand, Dietary (Halal, Vegan), In Stock only
- Top bar: result count, sort options (Price low-high, Newest, Best Seller, Rating)
- Product grid: 2 cols mobile, 3 cols tablet, 4 cols desktop
- Infinite scroll OR pagination (prefer pagination with "Load More")
- Sticky "Filter" button on mobile that opens drawer

---

### 3. Product Detail Page

- Image gallery (main image + thumbnails, zoom on hover)
- Product name, category breadcrumb
- Price (sale price if applicable, original struck through)
- Short description
- Weight/size variant selector (if applicable)
- Quantity picker + "Add to Cart" button (sticky on mobile)
- "Add to Wishlist" link
- Product details tabs: Description | Ingredients / Nutritional Info | Delivery Info | Reviews
- Related products carousel at bottom

---

### 4. Cart & Checkout

**Cart:**
- Line items with image, name, quantity stepper, subtotal, remove button
- Order summary sidebar: subtotal, delivery estimate, total
- Promo code / discount input
- "Continue Shopping" + "Proceed to Checkout" CTAs

**Checkout (multi-step):**
1. Delivery Address (postcode lookup / manual entry)
2. Delivery Method (Standard, Express, Click & Collect if applicable)
3. Payment (Stripe card form, PayPal button)
4. Order Review + Place Order
5. Confirmation page with order number + email confirmation sent

---

### 5. User Account Dashboard

- Order history with status tracking (Pending, Processing, Shipped, Delivered)
- Saved addresses
- Wishlist
- Account settings (name, email, password, marketing prefs)

---

## Product Categories

| Category | Examples |
|---|---|
| Meat | Goat, Cow Foot, Oxtail, Turkey Wings, Chicken |
| Fish & Seafood | Tilapia, Titus (Mackerel), Catfish, Shrimp, Dry Fish |
| Vegetables | Scotch Bonnet, Plantain, Yam, Sweet Potato, Okra, Egusi |
| Grains & Flour | Poundo Yam, Eba/Garri, Semovita, Rice, Fufu, Corn Dough |
| Spices & Seasonings | Maggi, Royco, Suya Spice, Curry, Thyme, Crayfish |
| Canned & Packets | Baked Beans, Coconut Milk, Ackee, Sardines, Tomato Paste |
| Cooking Oil | Palm Oil, Vegetable Oil, Coconut Oil |
| Drinks | Malta, Tropical Juices, Aloe Vera, Ginger Beer, Wine |
| Frozen Foods | Frozen Fish, Frozen Meat, Frozen Veg |
| Sauces & Paste | Jollof Sauce, Curry Sauce, Groundnut Paste, Pepper Sauce |
| Snacks | Chin Chin, Plantain Chips, Biscuits, Indomie |
| Beauty & Household | Black Soap, Shea Butter, Relaxers, Dudu-Osun |

---

## Key Features to Implement

### Must Have (Phase 1)
- [x] Responsive design (mobile-first)
- [x] Product catalogue with categories and search
- [x] Shopping cart (persisted via localStorage/Zustand)
- [x] User auth (register, login, password reset)
- [x] Checkout with Stripe payments
- [x] Order confirmation email (Resend)
- [x] Admin product management (Supabase table or simple admin page)
- [x] Delivery info page
- [x] SEO: meta tags, sitemap, Open Graph tags

### Nice to Have (Phase 2)
- [ ] Wishlist (saved products)
- [ ] Product reviews / ratings
- [ ] Shop by Nationality / Origin filter
- [ ] Deals countdown timer
- [ ] Newsletter integration (Mailchimp or Resend)
- [ ] Recipe blog
- [ ] Loyalty points system
- [ ] WhatsApp order support button (sticky floating button)
- [ ] Google Analytics / Meta Pixel

---

## UI/UX Principles

1. **Mobile-first** — most customers will browse on phones. Large tap targets, sticky cart button, easy checkout.
2. **Fast** — optimise images with Next.js Image component, lazy load below-fold content.
3. **Cultural authenticity** — use warm, earthy colours and food photography that reflects African and Caribbean cuisine. Avoid generic stock photos.
4. **Clear pricing** — never hide delivery costs. Show free delivery threshold in header.
5. **Trust signals** — Google reviews, secure payment badges, clear returns policy link.
6. **Accessibility** — WCAG 2.1 AA. Proper alt text on all product images, keyboard navigation, sufficient colour contrast.

---

## Component Library

Use **shadcn/ui** for:
- Button, Input, Select, Checkbox, RadioGroup
- Dialog / Sheet (mobile cart drawer, filter drawer)
- Badge (product tags, deal badges)
- Tabs (product detail page)
- Toast (add to cart confirmation, error messages)
- Skeleton (loading states)
- Accordion (FAQ page)

Custom components to build:
- `ProductCard` — image, name, price, add-to-cart, wishlist
- `CategoryCard` — image, name, link
- `AnnouncementBar` — scrolling ticker
- `CartDrawer` — slide-in cart panel
- `CountdownTimer` — deals timer
- `StarRating` — review stars
- `QuantityPicker` — increment/decrement
- `FilterSidebar` — desktop filter panel
- `FilterDrawer` — mobile filter sheet

---

## File Structure

```
ykj-store/
├── public/
│   ├── assets/
│   │   ├── ykj-logo.jpg           # ✅ PROVIDED — full logo with wordmark
│   │   ├── ykj-logo.svg           # Convert from jpg (trace in Inkscape/Figma for clean SVG)
│   │   ├── ykj-icon.png           # Crop: just cart+palm icon (for favicon, app icon)
│   │   ├── ykj-hero-video.mp4     # ✅ PROVIDED — hero section background video
│   │   └── ykj-hero-poster.jpg    # Extract first frame of video as fallback image
│   └── favicon.ico
├── app/
│   ├── (shop)/
│   │   ├── page.tsx              # Homepage
│   │   ├── shop/page.tsx         # All products
│   │   ├── shop/[category]/page.tsx
│   │   ├── product/[slug]/page.tsx
│   │   ├── cart/page.tsx
│   │   ├── checkout/page.tsx
│   │   └── deals/page.tsx
│   ├── (account)/
│   │   ├── account/page.tsx
│   │   └── account/orders/page.tsx
│   ├── (info)/
│   │   ├── about/page.tsx
│   │   ├── contact/page.tsx
│   │   ├── faq/page.tsx
│   │   └── delivery-info/page.tsx
│   ├── api/
│   │   ├── checkout/route.ts     # Stripe checkout session
│   │   └── webhook/route.ts      # Stripe webhook
│   └── layout.tsx
├── components/
│   ├── ui/                       # shadcn components
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── AnnouncementBar.tsx
│   │   └── CategoryNav.tsx
│   ├── shop/
│   │   ├── ProductCard.tsx
│   │   ├── ProductGrid.tsx
│   │   ├── CategoryCard.tsx
│   │   ├── FilterSidebar.tsx
│   │   └── SearchBar.tsx
│   ├── home/
│   │   ├── HeroBanner.tsx
│   │   ├── TrustBadges.tsx
│   │   ├── DealsSection.tsx
│   │   ├── FeaturedProducts.tsx
│   │   ├── NationalityFilter.tsx
│   │   └── Testimonials.tsx
│   └── cart/
│       ├── CartDrawer.tsx
│       ├── CartItem.tsx
│       └── CartSummary.tsx
├── lib/
│   ├── supabase.ts
│   ├── stripe.ts
│   └── utils.ts
├── store/
│   └── cartStore.ts              # Zustand cart state
├── types/
│   └── index.ts                  # Product, Order, User types
└── CLAUDE.md
```

---

## Tailwind Config — Brand Colours

Update `tailwind.config.ts` to include the YKJ brand palette extracted from the logo:

```ts
// tailwind.config.ts
theme: {
  extend: {
    colors: {
      brand: {
        50:  '#FDF4EE',
        100: '#F9E4D0',
        200: '#F0C4A0',
        300: '#E5A070',
        400: '#D47A48',
        500: '#A0522D',  // ← Primary brand terracotta (logo colour)
        600: '#7B3F1A',  // ← Dark variant
        700: '#5E2F11',
        800: '#42200B',
        900: '#261206',
      },
      gold: {
        400: '#FBBF24',
        500: '#F59E0B',  // ← Secondary (deals, CTAs)
        600: '#D97706',
      },
    },
    fontFamily: {
      heading: ['Playfair Display', 'Georgia', 'serif'],
      body:    ['Inter', 'system-ui', 'sans-serif'],
    },
  },
},
```

## Provided Assets Summary

| Asset | File | Status | Usage |
|---|---|---|---|
| Logo (full) | `ykj-logo.jpg` | ✅ Provided | Header, footer, OG image |
| Hero video | `ykj-hero-video.mp4` | ✅ Provided | Homepage hero background |
| Logo (SVG) | `ykj-logo.svg` | ⚠️ Convert from JPG | Scalable use, favicon generation |
| Hero poster | `ykj-hero-poster.jpg` | ⚠️ Extract from video | Video fallback, mobile |
| Category images | — | ❌ Needed | Category grid cards |
| Product images | — | ❌ Needed from client | Product listings |
| Team/about photo | — | ❌ Needed from client | About page |

> **Note for Claude Code:** When referencing the logo in code, use `<Image src="/assets/ykj-logo.jpg" alt="YKJ African and Caribbean Food Store" />` with Next.js Image component. The logo's dominant colour is `#A0522D` — use this to match brand styling around the logo.

```sql
-- Products
products (id, name, slug, description, price, sale_price, category_id, origin, brand, images[], stock_qty, weight, is_featured, created_at)

-- Categories
categories (id, name, slug, image_url, parent_id)

-- Orders
orders (id, user_id, status, subtotal, delivery_cost, total, delivery_address, payment_intent_id, created_at)

-- Order Items
order_items (id, order_id, product_id, quantity, unit_price)

-- Users (extends Supabase auth.users)
profiles (id, full_name, phone, default_address)
```

---

## Delivery Logic

- Free delivery over £X threshold (confirm amount with client — suggest £60)
- Standard delivery: 2–4 working days
- Express delivery: next working day (order before 2PM)
- Delivery zones: UK mainland. Highlands and islands may incur surcharge.
- Click & Collect option (if physical store location confirmed)
- Postcode-based delivery eligibility check at checkout

---

## SEO & Marketing

- **Page titles:** "Buy [Product Name] Online UK | YKJ African & Caribbean Food Store"
- **Meta descriptions:** focus on authenticity, fast delivery, UK-wide
- **Schema markup:** Product schema (price, availability, reviews), LocalBusiness schema
- **Sitemap:** auto-generated with next-sitemap
- **Open Graph:** product images for social sharing
- **WhatsApp floating button:** "+44 XXXX XXXXXX — Chat with us"

---

## Content / Copy Guidelines

- Tone: Warm, community-focused, knowledgeable
- Speak to the diaspora community — acknowledge nostalgia, cultural connection to food
- Avoid generic supermarket language; instead: "Authentic", "Just like back home", "Hand-selected", "Community-trusted"
- All prices in GBP (£)
- Spelling: British English (colour, flavour, centre)

---

## Things to Confirm with Client (YKJ)

- [ ] Business address / registered address
- [ ] Phone number and email for contact page
- [ ] Social media handles (Instagram, Facebook, TikTok)
- [ ] Logo files (SVG preferred)
- [ ] Product list with images, descriptions, prices
- [ ] Delivery pricing and free delivery threshold
- [ ] Does YKJ have a physical store? (Click & Collect?)
- [ ] Any existing customer email list for newsletter
- [ ] Preferred payment methods (Stripe, PayPal, etc.)
- [ ] Target launch date

---

## Development Phases

| Phase | Scope | Timeline |
|---|---|---|
| 1 — Foundation | Setup, design system, homepage, product pages, cart | Week 1–2 |
| 2 — Commerce | Checkout, Stripe, auth, orders, email confirmation | Week 3–4 |
| 3 — Polish | Deals, filters, reviews, SEO, mobile QA | Week 5 |
| 4 — Launch | Performance, accessibility audit, deployment, DNS | Week 6 |

---

*Last updated: February 2026 | Project: YKJ African & Caribbean Food Store*
