import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Checkout Closed", robots: { index: false, follow: false } };

export default function CancelPage() {
  return (
    <section className="mx-auto w-full max-w-2xl px-4 py-16">
      <h1 className="mb-4 text-3xl font-bold text-gray-900">Checkout closed</h1>
      <p className="mb-6 leading-relaxed text-gray-600">Your cart has been kept. You can review your products and start checkout again when you are ready.</p>
      <Link href="/products" className="inline-flex rounded-full bg-green-700 px-6 py-3 font-semibold text-white">Back to Products</Link>
    </section>
  );
}
