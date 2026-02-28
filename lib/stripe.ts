// Stripe server-side client
// Uses STRIPE_SECRET_KEY from env (never expose to browser)

import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-02-25.clover",
  typescript: true,
});

// Free delivery threshold in pence (£60.00)
export const FREE_DELIVERY_THRESHOLD_PENCE = 6000;
export const STANDARD_DELIVERY_PENCE = 499; // £4.99
export const EXPRESS_DELIVERY_PENCE = 799;  // £7.99
