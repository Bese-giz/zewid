import { NextRequest, NextResponse } from "next/server";
import { publicOrder, recordPayment, retrieveOrder } from "@/lib/checkout";
import { CHECKOUT_COOKIE, ownsCheckout } from "@/lib/stripe";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get(CHECKOUT_COOKIE)?.value;
    if (!token) return NextResponse.json({ error: "Checkout could not be found." }, { status: 404 });
    const session = await retrieveOrder(request.nextUrl.searchParams.get("session_id") ?? "");
    if (!ownsCheckout(session, token)) return NextResponse.json({ error: "Checkout could not be found." }, { status: 404 });
    await recordPayment(session);
    return NextResponse.json(publicOrder(session), { headers: { "Cache-Control": "private, no-store" } });
  } catch {
    return NextResponse.json({ error: "Payment status is unavailable. Please try again." }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
}
