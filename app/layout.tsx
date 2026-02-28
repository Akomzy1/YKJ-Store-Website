import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CartDrawer from "@/components/cart/CartDrawer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: {
    default: "YKJ African & Caribbean Food Store | Authentic Groceries UK",
    template: "%s | YKJ African & Caribbean Food Store",
  },
  description:
    "Shop authentic African and Caribbean groceries online. Fresh, quality produce delivered fast across the UK. Taste of Home, Delivered to Your Door.",
  keywords: [
    "African groceries UK",
    "Caribbean food online",
    "African food store",
    "authentic African products",
    "Caribbean groceries delivery",
    "YKJ food store",
  ],
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://ykjfoodstore.co.uk"
  ),
  openGraph: {
    type: "website",
    locale: "en_GB",
    siteName: "YKJ African and Caribbean Food Store",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-GB" className={`${inter.variable} ${playfairDisplay.variable}`}>
      <body className="antialiased font-body bg-background text-foreground">
        <AnnouncementBar />
        <Header />
        <CartDrawer />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
