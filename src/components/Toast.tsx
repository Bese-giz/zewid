"use client";

import { useCart } from "@/context/CartContext";
import { useEffect } from "react";

export default function Toast() {
  const { toastMessage, setToastMessage, setIsCartOpen } = useCart();

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage, setToastMessage]);

  if (!toastMessage) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[1005] animate-[fade-in-up_0.3s_ease-out_forwards] w-max max-w-[95vw]">
      <div className="bg-gray-900 text-white px-4 md:px-5 py-3 md:py-3.5 rounded-full shadow-2xl shadow-gray-900/30 flex items-center justify-between gap-3 md:gap-4 text-xs md:text-sm font-medium border border-gray-800">
        <svg className="w-5 h-5 text-green-400 shrink-0 hidden sm:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
        </svg>
        <span className="truncate">{toastMessage}</span>
        <button 
          onClick={() => {
            setToastMessage(null);
            setIsCartOpen(true);
          }}
          className="text-green-400 font-bold uppercase tracking-wider text-xs ml-2 hover:text-green-300 transition-colors shrink-0"
        >
          View Cart
        </button>
      </div>
    </div>
  );
}
