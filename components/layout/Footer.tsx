"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Instagram, Facebook, Mail } from "lucide-react";

// ─── Inline brand SVG icons (not in lucide-react) ────────────────────────────

function TikTokIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.7a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z" />
    </svg>
  );
}

function WhatsAppIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
    </svg>
  );
}

// ─── Link data ────────────────────────────────────────────────────────────────

const QUICK_LINKS = [
  { label: "Home",         href: "/" },
  { label: "Shop All",     href: "/shop" },
  { label: "Today's Deals", href: "/deals" },
  { label: "New Arrivals", href: "/shop?sort=newest" },
  { label: "About YKJ",   href: "/about" },
  { label: "Recipes",      href: "/recipes" },
];

const HELP_LINKS = [
  { label: "Delivery Information", href: "/delivery-info" },
  { label: "Returns Policy",       href: "/delivery-info#returns" },
  { label: "FAQ",                  href: "/faq" },
  { label: "Contact Us",           href: "/contact" },
  { label: "Track My Order",       href: "/account/orders" },
];

const LEGAL_LINKS = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms & Conditions", href: "/terms" },
];

const SOCIAL_LINKS = [
  { label: "Instagram", href: "https://instagram.com/ykjfoodstore", Icon: Instagram },
  { label: "Facebook",  href: "https://facebook.com/ykjfoodstore",  Icon: Facebook },
  { label: "TikTok",    href: "https://tiktok.com/@ykjfoodstore",   Icon: TikTokIcon },
  { label: "WhatsApp",  href: "https://wa.me/447000000000",         Icon: WhatsAppIcon },
];

const PAYMENT_METHODS = ["VISA", "MC", "PayPal", "Apple Pay", "Klarna"];

// ─── Newsletter form ──────────────────────────────────────────────────────────

function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("loading");
    // TODO: POST /api/newsletter with email, integrate Resend
    await new Promise((r) => setTimeout(r, 800)); // mock delay
    setStatus("success");
    setEmail("");
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-2" noValidate>
      {status === "success" ? (
        <p className="text-green-300 text-sm font-medium py-2">
          ✓ You&apos;re subscribed! Check your inbox for a welcome email.
        </p>
      ) : (
        <>
          <div className="flex rounded-lg overflow-hidden border border-white/20 focus-within:border-white/50 transition-colors">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              disabled={status === "loading"}
              className="flex-1 bg-white/10 text-white placeholder:text-white/50 px-3 py-2.5 text-sm focus:outline-none disabled:opacity-60"
              aria-label="Email address for newsletter"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="shrink-0 px-4 py-2.5 bg-gold-500 hover:bg-gold-600 disabled:opacity-60 text-white font-semibold text-sm transition-colors"
            >
              {status === "loading" ? "…" : "Subscribe"}
            </button>
          </div>
          <p className="text-white/40 text-xs flex items-center gap-1.5">
            <Mail size={11} />
            No spam. Unsubscribe anytime.
          </p>
        </>
      )}
    </form>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────

export default function Footer() {
  return (
    <footer className="bg-brand-600 text-white">
      {/* ── Main grid ──────────────────────────────────────────────────────── */}
      <div className="container mx-auto px-4 pt-14 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Col 1 — Brand */}
          <div>
            <Link href="/" aria-label="YKJ — home">
              <Image
                src="/assets/ykj-logo.jpg"
                alt="YKJ African and Caribbean Food Store"
                width={140}
                height={48}
                className="h-14 w-auto object-contain brightness-0 invert"
              />
            </Link>
            <p className="mt-4 text-white/70 text-sm leading-relaxed">
              Authentic African and Caribbean groceries, delivered fast across
              the UK. Taste of Home, Delivered to Your Door.
            </p>

            {/* Social icons */}
            <div className="flex items-center gap-3 mt-5">
              {SOCIAL_LINKS.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                >
                  <Icon size={17} />
                </a>
              ))}
            </div>
          </div>

          {/* Col 2 — Quick Links */}
          <div>
            <h3 className="font-heading font-semibold text-base mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2.5">
              {QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/70 hover:text-white text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 — Help & Support */}
          <div>
            <h3 className="font-heading font-semibold text-base mb-4">
              Help &amp; Support
            </h3>
            <ul className="space-y-2.5">
              {HELP_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/70 hover:text-white text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4 — Newsletter */}
          <div>
            <h3 className="font-heading font-semibold text-base mb-1">
              Get Weekly Deals
            </h3>
            <p className="text-white/60 text-sm">
              Exclusive offers, new arrivals and recipes — straight to your inbox.
            </p>
            <NewsletterForm />
          </div>
        </div>
      </div>

      {/* ── Bottom bar ─────────────────────────────────────────────────────── */}
      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">

          {/* Payment methods */}
          <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-start">
            {PAYMENT_METHODS.map((method) => (
              <span
                key={method}
                className="px-2.5 py-1 rounded bg-white/10 text-white/80 text-[11px] font-bold tracking-wide"
              >
                {method}
              </span>
            ))}
          </div>

          {/* Copyright + legal links */}
          <div className="flex flex-col sm:flex-row items-center gap-3 text-white/50 text-xs text-center">
            <span>
              © {new Date().getFullYear()} YKJ African and Caribbean Food Store Limited
            </span>
            <span className="hidden sm:inline opacity-40">·</span>
            <div className="flex gap-3">
              {LEGAL_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="hover:text-white/80 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
