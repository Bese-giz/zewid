"use client";

import { useEffect, useRef, useState } from "react";
import { useCart } from "@/context/CartContext";
import type { PickupSelection } from "@/lib/postnord";

export default function StripeCheckoutButton({ sandbox, pickup = null }: { sandbox: boolean; pickup?: PickupSelection | null }) {
  const { items } = useCart();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const attempt = useRef<{ cart: string; id: string } | null>(null);
  const submitting = useRef(false);
  const controller = useRef<AbortController | null>(null);
  useEffect(() => () => controller.current?.abort(), []);

  async function checkout() {
    if (submitting.current || !items.length) return;
    submitting.current = true;
    setBusy(true);
    setError(null);
    const selected = items.map(({ slug, quantity }) => ({ slug, quantity })).sort((a, b) => a.slug.localeCompare(b.slug));
    const fingerprint = JSON.stringify({ items: selected, pickup });
    if (attempt.current?.cart !== fingerprint) attempt.current = { cart: fingerprint, id: crypto.randomUUID() };
    const active = new AbortController();
    controller.current = active;
    try {
      const response = await fetch("/api/checkout", {
        method: "POST", headers: { "Content-Type": "application/json" }, signal: active.signal,
        body: JSON.stringify({ items: selected, requestId: attempt.current!.id, ...(pickup ? { pickup } : {}) }),
      });
      const result: { url?: string; error?: string } = await response.json();
      if (!response.ok || !result.url) throw new Error(result.error || "Checkout is unavailable. Please try again.");
      const destination = new URL(result.url);
      if (destination.protocol !== "https:" || destination.hostname !== "checkout.stripe.com") throw new Error("Checkout could not be opened. Please try again.");
      if (!active.signal.aborted) window.location.assign(destination.href);
    } catch (failure) {
      if (!active.signal.aborted) {
        setError(failure instanceof Error ? failure.message : "Checkout could not be opened. Please try again.");
        setBusy(false);
        submitting.current = false;
      }
    }
  }

  return (
    <div className="cart-checkout">
      <button type="button" onClick={checkout} disabled={busy || !items.length} className="cart-checkout-button">
        {busy ? "Opening checkout…" : "Continue to payment"}
      </button>
      <p className="cart-checkout-note">{sandbox ? "Sandbox checkout — no real payment." : "Enter your delivery details securely in Stripe."}</p>
      {error && <p role="alert" className="cart-checkout-error">{error}</p>}
    </div>
  );
}
