import Link from "next/link";
import Image from "next/image";
import HomeProductFeed from "@/components/HomeProductFeed";
import MarketIcon from "@/components/MarketIcon";
import { products, productCategories } from "@/data/products";
import { pageMetadata } from "@/lib/metadata";
import { site, whatsappLink } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Your Ethiopian Market in Finland",
  description: `Food, coffee and home essentials, thoughtfully brought together for life in Finland. Explore ZEWID Market. Nationwide delivery for €${site.deliveryFeeEur.toFixed(2)} per order.`,
  path: "/",
});

const categoryImages = {
  food: "/images/berbere_enhanced_transparent.png",
  coffee: "/images/coffee-set-18-piece.png",
  kitchen: "/images/food-warmer-3-dish.png",
  culture: "/images/meshrefet-basket.png",
};

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
            <p className="market-hero__description">Food, coffee and home essentials, thoughtfully brought together for life in Finland.</p>
            <div className="market-hero__buttons">
              <Link href="#collection" className="market-button market-button--primary">Shop the collection <MarketIcon name="arrow" size={21} /></Link>
              <a href={whatsappLink("Hi ZEWID Market! I would like to ask about your products.")} target="_blank" rel="noopener noreferrer" className="market-button market-button--outline"><MarketIcon name="whatsapp" size={22} />Order on WhatsApp</a>
            </div>
          </div>
        </div>
      </section>

      <section className="market-trust" aria-label="The ZEWID Market promise">
        <div className="market-container market-trust__grid">
          <div><MarketIcon name="truck" size={34} /><span>Delivery across Finland</span></div>
          <div><MarketIcon name="leaf" size={34} /><span>Food, coffee &amp; home</span></div>
          <a href={whatsappLink()} target="_blank" rel="noopener noreferrer"><MarketIcon name="whatsapp" size={32} /><span>Personal WhatsApp support</span></a>
        </div>
      </section>

      <section className="market-container market-section" aria-labelledby="market-categories-title">
        <div className="market-section-heading">
          <p className="market-eyebrow">Familiar favourites. New discoveries.</p>
          <h2 id="market-categories-title" className="market-title">A market for life’s familiar moments.</h2>
          <p>From everyday cooking to the joy of gathering together.</p>
        </div>
        <div className="market-category-grid">
          {productCategories.map(category => <Link key={category.id} href={`/products?category=${category.id}`} className="market-category-card">
            <div className="market-category-card__image"><Image src={categoryImages[category.id]} alt="" fill sizes="(max-width: 767px) 50vw, 300px" className="object-contain p-4 transition-transform duration-300 group-hover:scale-105" /></div>
            <div className="market-category-card__label"><h3>{category.name}</h3><MarketIcon name="arrow" size={19} /></div>
            <span>{products.filter(product => product.category === category.id).length} products to explore</span>
          </Link>)}
        </div>
      </section>

      <section id="collection" aria-labelledby="collection-title" className="market-container market-section market-collection">
        <div className="market-section-heading market-section-heading--collection">
          <div><p className="market-eyebrow">Thoughtfully brought together</p><h2 id="collection-title" className="market-title">Explore the market.</h2><p>Everyday essentials and coming-soon finds. More to discover as you scroll.</p></div>
          <span className="market-delivery-note"><MarketIcon name="truck" size={18} />€{site.deliveryFeeEur.toFixed(2)} delivery across Finland</span>
        </div>
        <HomeProductFeed products={products} />
      </section>

      <section className="market-story" aria-labelledby="market-story-title">
        <div className="market-container market-story__grid">
          <div className="market-story__image"><Image src="/images/coffee-set-23-piece.png" alt="Traditional Ethiopian coffee ceremony serving set" fill sizes="(max-width: 767px) 100vw, 550px" className="object-contain p-8 md:p-12" /></div>
          <div className="market-story__copy"><p className="market-eyebrow">A little closer to home</p><h2 id="market-story-title" className="market-title">Tradition, with a place in everyday life.</h2><p>From a bag of teff for the week to the little details of a coffee ceremony, we bring familiar essentials together in one place.</p><p>ZEWID Market is growing beyond the pantry, with food, coffee and pieces for your home. Browse at your own pace, or talk to us on WhatsApp.</p><Link href="/about" className="market-text-link">Our story <MarketIcon name="arrow" size={18} /></Link></div>
        </div>
      </section>

      <section className="market-container market-help" aria-labelledby="market-help-title">
        <div><p className="market-eyebrow">A real conversation, whenever you need it</p><h2 id="market-help-title" className="market-title">Not sure where to start?</h2><p>Ask about a product, a coming-soon item or your delivery. We’re happy to help.</p></div>
        <a href={whatsappLink("Hi ZEWID Market! I have a question.")} target="_blank" rel="noopener noreferrer" className="market-button market-button--primary"><MarketIcon name="whatsapp" />Let’s talk on WhatsApp</a>
      </section>
    </>
  );
}
