"use client";

// ─── Product Detail — Client Component ───────────────────────────────────────
// Handles: image gallery, quantity stepper, add-to-cart, wishlist, tabs.

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ShoppingCart,
  Heart,
  Minus,
  Plus,
  PackageX,
  CheckCircle2,
  Truck,
} from "lucide-react";
import { Product } from "@/types";
import {
  formatPrice,
  getEffectivePrice,
  getDiscountPercentage,
  formatWeight,
  FREE_DELIVERY_THRESHOLD,
} from "@/lib/utils";
import { useCartStore, useWishlistStore } from "@/store/cartStore";

// ── Origin lookup ─────────────────────────────────────────────────────────────

const ORIGIN_MAP: Record<string, { flag: string; name: string }> = {
  nigerian:        { flag: "🇳🇬", name: "Nigerian" },
  ghanaian:        { flag: "🇬🇭", name: "Ghanaian" },
  jamaican:        { flag: "🇯🇲", name: "Jamaican" },
  cameroonian:     { flag: "🇨🇲", name: "Cameroonian" },
  "south-african": { flag: "🇿🇦", name: "South African" },
  zimbabwean:      { flag: "🇿🇼", name: "Zimbabwean" },
  congolese:       { flag: "🇨🇩", name: "Congolese" },
  "pan-african":   { flag: "🌍", name: "Pan-African" },
};

