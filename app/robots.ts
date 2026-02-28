import { MetadataRoute } from "next";

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://ykjfoodstore.co.uk";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Keep admin, account, and API routes private
        disallow: ["/admin/", "/account/", "/api/"],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host:    BASE_URL,
  };
}
