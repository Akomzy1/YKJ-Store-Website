"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useCartStore } from "@/store/cartStore";
import {
  formatPrice,
  getEffectivePrice,
  FREE_DELIVERY_THRESHOLD,
  STANDARD_DELIVERY_COST,
} from "@/lib/utils";
import CartItem from "./CartItem";

export default function CartDrawer() {
  const [mounted, setMounted] = useState(false);

  const isDrawerOpen  = useCartStore((s) => s.isDrawerOpen);
  const closeDrawer   = useCartStore((s) => s.closeDrawer);
  const items         = useCartStore((s) => s.items);
  const removeItem    = useCartStore((s) => s.removeItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);

  useEffect(() => setMounted(true), []);

  // ── Derived totals ──────────────────────────────────────────────────────
  const subtotal   = items.reduce(
    (sum, { product, quantity }) => sum + getEffectivePrice(product) * quantity,
    0
  );
  const itemCount  = items.reduce((sum, { quantity }) => sum + quantity, 0);
  const delivery   = subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : STANDARD_DELIVERY_COST;
  const total      = subtotal + delivery;
  const remaining  = Math.max(FREE_DELIVERY_THRESHOLD - subtotal, 0);
  const progress   = Math.min((subtotal / FREE_DELIVERY_THRESHOLD) * 100, 100);

  if (!mounted) return null;

  return (
    <Sheet open={isDrawerOpen} onOpenChange={(open) => !open && closeDrawer()}>
      <SheetContent
        side="right"
        className="w-full max-w-[420px] p-0 flex flex-col gap-0 bg-white [&>button]:top-4 [&>button]:right-4"
      >
        {/* ── Header ─────────────────────────────────────────────────────── */}
        <SheetHeader className="flex-row items-center gap-2 px-5 py-4 border-b border-border shrink-0 space-y-0">
          <ShoppingBag size={19} className="text-brand-500 shrink-0" />
          <SheetTitle className="font-heading text-[17px] leading-none text-foreground">
            Your Cart
          </SheetTitle>
          {itemCount > 0 && (
            <span className="ml-auto text-xs font-body font-normal text-muted-foreground">
              {itemCount} {itemCount === 1 ? "item" : "items"}
            </span>
          )}
        </SheetHeader>

        {/* ── Empty state ───────────────────────────────────────────────── */}
        {items.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center gap-5 px-8 text-center">
            {/* Illustration */}
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-brand-50 flex items-center justify-center">
                <ShoppingBag size={42} className="text-brand-200" />
              </div>
              <span className="absolute -bottom-1 -right-1 text-2xl">🛒</span>
            </div>

            <div>
              <p className="font-heading text-xl font-bold mb-2 text-foreground">
                Your cart is empty
              </p>
              <p className="text-muted-foreground text-sm leading-relaxed max-w-[220px] mx-auto">
                Add authentic African &amp; Caribbean favourites to get started.
              </p>
            </div>

            <Link
              href="/shop"
              onClick={closeDrawer}
              className="px-8 py-3 bg-brand-500 hover:bg-brand-600 text-white font-semibold rounded-lg transition-colors text-sm"
            >
              Start Shopping
            </Link>
          </div>
        )}

        {/* ── Populated cart ────────────────────────────────────────────── */}
        {items.length > 0 && (
          <>
            {/* Free delivery progress bar */}
            <div className="px-5 py-3 bg-brand-50 border-b border-border shrink-0">
              {remaining > 0 ? (
                <>
                  <p className="text-xs text-brand-700 mb-2">
                    Spend{" "}
                    <span className="font-bold">{formatPrice(remaining)}</span>{" "}
                    more for{" "}
                    <span className="font-bold">free delivery</span>
                  </p>
                  <div className="h-1.5 bg-brand-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-brand-500 rounded-full transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </>
              ) : (
                <p className="text-xs font-semibold text-green-700 flex items-center gap-1.5">
                  <span className="text-green-500 text-base leading-none">✓</span>
                  You&apos;ve unlocked free delivery!
                </p>
              )}
            </div>

            {/* Scrollable items list — uses CartItem sub-component */}
            <div className="flex-1 overflow-y-auto divide-y divide-border">
              {items.map((item) => (
                <CartItem
                  key={item.product.id}
                  item={item}
                  onQuantityChange={updateQuantity}
                  onRemove={removeItem}
                />
              ))}
            </div>

            {/* ── Sticky footer ────────────────────────────────────────── */}
            <div className="border-t border-border px-5 pt-4 pb-5 space-y-3 shrink-0 bg-white shadow-[0_-4px_16px_rgba(0,0,0,0.06)]">
              {/* Order summary */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span className="tabular-nums">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Delivery</span>
                  <span className="tabular-nums">
                    {delivery === 0 ? (
                      <span className="text-green-600 font-semibold">FREE</span>
                    ) : (
                      formatPrice(delivery)
                    )}
                  </span>
                </div>
                <div className="flex justify-between font-bold text-[15px] pt-2 border-t border-border">
                  <span>Total</span>
                  <span className="text-brand-600 tabular-nums">
                    {formatPrice(total)}
                  </span>
                </div>
              </div>

              {/* Primary CTA */}
              <Link
                href="/checkout"
                onClick={closeDrawer}
                className="flex items-center justify-center w-full py-3 bg-brand-500 hover:bg-brand-600 active:bg-brand-700 text-white font-bold rounded-lg transition-colors text-sm"
              >
                Proceed to Checkout →
              </Link>

              {/* Secondary text link */}
              <div className="text-center">
                <button
                  onClick={closeDrawer}
                  className="text-sm text-muted-foreground hover:text-brand-600 underline underline-offset-2 transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
