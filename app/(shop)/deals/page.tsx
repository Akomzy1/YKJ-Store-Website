"use client";

// ─── Deals Page — /deals ──────────────────────────────────────────────────────
// Live countdown timer, discount filter tabs, mock deal product grid.
// Uses the existing ProductCard component for consistent card UI.

import { useState, useEffect } from "react";
import { Flame, Tag } from "lucide-react";
import ProductCard from "@/components/shop/ProductCard";
import type { Product } from "@/types";

// ─── Mock deal products ───────────────────────────────────────────────────────
// Replace with a real Supabase query (.from("products").eq("is_deal", true))
// once products are in the database.

const DEALS: Product[] = [
  {
    id: "d1", name: "Palm Oil (5L)", slug: "palm-oil-5l",
    description: "Premium red palm oil, sourced from West Africa.",
    price: 18.99, sale_price: 12.99, category_id: "c1",
    category: "Cooking Oil", origin: "nigerian", brand: "Kings",
    images: [], stock_qty: 34, weight: 5000, unit: "ml",
    is_featured: false, is_deal: true, deal_ends_at: null,
    is_halal: true, is_vegan: true, created_at: "2026-01-01",
  },
  {
    id: "d2", name: "Poundo Yam Flour (4kg)", slug: "poundo-yam-flour-4kg",
    description: "Smooth, authentic pounded yam flour.",
    price: 11.50, sale_price: 7.99, category_id: "c2",
    category: "Grains & Flour", origin: "nigerian", brand: "Ola Ola",
    images: [], stock_qty: 80, weight: 4, unit: "kg",
    is_featured: false, is_deal: true, deal_ends_at: null,
    is_halal: true, is_vegan: true, created_at: "2026-01-01",
  },
  {
    id: "d3", name: "Titus Mackerel in Tomato Sauce (400g)", slug: "titus-mackerel-tomato-400g",
    description: "Classic canned mackerel — a pantry staple.",
    price: 3.49, sale_price: 1.99, category_id: "c3",
    category: "Canned & Packets", origin: "pan-african", brand: "Titus",
    images: [], stock_qty: 120, weight: 400, unit: "g",
    is_featured: false, is_deal: true, deal_ends_at: null,
    is_halal: true, is_vegan: false, created_at: "2026-01-01",
  },
  {
    id: "d4", name: "Scotch Bonnet Peppers (500g)", slug: "scotch-bonnet-500g",
    description: "Fiery, fragrant scotch bonnets — essential for jerk and pepper soup.",
    price: 4.99, sale_price: 2.99, category_id: "c4",
    category: "Vegetables", origin: "jamaican", brand: null,
    images: [], stock_qty: 55, weight: 500, unit: "g",
    is_featured: true, is_deal: true, deal_ends_at: null,
    is_halal: true, is_vegan: true, created_at: "2026-01-01",
  },
  {
    id: "d5", name: "Egusi (Melon Seeds) (1kg)", slug: "egusi-melon-seeds-1kg",
    description: "Ground egusi seeds for traditional West African soups.",
    price: 9.99, sale_price: 6.50, category_id: "c5",
    category: "Vegetables", origin: "nigerian", brand: null,
    images: [], stock_qty: 40, weight: 1, unit: "kg",
    is_featured: false, is_deal: true, deal_ends_at: null,
    is_halal: true, is_vegan: true, created_at: "2026-01-01",
  },
  {
    id: "d6", name: "Suya Spice Mix (200g)", slug: "suya-spice-mix-200g",
    description: "Authentic suya seasoning blend — perfect for grilled meat.",
    price: 3.99, sale_price: 2.49, category_id: "c6",
    category: "Spices & Seasonings", origin: "nigerian", brand: "Mama's Kitchen",
    images: [], stock_qty: 95, weight: 200, unit: "g",
    is_featured: false, is_deal: true, deal_ends_at: null,
    is_halal: true, is_vegan: true, created_at: "2026-01-01",
  },
  {
    id: "d7", name: "Ackee (Canned, 540g)", slug: "ackee-canned-540g",
    description: "Jamaica's national fruit — ready to cook.",
    price: 4.49, sale_price: 2.99, category_id: "c3",
    category: "Canned & Packets", origin: "jamaican", brand: "Grace",
    images: [], stock_qty: 60, weight: 540, unit: "g",
    is_featured: false, is_deal: true, deal_ends_at: null,
    is_halal: true, is_vegan: true, created_at: "2026-01-01",
  },
  {
    id: "d8", name: "Indomie Instant Noodles (Bundle of 40)", slug: "indomie-noodles-40",
    description: "The legendary West African instant noodle — bulk pack.",
    price: 22.00, sale_price: 14.99, category_id: "c7",
    category: "Snacks", origin: "nigerian", brand: "Indomie",
    images: [], stock_qty: 28, weight: 2800, unit: "g",
    is_featured: false, is_deal: true, deal_ends_at: null,
    is_halal: true, is_vegan: false, created_at: "2026-01-01",
  },
  {
    id: "d9", name: "Plantain Chips (200g)", slug: "plantain-chips-200g",
    description: "Crispy, salted plantain chips — great snack any time.",
    price: 2.99, sale_price: 1.79, category_id: "c7",
    category: "Snacks", origin: "ghanaian", brand: null,
    images: [], stock_qty: 74, weight: 200, unit: "g",
    is_featured: false, is_deal: true, deal_ends_at: null,
    is_halal: true, is_vegan: true, created_at: "2026-01-01",
  },
  {
    id: "d10", name: "Coconut Milk (400ml × 4)", slug: "coconut-milk-4-pack",
    description: "Rich, creamy coconut milk for curries, rice, and desserts.",
    price: 6.49, sale_price: 3.99, category_id: "c3",
    category: "Canned & Packets", origin: "pan-african", brand: "Tropical Sun",
    images: [], stock_qty: 50, weight: 1600, unit: "ml",
    is_featured: false, is_deal: true, deal_ends_at: null,
    is_halal: true, is_vegan: true, created_at: "2026-01-01",
  },
  {
    id: "d11", name: "Dudu-Osun African Black Soap (150g)", slug: "dudu-osun-black-soap",
    description: "Original Nigerian black soap — handcrafted, all-natural.",
    price: 4.99, sale_price: 2.99, category_id: "c8",
    category: "Beauty & Household", origin: "nigerian", brand: "Dudu-Osun",
    images: [], stock_qty: 85, weight: 150, unit: "g",
    is_featured: false, is_deal: true, deal_ends_at: null,
    is_halal: true, is_vegan: true, created_at: "2026-01-01",
  },
  {
    id: "d12", name: "Malta Guinness (Pack of 12)", slug: "malta-guinness-12",
    description: "Non-alcoholic malt drink — a West African household favourite.",
    price: 14.99, sale_price: 9.99, category_id: "c9",
    category: "Drinks", origin: "nigerian", brand: "Malta Guinness",
    images: [], stock_qty: 42, weight: 3720, unit: "ml",
    is_featured: false, is_deal: true, deal_ends_at: null,
    is_halal: true, is_vegan: true, created_at: "2026-01-01",
  },
];

