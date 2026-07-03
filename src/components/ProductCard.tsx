"use client";

import Image from "next/image";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import ProductModal from "./ProductModal";

interface ProductCardProps {
  name: string;
  description: string;
  weight: string;
  image: string;
  features: string[];
  showDetails?: boolean;
}

export default function ProductCard({
  name,
  description,
  weight,
  image,
  features,
  showDetails = true,
}: ProductCardProps) {
  const { addToCart } = useCart();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Derive a soft glow color based on the product name for the hover effect
  const getGlowColor = () => {
    const n = name.toLowerCase();
    if (n.includes("berbere")) return "group-hover:shadow-red-500/20";
    if (n.includes("buna") || n.includes("coffee")) return "group-hover:shadow-green-500/20";
    if (n.includes("shiro")) return "group-hover:shadow-yellow-500/20";
    return "group-hover:shadow-gray-900/10";
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent opening modal when clicking add to cart
    addToCart({ name, weight, image, quantity: 1 });
  };

  return (
    <>
      <div 
        onClick={() => setIsModalOpen(true)}
        className={`group product-card overflow-hidden rounded-[1rem] border border-slate-100 bg-white shadow-sm hover:shadow-2xl transition-all duration-300 cursor-pointer flex flex-col h-full transform hover:-translate-y-1 ${getGlowColor()}`}
      >
        <div className="relative aspect-[7/6] overflow-hidden bg-white md:aspect-square p-6">
          {/* Subtle background circle that grows on hover */}
          <div className="absolute inset-0 bg-gray-50 rounded-full scale-0 group-hover:scale-150 transition-transform duration-700 ease-out opacity-50 z-0"></div>
          
          <Image
            src={image}
            alt={name}
            fill
            sizes="(max-width: 768px) 50vw, 33vw"
            className="object-contain px-4 pt-4 md:px-6 md:pt-6 z-10 drop-shadow-sm group-hover:drop-shadow-xl group-hover:scale-105 transition-all duration-500"
          />
        </div>
        <div className={`flex flex-col flex-1 bg-white z-10 relative ${showDetails ? "p-4 md:p-6" : "p-4 md:p-5"}`}>
          <h3 className="mb-1 text-sm font-bold leading-snug tracking-tight text-gray-900 md:text-lg group-hover:text-green-700 transition-colors">
            {name}
          </h3>
          <p className="mb-3 text-[11px] font-bold uppercase tracking-wider text-green-600 md:text-xs">
            {weight}
          </p>
          
          {showDetails && (
            <p className="mb-4 hidden text-sm leading-relaxed text-slate-500 md:block line-clamp-2 flex-1">
              {description}
            </p>
          )}

          <div className="mt-auto flex flex-col gap-2">
            <button
              onClick={handleAddToCart}
              className="w-full rounded-full bg-gray-100 hover:bg-gray-900 text-gray-900 hover:text-white px-3 py-2.5 text-center text-xs font-bold transition-all duration-300 md:text-sm flex items-center justify-center gap-2 group/btn"
            >
              <svg className="w-4 h-4 transition-transform group-hover/btn:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Add to Cart
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                window.open(`https://wa.me/358417059015?text=${encodeURIComponent(`Hi ZEWID! I'd like to ask about ${name}.`)}`, "_blank");
              }}
              className="w-full rounded-full bg-green-50 text-green-700 hover:bg-green-600 hover:text-white px-3 py-2.5 transition-all duration-300 flex items-center justify-center gap-1.5 text-xs font-bold md:text-sm"
            >
              <svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              <span>Ask on WhatsApp</span>
            </button>
          </div>
        </div>
      </div>

      <ProductModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        product={{ name, description, weight, image, features }} 
      />
    </>
  );
}
