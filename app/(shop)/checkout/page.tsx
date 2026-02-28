"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import {
  CheckCircle2,
  ChevronRight,
  Loader2,
  MapPin,
  Truck,
  CreditCard,
  Package,
  ShoppingBag,
} from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import {
  formatPrice,
  getEffectivePrice,
  FREE_DELIVERY_THRESHOLD,
  STANDARD_DELIVERY_COST,
  EXPRESS_DELIVERY_COST,
} from "@/lib/utils";

// ─── Stripe promise — created once outside component ──────────────────────────

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? ""
);

// ─── Types ────────────────────────────────────────────────────────────────────

interface FormData {
  fullName:       string;
  email:          string;
  phone:          string;
  line1:          string;
  line2:          string;
  city:           string;
  county:         string;
  postcode:       string;
  country:        string;
  deliveryMethod: "standard" | "express";
  notes:          string;
}

type FormErrors = Partial<Record<keyof FormData, string>>;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getDeliveryCost(
  deliveryMethod: "standard" | "express",
  effectiveSubtotal: number
): number {
  if (deliveryMethod === "express") return EXPRESS_DELIVERY_COST;
  return effectiveSubtotal >= FREE_DELIVERY_THRESHOLD ? 0 : STANDARD_DELIVERY_COST;
}

function getEstimatedDelivery(method: "standard" | "express"): string {
  const addWorkingDays = (date: Date, days: number): Date => {
    const result = new Date(date);
    let added = 0;
    while (added < days) {
      result.setDate(result.getDate() + 1);
      if (result.getDay() !== 0 && result.getDay() !== 6) added++;
    }
    return result;
  };

  const now = new Date();

  if (method === "express") {
    const cutoffPassed = now.getHours() >= 14;
    const delivery     = addWorkingDays(now, cutoffPassed ? 2 : 1);
    return delivery.toLocaleDateString("en-GB", {
      weekday: "long",
      day:     "numeric",
      month:   "long",
    });
  }

  const from = addWorkingDays(now, 2);
  const to   = addWorkingDays(now, 4);
  return `${from.toLocaleDateString("en-GB", {
    day: "numeric", month: "short",
  })} – ${to.toLocaleDateString("en-GB", {
    day: "numeric", month: "short", year: "numeric",
  })}`;
}

function generateOrderNumber(): string {
  const ts   = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `YKJ-${ts}-${rand}`;
}

// ─── Step indicator ───────────────────────────────────────────────────────────

const STEPS = [
  { id: 1, label: "Delivery",     icon: Truck       },
  { id: 2, label: "Payment",      icon: CreditCard  },
  { id: 3, label: "Confirmation", icon: CheckCircle2},
];

