// ─── About Page — /about ─────────────────────────────────────────────────────
// Server Component — no client state needed.

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Users, Leaf, Globe, Award, ChevronRight } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us | YKJ African & Caribbean Food Store",
  description:
    "Learn about YKJ African and Caribbean Food Store — our story, mission, and commitment to bringing authentic flavours from across Africa and the Caribbean to your door.",
};

// ─── Data ─────────────────────────────────────────────────────────────────────

const VALUES = [
  {
    icon: Award,
    title: "Quality",
    colour: "bg-[#A0522D]/10 text-[#A0522D]",
    description:
      "Every product on our shelves is hand-selected for freshness, authenticity, and value. We work closely with trusted suppliers to ensure you receive the same quality you'd find back home.",
  },
  {
    icon: Users,
    title: "Community",
    colour: "bg-blue-50 text-blue-600",
    description:
      "YKJ was built by the community, for the community. We're proud to serve the African and Caribbean diaspora across the UK — connecting families to the tastes and traditions that matter most.",
  },
  {
    icon: Globe,
    title: "Authenticity",
    colour: "bg-green-50 text-green-600",
    description:
      "We source directly from trusted brands and importers to guarantee the real deal — not substitutes. From Nigerian egusi to Jamaican ackee, our range is as authentic as it gets.",
  },
];

const STATS = [
  { value: "500+",   label: "Products" },
  { value: "1,000+", label: "Happy Customers" },
  { value: "UK-wide", label: "Delivery" },
  { value: "10+",    label: "Countries Represented" },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AboutPage() {
  return (
    <main className="bg-[#FAFAF8]">

      {/* ── Hero ── */}
      <section className="relative bg-gradient-to-br from-[#A0522D] to-[#7B3F1A] text-white overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-white/5 translate-y-1/2 -translate-x-1/3 pointer-events-none" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 text-center">
          <span className="inline-block bg-white/20 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
            Our Story
          </span>
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            Bringing the Taste of Home
            <br />
            <span className="text-[#F59E0B]">Straight to Your Door</span>
          </h1>
          <p className="text-white/80 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
            YKJ African and Caribbean Food Store was founded on a simple belief:
            no matter where you are in the UK, you should have access to the
            authentic ingredients that make your house feel like home.
          </p>
        </div>
      </section>

      {/* ── Stats bar ── */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <dl className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
            {STATS.map(({ value, label }) => (
              <div key={label}>
                <dt className="font-heading text-3xl font-bold text-[#A0522D] mb-1">
                  {value}
                </dt>
                <dd className="text-sm text-gray-500">{label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ── Our Story ── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image placeholder */}
          <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-[#A0522D]/20 to-[#7B3F1A]/20 aspect-[4/3] flex items-center justify-center order-2 lg:order-1">
            <div className="text-center p-8">
              <Image
                src="/assets/ykj-logo.jpg"
                alt="YKJ African and Caribbean Food Store"
                width={160}
                height={160}
                className="mx-auto rounded-full shadow-lg object-cover"
              />
              <p className="mt-4 text-[#A0522D] text-sm font-medium italic">
                Our flagship store — photo coming soon
              </p>
            </div>
          </div>

          {/* Story text */}
          <div className="order-1 lg:order-2 space-y-5">
            <div>
              <span className="text-[#A0522D] font-semibold text-sm uppercase tracking-widest">
                How We Started
              </span>
              <h2 className="font-heading text-3xl font-bold text-gray-900 mt-2">
                Born from a Love of Authentic Food
              </h2>
            </div>
            <p className="text-gray-600 leading-relaxed">
              YKJ was founded by a family who understood the frustration of
              searching high and low for the ingredients you grew up with —
              the real suya spice, the palm oil with just the right richness,
              the plantain at the perfect ripeness. Shopping in mainstream
              supermarkets rarely satisfied that craving.
            </p>
            <p className="text-gray-600 leading-relaxed">
              What started as a small community venture has grown into one of
              the UK&apos;s most trusted African and Caribbean food retailers.
              Today we stock over 500 products — from staples like poundo yam
              and scotch bonnet to hard-to-find Caribbean specialities — all
              sourced from the same trusted suppliers our families used for
              generations.
            </p>
            <p className="text-gray-600 leading-relaxed">
              We deliver across the whole of the UK, with fast standard and
              express options, so wherever you are — London, Manchester, Leeds,
              or beyond — the taste of home is only a click away.
            </p>
          </div>
        </div>
      </section>

      {/* ── Our Mission ── */}
      <section className="bg-[#A0522D]/5 border-y border-[#A0522D]/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <Leaf className="h-10 w-10 text-[#A0522D] mx-auto mb-4" />
          <h2 className="font-heading text-3xl font-bold text-gray-900 mb-4">
            Our Mission
          </h2>
          <p className="text-gray-700 text-lg leading-relaxed max-w-2xl mx-auto">
            To make authentic African and Caribbean food accessible to every
            household in the UK — celebrating the rich culinary heritage of our
            communities and helping people feel connected to their roots,
            wherever they call home.
          </p>
        </div>
      </section>

      {/* ── Our Values ── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="text-center mb-12">
          <span className="text-[#A0522D] font-semibold text-sm uppercase tracking-widest">
            What We Stand For
          </span>
          <h2 className="font-heading text-3xl font-bold text-gray-900 mt-2">
            Our Values
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {VALUES.map(({ icon: Icon, title, colour, description }) => (
            <div
              key={title}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-7 text-center flex flex-col items-center"
            >
              <div
                className={`h-14 w-14 rounded-2xl ${colour} flex items-center justify-center mb-5`}
              >
                <Icon className="h-7 w-7" />
              </div>
              <h3 className="font-heading text-xl font-bold text-gray-900 mb-3">
                {title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Team section ── */}
      <section className="bg-white border-t border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
          <div className="text-center mb-12">
            <span className="text-[#A0522D] font-semibold text-sm uppercase tracking-widest">
              The People Behind YKJ
            </span>
            <h2 className="font-heading text-3xl font-bold text-gray-900 mt-2">
              Meet the Team
            </h2>
            <p className="text-gray-500 mt-2 text-sm">
              A passionate, community-driven team — team photos coming soon.
            </p>
          </div>

          {/* Placeholder team grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {["Founder", "Operations", "Customer Care", "Procurement"].map(
              (role) => (
                <div key={role} className="text-center">
                  <div className="h-24 w-24 mx-auto rounded-full bg-gradient-to-br from-[#A0522D]/20 to-[#7B3F1A]/20 flex items-center justify-center mb-3">
                    <Users className="h-9 w-9 text-[#A0522D]/50" />
                  </div>
                  <p className="text-xs text-[#A0522D] font-semibold uppercase tracking-wide">
                    {role}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">Photo coming soon</p>
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* ── CTA strip ── */}
      <section className="bg-[#A0522D]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-white mb-3">
            Ready to taste the difference?
          </h2>
          <p className="text-white/80 text-sm mb-6">
            Browse our full range and get free delivery on orders over £60.
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 bg-white text-[#A0522D] font-bold px-7 py-3 rounded-xl hover:bg-[#FAFAF8] transition-colors"
          >
            Shop now <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}
