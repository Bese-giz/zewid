import "server-only";
import type Stripe from "stripe";
import { getProductBySlug, products } from "@/data/products";
import { calculateCart, MAX_CART_QUANTITY } from "./pricing";
import { getStripe, matchesStripeMode } from "./stripe";

export interface CheckoutItem { slug: string; quantity: number }

export class CheckoutInputError extends Error {}

export function validateCheckoutItems(value: unknown): CheckoutItem[] {
  if (!Array.isArray(value) || value.length === 0 || value.length > products.length) throw new CheckoutInputError("Add at least one available product to your cart.");
  const seen = new Set<string>();
  return value.map((item: unknown) => {
    if (!item || typeof item !== "object" || !("slug" in item) || !("quantity" in item) ||
        typeof item.slug !== "string" || typeof item.quantity !== "number" ||
        !Number.isSafeInteger(item.quantity) || item.quantity < 1 || item.quantity > MAX_CART_QUANTITY || seen.has(item.slug)) {
      throw new CheckoutInputError("Your cart contains an invalid product or quantity. Please review it.");
    }
    const product = getProductBySlug(item.slug);
    if (!product || product.availability !== "in-stock") throw new CheckoutInputError("A product in your cart is unavailable. Please review your cart.");
    seen.add(item.slug);
    return { slug: item.slug, quantity: item.quantity };
  }).sort((a, b) => a.slug.localeCompare(b.slug));
}

export async function checkoutRates(items: CheckoutItem[]) {
  const stripe = getStripe();
  const pricing = calculateCart(items);
  const requested = pricing.lines.map((line) => ({
    line,
    productId: `zewid_${line.product.slug.replaceAll("-", "_")}`,
    lookup: `zewid_${line.product.slug.replaceAll("-", "_")}_standard_${line.unitPriceCents}_eur`,
  }));
  const prices = await stripe.prices.list({ lookup_keys: requested.map((entry) => entry.lookup), active: true, limit: 100 });
  const lineItems = requested.map(({ line, lookup, productId }) => {
    const price = prices.data.find((price) => price.lookup_key === lookup);
    if (!price || price.product !== productId || price.currency !== "eur" || price.unit_amount !== line.unitPriceCents || price.type !== "one_time" || price.tax_behavior !== "inclusive") {
      throw new Error("Stripe catalog prices do not match the website. Import the catalog into the configured Stripe environment.");
    }
    return { price: price.id, quantity: line.quantity };
  });
  let shippingRate: Stripe.ShippingRate | undefined;
  let cursor: string | undefined;
  do {
    const rates = await stripe.shippingRates.list({ active: true, currency: "eur", limit: 100, ...(cursor ? { starting_after: cursor } : {}) });
    shippingRate = rates.data.find((rate) => rate.metadata.zewid_rate === `zewid_finland_${pricing.deliveryCents}_eur` &&
      rate.fixed_amount?.currency === "eur" && rate.fixed_amount.amount === pricing.deliveryCents && rate.tax_behavior === "inclusive");
    cursor = rates.has_more ? rates.data.at(-1)?.id : undefined;
  } while (!shippingRate && cursor);
  if (!shippingRate) throw new Error("Stripe delivery pricing does not match the website. Import the catalog into the configured Stripe environment.");
  return { lineItems, shippingRateId: shippingRate.id, pricing };
}

export async function retrieveOrder(sessionId: string) {
  if (!/^cs_(test|live)_[a-zA-Z0-9_]+$/.test(sessionId) || sessionId.length > 255 ||
      !matchesStripeMode(sessionId.startsWith("cs_live_"))) throw new CheckoutInputError("Invalid checkout reference.");
  const session = await getStripe().checkout.sessions.retrieve(sessionId, { expand: ["line_items", "payment_intent"] });
  if (!matchesStripeMode(session.livemode) || session.mode !== "payment" || session.metadata?.zewid_store !== "zewid") throw new CheckoutInputError("This checkout does not belong to ZEWID.");
  return session;
}

export function purchasedItems(session: Stripe.Checkout.Session): CheckoutItem[] {
  const raw: unknown = JSON.parse(session.metadata?.zewid_items ?? "[]");
  // Paid purchases remain valid if a product is later marked out of stock.
  if (!Array.isArray(raw) || raw.length > products.length) throw new Error("Invalid order items.");
  return raw.map((item: unknown) => {
    if (!item || typeof item !== "object" || !("slug" in item) || !("quantity" in item) ||
        typeof item.slug !== "string" || !getProductBySlug(item.slug) || typeof item.quantity !== "number" ||
        !Number.isSafeInteger(item.quantity) || item.quantity < 1 || item.quantity > MAX_CART_QUANTITY) throw new Error("Invalid order item.");
    return { slug: item.slug, quantity: item.quantity };
  });
}

export async function recordPayment(session: Stripe.Checkout.Session) {
  if (!matchesStripeMode(session.livemode) || session.metadata?.zewid_store !== "zewid" || session.payment_status !== "paid" || session.status !== "complete") return;
  const expected = Number(session.metadata.zewid_total_cents);
  if (!Number.isSafeInteger(expected) || expected <= 0 || session.currency !== "eur" || session.amount_total !== expected) throw new Error("Order payment amount does not match its checkout total.");
  if (session.metadata.zewid_payment_status === "paid") return;
  const stripe = getStripe();
  // Recording a verified payment is idempotent. Shipment is handled by the merchant.
  await stripe.checkout.sessions.update(session.id, { metadata: { zewid_payment_status: "paid" } }, { idempotencyKey: `zewid_paid_${session.id}` });
}

export function publicOrder(session: Stripe.Checkout.Session) {
  const expected = Number(session.metadata?.zewid_total_cents);
  const paid = session.status === "complete" && session.payment_status === "paid" && session.currency === "eur" &&
    Number.isSafeInteger(expected) && expected > 0 && session.amount_total === expected;
  const status = paid ? "paid" : session.status === "expired" ? "expired" : session.status === "complete" ? "processing" : "unpaid";
  return {
    status,
    sandbox: !session.livemode,
    sessionId: session.id,
    reference: session.client_reference_id ?? "ZEWID",
    subtotalCents: session.amount_subtotal ?? 0,
    deliveryCents: session.total_details?.amount_shipping ?? 0,
    totalCents: session.amount_total ?? 0,
    items: purchasedItems(session),
    lines: (session.line_items?.data ?? []).map((line) => ({ description: line.description, quantity: line.quantity ?? 0, totalCents: line.amount_total })),
  };
}

export type PublicOrder = ReturnType<typeof publicOrder>;
