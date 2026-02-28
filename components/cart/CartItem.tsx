"use client";

import Image from "next/image";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { CartItem as CartItemType } from "@/types";
import { formatPrice, getEffectivePrice } from "@/lib/utils";

interface CartItemProps {
  item: CartItemType;
  onQuantityChange: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
}

export default function CartItem({
  item,
  onQuantityChange,
  onRemove,
}: CartItemProps) {
  const { product, quantity } = item;
  const unitPrice = getEffectivePrice(product);
  const lineTotal = unitPrice * quantity;

  return (
    <div className="flex gap-3 px-5 py-4 group hover:bg-muted/20 transition-colors">
      {/* ── Product image ───────────────────────────────────────────────── */}
      <div className="relative w-[50px] h-[50px] shrink-0 rounded-lg overflow-hidden bg-brand-50 border border-border/60">
        {product.images[0] ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover"
            sizes="50px"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ShoppingBag size={18} className="text-brand-200" />
          </div>
        )}
      </div>

      {/* ── Details ─────────────────────────────────────────────────────── */}
      <div className="flex-1 min-w-0 flex flex-col gap-1.5">
        {/* Name + remove button row */}
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-medium leading-snug line-clamp-2 flex-1">
            {product.name}
          </p>
          <button
            onClick={() => onRemove(product.id)}
            aria-label={`Remove ${product.name} from cart`}
            className="shrink-0 p-1 -mt-0.5 -mr-1 rounded text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors opacity-60 group-hover:opacity-100"
          >
            <Trash2 size={13} />
          </button>
        </div>

        {/* Weight / size */}
        {product.weight && product.unit && (
          <p className="text-xs text-muted-foreground leading-none">
            {product.weight}
            {product.unit}
          </p>
        )}

        {/* Quantity stepper + line total */}
        <div className="flex items-center justify-between gap-2 mt-0.5">
          {/* Stepper — minimum 1; use remove button to delete */}
          <div className="flex items-center border border-border rounded-lg overflow-hidden h-7 w-fit">
            <button
              onClick={() => onQuantityChange(product.id, quantity - 1)}
              disabled={quantity <= 1}
              aria-label="Decrease quantity"
              className="w-7 h-full flex items-center justify-center transition-colors text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <Minus size={11} />
            </button>

            <span
              className="w-8 text-center text-sm font-semibold select-none"
              aria-live="polite"
              aria-label={`Quantity: ${quantity}`}
            >
              {quantity}
            </span>

            <button
              onClick={() => onQuantityChange(product.id, quantity + 1)}
              aria-label="Increase quantity"
              className="w-7 h-full flex items-center justify-center transition-colors text-muted-foreground hover:text-foreground hover:bg-muted"
            >
              <Plus size={11} />
            </button>
          </div>

          {/* Line total */}
          <p className="font-bold text-sm text-brand-600 tabular-nums">
            {formatPrice(lineTotal)}
          </p>
        </div>
      </div>
    </div>
  );
}
