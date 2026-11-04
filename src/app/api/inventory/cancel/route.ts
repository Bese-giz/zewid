import { NextRequest, NextResponse } from "next/server";
import { cancelInventoryCheckout } from "@/lib/inventory";
import { CHECKOUT_COOKIE, checkoutBaseUrl, hashToken } from "@/lib/stripe";
import { readLimitedBody } from "@/lib/request-body";
export const runtime = "nodejs";
export async function POST(request: NextRequest) {
  const token = request.cookies.get(CHECKOUT_COOKIE)?.value;
  if (request.headers.get("origin") !== checkoutBaseUrl() || !token || !/^[a-f0-9]{64}$/.test(token)) return NextResponse.json({ error: "Start from your shopping cart." }, { status: 403 });
  try {
    const body = JSON.parse(await readLimitedBody(request, 1024));
    if (typeof body.reservationId !== "string" || !/^[a-f0-9-]{36}$/i.test(body.reservationId)) return NextResponse.json({ error: "Invalid checkout reference." }, { status: 400 });
    return NextResponse.json(await cancelInventoryCheckout(body.reservationId, hashToken(token)));
  } catch { return NextResponse.json({ error: "Checkout cancellation could not be confirmed. Your order has not been marked paid." }, { status: 503 }); }
}
