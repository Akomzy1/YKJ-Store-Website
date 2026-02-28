import Link from "next/link";
import { Suspense } from "react";
import FilterSidebar from "@/components/shop/FilterSidebar";
import ProductGrid from "@/components/shop/ProductGrid";
import { getProducts } from "@/lib/supabase-queries";

export const metadata = {
  title: "Shop All Products | YKJ African & Caribbean Food Store",
  description:
    "Browse our full range of authentic African and Caribbean groceries — meat, fish, vegetables, spices, drinks and more. Fast UK delivery.",
};

export const revalidate = 300;

export default async function ShopPage() {
  const products = await getProducts().catch(() => undefined);

  return (
    <div className="min-h-screen bg-[#FAFAF8]">

      {/* ── Page header ────────────────────────────────────────────────── */}
      <div className="bg-white border-b border-border">
        <div className="container mx-auto px-4 py-6">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-2">
            <ol className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <li>
                <Link href="/" className="hover:text-brand-500 transition-colors">
                  Home
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li className="text-foreground font-medium" aria-current="page">
                Shop
              </li>
            </ol>
          </nav>

          <h1 className="font-heading font-bold text-2xl md:text-3xl text-foreground">
            All Products
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Authentic African &amp; Caribbean groceries, delivered across the UK
          </p>
        </div>
      </div>

      {/* ── Two-panel layout ─────────────────────────────────────────── */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">

          {/* Desktop sidebar — hidden on mobile */}
          <div className="hidden lg:block">
            <Suspense>
              <FilterSidebar />
            </Suspense>
          </div>

          {/* Main content */}
          <main className="flex-1 min-w-0">
            <ProductGrid initialProducts={products} />
          </main>
        </div>
      </div>
    </div>
  );
}
