// ─── FAQ Page — /faq ─────────────────────────────────────────────────────────
// Server Component — shadcn Accordion is already "use client" internally.

import type { Metadata } from "next";
import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { MessageCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "FAQ | YKJ African & Caribbean Food Store",
  description:
    "Frequently asked questions about ordering, delivery, payments, returns, and products at YKJ African and Caribbean Food Store.",
};

// ─── FAQ data ─────────────────────────────────────────────────────────────────

const GROUPS = [
  {
    id:    "ordering",
    label: "Ordering",
    emoji: "🛒",
    items: [
      {
        q: "How do I place an order?",
        a: "Browse our shop, add items to your cart, and proceed to checkout. You can checkout as a guest or sign in for a faster experience with saved addresses and order history.",
      },
      {
        q: "Can I amend or cancel my order after placing it?",
        a: "We start processing orders quickly, but if you need to make a change please contact us as soon as possible via WhatsApp or email. We'll do our best to help before the order is dispatched. Once dispatched, we cannot modify or cancel the order.",
      },
      {
        q: "Is there a minimum order value?",
        a: "There is no minimum order, though we recommend ordering over £60 to take advantage of our free standard delivery offer.",
      },
      {
        q: "Do you offer click and collect?",
        a: "We are working on a click and collect option from our store. Please contact us to enquire about the current availability.",
      },
      {
        q: "Can I order in bulk or wholesale?",
        a: "Yes! We welcome bulk and trade orders. Please contact us via the contact page or WhatsApp to discuss wholesale pricing and arrangements.",
      },
    ],
  },
  {
    id:    "delivery",
    label: "Delivery",
    emoji: "🚚",
    items: [
      {
        q: "How much does delivery cost?",
        a: "Standard delivery (2–4 working days) costs £4.99. Express delivery (next working day if ordered before 2PM) costs £7.99. Orders over £60 qualify for free standard delivery.",
      },
      {
        q: "Do you deliver across the whole UK?",
        a: "We deliver to all mainland UK addresses. Deliveries to Scottish Highlands, Northern Ireland, the Channel Islands, and offshore islands may take longer and could incur a small surcharge. You will see the exact cost at checkout based on your postcode.",
      },
      {
        q: "How quickly will my order arrive?",
        a: "Standard delivery: 2–4 working days. Express delivery: next working day if you order before 2PM Monday–Friday. Orders placed on weekends are processed on the next working day. You'll receive a tracking link by email once your order is dispatched.",
      },
      {
        q: "Do you offer same-day delivery?",
        a: "Same-day delivery is not currently available, but our express option gets your order to you the next working day when ordered before 2PM.",
      },
      {
        q: "What happens if my delivery is late?",
        a: "Delivery times are estimates and can occasionally be affected by courier delays. If your order has not arrived within the expected window, please check your tracking link first. If there is still an issue, contact us and we will investigate straight away.",
      },
      {
        q: "What happens if I am not home when my parcel arrives?",
        a: "Our couriers will attempt redelivery or leave the parcel in a safe place or with a neighbour. You will receive a notification card or email/SMS from the courier. Most couriers also allow you to reschedule delivery online.",
      },
    ],
  },
  {
    id:    "payment",
    label: "Payment",
    emoji: "💳",
    items: [
      {
        q: "What payment methods do you accept?",
        a: "We accept all major credit and debit cards (Visa, Mastercard, American Express) via our secure Stripe payment gateway. Apple Pay and Google Pay are also supported where available.",
      },
      {
        q: "Is my payment information secure?",
        a: "Absolutely. All payments are processed securely by Stripe, a PCI DSS Level 1 certified payment provider. We never store your card details on our servers.",
      },
      {
        q: "Do you accept PayPal?",
        a: "PayPal is not currently available at checkout but we are working on adding it soon. Keep an eye on our social media for updates.",
      },
      {
        q: "Can I pay by bank transfer?",
        a: "For large or wholesale orders, bank transfer may be arranged. Please contact us directly to discuss.",
      },
      {
        q: "Why has my payment been declined?",
        a: "A declined payment is usually due to incorrect card details, insufficient funds, or your bank's security systems. Please double-check your details and try again, or contact your bank. If you continue to have issues, get in touch with us and we will help.",
      },
    ],
  },
  {
    id:    "returns",
    label: "Returns & Refunds",
    emoji: "↩️",
    items: [
      {
        q: "What is your returns policy?",
        a: "If you receive a damaged, incorrect, or faulty item, please contact us within 48 hours of delivery with a photo of the issue. We will arrange a replacement or refund promptly. For non-perishable items, you can return them in original, unopened condition within 14 days for a full refund.",
      },
      {
        q: "Can I return perishable products?",
        a: "Due to food safety regulations, we cannot accept returns of perishable items (fresh produce, meat, fish, frozen goods) unless they are damaged or incorrect. Please contact us within 48 hours if you have an issue with any perishable product.",
      },
      {
        q: "How long does it take to process a refund?",
        a: "Once your return is approved, refunds are processed within 3–5 business days and will be returned to your original payment method.",
      },
      {
        q: "What should I do if I receive the wrong item?",
        a: "We are sorry for the mix-up! Please contact us within 48 hours with your order number and a photo of what you received. We will get the correct item sent out to you as quickly as possible.",
      },
      {
        q: "My item arrived damaged — what should I do?",
        a: "Please photograph the damaged item and packaging, then contact us via email or WhatsApp with your order number. We will resolve this for you as quickly as possible with either a replacement or refund.",
      },
    ],
  },
  {
    id:    "products",
    label: "Products",
    emoji: "🌿",
    items: [
      {
        q: "Are your products authentic / genuinely imported?",
        a: "Yes. We source from established importers and brands to ensure authenticity. Many of our products are the same brands you would find in stores back home in Nigeria, Ghana, Jamaica, and beyond.",
      },
      {
        q: "Do you stock halal meat?",
        a: "All meat products we stock are halal certified. Each product page will indicate the halal status. If you are unsure about a specific product, please get in touch.",
      },
      {
        q: "Do you stock vegan and vegetarian products?",
        a: "Yes, a large portion of our range is suitable for vegans and vegetarians — grains, flours, spices, canned goods, oils, and more. You can filter by dietary preference on our shop page.",
      },
      {
        q: "A product I want is out of stock. When will it be back?",
        a: "Stock availability varies by supplier. The best way to find out is to contact us via WhatsApp or email with the product name, and we will give you an estimated restock date.",
      },
      {
        q: "Can I request a product you do not currently stock?",
        a: "Absolutely! We are always looking to expand our range. Send us a message via the contact form or WhatsApp with the product details and we will do our best to source it.",
      },
      {
        q: "Are your products suitable for people with allergies?",
        a: "We include allergen information on each product page where provided by the manufacturer. However, many of our products are imported and packed in facilities that handle various allergens. If you have a severe allergy, please read the packaging carefully or contact us before ordering.",
      },
    ],
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function FaqPage() {
  return (
    <main className="bg-[#FAFAF8]">
      {/* ── Header ── */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h1 className="font-heading text-4xl font-bold text-gray-900 mb-2">
            Frequently Asked Questions
          </h1>
          <p className="text-gray-500">
            Can&apos;t find your answer? We&apos;re happy to help —{" "}
            <Link
              href="/contact"
              className="text-[#A0522D] hover:underline font-medium"
            >
              get in touch
            </Link>
            .
          </p>
        </div>
      </div>

      {/* ── Group anchor nav ── */}
      <div className="bg-white border-b border-gray-100 overflow-x-auto">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1 py-2 whitespace-nowrap">
            {GROUPS.map(({ id, label, emoji }) => (
              <a
                key={id}
                href={`#${id}`}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium text-gray-600 hover:bg-[#A0522D]/10 hover:text-[#A0522D] transition-colors"
              >
                <span>{emoji}</span> {label}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* ── FAQ groups ── */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {GROUPS.map(({ id, label, emoji, items }) => (
          <section key={id} id={id} className="scroll-mt-16">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl" aria-hidden="true">{emoji}</span>
              <h2 className="font-heading text-2xl font-bold text-gray-900">
                {label}
              </h2>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden px-4">
              <Accordion type="multiple">
                {items.map((item, idx) => (
                  <AccordionItem
                    key={idx}
                    value={`${id}-${idx}`}
                    className="border-b last:border-none border-gray-100"
                  >
                    <AccordionTrigger className="text-left font-medium text-gray-900 hover:no-underline hover:text-[#A0522D] py-4 text-sm">
                      {item.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-600 text-sm leading-relaxed pb-4">
                      {item.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </section>
        ))}

        {/* ── Still have questions ── */}
        <div className="bg-[#A0522D] rounded-2xl p-7 text-center text-white">
          <MessageCircle className="h-10 w-10 mx-auto mb-3 opacity-90" />
          <h3 className="font-heading text-xl font-bold mb-2">
            Still have a question?
          </h3>
          <p className="text-white/80 text-sm mb-5">
            Our team is here to help. Reach out via the contact form or chat
            with us directly on WhatsApp.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/contact"
              className="inline-block bg-white text-[#A0522D] font-bold px-6 py-2.5 rounded-xl hover:bg-[#FAFAF8] transition-colors text-sm"
            >
              Contact us
            </Link>
            <a
              href="https://wa.me/442000000000"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-green-500 hover:bg-green-600 text-white font-bold px-6 py-2.5 rounded-xl transition-colors text-sm"
            >
              WhatsApp us
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
