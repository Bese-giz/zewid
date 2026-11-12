import type { Product } from "@/data/products";
import { getProductCardName } from "@/lib/product-display";

export default function ProductName({ product, compact = false }: { product: Pick<Product, "slug" | "name" | "amharicName">; compact?: boolean }) {
  const englishName = compact ? getProductCardName(product) : product.name;
  return <>
    <span lang={product.amharicName ? "am" : "en"} className={`product-name-primary${compact ? " product-name-primary--compact" : ""}`}>{product.amharicName ?? englishName}</span>
    {product.amharicName && <span lang="en" className={`product-name-secondary${compact ? " product-name-secondary--compact" : ""}`}>{englishName}</span>}
  </>;
}
