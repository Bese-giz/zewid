import "server-only";
import type Stripe from "stripe";
import { getProductBySlug, getProductVariant, getSelectedProduct, isProductPurchasable, products } from "@/data/products";
import { calculateCart, cartLineKey, MAX_CART_QUANTITY, type CartSelection } from "./pricing";
import { stripeProductId } from "./stripe-catalog";
import { getStripe, matchesStripeMode } from "./stripe";
import { deliveryFromMetadata, validateCheckoutDelivery, type CheckoutDelivery } from "./checkout-delivery";

export type CheckoutItem = CartSelection;
const MAX_ORDER_LINES = products.reduce((count, product) => count + (product.variants?.length || 1), 0);

export class CheckoutInputError extends Error {}

export function validateCheckoutItems(value: unknown): CheckoutItem[] {
  if (!Array.isArray(value) || value.length === 0 || value.length > MAX_ORDER_LINES) throw new CheckoutInputError("Add at least one available product to your cart.");
  const seen = new Set<string>();
  return value.map((item: unknown) => {
    if (!item || typeof item !== "object" || !("slug" in item) || !("quantity" in item) ||
        typeof item.slug !== "string" || typeof item.quantity !== "number" ||
        ("variantId" in item && typeof item.variantId !== "string") ||
        !Number.isSafeInteger(item.quantity) || item.quantity < 1 || item.quantity > MAX_CART_QUANTITY) {
      throw new CheckoutInputError("Your cart contains an invalid product or quantity. Please review it.");
    }
    const catalogProduct = getProductBySlug(item.slug);
    const requestedVariantId = "variantId" in item ? item.variantId as string : undefined;
    const product = catalogProduct && getSelectedProduct(catalogProduct, requestedVariantId);
    if (!product || !isProductPurchasable(product)) throw new CheckoutInputError("A product in your cart is unavailable. Please review your cart.");
    const variantId = getProductVariant(catalogProduct!, requestedVariantId)?.id;
    const selected = { slug: item.slug, quantity: item.quantity, ...(variantId ? { variantId } : {}) };
    const key = cartLineKey(selected);
    if (seen.has(key)) throw new CheckoutInputError("Your cart contains a duplicate pack size. Please review it.");
    seen.add(key);
    return selected;
  }).sort((a, b) => cartLineKey(a).localeCompare(cartLineKey(b)));
}

// Stripe metadata values are limited to 500 characters. Keep each chunk a valid
// JSON array and retain the original first key for historical integrations.
export function checkoutItemsMetadata(items: CheckoutItem[]): Record<string, string> {
  const chunks: CheckoutItem[][] = [[]];
  for (const item of items) {
    const last = chunks[chunks.length - 1];
    if (JSON.stringify([...last, item]).length > 500) chunks.push([item]);
    else last.push(item);
  }
  return Object.fromEntries(chunks.map((chunk, index) => [index ? `zewid_items_${index + 1}` : "zewid_items", JSON.stringify(chunk)]));
}

export async function checkoutRates(items: CheckoutItem[]) {
  const stripe = getStripe();
  const pricing = calculateCart(items);
  const requested = pricing.lines.map((line) => ({
    line,
    productId: stripeProductId(getProductBySlug(line.product.slug)!, line.variantId),
    lookup: `${stripeProductId(getProductBySlug(line.product.slug)!, line.variantId)}_standard_${line.unitPriceCents}_eur`,
  }));
  const prices: Stripe.Price[] = [];
  for (let offset = 0; offset < requested.length; offset += 10) {
    const batch = await stripe.prices.list({ lookup_keys: requested.slice(offset, offset + 10).map(entry => entry.lookup), active: true, limit: 100 });
    prices.push(...batch.data);
  }
  const lineItems = requested.map(({ line, lookup, productId }) => {
    const price = prices.find((price) => price.lookup_key === lookup);
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
  if (session.line_items?.has_more) {
    session.line_items = await getStripe().checkout.sessions.listLineItems(sessionId, { limit: 100 });
  }
  return session;
}

export function purchasedItems(session: Stripe.Checkout.Session): CheckoutItem[] {
  const raw: unknown = Object.entries(session.metadata ?? {})
    .filter(([key]) => /^zewid_items(?:_[2-9]|_[1-9][0-9]+)?$/.test(key))
    .flatMap(([, value]) => { const chunk: unknown = JSON.parse(value); if (!Array.isArray(chunk)) throw new Error("Invalid order items."); return chunk; });
  // Paid purchases remain valid if a product is later marked out of stock.
  if (!Array.isArray(raw) || raw.length > MAX_ORDER_LINES) throw new Error("Invalid order items.");
  return raw.map((item: unknown) => {
    if (!item || typeof item !== "object" || !("slug" in item) || !("quantity" in item) ||
        typeof item.slug !== "string" || !getProductBySlug(item.slug) || typeof item.quantity !== "number" ||
        ("variantId" in item && (typeof item.variantId !== "string" || !/^[a-z0-9-]{1,100}$/.test(item.variantId))) ||
        !Number.isSafeInteger(item.quantity) || item.quantity < 1 || item.quantity > MAX_CART_QUANTITY) throw new Error("Invalid order item.");
    return { slug: item.slug, quantity: item.quantity, ...("variantId" in item ? { variantId: item.variantId as string } : {}) };
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

function orderDelivery(session: Stripe.Checkout.Session): CheckoutDelivery | null {
  const saved = deliveryFromMetadata(session.metadata);
  const intent = typeof session.payment_intent === "object" ? session.payment_intent : null;
  const shipping = session.collected_information?.shipping_details ?? intent?.shipping;
  if (!shipping?.address) return saved;
  try {
    // Prefer the final shipping address confirmed at payment; retain the
    // website's recipient contact details and its address as a fallback.
    return validateCheckoutDelivery({
      name: shipping.name || saved?.name || session.customer_details?.name,
      email: saved?.email || session.customer_details?.email,
      phone: saved?.phone || session.customer_details?.phone || intent?.shipping?.phone,
      line1: shipping.address.line1, line2: shipping.address.line2,
      postalCode: shipping.address.postal_code, city: shipping.address.city, country: shipping.address.country,
    });
  } catch { return saved; }
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
    deliveryDetails: orderDelivery(session),
    pickupPoint: session.metadata?.zewid_delivery_method === "postnord_pickup" ? {
      id: session.metadata.zewid_pickup_id, name: session.metadata.zewid_pickup_name,
      street: session.metadata.zewid_pickup_street, postalCode: session.metadata.zewid_pickup_postcode,
      city: session.metadata.zewid_pickup_city,
    } : null,
    items: purchasedItems(session),
    lines: (session.line_items?.data ?? []).map((line) => ({ description: line.description, quantity: line.quantity ?? 0, totalCents: line.amount_total })),
  };
}

export type PublicOrder = ReturnType<typeof publicOrder>;
