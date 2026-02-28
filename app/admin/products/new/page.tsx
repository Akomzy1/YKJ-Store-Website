"use client";

// ─── Admin: Add New Product — /admin/products/new ─────────────────────────────
// Client Component — form to create a product via Supabase.

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, CheckCircle2 } from "lucide-react";
import { createBrowserClient } from "@supabase/ssr";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// ─── Category options (kept in sync with seed.sql) ────────────────────────────

const CATEGORY_OPTIONS = [
  { id: "10000000-0000-0000-0000-000000000001", name: "Meat",                slug: "Meat" },
  { id: "10000000-0000-0000-0000-000000000002", name: "Fish & Seafood",      slug: "Fish & Seafood" },
  { id: "10000000-0000-0000-0000-000000000003", name: "Vegetables",          slug: "Vegetables" },
  { id: "10000000-0000-0000-0000-000000000004", name: "Grains & Flour",      slug: "Grains & Flour" },
  { id: "10000000-0000-0000-0000-000000000005", name: "Spices & Seasonings", slug: "Spices & Seasonings" },
  { id: "10000000-0000-0000-0000-000000000006", name: "Canned & Packets",    slug: "Canned & Packets" },
  { id: "10000000-0000-0000-0000-000000000007", name: "Cooking Oil",         slug: "Cooking Oil" },
  { id: "10000000-0000-0000-0000-000000000008", name: "Drinks",              slug: "Drinks" },
  { id: "10000000-0000-0000-0000-000000000009", name: "Frozen Foods",        slug: "Frozen Foods" },
  { id: "10000000-0000-0000-0000-000000000010", name: "Sauces & Paste",      slug: "Sauces & Paste" },
  { id: "10000000-0000-0000-0000-000000000011", name: "Snacks",              slug: "Snacks" },
  { id: "10000000-0000-0000-0000-000000000012", name: "Beauty & Household",  slug: "Beauty & Household" },
];

