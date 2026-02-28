import { notFound } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import { CATEGORIES, MOCK_PRODUCTS } from "@/lib/mockData";
import FilterSidebar from "@/components/shop/FilterSidebar";
import ProductGrid from "@/components/shop/ProductGrid";
import { getProductsByCategory } from "@/lib/supabase-queries";

// ─── Category emoji map (matches CategoryGrid) ────────────────────────────────

const CATEGORY_META: Record<
  string,
  { emoji: string; description: string }
> = {
  meat:              { emoji: "🥩", description: "Halal-certified goat, oxtail, chicken, cow foot and more — perfect for soups, stews and BBQ." },
  "fish-seafood":    { emoji: "🐟", description: "Fresh and dried fish, whole tilapia, Titus mackerel, catfish and seafood for authentic West African and Caribbean recipes." },
  vegetables:        { emoji: "🥦", description: "Fresh scotch bonnets, plantain, okra, yam, sweet potato and all your favourite African and Caribbean vegetables." },
  "grains-flour":    { emoji: "🌾", description: "Poundo yam, garri, semovita, fufu flour, rice and grains for traditional African staples." },
  "spices-seasonings": { emoji: "🌶️", description: "Suya spice, crayfish, Maggi, Royco, curry powder and authentic seasonings for bold West African flavours." },
  "canned-packets":  { emoji: "🥫", description: "Canned ackee, coconut milk, baked beans, sardines, tomato paste and pantry essentials." },
  "cooking-oil":     { emoji: "🫙", description: "Red palm oil, vegetable oil and coconut oil — the foundations of West African and Caribbean cooking." },
  drinks:            { emoji: "🧃", description: "Malta Guinness, Rubicon mango, tropical juices, ginger beer and non-alcoholic malt drinks." },
  "frozen-foods":    { emoji: "❄️", description: "Frozen whole fish, frozen meat cuts and frozen vegetables — fresh quality, ready when you need it." },
  "sauces-paste":    { emoji: "🍯", description: "Groundnut paste, jollof sauce, pepper sauce and curry sauce for authentic West African and Caribbean cooking." },
  snacks:            { emoji: "🍿", description: "Chin chin, plantain chips, biscuits and Indomie — great for snacking and gifting." },
  "beauty-household": { emoji: "🌸", description: "Dudu-Osun black soap, shea butter, relaxers and authentic African beauty and household products." },
};

// ─── Dynamic metadata ─────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: { category: string };
}) {
  const cat = CATEGORIES.find((c) => c.slug === params.category);
  if (!cat) return {};
  return {
    title: `${cat.name} | YKJ African & Caribbean Food Store`,
    description: CATEGORY_META[params.category]?.description ?? `Shop authentic ${cat.name} — delivered fast across the UK.`,
  };
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export const revalidate = 300;

export default async function CategoryPage({
  params,
}: {
  params: { category: string };
}) {
  const cat = CATEGORIES.find((c) => c.slug === params.category);
  if (!cat) notFound();

  // Fetch real products from Supabase; fall back to mock count on error
  const categoryProducts = await getProductsByCategory(params.category).catch(() => undefined);
  const productCount = categoryProducts?.length
    ?? MOCK_PRODUCTS.filter((p) => p.category_id === cat.id).length;

  const meta = CATEGORY_META[params.category] ?? {
    emoji: "🛒",
    description: `Shop our full range of ${cat.name} products.`,
  };

  return (
    <div className="min-h-screen bg-[#FAFAF8]">

      {/* ── Category hero ────────────────────────────────────────────── */}
      <div className="bg-white border-b border-border">
        <div className="container mx-auto px-4 py-6 md:py-8">

          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-3">
            <ol className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <li>
                <Link href="/" className="hover:text-brand-500 transition-colors">
                  Home
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li>
                <Link href="/shop" className="hover:text-brand-500 transition-colors">
                  Shop
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li className="text-foreground font-medium" aria-current="page">
                {cat.name}
              </li>
            </ol>
          </nav>

          <div className="flex items-center gap-4">
            <span
              className="text-4xl md:text-5xl select-none"
              aria-hidden
            >
              {meta.emoji}
            </span>
            <div>
              <h1 className="font-heading font-bold text-2xl md:text-3xl text-foreground">
                {cat.name}
              </h1>
              <p className="text-muted-foreground text-sm mt-1 max-w-xl leading-relaxed">
                {meta.description}
              </p>
              <p className="text-xs text-brand-500 font-semibold mt-2">
                {productCount} {productCount === 1 ? "product" : "products"} available
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Two-panel layout ─────────────────────────────────────────── */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">

          {/* Desktop sidebar — Category filter hidden (already locked by path) */}
          <div className="hidden lg:block">
            <Suspense>
              <FilterSidebar lockedCategorySlug={params.category} />
            </Suspense>
          </div>

          {/* Main content */}
          <main className="flex-1 min-w-0">
            <ProductGrid
              lockedCategorySlug={params.category}
              initialProducts={categoryProducts}
            />
          </main>
        </div>
      </div>
    </div>
  );
}
