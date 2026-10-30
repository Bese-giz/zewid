import type { Product } from "@/data/products";
import { formatEuro } from "@/lib/pricing";
import { getProductDiscount } from "@/lib/product-display";

export default function ProductAvailability({ product, compact = false, showUnit = true }: { product: Pick<Product, "priceEur" | "compareAtPriceEur" | "weight">; compact?: boolean; showUnit?: boolean }) {
  const discount = getProductDiscount(product);
  return (
    <div className={compact ? "" : "space-y-1"}>
      {discount && <div className="mb-1 flex flex-wrap items-center gap-2 text-xs"><del className="text-slate-400"><span className="sr-only">Original price: </span>{formatEuro(discount.originalCents)}</del><span className="rounded bg-[#f8eee4] px-1.5 py-0.5 font-semibold text-[#915a29]">{discount.label}</span></div>}
      {product.priceEur === null ? <p className={compact ? "text-xs font-medium text-slate-500" : "text-lg font-medium text-slate-600"}>Price on request</p> : <div className={compact ? "flex flex-wrap items-baseline gap-x-1.5 gap-y-0.5" : ""}>
        <p className={compact ? "text-lg font-semibold leading-tight tracking-tight text-slate-900 md:text-xl" : "text-2xl font-semibold tracking-tight text-slate-900"}>
          {discount && <span className="sr-only">Sale price: </span>}{formatEuro(Math.round(product.priceEur * 100))}
          {!compact && showUnit && <span className="ml-2 text-sm font-normal text-slate-500">/ {product.weight}</span>}
        </p>
        <p className={compact ? "text-[10px] text-slate-500" : "mt-0.5 text-xs text-slate-400"}>incl. VAT</p>
      </div>}
    </div>
  );
}
