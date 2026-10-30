"use client";

import { useEffect, useRef, useState } from "react";
import { MAX_CART_QUANTITY, useCart } from "@/context/CartContext";
import Image from "next/image";
import Link from "next/link";
import { formatEuro } from "@/lib/pricing";
import StripeCheckoutButton from "./StripeCheckoutButton";
import PickupPointSelector, { type SelectedPickupPoint } from "./PickupPointSelector";
import type { StripeMode } from "@/lib/stripe-mode";
import { getProductCardName } from "@/lib/product-display";
import MarketIcon from "./MarketIcon";

export default function FloatingCart({ checkoutMode = null, pickupEnabled = false }: { checkoutMode?: StripeMode | null; pickupEnabled?: boolean }) {
  const { items, pricing, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, generateWhatsAppLink } = useCart();
  const [pickup, setPickup] = useState<SelectedPickupPoint | null>(null);

  const dialogRef = useRef<HTMLDialogElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const pickupDetailsRef = useRef<HTMLDetailsElement>(null);
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);

  function choosePickup() {
    const details = pickupDetailsRef.current;
    if (!details) return;
    details.open = true;
    details.querySelector<HTMLInputElement>("#pickup-postcode")?.focus({ preventScroll: true });
    details.scrollIntoView({ block: "start", behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  }

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!isCartOpen || !dialog) return;
    const trigger = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    dialog.showModal();
    if (contentRef.current) contentRef.current.scrollTop = 0;
    if (pickupDetailsRef.current) pickupDetailsRef.current.open = false;
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
      onCancel={(event) => { event.preventDefault(); setIsCartOpen(false); }}
      onClose={(event) => { if (!event.currentTarget.open) setIsCartOpen(false); }}
      onClick={(event) => {
        if (event.target !== event.currentTarget) return;
        const bounds = event.currentTarget.getBoundingClientRect();
        if (event.clientX < bounds.left || event.clientX > bounds.right ||
            event.clientY < bounds.top || event.clientY > bounds.bottom) setIsCartOpen(false);
      }}
      className="cart-dialog"
    >
      <div className="cart-header">
        <div><h2 id="cart-title">Your cart</h2><p>{itemCount} {itemCount === 1 ? "item" : "items"}</p></div>
        <button type="button" aria-label="Close cart" autoFocus onClick={() => setIsCartOpen(false)} className="cart-close"><MarketIcon name="close" size={23} /></button>
      </div>
      <p id="cart-description" className="sr-only">Review your items, choose delivery and continue to payment or send your order on WhatsApp.</p>

      <div ref={contentRef} className="cart-content" role="region" aria-label="Cart items and delivery" tabIndex={0}>
        {items.length === 0 ? <div className="cart-empty">
          <MarketIcon name="bag" size={44} />
          <div><h3>Your cart is empty</h3><p>Add a few favourites to get started.</p></div>
          <Link href="/products" onClick={() => setIsCartOpen(false)} className="market-button market-button--primary">Explore products</Link>
        </div> : <>
          <ul className="cart-items" role="list" aria-label="Products in your cart">
            {pricing.lines.map((line) => {
              const item = { ...line.product, quantity: line.quantity };
              return <li key={item.slug} className="cart-item">
                <div className="cart-item-image"><Image src={item.image} alt="" fill sizes="64px" className="object-contain p-1" /></div>
                <div className="cart-item-content">
                  <div className="cart-item-heading">
                    <Link href={`/products/${item.slug}`} onClick={() => setIsCartOpen(false)} aria-label={item.name}>{getProductCardName(item)}</Link>
                    <span>{formatEuro(line.lineTotalCents)}</span>
                  </div>
                  <p className="cart-item-unit">{item.weight} · {formatEuro(line.unitPriceCents)} each</p>
                  <div className="cart-item-controls">
                    <div className="cart-item-quantity" role="group" aria-label={`Quantity of ${item.name}`}>
                      <button type="button" aria-label={`Decrease quantity of ${item.name}`} onClick={() => updateQuantity(item.slug, item.quantity - 1)}>−</button>
                      <output aria-live="polite">{item.quantity}</output>
                      <button type="button" aria-label={`Increase quantity of ${item.name}`} disabled={item.quantity >= MAX_CART_QUANTITY} onClick={() => updateQuantity(item.slug, item.quantity + 1)}>+</button>
                    </div>
                    <button type="button" aria-label={`Remove ${item.name} from cart`} onClick={() => removeFromCart(item.slug)} className="cart-item-remove">Remove</button>
                  </div>
                </div>
              </li>;
            })}
          </ul>

          <section className="cart-summary" aria-labelledby="cart-summary-title">
            <h3 id="cart-summary-title">Order summary</h3>
            <dl>
              <div><dt>Products</dt><dd>{formatEuro(pricing.subtotalCents)}</dd></div>
              <div><dt>Delivery (Finland)</dt><dd>{formatEuro(pricing.deliveryCents)}</dd></div>
            </dl>
            <p>Online checkout is for delivery in Finland.</p>
          </section>

          {pickupEnabled && <details ref={pickupDetailsRef} id="cart-pickup-details" className="cart-pickup-details">
            <summary>
              <span><span className="cart-pickup-title">PostNord pickup point</span><span className="cart-pickup-status">{pickup ? pickup.point.name : "Choose a location for checkout"}</span></span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
            </summary>
            <PickupPointSelector value={pickup} onChange={setPickup} compact />
          </details>}
        </>}
      </div>

      {items.length > 0 && <div className="cart-footer">
        <div className="cart-total" aria-live="polite" aria-atomic="true"><span>Total<small>VAT included</small></span><strong>{formatEuro(pricing.totalCents)}</strong></div>
        {checkoutMode && <StripeCheckoutButton sandbox={checkoutMode === "sandbox"} pickupEnabled={pickupEnabled} pickup={pickup?.selection ?? null} onSelectPickup={choosePickup} />}
        <a href={generateWhatsAppLink(pickupEnabled ? pickup?.point : undefined)} target="_blank" rel="noopener noreferrer" className={`cart-whatsapp${checkoutMode ? "" : " cart-whatsapp--primary"}`}><MarketIcon name="whatsapp" size={19} />Send order on WhatsApp</a>
      </div>}
    </dialog>
  );
}
