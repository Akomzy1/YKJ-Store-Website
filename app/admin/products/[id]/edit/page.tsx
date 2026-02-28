"use client";

// ─── Admin: Edit Product — /admin/products/[id]/edit ─────────────────────────
// Client Component — pre-populates the form with existing product data.

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, CheckCircle2, Trash2 } from "lucide-react";
import { createBrowserClient } from "@supabase/ssr";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const CATEGORY_OPTIONS = [
  { id: "10000000-0000-0000-0000-000000000001", name: "Meat" },
  { id: "10000000-0000-0000-0000-000000000002", name: "Fish & Seafood" },
  { id: "10000000-0000-0000-0000-000000000003", name: "Vegetables" },
  { id: "10000000-0000-0000-0000-000000000004", name: "Grains & Flour" },
  { id: "10000000-0000-0000-0000-000000000005", name: "Spices & Seasonings" },
  { id: "10000000-0000-0000-0000-000000000006", name: "Canned & Packets" },
  { id: "10000000-0000-0000-0000-000000000007", name: "Cooking Oil" },
  { id: "10000000-0000-0000-0000-000000000008", name: "Drinks" },
  { id: "10000000-0000-0000-0000-000000000009", name: "Frozen Foods" },
  { id: "10000000-0000-0000-0000-000000000010", name: "Sauces & Paste" },
  { id: "10000000-0000-0000-0000-000000000011", name: "Snacks" },
  { id: "10000000-0000-0000-0000-000000000012", name: "Beauty & Household" },
];

