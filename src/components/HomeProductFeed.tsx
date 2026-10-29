"use client";

import { useEffect, useRef, useState } from "react";
import type { Product } from "@/data/products";
import ProductCard from "./ProductCard";

const BATCH_SIZE = 6;

export default function HomeProductFeed({ products }: { products: Product[] }) {
  const [visible, setVisible] = useState(BATCH_SIZE);
  const sentinel = useRef<HTMLDivElement>(null);
  const count = Math.min(visible, products.length);
  const hasMore = count < products.length;

  useEffect(() => {
    const element = sentinel.current;
    if (!hasMore || !element || !('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) {
        observer.disconnect();
        setVisible(current => Math.min(current + BATCH_SIZE, products.length));
      }
    }, { rootMargin: "480px 0px" });
    observer.observe(element);
    return () => observer.disconnect();
  }, [count, hasMore, products.length]);

  return (
    <div data-product-feed className="space-y-7">
      <div id="home-product-grid" className="grid grid-cols-2 gap-3 md:gap-6 lg:grid-cols-3">
        {products.slice(0, count).map(product => <ProductCard key={product.slug} {...product} />)}
      </div>
      <div ref={sentinel} className="flex min-h-16 flex-col items-center justify-center gap-3 text-center">
        <p role="status" className="text-xs text-slate-500">{count} of {products.length} products{hasMore ? " · More as you scroll" : " · You’ve seen the whole collection"}</p>
        {hasMore && <button type="button" onClick={() => setVisible(current => Math.min(current + BATCH_SIZE, products.length))} aria-controls="home-product-grid"
          className="rounded-full border border-[#dce3d9] bg-white px-6 py-2.5 text-sm font-medium text-green-900 transition-colors hover:bg-green-50">Show more products <span aria-hidden="true" className="ml-2">↓</span></button>}
      </div>
      <noscript><div className="space-y-2"><p>More from our collection:</p>{products.slice(BATCH_SIZE).map(product => <a key={product.slug} href={`/products/${product.slug}`} className="block text-sm text-green-800 underline">{product.name}</a>)}</div></noscript>
    </div>
  );
}