function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center justify-center mb-8">
      {STEPS.map((step, idx) => {
        const Icon     = step.icon;
        const isActive = step.id === current;
        const isDone   = step.id < current;

        return (
          <div key={step.id} className="flex items-center">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-colors ${
                  isDone    ? "bg-green-500 border-green-500 text-white" :
                  isActive  ? "bg-brand-500 border-brand-500 text-white" :
                              "bg-white border-border text-muted-foreground"
                }`}
              >
                {isDone ? <CheckCircle2 size={16} /> : <Icon size={15} />}
              </div>
              <span
                className={`text-[11px] font-medium ${
                  isActive ? "text-brand-600" :
                  isDone   ? "text-green-600" :
                             "text-muted-foreground"
                }`}
              >
                {step.label}
              </span>
            </div>
            {idx < STEPS.length - 1 && (
              <div
                className={`w-14 sm:w-20 h-0.5 mx-1 mb-5 rounded-full transition-colors ${
                  step.id < current ? "bg-green-400" : "bg-border"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Step 1 — Delivery details ────────────────────────────────────────────────

interface DeliveryStepProps {
  formData:          FormData;
  onChange:          (updates: Partial<FormData>) => void;
  onNext:            () => void;
  effectiveSubtotal: number;
}

function DeliveryStep({
  formData,
  onChange,
  onNext,
  effectiveSubtotal,
}: DeliveryStepProps) {
  const [errors, setErrors]               = useState<FormErrors>({});
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupError, setLookupError]     = useState("");

  const standardCost = getDeliveryCost("standard", effectiveSubtotal);

  async function handlePostcodeLookup() {
    const pc = formData.postcode.trim().replace(/\s+/g, "");
    if (!pc) { setLookupError("Please enter a postcode first."); return; }
    setLookupLoading(true);
    setLookupError("");
    try {
      const res  = await fetch(
        `https://api.postcodes.io/postcodes/${encodeURIComponent(pc)}`
      );
      const data = await res.json();
      if (data.status === 200 && data.result) {
        const r = data.result;
        onChange({
          city:   r.admin_district ?? r.region ?? "",
          county: r.admin_county   ?? r.region ?? "",
        });
      } else {
        setLookupError("Postcode not found. Please enter your address manually.");
      }
    } catch {
      setLookupError("Lookup failed. Please enter your address manually.");
    } finally {
      setLookupLoading(false);
    }
  }

  function validate(): boolean {
    const errs: FormErrors = {};
    if (!formData.fullName.trim()) errs.fullName = "Full name is required";
    if (!formData.email.trim())    errs.email    = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
                                   errs.email    = "Enter a valid email address";
    if (!formData.line1.trim())    errs.line1    = "Street address is required";
    if (!formData.city.trim())     errs.city     = "City / town is required";
    if (!formData.postcode.trim()) errs.postcode = "Postcode is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  const inputCls = (field: keyof FormData) =>
    `w-full px-3 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-400 focus:border-brand-400 bg-white transition-shadow ${
      errors[field] ? "border-red-400 bg-red-50" : "border-border"
    }`;

  return (
    <div>
      <h2 className="font-heading font-bold text-xl mb-6">Delivery Details</h2>

      <div className="space-y-4">
        {/* Contact info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => onChange({ fullName: e.target.value })}
              placeholder="e.g. Adaeze Okafor"
              className={inputCls("fullName")}
              autoComplete="name"
            />
            {errors.fullName && (
              <p className="text-xs text-red-600 mt-1">{errors.fullName}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => onChange({ email: e.target.value })}
              placeholder="you@example.com"
              className={inputCls("email")}
              autoComplete="email"
            />
            {errors.email && (
              <p className="text-xs text-red-600 mt-1">{errors.email}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">
            Phone Number{" "}
            <span className="text-muted-foreground font-normal">(optional)</span>
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => onChange({ phone: e.target.value })}
            placeholder="+44 7700 000000"
            className={inputCls("phone")}
            autoComplete="tel"
          />
        </div>

        {/* Address */}
        <div className="pt-1">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
            Delivery Address
          </p>

          {/* Postcode lookup */}
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1.5">
              Postcode <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={formData.postcode}
                onChange={(e) =>
                  onChange({ postcode: e.target.value.toUpperCase() })
                }
                placeholder="e.g. SW1A 1AA"
                className={`flex-1 px-3 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-400 focus:border-brand-400 bg-white transition-shadow uppercase tracking-wider ${
                  errors.postcode ? "border-red-400 bg-red-50" : "border-border"
                }`}
                autoComplete="postal-code"
              />
              <button
                type="button"
                onClick={handlePostcodeLookup}
                disabled={lookupLoading || !formData.postcode.trim()}
                className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border border-border rounded-lg bg-white hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {lookupLoading ? (
                  <Loader2 size={13} className="animate-spin" />
                ) : (
                  <MapPin size={13} className="text-brand-500" />
                )}
                Lookup
              </button>
            </div>
            {errors.postcode && (
              <p className="text-xs text-red-600 mt-1">{errors.postcode}</p>
            )}
            {lookupError && (
              <p className="text-xs text-amber-700 mt-1">{lookupError}</p>
            )}
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1.5">
                Address Line 1 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.line1}
                onChange={(e) => onChange({ line1: e.target.value })}
                placeholder="House number and street name"
                className={inputCls("line1")}
                autoComplete="address-line1"
              />
              {errors.line1 && (
                <p className="text-xs text-red-600 mt-1">{errors.line1}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">
                Address Line 2{" "}
                <span className="text-muted-foreground font-normal">
                  (optional)
                </span>
              </label>
              <input
                type="text"
                value={formData.line2}
                onChange={(e) => onChange({ line2: e.target.value })}
                placeholder="Flat, apartment, floor"
                className={inputCls("line2")}
                autoComplete="address-line2"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1.5">
                  City / Town <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => onChange({ city: e.target.value })}
                  placeholder="London"
                  className={inputCls("city")}
                  autoComplete="address-level2"
                />
                {errors.city && (
                  <p className="text-xs text-red-600 mt-1">{errors.city}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">
                  County{" "}
                  <span className="text-muted-foreground font-normal">
                    (optional)
                  </span>
                </label>
                <input
                  type="text"
                  value={formData.county}
                  onChange={(e) => onChange({ county: e.target.value })}
                  placeholder="Greater London"
                  className="w-full px-3 py-2.5 text-sm border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-400 bg-white transition-shadow"
                  autoComplete="address-level1"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">
                Country
              </label>
              <input
                type="text"
                value={formData.country}
                readOnly
                className="w-full px-3 py-2.5 text-sm border border-border rounded-lg bg-muted/40 text-muted-foreground cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* Delivery method */}
        <div className="pt-1">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
            Delivery Method
          </p>
          <div className="space-y-2.5">
            <label
              className={`flex items-start gap-4 p-4 border-2 rounded-xl cursor-pointer transition-colors ${
                formData.deliveryMethod === "standard"
                  ? "border-brand-500 bg-brand-50"
                  : "border-border bg-white hover:border-brand-200"
              }`}
            >
              <input
                type="radio"
                name="deliveryMethod"
                value="standard"
                checked={formData.deliveryMethod === "standard"}
                onChange={() => onChange({ deliveryMethod: "standard" })}
                className="mt-0.5 accent-brand-500"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm">
                    Standard Delivery
                  </span>
                  <span className="font-bold text-sm">
                    {standardCost === 0 ? (
                      <span className="text-green-600">FREE</span>
                    ) : (
                      <span className="text-brand-600">
                        {formatPrice(standardCost)}
                      </span>
                    )}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  2–4 working days
                  {standardCost > 0 && (
                    <span className="ml-1 text-brand-500">
                      — free over {formatPrice(FREE_DELIVERY_THRESHOLD)}
                    </span>
                  )}
                </p>
              </div>
            </label>

            <label
              className={`flex items-start gap-4 p-4 border-2 rounded-xl cursor-pointer transition-colors ${
                formData.deliveryMethod === "express"
                  ? "border-brand-500 bg-brand-50"
                  : "border-border bg-white hover:border-brand-200"
              }`}
            >
              <input
                type="radio"
                name="deliveryMethod"
                value="express"
                checked={formData.deliveryMethod === "express"}
                onChange={() => onChange({ deliveryMethod: "express" })}
                className="mt-0.5 accent-brand-500"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm">
                    Express Delivery ⚡
                  </span>
                  <span className="font-bold text-sm text-brand-600">
                    {formatPrice(EXPRESS_DELIVERY_COST)}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Next working day — order before 2PM
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* Delivery notes */}
        <div>
          <label className="block text-sm font-medium mb-1.5">
            Delivery Notes{" "}
            <span className="text-muted-foreground font-normal">(optional)</span>
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => onChange({ notes: e.target.value })}
            placeholder="Special instructions for your delivery driver (e.g. leave at door, ring bell twice)"
            rows={3}
            className="w-full px-3 py-2.5 text-sm border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-400 focus:border-brand-400 bg-white transition-shadow resize-none"
          />
        </div>
      </div>

      <button
        onClick={() => { if (validate()) onNext(); }}
        className="mt-6 w-full flex items-center justify-center gap-2 py-3.5 bg-brand-500 hover:bg-brand-600 text-white font-bold rounded-lg transition-colors"
      >
        Continue to Payment
        <ChevronRight size={16} />
      </button>
    </div>
  );
}

// ─── Step 2 — Payment ─────────────────────────────────────────────────────────

interface PaymentStepProps {
  formData:  FormData;
  onSuccess: () => void;
  onBack:    () => void;
}

function PaymentStep({ formData, onSuccess, onBack }: PaymentStepProps) {
  const stripe   = useStripe();
  const elements = useElements();

  const { items, promoCode, discount } = useCartStore();
  const [isLoading, setIsLoading]      = useState(false);
  const [error, setError]              = useState("");

  const subtotal          = items.reduce(
    (sum, { product, quantity }) => sum + getEffectivePrice(product) * quantity,
    0
  );
  const effectiveSubtotal = Math.max(0, subtotal - discount);
  const deliveryCost      = getDeliveryCost(formData.deliveryMethod, effectiveSubtotal);
  const total             = effectiveSubtotal + deliveryCost;

  async function handlePlaceOrder() {
    if (!stripe || !elements) return;
    setIsLoading(true);
    setError("");

    // 1 — Create PaymentIntent
    let clientSecret: string;
    try {
      const res  = await fetch("/api/checkout", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({
          items: items.map((i) => ({
            productId: i.product.id,
            name:      i.product.name,
            price:     getEffectivePrice(i.product),
            quantity:  i.quantity,
          })),
          deliveryMethod: formData.deliveryMethod,
          deliveryCost,
          promoCode:  promoCode ?? null,
          discount,
        }),
      });
      if (!res.ok) throw new Error("API error");
      const json = await res.json();
      if (json.error || !json.clientSecret) {
        setError(json.error ?? "Payment setup failed. Please try again.");
        setIsLoading(false);
        return;
      }
      clientSecret = json.clientSecret;
    } catch {
      setError("Could not connect to payment service. Please try again.");
      setIsLoading(false);
      return;
    }

    // 2 — Confirm card payment with Stripe
    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setError("Card details not loaded. Please refresh and try again.");
      setIsLoading(false);
      return;
    }

    const { error: stripeError, paymentIntent } =
      await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name:  formData.fullName,
            email: formData.email,
            phone: formData.phone || undefined,
            address: {
              line1:       formData.line1,
              line2:       formData.line2 || undefined,
              city:        formData.city,
              postal_code: formData.postcode,
              country:     "GB",
            },
          },
        },
      });

    if (stripeError) {
      setError(
        stripeError.message ??
          "Payment failed. Please check your card details and try again."
      );
      setIsLoading(false);
    } else if (paymentIntent?.status === "succeeded") {
      onSuccess();
    }
  }

  return (
    <div>
      <h2 className="font-heading font-bold text-xl mb-6">Payment</h2>

      {/* Condensed order summary */}
      <div className="bg-brand-50 border border-brand-100 rounded-xl p-4 mb-6">
        <p className="text-xs font-semibold text-brand-700 uppercase tracking-wide mb-3">
          Order Summary
        </p>
        <div className="space-y-1.5 text-sm">
          {items.slice(0, 3).map(({ product, quantity }) => (
            <div
              key={product.id}
              className="flex justify-between text-muted-foreground"
            >
              <span className="truncate flex-1 mr-2">
                {product.name} × {quantity}
              </span>
              <span className="tabular-nums shrink-0">
                {formatPrice(getEffectivePrice(product) * quantity)}
              </span>
            </div>
          ))}
          {items.length > 3 && (
            <p className="text-xs text-muted-foreground">
              +{items.length - 3} more item{items.length - 3 > 1 ? "s" : ""}
            </p>
          )}

          <div className="border-t border-brand-200 pt-2 mt-2 space-y-1.5">
            {discount > 0 && (
              <div className="flex justify-between text-xs text-green-600">
                <span>Discount ({promoCode})</span>
                <span className="tabular-nums">−{formatPrice(discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>
                Delivery (
                {formData.deliveryMethod === "express" ? "Express" : "Standard"})
              </span>
              <span className="tabular-nums">
                {deliveryCost === 0 ? (
                  <span className="text-green-600 font-semibold">FREE</span>
                ) : (
                  formatPrice(deliveryCost)
                )}
              </span>
            </div>
            <div className="flex justify-between font-bold text-[15px] pt-1">
              <span>Total</span>
              <span className="text-brand-600 tabular-nums">
                {formatPrice(total)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stripe CardElement */}
      <div className="mb-5">
        <label className="block text-sm font-medium mb-2">
          Card Details <span className="text-red-500">*</span>
        </label>
        <div className="border border-border rounded-lg px-4 py-3.5 bg-white focus-within:ring-1 focus-within:ring-brand-400 focus-within:border-brand-400 transition-shadow">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize:    "15px",
                  color:       "#1C1C1C",
                  fontFamily:  "Inter, system-ui, sans-serif",
                  "::placeholder": { color: "#9CA3AF" },
                },
                invalid: { color: "#DC2626" },
              },
            }}
          />
        </div>
        <p className="text-xs text-muted-foreground mt-1.5 flex items-center gap-1">
          🔒 Secured by Stripe. We never store your card details.
        </p>
      </div>

      {/* Delivering to recap */}
      <div className="bg-muted/40 rounded-xl border border-border p-4 mb-6 text-sm">
        <p className="font-semibold mb-1 flex items-center gap-1.5">
          <MapPin size={13} className="text-brand-500" />
          Delivering to
        </p>
        <p className="text-muted-foreground leading-relaxed">
          {formData.fullName} · {formData.line1}
          {formData.line2 ? `, ${formData.line2}` : ""}, {formData.city},{" "}
          {formData.postcode}
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-700 mb-4">
          {error}
        </div>
      )}

      <div className="flex gap-3">
        <button
          onClick={onBack}
          disabled={isLoading}
          className="px-5 py-3 border border-border rounded-lg text-sm font-medium hover:bg-muted disabled:opacity-50 transition-colors"
        >
          ← Back
        </button>
        <button
          onClick={handlePlaceOrder}
          disabled={isLoading || !stripe}
          className="flex-1 flex items-center justify-center gap-2 py-3 bg-brand-500 hover:bg-brand-600 text-white font-bold rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <Loader2 size={15} className="animate-spin" />
              Processing…
            </>
          ) : (
            `Place Order — ${formatPrice(total)}`
          )}
        </button>
      </div>
    </div>
  );
}

