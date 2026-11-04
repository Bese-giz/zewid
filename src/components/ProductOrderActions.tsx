"use client";

import { useState } from "react";
import { MAX_CART_QUANTITY, useCart } from "@/context/CartContext";
import { isProductPurchasable, type Product } from "@/data/products";
import { whatsappLink } from "@/lib/site";
import { cartLineKey, formatEuro } from "@/lib/pricing";
import MarketIcon from "./MarketIcon";
import { getProductDisplayName, getProductEnquiryMessage } from "@/lib/product-display";

export default function ProductOrderActions({ product, variantId }: { product: Product; variantId?: string }) {
  const [quantity, setQuantity] = useState(1);
  const { items, addToCart } = useCart();
  const available = isProductPurchasable(product);
  const existingQuantity = items.find((item) => cartLineKey(item) === cartLineKey({ slug: product.slug, variantId }))?.quantity ?? 0;
  const remainingQuantity = MAX_CART_QUANTITY - existingQuantity;
  const selectionQuantity = Math.min(quantity, remainingQuantity);
  const selectionTotal = available && selectionQuantity > 0 ? formatEuro(Math.round(product.priceEur * 100) * selectionQuantity) : null;
  const enquiry = variantId ? `Hi ZEWID! I'd like to ask about ${getProductDisplayName(product)} (${product.weight})${product.priceEur !== null ? ` at ${formatEuro(Math.round(product.priceEur * 100))}` : ""}, delivery and ordering.` : getProductEnquiryMessage(product, available);

  return (
    <div className="product-order-actions">
      {available && <div className="product-order-primary">
        {remainingQuantity > 0 && <div className="product-order-quantity">
          <span id={`quantity-label-${product.slug}`}>Quantity</span>
          <div role="group" aria-labelledby={`quantity-label-${product.slug}`}>
            <button type="button" aria-label={`Decrease quantity of ${product.name}`} disabled={selectionQuantity === 1}
              onClick={() => setQuantity(Math.max(1, selectionQuantity - 1))}>−</button>
            <output aria-live="polite">{selectionQuantity}</output>
            <button type="button" aria-label={`Increase quantity of ${product.name}`} disabled={selectionQuantity === remainingQuantity}
              onClick={() => setQuantity(Math.min(remainingQuantity, selectionQuantity + 1))}>+</button>
          </div>
        </div>}
        <button type="button" disabled={selectionQuantity === 0} onClick={() => addToCart(product.slug, selectionQuantity, variantId)} className="product-order-add">
          <span>{selectionQuantity === 0 ? "Maximum quantity in cart" : "Add to cart"}</span>
          {selectionTotal && <span className="product-order-add__total">{selectionTotal}</span>}
        </button>
      </div>}
      <a href={whatsappLink(enquiry)}
        target="_blank" rel="noopener noreferrer" className={`product-order-whatsapp${available ? "" : " product-order-whatsapp--primary"}`}>
        <MarketIcon name="whatsapp" size={19} />Ask on WhatsApp
      </a>
    </div>
  );
}
