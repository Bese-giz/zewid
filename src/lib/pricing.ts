import { getProductBySlug, teffPricing } from "../data/products.ts";
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
  const teffWeightKg = selected.reduce((weight, { product, quantity }) =>
    weight + (product.pricingGroup === "teff" ? product.weightKg * quantity : 0), 0);
  const bulkDiscountApplied = teffWeightKg >= teffPricing.minimumKg;
  const lines = selected.map(({ product, quantity }) => {
    const regularUnitPriceCents = Math.round(product.priceEur * 100);
    const unitPriceCents = product.pricingGroup === "teff" && bulkDiscountApplied
      ? Math.round(teffPricing.bulkPriceEur * 100)
      : regularUnitPriceCents;
    return { product, quantity, regularUnitPriceCents, unitPriceCents, lineTotalCents: unitPriceCents * quantity };
  });
  const subtotalCents = lines.reduce((sum, line) => sum + line.lineTotalCents, 0);
  const savingsCents = lines.reduce((sum, line) => sum + (line.regularUnitPriceCents - line.unitPriceCents) * line.quantity, 0);
  const deliveryCents = lines.length ? Math.round(site.deliveryFeeEur * 100) : 0;
  return { lines, teffWeightKg, bulkDiscountApplied, savingsCents, subtotalCents, deliveryCents,
    totalCents: subtotalCents + deliveryCents };
}
