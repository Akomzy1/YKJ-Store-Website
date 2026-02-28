"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { X } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { MOCK_PRODUCTS, CATEGORIES } from "@/lib/mockData";

// ─── Static filter data ───────────────────────────────────────────────────────

const BRANDS = Array.from(
  new Set(MOCK_PRODUCTS.map((p) => p.brand).filter((b): b is string => b !== null))
);

const ORIGINS_LIST = [
  { flag: "🇳🇬", label: "Nigerian",      slug: "nigerian" },
  { flag: "🇬🇭", label: "Ghanaian",      slug: "ghanaian" },
  { flag: "🇯🇲", label: "Jamaican",      slug: "jamaican" },
  { flag: "🇨🇲", label: "Cameroonian",   slug: "cameroonian" },
  { flag: "🇿🇦", label: "South African", slug: "south-african" },
  { flag: "🇿🇼", label: "Zimbabwean",    slug: "zimbabwean" },
  { flag: "🇨🇩", label: "Congolese",     slug: "congolese" },
  { flag: "🌍", label: "Pan-African",   slug: "pan-african" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getArray(params: URLSearchParams, key: string): string[] {
  const val = params.get(key);
  return val ? val.split(",").filter(Boolean) : [];
}

function getBool(params: URLSearchParams, key: string): boolean {
  return params.get(key) === "1";
}

function computeActiveCount(params: URLSearchParams): number {
  return [
    ...getArray(params, "category"),
    ...getArray(params, "origin"),
    ...getArray(params, "brand"),
    params.get("minPrice") ? 1 : 0,
    params.get("maxPrice") ? 1 : 0,
    getBool(params, "halal") ? 1 : 0,
    getBool(params, "vegan") ? 1 : 0,
    getBool(params, "inStock") ? 1 : 0,
  ].filter(Boolean).length;
}

// ─── Count badge ──────────────────────────────────────────────────────────────

function CountBadge({ n }: { n: number }) {
  if (!n) return null;
  return (
    <span className="ml-1.5 inline-flex items-center justify-center h-4 min-w-4 px-1 rounded-full bg-brand-100 text-brand-700 text-[10px] font-bold leading-none">
      {n}
    </span>
  );
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface FilterContentProps {
  /** When set (on a category page), the Category accordion section is hidden */
  lockedCategorySlug?: string;
  /** Called after "Clear all" — lets a drawer close itself */
  onApply?: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function FilterContent({
  lockedCategorySlug,
  onApply,
}: FilterContentProps) {
  const searchParams = useSearchParams();
  const router       = useRouter();
  const pathname     = usePathname();

  // ── Price inputs use local state to avoid pushing on every keystroke ───────
  const [localMin, setLocalMin] = useState(searchParams.get("minPrice") ?? "");
  const [localMax, setLocalMax] = useState(searchParams.get("maxPrice") ?? "");

  // Keep local price state in sync when URL changes externally (e.g. clear all)
  useEffect(() => {
    setLocalMin(searchParams.get("minPrice") ?? "");
    setLocalMax(searchParams.get("maxPrice") ?? "");
  }, [searchParams]);

  // ── URL param helpers ──────────────────────────────────────────────────────

  function updateParams(updates: Record<string, string | string[] | null>) {
    const next = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(updates)) {
      if (
        value === null ||
        value === "" ||
        (Array.isArray(value) && value.length === 0)
      ) {
        next.delete(key);
      } else if (Array.isArray(value)) {
        next.set(key, value.join(","));
      } else {
        next.set(key, value);
      }
    }
    router.push(`${pathname}?${next.toString()}`, { scroll: false });
  }

  function toggleArray(key: string, item: string) {
    const current = getArray(searchParams, key);
    const next = current.includes(item)
      ? current.filter((i) => i !== item)
      : [...current, item];
    updateParams({ [key]: next });
  }

  function clearAll() {
    // Reset local price state too
    setLocalMin("");
    setLocalMax("");
    router.push(pathname, { scroll: false });
    onApply?.();
  }

  // ── Derived values ─────────────────────────────────────────────────────────

  const selectedCategories = getArray(searchParams, "category");
  const selectedOrigins    = getArray(searchParams, "origin");
  const selectedBrands     = getArray(searchParams, "brand");
  const halal              = getBool(searchParams, "halal");
  const vegan              = getBool(searchParams, "vegan");
  const inStock            = getBool(searchParams, "inStock");
  const activeCount        = computeActiveCount(searchParams);

  // Default open sections
  const defaultOpen = [
    !lockedCategorySlug && "category",
    "price",
    "origin",
    "dietary",
    "availability",
  ].filter(Boolean) as string[];

  return (
    <div>
      {/* ── Header ───────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-3 pb-3 border-b border-border">
        <div className="flex items-center gap-1.5">
          <span className="font-heading font-semibold text-sm">Filters</span>
          {activeCount > 0 && (
            <span className="inline-flex items-center justify-center h-5 min-w-5 px-1.5 rounded-full bg-brand-500 text-white text-[10px] font-bold leading-none">
              {activeCount}
            </span>
          )}
        </div>
        {activeCount > 0 && (
          <button
            onClick={clearAll}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive transition-colors"
          >
            <X size={11} />
            Clear all
          </button>
        )}
      </div>

      {/* ── Accordion filter groups ───────────────────────────────────── */}
      <Accordion type="multiple" defaultValue={defaultOpen}>

        {/* Category — hidden on category pages */}
        {!lockedCategorySlug && (
          <AccordionItem value="category">
            <AccordionTrigger className="py-3 text-sm font-medium hover:no-underline">
              <div className="flex items-center">
                Category
                <CountBadge n={selectedCategories.length} />
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-3 pt-1 space-y-2.5">
              {CATEGORIES.map((cat) => (
                <div key={cat.slug} className="flex items-center gap-2.5">
                  <Checkbox
                    id={`cat-${cat.slug}`}
                    checked={selectedCategories.includes(cat.slug)}
                    onCheckedChange={() => toggleArray("category", cat.slug)}
                  />
                  <Label
                    htmlFor={`cat-${cat.slug}`}
                    className="text-sm cursor-pointer leading-none"
                  >
                    {cat.name}
                    <span className="ml-1 text-muted-foreground text-xs">
                      ({cat.product_count})
                    </span>
                  </Label>
                </div>
              ))}
            </AccordionContent>
          </AccordionItem>
        )}

        {/* Price Range */}
        <AccordionItem value="price">
          <AccordionTrigger className="py-3 text-sm font-medium hover:no-underline">
            <div className="flex items-center">
              Price Range
              {(localMin || localMax) && (
                <span className="ml-1.5 text-brand-500 text-xs font-normal">
                  {localMin ? `£${localMin}` : ""}
                  {localMin && localMax ? "–" : ""}
                  {localMax ? `£${localMax}` : ""}
                </span>
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-3 pt-1">
            <div className="flex items-end gap-2">
              <div className="flex-1">
                <Label
                  htmlFor="min-price"
                  className="text-[11px] text-muted-foreground mb-1.5 block"
                >
                  Min (£)
                </Label>
                <input
                  id="min-price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={localMin}
                  onChange={(e) => setLocalMin(e.target.value)}
                  onBlur={() => updateParams({ minPrice: localMin || null })}
                  onKeyDown={(e) => {
                    if (e.key === "Enter")
                      updateParams({ minPrice: localMin || null });
                  }}
                  placeholder="0"
                  className="w-full px-2.5 py-1.5 text-sm border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-brand-400 bg-white"
                />
              </div>
              <span className="text-muted-foreground text-sm pb-1.5">–</span>
              <div className="flex-1">
                <Label
                  htmlFor="max-price"
                  className="text-[11px] text-muted-foreground mb-1.5 block"
                >
                  Max (£)
                </Label>
                <input
                  id="max-price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={localMax}
                  onChange={(e) => setLocalMax(e.target.value)}
                  onBlur={() => updateParams({ maxPrice: localMax || null })}
                  onKeyDown={(e) => {
                    if (e.key === "Enter")
                      updateParams({ maxPrice: localMax || null });
                  }}
                  placeholder="Any"
                  className="w-full px-2.5 py-1.5 text-sm border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-brand-400 bg-white"
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Origin */}
        <AccordionItem value="origin">
          <AccordionTrigger className="py-3 text-sm font-medium hover:no-underline">
            <div className="flex items-center">
              Origin
              <CountBadge n={selectedOrigins.length} />
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-3 pt-1 space-y-2.5">
            {ORIGINS_LIST.map((origin) => (
              <div key={origin.slug} className="flex items-center gap-2.5">
                <Checkbox
                  id={`origin-${origin.slug}`}
                  checked={selectedOrigins.includes(origin.slug)}
                  onCheckedChange={() => toggleArray("origin", origin.slug)}
                />
                <Label
                  htmlFor={`origin-${origin.slug}`}
                  className="text-sm cursor-pointer leading-none flex items-center gap-1.5"
                >
                  <span aria-hidden>{origin.flag}</span>
                  {origin.label}
                </Label>
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>

        {/* Brand */}
        <AccordionItem value="brand">
          <AccordionTrigger className="py-3 text-sm font-medium hover:no-underline">
            <div className="flex items-center">
              Brand
              <CountBadge n={selectedBrands.length} />
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-3 pt-1 space-y-2.5">
            {BRANDS.map((brand) => (
              <div key={brand} className="flex items-center gap-2.5">
                <Checkbox
                  id={`brand-${brand}`}
                  checked={selectedBrands.includes(brand)}
                  onCheckedChange={() => toggleArray("brand", brand)}
                />
                <Label
                  htmlFor={`brand-${brand}`}
                  className="text-sm cursor-pointer leading-none"
                >
                  {brand}
                </Label>
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>

        {/* Dietary */}
        <AccordionItem value="dietary">
          <AccordionTrigger className="py-3 text-sm font-medium hover:no-underline">
            <div className="flex items-center">
              Dietary
              <CountBadge n={(halal ? 1 : 0) + (vegan ? 1 : 0)} />
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-3 pt-1 space-y-2.5">
            <div className="flex items-center gap-2.5">
              <Checkbox
                id="filter-halal"
                checked={halal}
                onCheckedChange={(checked) =>
                  updateParams({ halal: checked ? "1" : null })
                }
              />
              <Label
                htmlFor="filter-halal"
                className="text-sm cursor-pointer leading-none"
              >
                🥩 Halal certified
              </Label>
            </div>
            <div className="flex items-center gap-2.5">
              <Checkbox
                id="filter-vegan"
                checked={vegan}
                onCheckedChange={(checked) =>
                  updateParams({ vegan: checked ? "1" : null })
                }
              />
              <Label
                htmlFor="filter-vegan"
                className="text-sm cursor-pointer leading-none"
              >
                🌿 Vegan
              </Label>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Availability */}
        <AccordionItem value="availability" className="border-b-0">
          <AccordionTrigger className="py-3 text-sm font-medium hover:no-underline">
            Availability
          </AccordionTrigger>
          <AccordionContent className="pb-3 pt-1">
            <div className="flex items-center gap-2.5">
              <Checkbox
                id="filter-instock"
                checked={inStock}
                onCheckedChange={(checked) =>
                  updateParams({ inStock: checked ? "1" : null })
                }
              />
              <Label
                htmlFor="filter-instock"
                className="text-sm cursor-pointer leading-none"
              >
                In stock only
              </Label>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

// ─── Exported helper for other components to compute badge count ──────────────
export { computeActiveCount };
