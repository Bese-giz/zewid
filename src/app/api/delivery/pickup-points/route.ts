import { NextRequest, NextResponse } from "next/server";
import { findPickupPoints, PickupInputError, validatePostalCode } from "@/lib/postnord";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    const postalCode = validatePostalCode(request.nextUrl.searchParams.get("postal_code"));
    const points = await findPickupPoints(postalCode);
    return NextResponse.json({ points }, { headers: { "Cache-Control": "private, max-age=60" } });
  } catch (error) {
    if (error instanceof PickupInputError) return NextResponse.json({ error: error.message }, { status: 400 });
    console.error("PostNord pickup search could not be completed.");
    return NextResponse.json({ error: "Pickup points are temporarily unavailable. Please try again or contact us." }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
}