// ─── Discount filter options ──────────────────────────────────────────────────

const FILTERS = [
  { label: "All Deals",  minPct: 0  },
  { label: "10%+ off",  minPct: 10 },
  { label: "20%+ off",  minPct: 20 },
  { label: "30%+ off",  minPct: 30 },
  { label: "50%+ off",  minPct: 50 },
];

function discountPct(p: Product): number {
  if (!p.sale_price || p.sale_price >= p.price) return 0;
  return Math.round(((p.price - p.sale_price) / p.price) * 100);
}

// ─── Countdown timer ──────────────────────────────────────────────────────────
// Counts down to midnight tonight (deals reset daily).

function useCountdown() {
  const [timeLeft, setTimeLeft] = useState({ h: 0, m: 0, s: 0 });

  useEffect(() => {
    function calc() {
      const now       = new Date();
      const midnight  = new Date(now);
      midnight.setHours(24, 0, 0, 0);
      const diff      = midnight.getTime() - now.getTime();
      const h         = Math.floor(diff / 3_600_000);
      const m         = Math.floor((diff % 3_600_000) / 60_000);
      const s         = Math.floor((diff % 60_000) / 1_000);
      setTimeLeft({ h, m, s });
    }
    calc();
    const id = setInterval(calc, 1_000);
    return () => clearInterval(id);
  }, []);

  return timeLeft;
}

