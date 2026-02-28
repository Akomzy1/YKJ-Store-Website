-- ─── YKJ Store — Seed Data ───────────────────────────────────────────────────
-- 12 categories + 20 products matching lib/mockData.ts
-- Uses fixed UUIDs so FK references are stable across environments.
-- Run AFTER 001_schema.sql and 002_storage.sql.
-- ─────────────────────────────────────────────────────────────────────────────

-- ── Categories ────────────────────────────────────────────────────────────────

insert into categories (id, name, slug) values
  ('10000000-0000-0000-0000-000000000001', 'Meat',                'meat'),
  ('10000000-0000-0000-0000-000000000002', 'Fish & Seafood',      'fish-seafood'),
  ('10000000-0000-0000-0000-000000000003', 'Vegetables',          'vegetables'),
  ('10000000-0000-0000-0000-000000000004', 'Grains & Flour',      'grains-flour'),
  ('10000000-0000-0000-0000-000000000005', 'Spices & Seasonings', 'spices-seasonings'),
  ('10000000-0000-0000-0000-000000000006', 'Canned & Packets',    'canned-packets'),
  ('10000000-0000-0000-0000-000000000007', 'Cooking Oil',         'cooking-oil'),
  ('10000000-0000-0000-0000-000000000008', 'Drinks',              'drinks'),
  ('10000000-0000-0000-0000-000000000009', 'Frozen Foods',        'frozen-foods'),
  ('10000000-0000-0000-0000-000000000010', 'Sauces & Paste',      'sauces-paste'),
  ('10000000-0000-0000-0000-000000000011', 'Snacks',              'snacks'),
  ('10000000-0000-0000-0000-000000000012', 'Beauty & Household',  'beauty-household')
on conflict (id) do nothing;

-- ── Products ──────────────────────────────────────────────────────────────────

insert into products (
  id, name, slug, description,
  price, sale_price,
  category_id, category,
  origin, brand,
  stock_qty, weight, unit,
  is_featured, is_deal, deal_ends_at,
  is_halal, is_vegan,
  created_at
) values

-- ── Meat ──────────────────────────────────────────────────────────────────────
(
  '20000000-0000-0000-0000-000000000001',
  'Fresh Goat Meat (Bone-In)',
  'fresh-goat-meat-bone-in',
  'Authentic bone-in goat meat — perfect for Nigerian pepper soup, Ghanaian light soup, or Jamaican curry goat. Halal-certified, freshly butchered.',
  9.99, null,
  '10000000-0000-0000-0000-000000000001', 'Meat',
  'nigerian', null,
  40, 1, 'kg',
  true, false, null,
  true, false,
  '2026-01-10T09:00:00Z'
),
(
  '20000000-0000-0000-0000-000000000002',
  'Jamaican Oxtail',
  'jamaican-oxtail',
  'Slow-cook oxtail — the heart of Jamaican oxtail stew with butter beans. Halal-certified, cut into generous pieces.',
  13.99, 11.49,
  '10000000-0000-0000-0000-000000000001', 'Meat',
  'jamaican', null,
  25, 1, 'kg',
  true, true, '2026-03-01T23:59:00Z',
  true, false,
  '2026-01-12T09:00:00Z'
),

-- ── Fish & Seafood ────────────────────────────────────────────────────────────
(
  '20000000-0000-0000-0000-000000000003',
  'Titus Mackerel (Frozen, Whole)',
  'titus-mackerel-frozen-whole',
  'Nigerian favourite — Titus mackerel (Scomber japonicus). Ideal for tomato stew, jollof rice, or fried fish. Sold per fish.',
  3.49, null,
  '10000000-0000-0000-0000-000000000002', 'Fish & Seafood',
  'nigerian', null,
  80, 400, 'g',
  false, false, null,
  true, false,
  '2026-01-15T09:00:00Z'
),
(
  '20000000-0000-0000-0000-000000000004',
  'Dry Catfish (Panla)',
  'dry-catfish-panla',
  'Sun-dried catfish — essential for authentic Nigerian egusi soup, banga soup, and Ghanaian groundnut soup. Strong, smoky flavour.',
  5.49, null,
  '10000000-0000-0000-0000-000000000002', 'Fish & Seafood',
  'nigerian', null,
  60, 300, 'g',
  false, false, null,
  true, false,
  '2026-01-16T09:00:00Z'
),

