"use client";

import { useEffect, useRef, useState } from "react";
import { useCart } from "@/context/CartContext";
import type { PickupSelection } from "@/lib/postnord";
import { useInventory } from "@/context/InventoryContext";

export default function StripeCheckoutButton({ sandbox, pickup = null }: { sandbox: boolean; pickup?: PickupSelection | null }) {
  const { items } = useCart();
  const stock = useInventory();
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
    const selected = items.map(({ slug, quantity, variantId }) => ({ slug, quantity, ...(variantId ? { variantId } : {}) }))
      .sort((a, b) => a.slug.localeCompare(b.slug) || (a.variantId ?? "").localeCompare(b.variantId ?? ""));
    const fingerprint = JSON.stringify({ items: selected, pickup });
    if (attempt.current?.cart !== fingerprint) {
      let saved: { cart?: string; id?: string } = {};
      try {
        const value: unknown = JSON.parse(localStorage.getItem("zewid_checkout_attempt") ?? "{}");
        if (value && typeof value === "object" && !Array.isArray(value)) saved = value;
      } catch { /* Storage is optional. */ }
      attempt.current = { cart: fingerprint, id: saved.cart === fingerprint && typeof saved.id === "string" && /^[a-f0-9-]{36}$/i.test(saved.id) ? saved.id : crypto.randomUUID() };
      try { localStorage.setItem("zewid_checkout_attempt", JSON.stringify(attempt.current)); } catch { /* In-memory retry still works. */ }
    }
    const active = new AbortController();
    controller.current = active;
    try {
      const response = await fetch("/api/checkout", {
        method: "POST", headers: { "Content-Type": "application/json" }, signal: active.signal,
        body: JSON.stringify({ items: selected, requestId: attempt.current!.id, ...(pickup ? { pickup } : {}) }),
      });
      const result: { url?: string; error?: string; retryWithNewAttempt?: boolean } = await response.json();
      if (result.retryWithNewAttempt) {
        attempt.current = null;
        try { localStorage.removeItem("zewid_checkout_attempt"); } catch { /* Storage is optional. */ }
      }
      if (!response.ok || !result.url) throw new Error(result.error || "Checkout is unavailable. Please try again.");
      const destination = new URL(result.url);
      if (destination.protocol !== "https:" || destination.hostname !== "checkout.stripe.com") throw new Error("Checkout could not be opened. Please try again.");
      if (!active.signal.aborted) window.location.assign(destination.href);
    } catch (failure) {
      if (!active.signal.aborted) {
        setError(failure instanceof Error ? failure.message : "Checkout could not be opened. Please try again.");
        setBusy(false);
        submitting.current = false;
        void stock.refresh();
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
