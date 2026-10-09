import Link from "next/link";
import { pageMetadata } from "@/lib/metadata";
import { whatsappLink } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Customer Feedback",
  description: "Share feedback about your ZEWID order, Ethiopian products, or delivery in Finland. Contact us directly on WhatsApp.",
  path: "/feedback",
});

export default function FeedbackPage() {
  return (
    <>
      <section className="bg-gradient-to-b from-gray-50 to-white px-4 py-16 md:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-green-700">Your experience matters</p>
          <h1 className="mb-4 text-3xl font-bold text-gray-900 md:text-5xl">Customer Feedback</h1>
          <p className="text-lg leading-relaxed text-gray-600">Tell us how your products and delivery worked for you. Your feedback helps us improve our service.</p>
        </div>
      </section>
      <section className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-green-100 bg-green-50 p-6 md:p-8">
            <h2 className="mb-3 text-2xl font-bold text-gray-900">Share your feedback</h2>
            <p className="mb-6 leading-relaxed text-gray-600">We would love to hear about the quality, flavor, and delivery of your order. You can also share a photo of what you made.</p>
            <a href={whatsappLink("Hi ZEWID! I'd like to share feedback about my order.")} target="_blank" rel="noopener noreferrer"
              className="inline-flex rounded-full bg-green-700 px-6 py-3 font-semibold text-white transition-colors hover:bg-green-800">Send Feedback on WhatsApp</a>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-6 md:p-8">
            <h2 className="mb-3 text-2xl font-bold text-gray-900">Need help with an order?</h2>
            <p className="mb-6 leading-relaxed text-gray-600">If something needs attention, contact us with your order details so we can help you directly.</p>
            <a href={whatsappLink("Hi ZEWID! I need help with my order.")} target="_blank" rel="noopener noreferrer"
              className="inline-flex rounded-full bg-gray-900 px-6 py-3 font-semibold text-white transition-colors hover:bg-black">Get Order Support</a>
          </div>
        </div>
        <p className="mt-8 text-center text-gray-600">Looking for Ethiopian ingredients? <Link href="/products" className="font-semibold text-green-800 underline underline-offset-4">Browse our products</Link>.</p>
      </section>
    </>
  );
}
