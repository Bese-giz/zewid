import type { Metadata } from "next";
import ProductCard from "@/components/ProductCard";

export const metadata: Metadata = {
  title: "Products – Ethiopian Teff, Mashila & More",
  description:
    "Buy premium Ethiopian white teff flour, red teff flour, mashila (sorghum) and traditional Ethiopian ingredients in Finland. Fast, reliable delivery all over Finland. Order on WhatsApp.",
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

const products = [
  {
    name: "White Teff Flour",
    weight: "5 kg bag",
    description:
      "Premium Ethiopian white teff flour for baking authentic injera. Finely milled and imported directly from Ethiopia. Known for its delicate flavor and light color.",
    image: "/images/white_teff_bag_transparent_enhanced.png",
    features: [
      "100% Ethiopian white teff",
      "Perfect for authentic light injera",
      "Fresh stock in Finland",
      "Fast, reliable delivery all over Finland",
    ],
  },
  {
    name: "Red Teff Flour",
    weight: "5 kg bag",
    description:
      "Rich, nutty Ethiopian red teff flour for dark injera. Full-bodied flavor with excellent nutritional value.",
    image: "/images/red_teff_flour_enhanced_transparent.png",
    features: [
      "100% Ethiopian red teff",
      "High in iron and fiber",
      "High in iron & calcium",
      "Perfect for dark injera",
    ],
  },
  {
    name: "Mashila (Sorghum)",
    weight: "5 kg bag",
    description:
      "High-quality whole grain mashila (sorghum). Traditionally mixed with teff for injera or used for making hearty porridge (genfo).",
    image: "/images/mashila.png",
    features: [
      "Premium quality sorghum",
      "Authentic Ethiopian mashila",
      "Versatile cooking",
      "Direct from Ethiopia",
    ],
  },
  {
    name: "Berbere",
    weight: "1 kg pack",
    description:
      "Authentic Ethiopian Berbere spice blend. Rich, flavorful, and perfect for wot (stews).",
    image: "/images/berbere_enhanced_transparent.png",
    features: [
      "Authentic Ethiopian spice",
      "Rich flavor",
      "Perfect for wot",
    ],
  },
  {
    name: "Buna (Coffee)",
    weight: "1 kg pack",
    description:
      "Premium Ethiopian coffee beans (Buna). Experience the birthplace of coffee with this rich, aromatic blend.",
    image: "/images/green_coffee_beans_enhanced_transparent.png",
    features: [
      "Premium Ethiopian coffee",
      "Rich aroma",
      "Traditional buna",
    ],
  },
  {
    name: "Shiro",
    weight: "1 kg pack",
    description:
      "Traditional Ethiopian Shiro powder. Easy to prepare and makes a delicious, savory stew.",
    image: "/images/shiro_enhanced_transparent.png",
    features: [
      "Traditional shiro powder",
      "Easy to prepare",
      "Delicious flavor",
    ],
  },
];

export default function ProductsPage() {
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
            Premium Ethiopian teff flour, mashila, and traditional ingredients imported directly from Ethiopia.
          </p>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-6 md:py-16 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-8">
          {products.map((product) => (
            <ProductCard key={product.name} {...product} showDetails={false} />
          ))}
        </div>
      </section>

      {/* How to Order */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            How to Order
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-green-600 font-bold">1</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Choose Products</h3>
              <p className="text-sm text-gray-500">
                Pick what you need from our selection
              </p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-green-600 font-bold">2</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Message Us</h3>
              <p className="text-sm text-gray-500">
                Send your order via WhatsApp
              </p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-green-600 font-bold">3</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Fast Delivery</h3>
              <p className="text-sm text-gray-500">
                Receive fast, reliable delivery all over Finland
              </p>
            </div>
          </div>
          <a
            href="https://wa.me/358417059015?text=Hi%20ZEWID!%20I%20would%20like%20to%20order"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-full font-bold text-lg transition-colors"
          >
            Order on WhatsApp
          </a>
        </div>
      </section>
    </>
  );
}
