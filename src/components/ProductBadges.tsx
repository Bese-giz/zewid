import type { Product } from "@/data/products";
import { getProductDiscount } from "@/lib/product-display";

export default function ProductBadges({ product }: { product: Pick<Product, "availability" | "priceEur" | "compareAtPriceEur"> }) {
  const discount = getProductDiscount(product);
  const badgeClass = "rounded-full px-3 py-1.5 text-[10px] font-bold leading-tight shadow-sm ring-1 ring-inset md:text-xs";
  return (
    <div aria-hidden="true" className="pointer-events-none absolute left-3 top-3 z-10 flex flex-col items-start gap-2 md:left-4 md:top-4">
      {product.availability === "coming-soon" && <span className={`${badgeClass} bg-amber-100 text-amber-950 ring-amber-300`}>Coming soon</span>}
      {product.availability === "out-of-stock" && <span className={`${badgeClass} bg-slate-900 text-white ring-slate-700`}>Out of stock</span>}
      {discount && <span className={`${badgeClass} bg-green-700 text-white ring-green-800`}>{discount.label}</span>}
    </div>
  );
}