function toCategorySlug(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

// ── Component ─────────────────────────────────────────────────────────────────

interface Props {
  product: Product;
}

export default function ProductDetailClient({ product }: Props) {
  const [selectedImg, setSelectedImg] = useState(0);
  const [qty, setQty]                 = useState(1);
  const [mounted, setMounted]         = useState(false);
  const [addedFeedback, setAdded]     = useState(false);
  const [activeTab, setActiveTab]     = useState<"description" | "details">("description");

  const addItem        = useCartStore((s) => s.addItem);
  const openDrawer     = useCartStore((s) => s.openDrawer);
  const toggleWishlist = useWishlistStore((s) => s.toggleWishlist);
  const wishlisted     = useWishlistStore((s) => s.isWishlisted(product.id));

  useEffect(() => setMounted(true), []);

  const effectivePrice = getEffectivePrice(product);
  const discountPct    = getDiscountPercentage(product);
  const isOutOfStock   = product.stock_qty === 0;
  const originInfo     = product.origin ? ORIGIN_MAP[product.origin] : null;
  const displayWeight  = formatWeight(product.weight, product.unit);
  const amountToFree   = Math.max(0, FREE_DELIVERY_THRESHOLD - effectivePrice * qty);

  // Always have at least one slot in the gallery
  const images = product.images.length > 0 ? product.images : [null as unknown as string];

  function handleAddToCart() {
    if (isOutOfStock) return;
    addItem(product, qty);
    openDrawer();
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 lg:py-12">

      {/* ── Main two-column grid ──────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">

        {/* ── Left: Image gallery ── */}
        <div className="space-y-3">
          {/* Main image */}
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-brand-50 border border-border">
            {images[selectedImg] ? (
              <Image
                src={images[selectedImg]}
                alt={product.name}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center gap-3 text-brand-200">
                <ShoppingCart size={56} />
                <span className="text-sm font-medium text-center px-8 leading-snug">
                  {product.name}
                </span>
              </div>
            )}

            {/* Discount badge */}
            {discountPct !== null && (
              <span className="absolute top-4 left-4 bg-red-600 text-white text-sm font-bold px-2.5 py-1 rounded-lg leading-none">
                -{discountPct}%
              </span>
            )}
          </div>

          {/* Thumbnail strip (only when multiple images) */}
          {product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImg(i)}
                  className={`relative shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedImg === i
                      ? "border-brand-500"
                      : "border-border hover:border-brand-300"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`${product.name} view ${i + 1}`}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── Right: Product info ── */}
        <div className="space-y-5">

          {/* Badges */}
          <div className="flex flex-wrap gap-2">
            {originInfo && (
              <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-200 text-xs font-semibold px-2.5 py-1 rounded-full">
                {originInfo.flag} {originInfo.name}
              </span>
            )}
            {product.is_halal && (
              <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 border border-green-200 text-xs font-semibold px-2.5 py-1 rounded-full">
                ✓ Halal
              </span>
            )}
            {product.is_vegan && (
              <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold px-2.5 py-1 rounded-full">
                🌱 Vegan
              </span>
            )}
            {product.is_deal && (
              <span className="inline-flex items-center gap-1 bg-red-50 text-red-700 border border-red-200 text-xs font-semibold px-2.5 py-1 rounded-full">
                🔥 Deal
              </span>
            )}
          </div>

          {/* Name + brand */}
          <div>
            <h1 className="font-heading text-2xl sm:text-3xl font-bold text-gray-900 leading-snug">
              {product.name}
            </h1>
            {product.brand && (
              <p className="text-sm text-muted-foreground mt-1">by {product.brand}</p>
            )}
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-brand-600">
              {formatPrice(effectivePrice)}
            </span>
            {product.sale_price !== null && (
              <span className="text-lg text-muted-foreground line-through tabular-nums">
                {formatPrice(product.price)}
              </span>
            )}
            {displayWeight && (
              <span className="text-sm text-muted-foreground">/ {displayWeight}</span>
            )}
          </div>

          {/* Stock status */}
          <div>
            {isOutOfStock ? (
              <span className="inline-flex items-center gap-1.5 text-red-600 text-sm font-medium">
                <PackageX size={15} /> Out of Stock
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-green-600 text-sm font-medium">
                <CheckCircle2 size={15} /> In Stock
                {product.stock_qty <= 5 && (
                  <span className="text-amber-600 font-semibold ml-1">
                    — only {product.stock_qty} left!
                  </span>
                )}
              </span>
            )}
          </div>

          {/* Quantity stepper + Add to cart + Wishlist */}
          <div className="flex items-center gap-3">
            {/* Stepper */}
            <div className="flex items-center rounded-xl border border-border overflow-hidden shrink-0">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                disabled={qty <= 1}
                aria-label="Decrease quantity"
                className="w-10 h-11 flex items-center justify-center hover:bg-gray-50 transition-colors text-gray-600 disabled:opacity-40"
              >
                <Minus size={14} />
              </button>
              <span className="w-10 h-11 flex items-center justify-center text-sm font-semibold tabular-nums border-x border-border select-none">
                {qty}
              </span>
              <button
                onClick={() => setQty((q) => Math.min(product.stock_qty, q + 1))}
                disabled={qty >= product.stock_qty}
                aria-label="Increase quantity"
                className="w-10 h-11 flex items-center justify-center hover:bg-gray-50 transition-colors text-gray-600 disabled:opacity-40"
              >
                <Plus size={14} />
              </button>
            </div>

            {/* Add to cart */}
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className="flex-1 flex items-center justify-center gap-2 h-11 rounded-xl text-sm font-semibold transition-all
                bg-brand-500 hover:bg-brand-600 active:bg-brand-700 text-white
                disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {addedFeedback ? (
                <><CheckCircle2 size={16} /> Added to cart!</>
              ) : (
                <><ShoppingCart size={16} /> {isOutOfStock ? "Out of Stock" : "Add to Cart"}</>
              )}
            </button>

            {/* Wishlist */}
            <button
              onClick={() => { if (mounted) toggleWishlist(product.id); }}
              aria-label={mounted && wishlisted ? "Remove from wishlist" : "Save to wishlist"}
              className="w-11 h-11 flex items-center justify-center rounded-xl border border-border hover:bg-gray-50 transition-colors shrink-0"
            >
              <Heart
                size={18}
                className={
                  mounted && wishlisted
                    ? "text-red-500 fill-red-500"
                    : "text-gray-400"
                }
              />
            </button>
          </div>

          {/* Free delivery nudge */}
          {!isOutOfStock && (
            <div className="flex items-start gap-2 bg-green-50 border border-green-100 rounded-xl px-4 py-3 text-sm text-green-800">
              <Truck size={16} className="mt-0.5 shrink-0" />
              {amountToFree > 0 ? (
                <span>
                  Spend{" "}
                  <strong>{formatPrice(amountToFree)}</strong> more to unlock{" "}
                  <strong>free delivery</strong>
                </span>
              ) : (
                <span><strong>Free delivery</strong> qualifies on this order</span>
              )}
            </div>
          )}

          {/* Category breadcrumb link */}
          <p className="text-xs text-muted-foreground">
            Category:{" "}
            <Link
              href={`/shop/${toCategorySlug(product.category)}`}
              className="text-brand-500 hover:underline font-medium"
            >
              {product.category}
            </Link>
          </p>
        </div>
      </div>

      {/* ── Tabs: Description | Details ──────────────────────────────────── */}
      <div className="mt-12 border-t border-border">
        {/* Tab bar */}
        <div className="flex border-b border-border">
          {(["description", "details"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-3.5 text-sm font-semibold capitalize transition-colors border-b-2 -mb-px ${
                activeTab === tab
                  ? "border-brand-500 text-brand-600"
                  : "border-transparent text-muted-foreground hover:text-gray-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="py-7">
          {activeTab === "description" ? (
            <p className="text-gray-700 leading-relaxed max-w-2xl whitespace-pre-line">
              {product.description || "No description available."}
            </p>
          ) : (
            <dl className="max-w-sm grid grid-cols-[auto_1fr] gap-x-10 gap-y-3.5 text-sm">
              {[
                ["Category",  product.category],
                ["Origin",    originInfo ? `${originInfo.flag} ${originInfo.name}` : "—"],
                ["Brand",     product.brand ?? "—"],
                ["Weight",    displayWeight ?? "—"],
                ["Halal",     product.is_halal ? "Yes ✓" : "No"],
                ["Vegan",     product.is_vegan ? "Yes ✓" : "No"],
                ["Stock",     isOutOfStock ? "Out of stock" : `${product.stock_qty} available`],
              ].map(([label, value]) => (
                <div key={label} className="contents">
                  <dt className="font-semibold text-gray-500 whitespace-nowrap">{label}</dt>
                  <dd className="text-gray-900">{value}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      </div>
    </div>
  );
}
