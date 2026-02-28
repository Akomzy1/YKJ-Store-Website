"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, ShoppingCart, Heart, PackageX, Flame } from "lucide-react";
import { getDealProducts } from "@/lib/mockData";
import { formatPrice, getEffectivePrice, getDiscountPercentage } from "@/lib/utils";
import { useCartStore, useWishlistStore } from "@/store/cartStore";
import { Product } from "@/types";

// ─── Countdown Timer ──────────────────────────────────────────────────────────
// Counts down to midnight tonight (deals reset daily)

function getMidnightMs(): number {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);
  return midnight.getTime() - now.getTime();
}

function formatUnit(n: number) {
  return String(n).padStart(2, "0");
}

function CountdownTimer() {
  const [ms, setMs] = useState<number | null>(null); // null = not yet mounted

  useEffect(() => {
    setMs(getMidnightMs());
    const id = setInterval(() => {
      setMs((prev) => {
        if (prev === null || prev <= 1000) return getMidnightMs();
        return prev - 1000;
      });
    }, 1000);
    return () => clearInterval(id);
  }, []);

  // Avoid hydration mismatch — render placeholder until mounted
  if (ms === null) {
    return (
      <div className="flex items-center gap-1.5 text-white" aria-label="Loading countdown">
        {["--", "--", "--"].map((v, i) => (
          <span key={i} className="flex flex-col items-center">
            <span className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-lg bg-white/20 font-bold text-lg md:text-xl tabular-nums">
              {v}
            </span>
            <span className="text-[9px] text-white/60 mt-0.5 uppercase tracking-wider">
              {["HRS", "MIN", "SEC"][i]}
            </span>
          </span>
        ))}
      </div>
    );
  }

  const totalSec = Math.floor(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  const units = [
    { label: "HRS", value: h },
    { label: "MIN", value: m },
    { label: "SEC", value: s },
  ];

  return (
    <div
      className="flex items-center gap-1.5 text-white"
      aria-label={`Deals end in ${h} hours ${m} minutes ${s} seconds`}
      aria-live="polite"
      aria-atomic="true"
    >
      {units.map(({ label, value }, i) => (
        <span key={label} className="flex flex-col items-center">
          <span className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-lg bg-white/20 font-bold text-lg md:text-xl tabular-nums">
            {formatUnit(value)}
          </span>
          <span className="text-[9px] text-white/60 mt-0.5 uppercase tracking-wider">
            {label}
          </span>
          {/* Colon separator — hidden after last unit */}
          {i < 2 && (
            <span
              className="sr-only"
              aria-hidden
            />
          )}
        </span>
      ))}
    </div>
  );
}

// ─── Deal Card ────────────────────────────────────────────────────────────────

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

function DealCard({ product }: { product: Product }) {
  const [mounted, setMounted] = useState(false);
  const addItem        = useCartStore((s) => s.addItem);
  const openDrawer     = useCartStore((s) => s.openDrawer);
  const toggleWishlist = useWishlistStore((s) => s.toggleWishlist);
  const wishlisted     = useWishlistStore((s) => s.isWishlisted(product.id));

  useEffect(() => setMounted(true), []);

  const effectivePrice = getEffectivePrice(product);
  const discountPct    = getDiscountPercentage(product);
  const isOutOfStock   = product.stock_qty === 0;
  const originInfo     = product.origin ? ORIGIN_MAP[product.origin] : null;

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
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
      className="group relative bg-white rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow flex flex-col overflow-hidden w-[220px] sm:w-[240px] shrink-0"
    >
      {/* Image area */}
      <div className="relative aspect-square bg-brand-50 overflow-hidden shrink-0">
        {/* Placeholder (no images in mock data) */}
        <div className="w-full h-full flex flex-col items-center justify-center gap-2">
          <ShoppingCart size={28} className="text-brand-200" />
          <span className="text-[10px] text-brand-200 font-medium text-center px-2 leading-tight">
            {product.name}
          </span>
        </div>

        {/* Bigger discount badge for deals */}
        {discountPct !== null && (
          <span className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-md leading-none shadow-sm">
            -{discountPct}% OFF
          </span>
        )}

        {/* Wishlist */}
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
              mounted && wishlisted ? "text-red-500 fill-red-500" : "text-muted-foreground"
            }
          />
        </button>

        {/* Out of stock */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center gap-1.5">
            <PackageX size={24} className="text-white/90" />
            <span className="text-white text-xs font-semibold">Out of Stock</span>
          </div>
        )}
      </div>

      {/* Card body */}
      <div className="flex flex-col flex-1 p-3 gap-1.5">
        {/* Category + origin */}
        <div className="flex items-center justify-between gap-2">
          <span className="inline-block bg-brand-50 text-brand-600 text-[10px] font-semibold px-2 py-0.5 rounded-full truncate max-w-[110px]">
            {product.category}
          </span>
          {originInfo && (
            <span className="text-[10px] text-muted-foreground shrink-0">
              {originInfo.flag} {originInfo.name}
            </span>
          )}
        </div>

        {/* Name */}
        <p className="text-sm font-medium leading-snug line-clamp-2 flex-1 text-foreground">
          {product.name}
        </p>

        {/* Urgency text */}
        <p className="text-[11px] text-orange-600 font-semibold flex items-center gap-1">
          <Flame size={11} aria-hidden />
          Hurry, limited stock!
        </p>

        {/* Price */}
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

        {/* Add to Cart */}
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

