"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { isProductPurchasable, type Product } from "@/data/products";
import { whatsappLink } from "@/lib/site";
import ProductAvailability from "./ProductAvailability";
import ProductStatusTag from "./ProductStatusTag";
import { getProductCardName } from "@/lib/product-display";

export default function ProductCard(product: Product) {
  const { addToCart } = useCart();
  const { slug, name, weight, image } = product;
  const available = isProductPurchasable(product);

  return (
    <article className="group product-card flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-[#e8e9e2] bg-white">
      <Link href={`/products/${slug}`} aria-label={`View ${name}`} className="product-card-photo relative m-2 mb-0 block aspect-[6/5] overflow-hidden rounded-xl bg-[#f8f8f3] md:m-3 md:mb-0">
        <Image src={image} alt={name} fill draggable={false} sizes="(max-width: 1023px) 50vw, (max-width: 1280px) 33vw, 400px"
          className="object-contain p-3 transition-transform duration-300 group-hover:scale-[1.025] md:p-5" />
      </Link>
      <div className="relative flex flex-1 flex-col p-3 pt-4 md:p-5">
        <h3 className="text-sm font-semibold leading-snug tracking-[-0.015em] text-slate-900 md:text-base">
          <Link href={`/products/${slug}`} aria-label={name} className="hover:text-green-800">{getProductCardName(product)}</Link>
        </h3>
        <p className="mt-1 text-[11px] leading-relaxed text-slate-500 md:text-xs">{weight}</p>
        <div className="mb-3 mt-3"><ProductAvailability product={product} compact /></div>
        <div className="mt-auto flex flex-col gap-1.5 border-t border-[#f0f0e9] pt-3">
          {available && <button type="button" onClick={() => addToCart(slug)} aria-label={`Add ${name} to cart`}
            className="flex min-h-10 w-full items-center justify-center gap-2 rounded-xl bg-[#173f31] px-2 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-[#245b46] md:text-sm">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>Add to cart
          </button>}
          {!available && <ProductStatusTag availability={product.availability} />}
          <a href={whatsappLink(`Hi ZEWID! I'd like to ask about ${name}${available ? ", delivery and ordering" : ", its price and when it will be available"}.`)}
            target="_blank" rel="noopener noreferrer"
            className="flex min-h-8 w-full items-center justify-center py-1.5 text-[11px] font-medium text-green-800 underline-offset-4 hover:underline md:text-xs">
            Ask on WhatsApp
          </a>
        </div>
      </div>
    </article>
  );
}
