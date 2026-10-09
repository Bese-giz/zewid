"use client";

import { useState } from "react";
import { MAX_CART_QUANTITY, useCart } from "@/context/CartContext";
import type { Product } from "@/data/products";
import { whatsappLink } from "@/lib/site";

export default function ProductOrderActions({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const available = product.availability === "in-stock";

  return (
    <div className="space-y-4 rounded-2xl border border-gray-100 bg-gray-50 p-5">
      {available && (
        <div className="flex items-center justify-between gap-4">
          <span id={`quantity-label-${product.slug}`} className="text-sm font-semibold text-gray-900">Quantity ({product.weight})</span>
          <div role="group" aria-labelledby={`quantity-label-${product.slug}`} className="flex items-center overflow-hidden rounded-xl border border-gray-300 bg-white">
            <button type="button" aria-label={`Decrease quantity of ${product.name}`} disabled={quantity === 1}
              onClick={() => setQuantity((value) => Math.max(1, value - 1))}
              className="h-11 w-11 hover:bg-gray-100 disabled:opacity-40">−</button>
            <output aria-live="polite" className="min-w-10 text-center font-semibold">{quantity}</output>
            <button type="button" aria-label={`Increase quantity of ${product.name}`} disabled={quantity === MAX_CART_QUANTITY}
              onClick={() => setQuantity((value) => Math.min(MAX_CART_QUANTITY, value + 1))}
              className="h-11 w-11 hover:bg-gray-100 disabled:opacity-40">+</button>
          </div>
        </div>
      )}
      <button type="button" disabled={!available} onClick={() => addToCart(product.slug, quantity)}
        className="w-full rounded-xl bg-gray-900 px-6 py-4 font-bold text-white transition-colors hover:bg-black disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-600">
        {available ? "Add to Cart" : "Currently unavailable"}
      </button>
      <a href={whatsappLink(`Hi ZEWID! I'd like to ask about ${product.name}${available ? ", including its price" : " and when it will be available again"}.`)}
        target="_blank" rel="noopener noreferrer"
        className="block rounded-xl bg-green-100 px-6 py-3 text-center font-semibold text-green-800 transition-colors hover:bg-green-700 hover:text-white">
        Ask on WhatsApp
      </a>
      <p className="text-sm leading-relaxed text-gray-600">Add your products to the cart, then request the total on WhatsApp. We confirm prices and delivery charges before you confirm your order.</p>
    </div>
  );
}
