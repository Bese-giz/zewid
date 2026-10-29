import type { Product } from "@/data/products";
import { formatEuro } from "@/lib/pricing";
import { getProductDiscount } from "@/lib/product-display";

export default function ProductAvailability({ product, showStatus = true }: { product: Pick<Product, "availability" | "priceEur" | "compareAtPriceEur" | "weight">; showStatus?: boolean }) {
  const discount = getProductDiscount(product);
  return (
    <div className="mb-4 space-y-1 text-xs md:text-sm">
      <p className={showStatus ? product.availability === "in-stock" ? "font-semibold text-green-700" : "font-semibold text-amber-800" : "sr-only"}>
        {product.availability === "in-stock" ? "In stock" : product.availability === "coming-soon" ? "Coming soon" : "Out of stock"}
      </p>
      {discount && <p className="text-gray-500"><span className="sr-only">Original price: </span><del>{formatEuro(discount.originalCents)}</del></p>}
      <p className="text-gray-600">
        {discount && <span className="sr-only">Sale price: </span>}
        {product.priceEur === null ? "Price on request" : `${formatEuro(Math.round(product.priceEur * 100))} / ${product.weight} · incl. VAT`}
      </p>
    </div>
  );
}
