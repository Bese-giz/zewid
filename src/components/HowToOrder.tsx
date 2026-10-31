import Link from "next/link";
import { whatsappLink } from "@/lib/site";
import MarketIcon from "./MarketIcon";

export default function HowToOrder({ shopHref = "/products" }: { shopHref?: string }) {
  const steps = [
    { title: "Choose your products", description: "Browse the collection and add available products to your cart. Ask us on WhatsApp about coming-soon items." },
    { title: "Place your order", description: "Review your cart, enter your contact and delivery details, then choose a payment method. You can also send your cart on WhatsApp to arrange your order and payment." },
    { title: "We prepare your delivery", description: "After payment is confirmed, we carefully pack your products and arrange delivery." },
  ];

  return (
    <section id="how-to-order" aria-labelledby="how-to-order-title" className="bg-[#f3f6ee] px-4 py-12 sm:px-6 lg:px-8 md:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto mb-8 max-w-2xl text-center md:mb-10">
          <h2 id="how-to-order-title" className="market-title text-3xl md:text-5xl">How to order</h2>
          <p className="mt-4 text-sm leading-relaxed text-slate-600 md:text-base">Choose your products, confirm the details and we’ll prepare your order.</p>
        </div>
        <ol className="grid gap-4 lg:grid-cols-3 lg:gap-6">
          {steps.map((step, index) => <li key={step.title} className="rounded-2xl border border-[#dfe7d9] bg-white p-6">
            <span className="mb-5 inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#eaf0e4] text-sm font-semibold text-[#244b38]" aria-hidden="true">0{index + 1}</span>
            <h3 className="text-lg font-semibold leading-snug text-[#244b38]">{step.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">{step.description}</p>
          </li>)}
        </ol>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href={shopHref} className="market-button market-button--primary">Shop online <MarketIcon name="arrow" size={19} /></Link>
          <a href={whatsappLink("Hi ZEWID Market! I would like to place an order and arrange payment.")} target="_blank" rel="noopener noreferrer" className="market-button market-button--outline"><MarketIcon name="whatsapp" size={20} />Order on WhatsApp</a>
        </div>
      </div>
    </section>
  );
}