// ─── Section ──────────────────────────────────────────────────────────────────

interface DealsSectionProps {
  deals?: Product[];
}

export default function DealsSection({ deals }: DealsSectionProps) {
  const DEALS = deals ?? getDealProducts();

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    dragFree: true,
    containScroll: "trimSnaps",
  });

  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanPrev(emblaApi.canScrollPrev());
    setCanNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  if (DEALS.length === 0) return null;

  return (
    <section className="py-12 md:py-16 bg-gradient-to-br from-brand-600 to-brand-800 overflow-hidden">
      <div className="container mx-auto px-4">

        {/* ── Header row ──────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 mb-8">

          {/* Title */}
          <div className="flex-1">
            <p className="text-xs font-bold uppercase tracking-widest text-gold-400 mb-1">
              Today Only
            </p>
            <h2 className="font-heading font-bold text-2xl md:text-3xl text-white flex items-center gap-2">
              🔥 Deals of the Day
            </h2>
          </div>

          {/* Countdown + nav */}
          <div className="flex items-center gap-4 sm:gap-6 flex-wrap">
            <CountdownTimer />

            {/* Carousel arrow buttons */}
            <div className="flex gap-2 ml-auto sm:ml-0">
              <button
                onClick={() => emblaApi?.scrollPrev()}
                disabled={!canPrev}
                aria-label="Scroll left"
                className="w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={() => emblaApi?.scrollNext()}
                disabled={!canNext}
                aria-label="Scroll right"
                className="w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* ── Embla carousel ──────────────────────────────────────────── */}
        <div ref={emblaRef} className="overflow-hidden -mx-4 px-4">
          <div className="flex gap-3 md:gap-4">
            {DEALS.map((product) => (
              <DealCard key={product.id} product={product} />
            ))}

            {/* "View All Deals" end card */}
            <Link
              href="/deals"
              className="flex flex-col items-center justify-center gap-3 shrink-0 w-[160px] sm:w-[180px] rounded-xl border-2 border-white/30 hover:border-white/60 text-white transition-colors"
            >
              <span className="text-3xl">🏷️</span>
              <div className="text-center">
                <p className="font-semibold text-sm">View All</p>
                <p className="font-semibold text-sm">Deals</p>
              </div>
              <ChevronRight size={18} className="text-white/60" />
            </Link>
          </div>
        </div>

        {/* ── Mobile CTA ──────────────────────────────────────────────── */}
        <div className="mt-6 text-center sm:hidden">
          <Link
            href="/deals"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-gold-400 hover:text-gold-300 transition-colors underline underline-offset-4"
          >
            View All Deals →
          </Link>
        </div>
      </div>
    </section>
  );
}
