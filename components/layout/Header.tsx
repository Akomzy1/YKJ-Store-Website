"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, User, Heart, ShoppingBag, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCartStore, useWishlistStore } from "@/store/cartStore";

// ─── Static data ──────────────────────────────────────────────────────────────

const CATEGORIES = [
  { name: "Meat",             slug: "meat" },
  { name: "Fish & Seafood",   slug: "fish-seafood" },
  { name: "Vegetables",       slug: "vegetables" },
  { name: "Grains & Flour",   slug: "grains-flour" },
  { name: "Spices",           slug: "spices-seasonings" },
  { name: "Canned & Packets", slug: "canned-packets" },
  { name: "Cooking Oil",      slug: "cooking-oil" },
  { name: "Drinks",           slug: "drinks" },
  { name: "Frozen",           slug: "frozen-foods" },
  { name: "Sauces",           slug: "sauces-paste" },
  { name: "Snacks",           slug: "snacks" },
  { name: "Beauty",           slug: "beauty-household" },
];

const SEARCH_CATEGORIES = [
  { label: "All Categories", value: "" },
  ...CATEGORIES.map((c) => ({ label: c.name, value: c.slug })),
];

const NAV_LINKS = [
  { label: "Home",    href: "/" },
  { label: "Shop",    href: "/shop" },
  { label: "Deals",   href: "/deals" },
  { label: "About",   href: "/about" },
  { label: "Contact", href: "/contact" },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function Header() {
  const router = useRouter();

  const [scrolled,        setScrolled]        = useState(false);
  const [mobileMenuOpen,  setMobileMenuOpen]  = useState(false);
  const [searchQuery,     setSearchQuery]     = useState("");
  const [searchCategory,  setSearchCategory]  = useState("");
  const [mounted,         setMounted]         = useState(false);

  // Zustand selectors — reactive to specific slice of state
  const openDrawer   = useCartStore((s) => s.openDrawer);
  const itemCount    = useCartStore((s) =>
    s.items.reduce((sum, i) => sum + i.quantity, 0)
  );
  const wishlistCount = useWishlistStore((s) => s.productIds.length);

  useEffect(() => {
    setMounted(true);

    const handleScroll = () => setScrolled(window.scrollY > 8);
    const handleResize = () => {
      if (window.innerWidth >= 768) setMobileMenuOpen(false);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileMenuOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const params = new URLSearchParams({ q: searchQuery.trim() });
    if (searchCategory) params.set("category", searchCategory);
    router.push(`/shop?${params.toString()}`);
    setMobileMenuOpen(false);
  };

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <>
      {/* ── Sticky header shell ──────────────────────────────────────────── */}
      <header
        className={cn(
          "sticky top-0 z-50 bg-white/95 backdrop-blur-sm transition-shadow duration-200",
          scrolled && "shadow-md"
        )}
      >
        {/* ── Top row ─────────────────────────────────────────────────── */}
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 h-16">

            {/* Logo */}
            <Link
              href="/"
              className="shrink-0"
              aria-label="YKJ African and Caribbean Food Store — home"
            >
              <Image
                src="/assets/ykj-logo.jpg"
                alt="YKJ African and Caribbean Food Store"
                width={130}
                height={44}
                className="h-11 w-auto object-contain"
                priority
              />
            </Link>

            {/* Search bar — visible md+ */}
            <form
              onSubmit={handleSearch}
              className="hidden md:flex flex-1 max-w-2xl mx-auto items-stretch h-10 rounded-lg border border-border overflow-hidden focus-within:ring-2 focus-within:ring-brand-500 focus-within:border-brand-500 transition-all"
            >
              {/* Category dropdown (lg only — avoids crowding on tablets) */}
              <select
                value={searchCategory}
                onChange={(e) => setSearchCategory(e.target.value)}
                className="hidden lg:block shrink-0 border-r border-border bg-brand-50 px-3 text-sm text-foreground focus:outline-none cursor-pointer"
                aria-label="Filter search by category"
              >
                {SEARCH_CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>

              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products, brands, origins…"
                className="flex-1 px-4 py-2 text-sm bg-white focus:outline-none min-w-0"
                aria-label="Search products"
              />

              <button
                type="submit"
                className="shrink-0 px-4 bg-brand-500 hover:bg-brand-600 text-white transition-colors"
                aria-label="Submit search"
              >
                <Search size={17} />
              </button>
            </form>

            {/* Action icons */}
            <div className="flex items-center gap-0.5 ml-auto md:ml-0">

              {/* Mobile search icon */}
              <button
                className="md:hidden p-2.5 rounded-lg hover:bg-muted transition-colors"
                aria-label="Search"
                onClick={() => setMobileMenuOpen(true)}
              >
                <Search size={21} />
              </button>

              {/* Account — hidden on small mobile */}
              <Link
                href="/account"
                className="hidden sm:flex p-2.5 rounded-lg hover:bg-muted transition-colors"
                aria-label="My Account"
              >
                <User size={21} />
              </Link>

              {/* Wishlist — hidden on small mobile */}
              <Link
                href="/account"
                className="hidden sm:flex relative p-2.5 rounded-lg hover:bg-muted transition-colors"
                aria-label={`Wishlist — ${mounted ? wishlistCount : 0} saved items`}
              >
                <Heart
                  size={21}
                  className={
                    mounted && wishlistCount > 0
                      ? "text-brand-500 fill-brand-100"
                      : ""
                  }
                />
                {mounted && wishlistCount > 0 && (
                  <span className="absolute top-1 right-1 min-w-[16px] h-4 bg-gold-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center px-0.5 leading-none">
                    {wishlistCount > 9 ? "9+" : wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <button
                onClick={openDrawer}
                className="relative p-2.5 rounded-lg hover:bg-muted transition-colors"
                aria-label={`Shopping basket — ${mounted ? itemCount : 0} items`}
              >
                <ShoppingBag size={21} />
                {mounted && itemCount > 0 && (
                  <span className="absolute top-1 right-1 min-w-[16px] h-4 bg-brand-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center px-0.5 leading-none">
                    {itemCount > 9 ? "9+" : itemCount}
                  </span>
                )}
              </button>

              {/* Hamburger — mobile only */}
              <button
                onClick={() => setMobileMenuOpen((v) => !v)}
                className="md:hidden p-2.5 rounded-lg hover:bg-muted transition-colors"
                aria-label={mobileMenuOpen ? "Close navigation" : "Open navigation"}
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-menu"
              >
                {mobileMenuOpen ? <X size={21} /> : <Menu size={21} />}
              </button>
            </div>
          </div>
        </div>

        {/* ── Category nav (desktop) ───────────────────────────────────── */}
        <div className="hidden md:block border-t border-border">
          <div className="container mx-auto px-4">
            <nav
              className="flex overflow-x-auto scrollbar-hide py-1.5 gap-0.5"
              aria-label="Shop by category"
            >
              {CATEGORIES.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/shop/${cat.slug}`}
                  className="shrink-0 px-3.5 py-1.5 text-sm rounded-full whitespace-nowrap hover:bg-brand-50 hover:text-brand-600 transition-colors font-medium"
                >
                  {cat.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* ── Mobile full-screen drawer ────────────────────────────────────── */}
      {mobileMenuOpen && (
        <div
          id="mobile-menu"
          className="fixed inset-0 z-40 md:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closeMobileMenu}
            aria-hidden
          />

          {/* Drawer panel */}
          <nav className="absolute top-0 left-0 bottom-0 w-4/5 max-w-[320px] bg-white flex flex-col shadow-2xl overflow-hidden">

            {/* Drawer header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border shrink-0">
              <Image
                src="/assets/ykj-logo.jpg"
                alt="YKJ African and Caribbean Food Store"
                width={110}
                height={37}
                className="h-9 w-auto object-contain"
              />
              <button
                onClick={closeMobileMenu}
                className="p-2 rounded-lg hover:bg-muted transition-colors"
                aria-label="Close navigation"
              >
                <X size={19} />
              </button>
            </div>

            {/* Mobile search */}
            <div className="px-4 py-3 border-b border-border shrink-0">
              <form
                onSubmit={handleSearch}
                className="flex items-stretch rounded-lg border border-border overflow-hidden h-9 focus-within:ring-2 focus-within:ring-brand-500"
              >
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products…"
                  className="flex-1 px-3 text-sm focus:outline-none"
                  aria-label="Search products"
                />
                <button
                  type="submit"
                  className="px-3 bg-brand-500 text-white shrink-0"
                  aria-label="Search"
                >
                  <Search size={15} />
                </button>
              </form>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto">

              {/* Main nav links */}
              <div className="px-4 py-2 border-b border-border">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={closeMobileMenu}
                    className="flex items-center py-3 text-[15px] font-medium border-b border-border/40 last:border-0 hover:text-brand-600 transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              {/* Categories grid */}
              <div className="px-4 py-4">
                <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-3">
                  Shop by Category
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {CATEGORIES.map((cat) => (
                    <Link
                      key={cat.slug}
                      href={`/shop/${cat.slug}`}
                      onClick={closeMobileMenu}
                      className="py-2 px-3 text-sm rounded-lg bg-brand-50 hover:bg-brand-100 text-brand-700 font-medium transition-colors truncate"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom account link */}
            <div className="px-4 py-3 border-t border-border bg-muted/20 shrink-0">
              <Link
                href="/account"
                onClick={closeMobileMenu}
                className="flex items-center gap-2 text-sm font-medium hover:text-brand-600 transition-colors"
              >
                <User size={16} />
                My Account
              </Link>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
