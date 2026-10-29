import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import FloatingCart from "@/components/FloatingCart";
import Toast from "@/components/Toast";
import { CartProvider } from "@/context/CartContext";
import { site } from "@/lib/site";
import { checkoutMode } from "@/lib/stripe";
import { postnordPickupEnabled } from "@/lib/postnord";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: {
    default: "ZEWID | ዘውድ – Premium Ethiopian Teff & Products in Finland",
    template: "%s | ZEWID ዘውድ",
  },
  metadataBase: new URL(site.url),
  description:
    "Ethiopian teff, coffee and spices in Finland, with upcoming injera makers, coffee ceremony accessories, serving sets and cultural products. Shop online or ask on WhatsApp.",
  keywords: [
    "Ethiopian teff Finland",
    "buy injera flour Helsinki",
    "Ethiopian products Finland",
    "white teff Finland",
    "red teff Finland",
    "mashila sorghum Finland",
    "Ethiopian food delivery Finland",
  ],
  openGraph: {
    title: "ZEWID | ዘውድ – Premium Ethiopian Products in Finland",
    description:
      "Ethiopian food, coffee and spices, with a growing collection of coffee ceremony and home essentials in Finland.",
    url: site.url,
    siteName: site.name,
    locale: "en_FI",
    type: "website",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1536,
        height: 1024,
        alt: "ZEWID | ዘውድ – Premium Ethiopian Products in Finland",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ZEWID | ዘውድ – Premium Ethiopian Products in Finland",
    description: "Ethiopian food, coffee and spices, with a growing collection of coffee ceremony and home essentials in Finland.",
    images: ["/opengraph-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "ZEWID | ዘውድ",
    "image": `${site.url}/opengraph-image.png`,
    "description": "Ethiopian food, coffee and spices, coffee ceremony accessories and home essentials in Finland.",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Helsinki",
      "addressCountry": "FI"
    },
    "url": site.url,
    "telephone": `+${site.phone}`,
    "priceRange": "$$"
  };

  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${inter.className} bg-white antialiased text-gray-900`}>
        <CartProvider>
          <Header />
          <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[1006] focus:rounded-lg focus:bg-white focus:px-4 focus:py-3 focus:font-semibold focus:text-green-800">Skip to content</a>
          <main id="main-content" tabIndex={-1} className="min-h-screen flex flex-col">
            {children}
          </main>
          <Footer />
          <WhatsAppFloat />
          <FloatingCart checkoutMode={checkoutMode()} pickupEnabled={postnordPickupEnabled()} />
          <Toast />
        </CartProvider>
      </body>
    </html>
  );
}
