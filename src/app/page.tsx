import Link from "next/link";
import ProductCard from "@/components/ProductCard";
const featuredProducts = [
  {
    name: "White Teff Flour",
    weight: "5 kg",
    description:
      "Premium Ethiopian white teff flour for baking authentic injera. Finely milled and imported directly from Ethiopia.",
    image: "/images/white_teff_bag_transparent_enhanced.png",
    features: [
      "100% Ethiopian white teff",
      "Perfect for authentic injera",
      "Fast, reliable delivery all over Finland",
      "Ideal for injera",
    ],
  },
  {
    name: "Red Teff Flour",
    weight: "5 kg",
    description:
      "Rich, nutty red teff flour for traditional Ethiopian injera. Full-bodied flavor with excellent nutritional value.",
    image: "/images/red_teff_flour_enhanced_transparent.png",
    features: [
      "100% Ethiopian red teff",
      "High in iron and fiber",
      "High in iron & calcium",
      "Perfect for dark injera",
    ],
  },
  {
    name: "Mashila (Sorghum)",
    weight: "5 kg",
    description:
      "High-quality whole grain mashila (sorghum). Perfect for mixing with teff to make traditional Ethiopian injera or porridge.",
    image: "/images/mashila.png",
    features: [
      "Premium quality sorghum",
      "Versatile cooking grain",
      "Fresh import",
    ],
  },
  {
    name: "Berbere",
    weight: "1 kg pack",
    description:
      "Authentic Ethiopian Berbere spice blend. Rich, flavorful, and perfect for wot (stews).",
    image: "/images/berbere_enhanced_transparent.png",
    features: [
      "Authentic Ethiopian spice",
      "Rich flavor",
      "Perfect for wot",
    ],
  },
  {
    name: "Buna (Coffee)",
    weight: "1 kg pack",
    description:
      "Premium Ethiopian coffee beans (Buna). Experience the birthplace of coffee with this rich, aromatic blend.",
    image: "/images/green_coffee_beans_enhanced_transparent.png",
    features: [
      "Premium Ethiopian coffee",
      "Rich aroma",
      "Traditional buna",
    ],
  },
  {
    name: "Shiro",
    weight: "1 kg pack",
    description:
      "Traditional Ethiopian Shiro powder. Easy to prepare and makes a delicious, savory stew.",
    image: "/images/shiro_enhanced_transparent.png",
    features: [
      "Traditional shiro powder",
      "Easy to prepare",
      "Delicious flavor",
    ],
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative flex min-h-[75vh] items-center justify-center md:min-h-[90vh] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center animate-[pulse_10s_ease-in-out_infinite] scale-105 transform origin-center"
          style={{
            backgroundImage:
              "url('/images/hero-injera.jpg')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/80" />
        <div className="relative z-10 mx-auto max-w-3xl px-5 text-center sm:px-6 w-full">
          <div className="mb-6 inline-block rounded-full border border-white/20 bg-white/10 px-4 py-1.5 backdrop-blur-md animate-[fade-in-up_0.8s_ease-out_forwards]">
            <span className="text-white/95 text-[11px] md:text-sm font-semibold uppercase tracking-wider">🇪🇹 Authentic Ethiopian Products 🇫🇮</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold text-white mb-4 md:mb-6 leading-[1.1] tracking-tight drop-shadow-xl opacity-0 animate-[fade-in-up_0.8s_ease-out_forwards]" style={{ animationDelay: '100ms' }}>
            Premium Ethiopian<br />
            <span className="text-amber-400">Teff & Grains</span>
          </h1>
          <p className="text-[15px] md:text-xl text-white/90 mb-8 md:mb-10 max-w-2xl mx-auto leading-relaxed font-medium drop-shadow-md opacity-0 animate-[fade-in-up_0.8s_ease-out_forwards]" style={{ animationDelay: '200ms' }}>
            High-quality white teff, red teff, mashila and traditional Ethiopian ingredients with fast, reliable delivery all over Finland.
          </p>
          <div className="mx-auto flex flex-col gap-4 sm:flex-row sm:justify-center w-full max-w-xs sm:max-w-none opacity-0 animate-[fade-in-up_0.8s_ease-out_forwards]" style={{ animationDelay: '300ms' }}>
            <a
              href="https://wa.me/358417059015?text=Hi%20ZEWID!%20I%20would%20like%20to%20order"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full rounded-2xl bg-green-600 px-6 py-4 text-[16px] font-bold text-white shadow-lg transition-all hover:bg-green-500 hover:shadow-green-500/30 hover:-translate-y-1 sm:w-auto md:px-10 md:py-4 md:text-lg flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
              Order Now
            </a>
            <Link
              href="/products"
              className="w-full rounded-2xl border-2 border-white/60 bg-black/20 backdrop-blur-sm px-6 py-4 text-[16px] font-bold text-white transition-all hover:border-white hover:bg-white hover:text-gray-900 sm:w-auto md:px-10 md:py-4 md:text-lg flex items-center justify-center"
            >
              View Products
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="max-w-7xl mx-auto px-4 py-10 sm:px-6 lg:px-8 md:py-20">
        <div className="text-center mb-8 md:mb-10">
          <p className="text-green-600 font-semibold text-sm uppercase tracking-wide mb-2">Our Selection</p>
          <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-3">
            Premium Products
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Authentic Ethiopian teff and grains, imported directly from Ethiopia
            and available with fast, reliable delivery all over Finland.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3 md:gap-6 lg:grid-cols-3 lg:gap-8">
          {featuredProducts.map((product) => (
            <ProductCard key={product.name} {...product} />
          ))}
        </div>
        <div className="text-center mt-8 md:mt-10">
          <Link
            href="/products"
            className="inline-flex w-full max-w-xs items-center justify-center rounded-full bg-gray-900 px-8 py-3.5 font-semibold text-white transition-colors hover:bg-gray-800 sm:w-auto"
          >
            View All Products
          </Link>
        </div>
      </section>

      {/* How To Order */}
      <section className="bg-[linear-gradient(180deg,rgba(252,250,246,0.55)_0%,rgba(240,247,241,0.9)_100%)] py-10 px-4 sm:px-6 lg:px-8 md:py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-8 md:mb-10">
            <p className="text-green-600 font-semibold text-xs md:text-sm uppercase tracking-[0.24em] mb-3">
              Simple Ordering
            </p>
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 leading-tight">
              Ordering Should Feel Easy
            </h2>
            <p className="mt-4 text-sm md:text-lg leading-relaxed text-slate-500">
              Choose your products, send us a message, and we&apos;ll take care of the rest with fast, reliable delivery all over Finland.
            </p>
          </div>

          <div className="grid gap-4 md:gap-6 lg:grid-cols-3">
            {[
              {
                step: "01",
                title: "Choose Your Products",
                desc: "Pick the teff, mashila, or combo pack you want from our collection.",
              },
              {
                step: "02",
                title: "Send Us A Message",
                desc: "Place your order on WhatsApp and confirm your quantity and delivery details.",
              },
              {
                step: "03",
                title: "Receive Your Delivery",
                desc: "We prepare your order and arrange fast, reliable delivery all over Finland.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="group rounded-[1.5rem] border border-white/90 bg-[linear-gradient(180deg,#ffffff_0%,#fcfaf6_100%)] p-5 shadow-[0_16px_36px_rgba(15,23,42,0.06)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_24px_48px_rgba(34,197,94,0.12)] md:p-6"
              >
                <div className="mb-4 h-1.5 w-16 rounded-full bg-green-500/80" />
                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-green-700">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-green-500 text-[10px] text-white transition-transform duration-300 group-hover:scale-110 group-hover:bg-green-600">
                    {item.step}
                  </span>
                  Step {item.step}
                </div>
                <h3 className="text-xl md:text-2xl font-bold leading-tight text-slate-900 transition-colors group-hover:text-green-700">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm md:text-base leading-relaxed text-slate-500">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center md:mt-10">
            <a
              href="https://wa.me/358417059015?text=Hi%20ZEWID!%20I%20would%20like%20to%20order"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full max-w-xs items-center justify-center rounded-full bg-green-500 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-green-500/20 transition-colors hover:bg-green-600 sm:w-auto md:text-base"
            >
              Start Your Order
            </a>
          </div>
        </div>
      </section>

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
                title: "Premium Quality",
                desc: "100% authentic Ethiopian teff, directly imported from Ethiopia.",
              },
              {
                icon: "🚚",
                title: "Fast Delivery",
                desc: "Fast, reliable delivery all over Finland, straight to your door.",
              },
              {
                icon: "💬",
                title: "Easy Ordering",
                desc: "Order through WhatsApp. Quick, personal, convenient.",
              },
              {
                icon: "⭐",
                title: "Trusted Brand",
                desc: "Serving Ethiopian families and restaurants all over Finland.",
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



      {/* Delivery Info Section */}
      <section className="py-10 px-4 sm:px-6 lg:px-8 md:py-20">
        <div className="max-w-6xl mx-auto">
          <div className="relative overflow-hidden rounded-[2rem] border border-green-100 bg-[radial-gradient(circle_at_top_left,_rgba(34,197,94,0.16),transparent_34%),radial-gradient(circle_at_bottom_right,_rgba(250,204,21,0.12),transparent_28%),linear-gradient(180deg,#f8fcf8_0%,#eef7f1_100%)] px-5 py-6 text-slate-900 shadow-[0_24px_60px_rgba(15,23,42,0.08)] md:px-10 md:py-10">
            <div className="absolute -left-16 top-10 h-40 w-40 rounded-full bg-emerald-400/10 blur-3xl" />
            <div className="absolute -right-10 bottom-0 h-56 w-56 rounded-full bg-yellow-300/10 blur-3xl" />
            <div className="relative grid items-center gap-6 md:grid-cols-[1.2fr_0.9fr] md:gap-10">
              <div>
                <span className="inline-flex rounded-full border border-green-200 bg-white/75 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-green-800 md:text-xs">
                  Nationwide Delivery
                </span>
                <h2 className="mt-4 text-2xl font-bold leading-tight text-slate-900 md:text-5xl">
                  Reliable Delivery All Over Finland 🇫🇮
                </h2>
                <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-600 md:text-lg">
                  Fresh Ethiopian products packed carefully and delivered all over Finland with direct WhatsApp support from order to arrival.
                </p>
                <p className="mt-3 text-sm text-green-800 md:text-base">
                  በመላው ፊንላንድ ፈጣን፣ አስተማማኝ እና ምቹ ዴሊቨሪ
                </p>
                <div className="mt-6 flex max-w-xs flex-col gap-3 sm:max-w-none sm:flex-row sm:flex-wrap">
                  <a
                    href="https://wa.me/358417059015?text=Hi%20ZEWID!%20I%20would%20like%20to%20order"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-full items-center justify-center rounded-full bg-green-500 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-green-600 sm:w-auto"
                  >
                    Order On WhatsApp
                  </a>
                  <Link
                    href="/products"
                    className="inline-flex w-full items-center justify-center rounded-full border border-slate-300 bg-white/70 px-5 py-3 text-sm font-semibold text-slate-900 transition-colors hover:bg-white sm:w-auto"
                  >
                    Browse Products
                  </Link>
                </div>
              </div>
              <div className="grid gap-3 md:gap-4">
                {[
                  {
                    title: "Next-Day Dispatch",
                    desc: "Fast preparation and quick handoff for smooth delivery.",
                  },
                  {
                    title: "Coverage All Over Finland",
                    desc: "Orders arranged for customers all over Finland.",
                  },
                  {
                    title: "Direct Order Updates",
                    desc: "Speak with us on WhatsApp for confirmation, timing, and support.",
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="group rounded-2xl border border-green-100 bg-white/85 p-4 shadow-sm transition-all duration-300 hover:-translate-x-1 hover:border-green-300 hover:shadow-md md:p-5"
                  >
                    <h3 className="text-base font-semibold text-slate-900 transition-colors group-hover:text-green-700 md:text-lg">{item.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-slate-500">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WhatsApp CTA */}
      <section className="py-10 px-4 sm:px-6 lg:px-8 md:py-20">
        <div className="max-w-4xl mx-auto rounded-[2rem] border border-green-100/80 bg-[radial-gradient(circle_at_top,_rgba(34,197,94,0.12),transparent_38%),linear-gradient(180deg,#fbfcf8_0%,#f1f7f0_100%)] px-6 py-10 text-center shadow-[0_24px_60px_rgba(15,23,42,0.06)] md:px-12 md:py-14">
          <h2 className="text-xl md:text-4xl font-bold text-gray-900 mb-3">
            Ready to Order?
          </h2>
          <p className="text-gray-500 mb-6 text-sm md:text-lg">
            Send us a message on WhatsApp and we&apos;ll get your order ready for
            fast, reliable delivery all over Finland.
          </p>
          <a
            href="https://wa.me/358417059015?text=Hi%20ZEWID!%20I%20would%20like%20to%20order"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full max-w-xs items-center justify-center gap-2 rounded-full bg-green-500 px-7 py-3.5 text-base font-bold text-white shadow-lg shadow-green-500/25 transition-all hover:bg-green-600 hover:shadow-green-500/40 sm:w-auto md:gap-3 md:px-10 md:py-5 md:text-xl"
          >
            <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Order on WhatsApp
          </a>
        </div>
      </section>
    </>
  );
}
