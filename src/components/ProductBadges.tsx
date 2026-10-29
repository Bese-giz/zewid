import type { Product } from "@/data/products";
import { getProductDiscount } from "@/lib/product-display";

export default function ProductBadges({ product }: { product: Pick<Product, "availability" | "priceEur" | "compareAtPriceEur"> }) {
  const discount = getProductDiscount(product);
  const comingSoon = product.availability === "coming-soon";
  const unavailable = comingSoon || product.availability === "out-of-stock";
  return (
    <div aria-hidden="true" className="product-image-badges">
      {unavailable && <div className="product-ribbon-corner">
        <div className={`product-ribbon ${comingSoon ? "product-ribbon--soon" : "product-ribbon--unavailable"}`}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            {comingSoon ? <><circle cx="12" cy="12" r="8" /><path d="M12 7.5V12l3 2" /></> : <><rect x="4" y="6" width="16" height="14" rx="2" /><path d="M9 6V4h6v2M4 10h16m-7 5h-2" /></>}
          </svg>
          <span>{comingSoon ? "Coming soon" : "Out of stock"}</span>
        </div>
      </div>}
      {discount && <div className="product-sale-tag" aria-label={discount.label}>
        <div className="product-sale-tag__face">
          <span className="product-sale-tag__eyelet" />
          {discount.percentOff > 0 ? <>
            <span className="product-sale-tag__amount">{discount.percentOff}<small>%</small></span>
            <span className="product-sale-tag__caption">off</span>
          </> : <span className="product-sale-tag__caption">Sale</span>}
        </div>
      </div>}
    </div>
  );
}
