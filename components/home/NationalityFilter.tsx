"use client";

import { useState, useMemo } from "react";
import { MOCK_PRODUCTS } from "@/lib/mockData";
import ProductCard from "@/components/shop/ProductCard";
import { Product } from "@/types";

// ─── Origin data ──────────────────────────────────────────────────────────────

const ORIGINS = [
  { flag: "🌍", label: "All",          slug: "" },
  { flag: "🇳🇬", label: "Nigerian",     slug: "nigerian" },
  { flag: "🇬🇭", label: "Ghanaian",     slug: "ghanaian" },
  { flag: "🇯🇲", label: "Jamaican",     slug: "jamaican" },
  { flag: "🇨🇲", label: "Cameroonian",  slug: "cameroonian" },
  { flag: "🇿🇦", label: "South African", slug: "south-african" },
  { flag: "🇿🇼", label: "Zimbabwean",   slug: "zimbabwean" },
  { flag: "🇨🇩", label: "Congolese",    slug: "congolese" },
  { flag: "🇸🇳", label: "Senegalese",   slug: "senegalese" },
] as const;

type OriginSlug = (typeof ORIGINS)[number]["slug"];

// ─── Component ────────────────────────────────────────────────────────────────

interface NationalityFilterProps {
  products?: Product[];
}

export default function NationalityFilter({ products }: NationalityFilterProps) {
  const allProducts = products ?? MOCK_PRODUCTS;
  const [selected, setSelected] = useState<OriginSlug>("");

  const filtered = useMemo(() => {
    const pool = selected
      ? allProducts.filter((p) => p.origin === selected)
      : allProducts;
    return pool.slice(0, 8);
  }, [selected, allProducts]);

  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="container mx-auto px-4">

        {/* ── Section heading ─────────────────────────────────────────── */}
        <div className="text-center mb-7 md:mb-8">
          <p className="text-xs font-bold uppercase tracking-widest text-brand-400 mb-1">
            Authentic Flavours
          </p>
          <h2 className="font-heading font-bold text-2xl md:text-3xl text-foreground">
            Shop by Origin
          </h2>
          <p className="text-muted-foreground text-sm mt-2">
            Discover authentic products from across Africa and the Caribbean.
          </p>
        </div>

        {/* ── Scrollable origin chips ──────────────────────────────────── */}
        <div
          className="flex gap-2.5 overflow-x-auto scrollbar-hide pb-2 justify-start sm:justify-center flex-nowrap mb-8"
          role="group"
          aria-label="Filter by country of origin"
        >
          {ORIGINS.map((origin) => {
            const isActive = selected === origin.slug;
            return (
              <button
                key={origin.slug}
                onClick={() => setSelected(origin.slug)}
                aria-pressed={isActive}
                className={[
                  "flex items-center gap-2 shrink-0 px-4 py-2 rounded-full border text-sm font-medium transition-all",
                  isActive
                    ? "bg-brand-500 border-brand-500 text-white shadow-md shadow-brand-900/20"
                    : "bg-white border-border text-foreground hover:border-brand-400 hover:bg-brand-50",
                ].join(" ")}
              >
                <span className="text-base leading-none" aria-hidden>
                  {origin.flag}
                </span>
                {origin.label}
              </button>
            );
          })}
        </div>

        {/* ── Product grid ─────────────────────────────────────────────── */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-4xl mb-3">🌍</p>
            <p className="font-heading font-semibold text-lg mb-1">No products yet</p>
            <p className="text-muted-foreground text-sm">
              We&apos;re sourcing authentic products from this region — check back soon!
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