const WEIGHT_UNITS = ["g", "kg", "ml", "L", "each", "pack"];
const ORIGINS = [
  "nigerian", "ghanaian", "jamaican", "cameroonian",
  "south-african", "zimbabwean", "congolese", "pan-african",
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ProductRow = Record<string, any>;

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;

  const [product, setProduct]   = useState<ProductRow | null>(null);
  const [fetching, setFetching] = useState(true);

  // Form state mirrors the product fields
  const [name, setName]           = useState("");
  const [slug, setSlug]           = useState("");
  const [description, setDesc]    = useState("");
  const [price, setPrice]         = useState("");
  const [salePrice, setSalePrice] = useState("");
  const [categoryId, setCatId]    = useState(CATEGORY_OPTIONS[0].id);
  const [origin, setOrigin]       = useState("");
  const [brand, setBrand]         = useState("");
  const [stockQty, setStock]      = useState("");
  const [weight, setWeight]       = useState("");
  const [unit, setUnit]           = useState("g");
  const [isFeatured, setFeatured] = useState(false);
  const [isDeal, setDeal]         = useState(false);
  const [isHalal, setHalal]       = useState(true);
  const [isVegan, setVegan]       = useState(false);

  const [loading, setLoading]   = useState(false);
  const [success, setSuccess]   = useState(false);
  const [error, setError]       = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("products")
        .select("*")
        .eq("id", productId)
        .single();

      if (!data) { setFetching(false); return; }

      setProduct(data);
      setName(data.name ?? "");
      setSlug(data.slug ?? "");
      setDesc(data.description ?? "");
      setPrice(String(data.price ?? ""));
      setSalePrice(data.sale_price !== null ? String(data.sale_price) : "");
      setCatId(data.category_id ?? CATEGORY_OPTIONS[0].id);
      setOrigin(data.origin ?? "");
      setBrand(data.brand ?? "");
      setStock(String(data.stock_qty ?? 0));
      setWeight(data.weight !== null ? String(data.weight) : "");
      setUnit(data.unit ?? "g");
      setFeatured(Boolean(data.is_featured));
      setDeal(Boolean(data.is_deal));
      setHalal(Boolean(data.is_halal));
      setVegan(Boolean(data.is_vegan));
      setFetching(false);
    }
    load();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const catOption = CATEGORY_OPTIONS.find((c) => c.id === categoryId);

    const { error: updateError } = await supabase
      .from("products")
      .update({
        name,
        slug,
        description,
        price:       parseFloat(price),
        sale_price:  salePrice ? parseFloat(salePrice) : null,
        category_id: categoryId,
        category:    catOption?.name ?? "",
        origin:      origin || null,
        brand:       brand  || null,
        stock_qty:   parseInt(stockQty) || 0,
        weight:      weight ? parseFloat(weight) : null,
        unit:        unit || null,
        is_featured: isFeatured,
        is_deal:     isDeal,
        is_halal:    isHalal,
        is_vegan:    isVegan,
      })
      .eq("id", productId);

    setLoading(false);

    if (updateError) { setError(updateError.message); return; }

    setSuccess(true);
    setTimeout(() => router.push("/admin/products"), 1500);
  }

  async function handleDelete() {
    if (!confirmDelete) { setConfirmDelete(true); return; }
    setDeleting(true);
    await supabase.from("products").delete().eq("id", productId);
    router.push("/admin/products");
  }

  if (fetching) {
    return (
      <div className="p-8 flex items-center gap-2 text-gray-400">
        <Loader2 className="h-5 w-5 animate-spin" /> Loading product…
      </div>
    );
  }

  if (!product) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500">Product not found.</p>
        <Link href="/admin/products" className="mt-3 inline-block text-sm text-[#A0522D] hover:underline">
          ← Back to products
        </Link>
      </div>
    );
  }

  if (success) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-96">
        <CheckCircle2 className="h-14 w-14 text-green-500 mb-4" />
        <h2 className="font-bold text-xl text-gray-900">Product updated!</h2>
        <p className="text-sm text-gray-500 mt-1">Redirecting…</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-2xl">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <Link href="/admin/products" className="text-gray-400 hover:text-gray-700 transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="font-bold text-2xl text-gray-900">Edit Product</h1>
          <p className="text-sm text-gray-500 mt-0.5 truncate">{product.name}</p>
        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <Label htmlFor="name">Product name *</Label>
            <Input id="name" required value={name} onChange={(e) => setName(e.target.value)} className="mt-1" />
          </div>
          <div>
            <Label htmlFor="slug">Slug *</Label>
            <Input id="slug" required value={slug} onChange={(e) => setSlug(e.target.value)} className="mt-1 font-mono text-xs" />
          </div>
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <textarea
            id="description"
            rows={3}
            value={description}
            onChange={(e) => setDesc(e.target.value)}
            className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-5">
          <div>
            <Label htmlFor="price">Price (£) *</Label>
            <Input id="price" type="number" step="0.01" min="0" required value={price} onChange={(e) => setPrice(e.target.value)} className="mt-1" />
          </div>
          <div>
            <Label htmlFor="sale-price">Sale price (£)</Label>
            <Input id="sale-price" type="number" step="0.01" min="0" value={salePrice} onChange={(e) => setSalePrice(e.target.value)} className="mt-1" placeholder="Leave blank if none" />
          </div>
        </div>

        <div>
          <Label htmlFor="category">Category *</Label>
          <select id="category" required value={categoryId} onChange={(e) => setCatId(e.target.value)}
            className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            {CATEGORY_OPTIONS.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-5">
          <div>
            <Label htmlFor="origin">Origin</Label>
            <select id="origin" value={origin} onChange={(e) => setOrigin(e.target.value)}
              className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              <option value="">None</option>
              {ORIGINS.map((o) => (
                <option key={o} value={o}>{o.charAt(0).toUpperCase() + o.slice(1).replace("-", " ")}</option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="brand">Brand</Label>
            <Input id="brand" value={brand} onChange={(e) => setBrand(e.target.value)} className="mt-1" />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-5">
          <div>
            <Label htmlFor="stock">Stock qty *</Label>
            <Input id="stock" type="number" min="0" required value={stockQty} onChange={(e) => setStock(e.target.value)} className="mt-1" />
          </div>
          <div>
            <Label htmlFor="weight">Weight</Label>
            <Input id="weight" type="number" step="0.001" min="0" value={weight} onChange={(e) => setWeight(e.target.value)} className="mt-1" />
          </div>
          <div>
            <Label htmlFor="unit">Unit</Label>
            <select id="unit" value={unit} onChange={(e) => setUnit(e.target.value)}
              className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              {WEIGHT_UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>
        </div>

        <div className="bg-gray-50 rounded-xl p-4 space-y-3">
          <p className="text-sm font-semibold text-gray-700 mb-2">Product flags</p>
          {[
            { id: "featured", label: "Featured", value: isFeatured, set: setFeatured },
            { id: "deal",     label: "Deal",      value: isDeal,     set: setDeal     },
            { id: "halal",    label: "Halal",     value: isHalal,    set: setHalal    },
            { id: "vegan",    label: "Vegan",     value: isVegan,    set: setVegan    },
          ].map(({ id, label, value, set }) => (
            <label key={id} htmlFor={id} className="flex items-center gap-3 cursor-pointer">
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

        <Button
          type="submit"
          disabled={loading}
          className="w-full h-11 bg-[#A0522D] hover:bg-[#7B3F1A] text-white font-semibold"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Changes"}
        </Button>
      </form>

      {/* Delete zone */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <p className="text-sm font-semibold text-gray-700 mb-3">Danger zone</p>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 font-semibold text-sm transition-colors disabled:opacity-50"
        >
          {deleting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Trash2 className="h-4 w-4" />
          )}
          {confirmDelete ? "Click again to confirm deletion" : "Delete Product"}
        </button>
      </div>
    </div>
  );
}
