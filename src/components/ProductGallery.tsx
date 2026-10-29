import type { Product } from "@/data/products";
import ProductImageCarousel from "./ProductImageCarousel";

export default function ProductGallery({ product }: { product: Product }) {
  return <ProductImageCarousel product={product} variant="detail" />;
}
