"use client";

import { useRef, useState } from "react";
import { useCart } from "@/context/CartContext";
import { formatEuro } from "@/lib/pricing";
import type { PickupSelection } from "@/lib/postnord";
import PickupPointSelector from "./PickupPointSelector";

export default function StripeCheckoutButton({ sandbox, pickupEnabled = false }: { sandbox: boolean; pickupEnabled?: boolean }) {
  const { items, pricing } = useCart();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pickup, setPickup] = useState<PickupSelection | null>(null);
  const attempt = useRef<{ cart: string; id: string } | null>(null);

  async function checkout() {
    if (busy || !items.length || (pickupEnabled && !pickup)) return;
    setBusy(true);
    setError(null);
    const selected = items.map(({ slug, quantity }) => ({ slug, quantity })).sort((a, b) => a.slug.localeCompare(b.slug));
    const fingerprint = JSON.stringify({ items: selected, pickup: pickupEnabled ? pickup : null });
    if (attempt.current?.cart !== fingerprint) attempt.current = { cart: fingerprint, id: crypto.randomUUID() };
    try {
      const response = await fetch("/api/checkout", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: selected, requestId: attempt.current!.id, ...(pickupEnabled ? { pickup } : {}) }),
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
    <div className="mb-3">
      {pickupEnabled && <PickupPointSelector value={pickup} onChange={setPickup} />}
      <button type="button" onClick={checkout} disabled={busy || !items.length || (pickupEnabled && !pickup)}
        className="w-full rounded-xl bg-gray-900 px-4 py-3 font-bold text-white transition-colors hover:bg-black disabled:cursor-not-allowed disabled:opacity-60">
        {busy ? "Opening checkout…" : `Checkout · ${formatEuro(pricing.totalCents)}`}
      </button>
      {pickupEnabled && !pickup && <p className="mt-2 text-center text-xs text-gray-600">Choose a pickup point to continue.</p>}
      <p className="mt-2 text-center text-xs text-gray-600">{sandbox ? "Sandbox checkout — no real payment." : "Available payment methods appear at checkout."}</p>
      {error && <p role="alert" className="mt-2 text-sm text-red-700">{error}</p>}
    </div>
  );
}
