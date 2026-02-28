// ─── Delivery Info Page — /delivery-info ─────────────────────────────────────
// Server Component — static informational content.

import type { Metadata } from "next";
import Link from "next/link";
import {
  Truck,
  Zap,
  Gift,
  MapPin,
  Clock,
  RotateCcw,
  AlertCircle,
  CheckCircle2,
  Package,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Delivery Information | YKJ African & Caribbean Food Store",
  description:
    "UK delivery options, costs, timescales, free delivery threshold, and returns policy for YKJ African and Caribbean Food Store.",
};

// ─── Data ─────────────────────────────────────────────────────────────────────

const DELIVERY_OPTIONS = [
  {
    icon:        Truck,
    name:        "Standard Delivery",
    time:        "2–4 Working Days",
    cost:        "£4.99",
    free:        "Free on orders over £60",
    iconBg:      "bg-blue-50",
    iconColour:  "text-blue-600",
    badge:       null,
  },
  {
    icon:        Zap,
    name:        "Express Delivery",
    time:        "Next Working Day",
    cost:        "£7.99",
    free:        "Order before 2PM Mon–Fri",
    iconBg:      "bg-[#A0522D]/10",
    iconColour:  "text-[#A0522D]",
    badge:       "Popular",
  },
];

const ZONES = [
  { region: "England & Wales",                    standard: "2–3 days", express: "Next day" },
  { region: "Scotland (Central Belt)",             standard: "2–3 days", express: "Next day" },
  { region: "Scottish Highlands & Islands",        standard: "3–5 days", express: "2 days"   },
  { region: "Northern Ireland",                    standard: "3–5 days", express: "2 days"   },
  { region: "Channel Islands & Isle of Man",       standard: "4–6 days", express: "Not available" },
];

