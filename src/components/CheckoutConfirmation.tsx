"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { PublicOrder } from "@/lib/checkout";
import { useCart } from "@/context/CartContext";
import { formatEuro } from "@/lib/pricing";
import { site, whatsappLink } from "@/lib/site";

export default function CheckoutConfirmation({ initialOrder }: { initialOrder: PublicOrder }) {
  const [order, setOrder] = useState(initialOrder);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const { completeCheckout } = useCart();

  useEffect(() => {
    if (order.status === "paid") completeCheckout(order.sessionId, order.items);
  }, [order, completeCheckout]);

  useEffect(() => {
    if (order.status !== "processing") return;
    const controller = new AbortController();
    let timer: ReturnType<typeof setTimeout>;
    let attempts = 0;
    async function poll() {
      try {
        const response = await fetch(`/api/checkout/status?session_id=${encodeURIComponent(order.sessionId)}`, { cache: "no-store", signal: controller.signal });
        if (response.ok) {
          const next: PublicOrder = await response.json();
          if (!controller.signal.aborted) setOrder(next);
          if (next.status !== "processing") return;
        }
      } catch { /* Leave manual refresh available if the network is interrupted. */ }
      attempts += 1;
      if (!controller.signal.aborted && attempts < 10) timer = setTimeout(poll, 3000);
    }
    timer = setTimeout(poll, 3000);
    return () => { controller.abort(); clearTimeout(timer); };
  }, [order.sessionId, order.status]);

  async function refresh() {
    setBusy(true);
    setError(null);
    try {
      const response = await fetch(`/api/checkout/status?session_id=${encodeURIComponent(order.sessionId)}`, { cache: "no-store" });
      if (!response.ok) throw new Error("We could not check the payment yet. Please try again.");
      setOrder(await response.json());
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : "Payment status is unavailable.");
    } finally { setBusy(false); }
  }

  const paid = order.status === "paid";
  return (
    <section className="mx-auto w-full max-w-2xl px-4 py-12 md:py-20">
      {order.sandbox && <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-amber-800">Sandbox order — no real payment</p>}
      <h1 className="mb-4 text-3xl font-bold text-gray-900">{paid ? "Payment confirmed" : order.status === "processing" ? "Payment is processing" : order.status === "expired" ? "Checkout has expired" : "Payment not completed"}</h1>
      <p className="mb-6 leading-relaxed text-gray-600">{paid ? `${order.sandbox ? "Your sandbox payment" : "Your payment"} was successful. Keep your order reference for any questions.` : "Your cart is still available. We will confirm the payment only after Stripe reports it successful."}</p>
      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        <p className="mb-4 font-semibold text-gray-900">Order reference: {order.reference}</p>
        <ul className="space-y-3 text-sm text-gray-700">
          {order.lines.map((line, index) => <li key={index} className="flex justify-between gap-4"><span>{line.description} × {line.quantity}</span><span className="shrink-0">{formatEuro(line.totalCents)}</span></li>)}
        </ul>
        <dl className="mt-5 space-y-2 border-t border-gray-200 pt-4 text-sm">
          <div className="flex justify-between gap-4"><dt>Products</dt><dd>{formatEuro(order.subtotalCents)}</dd></div>
          <div className="flex justify-between gap-4"><dt>Delivery</dt><dd>{formatEuro(order.deliveryCents)}</dd></div>
          <div className="flex justify-between gap-4 font-bold"><dt>Total</dt><dd>{formatEuro(order.totalCents)}</dd></div>
        </dl>
        <p className="mt-2 text-xs text-gray-600">Prices include VAT.</p>
        {order.pickupPoint && (
          <div className="mt-4 rounded-xl bg-green-50 p-4 text-sm text-green-900">
            <p className="font-semibold">PostNord pickup point</p>
            <p>{order.pickupPoint.name}</p>
            <p>{order.pickupPoint.street}, {order.pickupPoint.postalCode} {order.pickupPoint.city}</p>
          </div>
        )}
        <p className="mt-4 text-sm text-gray-600">{order.sandbox ? "Delivery for live orders" : "Delivery"}: {site.deliveryTime}, {site.deliveryArea.toLowerCase()}.</p>
      </div>
      {!paid && <button type="button" onClick={refresh} disabled={busy} className="mt-6 rounded-full bg-gray-900 px-6 py-3 font-semibold text-white disabled:opacity-50">{busy ? "Checking payment…" : "Refresh payment status"}</button>}
      {error && <p role="alert" className="mt-3 text-sm text-red-700">{error}</p>}
      <div className="mt-6 flex flex-wrap gap-4">
        <Link href="/products" className="rounded-full bg-green-700 px-6 py-3 font-semibold text-white">Continue Shopping</Link>
        <a href={whatsappLink(`Hi ZEWID! I have a question about order ${order.reference}.`)} target="_blank" rel="noopener noreferrer" className="rounded-full border border-gray-300 px-6 py-3 font-semibold text-gray-800">Contact Us</a>
      </div>
    </section>
  );
}
