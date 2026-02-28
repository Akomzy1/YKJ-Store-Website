"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart, PackageX } from "lucide-react";
import { Product } from "@/types";
import {
  formatPrice,
  getEffectivePrice,
  getDiscountPercentage,
} from "@/lib/utils";
import { useCartStore, useWishlistStore } from "@/store/cartStore";

// ── Local origin lookup (avoids importing mock-data into a reusable component) ─

const ORIGIN_MAP: Record<string, { flag: string; name: string }> = {
  nigerian:        { flag: "🇳🇬", name: "Nigerian" },
  ghanaian:        { flag: "🇬🇭", name: "Ghanaian" },
  jamaican:        { flag: "🇯🇲", name: "Jamaican" },
  cameroonian:     { flag: "🇨🇲", name: "Cameroonian" },
  "south-african": { flag: "🇿🇦", name: "S. African" },
  zimbabwean:      { flag: "🇿🇼", name: "Zimbabwean" },
  congolese:       { flag: "🇨🇩", name: "Congolese" },
  "pan-african":   { flag: "🌍", name: "Pan-African" },
};

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [mounted, setMounted] = useState(false);

  const addItem    = useCartStore((s) => s.addItem);
  const openDrawer = useCartStore((s) => s.openDrawer);

  const toggleWishlist = useWishlistStore((s) => s.toggleWishlist);
  const wishlisted     = useWishlistStore((s) => s.isWishlisted(product.id));

  useEffect(() => setMounted(true), []);

  const effectivePrice = getEffectivePrice(product);
  const discountPct    = getDiscountPercentage(product);
  const isOutOfStock   = product.stock_qty === 0;
  const originInfo     = product.origin ? ORIGIN_MAP[product.origin] : null;

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault(); // card is a Link — prevent navigation on button click
    if (isOutOfStock) return;
    addItem(product);
    openDrawer();
  }

  function handleWishlist(e: React.MouseEvent) {
    e.preventDefault();
    if (!mounted) return;
    toggleWishlist(product.id);
  }

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group relative bg-white rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow flex flex-col overflow-hidden"
    >
      {/* ── Product image ───────────────────────────────────────────────── */}
      <div className="relative aspect-square bg-brand-50 overflow-hidden shrink-0">
        {product.images[0] ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          /* Placeholder until real product images are supplied */
          <div className="w-full h-full flex flex-col items-center justify-center gap-2">
            <ShoppingCart size={28} className="text-brand-200" />
            <span className="text-[10px] text-brand-200 font-medium text-center px-2 leading-tight">
              {product.name}
            </span>
          </div>
        )}

        {/* ── Discount badge ───────────────────────────────────────────── */}
        {discountPct !== null && (
          <span className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded leading-none">
            -{discountPct}%
          </span>
        )}

        {/* ── Wishlist toggle ──────────────────────────────────────────── */}
        <button
          onClick={handleWishlist}
          aria-label={
            mounted && wishlisted
              ? `Remove ${product.name} from wishlist`
              : `Save ${product.name} to wishlist`
          }
          className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow-sm transition-colors"
        >
          <Heart
            size={15}
            className={
              mounted && wishlisted
                ? "text-red-500 fill-red-500"
                : "text-muted-foreground"
            }
          />
        </button>

        {/* ── Out-of-stock overlay ─────────────────────────────────────── */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center gap-1.5">
            <PackageX size={24} className="text-white/90" />
            <span className="text-white text-xs font-semibold">Out of Stock</span>
          </div>
        )}
      </div>

      {/* ── Card body ───────────────────────────────────────────────────── */}
      <div className="flex flex-col flex-1 p-3 gap-1.5">

        {/* Category pill + origin flag */}
        <div className="flex items-center justify-between gap-2">
          <span className="inline-block bg-brand-50 text-brand-600 text-[10px] font-semibold px-2 py-0.5 rounded-full truncate max-w-[110px] leading-snug">
            {product.category}
          </span>
          {originInfo && (
            <span className="text-[10px] text-muted-foreground shrink-0 leading-snug">
              {originInfo.flag} {originInfo.name}
            </span>
          )}
        </div>

        {/* Product name — clamped to 2 lines */}
        <p className="text-sm font-medium leading-snug line-clamp-2 flex-1 text-foreground">
          {product.name}
        </p>

        {/* Price row */}
        <div className="flex items-baseline gap-1.5">
          <span className="font-bold text-base text-brand-600">
            {formatPrice(effectivePrice)}
          </span>
          {product.sale_price !== null && (
            <span className="text-xs text-muted-foreground line-through tabular-nums">
              {formatPrice(product.price)}
            </span>
          )}
        </div>

        {/* Add to Cart button */}
        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className="mt-1 flex items-center justify-center gap-2 w-full py-2 rounded-lg text-sm font-semibold transition-colors
            bg-brand-500 hover:bg-brand-600 active:bg-brand-700 text-white
            disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ShoppingCart size={13} aria-hidden />
          {isOutOfStock ? "Out of Stock" : "Add to Cart"}
        </button>
      </div>
    </Link>
  );
}
