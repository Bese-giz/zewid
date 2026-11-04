import type { Metadata } from "next";
import Link from "next/link";
import CheckoutCancellation from "@/components/CheckoutCancellation";

export const metadata: Metadata = { title: "Checkout Closed", robots: { index: false, follow: false } };

export default async function CancelPage({ searchParams }: { searchParams: Promise<{ reservation?: string }> }) {
  const { reservation } = await searchParams;
  return (
    <section className="mx-auto w-full max-w-2xl px-4 py-16">
      <h1 className="mb-4 text-3xl font-bold text-gray-900">Checkout closed</h1>
      <CheckoutCancellation reservationId={reservation && /^[a-f0-9-]{36}$/i.test(reservation) ? reservation : undefined} />
      <Link href="/products" className="inline-flex rounded-full bg-green-700 px-6 py-3 font-semibold text-white">Back to Products</Link>
    </section>
  );
}
