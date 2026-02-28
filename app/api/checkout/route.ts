// POST /api/checkout
// Creates a Stripe PaymentIntent and returns the client secret.
// Called by the checkout page Step 2 when the user clicks "Place Order".

import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";

// ─── Request body shape (sent from the client) ────────────────────────────────

interface CartItemPayload {
  productId: string;
  name:      string;
  price:     number;   // GBP as decimal e.g. 3.99
  quantity:  number;
}

interface CheckoutPayload {
  items:          CartItemPayload[];
  deliveryMethod: "standard" | "express";
  deliveryCost:   number;  // GBP decimal e.g. 4.99
  promoCode:      string | null;
  discount:       number;  // absolute GBP discount e.g. 5.00
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as CheckoutPayload;
    const { items, deliveryCost, discount = 0, promoCode, deliveryMethod } = body;

    // ── Validate ────────────────────────────────────────────────────────────
    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: "Cart is empty" },
        { status: 400 }
      );
    }

    // ── Calculate total in pence ─────────────────────────────────────────────
    const subtotalPounds     = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const discountedSubtotal = Math.max(0, subtotalPounds - discount);
    const totalPounds        = discountedSubtotal + deliveryCost;
    const totalPence         = Math.round(totalPounds * 100);

    // Stripe minimum charge is 30p
    if (totalPence < 30) {
      return NextResponse.json(
        { error: "Order total is below the minimum charge amount" },
        { status: 400 }
      );
    }

    // ── Create PaymentIntent ─────────────────────────────────────────────────
    const paymentIntent = await getStripe().paymentIntents.create({
      amount:               totalPence,
      currency:             "gbp",
      payment_method_types: ["card"],
      metadata: {
        delivery_method: deliveryMethod,
        delivery_cost:   String(deliveryCost),
        promo_code:      promoCode ?? "",
        discount:        String(discount),
        item_count:      String(items.reduce((sum, i) => sum + i.quantity, 0)),
        // Compact item summary for webhook processing
        items_summary:   JSON.stringify(
          items.map((i) => ({ id: i.productId, qty: i.quantity }))
        ),
      },
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.error("[/api/checkout] Error:", err);
    return NextResponse.json(
      { error: "Payment service error. Please try again." },
      { status: 500 }
    );
  }
}
