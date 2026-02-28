import { Truck, ShieldCheck, BadgePoundSterling, Star } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface Badge {
  Icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  title: string;
  desc: string;
}

const BADGES: Badge[] = [
  {
    Icon: Truck,
    iconBg: "bg-brand-100",
    iconColor: "text-brand-600",
    title: "Fast UK Delivery",
    desc: "2–4 working days standard",
  },
  {
    Icon: ShieldCheck,
    iconBg: "bg-green-100",
    iconColor: "text-green-700",
    title: "Quality Guaranteed",
    desc: "Hand-selected, authentic goods",
  },
  {
    Icon: BadgePoundSterling,
    iconBg: "bg-gold-100",
    iconColor: "text-yellow-700",
    title: "Fair Prices",
    desc: "Great value, no hidden fees",
  },
  {
    Icon: Star,
    iconBg: "bg-orange-100",
    iconColor: "text-orange-600",
    title: "5-Star Rated",
    desc: "Loved by 1,000+ customers",
  },
];

export default function TrustBadges() {
  return (
    <section className="bg-brand-50 border-b border-brand-100">
      <div className="container mx-auto px-4 py-7 md:py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {BADGES.map(({ Icon, iconBg, iconColor, title, desc }) => (
            <div
              key={title}
              className="flex items-center gap-3.5"
            >
              {/* Icon circle */}
              <div
                className={`shrink-0 w-11 h-11 rounded-full flex items-center justify-center ${iconBg}`}
              >
                <Icon size={20} className={iconColor} strokeWidth={1.75} />
              </div>

              {/* Text */}
              <div className="min-w-0">
                <p className="font-heading font-semibold text-sm text-foreground leading-snug">
                  {title}
                </p>
                <p className="text-muted-foreground text-xs leading-snug mt-0.5">
                  {desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
