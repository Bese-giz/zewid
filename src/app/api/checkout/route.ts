import { NextRequest, NextResponse } from "next/server";
import { createHash } from "node:crypto";
import { CheckoutInputError, checkoutItemsMetadata, checkoutRates, validateCheckoutItems } from "@/lib/checkout";
import { CHECKOUT_COOKIE, browserToken, checkoutBaseUrl, checkoutMode, getStripe, hashToken, matchesStripeMode } from "@/lib/stripe";
import { BodyTooLargeError, readLimitedBody } from "@/lib/request-body";
import { PickupInputError, postnordPickupEnabled, validatePickupSelection } from "@/lib/postnord";
import { deliveryPointName } from "@/lib/delivery-display";
import { checkoutPaymentMethods } from "@/lib/checkout-payment-policy";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const origin = checkoutBaseUrl();
    const mode = checkoutMode();
    if (!mode) throw new Error("Checkout is not configured.");
    if (request.headers.get("origin") !== origin) return NextResponse.json({ error: "Please start checkout from the ZEWID website." }, { status: 403 });
    if (!request.headers.get("content-type")?.startsWith("application/json")) return NextResponse.json({ error: "Invalid checkout request." }, { status: 415 });
    const raw = await readLimitedBody(request, 16384);
    let body: { items?: unknown; requestId?: unknown; pickup?: unknown };
    try { body = JSON.parse(raw); } catch { throw new CheckoutInputError("Invalid checkout request."); }
    if (!body || typeof body !== "object" || typeof body.requestId !== "string" ||
        !/^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i.test(body.requestId)) throw new CheckoutInputError("Invalid checkout request. Please try again.");
    const items = validateCheckoutItems(body.items);
    const itemMetadata = checkoutItemsMetadata(items);
    const hasPickup = body.pickup !== undefined && body.pickup !== null;
    if (hasPickup && !postnordPickupEnabled()) throw new PickupInputError("Delivery-point selection is temporarily unavailable. Clear the selection to continue with the address entered at payment.");
    const pickup = hasPickup ? await validatePickupSelection(body.pickup) : null;
    const { lineItems, shippingRateId, pricing } = await checkoutRates(items);
    // Hosted checkout only accepts Finnish shipping addresses. Apply the
    // merchant's amount rule here so it also covers express Klarna buttons.
    const allowedPaymentMethods = checkoutPaymentMethods(pricing.totalCents, "FI");
    const token = browserToken(request.cookies.get(CHECKOUT_COOKIE)?.value);
    const reference = `ZEWID-${body.requestId.replaceAll("-", "").slice(0, 12).toUpperCase()}`;
    const pickupMetadata: Record<string, string> = pickup ? {
      zewid_delivery_method: "postnord_pickup", zewid_pickup_id: pickup.point.id, zewid_pickup_country: pickup.point.countryCode,
      zewid_pickup_name: pickup.point.name, zewid_pickup_street: pickup.point.street,
      zewid_pickup_postcode: pickup.point.postalCode, zewid_pickup_city: pickup.point.city,
    } : { zewid_delivery_method: "checkout_address" };
    const metadata = {
      zewid_store: "zewid", zewid_mode: mode, zewid_browser: hashToken(token), ...itemMetadata,
      zewid_checkout_flow: "stripe_address_v1",
      zewid_total_cents: String(pricing.totalCents),
      zewid_payment_status: "awaiting_payment", zewid_prices_include_vat: "true",
      // Fulfillment is separate from payment: only process succeeded payments.
      fulfillment_status: "pending",
      ...pickupMetadata,
    };
    const fingerprint = createHash("sha256").update(JSON.stringify({ flow: "stripe_address_v1", items, totalCents: pricing.totalCents, pickup: pickup?.selection ?? null, paymentMethods: allowedPaymentMethods })).update(hashToken(token)).digest("hex");
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      mode: "payment", ui_mode: "hosted_page", locale: "auto",
      line_items: lineItems,
      shipping_options: [{ shipping_rate: shippingRateId }],
      shipping_address_collection: { allowed_countries: ["FI"] },
      phone_number_collection: { enabled: true },
      allowed_payment_method_types: [...allowedPaymentMethods],
      adaptive_pricing: { enabled: false },
      automatic_tax: { enabled: false },
      ...(pickup ? { custom_text: { submit: { message: `Collect your order from your selected delivery point: ${deliveryPointName(pickup.point.name)}, ${pickup.point.street}, ${pickup.point.postalCode} ${pickup.point.city}.` } } } : {}),
      client_reference_id: reference,
      metadata,
      // Stripe copies these initial values to the Charge. Never reset a merchant's later status edits.
      payment_intent_data: { metadata: { zewid_store: "zewid", zewid_order: reference, ...itemMetadata, fulfillment_status: "pending", ...pickupMetadata }, description: `ZEWID order ${reference}` },
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout/cancel`,
    }, { idempotencyKey: `zewid_checkout_${mode}_${body.requestId}_${fingerprint}` });
    if (!matchesStripeMode(session.livemode) || !session.url || session.currency !== "eur" || session.amount_total !== pricing.totalCents ||
        session.shipping_address_collection?.allowed_countries.length !== 1 || session.shipping_address_collection.allowed_countries[0] !== "FI" ||
        !session.phone_number_collection?.enabled ||
        !session.payment_method_types.length || session.payment_method_types.some(method => !allowedPaymentMethods.some(allowed => allowed === method))) {
      // Fail closed if Stripe returns a method outside this order's policy,
      // including Klarna at or below the merchant's €100 threshold.
      if (session.status === "open") await stripe.checkout.sessions.expire(session.id);
      throw new Error("Stripe checkout settings did not match the cart.");
    }
    const response = NextResponse.json({ url: session.url }, { headers: { "Cache-Control": "no-store" } });
    response.cookies.set(CHECKOUT_COOKIE, token, { httpOnly: true, sameSite: "lax", secure: origin.startsWith("https:"), path: "/", maxAge: 14 * 24 * 60 * 60 });
    return response;
  } catch (error) {
    if (error instanceof BodyTooLargeError) return NextResponse.json({ error: "Checkout request is too large." }, { status: 413 });
    if (error instanceof CheckoutInputError || error instanceof PickupInputError) return NextResponse.json({ error: error.message }, { status: 400 });
    console.error("Checkout could not be created.");
    return NextResponse.json({ error: "Online checkout is temporarily unavailable. Please try again or order on WhatsApp." }, { status: 503 });
  }
}
