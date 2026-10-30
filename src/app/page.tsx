import Link from "next/link";
import Image from "next/image";
import HomeProductFeed from "@/components/HomeProductFeed";
import OrderInformation from "@/components/OrderInformation";
import HowToOrder from "@/components/HowToOrder";
import MarketIcon from "@/components/MarketIcon";
import { products } from "@/data/products";
import { pageMetadata } from "@/lib/metadata";
import { whatsappLink } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Your Ethiopian Market in Finland",
  description: "Shop Ethiopian food, coffee and home essentials. Browse ZEWID Market and order online or contact us on WhatsApp.",
  path: "/",
});

export default function HomePage() {
  return (
    <>
      <section className="market-hero" aria-labelledby="market-hero-title">
        <Image src="/images/landing.png" alt="" fill priority sizes="100vw" className="market-hero__image" />
        <div className="market-hero__shade" />
        <div className="market-container market-hero__content">
          <div className="market-hero__copy">
            <p className="market-eyebrow">Rooted in tradition. Made for everyday.</p>
            <h1 id="market-hero-title" className="market-title"><span>Your Ethiopian</span><span>market, closer</span><span>to home.</span></h1>
            <p lang="am" className="market-hero__amharic">የኢትዮጵያ ጣዕም፣ የቤት ስሜት። <span aria-hidden="true">🇪🇹</span></p>
            <p className="market-hero__description">Food, coffee and home essentials, thoughtfully brought together for everyday life.</p>
            <div className="market-hero__buttons">
              <Link href="#collection" className="market-button market-button--primary">Shop the collection <MarketIcon name="arrow" size={21} /></Link>
              <a href={whatsappLink("Hi ZEWID Market! I would like to ask about your products.")} target="_blank" rel="noopener noreferrer" className="market-button market-button--outline"><MarketIcon name="whatsapp" size={22} />Order on WhatsApp</a>
            </div>
          </div>
        </div>
      </section>

      <section id="collection" aria-labelledby="collection-title" className="market-container market-section market-collection">
        <div className="market-section-heading">
          <div><p className="market-eyebrow">Thoughtfully brought together</p><h2 id="collection-title" className="market-title">Explore the market.</h2><p>Shop available products online and discover what’s coming soon.</p></div>
        </div>
        <HomeProductFeed products={products} />
      </section>

      <HowToOrder shopHref="#collection" />

      {/* What Sets Us Apart */}
      <section className="bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 md:py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-6 md:mb-10">
            <p className="text-green-600 font-semibold text-xs md:text-sm uppercase tracking-wide mb-2">Our Promise</p>
            <h2 className="text-2xl md:text-4xl font-bold text-gray-900">
              What Sets Us Apart
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-3 md:gap-6 lg:grid-cols-4">
            {[
              {
                icon: "🌾",
                title: "Food, Coffee & Home",
                desc: "Ethiopian pantry staples, coffee ceremony pieces and essentials for your home.",
              },
              {
                icon: "💳",
                title: "Online Payment",
                desc: "Add available products to your cart and pay through our website checkout.",
              },
              {
                icon: "💬",
                title: "Personal Support",
                desc: "Talk to us on WhatsApp about products, your order or payment.",
              },
              {
                icon: "🌍",
                title: "Delivery Options",
                desc: "Carefully packed orders, with delivery details confirmed before dispatch.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="group rounded-xl border border-white/80 bg-[linear-gradient(180deg,#ffffff_0%,#fcfaf6_100%)] p-4 text-center shadow-[0_14px_32px_rgba(15,23,42,0.05)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_40px_rgba(15,23,42,0.1)] md:rounded-2xl md:p-8"
              >
                <div className="mb-2 text-3xl md:mb-4 md:text-4xl transition-transform duration-300 group-hover:scale-110">{item.icon}</div>
                <h3 className="mb-1 text-sm font-bold text-gray-900 md:mb-2 md:text-lg group-hover:text-green-700 transition-colors">{item.title}</h3>
                <p className="text-xs leading-relaxed text-gray-500 md:text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="delivery-details" aria-labelledby="delivery-details-title" className="market-container py-10 md:py-16">
        <h2 id="delivery-details-title" className="market-title mb-6 text-3xl md:text-4xl">Delivery details</h2>
        <OrderInformation />
      </section>

      {/* WhatsApp CTA */}
      <section className="py-10 px-4 sm:px-6 lg:px-8 md:py-20">
        <div className="max-w-4xl mx-auto rounded-[2rem] border border-green-100/80 bg-[radial-gradient(circle_at_top,_rgba(34,197,94,0.12),transparent_38%),linear-gradient(180deg,#fbfcf8_0%,#f1f7f0_100%)] px-6 py-10 text-center shadow-[0_24px_60px_rgba(15,23,42,0.06)] md:px-12 md:py-14">
          <h2 className="text-xl md:text-4xl font-bold text-gray-900 mb-3">
            A question before you order?
          </h2>
          <p className="text-gray-500 mb-6 text-sm md:text-lg">
            Ask about a product, payment or your order. We’ll help you arrange the details.
          </p>
          <a
            href={whatsappLink("Hi ZEWID Market! I have a question about ordering, payment or delivery.")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full max-w-xs items-center justify-center gap-2 rounded-full bg-green-500 px-7 py-3.5 text-base font-bold text-white shadow-lg shadow-green-500/25 transition-all hover:bg-green-600 hover:shadow-green-500/40 sm:w-auto md:gap-3 md:px-10 md:py-5 md:text-xl"
          >
            <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Chat on WhatsApp
          </a>
        </div>
      </section>
    </>
  );
}