const TIPS = [
  "Order before 2PM Monday–Friday for express next-day delivery.",
  "Orders placed on Saturday or Sunday are dispatched on Monday.",
  "Bank holidays may affect dispatch — add an extra working day.",
  "Spend over £60 to unlock free standard delivery.",
  "You'll receive a dispatch confirmation email with a tracking link.",
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DeliveryInfoPage() {
  return (
    <main className="bg-[#FAFAF8]">

      {/* ── Header ── */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h1 className="font-heading text-4xl font-bold text-gray-900 mb-2">
            Delivery Information
          </h1>
          <p className="text-gray-500 max-w-xl mx-auto">
            We deliver across the whole of the UK. Here&apos;s everything you need to
            know about our delivery options, timescales, and returns policy.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">

        {/* ── Free delivery banner ── */}
        <div className="bg-gradient-to-r from-[#A0522D] to-[#7B3F1A] rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-4 text-white">
          <div className="h-14 w-14 shrink-0 rounded-2xl bg-white/20 flex items-center justify-center">
            <Gift className="h-7 w-7" />
          </div>
          <div>
            <p className="font-heading text-xl font-bold">
              Free Standard Delivery on Orders Over £60
            </p>
            <p className="text-white/80 text-sm mt-0.5">
              No code needed — free delivery is applied automatically at checkout
              when your basket reaches £60.
            </p>
          </div>
          <Link
            href="/shop"
            className="shrink-0 bg-white text-[#A0522D] font-bold text-sm px-5 py-2.5 rounded-xl hover:bg-[#FAFAF8] transition-colors"
          >
            Shop now
          </Link>
        </div>

        {/* ── Delivery options ── */}
        <section>
          <h2 className="font-heading text-2xl font-bold text-gray-900 mb-5">
            Delivery Options
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {DELIVERY_OPTIONS.map(
              ({ icon: Icon, name, time, cost, free, iconBg, iconColour, badge }) => (
                <div
                  key={name}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 relative"
                >
                  {badge && (
                    <span className="absolute top-4 right-4 bg-[#F59E0B] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wide">
                      {badge}
                    </span>
                  )}
                  <div
                    className={`h-12 w-12 rounded-xl ${iconBg} flex items-center justify-center mb-4`}
                  >
                    <Icon className={`h-6 w-6 ${iconColour}`} />
                  </div>
                  <h3 className="font-heading text-lg font-bold text-gray-900 mb-1">
                    {name}
                  </h3>
                  <p className="text-2xl font-bold text-[#A0522D] mb-1">{cost}</p>
                  <div className="flex items-center gap-1.5 text-sm text-gray-600 mb-2">
                    <Clock className="h-4 w-4 text-gray-400" />
                    {time}
                  </div>
                  <p className="text-xs text-green-600 font-medium">{free}</p>
                </div>
              )
            )}
          </div>
        </section>

        {/* ── Delivery zones table ── */}
        <section>
          <h2 className="font-heading text-2xl font-bold text-gray-900 mb-5">
            Estimated Delivery Times by Region
          </h2>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="text-left px-6 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">
                      Region
                    </th>
                    <th className="text-left px-6 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">
                      Standard (£4.99)
                    </th>
                    <th className="text-left px-6 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">
                      Express (£7.99)
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {ZONES.map((zone) => (
                    <tr key={zone.region} className="hover:bg-gray-50/50">
                      <td className="px-6 py-4 font-medium text-gray-900">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-gray-400 shrink-0" />
                          {zone.region}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{zone.standard}</td>
                      <td className="px-6 py-4">
                        {zone.express === "Not available" ? (
                          <span className="text-gray-400 text-xs italic">
                            Not available
                          </span>
                        ) : (
                          <span className="text-gray-600">{zone.express}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="px-6 py-3 text-xs text-gray-400 border-t border-gray-100">
              * Times are estimates from the date of dispatch and exclude weekends and bank holidays.
            </p>
          </div>
        </section>

        {/* ── Delivery tips ── */}
        <section>
          <h2 className="font-heading text-2xl font-bold text-gray-900 mb-5">
            Good to Know
          </h2>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <ul className="space-y-3">
              {TIPS.map((tip, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
                  <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── Returns policy ── */}
        <section>
          <h2 className="font-heading text-2xl font-bold text-gray-900 mb-5">
            Returns Policy
          </h2>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm divide-y divide-gray-100">

            {/* Non-perishable */}
            <div className="p-6 flex gap-4">
              <div className="h-10 w-10 shrink-0 rounded-xl bg-blue-50 flex items-center justify-center">
                <RotateCcw className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  Non-Perishable Items
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  If you are not satisfied with a non-perishable item (tins,
                  packets, dry goods), you may return it in its original,
                  unopened condition within <strong>14 days</strong> of receipt
                  for a full refund. Return postage is the customer&apos;s
                  responsibility unless the item is faulty.
                </p>
              </div>
            </div>

            {/* Perishable */}
            <div className="p-6 flex gap-4">
              <div className="h-10 w-10 shrink-0 rounded-xl bg-orange-50 flex items-center justify-center">
                <Package className="h-5 w-5 text-orange-500" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  Perishable Items
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Due to food safety regulations, we cannot accept returns of
                  perishable goods (fresh produce, meat, fish, frozen items)
                  unless they arrive damaged or incorrect. Please contact us
                  within <strong>48 hours</strong> of delivery with a photo and
                  we will resolve the issue promptly.
                </p>
              </div>
            </div>

            {/* Damaged */}
            <div className="p-6 flex gap-4">
              <div className="h-10 w-10 shrink-0 rounded-xl bg-red-50 flex items-center justify-center">
                <AlertCircle className="h-5 w-5 text-red-500" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  Damaged or Incorrect Items
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  If your order arrives damaged or you receive the wrong item,
                  please photograph the issue and contact us within{" "}
                  <strong>48 hours</strong>. We will arrange a replacement or
                  full refund at no extra cost to you.
                </p>
              </div>
            </div>

            {/* Refunds */}
            <div className="p-6 flex gap-4">
              <div className="h-10 w-10 shrink-0 rounded-xl bg-green-50 flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  Refund Processing
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Approved refunds are processed within{" "}
                  <strong>3–5 business days</strong> and returned to your
                  original payment method. You will receive an email
                  confirmation once the refund has been issued.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Help CTA ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-semibold text-gray-900">
              Still have a delivery or returns question?
            </p>
            <p className="text-sm text-gray-500 mt-0.5">
              Our team typically responds within one business day.
            </p>
          </div>
          <div className="flex gap-3 shrink-0">
            <Link
              href="/faq"
              className="text-sm font-semibold text-[#A0522D] hover:underline"
            >
              View FAQ
            </Link>
            <span className="text-gray-300">|</span>
            <Link
              href="/contact"
              className="text-sm font-semibold text-[#A0522D] hover:underline"
            >
              Contact us
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
