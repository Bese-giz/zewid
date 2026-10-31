import type { Product } from "@/data/products";
import { getProductCardName } from "@/lib/product-display";

export default function ProductName({ product, compact = false }: { product: Pick<Product, "slug" | "name" | "amharicName">; compact?: boolean }) {
  return <>
    {compact ? getProductCardName(product) : product.name}
    {product.amharicName && <span lang="am" className={`product-name-amharic${compact ? " product-name-amharic--compact" : ""}`}>{product.amharicName}</span>}
  </>;
}
