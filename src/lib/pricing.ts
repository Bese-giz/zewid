import { getProductBySlug } from "../data/products.ts";
import { site } from "./site.ts";

export const MAX_CART_QUANTITY = 999;

export function formatEuro(cents: number): string {
  return new Intl.NumberFormat("en-FI", { style: "currency", currency: "EUR" }).format(cents / 100);
}

export function calculateCart(items: readonly { slug: string; quantity: number }[]) {
  // Prices, pack weights, and availability always come from the catalog.
  const quantities = new Map<string, number>();
  for (const item of items) {
    const product = getProductBySlug(item.slug);
    if (!product || product.availability !== "in-stock" ||
        !Number.isSafeInteger(item.quantity) || item.quantity <= 0 || item.quantity > MAX_CART_QUANTITY) continue;
    quantities.set(item.slug, Math.min(MAX_CART_QUANTITY, (quantities.get(item.slug) ?? 0) + item.quantity));
  }
  const selected = [...quantities].map(([slug, quantity]) => ({ product: getProductBySlug(slug)!, quantity }));
  const lines = selected.map(({ product, quantity }) => {
    const unitPriceCents = Math.round(product.priceEur * 100);
    return { product, quantity, unitPriceCents, lineTotalCents: unitPriceCents * quantity };
  });
  const subtotalCents = lines.reduce((sum, line) => sum + line.lineTotalCents, 0);
  const deliveryCents = lines.length ? Math.round(site.deliveryFeeEur * 100) : 0;
  return { lines, subtotalCents, deliveryCents,
    totalCents: subtotalCents + deliveryCents };
}
