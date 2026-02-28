import Link from "next/link";
import CategoryCard from "@/components/shop/CategoryCard";

// ── Category data with placeholder emoji + distinct warm Tailwind bg classes ──
// Full class strings kept static so Tailwind's purge scanner includes them.
const CATEGORIES = [
  { name: "Meat",                slug: "meat",              emoji: "🥩", bg: "bg-rose-800" },
  { name: "Fish & Seafood",      slug: "fish-seafood",      emoji: "🐟", bg: "bg-sky-700" },
  { name: "Vegetables",          slug: "vegetables",        emoji: "🥦", bg: "bg-emerald-700" },
  { name: "Grains & Flour",      slug: "grains-flour",      emoji: "🌾", bg: "bg-amber-700" },
  { name: "Spices & Seasonings", slug: "spices-seasonings", emoji: "🌶️", bg: "bg-orange-700" },
  { name: "Canned & Packets",    slug: "canned-packets",    emoji: "🥫", bg: "bg-slate-600" },
  { name: "Cooking Oil",         slug: "cooking-oil",       emoji: "🫙", bg: "bg-yellow-700" },
  { name: "Drinks",              slug: "drinks",            emoji: "🧃", bg: "bg-teal-700" },
  { name: "Frozen Foods",        slug: "frozen-foods",      emoji: "❄️", bg: "bg-blue-700" },
  { name: "Sauces & Paste",      slug: "sauces-paste",      emoji: "🍯", bg: "bg-red-800" },
  { name: "Snacks",              slug: "snacks",            emoji: "🍿", bg: "bg-purple-700" },
  { name: "Beauty & Household",  slug: "beauty-household",  emoji: "🌸", bg: "bg-pink-700" },
] as const;

export default function CategoryGrid() {
  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="container mx-auto px-4">

        {/* ── Section header ──────────────────────────────────────────── */}
        <div className="flex items-end justify-between mb-7 md:mb-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-brand-400 mb-1">
              Browse
            </p>
            <h2 className="font-heading font-bold text-2xl md:text-3xl text-foreground">
              Shop by Category
            </h2>
          </div>
          <Link
            href="/shop"
            className="hidden sm:inline-flex text-sm font-medium text-brand-500 hover:text-brand-700 transition-colors"
          >
            View All →
          </Link>
        </div>

        {/* ── Responsive grid ─────────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {CATEGORIES.map((cat) => (
            <CategoryCard
              key={cat.slug}
              name={cat.name}
              slug={cat.slug}
              emoji={cat.emoji}
              bg={cat.bg}
            />
          ))}
        </div>

        {/* ── Mobile "View All" link ──────────────────────────────────── */}
        <div className="mt-6 text-center sm:hidden">
          <Link
            href="/shop"
            className="text-sm font-medium text-brand-500 hover:text-brand-700 transition-colors"
          >
            View All Categories →
          </Link>
        </div>
      </div>
    </section>
  );
}
