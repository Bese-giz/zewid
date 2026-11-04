import { products, getSelectedProduct, type Product } from "../data/products.ts";

export function stripeProductId(product: Product, variantId?: string): string {
  const identifier = variantId && variantId !== product.defaultVariantId ? variantId : product.slug;
  return `zewid_${identifier.replaceAll("-", "_")}`;
}

export function stripeCatalogEntries() {
  return products.flatMap(product => (product.variants?.length ? product.variants.map(variant => variant.id) : [undefined])
    .map(variantId => ({ product: getSelectedProduct(product, variantId)!, variantId,
      id: stripeProductId(product, variantId), key: variantId ? `${product.slug}:${variantId}` : product.slug })));
}
