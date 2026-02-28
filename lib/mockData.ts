// ─────────────────────────────────────────────────────────────────────────────
// YKJ Store — Mock Product Data (development only)
// Replace with live Supabase queries once the DB is seeded.
// 20 products across all 12 categories, realistic UK prices.
// ─────────────────────────────────────────────────────────────────────────────

import { Product, Category, Origin } from "@/types";

// ─── Origins ─────────────────────────────────────────────────────────────────

export const ORIGINS: Origin[] = [
  { id: "o1", name: "Nigerian",      slug: "nigerian",      flag_emoji: "🇳🇬", country_code: "NG" },
  { id: "o2", name: "Ghanaian",      slug: "ghanaian",      flag_emoji: "🇬🇭", country_code: "GH" },
  { id: "o3", name: "Jamaican",      slug: "jamaican",      flag_emoji: "🇯🇲", country_code: "JM" },
  { id: "o4", name: "Cameroonian",   slug: "cameroonian",   flag_emoji: "🇨🇲", country_code: "CM" },
  { id: "o5", name: "South African", slug: "south-african", flag_emoji: "🇿🇦", country_code: "ZA" },
  { id: "o6", name: "Zimbabwean",    slug: "zimbabwean",    flag_emoji: "🇿🇼", country_code: "ZW" },
  { id: "o7", name: "Congolese",     slug: "congolese",     flag_emoji: "🇨🇩", country_code: "CD" },
  { id: "o8", name: "Pan-African",   slug: "pan-african",   flag_emoji: "🌍", country_code: "XX" },
];

// ─── Categories ───────────────────────────────────────────────────────────────

export const CATEGORIES: Category[] = [
  { id: "c1",  name: "Meat",                slug: "meat",                image_url: null, parent_id: null, product_count: 2 },
  { id: "c2",  name: "Fish & Seafood",      slug: "fish-seafood",        image_url: null, parent_id: null, product_count: 2 },
  { id: "c3",  name: "Vegetables",          slug: "vegetables",          image_url: null, parent_id: null, product_count: 2 },
  { id: "c4",  name: "Grains & Flour",      slug: "grains-flour",        image_url: null, parent_id: null, product_count: 2 },
  { id: "c5",  name: "Spices & Seasonings", slug: "spices-seasonings",   image_url: null, parent_id: null, product_count: 2 },
  { id: "c6",  name: "Canned & Packets",    slug: "canned-packets",      image_url: null, parent_id: null, product_count: 2 },
  { id: "c7",  name: "Cooking Oil",         slug: "cooking-oil",         image_url: null, parent_id: null, product_count: 1 },
  { id: "c8",  name: "Drinks",              slug: "drinks",              image_url: null, parent_id: null, product_count: 2 },
  { id: "c9",  name: "Frozen Foods",        slug: "frozen-foods",        image_url: null, parent_id: null, product_count: 1 },
  { id: "c10", name: "Sauces & Paste",      slug: "sauces-paste",        image_url: null, parent_id: null, product_count: 1 },
  { id: "c11", name: "Snacks",              slug: "snacks",              image_url: null, parent_id: null, product_count: 2 },
  { id: "c12", name: "Beauty & Household",  slug: "beauty-household",    image_url: null, parent_id: null, product_count: 1 },
];

// ─── Products ─────────────────────────────────────────────────────────────────

