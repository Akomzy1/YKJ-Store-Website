// ─────────────────────────────────────────────────────────────────────────────
// YKJ Store — Utility Functions
// ─────────────────────────────────────────────────────────────────────────────

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Product, Cart, CartItem } from "@/types";

// ─── shadcn/ui ────────────────────────────────────────────────────────────────

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ─── Price ────────────────────────────────────────────────────────────────────

const GBP = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/** Format a number as GBP — e.g. 3.5 → "£3.50" */
export function formatPrice(amount: number): string {
  return GBP.format(amount);
}

/** Format a price range — e.g. "£2.99 – £8.99" */
export function formatPriceRange(min: number, max: number): string {
  return `${formatPrice(min)} – ${formatPrice(max)}`;
}

// ─── Delivery ─────────────────────────────────────────────────────────────────

export const FREE_DELIVERY_THRESHOLD = 60; // £60
export const STANDARD_DELIVERY_COST = 4.99;
export const EXPRESS_DELIVERY_COST = 7.99;

/**
 * Calculate delivery cost based on order subtotal.
 * Free on orders ≥ £60, otherwise £4.99 standard.
 */
export function calculateDelivery(subtotal: number): number {
  return subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : STANDARD_DELIVERY_COST;
}

/** How much more the customer needs to spend to unlock free delivery */
export function amountToFreeDelivery(subtotal: number): number {
  const remaining = FREE_DELIVERY_THRESHOLD - subtotal;
  return remaining > 0 ? remaining : 0;
}

// ─── Cart ─────────────────────────────────────────────────────────────────────

/** Calculate cart subtotal from items array */
export function calculateSubtotal(items: CartItem[]): number {
  return items.reduce((sum, item) => {
    const price = item.product.sale_price ?? item.product.price;
    return sum + price * item.quantity;
  }, 0);
}

/** Build a full Cart object from items + optional promo discount */
export function buildCart(
  items: CartItem[],
  promoCode: string | null = null,
  discount: number = 0
): Cart {
  const subtotal = calculateSubtotal(items);
  const delivery_cost = calculateDelivery(subtotal - discount);
  const total = Math.max(0, subtotal - discount) + delivery_cost;
  return { items, subtotal, delivery_cost, total, promo_code: promoCode, discount };
}

// ─── Product helpers ──────────────────────────────────────────────────────────

/** Effective selling price — sale_price if set, else price */
export function getEffectivePrice(product: Product): number {
  return product.sale_price ?? product.price;
}

/**
 * Discount percentage off original price.
 * Returns null if not on sale.
 */
export function getDiscountPercentage(product: Product): number | null {
  if (!product.sale_price || product.sale_price >= product.price) return null;
  return Math.round(((product.price - product.sale_price) / product.price) * 100);
}

/** Human-readable weight string — e.g. 500 + "g" → "500g", 1 + "kg" → "1kg" */
export function formatWeight(weight: number | null, unit: string | null): string | null {
  if (!weight || !unit) return null;
  return `${weight}${unit}`;
}

// ─── Text ─────────────────────────────────────────────────────────────────────

/**
 * Truncate text to a max character length, appending "…"
 * Breaks at the last word boundary within the limit.
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  const truncated = text.slice(0, maxLength);
  const lastSpace = truncated.lastIndexOf(" ");
  return (lastSpace > 0 ? truncated.slice(0, lastSpace) : truncated) + "…";
}

/**
 * Generate a URL-safe slug from a display name.
 * e.g. "Poundo Yam Flour (2kg)" → "poundo-yam-flour-2kg"
 */
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")   // remove special chars (except hyphen)
    .trim()
    .replace(/\s+/g, "-")            // spaces → hyphens
    .replace(/-+/g, "-");            // collapse multiple hyphens
}

// ─── Date ─────────────────────────────────────────────────────────────────────

/** Time remaining until a deal ends, as a human string — e.g. "2h 34m" */
export function timeUntil(isoDate: string): string {
  const diff = new Date(isoDate).getTime() - Date.now();
  if (diff <= 0) return "Ended";
  const h = Math.floor(diff / 3_600_000);
  const m = Math.floor((diff % 3_600_000) / 60_000);
  const s = Math.floor((diff % 60_000) / 1_000);
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

/** Format an ISO date string to UK date — e.g. "28 Feb 2026" */
export function formatDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// ─── Misc ─────────────────────────────────────────────────────────────────────

/** Return the first image URL for a product, or a placeholder */
export function getProductImage(product: Product, placeholder = "/assets/placeholder-product.jpg"): string {
  return product.images?.[0] ?? placeholder;
}

/** Clamp a number between min and max */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
