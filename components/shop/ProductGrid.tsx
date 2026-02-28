"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { MOCK_PRODUCTS, CATEGORIES } from "@/lib/mockData";
import { getEffectivePrice } from "@/lib/utils";
import { Product } from "@/types";
import ProductCard from "./ProductCard";
import FilterDrawer from "./FilterDrawer";

// ─── Constants ────────────────────────────────────────────────────────────────

const PAGE_SIZE = 12;

type SortOption =
  | "relevance"
  | "price-asc"
  | "price-desc"
  | "newest"
  | "featured";

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "relevance",  label: "Relevance" },
  { value: "price-asc",  label: "Price: Low–High" },
  { value: "price-desc", label: "Price: High–Low" },
  { value: "newest",     label: "Newest" },
  { value: "featured",   label: "Best Selling" },
];

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function GridSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="rounded-xl border border-border overflow-hidden">
          <Skeleton className="aspect-square w-full" />
          <div className="p-3 space-y-2">
            <Skeleton className="h-3 w-16 rounded-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <div className="flex justify-between items-center pt-1">
              <Skeleton className="h-5 w-14" />
            </div>
            <Skeleton className="h-8 w-full rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyState({ onClear }: { onClear: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <p className="text-5xl mb-4">🔍</p>
      <h3 className="font-heading font-bold text-xl mb-2">No products found</h3>
      <p className="text-muted-foreground text-sm max-w-xs mb-6">
        Try adjusting your filters or search term to find what you&apos;re looking for.
      </p>
      <button
        onClick={onClear}
        className="px-5 py-2 bg-brand-500 hover:bg-brand-600 text-white font-semibold rounded-lg text-sm transition-colors"
      >
        Clear Filters
      </button>
    </div>
  );
}

// ─── Core grid logic (needs useSearchParams → wrapped in Suspense) ────────────

interface ProductGridInnerProps {
  lockedCategorySlug?: string;
  initialProducts?: Product[];
}

