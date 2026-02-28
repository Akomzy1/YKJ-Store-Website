"use client";

import Link from "next/link";
import { ChevronDown } from "lucide-react";

export default function HeroBanner() {
  return (
    <section
      className="relative flex items-center overflow-hidden min-h-[65vh] md:min-h-[85vh]"
      // CSS background colour shows if video + poster both fail to load
      style={{ backgroundColor: "#A0522D" }}
    >
      {/* ── Background video ────────────────────────────────────────────── */}
      <video
        autoPlay
        muted
        loop
        playsInline
        poster="/assets/ykj-hero-poster.jpg"
        className="absolute inset-0 w-full h-full object-cover"
        aria-hidden
      >
        <source src="/assets/ykj-hero-video.mp4" type="video/mp4" />
      </video>

      {/* ── Gradient overlay ─────────────────────────────────────────────
          Mobile:  solid-ish coverage so text is legible on any frame
          Desktop: left-heavy fade so the right side of the video shows through
      ─────────────────────────────────────────────────────────────────── */}
      <div
        className="absolute inset-0 bg-gradient-to-r
          from-black/75 to-black/60
          md:from-black/70 md:via-black/50 md:to-transparent"
        aria-hidden
      />

      {/* ── Content ──────────────────────────────────────────────────────
          Centred on mobile, left-aligned on desktop
      ─────────────────────────────────────────────────────────────────── */}
      <div className="relative z-10 w-full container mx-auto px-4 md:px-8 py-16 md:py-24">
        <div className="max-w-2xl mx-auto md:mx-0 text-center md:text-left">

          {/* Eyebrow pill badge */}
          <span className="inline-flex items-center gap-1.5 rounded-full bg-gold-500 text-black px-4 py-1.5 text-xs sm:text-sm font-bold mb-5 md:mb-6">
            🌍 Authentic African &amp; Caribbean Groceries
          </span>

          {/* H1 — Playfair Display, two distinct lines */}
          <h1 className="font-heading font-bold text-white leading-[1.1] mb-5 md:mb-6
            text-[2.5rem] sm:text-5xl md:text-6xl lg:text-[4.5rem]">
            Taste of Home,
            <br />
            Delivered to Your Door
          </h1>

          {/* Subheading — Inter */}
          <p className="font-body text-white/80 text-base sm:text-lg md:text-xl leading-relaxed mb-8 md:mb-10 max-w-xl mx-auto md:mx-0">
            Fresh, quality groceries from across Africa and the Caribbean —
            delivered fast across the UK.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row items-center md:items-start justify-center md:justify-start gap-3 sm:gap-4">
            <Link
              href="/shop"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2
                px-8 py-3.5 rounded-lg font-bold text-sm sm:text-base
                bg-brand-500 hover:bg-brand-600 active:bg-brand-700
                text-white transition-colors shadow-lg shadow-brand-900/30"
            >
              Shop Now
              <span aria-hidden>→</span>
            </Link>

            <Link
              href="/deals"
              className="w-full sm:w-auto inline-flex items-center justify-center
                px-8 py-3.5 rounded-lg font-bold text-sm sm:text-base
                border-2 border-white text-white
                hover:bg-white hover:text-brand-700
                active:bg-white/90 transition-colors"
            >
              View Today&apos;s Deals
            </Link>
          </div>
        </div>
      </div>

      {/* ── Scroll-down chevron ──────────────────────────────────────────── */}
      <div
        className="absolute bottom-7 left-1/2 -translate-x-1/2 animate-bounce"
        aria-hidden
      >
        <ChevronDown size={30} className="text-white/60" strokeWidth={1.5} />
      </div>
    </section>
  );
}
