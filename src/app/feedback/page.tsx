import type { Metadata } from "next";
import Image from "next/image";
import TestimonialCard from "@/components/TestimonialCard";

export const metadata: Metadata = {
  title: "Customer Reviews & Feedback",
  description:
    "See what our customers say about ZEWID Ethiopian teff in Finland. Real reviews, injera photos, and customer feedback.",
};

const testimonials = [
  {
    quote: "Best teff we found in Finland. The injera comes out perfect every time!",
    author: "Meron T.",
    location: "Finland",
  },
  {
    quote: "Fast delivery and excellent quality. Finally good teff available for families all over Finland.",
    author: "Dawit K.",
    location: "Finland",
  },
  {
    quote: "My family loves the white teff. Soft injera just like back home in Ethiopia.",
    author: "Sara M.",
    location: "Finland",
  },
  {
    quote: "I run a small Ethiopian restaurant and ZEWID is my go-to supplier. Consistent quality every order.",
    author: "Abebe W.",
    location: "Finland",
  },
  {
    quote: "The red teff has such rich flavor. My guests always ask where I get my flour from!",
    author: "Tigist B.",
    location: "Finland",
  },
  {
    quote: "Ordering through WhatsApp is so easy. They reply fast and delivery is always on time.",
    author: "Hana G.",
    location: "Finland",
  },
  {
    quote: "Free delivery on big orders is amazing. We order 20kg every month for our family.",
    author: "Yonas D.",
    location: "Finland",
  },
  {
    quote: "ጤፍ ጥሩ ነው! The quality is the best I've found anywhere in Scandinavia.",
    author: "Lemlem A.",
    location: "Finland",
  },
];

export default function FeedbackPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-green-600 font-semibold text-sm uppercase tracking-wide mb-3">Testimonials</p>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Customer Reviews
          </h1>
          <p className="text-gray-500 text-lg">
            Real feedback from customers who trust ZEWID for their Ethiopian ingredients
          </p>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <TestimonialCard key={idx} {...t} />
          ))}
        </div>
      </section>

      {/* Customer Photos Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Customer Injera Photos
          </h2>
          <p className="text-gray-500 text-sm">Replace these with your real customer photos!</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[
            "/images/hero-injera.jpg",
            "/images/white-teff.jpg",
            "/images/brown-teff.jpg",
            "/images/mashila.jpg",
            "/images/teff-grains.jpg",
            "/images/mixed-teff.jpg",
            "/images/injera-plate.jpg",
            "/images/teff-field.jpg",
          ].map((src, idx) => (
            <div
              key={idx}
              className="aspect-square rounded-xl overflow-hidden shadow-sm border border-gray-100 relative"
            >
              <Image
                src={src}
                alt={`Customer injera photo ${idx + 1}`}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          ))}
        </div>
      </section>

      {/* Video Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Customer Videos
          </h2>
          <p className="text-gray-500 text-sm">Embed your TikTok videos here</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="aspect-[9/16] bg-gray-50 rounded-xl flex items-center justify-center border-2 border-dashed border-gray-200">
            <div className="text-center p-6">
              <div className="text-4xl mb-3">🎬</div>
              <p className="text-gray-500 font-medium">TikTok Video</p>
              <p className="text-gray-400 text-sm mt-1">
                Paste embed code here
              </p>
            </div>
          </div>
          <div className="aspect-[9/16] bg-gray-50 rounded-xl flex items-center justify-center border-2 border-dashed border-gray-200">
            <div className="text-center p-6">
              <div className="text-4xl mb-3">🎬</div>
              <p className="text-gray-500 font-medium">TikTok Video</p>
              <p className="text-gray-400 text-sm mt-1">
                Paste embed code here
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to taste the difference?
          </h2>
          <p className="text-gray-500 mb-6">
            Join our happy customers and order premium Ethiopian teff today.
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