function Digit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="bg-white/20 rounded-xl px-4 py-2.5 min-w-[56px] text-center">
        <span className="font-heading text-3xl font-bold tabular-nums leading-none">
          {String(value).padStart(2, "0")}
        </span>
      </div>
      <span className="text-xs text-white/70 mt-1.5 uppercase tracking-widest">
        {label}
      </span>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DealsPage() {
  const { h, m, s } = useCountdown();
  const [activeFilter, setActiveFilter] = useState(0);

  const minPct     = FILTERS[activeFilter].minPct;
  const filtered   = DEALS.filter((p) => discountPct(p) >= minPct);
  const totalSaved = DEALS.reduce(
    (sum, p) => sum + (p.sale_price != null ? p.price - p.sale_price : 0),
    0
  );

  return (
    <main className="bg-[#FAFAF8]">

      {/* ── Hero / countdown ── */}
      <div className="bg-gradient-to-br from-red-600 via-red-700 to-[#7B3F1A] text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">

            {/* Left: heading */}
            <div className="text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start gap-2 mb-3">
                <Flame className="h-7 w-7 text-[#F59E0B] animate-pulse" />
                <span className="bg-[#F59E0B] text-black text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                  Today&apos;s Deals
                </span>
              </div>
              <h1 className="font-heading text-4xl sm:text-5xl font-bold leading-tight mb-3">
                Up to 50% Off
                <br />
                <span className="text-[#F59E0B]">Authentic Favourites</span>
              </h1>
              <p className="text-white/80 text-sm max-w-md">
                Hand-picked daily deals on African & Caribbean groceries.
                Prices reset at midnight — grab yours before time runs out.
              </p>
              <div className="mt-3 flex items-center justify-center lg:justify-start gap-2 text-sm text-white/70">
                <Tag className="h-4 w-4" />
                <span>
                  {DEALS.length} deals active · Over £{totalSaved.toFixed(0)} in savings
                </span>
              </div>
            </div>

            {/* Right: countdown */}
            <div className="flex flex-col items-center">
              <p className="text-white/70 text-xs uppercase tracking-widest mb-3">
                Deals end in
              </p>
              <div className="flex items-start gap-3">
                <Digit value={h} label="hrs" />
                <span className="font-heading text-3xl font-bold mt-2.5 text-white/60">:</span>
                <Digit value={m} label="min" />
                <span className="font-heading text-3xl font-bold mt-2.5 text-white/60">:</span>
                <Digit value={s} label="sec" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Filters + grid ── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Discount filter tabs */}
        <div className="flex flex-wrap gap-2 mb-7">
          {FILTERS.map(({ label }, idx) => (
            <button
              key={label}
              onClick={() => setActiveFilter(idx)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeFilter === idx
                  ? "bg-red-600 text-white shadow-sm"
                  : "bg-white border border-gray-200 text-gray-700 hover:border-red-300 hover:text-red-600"
              }`}
            >
              {label}
            </button>
          ))}
          <span className="ml-auto self-center text-sm text-gray-400">
            {filtered.length} deal{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Product grid */}
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 py-20 text-center">
            <Flame className="h-10 w-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">
              No deals match that filter right now.
            </p>
            <button
              onClick={() => setActiveFilter(0)}
              className="mt-3 text-sm text-red-600 hover:underline font-medium"
            >
              Show all deals
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
