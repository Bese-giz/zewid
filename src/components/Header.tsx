"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { productCategories } from "@/data/products";
import { useCart } from "@/context/CartContext";
import AnnouncementBar from "./AnnouncementBar";
import BrandMark from "./BrandMark";
import MarketIcon from "./MarketIcon";

const shopLinks = [{ href: "/products", label: "Shop all" }, ...productCategories.map(category => ({ href: `/products?category=${category.id}`, label: category.name }))];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { items, isCartOpen, setIsCartOpen } = useCart();
  const count = items.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    if (!isOpen) return;
    const close = (event: KeyboardEvent) => { if (event.key === "Escape") setIsOpen(false); };
    document.addEventListener("keydown", close);
    return () => document.removeEventListener("keydown", close);
  }, [isOpen]);

  return (
    <>
      <AnnouncementBar />
      <header className="market-header">
        <div className="market-container market-header__main">
          <Link href="/" aria-label="ZEWID Market home" className="market-header__brand" onClick={() => setIsOpen(false)}><BrandMark /></Link>
          <div className="market-header__actions">
            <abbr title="English" className="market-header__language">EN</abbr>
            <button type="button" className="market-icon-button market-header__cart" onClick={() => { setIsOpen(false); setIsCartOpen(true); }}
              aria-label={`Open cart, ${count} ${count === 1 ? "item" : "items"}`} aria-haspopup="dialog" aria-controls="cart-dialog" aria-expanded={isCartOpen}>
              <MarketIcon name="bag" size={27} /><span className="market-cart-count" aria-hidden="true">{count}</span>
            </button>
            <button type="button" className="market-icon-button market-header__menu" onClick={() => setIsOpen(current => !current)} aria-label={isOpen ? "Close menu" : "Open menu"} aria-expanded={isOpen} aria-controls="mobile-navigation">
              <MarketIcon name={isOpen ? "close" : "menu"} size={24} />
            </button>
          </div>
        </div>
        {isOpen && <nav id="mobile-navigation" aria-label="Mobile navigation" className="market-mobile-menu">
          <div className="market-container">
            {shopLinks.map(link => <Link key={link.href} href={link.href} onClick={() => setIsOpen(false)}>{link.label}<MarketIcon name="arrow" size={16} /></Link>)}
            <div className="market-mobile-menu__secondary"><Link href="/about" onClick={() => setIsOpen(false)}>Our story</Link><Link href="/contact" onClick={() => setIsOpen(false)}>Contact</Link></div>
          </div>
        </nav>}
      </header>
      <div className="market-navigation-band">
        <nav className="market-container market-desktop-nav" aria-label="Shop navigation">
          <div>{shopLinks.map(link => <Link key={link.href} href={link.href}>{link.label}</Link>)}</div>
          <div><Link href="/about">Our story</Link><Link href="/contact">Contact</Link></div>
        </nav>
      </div>
    </>
  );
}
