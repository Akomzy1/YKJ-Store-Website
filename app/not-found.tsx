// ─── 404 Not Found — app/not-found.tsx ───────────────────────────────────────
// Rendered by Next.js when no route matches.
// Server Component — no client state needed.

import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Search, ShoppingBag, Home, Truck, HelpCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Page Not Found | YKJ African & Caribbean Food Store",
};

const POPULAR_LINKS = [
  { href: "/shop",              label: "All Products",       icon: ShoppingBag },
  { href: "/shop/meat",         label: "Meat & Poultry",     icon: ShoppingBag },
  { href: "/shop/grains-flour", label: "Grains & Flour",     icon: ShoppingBag },
  { href: "/shop/drinks",       label: "Drinks",             icon: ShoppingBag },
  { href: "/delivery-info",     label: "Delivery Info",      icon: Truck       },
  { href: "/faq",               label: "Help & FAQs",        icon: HelpCircle  },
];

export default function NotFound() {
  return (
    <main className="min-h-[80vh] bg-[#FAFAF8] flex flex-col items-center justify-center px-4 py-16 text-center">

      {/* Logo */}
      <Link href="/" className="mb-8 inline-block">
        <Image
          src="/assets/ykj-logo.jpg"
          alt="YKJ African and Caribbean Food Store"
          width={72}
          height={72}
          className="mx-auto rounded-full object-cover shadow-md"
        />
      </Link>

      {/* 404 graphic */}
      <div className="relative mb-6 select-none">
        <span
          className="font-heading text-[120px] sm:text-[160px] font-bold leading-none text-[#A0522D]/10"
          aria-hidden="true"
        >
          404
        </span>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-5xl sm:text-6xl" aria-hidden="true">🛒</span>
        </div>
      </div>

      {/* Heading */}
      <h1 className="font-heading text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
        Looks like this page went shopping without us!
      </h1>
      <p className="text-gray-500 max-w-md mx-auto mb-8 text-sm sm:text-base leading-relaxed">
        The page you&apos;re looking for has either moved, been removed, or never
        existed. Let&apos;s get you back on track.
      </p>

      {/* Search bar */}
      <form
        action="/shop"
        method="GET"
        className="w-full max-w-sm mx-auto mb-8"
      >
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          <input
            type="text"
            name="q"
            placeholder="Search for a product…"
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[#A0522D]/30 focus:border-[#A0522D]"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#A0522D] hover:bg-[#7B3F1A] text-white text-xs font-semibold px-3.5 py-1.5 rounded-lg transition-colors"
          >
            Search
          </button>
        </div>
      </form>

      {/* Primary CTA */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 bg-[#A0522D] hover:bg-[#7B3F1A] text-white font-bold px-7 py-3 rounded-xl transition-colors mb-10"
      >
        <Home className="h-4 w-4" />
        Back to homepage
      </Link>

      {/* Popular categories */}
      <div className="w-full max-w-lg mx-auto">
        <p className="text-xs text-gray-400 uppercase tracking-widest mb-4 font-medium">
          Popular pages
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {POPULAR_LINKS.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-2 bg-white border border-gray-100 rounded-xl px-4 py-3 text-sm font-medium text-gray-700 hover:border-[#A0522D]/30 hover:text-[#A0522D] transition-colors shadow-sm"
            >
              <Icon className="h-4 w-4 shrink-0 text-[#A0522D]" />
              {label}
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
