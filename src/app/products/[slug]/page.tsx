import { getProductBySlug, products } from "@/data/products";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";
import ProductOrderActions from "@/components/ProductOrderActions";
import ProductAvailability from "@/components/ProductAvailability";
import OrderInformation from "@/components/OrderInformation";
import ProductGallery from "@/components/ProductGallery";

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
    description: product.shortDescription,
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
          <div className="w-full md:w-1/2 bg-gray-50/50 p-6 md:p-10">
            <ProductGallery key={product.slug} product={product} />
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
            
            <p className="mb-5 text-lg font-medium leading-relaxed text-gray-700">{product.shortDescription}</p>
            <p className="text-gray-600 leading-relaxed mb-8">
              {product.description}
            </p>

            <ProductAvailability product={product} />

            {product.specifications && product.specifications.length > 0 && (
              <section className="my-6" aria-labelledby="product-specifications">
                <h2 id="product-specifications" className="mb-3 text-sm font-bold uppercase tracking-wider text-gray-900">Product details</h2>
                <dl className="divide-y divide-gray-200 rounded-xl bg-gray-50 px-4">
                  {product.specifications.map(specification => <div key={specification.label} className="py-3 text-sm sm:flex sm:gap-4">
                    <dt className="font-semibold text-gray-900 sm:w-2/5 sm:shrink-0">{specification.label}</dt>
                    <dd className="mt-1 text-gray-600 sm:mt-0">{specification.value}</dd>
                  </div>)}
                </dl>
              </section>
            )}

            <div className="mb-10 flex-grow">
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Key Features</h2>
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
