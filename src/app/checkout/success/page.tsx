import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import CheckoutConfirmation from "@/components/CheckoutConfirmation";
import { publicOrder, recordPayment, retrieveOrder, type PublicOrder } from "@/lib/checkout";
import { CHECKOUT_COOKIE, ownsCheckout } from "@/lib/stripe";

export const metadata: Metadata = { title: "Order Confirmation", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function SuccessPage({ searchParams }: { searchParams: Promise<{ session_id?: string }> }) {
  const { session_id: sessionId } = await searchParams;
  let order: PublicOrder | null = null;
  try {
    const token = (await cookies()).get(CHECKOUT_COOKIE)?.value;
    if (!sessionId || !token) throw new Error("Missing checkout reference.");
    const session = await retrieveOrder(sessionId);
    if (!ownsCheckout(session, token)) throw new Error("Checkout could not be found.");
    await recordPayment(session);
    order = publicOrder(session);
  } catch { /* Keep the cart when verification is unavailable. */ }
  if (order) return <CheckoutConfirmation initialOrder={order} />;
  return (
      <section className="mx-auto w-full max-w-2xl px-4 py-16">
        <h1 className="mb-4 text-3xl font-bold text-gray-900">Payment status unavailable</h1>
        <p className="mb-6 text-gray-600">We could not verify this checkout. If you just paid, refresh this page or contact us with your Stripe receipt. Your cart has been kept.</p>
        <Link href="/contact" className="rounded-full bg-green-700 px-6 py-3 font-semibold text-white">Contact ZEWID</Link>
      </section>
  );
}
