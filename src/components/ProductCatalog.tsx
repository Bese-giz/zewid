"use client";

import { useState } from "react";
import { isProductPurchasable, productCategories, type Product, type ProductCategory } from "@/data/products";
import ProductCard from "./ProductCard";

export default function ProductCatalog({ products, initialCategory = "all", initialSearch = "" }: { products: Product[]; initialCategory?: ProductCategory | "all"; initialSearch?: string }) {
  const [category, setCategory] = useState<ProductCategory | "all">(initialCategory);
  const [search, setSearch] = useState(initialSearch);
  const [availableOnly, setAvailableOnly] = useState(false);
  const query = search.trim().toLocaleLowerCase();
  const filtered = products.filter(product =>
    (category === "all" || product.category === category) &&
    (!availableOnly || isProductPurchasable(product)) &&
    (!query || [product.name, product.shortDescription, product.slug.replaceAll("-", " "), ...product.features].join(" ").toLocaleLowerCase().includes(query)));
  const clear = () => { setCategory("all"); setSearch(""); setAvailableOnly(false); };

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-[#e5e9e2] bg-[#fafbf8] p-3 md:p-4">
        <div className="grid gap-2 md:grid-cols-[minmax(0,1fr)_minmax(14rem,20rem)]">
          <div className="relative">
            <label htmlFor="product-search" className="sr-only">Search products</label>
            <svg className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 4 4" /></svg>
            <input id="product-search" type="search" value={search} onChange={event => setSearch(event.target.value)}
              placeholder="Search products…" className="min-h-11 w-full rounded-lg border border-[#dfe4dc] bg-white py-2.5 pl-9 pr-3 text-sm text-gray-900" />
          </div>
          <div className="relative">
            <label htmlFor="product-category" className="sr-only">Product category</label>
            <select id="product-category" value={category} onChange={event => setCategory(event.target.value as ProductCategory | "all")}
              className="min-h-11 w-full appearance-none rounded-lg border border-[#dfe4dc] bg-white py-2.5 pl-3 pr-9 text-sm text-gray-800">
              <option value="all">All categories ({products.length})</option>
              {productCategories.map(option => <option key={option.id} value={option.id}>{option.name} ({products.filter(product => product.category === option.id).length})</option>)}
            </select>
            <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
          <label className="flex w-fit items-center gap-2 text-xs text-gray-700">
            <input type="checkbox" checked={availableOnly} onChange={event => setAvailableOnly(event.target.checked)} className="h-4 w-4 accent-green-700" />Available to order
          </label>
          <p role="status" className="text-xs text-slate-500">{filtered.length} of {products.length} products</p>
        </div>
      </div>
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
