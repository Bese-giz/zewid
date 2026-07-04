import { getProductBySlug, products } from "@/data/products";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";

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

  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: `${product.name} - ZEWID | ዘውድ`,
      description: product.description,
      images: [{ url: product.image }],
    },
  };
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

            {/* Action Area */}
            <div className="bg-gray-50 rounded-2xl p-6 flex flex-col sm:flex-row gap-4 border border-gray-100">
              <a
                href={`https://wa.me/358417059015?text=${encodeURIComponent(`Hi ZEWID! I'd like to order ${product.name}.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-green-500 hover:bg-green-600 text-white px-6 py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 shadow-lg shadow-green-500/30 hover:-translate-y-0.5"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Order on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