// ─── Step 3 — Confirmation ────────────────────────────────────────────────────

interface ConfirmationStepProps {
  formData:        FormData;
  orderNumber:     string;
  confirmedItems:  { name: string; quantity: number; lineTotal: number }[];
  subtotal:        number;
  discount:        number;
  promoCode:       string | null;
  deliveryCost:    number;
  total:           number;
}

function ConfirmationStep({
  formData,
  orderNumber,
  confirmedItems,
  subtotal,
  discount,
  promoCode,
  deliveryCost,
  total,
}: ConfirmationStepProps) {
  const estimatedDelivery = getEstimatedDelivery(formData.deliveryMethod);
  const firstName         = formData.fullName.split(" ")[0];

  return (
    <div className="text-center">
      {/* Success icon */}
      <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-5">
        <CheckCircle2 size={40} className="text-green-600" />
      </div>

      <h2 className="font-heading font-bold text-2xl md:text-3xl mb-2">
        Thank you, {firstName}! 🎉
      </h2>
      <p className="text-muted-foreground text-sm mb-2 max-w-sm mx-auto">
        Your order has been placed and confirmed.
      </p>
      <p className="text-muted-foreground text-sm mb-6 max-w-sm mx-auto">
        A confirmation will be sent to{" "}
        <span className="font-medium text-foreground">{formData.email}</span>.
      </p>

      {/* Order number */}
      <div className="inline-flex items-center gap-3 bg-brand-50 border border-brand-100 rounded-xl px-6 py-3 mb-6">
        <Package size={18} className="text-brand-500 shrink-0" />
        <div className="text-left">
          <p className="text-[10px] text-brand-600 font-semibold uppercase tracking-wide">
            Order Number
          </p>
          <p className="font-heading font-bold text-lg text-brand-700">
            {orderNumber}
          </p>
        </div>
      </div>

      {/* Estimated delivery */}
      <div className="bg-white border border-border rounded-xl p-4 mb-5 text-left max-w-md mx-auto">
        <div className="flex items-center gap-2 mb-2">
          <Truck size={15} className="text-brand-500 shrink-0" />
          <p className="font-semibold text-sm">Estimated Delivery</p>
        </div>
        <p className="text-sm text-muted-foreground mb-1">
          <span className="font-medium text-foreground">
            {formData.deliveryMethod === "express" ? "Express" : "Standard"}{" "}
            Delivery
          </span>{" "}
          to {formData.city}, {formData.postcode}
        </p>
        <p className="text-sm font-bold text-brand-600">{estimatedDelivery}</p>
      </div>

      {/* Order recap */}
      <div className="bg-white border border-border rounded-xl p-4 mb-6 text-left max-w-md mx-auto">
        <p className="font-semibold text-sm mb-3">Order Recap</p>
        <div className="space-y-1.5 text-sm">
          {confirmedItems.map((item, i) => (
            <div key={i} className="flex justify-between text-muted-foreground">
              <span className="flex-1 mr-2 truncate">
                {item.name} × {item.quantity}
              </span>
              <span className="tabular-nums shrink-0">
                {formatPrice(item.lineTotal)}
              </span>
            </div>
          ))}
          <div className="border-t border-border pt-2 mt-2 space-y-1.5">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Subtotal</span>
              <span className="tabular-nums">{formatPrice(subtotal)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-xs text-green-600">
                <span>Discount ({promoCode})</span>
                <span className="tabular-nums">−{formatPrice(discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Delivery</span>
              <span className="tabular-nums">
                {deliveryCost === 0 ? "FREE" : formatPrice(deliveryCost)}
              </span>
            </div>
            <div className="flex justify-between font-bold pt-1">
              <span>Total Paid</span>
              <span className="text-brand-600 tabular-nums">
                {formatPrice(total)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
        <Link
          href="/shop"
          className="flex-1 flex items-center justify-center gap-2 py-3 bg-brand-500 hover:bg-brand-600 text-white font-semibold rounded-lg transition-colors text-sm"
        >
          <ShoppingBag size={15} />
          Continue Shopping
        </Link>
        <Link
          href="/account/orders"
          className="flex-1 flex items-center justify-center py-3 border border-border rounded-lg hover:bg-muted text-sm font-medium transition-colors"
        >
          View My Orders
        </Link>
      </div>
    </div>
  );
}

// ─── Checkout flow wrapper (inside <Elements>) ────────────────────────────────

function CheckoutFlow() {
  const [mounted, setMounted] = useState(false);
  const [step, setStep]       = useState<1 | 2 | 3>(1);
  const [orderNumber] = useState(generateOrderNumber);

  const [formData, setFormData] = useState<FormData>({
    fullName:       "",
    email:          "",
    phone:          "",
    line1:          "",
    line2:          "",
    city:           "",
    county:         "",
    postcode:       "",
    country:        "United Kingdom",
    deliveryMethod: "standard",
    notes:          "",
  });

  type Snapshot = {
    confirmedItems: { name: string; quantity: number; lineTotal: number }[];
    subtotal:       number;
    discount:       number;
    promoCode:      string | null;
    deliveryCost:   number;
    total:          number;
  };
  const [snapshot, setSnapshot] = useState<Snapshot | null>(null);

  const { items, promoCode, discount, clearCart, getSubtotal } = useCartStore();

  useEffect(() => setMounted(true), []);

  const subtotal          = getSubtotal();
  const effectiveSubtotal = Math.max(0, subtotal - discount);
  const deliveryCost      = getDeliveryCost(formData.deliveryMethod, effectiveSubtotal);
  const total             = effectiveSubtotal + deliveryCost;

  const handleFormChange = useCallback((updates: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  }, []);

  function handlePaymentSuccess() {
    setSnapshot({
      confirmedItems: items.map((i) => ({
        name:      i.product.name,
        quantity:  i.quantity,
        lineTotal: getEffectivePrice(i.product) * i.quantity,
      })),
      subtotal,
      discount,
      promoCode,
      deliveryCost,
      total,
    });
    clearCart();
    setStep(3);
  }

  if (!mounted) return null;

  if (items.length === 0 && step < 3) {
    return (
      <div className="text-center py-16">
        <ShoppingBag size={40} className="text-brand-200 mx-auto mb-4" />
        <p className="font-heading font-bold text-xl mb-3">
          Your cart is empty
        </p>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-brand-500 hover:bg-brand-600 text-white font-semibold rounded-lg transition-colors text-sm"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div>
      <StepIndicator current={step} />

      {step === 1 && (
        <DeliveryStep
          formData={formData}
          onChange={handleFormChange}
          onNext={() => setStep(2)}
          effectiveSubtotal={effectiveSubtotal}
        />
      )}

      {step === 2 && (
        <PaymentStep
          formData={formData}
          onSuccess={handlePaymentSuccess}
          onBack={() => setStep(1)}
        />
      )}

      {step === 3 && snapshot && (
        <ConfirmationStep
          formData={formData}
          orderNumber={orderNumber}
          confirmedItems={snapshot.confirmedItems}
          subtotal={snapshot.subtotal}
          discount={snapshot.discount}
          promoCode={snapshot.promoCode}
          deliveryCost={snapshot.deliveryCost}
          total={snapshot.total}
        />
      )}
    </div>
  );
}

// ─── Page export ──────────────────────────────────────────────────────────────

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      {/* Page header */}
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
              <li>
                <Link
                  href="/cart"
                  className="hover:text-brand-500 transition-colors"
                >
                  Cart
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li
                className="text-foreground font-medium"
                aria-current="page"
              >
                Checkout
              </li>
            </ol>
          </nav>
          <h1 className="font-heading font-bold text-2xl md:text-3xl">
            Checkout
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl border border-border p-6 md:p-8 shadow-sm">
            <Elements stripe={stripePromise}>
              <CheckoutFlow />
            </Elements>
          </div>
        </div>
      </div>
    </div>
  );
}
