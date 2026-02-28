// ─────────────────────────────────────────────────────────────────────────────
// YKJ Store — Zustand Cart Store
// Persisted to localStorage via zustand/middleware persist
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { CartItem, Product } from "@/types";
import {
  calculateSubtotal,
  calculateDelivery,
  getEffectivePrice,
} from "@/lib/utils";

interface CartStore {
  // ─── State ──────────────────────────────────────────────────────────────────
  items: CartItem[];
  promoCode: string | null;
  discount: number;       // absolute GBP value of discount
  isDrawerOpen: boolean;

  // ─── Cart actions ────────────────────────────────────────────────────────────
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;

  // ─── Promo code ──────────────────────────────────────────────────────────────
  applyPromo: (code: string, discount: number) => void;
  removePromo: () => void;

  // ─── Drawer ──────────────────────────────────────────────────────────────────
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;

  // ─── Computed (getters) ───────────────────────────────────────────────────────
  getItemCount: () => number;
  getSubtotal: () => number;
  getDeliveryCost: () => number;
  getTotal: () => number;
  hasItem: (productId: string) => boolean;
  getItemQuantity: (productId: string) => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      promoCode: null,
      discount: 0,
      isDrawerOpen: false,

      // ─── Cart actions ──────────────────────────────────────────────────────

      addItem: (product, quantity = 1) => {
        set((state) => {
          const existing = state.items.find(
            (i) => i.product.id === product.id
          );
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.product.id === product.id
                  ? { ...i, quantity: i.quantity + quantity }
                  : i
              ),
            };
          }
          return {
            items: [...state.items, { product, quantity }],
          };
        });
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((i) => i.product.id !== productId),
        }));
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.product.id === productId ? { ...i, quantity } : i
          ),
        }));
      },

      clearCart: () =>
        set({ items: [], promoCode: null, discount: 0 }),

      // ─── Promo ────────────────────────────────────────────────────────────

      applyPromo: (code, discount) =>
        set({ promoCode: code, discount }),

      removePromo: () =>
        set({ promoCode: null, discount: 0 }),

      // ─── Drawer ───────────────────────────────────────────────────────────

      openDrawer: () => set({ isDrawerOpen: true }),
      closeDrawer: () => set({ isDrawerOpen: false }),
      toggleDrawer: () => set((s) => ({ isDrawerOpen: !s.isDrawerOpen })),

      // ─── Computed ─────────────────────────────────────────────────────────

      getItemCount: () =>
        get().items.reduce((sum, i) => sum + i.quantity, 0),

      getSubtotal: () => calculateSubtotal(get().items),

      getDeliveryCost: () => {
        const subtotal = calculateSubtotal(get().items);
        return calculateDelivery(subtotal - get().discount);
      },

      getTotal: () => {
        const subtotal = calculateSubtotal(get().items);
        const delivery = calculateDelivery(subtotal - get().discount);
        return Math.max(0, subtotal - get().discount) + delivery;
      },

      hasItem: (productId) =>
        get().items.some((i) => i.product.id === productId),

      getItemQuantity: (productId) =>
        get().items.find((i) => i.product.id === productId)?.quantity ?? 0,
    }),
    {
      name: "ykj-cart-v2",
      storage: createJSONStorage(() => localStorage),
      // Only persist the data, not the drawer state
      partialize: (state) => ({
        items: state.items,
        promoCode: state.promoCode,
        discount: state.discount,
      }),
    }
  )
);

// ─── Wishlist store (separate from cart) ─────────────────────────────────────

interface WishlistStore {
  productIds: string[];
  addToWishlist: (productId: string) => void;
  removeFromWishlist: (productId: string) => void;
  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      productIds: [],

      addToWishlist: (productId) =>
        set((state) => ({
          productIds: state.productIds.includes(productId)
            ? state.productIds
            : [...state.productIds, productId],
        })),

      removeFromWishlist: (productId) =>
        set((state) => ({
          productIds: state.productIds.filter((id) => id !== productId),
        })),

      toggleWishlist: (productId) => {
        if (get().isWishlisted(productId)) {
          get().removeFromWishlist(productId);
        } else {
          get().addToWishlist(productId);
        }
      },

      isWishlisted: (productId) => get().productIds.includes(productId),
    }),
    {
      name: "ykj-wishlist",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
