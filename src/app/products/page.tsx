import HowToOrder from "@/components/HowToOrder";
import OrderInformation from "@/components/OrderInformation";
import { pageMetadata } from "@/lib/metadata";
import ProductCatalog from "@/components/ProductCatalog";
import { productCategories, products, type ProductCategory } from "@/data/products";

export const metadata = {
  ...pageMetadata({
    title: "Products – Ethiopian Food, Coffee & Home Essentials",
    description:
      "Shop Ethiopian food, coffee and home essentials. Pay online for Finland delivery, or contact us on WhatsApp for delivery outside Finland.",
    path: "/products",
  }),
  keywords: [
    "buy teff Finland",
    "white teff flour Finland",
    "red teff Finland",
    "Ethiopian teff Finland",
    "injera flour buy online Finland",
    "mashila sorghum Finland",
    "Ethiopian grocery Finland",
  ],
};

export default async function ProductsPage({ searchParams }: { searchParams: Promise<{ q?: string | string[]; category?: string | string[] }> }) {
  const params = await searchParams;
  const search = typeof params.q === "string" ? params.q.trim().slice(0, 120) : "";
  const category: ProductCategory | "all" = productCategories.some(item => item.id === params.category) ? params.category as ProductCategory : "all";
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-10 md:py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-green-600 font-semibold text-xs md:text-sm uppercase tracking-wide mb-2">Shop</p>
          <h1 className="text-2xl md:text-5xl font-bold text-gray-900 mb-3">
            Our Products
          </h1>
          <p className="text-gray-500 text-sm md:text-lg max-w-2xl mx-auto">
            Ethiopian food, coffee and spices, alongside injera makers, serving sets and cultural favourites.
          </p>
        </div>
      </section>

      {/* Products Grid */}
      <section id="catalog" className="scroll-mt-32 py-6 md:py-16 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <p className="mb-4 text-xs leading-relaxed text-gray-600">Ask us on WhatsApp about prices and availability for coming-soon products.</p>
        <ProductCatalog key={`${category}:${search}`} products={products} initialCategory={category} initialSearch={search} />
      </section>

      <section aria-label="Prices and delivery" className="mx-auto w-full max-w-7xl px-4 pb-10 sm:px-6 lg:px-8"><OrderInformation /></section>

      <HowToOrder shopHref="#catalog" />
    </>
  );
}
