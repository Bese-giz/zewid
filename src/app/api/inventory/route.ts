import { NextResponse } from "next/server";
import { inventorySnapshot, reconcileInventory } from "@/lib/inventory";
import { cartLineKey } from "@/lib/pricing";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function GET() {
  const headers = { "Cache-Control": "no-store" };
  try {
    await reconcileInventory();
    const stock = await inventorySnapshot();
    const quantities = Object.fromEntries(stock.flatMap(product => product.options.map(option => [
      cartLineKey({ slug: product.slug, variantId: option.variantId || undefined }),
      product.availability === "in-stock" ? Math.max(0, Math.floor(product.available / option.units)) : 0,
    ])));
    return NextResponse.json({ enabled: true, quantities }, { headers });
  } catch { return NextResponse.json({ error: "Stock availability is temporarily unavailable." }, { status: 503, headers }); }
}
