"use client";
import { useEffect, useState } from "react";
import { useInventory } from "@/context/InventoryContext";
export default function CheckoutCancellation({ reservationId }: { reservationId?: string }) {
  const [message, setMessage] = useState(reservationId ? "Confirming checkout cancellation…" : "Your cart has been kept.");
  const { refresh } = useInventory();
  useEffect(() => {
    if (!reservationId) return;
    let active = true;
    fetch("/api/inventory/cancel", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ reservationId }) })
      .then(async response => { const result = await response.json(); if (!response.ok) throw new Error(result.error); return result; })
      .then(result => { if (active) setMessage(result.released ? "Checkout was cancelled and your cart has been kept." : result.paid ? "Your payment was already completed. Check your payment confirmation before ordering again." : "Your payment is still processing. Please wait before starting another checkout."); void refresh(); })
      .catch(() => { if (active) setMessage("We could not confirm cancellation yet. Your cart is kept; retry checkout or contact us before paying again."); });
    return () => { active = false; };
  }, [reservationId, refresh]);
  return <p className="mb-6 leading-relaxed text-gray-600" role="status">{message}</p>;
}
