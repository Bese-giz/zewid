import type { Product } from "../data/products.ts";

export function getProductDiscount(product: Pick<Product, "priceEur" | "compareAtPriceEur">) {
  if (product.priceEur == null || product.compareAtPriceEur == null) return null;
  const priceCents = Math.round(product.priceEur * 100);
  const originalCents = Math.round(product.compareAtPriceEur * 100);
  if (!Number.isSafeInteger(priceCents) || !Number.isSafeInteger(originalCents) || priceCents <= 0 || originalCents <= priceCents) return null;
  const percentOff = Math.floor((originalCents - priceCents) * 100 / originalCents);
  return { originalCents, percentOff, label: percentOff > 0 ? `${percentOff}% off` : "Sale" };
}
