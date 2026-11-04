"use client";

import { useState } from "react";
import { getSelectedProduct, isProductPurchasable, type Product } from "@/data/products";
import { formatEuro } from "@/lib/pricing";
import ProductAvailability from "./ProductAvailability";
import ProductName from "./ProductName";
import ProductOrderActions from "./ProductOrderActions";
import ProductStatusTag from "./ProductStatusTag";
import ProductGallery from "./ProductGallery";
import { useInventory } from "@/context/InventoryContext";

export default function ProductPurchasePanel({ product }: { product: Product }) {
  const [variantId, setVariantId] = useState(product.defaultVariantId);
  const stock = useInventory();
  const base = getSelectedProduct(product, variantId) ?? product;
  const limit = stock.limit(product.slug, variantId);
  const selected = isProductPurchasable(base) && stock.ready && limit === 0 ? { ...base, availability: "out-of-stock" as const } : base;
  const available = isProductPurchasable(selected) && stock.ready;

  return <>
    <div className="product-detail-media">
      <ProductGallery key={selected.image} product={selected} />
    </div>
    <div className={`product-detail-summary${selected.priceEur === null ? " product-detail-summary--unpriced" : ""}`}>
      <div className="product-detail-identity">
        <h1><ProductName product={product} /></h1>
        <div className="product-detail-meta">
          <p className="product-detail-unit">{selected.weight}</p>
          {available ? <span className="product-detail-in-stock"><span aria-hidden="true" />Available to order</span> : selected.availability !== "in-stock" ? <div className="product-detail-status"><ProductStatusTag availability={selected.availability} compact /></div> : <span className="text-xs text-slate-500">{stock.error ? "Availability temporarily unavailable" : "Checking stock…"}</span>}
        </div>
      </div>
      <div className="product-detail-price" aria-live="polite" aria-atomic="true"><ProductAvailability product={selected} showUnit={false} /></div>
    </div>

    <div className="product-detail-order">
      {product.variants && <fieldset className="product-pack-options">
        <legend>Choose pack size</legend>
        <div className="product-pack-options__choices" style={{ gridTemplateColumns: `repeat(${product.variants.length}, minmax(0, 1fr))` }}>
          {product.variants.map(variant => <label key={variant.id} className={`product-pack-option${variant.priceEur === null ? " product-pack-option--unavailable" : ""}`}>
            <input type="radio" name={`pack-${product.slug}`} value={variant.id} checked={variantId === variant.id}
              disabled={variant.priceEur === null} onChange={() => setVariantId(variant.id)} />
            <span className="product-pack-option__body"><span>{variant.label}</span><span>{variant.priceEur === null ? "Unavailable" : formatEuro(Math.round(variant.priceEur * 100))}</span></span>
          </label>)}
        </div>
      </fieldset>}
      <ProductOrderActions product={selected} variantId={variantId} stockLimit={stock.ready ? limit : 0} />
    </div>
  </>;
}
