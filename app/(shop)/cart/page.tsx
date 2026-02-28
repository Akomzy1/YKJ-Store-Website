"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ShoppingBag,
  Minus,
  Plus,
  Trash2,
  ArrowRight,
  Tag,
  X,
  Truck,
} from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import {
  formatPrice,
  getEffectivePrice,
  FREE_DELIVERY_THRESHOLD,
  STANDARD_DELIVERY_COST,
  amountToFreeDelivery,
} from "@/lib/utils";

// ─── Mock promo code validator ────────────────────────────────────────────────

const PROMO_CODES: Record<
  string,
  { type: "percentage" | "fixed"; value: number; label: string }
> = {
  WELCOME10: { type: "percentage", value: 10, label: "10% off your first order" },
  SAVE5:     { type: "fixed",      value: 5,  label: "£5 off your order" },
  YKJ2026:   { type: "percentage", value: 15, label: "15% off — special offer" },
};

function validatePromo(
  code: string,
  subtotal: number
): { discount: number; label: string } | null {
  const promo = PROMO_CODES[code.toUpperCase().trim()];
  if (!promo) return null;
  const discount =
    promo.type === "percentage"
      ? Math.round(subtotal * promo.value) / 100
      : promo.value;
  return { discount, label: promo.label };
}

// ─── Payment icons ────────────────────────────────────────────────────────────

