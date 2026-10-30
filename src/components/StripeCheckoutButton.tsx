"use client";

import { useRef, useState } from "react";
import { useCart } from "@/context/CartContext";
import type { PickupSelection } from "@/lib/postnord";

export default function StripeCheckoutButton({ sandbox, pickup = null }: { sandbox: boolean; pickup?: PickupSelection | null }) {
  const { items } = useCart();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const attempt = useRef<{ cart: string; id: string } | null>(null);

  async function checkout() {
    if (busy || !items.length) return;
    setBusy(true);
    setError(null);
    const selected = items.map(({ slug, quantity }) => ({ slug, quantity })).sort((a, b) => a.slug.localeCompare(b.slug));
    const fingerprint = JSON.stringify({ items: selected, pickup });
    if (attempt.current?.cart !== fingerprint) attempt.current = { cart: fingerprint, id: crypto.randomUUID() };
    try {
      const response = await fetch("/api/checkout", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: selected, requestId: attempt.current!.id, ...(pickup ? { pickup } : {}) }),
      });
      const result: { url?: string; error?: string } = await response.json();
      if (!response.ok || !result.url) throw new Error(result.error || "Checkout is unavailable. Please try again.");
      const destination = new URL(result.url);
      if (destination.protocol !== "https:" || destination.hostname !== "checkout.stripe.com") throw new Error("Checkout could not be opened. Please try again.");
      window.location.assign(destination.href);
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : "Checkout could not be opened. Please try again.");
      setBusy(false);
    }
  }

  return (
    <div className="cart-checkout">
      <button type="button" onClick={checkout} disabled={busy || !items.length} className="cart-checkout-button">
        {busy ? "Opening checkout…" : "Continue to payment"}
      </button>
      <p className="cart-checkout-note">{sandbox ? "Sandbox checkout — no real payment." : "Available payment methods appear at checkout."}</p>
      {error && <p role="alert" className="cart-checkout-error">{error}</p>}
    </div>
  );
}