const WEIGHT_UNITS = ["g", "kg", "ml", "L", "each", "pack"];
const ORIGINS = [
  "nigerian", "ghanaian", "jamaican", "cameroonian",
  "south-african", "zimbabwean", "congolese", "pan-african",
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function NewProductPage() {
  const router = useRouter();

  const [name, setName]         = useState("");
  const [slug, setSlug]         = useState("");
  const [description, setDesc]  = useState("");
  const [price, setPrice]       = useState("");
  const [salePrice, setSalePrice] = useState("");
  const [categoryId, setCatId]  = useState(CATEGORY_OPTIONS[0].id);
  const [origin, setOrigin]     = useState("");
  const [brand, setBrand]       = useState("");
  const [stockQty, setStock]    = useState("");
  const [weight, setWeight]     = useState("");
  const [unit, setUnit]         = useState("g");
  const [isFeatured, setFeatured] = useState(false);
  const [isDeal, setDeal]       = useState(false);
  const [isHalal, setHalal]     = useState(true);
  const [isVegan, setVegan]     = useState(false);

  const [loading, setLoading]   = useState(false);
  const [success, setSuccess]   = useState(false);
  const [error, setError]       = useState<string | null>(null);

  // Auto-generate slug from name
  function handleNameChange(v: string) {
    setName(v);
    if (!slug || slug === toSlug(name)) {
      setSlug(toSlug(v));
    }
  }

  function toSlug(s: string) {
    return s
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const catOption = CATEGORY_OPTIONS.find((c) => c.id === categoryId);

    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { error: insertError } = await supabase.from("products").insert({
      name,
      slug,
      description,
      price:       parseFloat(price),
      sale_price:  salePrice ? parseFloat(salePrice) : null,
      category_id: categoryId,
      category:    catOption?.name ?? "",
      origin:      origin || null,
      brand:       brand || null,
      images:      [],
      stock_qty:   parseInt(stockQty) || 0,
      weight:      weight ? parseFloat(weight) : null,
      unit:        unit || null,
      is_featured: isFeatured,
      is_deal:     isDeal,
      is_halal:    isHalal,
      is_vegan:    isVegan,
    });

    setLoading(false);

    if (insertError) {
      setError(insertError.message);
      return;
    }

    setSuccess(true);
    setTimeout(() => router.push("/admin/products"), 1500);
  }

  if (success) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-96">
        <CheckCircle2 className="h-14 w-14 text-green-500 mb-4" />
        <h2 className="font-bold text-xl text-gray-900">Product created!</h2>
        <p className="text-sm text-gray-500 mt-1">Redirecting to product list…</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-2xl">
      {/* ── Header ── */}
      <div className="flex items-center gap-3 mb-8">
        <Link
          href="/admin/products"
          className="text-gray-400 hover:text-gray-700 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="font-bold text-2xl text-gray-900">Add New Product</h1>
          <p className="text-sm text-gray-500 mt-0.5">Fill in the details below.</p>
        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Name + slug */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <Label htmlFor="name">Product name *</Label>
            <Input
              id="name"
              required
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              className="mt-1"
              placeholder="e.g. Fresh Goat Meat"
            />
          </div>
          <div>
            <Label htmlFor="slug">Slug *</Label>
            <Input
              id="slug"
              required
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="mt-1 font-mono text-xs"
              placeholder="fresh-goat-meat"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <Label htmlFor="description">Description</Label>
          <textarea
            id="description"
            rows={3}
            value={description}
            onChange={(e) => setDesc(e.target.value)}
            className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
            placeholder="Product description…"
          />
        </div>

        {/* Price + sale price */}
        <div className="grid grid-cols-2 gap-5">
          <div>
            <Label htmlFor="price">Price (£) *</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              min="0"
              required
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="mt-1"
              placeholder="0.00"
            />
          </div>
          <div>
            <Label htmlFor="sale-price">Sale price (£)</Label>
            <Input
              id="sale-price"
              type="number"
              step="0.01"
              min="0"
              value={salePrice}
              onChange={(e) => setSalePrice(e.target.value)}
              className="mt-1"
              placeholder="Leave blank if none"
            />
          </div>
        </div>

        {/* Category */}
        <div>
          <Label htmlFor="category">Category *</Label>
          <select
            id="category"
            required
            value={categoryId}
            onChange={(e) => setCatId(e.target.value)}
            className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {CATEGORY_OPTIONS.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Origin + brand */}
        <div className="grid grid-cols-2 gap-5">
          <div>
            <Label htmlFor="origin">Origin</Label>
            <select
              id="origin"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="">None</option>
              {ORIGINS.map((o) => (
                <option key={o} value={o}>
                  {o.charAt(0).toUpperCase() + o.slice(1).replace("-", " ")}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="brand">Brand</Label>
            <Input
              id="brand"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              className="mt-1"
              placeholder="e.g. Tropiway"
            />
          </div>
        </div>

        {/* Stock + weight + unit */}
        <div className="grid grid-cols-3 gap-5">
          <div>
            <Label htmlFor="stock">Stock qty *</Label>
            <Input
              id="stock"
              type="number"
              min="0"
              required
              value={stockQty}
              onChange={(e) => setStock(e.target.value)}
              className="mt-1"
              placeholder="0"
            />
          </div>
          <div>
            <Label htmlFor="weight">Weight</Label>
            <Input
              id="weight"
              type="number"
              step="0.001"
              min="0"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="mt-1"
              placeholder="e.g. 500"
            />
          </div>
          <div>
            <Label htmlFor="unit">Unit</Label>
            <select
              id="unit"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {WEIGHT_UNITS.map((u) => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Flags */}
        <div className="bg-gray-50 rounded-xl p-4 space-y-3">
          <p className="text-sm font-semibold text-gray-700 mb-2">Product flags</p>
          {[
            { id: "featured", label: "Featured", value: isFeatured, set: setFeatured },
            { id: "deal",     label: "Deal",      value: isDeal,     set: setDeal     },
            { id: "halal",    label: "Halal",     value: isHalal,    set: setHalal    },
            { id: "vegan",    label: "Vegan",     value: isVegan,    set: setVegan    },
          ].map(({ id, label, value, set }) => (
            <label
              key={id}
              htmlFor={id}
              className="flex items-center gap-3 cursor-pointer"
            >
              <input
                id={id}
                type="checkbox"
                checked={value}
                onChange={(e) => set(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-[#A0522D] focus:ring-[#A0522D]"
              />
              <span className="text-sm text-gray-700">{label}</span>
            </label>
          ))}
        </div>

        {/* Submit */}
        <Button
          type="submit"
          disabled={loading}
          className="w-full h-11 bg-[#A0522D] hover:bg-[#7B3F1A] text-white font-semibold"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create Product"}
        </Button>
      </form>
    </div>
  );
}