const PAYMENT_METHODS = ["VISA", "MC", "AMEX", "PayPal"] as const;

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CartPage() {
  const [mounted, setMounted]           = useState(false);
  const [promoInput, setPromoInput]     = useState("");
  const [promoError, setPromoError]     = useState("");
  const [promoSuccess, setPromoSuccess] = useState("");

  const {
    items,
    removeItem,
    updateQuantity,
    promoCode,
    discount,
    applyPromo,
    removePromo,
  } = useCartStore();

  useEffect(() => setMounted(true), []);

  // Sync input with current promo code (e.g. when restoring from localStorage)
  useEffect(() => {
    if (promoCode) setPromoInput(promoCode);
  }, [promoCode]);

  if (!mounted) return null;

  // ── Derived totals ───────────────────────────────────────────────────────

  const subtotal          = items.reduce(
    (sum, { product, quantity }) => sum + getEffectivePrice(product) * quantity,
    0
  );
  const effectiveSubtotal = Math.max(0, subtotal - discount);
  const delivery          = effectiveSubtotal >= FREE_DELIVERY_THRESHOLD
    ? 0
    : STANDARD_DELIVERY_COST;
  const total             = effectiveSubtotal + delivery;
  const remaining         = amountToFreeDelivery(effectiveSubtotal);
  const progress          = Math.min((effectiveSubtotal / FREE_DELIVERY_THRESHOLD) * 100, 100);
  const itemCount         = items.reduce((sum, { quantity }) => sum + quantity, 0);

  function handleApplyPromo() {
    setPromoError("");
    setPromoSuccess("");
    if (!promoInput.trim()) return;
    const result = validatePromo(promoInput, subtotal);
    if (!result) {
      setPromoError("Invalid promo code. Try WELCOME10 or SAVE5.");
      return;
    }
    applyPromo(promoInput.toUpperCase().trim(), result.discount);
    setPromoSuccess(result.label);
  }

  function handleRemovePromo() {
    removePromo();
    setPromoInput("");
    setPromoError("");
    setPromoSuccess("");
  }

  // ── Empty state ──────────────────────────────────────────────────────────

  if (items.length === 0) {
    return (
      <div className="min-h-[65vh] flex flex-col items-center justify-center gap-6 px-4 py-20 text-center">
        <div className="w-24 h-24 rounded-full bg-brand-50 flex items-center justify-center">
          <ShoppingBag size={42} className="text-brand-200" />
        </div>
        <div>
          <h1 className="font-heading font-bold text-2xl mb-2">
            Your cart is empty
          </h1>
          <p className="text-muted-foreground text-sm max-w-xs mx-auto leading-relaxed">
            Looks like you haven&apos;t added anything yet. Explore our
            authentic African &amp; Caribbean groceries.
          </p>
        </div>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 px-8 py-3 bg-brand-500 hover:bg-brand-600 text-white font-semibold rounded-lg transition-colors"
        >
          Start Shopping
          <ArrowRight size={16} />
        </Link>
      </div>
    );
  }

  // ── Populated cart ───────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-[#FAFAF8]">

      {/* ── Page header ──────────────────────────────────────────────────── */}
      <div className="bg-white border-b border-border">
        <div className="container mx-auto px-4 py-5">
          <nav aria-label="Breadcrumb" className="mb-2">
            <ol className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <li>
                <Link href="/" className="hover:text-brand-500 transition-colors">
                  Home
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li className="text-foreground font-medium" aria-current="page">
                Cart
              </li>
            </ol>
          </nav>
          <h1 className="font-heading font-bold text-2xl md:text-3xl text-foreground">
            Shopping Cart
            <span className="ml-3 text-base font-body font-normal text-muted-foreground">
              ({itemCount} {itemCount === 1 ? "item" : "items"})
            </span>
          </h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8 items-start">

          {/* ── Cart items ─────────────────────────────────────────────── */}
          <div className="flex-1 min-w-0 space-y-4">

            {/* Free delivery progress bar */}
            <div className="bg-white rounded-xl border border-border p-4">
              {remaining > 0 ? (
                <>
                  <div className="flex items-center gap-2 mb-2.5">
                    <Truck size={15} className="text-brand-500 shrink-0" />
                    <p className="text-sm text-brand-700">
                      Add{" "}
                      <span className="font-bold">{formatPrice(remaining)}</span>{" "}
                      more for <span className="font-bold">free delivery</span>
                    </p>
                  </div>
                  <div className="h-2 bg-brand-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-brand-500 rounded-full transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </>
              ) : (
                <p className="text-sm font-semibold text-green-700 flex items-center gap-2">
                  <span className="text-green-500 text-base">✓</span>
                  You&apos;ve unlocked free delivery!
                </p>
              )}
            </div>

            {/* Desktop column headers */}
            <div className="hidden md:grid md:grid-cols-[1fr_auto_auto_auto] gap-x-6 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              <span>Product</span>
              <span>Unit Price</span>
              <span className="text-center">Qty</span>
              <span className="text-right">Line Total</span>
            </div>

            {/* Item rows */}
            {items.map(({ product, quantity }) => {
              const unitPrice = getEffectivePrice(product);
              const lineTotal = unitPrice * quantity;

              return (
                <div
                  key={product.id}
                  className="bg-white rounded-xl border border-border p-4 md:p-5"
                >
                  <div className="flex gap-4">

                    {/* Image */}
                    <div className="relative w-20 h-20 md:w-24 md:h-24 shrink-0 rounded-lg overflow-hidden bg-brand-50 border border-border/60">
                      {product.images[0] ? (
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          fill
                          className="object-cover"
                          sizes="96px"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ShoppingBag size={26} className="text-brand-200" />
                        </div>
                      )}
                    </div>

                    {/* Details — mobile stacked / desktop grid */}
                    <div className="flex-1 min-w-0 md:grid md:grid-cols-[1fr_auto_auto_auto] md:gap-x-6 md:items-center">

                      {/* Name + weight + remove */}
                      <div className="flex items-start justify-between gap-2 md:block">
                        <div>
                          <p className="text-sm font-semibold leading-snug line-clamp-2">
                            {product.name}
                          </p>
                          {product.weight && product.unit && (
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {product.weight}{product.unit}
                            </p>
                          )}
                          {product.brand && (
                            <p className="text-xs text-muted-foreground">
                              {product.brand}
                            </p>
                          )}
                        </div>
                        {/* Remove (mobile: inline; desktop: removed below) */}
                        <button
                          onClick={() => removeItem(product.id)}
                          aria-label={`Remove ${product.name} from cart`}
                          className="md:hidden shrink-0 p-1.5 rounded-lg text-muted-foreground hover:text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>

                      {/* Unit price */}
                      <div className="mt-2 md:mt-0 md:text-right">
                        {product.sale_price && (
                          <span className="block text-xs text-muted-foreground line-through tabular-nums">
                            {formatPrice(product.price)}
                          </span>
                        )}
                        <span className="text-sm font-medium text-brand-600 tabular-nums">
                          {formatPrice(unitPrice)}
                        </span>
                      </div>

                      {/* Quantity stepper */}
                      <div className="flex items-center gap-3 mt-2 md:mt-0 md:justify-center">
                        <div className="flex items-center border border-border rounded-lg overflow-hidden h-8">
                          <button
                            onClick={() => updateQuantity(product.id, quantity - 1)}
                            disabled={quantity <= 1}
                            aria-label="Decrease quantity"
                            className="w-8 h-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                          >
                            <Minus size={12} />
                          </button>
                          <span
                            className="w-9 text-center text-sm font-semibold select-none"
                            aria-live="polite"
                            aria-label={`Quantity: ${quantity}`}
                          >
                            {quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(product.id, quantity + 1)}
                            aria-label="Increase quantity"
                            className="w-8 h-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                      </div>

                      {/* Line total + remove (desktop) */}
                      <div className="mt-2 md:mt-0 flex items-center justify-between md:justify-end gap-3">
                        <span className="font-bold text-sm text-brand-600 tabular-nums">
                          {formatPrice(lineTotal)}
                        </span>
                        <button
                          onClick={() => removeItem(product.id)}
                          aria-label={`Remove ${product.name} from cart`}
                          className="hidden md:flex p-1.5 rounded-lg text-muted-foreground hover:text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>

                    </div>
                  </div>
                </div>
              );
            })}

            {/* Continue shopping */}
            <Link
              href="/shop"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-brand-600 transition-colors pt-1"
            >
              ← Continue Shopping
            </Link>
          </div>

          {/* ── Order summary sidebar ────────────────────────────────────── */}
          <div className="w-full lg:w-[360px] shrink-0">
            <div className="bg-white rounded-xl border border-border p-6 lg:sticky lg:top-20">
              <h2 className="font-heading font-semibold text-lg mb-4">
                Order Summary
              </h2>

              {/* Breakdown */}
              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Subtotal ({itemCount} {itemCount === 1 ? "item" : "items"})
                  </span>
                  <span className="tabular-nums">{formatPrice(subtotal)}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span className="flex items-center gap-1">
                      <Tag size={12} />
                      Discount ({promoCode})
                    </span>
                    <span className="tabular-nums">
                      −{formatPrice(discount)}
                    </span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Delivery</span>
                  <span className="tabular-nums">
                    {delivery === 0 ? (
                      <span className="text-green-600 font-semibold">FREE</span>
                    ) : (
                      formatPrice(delivery)
                    )}
                  </span>
                </div>

                {remaining > 0 && (
                  <p className="text-xs text-brand-600 bg-brand-50 rounded-lg px-3 py-2">
                    Add {formatPrice(remaining)} more for free delivery
                  </p>
                )}
              </div>

              {/* Total */}
              <div className="border-t border-border mt-3 pt-3">
                <div className="flex justify-between font-bold text-[15px]">
                  <span>Total</span>
                  <span className="text-brand-600 tabular-nums">
                    {formatPrice(total)}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Including VAT where applicable
                </p>
              </div>

              {/* ── Promo code ──────────────────────────────────────────── */}
              <div className="mt-5 pt-4 border-t border-border">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                  Promo Code
                </p>

                {promoCode ? (
                  <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-3 py-2.5">
                    <Tag size={14} className="text-green-600 shrink-0" />
                    <span className="text-sm font-semibold text-green-700 flex-1">
                      {promoCode}
                    </span>
                    <button
                      onClick={handleRemovePromo}
                      aria-label="Remove promo code"
                      className="text-green-600 hover:text-green-900 transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={promoInput}
                      onChange={(e) => {
                        setPromoInput(e.target.value);
                        setPromoError("");
                      }}
                      onKeyDown={(e) => e.key === "Enter" && handleApplyPromo()}
                      placeholder="Enter code"
                      className="flex-1 px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-400 focus:border-brand-400 bg-white uppercase tracking-wider"
                    />
                    <button
                      onClick={handleApplyPromo}
                      disabled={!promoInput.trim()}
                      className="px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Apply
                    </button>
                  </div>
                )}

                {promoError && (
                  <p className="text-xs text-red-600 mt-1.5">{promoError}</p>
                )}
                {promoSuccess && (
                  <p className="text-xs text-green-600 mt-1.5 flex items-center gap-1">
                    <span>✓</span> {promoSuccess}
                  </p>
                )}
              </div>

              {/* ── CTA ─────────────────────────────────────────────────── */}
              <div className="mt-5 space-y-3">
                <Link
                  href="/checkout"
                  className="flex items-center justify-center gap-2 w-full py-3.5 bg-brand-500 hover:bg-brand-600 active:bg-brand-700 text-white font-bold rounded-lg transition-colors text-sm"
                >
                  Proceed to Checkout
                  <ArrowRight size={16} />
                </Link>

                {/* Payment icons */}
                <div className="flex items-center justify-center gap-1.5 flex-wrap pt-1">
                  <span className="text-[10px] text-muted-foreground">
                    Secure payment:
                  </span>
                  {PAYMENT_METHODS.map((method) => (
                    <span
                      key={method}
                      className="inline-flex items-center justify-center h-5 px-2 bg-muted border border-border/70 rounded text-[9px] font-bold text-muted-foreground tracking-wider"
                    >
                      {method}
                    </span>
                  ))}
                  <span className="text-[10px] text-muted-foreground ml-0.5">
                    🔒
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