export const MOCK_PRODUCTS: Product[] = [
  // ── Meat ───────────────────────────────────────────────────────────────────
  {
    id: "p1",
    name: "Fresh Goat Meat (Bone-In)",
    slug: "fresh-goat-meat-bone-in",
    description:
      "Authentic bone-in goat meat — perfect for Nigerian pepper soup, Ghanaian light soup, or Jamaican curry goat. Halal-certified, freshly butchered.",
    price: 9.99,
    sale_price: null,
    category_id: "c1",
    category: "Meat",
    origin: "nigerian",
    brand: null,
    images: [],
    stock_qty: 40,
    weight: 1,
    unit: "kg",
    is_featured: true,
    is_deal: false,
    deal_ends_at: null,
    is_halal: true,
    is_vegan: false,
    created_at: "2026-01-10T09:00:00Z",
  },
  {
    id: "p2",
    name: "Jamaican Oxtail",
    slug: "jamaican-oxtail",
    description:
      "Slow-cook oxtail — the heart of Jamaican oxtail stew with butter beans. Halal-certified, cut into generous pieces.",
    price: 13.99,
    sale_price: 11.49,
    category_id: "c1",
    category: "Meat",
    origin: "jamaican",
    brand: null,
    images: [],
    stock_qty: 25,
    weight: 1,
    unit: "kg",
    is_featured: true,
    is_deal: true,
    deal_ends_at: "2026-03-01T23:59:00Z",
    is_halal: true,
    is_vegan: false,
    created_at: "2026-01-12T09:00:00Z",
  },

  // ── Fish & Seafood ─────────────────────────────────────────────────────────
  {
    id: "p3",
    name: "Titus Mackerel (Frozen, Whole)",
    slug: "titus-mackerel-frozen-whole",
    description:
      "Nigerian favourite — Titus mackerel (Scomber japonicus). Ideal for tomato stew, jollof rice, or fried fish. Sold per fish.",
    price: 3.49,
    sale_price: null,
    category_id: "c2",
    category: "Fish & Seafood",
    origin: "nigerian",
    brand: null,
    images: [],
    stock_qty: 80,
    weight: 400,
    unit: "g",
    is_featured: false,
    is_deal: false,
    deal_ends_at: null,
    is_halal: true,
    is_vegan: false,
    created_at: "2026-01-15T09:00:00Z",
  },
  {
    id: "p4",
    name: "Dry Catfish (Panla)",
    slug: "dry-catfish-panla",
    description:
      "Sun-dried catfish — essential for authentic Nigerian egusi soup, banga soup, and Ghanaian groundnut soup. Strong, smoky flavour.",
    price: 5.49,
    sale_price: null,
    category_id: "c2",
    category: "Fish & Seafood",
    origin: "nigerian",
    brand: null,
    images: [],
    stock_qty: 60,
    weight: 300,
    unit: "g",
    is_featured: false,
    is_deal: false,
    deal_ends_at: null,
    is_halal: true,
    is_vegan: false,
    created_at: "2026-01-16T09:00:00Z",
  },

  // ── Vegetables ─────────────────────────────────────────────────────────────
  {
    id: "p5",
    name: "Scotch Bonnet Peppers",
    slug: "scotch-bonnet-peppers",
    description:
      "Fresh scotch bonnet chillies — fiery Caribbean heat essential for Jamaican jerk, Nigerian stews, and Ghanaian soups. Use sparingly or generously!",
    price: 1.99,
    sale_price: null,
    category_id: "c3",
    category: "Vegetables",
    origin: "jamaican",
    brand: null,
    images: [],
    stock_qty: 120,
    weight: 200,
    unit: "g",
    is_featured: false,
    is_deal: false,
    deal_ends_at: null,
    is_halal: true,
    is_vegan: true,
    created_at: "2026-01-18T09:00:00Z",
  },
  {
    id: "p6",
    name: "Ripe Plantain",
    slug: "ripe-plantain",
    description:
      "Sweet, ripe yellow plantain — ready to fry as dodo or bake. A staple across West Africa and the Caribbean. Sold per finger.",
    price: 0.99,
    sale_price: null,
    category_id: "c3",
    category: "Vegetables",
    origin: "ghanaian",
    brand: null,
    images: [],
    stock_qty: 200,
    weight: null,
    unit: "each",
    is_featured: true,
    is_deal: false,
    deal_ends_at: null,
    is_halal: true,
    is_vegan: true,
    created_at: "2026-01-19T09:00:00Z",
  },

  // ── Grains & Flour ─────────────────────────────────────────────────────────
  {
    id: "p7",
    name: "Tropiway Poundo Yam Flour",
    slug: "tropiway-poundo-yam-flour",
    description:
      "Smooth, stretchy pounded yam made in minutes. Tropiway's Poundo is the most popular brand for West African fufu lovers across the UK.",
    price: 4.29,
    sale_price: 3.79,
    category_id: "c4",
    category: "Grains & Flour",
    origin: "nigerian",
    brand: "Tropiway",
    images: [],
    stock_qty: 150,
    weight: 1800,
    unit: "g",
    is_featured: true,
    is_deal: true,
    deal_ends_at: "2026-03-05T23:59:00Z",
    is_halal: true,
    is_vegan: true,
    created_at: "2026-01-20T09:00:00Z",
  },
  {
    id: "p8",
    name: "White Garri (Ijebu)",
    slug: "white-garri-ijebu",
    description:
      "Fine-grain Ijebu garri — fermented cassava granules for making eba (stiff dough) or soaking in cold water for a quick snack. Nigerian staple.",
    price: 3.49,
    sale_price: null,
    category_id: "c4",
    category: "Grains & Flour",
    origin: "nigerian",
    brand: null,
    images: [],
    stock_qty: 90,
    weight: 2,
    unit: "kg",
    is_featured: false,
    is_deal: false,
    deal_ends_at: null,
    is_halal: true,
    is_vegan: true,
    created_at: "2026-01-21T09:00:00Z",
  },

  // ── Spices & Seasonings ────────────────────────────────────────────────────
  {
    id: "p9",
    name: "Suya Spice Mix (Yaji)",
    slug: "suya-spice-mix-yaji",
    description:
      "Authentic Northern Nigerian suya spice — ground groundnut, ginger, paprika, and secret spices. Perfect for suya skewers, grilled chicken, and BBQ.",
    price: 2.99,
    sale_price: null,
    category_id: "c5",
    category: "Spices & Seasonings",
    origin: "nigerian",
    brand: null,
    images: [],
    stock_qty: 75,
    weight: 100,
    unit: "g",
    is_featured: false,
    is_deal: false,
    deal_ends_at: null,
    is_halal: true,
    is_vegan: true,
    created_at: "2026-01-22T09:00:00Z",
  },
  {
    id: "p10",
    name: "Ground Crayfish",
    slug: "ground-crayfish",
    description:
      "Finely ground dried crayfish — an essential umami-rich seasoning for egusi soup, banga, okra soup, and most West African stews and soups.",
    price: 3.99,
    sale_price: null,
    category_id: "c5",
    category: "Spices & Seasonings",
    origin: "nigerian",
    brand: null,
    images: [],
    stock_qty: 55,
    weight: 200,
    unit: "g",
    is_featured: false,
    is_deal: false,
    deal_ends_at: null,
    is_halal: true,
    is_vegan: false,
    created_at: "2026-01-23T09:00:00Z",
  },

  // ── Canned & Packets ───────────────────────────────────────────────────────
  {
    id: "p11",
    name: "Grace Ackee (Canned)",
    slug: "grace-ackee-canned",
    description:
      "Grace canned ackee — Jamaica's national fruit. The essential ingredient for ackee and saltfish, Jamaica's national dish. Ready to use.",
    price: 3.79,
    sale_price: null,
    category_id: "c6",
    category: "Canned & Packets",
    origin: "jamaican",
    brand: "Grace",
    images: [],
    stock_qty: 110,
    weight: 540,
    unit: "g",
    is_featured: true,
    is_deal: false,
    deal_ends_at: null,
    is_halal: true,
    is_vegan: true,
    created_at: "2026-01-24T09:00:00Z",
  },
  {
    id: "p12",
    name: "Laila Coconut Milk",
    slug: "laila-coconut-milk",
    description:
      "Rich, creamy coconut milk — perfect for Caribbean rice and peas, Ghanaian kontomire stew, or Nigerian coconut jollof rice. No preservatives.",
    price: 1.49,
    sale_price: null,
    category_id: "c6",
    category: "Canned & Packets",
    origin: "jamaican",
    brand: "Laila",
    images: [],
    stock_qty: 200,
    weight: 400,
    unit: "ml",
    is_featured: false,
    is_deal: false,
    deal_ends_at: null,
    is_halal: true,
    is_vegan: true,
    created_at: "2026-01-25T09:00:00Z",
  },

  // ── Cooking Oil ────────────────────────────────────────────────────────────
  {
    id: "p13",
    name: "Red Palm Oil",
    slug: "red-palm-oil",
    description:
      "Unrefined red palm oil — the cornerstone of West African cooking. Essential for banga soup, egusi, and authentic jollof rice. Rich in beta-carotene.",
    price: 6.49,
    sale_price: 5.49,
    category_id: "c7",
    category: "Cooking Oil",
    origin: "ghanaian",
    brand: null,
    images: [],
    stock_qty: 65,
    weight: 2,
    unit: "L",
    is_featured: true,
    is_deal: true,
    deal_ends_at: "2026-02-28T23:59:00Z",
    is_halal: true,
    is_vegan: true,
    created_at: "2026-01-26T09:00:00Z",
  },

  // ── Drinks ─────────────────────────────────────────────────────────────────
  {
    id: "p14",
    name: "Malta Guinness (Can)",
    slug: "malta-guinness-can",
    description:
      "Non-alcoholic malt drink — a beloved West African classic. Rich, slightly sweet, and full of B vitamins. Great chilled or at room temperature.",
    price: 1.29,
    sale_price: null,
    category_id: "c8",
    category: "Drinks",
    origin: "nigerian",
    brand: "Malta Guinness",
    images: [],
    stock_qty: 300,
    weight: 330,
    unit: "ml",
    is_featured: false,
    is_deal: false,
    deal_ends_at: null,
    is_halal: true,
    is_vegan: true,
    created_at: "2026-01-27T09:00:00Z",
  },
  {
    id: "p15",
    name: "Rubicon Mango Juice (Can)",
    slug: "rubicon-mango-juice-can",
    description:
      "Exotic mango juice drink — a UK Caribbean community favourite. Sweet, tropical, and refreshing. Perfect with jerk chicken or on its own.",
    price: 1.09,
    sale_price: null,
    category_id: "c8",
    category: "Drinks",
    origin: "jamaican",
    brand: "Rubicon",
    images: [],
    stock_qty: 250,
    weight: 330,
    unit: "ml",
    is_featured: false,
    is_deal: false,
    deal_ends_at: null,
    is_halal: true,
    is_vegan: true,
    created_at: "2026-01-28T09:00:00Z",
  },

  // ── Frozen Foods ───────────────────────────────────────────────────────────
  {
    id: "p16",
    name: "Frozen Whole Tilapia",
    slug: "frozen-whole-tilapia",
    description:
      "Whole frozen tilapia — gutted and scaled, ready to fry, grill, or steam. A versatile fish beloved across Nigeria, Ghana, and the Caribbean.",
    price: 8.49,
    sale_price: null,
    category_id: "c9",
    category: "Frozen Foods",
    origin: "ghanaian",
    brand: null,
    images: [],
    stock_qty: 45,
    weight: 1,
    unit: "kg",
    is_featured: false,
    is_deal: false,
    deal_ends_at: null,
    is_halal: true,
    is_vegan: false,
    created_at: "2026-01-29T09:00:00Z",
  },

  // ── Sauces & Paste ─────────────────────────────────────────────────────────
  {
    id: "p17",
    name: "Ghanaian Groundnut Paste",
    slug: "ghanaian-groundnut-paste",
    description:
      "Stone-ground roasted peanut paste — the base for Ghanaian groundnut soup (nkate nkwan). Natural, no added sugar or palm oil. Also great as peanut butter.",
    price: 4.99,
    sale_price: null,
    category_id: "c10",
    category: "Sauces & Paste",
    origin: "ghanaian",
    brand: null,
    images: [],
    stock_qty: 50,
    weight: 500,
    unit: "g",
    is_featured: false,
    is_deal: false,
    deal_ends_at: null,
    is_halal: true,
    is_vegan: true,
    created_at: "2026-01-30T09:00:00Z",
  },

  // ── Snacks ─────────────────────────────────────────────────────────────────
  {
    id: "p18",
    name: "Nigerian Chin Chin",
    slug: "nigerian-chin-chin",
    description:
      "Crunchy, lightly sweet fried dough snack — a Nigerian party classic. This batch is coconut-flavoured and made fresh. Great for gifting too.",
    price: 4.49,
    sale_price: 3.49,
    category_id: "c11",
    category: "Snacks",
    origin: "nigerian",
    brand: null,
    images: [],
    stock_qty: 70,
    weight: 400,
    unit: "g",
    is_featured: true,
    is_deal: true,
    deal_ends_at: "2026-03-03T23:59:00Z",
    is_halal: true,
    is_vegan: true,
    created_at: "2026-01-31T09:00:00Z",
  },
  {
    id: "p19",
    name: "Plantain Chips (Salted)",
    slug: "plantain-chips-salted",
    description:
      "Thinly sliced, lightly salted plantain chips — crispy, moreish, and naturally gluten-free. A healthier African snack alternative to crisps.",
    price: 2.49,
    sale_price: null,
    category_id: "c11",
    category: "Snacks",
    origin: "ghanaian",
    brand: null,
    images: [],
    stock_qty: 130,
    weight: 150,
    unit: "g",
    is_featured: false,
    is_deal: false,
    deal_ends_at: null,
    is_halal: true,
    is_vegan: true,
    created_at: "2026-02-01T09:00:00Z",
  },

  // ── Beauty & Household ─────────────────────────────────────────────────────
  {
    id: "p20",
    name: "Dudu-Osun African Black Soap",
    slug: "dudu-osun-african-black-soap",
    description:
      "Original Dudu-Osun black soap from Nigeria — made with shea butter, palm kernel oil, and honey. Naturally cleanses, moisturises, and brightens skin.",
    price: 3.99,
    sale_price: null,
    category_id: "c12",
    category: "Beauty & Household",
    origin: "nigerian",
    brand: "Dudu-Osun",
    images: [],
    stock_qty: 90,
    weight: 150,
    unit: "g",
    is_featured: false,
    is_deal: false,
    deal_ends_at: null,
    is_halal: true,
    is_vegan: false,
    created_at: "2026-02-02T09:00:00Z",
  },
];

// ─── Helper selectors ─────────────────────────────────────────────────────────

export function getProductsByCategory(categorySlug: string): Product[] {
  const cat = CATEGORIES.find((c) => c.slug === categorySlug);
  if (!cat) return [];
  return MOCK_PRODUCTS.filter((p) => p.category_id === cat.id);
}

export function getProductsByOrigin(originSlug: string): Product[] {
  return MOCK_PRODUCTS.filter((p) => p.origin === originSlug);
}

export function getFeaturedProducts(): Product[] {
  return MOCK_PRODUCTS.filter((p) => p.is_featured);
}

export function getDealProducts(): Product[] {
  return MOCK_PRODUCTS.filter((p) => p.is_deal);
}

export function getProductBySlug(slug: string): Product | undefined {
  return MOCK_PRODUCTS.find((p) => p.slug === slug);
}

export function searchProducts(query: string): Product[] {
  const q = query.toLowerCase().trim();
  if (!q) return MOCK_PRODUCTS;
  return MOCK_PRODUCTS.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      (p.brand?.toLowerCase().includes(q) ?? false) ||
      (p.origin?.toLowerCase().includes(q) ?? false)
  );
}
