"use client";

import { useState } from "react";
import { MAX_CART_QUANTITY, useCart } from "@/context/CartContext";
import { isProductPurchasable, type Product } from "@/data/products";
import { whatsappLink } from "@/lib/site";
import { calculateCart, formatEuro } from "@/lib/pricing";
import MarketIcon from "./MarketIcon";
import { getProductDisplayName } from "@/lib/product-display";

export default function ProductOrderActions({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const { items, addToCart } = useCart();
  const available = isProductPurchasable(product);
  const existingQuantity = items.find((item) => item.slug === product.slug)?.quantity ?? 0;
  const remainingQuantity = MAX_CART_QUANTITY - existingQuantity;
  const selectionQuantity = Math.min(quantity, remainingQuantity);
  const preview = calculateCart([
    ...items.filter((item) => item.slug !== product.slug),
    { slug: product.slug, quantity: existingQuantity + selectionQuantity },
  ]).lines.find((line) => line.product.slug === product.slug);

  const selectionTotal = preview && selectionQuantity > 0 ? formatEuro(preview.unitPriceCents * selectionQuantity) : null;

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
        <button type="button" disabled={selectionQuantity === 0} onClick={() => addToCart(product.slug, selectionQuantity)} className="product-order-add">
          <span>{selectionQuantity === 0 ? "Maximum quantity in cart" : "Add to cart"}</span>
          {selectionTotal && <span className="product-order-add__total">{selectionTotal}</span>}
        </button>
      </div>}
      <a href={whatsappLink(`Hi ZEWID! I'd like to ask about ${getProductDisplayName(product)}${available ? ", delivery and ordering" : ", its price and when it will be available"}.`)}
        target="_blank" rel="noopener noreferrer" className={`product-order-whatsapp${available ? "" : " product-order-whatsapp--primary"}`}>
        <MarketIcon name="whatsapp" size={19} />Ask on WhatsApp
      </a>
    </div>
  );
}
