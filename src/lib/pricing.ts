import { getProductBySlug, getProductVariant, getSelectedProduct, isProductPurchasable, type Product } from "../data/products.ts";
import { site } from "./site.ts";

export const MAX_CART_QUANTITY = 999;
export interface CartSelection { slug: string; quantity: number; variantId?: string }

export function cartLineKey(item: { slug: string; variantId?: string }): string {
  return item.variantId ? `${item.slug}:${item.variantId}` : item.slug;
}

export function formatEuro(cents: number): string {
  return new Intl.NumberFormat("en-FI", { style: "currency", currency: "EUR" }).format(cents / 100);
}

export function calculateCart(items: readonly CartSelection[]) {
  // Every amount and pack label comes from the catalog, never browser input.
  const selected = new Map<string, { product: Product & { priceEur: number }; variantId?: string; quantity: number }>();
  for (const item of items) {
    const catalogProduct = getProductBySlug(item.slug);
    if (!catalogProduct || !Number.isSafeInteger(item.quantity) || item.quantity <= 0 || item.quantity > MAX_CART_QUANTITY) continue;
    const product = getSelectedProduct(catalogProduct, item.variantId);
    if (!product || !isProductPurchasable(product)) continue;
    const variantId = getProductVariant(catalogProduct, item.variantId)?.id;
    const key = cartLineKey({ slug: product.slug, variantId });
    selected.set(key, { product, ...(variantId ? { variantId } : {}),
      quantity: Math.min(MAX_CART_QUANTITY, (selected.get(key)?.quantity ?? 0) + item.quantity) });
  }
  const lines = [...selected].map(([key, { product, quantity, variantId }]) => {
    const unitPriceCents = Math.round(product.priceEur * 100);
    return { key, product, variantId, quantity, unitPriceCents, lineTotalCents: unitPriceCents * quantity };
  });
  const subtotalCents = lines.reduce((sum, line) => sum + line.lineTotalCents, 0);
  const deliveryCents = lines.length ? Math.round(site.deliveryFeeEur * 100) : 0;
  return { lines, subtotalCents, deliveryCents,
    totalCents: subtotalCents + deliveryCents };
}
