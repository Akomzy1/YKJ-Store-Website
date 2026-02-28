"use client";

import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MOCK_PRODUCTS } from "@/lib/mockData";
import ProductCard from "@/components/shop/ProductCard";
import { Product } from "@/types";

// ── Tab data helpers ───────────────────────────────────────────────────────────

function buildTabs(allProducts: Product[]) {
  const newArrivals = [...allProducts]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 8);

  const bestSellers = allProducts.filter((p) => p.is_featured);
  const onOffer     = allProducts.filter((p) => p.is_deal || p.sale_price !== null);

  return [
    { value: "new",     label: "New Arrivals", products: newArrivals, href: "/shop?sort=newest"   },
    { value: "sellers", label: "Best Sellers", products: bestSellers, href: "/shop?sort=featured" },
    { value: "offer",   label: "On Offer",     products: onOffer,     href: "/deals"              },
  ] as const;
}

// ── Inner grid ────────────────────────────────────────────────────────────────

function ProductGrid({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <p className="text-muted-foreground text-sm py-10 text-center">
        No products found.
      </p>
    );
  }
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
      {products.slice(0, 8).map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

// ── Section ───────────────────────────────────────────────────────────────────

interface FeaturedProductsProps {
  products?: Product[];
}

export default function FeaturedProducts({ products }: FeaturedProductsProps) {
  const TABS = buildTabs(products ?? MOCK_PRODUCTS);

  return (
    <section className="py-12 md:py-16 bg-[#FAFAF8]">
      <div className="container mx-auto px-4">

        {/* Section heading */}
        <div className="mb-7 md:mb-8">
          <p className="text-xs font-bold uppercase tracking-widest text-brand-400 mb-1">
            Handpicked For You
          </p>
          <h2 className="font-heading font-bold text-2xl md:text-3xl text-foreground">
            Featured Products
          </h2>
        </div>

        <Tabs defaultValue="new">

          {/* ── Tab triggers ──────────────────────────────────────────── */}
          <TabsList className="mb-6 h-auto p-1 bg-brand-50 rounded-lg flex-wrap gap-0.5">
            {TABS.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="text-sm px-4 py-1.5
                  data-[state=active]:bg-white
                  data-[state=active]:text-brand-600
                  data-[state=active]:shadow-sm
                  text-muted-foreground
                  transition-colors"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* ── Tab content panels ────────────────────────────────────── */}
          {TABS.map((tab) => (
            <TabsContent key={tab.value} value={tab.value} className="mt-0">
              <ProductGrid products={tab.products} />

              {/* "View All" per tab */}
              <div className="mt-7 text-center">
                <Link
                  href={tab.href}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-500 hover:text-brand-700 transition-colors underline underline-offset-4"
                >
                  View All {tab.label} →
                </Link>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
}