function ProductGridInner({ lockedCategorySlug, initialProducts }: ProductGridInnerProps) {
  const searchParams = useSearchParams();
  const router       = useRouter();
  const pathname     = usePathname();
  const paramsString = searchParams.toString();

  const [displayCount, setDisplayCount] = useState(PAGE_SIZE);

  // Reset pagination when filters change
  useEffect(() => {
    setDisplayCount(PAGE_SIZE);
  }, [paramsString]);

  // ── Filter + sort ──────────────────────────────────────────────────────────
  const allFiltered = useMemo<Product[]>(() => {
    const params = new URLSearchParams(paramsString);

    const q          = params.get("q")?.toLowerCase().trim() ?? "";
    const categories = (params.get("category") ?? "").split(",").filter(Boolean);
    const origins    = (params.get("origin")   ?? "").split(",").filter(Boolean);
    const brands     = (params.get("brand")    ?? "").split(",").filter(Boolean);
    const minPrice   = parseFloat(params.get("minPrice") ?? "") || null;
    const maxPrice   = parseFloat(params.get("maxPrice") ?? "") || null;
    const halal      = params.get("halal")   === "1";
    const vegan      = params.get("vegan")   === "1";
    const inStock    = params.get("inStock") === "1";
    const sort       = (params.get("sort") ?? "relevance") as SortOption;

    // --- Filter ---
    const pool = initialProducts ?? MOCK_PRODUCTS;
    let products = pool.filter((p) => {
      // Locked category from path (e.g. /shop/meat)
      if (lockedCategorySlug) {
        const cat = CATEGORIES.find((c) => c.slug === lockedCategorySlug);
        if (cat && p.category_id !== cat.id) return false;
      }

      // Full-text search
      if (q) {
        const haystack = `${p.name} ${p.description} ${p.category} ${p.brand ?? ""}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }

      // Category checkboxes (URL param)
      if (categories.length > 0) {
        const catIds = categories
          .map((slug) => CATEGORIES.find((c) => c.slug === slug)?.id)
          .filter(Boolean) as string[];
        if (!catIds.includes(p.category_id)) return false;
      }

      // Origin
      if (origins.length > 0) {
        if (!p.origin || !origins.includes(p.origin)) return false;
      }

      // Brand
      if (brands.length > 0) {
        if (!p.brand || !brands.includes(p.brand)) return false;
      }

      // Price range
      const price = getEffectivePrice(p);
      if (minPrice !== null && price < minPrice) return false;
      if (maxPrice !== null && price > maxPrice) return false;

      // Dietary
      if (halal && !p.is_halal) return false;
      if (vegan && !p.is_vegan) return false;

      // Stock
      if (inStock && p.stock_qty === 0) return false;

      return true;
    });

    // --- Sort ---
    switch (sort) {
      case "price-asc":
        products = [...products].sort(
          (a, b) => getEffectivePrice(a) - getEffectivePrice(b)
        );
        break;
      case "price-desc":
        products = [...products].sort(
          (a, b) => getEffectivePrice(b) - getEffectivePrice(a)
        );
        break;
      case "newest":
        products = [...products].sort(
          (a, b) =>
            new Date(b.created_at).getTime() -
            new Date(a.created_at).getTime()
        );
        break;
      case "featured":
        products = [...products].sort(
          (a, b) => Number(b.is_featured) - Number(a.is_featured)
        );
        break;
      // relevance: keep original order
    }

    return products;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramsString, lockedCategorySlug, initialProducts]);

  const displayed = allFiltered.slice(0, displayCount);
  const hasMore   = displayCount < allFiltered.length;
  const remaining = allFiltered.length - displayCount;

  const currentSort = (searchParams.get("sort") ?? "relevance") as SortOption;

  function setSort(value: SortOption) {
    const next = new URLSearchParams(searchParams.toString());
    if (value === "relevance") next.delete("sort");
    else next.set("sort", value);
    router.push(`${pathname}?${next.toString()}`, { scroll: false });
  }

  function clearFilters() {
    router.push(pathname, { scroll: false });
  }

  return (
    <div>
      {/* ── Toolbar ─────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3 mb-5 flex-wrap">

        {/* Filter button — mobile only */}
        <div className="lg:hidden">
          <FilterDrawer lockedCategorySlug={lockedCategorySlug} />
        </div>

        {/* Results count */}
        <p className="text-sm text-muted-foreground flex-1">
          <span className="font-semibold text-foreground">{allFiltered.length}</span>{" "}
          {allFiltered.length === 1 ? "product" : "products"}
        </p>

        {/* Sort dropdown */}
        <div className="relative flex items-center">
          <label htmlFor="sort-select" className="sr-only">
            Sort by
          </label>
          <select
            id="sort-select"
            value={currentSort}
            onChange={(e) => setSort(e.target.value as SortOption)}
            className="appearance-none pl-3 pr-8 py-1.5 text-sm border border-border rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-brand-400 cursor-pointer"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown
            size={13}
            className="absolute right-2.5 text-muted-foreground pointer-events-none"
          />
        </div>
      </div>

      {/* ── Grid ────────────────────────────────────────────────────── */}
      {allFiltered.length === 0 ? (
        <EmptyState onClear={clearFilters} />
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {displayed.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* ── Load More ─────────────────────────────────────────── */}
          {hasMore && (
            <div className="mt-8 text-center">
              <button
                onClick={() => setDisplayCount((c) => c + PAGE_SIZE)}
                className="px-8 py-2.5 border border-brand-400 text-brand-600 hover:bg-brand-50 font-semibold rounded-lg text-sm transition-colors"
              >
                Load More
                <span className="text-muted-foreground font-normal">
                  {" "}({remaining} more)
                </span>
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ─── Public component — wraps inner in Suspense ───────────────────────────────

interface ProductGridProps {
  lockedCategorySlug?: string;
  initialProducts?: Product[];
}

export default function ProductGrid({ lockedCategorySlug, initialProducts }: ProductGridProps) {
  return (
    <Suspense fallback={<GridSkeleton />}>
      <ProductGridInner
        lockedCategorySlug={lockedCategorySlug}
        initialProducts={initialProducts}
      />
    </Suspense>
  );
}
