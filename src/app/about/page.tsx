import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about ZEWID | ዘውድ – Finland's trusted Ethiopian products brand. We provide premium teff flour, mashila, and authentic Ethiopian ingredients with fast, reliable delivery all over Finland.",
};

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-green-600 font-semibold text-sm uppercase tracking-wide mb-3">Our Story</p>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            About ZEWID | ዘውድ
          </h1>
          <p className="text-gray-500 text-lg">
            Your trusted source for premium Ethiopian products in Finland
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Who We Are
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              ZEWID | ዘውድ is a Finland-based Ethiopian products brand dedicated
              to providing high-quality traditional Ethiopian ingredients to
              customers all over Finland.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              We specialize in premium Ethiopian teff flour, mashila (sorghum),
              and other authentic Ethiopian food products. Our goal is to make
              fresh Ethiopian ingredients easily accessible with fast nationwide
              delivery.
            </p>
            <p className="text-gray-600 leading-relaxed mb-6">
              We proudly serve Ethiopian families, restaurants, and anyone who
              enjoys authentic Ethiopian cuisine.
            </p>

            <div className="bg-green-50 rounded-xl p-6 border border-green-100">
              <h3 className="font-bold text-gray-900 mb-3">በአማርኛ</h3>
              <p className="text-gray-700 leading-relaxed mb-3">
                ዘውድ | ZEWID በፊንላንድ የተመሰረተ ጥራት ያላቸውን ባህላዊ የኢትዮጵያ ምርቶች
                ለደንበኞች የሚያቀርብ ብራንድ ነው።
              </p>
              <p className="text-gray-700 leading-relaxed">
                ነጭ ጤፍ፣ ቀይ ጤፍ፣ ማሽላ እና ሌሎች ባህላዊ የኢትዮጵያ ምግብ ንጥረ ነገሮችን
                እናቀርባለን።
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl overflow-hidden shadow-md relative h-64">
              <Image
                src="/images/hero-injera.jpg"
                alt="Ethiopian injera and food"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-4">Our Values</h3>
              <ul className="space-y-3">
                {[
                  "Premium quality products imported from Ethiopia",
                  "Fast, reliable delivery all over Finland",
                  "Personal service through WhatsApp",
                  "Affordable prices for families",
                  "Supporting the Ethiopian community in Finland",
                ].map((value) => (
                  <li
                    key={value}
                    className="flex items-start gap-2 text-gray-600 text-sm"
                  >
                    <span className="text-green-500 mt-0.5">✓</span>
                    {value}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Want to try our products?
          </h2>
          <p className="text-gray-500 mb-6">
            Order directly through WhatsApp for fast, reliable delivery all over Finland.
          </p>
          <a
            href="https://wa.me/358417059015?text=Hi%20ZEWID!%20I%20would%20like%20to%20order"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-full font-bold transition-colors"
          >
            Order on WhatsApp
          </a>
        </div>
      </section>
    </>
  );
}