-- ── Vegetables ────────────────────────────────────────────────────────────────
(
  '20000000-0000-0000-0000-000000000005',
  'Scotch Bonnet Peppers',
  'scotch-bonnet-peppers',
  'Fresh scotch bonnet chillies — fiery Caribbean heat essential for Jamaican jerk, Nigerian stews, and Ghanaian soups. Use sparingly or generously!',
  1.99, null,
  '10000000-0000-0000-0000-000000000003', 'Vegetables',
  'jamaican', null,
  120, 200, 'g',
  false, false, null,
  true, true,
  '2026-01-18T09:00:00Z'
),
(
  '20000000-0000-0000-0000-000000000006',
  'Ripe Plantain',
  'ripe-plantain',
  'Sweet, ripe yellow plantain — ready to fry as dodo or bake. A staple across West Africa and the Caribbean. Sold per finger.',
  0.99, null,
  '10000000-0000-0000-0000-000000000003', 'Vegetables',
  'ghanaian', null,
  200, null, 'each',
  true, false, null,
  true, true,
  '2026-01-19T09:00:00Z'
),

-- ── Grains & Flour ────────────────────────────────────────────────────────────
(
  '20000000-0000-0000-0000-000000000007',
  'Tropiway Poundo Yam Flour',
  'tropiway-poundo-yam-flour',
  'Smooth, stretchy pounded yam made in minutes. Tropiway''s Poundo is the most popular brand for West African fufu lovers across the UK.',
  4.29, 3.79,
  '10000000-0000-0000-0000-000000000004', 'Grains & Flour',
  'nigerian', 'Tropiway',
  150, 1800, 'g',
  true, true, '2026-03-05T23:59:00Z',
  true, true,
  '2026-01-20T09:00:00Z'
),
(
  '20000000-0000-0000-0000-000000000008',
  'White Garri (Ijebu)',
  'white-garri-ijebu',
  'Fine-grain Ijebu garri — fermented cassava granules for making eba (stiff dough) or soaking in cold water for a quick snack. Nigerian staple.',
  3.49, null,
  '10000000-0000-0000-0000-000000000004', 'Grains & Flour',
  'nigerian', null,
  90, 2, 'kg',
  false, false, null,
  true, true,
  '2026-01-21T09:00:00Z'
),

-- ── Spices & Seasonings ───────────────────────────────────────────────────────
(
  '20000000-0000-0000-0000-000000000009',
  'Suya Spice Mix (Yaji)',
  'suya-spice-mix-yaji',
  'Authentic Northern Nigerian suya spice — ground groundnut, ginger, paprika, and secret spices. Perfect for suya skewers, grilled chicken, and BBQ.',
  2.99, null,
  '10000000-0000-0000-0000-000000000005', 'Spices & Seasonings',
  'nigerian', null,
  75, 100, 'g',
  false, false, null,
  true, true,
  '2026-01-22T09:00:00Z'
),
(
  '20000000-0000-0000-0000-000000000010',
  'Ground Crayfish',
  'ground-crayfish',
  'Finely ground dried crayfish — an essential umami-rich seasoning for egusi soup, banga, okra soup, and most West African stews and soups.',
  3.99, null,
  '10000000-0000-0000-0000-000000000005', 'Spices & Seasonings',
  'nigerian', null,
  55, 200, 'g',
  false, false, null,
  true, false,
  '2026-01-23T09:00:00Z'
),

-- ── Canned & Packets ──────────────────────────────────────────────────────────
(
  '20000000-0000-0000-0000-000000000011',
  'Grace Ackee (Canned)',
  'grace-ackee-canned',
  'Grace canned ackee — Jamaica''s national fruit. The essential ingredient for ackee and saltfish, Jamaica''s national dish. Ready to use.',
  3.79, null,
  '10000000-0000-0000-0000-000000000006', 'Canned & Packets',
  'jamaican', 'Grace',
  110, 540, 'g',
  true, false, null,
  true, true,
  '2026-01-24T09:00:00Z'
),
(
  '20000000-0000-0000-0000-000000000012',
  'Laila Coconut Milk',
  'laila-coconut-milk',
  'Rich, creamy coconut milk — perfect for Caribbean rice and peas, Ghanaian kontomire stew, or Nigerian coconut jollof rice. No preservatives.',
  1.49, null,
  '10000000-0000-0000-0000-000000000006', 'Canned & Packets',
  'jamaican', 'Laila',
  200, 400, 'ml',
  false, false, null,
  true, true,
  '2026-01-25T09:00:00Z'
),

