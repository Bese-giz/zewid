import Link from "next/link";
import { productCategories } from "@/data/products";
import { site, whatsappLink } from "@/lib/site";
import BrandMark from "./BrandMark";
import MarketIcon from "./MarketIcon";

export default function Footer() {
  return (
    <footer className="market-footer">
      <div className="market-container">
        <div className="market-footer__grid">
          <div className="market-footer__intro"><Link href="/" aria-label="ZEWID Market home"><BrandMark /></Link><p>Your Ethiopian market, closer to home. Food, coffee and home essentials for everyday life.</p></div>
          <div><h3>Shop the market</h3><ul><li><Link href="/products">Shop all products</Link></li>{productCategories.map(category => <li key={category.id}><Link href={`/products?category=${category.id}`}>{category.name}</Link></li>)}</ul></div>
          <div><h3>Here for you</h3><ul><li><Link href="/about">Our story</Link></li><li><Link href="/contact">Contact us</Link></li><li><Link href="/feedback">Share your feedback</Link></li><li><a href={whatsappLink()} target="_blank" rel="noopener noreferrer">Delivery &amp; order questions</a></li></ul></div>
          <div><h3>Let’s stay connected</h3><ul><li><a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="market-footer__whatsapp"><MarketIcon name="whatsapp" size={18} />WhatsApp</a></li><li><a href="https://www.tiktok.com/@zewid.teff?_r=1&_t=ZN-96XftlHurpu" target="_blank" rel="noopener noreferrer">TikTok</a></li><li><a href="https://www.facebook.com/share/18fkuFhBQe/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer">Facebook</a></li></ul></div>
        </div>
        <div className="market-footer__bottom"><p>&copy; 2026 {site.name}. All rights reserved.</p><p>Rooted in tradition. Made for everyday.</p></div>
      </div>
    </footer>
  );
}
