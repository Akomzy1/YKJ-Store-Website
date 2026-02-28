// ─── Admin Products List — /admin/products ────────────────────────────────────
// Server Component. Lists all products with edit / delete links.

import Link from "next/link";
import { Plus, Edit2, Package } from "lucide-react";
import { getProducts } from "@/lib/supabase-queries";
import { formatPrice } from "@/lib/utils";

export const metadata = { title: "Products | YKJ Admin" };
export const revalidate = 60;

export default async function AdminProductsPage() {
  const products = await getProducts();

  return (
    <div className="p-8">
      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-bold text-2xl text-gray-900">Products</h1>
          <p className="text-sm text-gray-500 mt-1">{products.length} products in catalogue</p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 bg-[#A0522D] hover:bg-[#7B3F1A] text-white font-semibold text-sm px-4 py-2.5 rounded-xl transition-colors"
        >
          <Plus className="h-4 w-4" /> Add Product
        </Link>
      </div>

      {/* ── Table ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {products.length === 0 ? (
          <div className="py-20 text-center">
            <Package className="h-10 w-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm font-medium">No products yet.</p>
            <Link
              href="/admin/products/new"
              className="mt-3 inline-block text-sm text-[#A0522D] hover:underline font-medium"
            >
              Add your first product →
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Product
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Category
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Price
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Stock
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Flags
                  </th>
                  <th className="px-6 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50/50">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900 line-clamp-1">{p.name}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{p.slug}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{p.category}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-gray-900">{formatPrice(p.price)}</span>
                        {p.sale_price !== null && (
                          <span className="text-xs text-green-600">
                            Sale: {formatPrice(p.sale_price)}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`font-medium ${
                          p.stock_qty === 0
                            ? "text-red-500"
                            : p.stock_qty < 10
                            ? "text-yellow-600"
                            : "text-gray-700"
                        }`}
                      >
                        {p.stock_qty}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-1 flex-wrap">
                        {p.is_featured && (
                          <span className="bg-[#A0522D]/10 text-[#A0522D] text-[10px] font-bold px-2 py-0.5 rounded-full">
                            Featured
                          </span>
                        )}
                        {p.is_deal && (
                          <span className="bg-red-50 text-red-600 text-[10px] font-bold px-2 py-0.5 rounded-full">
                            Deal
                          </span>
                        )}
                        {p.is_halal && (
                          <span className="bg-green-50 text-green-600 text-[10px] font-bold px-2 py-0.5 rounded-full">
                            Halal
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        href={`/admin/products/${p.id}/edit`}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#A0522D] hover:underline"
                      >
                        <Edit2 className="h-3.5 w-3.5" /> Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
