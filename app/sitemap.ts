import { MetadataRoute } from "next";
import { getProducts, getCategories } from "@/lib/supabase-queries";

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://ykjfoodstore.co.uk";

// ─── Static routes ────────────────────────────────────────────────────────────

const STATIC_ROUTES: Array<{
  path: string;
  changeFrequency: MetadataRoute.Sitemap[0]["changeFrequency"];
  priority: number;
}> = [
  { path: "/",              changeFrequency: "daily",   priority: 1.0 },
  { path: "/shop",          changeFrequency: "daily",   priority: 0.9 },
  { path: "/deals",         changeFrequency: "daily",   priority: 0.8 },
  { path: "/about",         changeFrequency: "monthly", priority: 0.5 },
  { path: "/contact",       changeFrequency: "monthly", priority: 0.5 },
  { path: "/faq",           changeFrequency: "monthly", priority: 0.5 },
  { path: "/delivery-info", changeFrequency: "monthly", priority: 0.5 },
];

// ─── Sitemap generator ────────────────────────────────────────────────────────

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // Static pages
  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((r) => ({
    url:             `${BASE_URL}${r.path}`,
    lastModified:    now,
    changeFrequency: r.changeFrequency,
    priority:        r.priority,
  }));

  try {
    const [categories, products] = await Promise.all([
      getCategories(),
      getProducts(),
    ]);

    const categoryEntries: MetadataRoute.Sitemap = categories.map((cat) => ({
      url:             `${BASE_URL}/shop/${cat.slug}`,
      lastModified:    now,
      changeFrequency: "weekly",
      priority:        0.8,
    }));

    const productEntries: MetadataRoute.Sitemap = products.map((p) => ({
      url:             `${BASE_URL}/product/${p.slug}`,
      lastModified:    new Date(p.created_at),
      changeFrequency: "weekly",
      priority:        0.7,
    }));

    return [...staticEntries, ...categoryEntries, ...productEntries];
  } catch (error) {
    console.error("[sitemap] Could not fetch dynamic pages — returning static-only sitemap:", error);
    return staticEntries;
  }
}
