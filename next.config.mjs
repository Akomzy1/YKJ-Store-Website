/** @type {import('next').NextConfig} */

// ─── Security headers applied to every response ────────────────────────────
// CSP is intentionally permissive to support Stripe, Supabase, and Google Fonts
// in all environments. Tighten per-directive before launch if desired.
const securityHeaders = [
  // Disable browser DNS prefetch leak
  { key: "X-DNS-Prefetch-Control", value: "on" },

  // Enforce HTTPS for 1 year (only meaningful in production)
  {
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains; preload",
  },

  // Prevent clickjacking
  { key: "X-Frame-Options", value: "SAMEORIGIN" },

  // Prevent MIME-type sniffing
  { key: "X-Content-Type-Options", value: "nosniff" },

  // Control referrer information
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },

  // Disable unused browser features
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(self), interest-cohort=()",
  },

  // Content-Security-Policy — allows Stripe, Supabase, Google Fonts, self
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      // Next.js inline scripts + Stripe JS
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' js.stripe.com",
      // Tailwind inline styles + Google Fonts
      "style-src 'self' 'unsafe-inline' fonts.googleapis.com",
      // Google Fonts, Supabase Storage, data URIs for placeholders
      "img-src 'self' data: blob: *.supabase.co *.supabase.in",
      // Google Fonts files
      "font-src 'self' fonts.gstatic.com",
      // API calls: Supabase, Stripe
      "connect-src 'self' *.supabase.co *.supabase.in api.stripe.com wss://*.supabase.co",
      // Stripe Elements iframe
      "frame-src js.stripe.com hooks.stripe.com",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "upgrade-insecure-requests",
    ].join("; "),
  },
];

const nextConfig = {
  // ─── Image optimisation ──────────────────────────────────────────────────
  images: {
    remotePatterns: [
      // Supabase Storage (project images)
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      // Supabase alternate domain
      {
        protocol: "https",
        hostname: "*.supabase.in",
        pathname: "/storage/v1/object/public/**",
      },
    ],
    // Modern format for smaller file sizes
    formats: ["image/avif", "image/webp"],
    // Aggressive caching: 30 days
    minimumCacheTTL: 2592000,
  },

  // ─── Security headers ────────────────────────────────────────────────────
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },

  // ─── Redirects ───────────────────────────────────────────────────────────
  async redirects() {
    return [
      // Legacy / common URL patterns → canonical routes
      { source: "/products",             destination: "/shop",       permanent: true },
      { source: "/categories",           destination: "/shop",       permanent: true },
      { source: "/store",                destination: "/shop",       permanent: true },
      { source: "/order",                destination: "/checkout",   permanent: true },
      { source: "/basket",               destination: "/cart",       permanent: true },
      { source: "/privacy-policy",       destination: "/faq",        permanent: false },
      { source: "/terms",                destination: "/faq",        permanent: false },
      // Admin convenience
      { source: "/admin",                destination: "/admin",      permanent: false },
    ];
  },

  // ─── Compiler options ────────────────────────────────────────────────────
  // Remove console.log in production builds
  compiler: {
    removeConsole: process.env.NODE_ENV === "production"
      ? { exclude: ["error", "warn"] }
      : false,
  },

  // ─── Experimental ────────────────────────────────────────────────────────
  experimental: {
    // Optimise server components bundle size
    serverComponentsExternalPackages: ["@supabase/supabase-js"],
  },
};

export default nextConfig;
