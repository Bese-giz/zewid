import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import FloatingCart from "@/components/FloatingCart";
import Toast from "@/components/Toast";
import { CartProvider } from "@/context/CartContext";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: {
    default: "ZEWID | ዘውድ – Premium Ethiopian Teff & Products in Finland",
    template: "%s | ZEWID ዘውድ",
  },
  metadataBase: new URL("https://www.zewid.com"),
  description:
    "Premium Ethiopian teff flour, mashila, and traditional products in Finland. We deliver 100% authentic Ethiopian ingredients with fast, reliable delivery all over Finland. Order on WhatsApp.",
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
      "Buy premium Ethiopian white teff, red teff, and mashila. Fast delivery all over Finland.",
    url: "https://www.zewid.com",
    siteName: "ZEWID | ዘውድ",
    locale: "en_FI",
    type: "website",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "ZEWID | ዘውድ – Premium Ethiopian Products in Finland",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ZEWID | ዘውድ – Premium Ethiopian Products in Finland",
    description: "Buy premium Ethiopian white teff, red teff, and mashila. Fast delivery all over Finland.",
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
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} bg-white antialiased text-gray-900`}>
        <CartProvider>
          <Header />
          <main className="min-h-screen flex flex-col">
            {children}
          </main>
          <Footer />
          <WhatsAppFloat />
          <FloatingCart />
          <Toast />
        </CartProvider>
      </body>
    </html>
  );
}
