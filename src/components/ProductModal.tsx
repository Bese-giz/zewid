"use client";

import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { useEffect, useState } from "react";

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    name: string;
    description: string;
    weight: string;
    image: string;
    features: string[];
  };
}

export default function ProductModal({ isOpen, onClose, product }: ProductModalProps) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  // Reset quantity when modal opens
  useEffect(() => {
    if (isOpen) {
      setQuantity(1);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleAddToCart = () => {
    addToCart({
      name: product.name,
      weight: product.weight,
      image: product.image,
      quantity,
    });
    onClose();
  };

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1001] transition-opacity flex items-center justify-center p-4"
        onClick={onClose}
      >
        <div 
          className="bg-white rounded-2xl md:rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden relative flex flex-col md:flex-row transform transition-all"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 bg-white/80 backdrop-blur-md rounded-full text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors shadow-sm"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Left: Image Area */}
          <div className="w-full md:w-1/2 bg-gray-50 relative aspect-square md:aspect-auto flex items-center justify-center p-8">
            {/* Soft background glow based on image contents (simulated) */}
            <div className="absolute inset-0 opacity-20 bg-gradient-to-tr from-green-300 via-transparent to-red-300 blur-3xl"></div>
            
            <div className="relative w-full h-full max-h-[400px]">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>

          {/* Right: Content Area */}
          <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col justify-center">
            <span className="text-sm font-bold text-green-600 uppercase tracking-wider mb-2">
              {product.weight}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
              {product.name}
            </h2>
            
            <p className="text-gray-600 text-lg leading-relaxed mb-6">
              {product.description}
            </p>

            <div className="mb-8">
              <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">Key Features</h4>
              <ul className="space-y-2">
                {product.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-gray-600">
                    <svg className="w-5 h-5 text-green-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex items-center gap-4 mt-auto">
              {/* Quantity Selector */}
              <div className="flex items-center border-2 border-gray-100 rounded-xl bg-white overflow-hidden shrink-0 h-14">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-12 h-full flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-colors text-xl font-medium"
                >
                  -
                </button>
                <span className="w-12 text-center text-lg font-bold text-gray-900">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-12 h-full flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-colors text-xl font-medium"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-100 mt-auto">
              {/* Add to Cart Button */}
              <button 
                onClick={handleAddToCart}
                className="w-full sm:flex-1 bg-gray-900 hover:bg-black text-white h-14 rounded-xl font-bold text-sm md:text-lg flex items-center justify-center gap-2 transition-all hover:shadow-xl hover:-translate-y-0.5"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Add to Cart
              </button>

              {/* Ask on WhatsApp */}
              <button
                onClick={() => {
                  window.open(`https://wa.me/358417059015?text=${encodeURIComponent(`Hi ZEWID! I'd like to ask about ${product.name}.`)}`, "_blank");
                }}
                className="w-full sm:w-auto h-14 px-6 rounded-xl bg-green-50 text-green-700 hover:bg-green-600 hover:text-white transition-all duration-300 flex items-center justify-center gap-2 shadow-sm hover:shadow-md font-bold text-sm md:text-lg"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Ask Us
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