-- ── Cooking Oil ───────────────────────────────────────────────────────────────
(
  '20000000-0000-0000-0000-000000000013',
  'Red Palm Oil',
  'red-palm-oil',
  'Unrefined red palm oil — the cornerstone of West African cooking. Essential for banga soup, egusi, and authentic jollof rice. Rich in beta-carotene.',
  6.49, 5.49,
  '10000000-0000-0000-0000-000000000007', 'Cooking Oil',
  'ghanaian', null,
  65, 2, 'L',
  true, true, '2026-02-28T23:59:00Z',
  true, true,
  '2026-01-26T09:00:00Z'
),

-- ── Drinks ────────────────────────────────────────────────────────────────────
(
  '20000000-0000-0000-0000-000000000014',
  'Malta Guinness (Can)',
  'malta-guinness-can',
  'Non-alcoholic malt drink — a beloved West African classic. Rich, slightly sweet, and full of B vitamins. Great chilled or at room temperature.',
  1.29, null,
  '10000000-0000-0000-0000-000000000008', 'Drinks',
  'nigerian', 'Malta Guinness',
  300, 330, 'ml',
  false, false, null,
  true, true,
  '2026-01-27T09:00:00Z'
),
(
  '20000000-0000-0000-0000-000000000015',
  'Rubicon Mango Juice (Can)',
  'rubicon-mango-juice-can',
  'Exotic mango juice drink — a UK Caribbean community favourite. Sweet, tropical, and refreshing. Perfect with jerk chicken or on its own.',
  1.09, null,
  '10000000-0000-0000-0000-000000000008', 'Drinks',
  'jamaican', 'Rubicon',
  250, 330, 'ml',
  false, false, null,
  true, true,
  '2026-01-28T09:00:00Z'
),

-- ── Frozen Foods ──────────────────────────────────────────────────────────────
(
  '20000000-0000-0000-0000-000000000016',
  'Frozen Whole Tilapia',
  'frozen-whole-tilapia',
  'Whole frozen tilapia — gutted and scaled, ready to fry, grill, or steam. A versatile fish beloved across Nigeria, Ghana, and the Caribbean.',
  8.49, null,
  '10000000-0000-0000-0000-000000000009', 'Frozen Foods',
  'ghanaian', null,
  45, 1, 'kg',
  false, false, null,
  true, false,
  '2026-01-29T09:00:00Z'
),

-- ── Sauces & Paste ────────────────────────────────────────────────────────────
(
  '20000000-0000-0000-0000-000000000017',
  'Ghanaian Groundnut Paste',
  'ghanaian-groundnut-paste',
  'Stone-ground roasted peanut paste — the base for Ghanaian groundnut soup (nkate nkwan). Natural, no added sugar or palm oil. Also great as peanut butter.',
  4.99, null,
  '10000000-0000-0000-0000-000000000010', 'Sauces & Paste',
  'ghanaian', null,
  50, 500, 'g',
  false, false, null,
  true, true,
  '2026-01-30T09:00:00Z'
),

-- ── Snacks ────────────────────────────────────────────────────────────────────
(
  '20000000-0000-0000-0000-000000000018',
  'Nigerian Chin Chin',
  'nigerian-chin-chin',
  'Crunchy, lightly sweet fried dough snack — a Nigerian party classic. This batch is coconut-flavoured and made fresh. Great for gifting too.',
  4.49, 3.49,
  '10000000-0000-0000-0000-000000000011', 'Snacks',
  'nigerian', null,
  70, 400, 'g',
  true, true, '2026-03-03T23:59:00Z',
  true, true,
  '2026-01-31T09:00:00Z'
),
(
  '20000000-0000-0000-0000-000000000019',
  'Plantain Chips (Salted)',
  'plantain-chips-salted',
  'Thinly sliced, lightly salted plantain chips — crispy, moreish, and naturally gluten-free. A healthier African snack alternative to crisps.',
  2.49, null,
  '10000000-0000-0000-0000-000000000011', 'Snacks',
  'ghanaian', null,
  130, 150, 'g',
  false, false, null,
  true, true,
  '2026-02-01T09:00:00Z'
),

-- ── Beauty & Household ────────────────────────────────────────────────────────
(
  '20000000-0000-0000-0000-000000000020',
  'Dudu-Osun African Black Soap',
  'dudu-osun-african-black-soap',
  'Original Dudu-Osun black soap from Nigeria — made with shea butter, palm kernel oil, and honey. Naturally cleanses, moisturises, and brightens skin.',
  3.99, null,
  '10000000-0000-0000-0000-000000000012', 'Beauty & Household',
  'nigerian', 'Dudu-Osun',
  90, 150, 'g',
  false, false, null,
  true, false,
  '2026-02-02T09:00:00Z'
)

on conflict (id) do nothing;
