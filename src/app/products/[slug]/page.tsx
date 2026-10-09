import { getProductBySlug, products } from "@/data/products";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";
import ProductOrderActions from "@/components/ProductOrderActions";
import ProductAvailability from "@/components/ProductAvailability";
import OrderInformation from "@/components/OrderInformation";

export async function generateStaticParams() {
  return products.map((product) => ({
    slug: product.slug,
  }));
}

export async function generateMetadata(
  props: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const params = await props.params;
  const product = getProductBySlug(params.slug);
  if (!product) return {};

  return pageMetadata({
    title: product.name,
    description: product.description,
    path: `/products/${product.slug}`,
    image: product.image,
  });
}

export default async function ProductPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const product = getProductBySlug(params.slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 md:py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <Link href="/products" className="inline-flex items-center text-green-700 hover:text-green-800 font-medium group">
            <svg className="w-5 h-5 mr-2 transform transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Products
          </Link>
        </div>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row">
          {/* Image Side */}
          <div className="w-full md:w-1/2 bg-gray-50/50 p-8 md:p-12 flex items-center justify-center relative">
            <div className="absolute inset-0 opacity-20 bg-gradient-to-tr from-green-300 via-transparent to-red-300 blur-3xl pointer-events-none"></div>
            <div className="relative w-full aspect-square max-w-md">
              <Image
                src={product.image}
                alt={product.name}
                fill
                sizes="(max-width: 767px) 100vw, 448px"
                className="object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500"
                priority
              />
            </div>
          </div>

          {/* Details Side */}
          <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col">
            <div className="mb-2">
              <span className="inline-block px-3 py-1 bg-green-100 text-green-800 font-bold text-xs uppercase tracking-wider rounded-full">
                {product.weight}
              </span>
            </div>
            
            <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
              {product.name}
            </h1>
            
            <p className="text-gray-600 text-lg leading-relaxed mb-8">
              {product.description}
            </p>

            <ProductAvailability product={product} />

            <div className="mb-10 flex-grow">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Key Features</h3>
              <ul className="space-y-3">
                {product.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start text-gray-600">
                    <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <ProductOrderActions key={product.slug} product={product} />
          </div>
        </div>
        <div className="mt-8"><OrderInformation /></div>
      </div>
    </div>
  );
}
