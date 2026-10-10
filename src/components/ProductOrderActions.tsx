"use client";

import { useState } from "react";
import { MAX_CART_QUANTITY, useCart } from "@/context/CartContext";
import type { Product } from "@/data/products";
import { whatsappLink } from "@/lib/site";
import { calculateCart, formatEuro } from "@/lib/pricing";

export default function ProductOrderActions({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const { items, addToCart } = useCart();
  const available = product.availability === "in-stock";
  const existingQuantity = items.find((item) => item.slug === product.slug)?.quantity ?? 0;
  const remainingQuantity = MAX_CART_QUANTITY - existingQuantity;
  const selectionQuantity = Math.min(quantity, remainingQuantity);
  const preview = calculateCart([
    ...items.filter((item) => item.slug !== product.slug),
    { slug: product.slug, quantity: existingQuantity + selectionQuantity },
  ]).lines.find((line) => line.product.slug === product.slug);

  return (
    <div className="space-y-4 rounded-2xl border border-gray-100 bg-gray-50 p-5">
      {available && remainingQuantity > 0 && (
        <div className="flex items-center justify-between gap-4">
          <span id={`quantity-label-${product.slug}`} className="text-sm font-semibold text-gray-900">Quantity ({product.weight})</span>
          <div role="group" aria-labelledby={`quantity-label-${product.slug}`} className="flex items-center overflow-hidden rounded-xl border border-gray-300 bg-white">
            <button type="button" aria-label={`Decrease quantity of ${product.name}`} disabled={selectionQuantity === 1}
              onClick={() => setQuantity(Math.max(1, selectionQuantity - 1))}
              className="h-11 w-11 hover:bg-gray-100 disabled:opacity-40">−</button>
            <output aria-live="polite" className="min-w-10 text-center font-semibold">{selectionQuantity}</output>
            <button type="button" aria-label={`Increase quantity of ${product.name}`} disabled={selectionQuantity === remainingQuantity}
              onClick={() => setQuantity(Math.min(remainingQuantity, selectionQuantity + 1))}
              className="h-11 w-11 hover:bg-gray-100 disabled:opacity-40">+</button>
          </div>
        </div>
      )}
      {available && selectionQuantity > 0 && preview && (
        <div className="text-sm text-gray-700" aria-live="polite" aria-atomic="true">
          <p>{formatEuro(preview.unitPriceCents)} per {product.weight} · {formatEuro(preview.unitPriceCents * selectionQuantity)} for this selection</p>
          {preview.unitPriceCents < preview.regularUnitPriceCents && <p className="mt-1 font-semibold text-green-800">Your combined teff order qualifies for the bulk price.</p>}
        </div>
      )}
      <button type="button" disabled={!available || selectionQuantity === 0} onClick={() => addToCart(product.slug, selectionQuantity)}
        className="w-full rounded-xl bg-gray-900 px-6 py-4 font-bold text-white transition-colors hover:bg-black disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-600">
        {!available ? "Currently unavailable" : selectionQuantity === 0 ? "Maximum quantity in cart" : "Add to Cart"}
      </button>
      <a href={whatsappLink(`Hi ZEWID! I'd like to ask about ${product.name}${available ? ", delivery and ordering" : " and when it will be available again"}.`)}
        target="_blank" rel="noopener noreferrer"
        className="block rounded-xl bg-green-100 px-6 py-3 text-center font-semibold text-green-800 transition-colors hover:bg-green-700 hover:text-white">
        Ask on WhatsApp
      </a>
      <p className="text-sm leading-relaxed text-gray-600">Add your products to the cart to see your total, including delivery, then send your order on WhatsApp.</p>
    </div>
  );
}
