// ─── Product Detail Page — /product/[slug] ───────────────────────────────────
// Async Server Component: fetches product + related products, renders layout.
// Client interactivity (gallery, cart, wishlist, tabs) lives in ProductDetailClient.

import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { ChevronRight } from "lucide-react";
import { getProductBySlug, getRelatedProducts } from "@/lib/supabase-queries";
import ProductDetailClient from "./ProductDetailClient";
import ProductCard from "@/components/shop/ProductCard";
import { MOCK_PRODUCTS } from "@/lib/mockData";

export const revalidate = 300;

// ─── Types ────────────────────────────────────────────────────────────────────

interface Props {
  params: { slug: string };
}

// ─── Category slug helper (category name → URL slug) ─────────────────────────

function toCategorySlug(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

// ─── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product =
    (await getProductBySlug(params.slug).catch(() => null)) ??
    MOCK_PRODUCTS.find((p) => p.slug === params.slug) ??
    null;

  if (!product) return { title: "Product Not Found | YKJ Store" };

  return {
    title: `${product.name} | YKJ African & Caribbean Food Store`,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: product.images[0] ? [{ url: product.images[0] }] : [],
    },
  };
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function ProductPage({ params }: Props) {
  // Fetch from Supabase; fall back to mock data during development
  const product =
    (await getProductBySlug(params.slug).catch(() => null)) ??
    MOCK_PRODUCTS.find((p) => p.slug === params.slug) ??
    null;

  if (!product) notFound();

  // Related products — same category, excluding this one
  const supabaseRelated = await getRelatedProducts(
    product.category_id,
    product.id,
    4
  ).catch(() => []);

  const relatedProducts =
    supabaseRelated.length > 0
      ? supabaseRelated
      : MOCK_PRODUCTS.filter(
          (p) => p.category === product.category && p.id !== product.id
        ).slice(0, 4);

  return (
    <div className="min-h-screen bg-background">

      {/* ── Breadcrumb ── */}
      <nav
        aria-label="Breadcrumb"
        className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-1 text-xs text-muted-foreground flex-wrap"
      >
        <Link href="/" className="hover:text-brand-500 transition-colors">
          Home
        </Link>
        <ChevronRight size={12} className="shrink-0" />
        <Link href="/shop" className="hover:text-brand-500 transition-colors">
          Shop
        </Link>
        <ChevronRight size={12} className="shrink-0" />
        <Link
          href={`/shop/${toCategorySlug(product.category)}`}
          className="hover:text-brand-500 transition-colors"
        >
          {product.category}
        </Link>
        <ChevronRight size={12} className="shrink-0" />
        <span className="text-foreground font-medium truncate max-w-[200px]">
          {product.name}
        </span>
      </nav>

      {/* ── Product detail (image gallery + info + tabs) ── */}
      <ProductDetailClient product={product} />

      {/* ── Related products ── */}
      {relatedProducts.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-16">
          <h2 className="font-heading text-xl font-bold text-gray-900 mb-6">
            You might also like
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
