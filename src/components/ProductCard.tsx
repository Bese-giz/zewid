"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import type { Product } from "@/data/products";
import { whatsappLink } from "@/lib/site";
import ProductAvailability from "./ProductAvailability";

interface ProductCardProps extends Product {
  showDetails?: boolean;
}

export default function ProductCard({ showDetails = true, ...product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { slug, name, description, weight, image, availability } = product;
  const available = availability === "in-stock";

  return (
    <article className="group product-card flex h-full flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
      <Link href={`/products/${slug}`} aria-label={`View ${name}`} className="relative block aspect-[7/6] overflow-hidden bg-white md:aspect-square">
        <div className="absolute inset-0 rounded-full bg-gray-50 opacity-50 scale-0 transition-transform duration-700 group-hover:scale-150" />
        <Image src={image} alt={name} fill
          sizes="(max-width: 1023px) 50vw, (max-width: 1280px) 33vw, 400px"
          className="object-contain px-4 pt-4 md:px-6 md:pt-6 drop-shadow-sm transition-transform duration-500 group-hover:scale-105" />
      </Link>
      <div className={`relative flex flex-1 flex-col ${showDetails ? "p-4 md:p-6" : "p-4 md:p-5"}`}>
        <h3 className="mb-1 text-sm font-bold leading-snug text-gray-900 md:text-lg">
          <Link href={`/products/${slug}`} className="hover:text-green-700">{name}</Link>
        </h3>
        <p className="mb-3 text-[11px] font-bold uppercase tracking-wider text-green-700 md:text-xs">{weight}</p>
        <ProductAvailability product={product} />
        {showDetails && <p className="mb-4 hidden flex-1 text-sm leading-relaxed text-slate-600 md:line-clamp-2">{description}</p>}
        <div className="mt-auto flex flex-col gap-2">
          <button type="button" onClick={() => addToCart(slug)} disabled={!available}
            aria-label={available ? `Add ${name} to cart` : `${name} is currently unavailable`}
            className="w-full rounded-full bg-gray-100 px-3 py-2.5 text-xs font-bold text-gray-900 transition-colors hover:bg-gray-900 hover:text-white disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500 md:text-sm">
            {available ? "Add to Cart" : "Unavailable"}
          </button>
          <a href={whatsappLink(`Hi ZEWID! I'd like to ask about ${name}${available ? ", including its price" : " and when it will be available again"}.`)}
            target="_blank" rel="noopener noreferrer"
            className="w-full rounded-full bg-green-50 px-3 py-2.5 text-center text-xs font-bold text-green-800 transition-colors hover:bg-green-700 hover:text-white md:text-sm">
            Ask on WhatsApp
          </a>
        </div>
      </div>
    </article>
  );
}
