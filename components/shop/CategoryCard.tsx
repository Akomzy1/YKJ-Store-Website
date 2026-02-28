import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface CategoryCardProps {
  name: string;
  slug: string;
  emoji: string;
  /** Full Tailwind bg class — must be a static string so Tailwind's purge scanner picks it up */
  bg: string;
}

export default function CategoryCard({ name, slug, emoji, bg }: CategoryCardProps) {
  return (
    <Link
      href={`/shop/${slug}`}
      className="group relative rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow block"
      aria-label={`Shop ${name}`}
    >
      {/* ── Coloured placeholder background + centred emoji ────────────── */}
      <div className={`aspect-[4/3] ${bg} relative flex items-center justify-center`}>
        <span
          className="text-[3.5rem] select-none transition-transform duration-300 group-hover:scale-110 drop-shadow-lg"
          aria-hidden
        >
          {emoji}
        </span>

        {/* Gradient — heaviest at bottom so text stays legible */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />
      </div>

      {/* ── Category name + "Shop Now" ───────────────────────────────── */}
      <div className="absolute bottom-0 left-0 right-0 px-3.5 py-3 z-10">
        <p className="text-white font-heading font-semibold text-sm leading-tight">
          {name}
        </p>
        <span className="flex items-center gap-1 text-white/65 text-xs mt-0.5 group-hover:text-gold-400 transition-colors">
          Shop Now
          <ArrowRight
            size={11}
            className="transition-transform group-hover:translate-x-0.5"
          />
        </span>
      </div>
    </Link>
  );
}
