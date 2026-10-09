import type { Product } from "@/data/products";

export default function ProductAvailability({ product }: { product: Pick<Product, "availability" | "priceEur" | "weight"> }) {
  return (
    <div className="mb-4 space-y-1 text-xs md:text-sm">
      <p className={product.availability === "in-stock" ? "font-semibold text-green-700" : "font-semibold text-amber-800"}>
        {product.availability === "in-stock" ? "In stock" : "Currently unavailable"}
      </p>
      <p className="text-gray-600">
        {product.priceEur !== undefined
          ? `${new Intl.NumberFormat("en-FI", { style: "currency", currency: "EUR" }).format(product.priceEur)} / ${product.weight}`
          : "Price: confirm on WhatsApp"}
      </p>
    </div>
  );
}
