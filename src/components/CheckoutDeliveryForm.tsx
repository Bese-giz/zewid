"use client";

import { useEffect, useRef, useState, type FormEvent, type HTMLInputTypeAttribute } from "react";
import { useCart } from "@/context/CartContext";
import { DeliveryInputError, validateCheckoutDelivery, type CheckoutDelivery, type DeliveryField } from "@/lib/checkout-delivery";
import { formatEuro } from "@/lib/pricing";
import { deliveryPointName } from "@/lib/delivery-display";
import type { SelectedPickupPoint } from "./PickupPointSelector";
import StripeCheckoutButton from "./StripeCheckoutButton";

interface DeliveryInput {
  field: Exclude<DeliveryField, "country">;
  label: string;
  autoComplete: string;
  maxLength: number;
  type?: HTMLInputTypeAttribute;
  optional?: boolean;
  inputMode?: "numeric" | "tel" | "email";
  pattern?: string;
}

const contactFields: DeliveryInput[] = [
  { field: "name", label: "Full name", autoComplete: "shipping name", maxLength: 100 },
  { field: "email", label: "Email", autoComplete: "email", maxLength: 254, type: "email", inputMode: "email" },
  { field: "phone", label: "Phone number", autoComplete: "shipping tel", maxLength: 30, type: "tel", inputMode: "tel" },
];
const addressFields: DeliveryInput[] = [
  { field: "line1", label: "Street address", autoComplete: "shipping address-line1", maxLength: 200 },
  { field: "line2", label: "Apartment, floor or address line 2", autoComplete: "shipping address-line2", maxLength: 200, optional: true },
];
const localityFields: DeliveryInput[] = [
  { field: "postalCode", label: "Postcode", autoComplete: "shipping postal-code", maxLength: 5, inputMode: "numeric", pattern: "[0-9]{5}" },
  { field: "city", label: "City", autoComplete: "shipping address-level2", maxLength: 100 },
];

export default function CheckoutDeliveryForm({ sandbox, delivery, onChange, pickup }: {
  sandbox: boolean; delivery: CheckoutDelivery; onChange: (delivery: CheckoutDelivery) => void; pickup: SelectedPickupPoint | null;
}) {
  const { items, pricing } = useCart();
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorField, setErrorField] = useState<DeliveryField | null>(null);
  const attempt = useRef<{ fingerprint: string; id: string } | null>(null);
  const controller = useRef<AbortController | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const submitting = useRef(false);
  useEffect(() => () => controller.current?.abort(), []);

  function focusField(field?: DeliveryField) {
    if (field) formRef.current?.querySelector<HTMLInputElement>(`#delivery-${field}`)?.focus();
  }

  async function checkout(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting.current || !items.length) return;
    const values = new FormData(event.currentTarget);
    const submitted: CheckoutDelivery = {
      name: String(values.get("name") ?? ""), email: String(values.get("email") ?? ""), phone: String(values.get("phone") ?? ""),
      line1: String(values.get("line1") ?? ""), line2: String(values.get("line2") ?? ""),
      postalCode: String(values.get("postalCode") ?? ""), city: String(values.get("city") ?? ""), country: "FI",
    };
    onChange(submitted);
    let details: CheckoutDelivery;
    try { details = validateCheckoutDelivery(submitted); }
    catch (failure) {
      setError(failure instanceof Error ? failure.message : "Complete your delivery details.");
      if (failure instanceof DeliveryInputError) { setErrorField(failure.field ?? null); focusField(failure.field); }
      return;
    }
    submitting.current = true;
    setBusy(true);
    setError(null);
    setErrorField(null);
    const selected = items.map(({ slug, quantity }) => ({ slug, quantity })).sort((a, b) => a.slug.localeCompare(b.slug));
    const selection = pickup?.selection ?? null;
    const fingerprint = JSON.stringify({ items: selected, pickup: selection, delivery: details });
    if (attempt.current?.fingerprint !== fingerprint) attempt.current = { fingerprint, id: crypto.randomUUID() };
    const active = new AbortController();
    controller.current = active;
    try {
      const response = await fetch("/api/checkout", {
        method: "POST", headers: { "Content-Type": "application/json" }, signal: active.signal,
        body: JSON.stringify({ items: selected, requestId: attempt.current.id, delivery: details, ...(selection ? { pickup: selection } : {}) }),
      });
      const result: { url?: string; error?: string; field?: DeliveryField } = await response.json();
      if (!response.ok || !result.url) {
        setErrorField(result.field ?? null);
        if (result.field) requestAnimationFrame(() => focusField(result.field));
        throw new Error(result.error || "Checkout is unavailable. Please try again.");
      }
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

  function input(field: DeliveryInput) {
    return <label key={field.field} className="cart-delivery-field" htmlFor={`delivery-${field.field}`}>
      <span>{field.label}{field.optional && <small>Optional</small>}</span>
      <input id={`delivery-${field.field}`} name={field.field} type={field.type ?? "text"} required={!field.optional}
        autoComplete={field.autoComplete} maxLength={field.maxLength} inputMode={field.inputMode} pattern={field.pattern}
        title={field.field === "postalCode" ? "Five-digit Finnish postcode" : undefined}
        autoFocus={field.field === "name"} value={delivery[field.field]} disabled={busy}
        aria-invalid={errorField === field.field || undefined} aria-describedby={errorField === field.field ? "checkout-delivery-error" : undefined}
        onChange={event => { onChange({ ...delivery, [field.field]: event.target.value }); setError(null); setErrorField(null); }} />
    </label>;
  }

  return <form ref={formRef} id="cart-delivery-form" className="cart-delivery-step" action="/api/checkout" method="post" onSubmit={checkout}>
    <div className="cart-content" role="region" aria-label="Delivery details" tabIndex={0}>
      <p className="cart-delivery-intro">Where should we send your order? Complete these details before choosing a payment method.</p>
      <fieldset className="cart-delivery-fields" disabled={busy}>
        <legend>Contact details</legend>
        {contactFields.map(input)}
      </fieldset>
      <fieldset className="cart-delivery-fields" disabled={busy}>
        <legend>Delivery address</legend>
        {pickup && <p className="cart-delivery-pickup">Collection point: {deliveryPointName(pickup.point.name)}. Enter the recipient’s own address below.</p>}
        {addressFields.map(input)}
        <div className="cart-delivery-locality">{localityFields.map(input)}</div>
        <p className="cart-delivery-country">Country: <strong>Finland</strong></p>
      </fieldset>
      <p className="cart-delivery-privacy">We use these details to contact you and deliver your order. You can confirm them again when paying.</p>
    </div>
    <div className="cart-footer">
      <div className="cart-total"><span>Total<small>VAT included · {itemCount} {itemCount === 1 ? "item" : "items"}</small></span><strong>{formatEuro(pricing.totalCents)}</strong></div>
      <StripeCheckoutButton sandbox={sandbox} busy={busy} error={error} />
    </div>
  </form>;
}
