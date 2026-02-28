import HeroBanner        from "@/components/home/HeroBanner";
import TrustBadges       from "@/components/home/TrustBadges";
import CategoryGrid      from "@/components/home/CategoryGrid";
import FeaturedProducts  from "@/components/home/FeaturedProducts";
import DealsSection      from "@/components/home/DealsSection";
import NationalityFilter from "@/components/home/NationalityFilter";
import Testimonials      from "@/components/home/Testimonials";
import NewsletterBanner  from "@/components/home/NewsletterBanner";
import { getProducts, getDealProducts } from "@/lib/supabase-queries";

// Revalidate homepage data every 5 minutes
export const revalidate = 300;

export default async function HomePage() {
  // Fetch in parallel — fall back to empty arrays (mock data used as fallback
  // inside each component when the array is undefined / Supabase not connected).
  const [products, deals] = await Promise.allSettled([
    getProducts(),
    getDealProducts(),
  ]);

  const allProducts  = products.status  === "fulfilled" ? products.value  : undefined;
  const dealProducts = deals.status     === "fulfilled" ? deals.value     : undefined;

  return (
    <>
      {/* 1. Hero video banner */}
      <HeroBanner />

      {/* 2. Trust badges strip */}
      <TrustBadges />

      {/* 3. Category grid */}
      <CategoryGrid />

      {/* 4. Featured / New Arrivals / Best Sellers / On Offer tabs */}
      <FeaturedProducts products={allProducts} />

      {/* 5. Deals of the Day — countdown timer + embla carousel */}
      <DealsSection deals={dealProducts} />

      {/* 6. Shop by Origin — nationality filter chip + product grid */}
      <NationalityFilter products={allProducts} />

      {/* 7. Customer testimonials */}
      <Testimonials />

      {/* 8. Newsletter sign-up */}
      <NewsletterBanner />
    </>
  );
}
