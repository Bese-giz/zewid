import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Contact ZEWID | ዘውድ for Ethiopian teff and product orders in Finland. Reach us on WhatsApp, Facebook, or TikTok.",
};

export default function ContactPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-green-600 font-semibold text-sm uppercase tracking-wide mb-3">Get in Touch</p>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Contact Us
          </h1>
          <p className="text-gray-500 text-lg">
            We&apos;re here to help with orders and questions
          </p>
        </div>
      </section>

      {/* Contact Options */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* WhatsApp - Primary */}
          <div className="md:col-span-2 bg-green-50 rounded-2xl p-8 border border-green-100">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/20">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                </div>
              </div>
              <div className="text-center md:text-left flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  WhatsApp Business
                </h2>
                <p className="text-gray-500 mb-4">
                  The fastest way to reach us. Order products, ask questions, or get delivery updates anywhere in Finland.
                </p>
                <a
                  href="https://wa.me/358417059015?text=Hi%20ZEWID!"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-full font-bold transition-colors text-sm"
                >
                  Message us on WhatsApp
                </a>
              </div>
            </div>
          </div>

          {/* TikTok */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-11 h-11 bg-gray-900 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.88 2.89 2.89 0 01-2.88-2.88 2.89 2.89 0 012.88-2.88c.28 0 .56.04.82.11V9.4a6.33 6.33 0 00-.82-.05A6.34 6.34 0 003.15 15.7a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V9.19a8.16 8.16 0 004.76 1.53v-3.4a4.85 4.85 0 01-1-.63z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-gray-900">TikTok</h3>
                <p className="text-sm text-gray-400">@zewid</p>
              </div>
            </div>
            <p className="text-gray-500 text-sm mb-4">
              Follow us for injera tips, product highlights, and behind-the-scenes content.
            </p>
            <a
              href="https://www.tiktok.com/@zewid"
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-600 hover:text-green-700 font-semibold text-sm"
            >
              Follow on TikTok →
            </a>
          </div>

          {/* Facebook */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-11 h-11 bg-blue-600 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Facebook</h3>
                <p className="text-sm text-gray-400">ZEWID | ዘውድ</p>
              </div>
            </div>
            <p className="text-gray-500 text-sm mb-4">
              Like our page for updates, promotions, and community news.
            </p>
            <a
              href="https://www.facebook.com/zewid"
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-600 hover:text-green-700 font-semibold text-sm"
            >
              Follow on Facebook →
            </a>
          </div>
        </div>

        {/* Business Hours */}
        <div className="mt-12 bg-gray-50 rounded-2xl p-8 border border-gray-100 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Business Hours
          </h2>
          <p className="text-gray-600 mb-2">
            WhatsApp messages: <span className="font-semibold">Available daily</span>
          </p>
          <p className="text-gray-600 mb-2">
            Order processing: <span className="font-semibold">Monday – Saturday</span>
          </p>
          <p className="text-gray-400 text-sm mt-4">
            We typically respond within a few hours during business days.
          </p>
        </div>
      </section>
    </>
  );
}
