"use client";

import { useEffect, useRef, useState } from "react";
import { MAX_CART_QUANTITY, useCart } from "@/context/CartContext";
import Image from "next/image";
import Link from "next/link";
import { formatEuro } from "@/lib/pricing";
import StripeCheckoutButton from "./StripeCheckoutButton";
import PickupPointSelector, { type SelectedPickupPoint } from "./PickupPointSelector";
import type { StripeMode } from "@/lib/stripe-mode";

export default function FloatingCart({ checkoutMode = null, pickupEnabled = false }: { checkoutMode?: StripeMode | null; pickupEnabled?: boolean }) {
  const { items, pricing, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, generateWhatsAppLink } = useCart();
  const [pickup, setPickup] = useState<SelectedPickupPoint | null>(null);

  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!isCartOpen || !dialog) return;
    const trigger = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = "hidden";

    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
      if (trigger?.isConnected) trigger.focus();
    };
  }, [isCartOpen]);

  return (
    <dialog
      ref={dialogRef}
      id="cart-dialog"
      aria-labelledby="cart-title"
      aria-describedby="cart-description"
      onCancel={(event) => {
        event.preventDefault();
        setIsCartOpen(false);
      }}
      onClose={(event) => {
        if (!event.currentTarget.open) setIsCartOpen(false);
      }}
      onClick={(event) => {
        if (event.target !== event.currentTarget) return;
        const bounds = event.currentTarget.getBoundingClientRect();
        if (event.clientX < bounds.left || event.clientX > bounds.right ||
            event.clientY < bounds.top || event.clientY > bounds.bottom) setIsCartOpen(false);
      }}
      className="fixed inset-y-0 left-auto right-0 m-0 h-dvh max-h-none w-full max-w-none bg-white p-0 text-gray-900 shadow-2xl open:flex flex-col sm:w-96 backdrop:bg-black/40 backdrop:backdrop-blur-sm"
    >
      <div className="p-5 border-b border-gray-100 flex items-center justify-between">
        <h2 id="cart-title" className="text-xl font-bold text-gray-900">Your Cart</h2>
        <button
          type="button"
          aria-label="Close cart"
          autoFocus
          onClick={() => setIsCartOpen(false)}
          className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <p id="cart-description" className="px-5 pt-4 text-sm text-gray-600">Review your products and total, then choose how to place your order.</p>
      <div className="min-h-0 flex-1 overflow-y-auto p-5">
        {items.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-500 space-y-6">
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-2">
              <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-bold text-gray-900 mb-1">Your cart is empty</h3>
              <p className="text-sm text-gray-500 max-w-[200px] mx-auto">Looks like you haven&apos;t added any products to your cart yet.</p>
            </div>
            <Link
              href="/products"
              onClick={() => setIsCartOpen(false)}
              className="mt-4 bg-green-50 text-green-700 hover:bg-green-100 hover:text-green-800 px-6 py-3 rounded-full font-bold text-sm transition-colors"
            >
              Explore Products
            </Link>
          </div>
        ) : (
          <ul className="space-y-6">
            {pricing.lines.map((line) => {
              const item = { ...line.product, quantity: line.quantity };
              return (
                <li key={item.slug} className="flex gap-4">
                  <div className="relative w-20 h-20 bg-gray-50 rounded-lg overflow-hidden shrink-0 border border-gray-100">
                    <Image src={item.image} alt={item.name} fill sizes="80px" className="object-contain p-2" />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900 leading-snug">{item.name}</h3>
                      <p className="text-xs text-green-700 font-medium uppercase mt-1">{item.weight}</p>
                      <p className="mt-1 text-sm text-gray-700">{formatEuro(line.unitPriceCents)} each · <span className="font-semibold">{formatEuro(line.lineTotalCents)}</span></p>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-gray-200 rounded-lg bg-white overflow-hidden shadow-sm">
                        <button
                          type="button"
                          aria-label={`Decrease quantity of ${item.name}`}
                          onClick={() => updateQuantity(item.slug, item.quantity - 1)}
                          className="w-11 h-11 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-40"
                        >
                          -
                        </button>
                        <output aria-live="polite" className="min-w-8 text-center text-sm font-medium text-gray-900">{item.quantity}</output>
                        <button
                          type="button"
                          aria-label={`Increase quantity of ${item.name}`}
                          disabled={item.quantity >= MAX_CART_QUANTITY}
                          onClick={() => updateQuantity(item.slug, item.quantity + 1)}
                          className="w-11 h-11 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-40"
                        >
                          +
                        </button>
                      </div>
                      <button
                        type="button"
                        aria-label={`Remove ${item.name} from cart`}
                        onClick={() => removeFromCart(item.slug)}
                        className="text-xs text-red-500 hover:text-red-700 font-medium"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {items.length > 0 && (
        <div className="max-h-[65dvh] shrink-0 overflow-y-auto p-5 border-t border-gray-100 bg-gray-50">
          <div aria-live="polite" aria-atomic="true" className="mb-4 text-sm">
            <dl className="space-y-2">
              <div className="flex justify-between gap-4"><dt>Products</dt><dd>{formatEuro(pricing.subtotalCents)}</dd></div>
              <div className="flex justify-between gap-4"><dt>Delivery</dt><dd>{formatEuro(pricing.deliveryCents)}</dd></div>
              <div className="flex justify-between gap-4 border-t border-gray-200 pt-2 text-lg font-bold"><dt>Total</dt><dd>{formatEuro(pricing.totalCents)}</dd></div>
            </dl>
            <p className="mt-2 text-xs text-gray-600">Prices include VAT.</p>
          </div>
          {pickupEnabled && <PickupPointSelector value={pickup} onChange={setPickup} />}
          {checkoutMode && <StripeCheckoutButton sandbox={checkoutMode === "sandbox"} pickupEnabled={pickupEnabled} pickup={pickup?.selection ?? null} />}
          <a
            href={generateWhatsAppLink(pickupEnabled ? pickup?.point : undefined)}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-green-500/30 transition-all hover:-translate-y-0.5"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Send Order on WhatsApp
          </a>
        </div>
      )}
    </dialog>
  );
}
