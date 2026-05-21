"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/70 bg-[#fdfbf6]/88 text-gray-900 shadow-[0_12px_28px_rgba(15,23,42,0.05)] backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/images/logo.png"
              alt="ZEWID | ዘውድ"
              width={160}
              height={64}
              className="h-12 md:h-16 w-auto"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-slate-600 hover:text-green-700 transition-colors font-medium text-sm"
              >
                {link.label}
              </Link>
            ))}
            <a
              href="https://wa.me/358417059015?text=Hi%20ZEWID!%20I%20would%20like%20to%20order"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-green-600 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(22,163,74,0.22)] transition-colors hover:bg-green-700"
            >
              Order on WhatsApp
            </a>
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden rounded-full p-2 text-slate-700 transition-colors hover:bg-white/70"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

      {/* Mobile Navigation */}
        {isOpen && (
          <nav className="md:hidden border-t border-amber-100/80 bg-[#fffdf8]/95 px-4 pb-4 shadow-[0_18px_40px_rgba(15,23,42,0.06)]">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block border-b border-amber-50 py-3 font-medium text-slate-700 transition-colors hover:text-green-700 last:border-0"
              >
                {link.label}
              </Link>
            ))}
            <a
              href="https://wa.me/358417059015?text=Hi%20ZEWID!%20I%20would%20like%20to%20order"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 block rounded-full bg-green-600 px-5 py-3 text-center font-semibold text-white shadow-[0_10px_24px_rgba(22,163,74,0.2)] transition-colors hover:bg-green-700"
            >
              Order on WhatsApp
            </a>
          </nav>
        )}
      </div>
    </header>
  );
}
