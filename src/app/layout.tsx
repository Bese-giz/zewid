import type { Metadata } from "next";
import { Inter, Syne } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";

const inter = Inter({ subsets: ["latin"], display: "swap" });

const syne = Syne({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-syne",
});

export const metadata: Metadata = {
  title: {
    default: "ZEWID | ዘውድ – Premium Ethiopian Teff & Products in Finland",
    template: "%s | ZEWID ዘውድ",
  },
  description:
    "Buy premium Ethiopian white teff, brown teff, mashila (sorghum) and traditional Ethiopian ingredients in Finland. Fast, reliable delivery all over Finland. Order on WhatsApp.",
  keywords: [
    "Ethiopian teff Finland",
    "buy teff flour Finland",
    "white teff Finland",
    "brown teff Finland",
    "injera flour Finland",
    "Ethiopian products Finland",
    "Ethiopian grocery Finland",
    "teff delivery Finland",
    "mashila sorghum Finland",
    "ZEWID",
    "ዘውድ",
  ],
  openGraph: {
    title: "ZEWID | ዘውድ – Premium Ethiopian Products in Finland",
    description:
      "High-quality white teff, brown teff, mashila and traditional Ethiopian ingredients with fast, reliable delivery all over Finland.",
    url: "https://www.zewid.com",
    locale: "en_FI",
    type: "website",
    siteName: "ZEWID | ዘውድ",
    images: [
      {
        url: "https://www.zewid.com/opengraph-image.jpg",
        width: 1200,
        height: 630,
        alt: "ZEWID | ዘውድ – Premium Ethiopian Products in Finland",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    languages: {
      en: "/",
      am: "/",
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${syne.variable} min-h-screen flex flex-col text-gray-900 antialiased`}>
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <WhatsAppFloat />
      </body>
    </html>
  );
}
