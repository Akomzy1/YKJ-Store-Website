// POST /api/webhook
// Handles Stripe webhook events.
//
// Required env vars:
//   STRIPE_WEBHOOK_SECRET    — from `stripe listen` CLI or Stripe Dashboard
//   NEXT_PUBLIC_SUPABASE_URL — Supabase project URL
//   SUPABASE_SERVICE_ROLE_KEY — Service role key (bypasses RLS)
//
// Events handled:
//   payment_intent.succeeded        → create order row + order_items in Supabase
//   payment_intent.payment_failed   → log failure (order row optional)

import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { createClient } from "@supabase/supabase-js";

// Supabase admin client — uses service role key to bypass Row Level Security
function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.warn("[webhook] Supabase env vars not configured — skipping DB write");
    return null;
  }
  return createClient(url, key);
}

export async function POST(request: NextRequest) {
  const body      = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 });
  }

  // ── Verify webhook signature ────────────────────────────────────────────────
  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("[webhook] Signature verification failed:", err);
    return NextResponse.json({ error: "Invalid webhook signature" }, { status: 400 });
  }

  // ── Handle events ───────────────────────────────────────────────────────────
  switch (event.type) {

    case "payment_intent.succeeded": {
      const pi = event.data.object as Stripe.PaymentIntent;
      console.log("[webhook] payment_intent.succeeded:", pi.id);
      await handlePaymentSucceeded(pi);
      break;
    }

    case "payment_intent.payment_failed": {
      const pi = event.data.object as Stripe.PaymentIntent;
      console.log("[webhook] payment_intent.payment_failed:", pi.id, pi.last_payment_error?.message);
      // TODO: Update order status to "failed" if order was pre-created
      break;
    }

    default:
      // Ignore unhandled event types
      break;
  }

  return NextResponse.json({ received: true });
}

// ─── Handle successful payment ────────────────────────────────────────────────

async function handlePaymentSucceeded(pi: Stripe.PaymentIntent) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return;

  const metadata = pi.metadata ?? {};

  // Parse items from metadata
  let parsedItems: { id: string; qty: number }[] = [];
  try {
    parsedItems = JSON.parse(metadata.items_summary ?? "[]");
  } catch {
    console.error("[webhook] Could not parse items_summary from metadata");
  }

  const totalPounds    = pi.amount / 100;
  const deliveryCost   = parseFloat(metadata.delivery_cost ?? "0");
  const discount       = parseFloat(metadata.discount ?? "0");
  const subtotalPounds = Math.max(0, totalPounds - deliveryCost + discount);

  try {
    // 1 — Insert order row
    const { data: order, error: orderErr } = await supabase
      .from("orders")
      .insert({
        status:           "pending",
        delivery_method:  metadata.delivery_method ?? "standard",
        subtotal:         subtotalPounds,
        delivery_cost:    deliveryCost,
        discount,
        total:            totalPounds,
        payment_intent_id: pi.id,
        promo_code:       metadata.promo_code || null,
        // delivery_address and user_id are set separately (not in metadata for security)
      })
      .select("id")
      .single();

    if (orderErr) {
      console.error("[webhook] Failed to insert order:", orderErr);
      return;
    }

    console.log("[webhook] Order created:", order.id);

    // 2 — Insert order_items (product details must be re-fetched from DB for accuracy)
    if (parsedItems.length > 0 && order?.id) {
      const productIds = parsedItems.map((i) => i.id);

      const { data: products } = await supabase
        .from("products")
        .select("id, name, images, price, sale_price")
        .in("id", productIds);

      if (products && products.length > 0) {
        const orderItems = parsedItems.map((item) => {
          const product  = products.find((p) => p.id === item.id);
          const unitPrice = product
            ? (product.sale_price ?? product.price)
            : 0;

          return {
            order_id:      order.id,
            product_id:    item.id,
            product_name:  product?.name ?? "Unknown product",
            product_image: product?.images?.[0] ?? "",
            quantity:      item.qty,
            unit_price:    unitPrice,
            subtotal:      unitPrice * item.qty,
          };
        });

        const { error: itemsErr } = await supabase
          .from("order_items")
          .insert(orderItems);

        if (itemsErr) {
          console.error("[webhook] Failed to insert order_items:", itemsErr);
        }
      }
    }

    // 3 — TODO: Send confirmation email via Resend
    // await sendOrderConfirmationEmail({ orderId: order.id, paymentIntent: pi });

  } catch (err) {
    console.error("[webhook] Unexpected error in handlePaymentSucceeded:", err);
  }
}
