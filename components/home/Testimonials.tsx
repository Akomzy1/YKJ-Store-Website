import { Star } from "lucide-react";

// ─── Mock testimonials ────────────────────────────────────────────────────────

const REVIEWS = [
  {
    id: 1,
    name: "Adaeze O.",
    location: "Birmingham",
    rating: 5,
    date: "January 2026",
    text: "Finally found a store that stocks proper egusi, Cameroon pepper and uziza leaves. The quality is just like back home in Lagos — and delivery was on my doorstep in two days. Won't shop anywhere else!",
  },
  {
    id: 2,
    name: "Marcus J.",
    location: "Manchester",
    rating: 5,
    date: "January 2026",
    text: "Great selection of Caribbean products. The scotch bonnets are always fresh and fiery, and the Grace canned ackee is genuinely the best I've found in the UK. Fair prices too — way cheaper than the market.",
  },
  {
    id: 3,
    name: "Blessing A.",
    location: "London",
    rating: 5,
    date: "December 2025",
    text: "Just like shopping back home. YKJ always have everything I need for a proper Sunday jollof — the right palm oil, the right Maggi, even the Titus fish. Delivery is fast and packaging is careful.",
  },
  {
    id: 4,
    name: "Kofi M.",
    location: "Leeds",
    rating: 5,
    date: "December 2025",
    text: "I ordered groundnut paste, kontomire and a pack of fufu flour. Everything arrived perfectly packaged within 3 days. Finally a reliable shop that understands what Ghanaian cooking actually needs.",
  },
  {
    id: 5,
    name: "Simone T.",
    location: "Nottingham",
    rating: 5,
    date: "November 2025",
    text: "Ordered plantain chips and some Dudu-Osun black soap as a gift. The soap is 100% authentic — smells exactly right. My sister was so happy! Customer service also replied within an hour when I had a query.",
  },
  {
    id: 6,
    name: "Emeka & Chisom N.",
    location: "Bristol",
    rating: 5,
    date: "November 2025",
    text: "Been ordering weekly since we discovered YKJ. The suya spice mix is incredible and the goat meat is always fresh and well-butchered. This is now our family's go-to African grocery shop in the UK.",
  },
] as const;

// ─── Star row ─────────────────────────────────────────────────────────────────

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${count} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={14}
          className={i < count ? "text-gold-500 fill-gold-500" : "text-muted-foreground"}
          aria-hidden
        />
      ))}
    </div>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────

export default function Testimonials() {
  return (
    <section className="py-12 md:py-16 bg-brand-50">
      <div className="container mx-auto px-4">

        {/* Heading */}
        <div className="text-center mb-9 md:mb-10">
          <p className="text-xs font-bold uppercase tracking-widest text-brand-400 mb-1">
            Customer Stories
          </p>
          <h2 className="font-heading font-bold text-2xl md:text-3xl text-foreground">
            What Our Customers Say
          </h2>
          {/* Aggregate rating */}
          <div className="flex items-center justify-center gap-2 mt-3">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={16} className="text-gold-500 fill-gold-500" aria-hidden />
              ))}
            </div>
            <span className="text-sm text-muted-foreground font-medium">
              5.0 · 200+ reviews
            </span>
          </div>
        </div>

        {/* Review grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-9">
          {REVIEWS.map((review) => (
            <article
              key={review.id}
              className="bg-white rounded-2xl p-5 shadow-sm border border-brand-100 flex flex-col gap-3"
            >
              {/* Stars + date */}
              <div className="flex items-center justify-between">
                <StarRating count={review.rating} />
                <time
                  className="text-[11px] text-muted-foreground"
                  dateTime={review.date}
                >
                  {review.date}
                </time>
              </div>

              {/* Quote */}
              <blockquote className="text-sm text-foreground/90 leading-relaxed flex-1">
                &ldquo;{review.text}&rdquo;
              </blockquote>

              {/* Reviewer */}
              <div className="flex items-center gap-2.5 pt-2 border-t border-border/60">
                {/* Avatar initial */}
                <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center shrink-0">
                  <span className="text-xs font-bold text-brand-600">
                    {review.name[0]}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground leading-none">
                    {review.name}
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    {review.location}
                  </p>
                </div>
                {/* Verified badge */}
                <span className="ml-auto text-[10px] font-semibold text-green-700 bg-green-50 px-1.5 py-0.5 rounded-full border border-green-200">
                  ✓ Verified
                </span>
              </div>
            </article>
          ))}
        </div>

        {/* Google CTA */}
        <div className="text-center">
          <a
            href="https://www.google.com/search?q=YKJ+African+Caribbean+Food+Store+reviews"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-semibold text-brand-500 hover:text-brand-700 transition-colors underline underline-offset-4"
          >
            Read all reviews on Google →
          </a>
        </div>
      </div>
    </section>
  );
}
