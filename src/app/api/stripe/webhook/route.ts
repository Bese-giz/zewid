import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe, matchesStripeMode } from "@/lib/stripe";
import { recordPayment, retrieveOrder } from "@/lib/checkout";
import { readLimitedBody } from "@/lib/request-body";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) return NextResponse.json({ error: "Webhook is not configured." }, { status: 503 });
  const signature = request.headers.get("stripe-signature");
  if (!signature) return NextResponse.json({ error: "Missing signature." }, { status: 400 });
  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(await readLimitedBody(request, 256_000), signature, secret);
  } catch {
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }
  if (!matchesStripeMode(event.livemode)) return NextResponse.json({ error: "Webhook environment does not match checkout." }, { status: 400 });
  try {
    if (event.type === "checkout.session.completed" || event.type === "checkout.session.async_payment_succeeded") {
      if (event.data.object.metadata?.zewid_store !== "zewid") return NextResponse.json({ received: true });
      const sessionId = event.data.object.id;
      const session = await retrieveOrder(sessionId);
      await recordPayment(session);
    }
    return NextResponse.json({ received: true });
  } catch {
    console.error("Stripe payment notification could not be processed.");
    return NextResponse.json({ error: "Payment notification could not be processed." }, { status: 500 });
  }
}
