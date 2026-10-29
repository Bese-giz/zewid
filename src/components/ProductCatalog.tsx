"use client";

import { useState } from "react";
import { isProductPurchasable, productCategories, type Product, type ProductCategory } from "@/data/products";
import ProductCard from "./ProductCard";

export default function ProductCatalog({ products }: { products: Product[] }) {
  const [category, setCategory] = useState<ProductCategory | "all">("all");
  const [search, setSearch] = useState("");
  const [availableOnly, setAvailableOnly] = useState(false);
  const query = search.trim().toLocaleLowerCase();
  const filtered = products.filter(product =>
    (category === "all" || product.category === category) &&
    (!availableOnly || isProductPurchasable(product)) &&
    (!query || [product.name, product.shortDescription, product.slug.replaceAll("-", " "), ...product.features].join(" ").toLocaleLowerCase().includes(query)));
  const clear = () => { setCategory("all"); setSearch(""); setAvailableOnly(false); };

  return (
    <div className="space-y-6">
      <div className="space-y-4 rounded-2xl border border-green-100 bg-green-50/50 p-4 md:p-6">
        <label htmlFor="product-search" className="block text-sm font-semibold text-gray-900">Find a product</label>
        <input id="product-search" type="search" value={search} onChange={event => setSearch(event.target.value)}
          placeholder="Search teff, coffee sets, injera makers…" className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 md:max-w-xl" />
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter products by category">
          {([{ id: "all", name: "All products" }, ...productCategories] as const).map(option => (
            <button key={option.id} type="button" onClick={() => setCategory(option.id)} aria-pressed={category === option.id}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${category === option.id ? "border-green-700 bg-green-700 text-white" : "border-gray-200 bg-white text-gray-700 hover:border-green-700"}`}>
              {option.name} <span className={category === option.id ? "text-green-100" : "text-gray-500"}>({products.filter(product => option.id === "all" || product.category === option.id).length})</span>
            </button>
          ))}
        </div>
        <label className="flex w-fit items-center gap-2 text-sm text-gray-700">
          <input type="checkbox" checked={availableOnly} onChange={event => setAvailableOnly(event.target.checked)} className="h-4 w-4 accent-green-700" />Available to order
        </label>
      </div>
      <p role="status" className="text-sm text-gray-600">Showing {filtered.length} of {products.length} products</p>
      {filtered.length ? (
        <div className="grid grid-cols-2 gap-3 md:gap-8 lg:grid-cols-3">
          {filtered.map(product => <ProductCard key={product.slug} {...product} />)}
        </div>
      ) : (
        <div className="rounded-2xl border border-gray-200 p-10 text-center">
          <h2 className="font-semibold text-gray-900">No products match your selection</h2>
          <p className="mt-2 text-sm text-gray-600">Try another search or browse the full collection.</p>
          <button type="button" onClick={clear} className="mt-4 rounded-full bg-green-700 px-5 py-2.5 text-sm font-semibold text-white">Clear filters</button>
        </div>
      )}
    </div>
  );
}
