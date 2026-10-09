"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { getProductBySlug, products } from "@/data/products";
import { whatsappLink } from "@/lib/site";

export const MAX_CART_QUANTITY = 999;
const STORAGE_KEY = "zewid_cart";

export interface CartItem {
  slug: string;
  name: string;
  weight: string;
  image: string;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (slug: string, quantity?: number) => void;
  removeFromCart: (slug: string) => void;
  updateQuantity: (slug: string, quantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
  toastMessage: string | null;
  setToastMessage: (message: string | null) => void;
  generateWhatsAppLink: () => string;
}

// Rebuild persisted items from the catalog rather than trusting stored names or images.
// Name lookup migrates carts saved before stable product slugs were introduced.
function restoreCart(value: unknown): CartItem[] {
  if (!Array.isArray(value)) return [];
  const restored = new Map<string, CartItem>();

  for (const entry of value) {
    if (!entry || typeof entry !== "object") continue;
    const product = typeof entry.slug === "string"
      ? getProductBySlug(entry.slug)
      : products.find((product) => product.name === entry.name);
    if (!product || product.availability !== "in-stock" ||
        !Number.isSafeInteger(entry.quantity) || entry.quantity <= 0 ||
        entry.quantity > MAX_CART_QUANTITY) continue;

    const quantity = Math.min(MAX_CART_QUANTITY, (restored.get(product.slug)?.quantity ?? 0) + entry.quantity);
    restored.set(product.slug, {
      slug: product.slug,
      name: product.name,
      weight: product.weight,
      image: product.image,
      quantity,
    });
  }
  return [...restored.values()];
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<{ items: CartItem[]; loaded: boolean }>({ items: [], loaded: false });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const { items } = cart;

  useEffect(() => {
    let restored: CartItem[] = [];
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) restored = restoreCart(JSON.parse(saved));
    } catch {
      // Malformed data or unavailable storage must not prevent shopping.
    }
    // Browser storage is only available after hydration; loading is kept with the
    // items so the initial empty render can never overwrite a saved cart.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCart({ items: restored, loaded: true });
  }, []);

  useEffect(() => {
    if (!cart.loaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cart.items));
    } catch {
      // Keep the cart usable in memory when browser storage is blocked or full.
    }
  }, [cart]);

  const addToCart = (slug: string, quantity = 1) => {
    const product = getProductBySlug(slug);
    if (!product || product.availability !== "in-stock" ||
        !Number.isSafeInteger(quantity) || quantity <= 0 || quantity > MAX_CART_QUANTITY) return;

    setCart((previous) => {
      const existing = previous.items.find((item) => item.slug === slug);
      const nextItems = existing
        ? previous.items.map((item) => item.slug === slug
            ? { ...item, quantity: Math.min(MAX_CART_QUANTITY, item.quantity + quantity) }
            : item)
        : [...previous.items, { slug, name: product.name, weight: product.weight, image: product.image, quantity }];
      return { ...previous, items: nextItems };
    });
    setToastMessage(`${product.name} added to cart`);
  };

  const removeFromCart = (slug: string) => {
    setCart((previous) => ({ ...previous, items: previous.items.filter((item) => item.slug !== slug) }));
  };

  const updateQuantity = (slug: string, quantity: number) => {
    if (!Number.isSafeInteger(quantity) || quantity < 0 || quantity > MAX_CART_QUANTITY) return;
    if (quantity === 0) {
      removeFromCart(slug);
      return;
    }
    setCart((previous) => ({
      ...previous,
      items: previous.items.map((item) => item.slug === slug ? { ...item, quantity } : item),
    }));
  };

  const clearCart = () => setCart((previous) => ({ ...previous, items: [] }));

  const generateWhatsAppLink = () => {
    const lines = items.map((item, index) => `${index + 1}. ${item.name} (${item.weight}) x ${item.quantity}`);
    return whatsappLink(`Hi ZEWID! I would like to order:\n\n${lines.join("\n")}\n\nPlease confirm availability, the total price including delivery, and delivery timing before I confirm my order. Thanks!`);
  };

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCart,
      isCartOpen, setIsCartOpen, toastMessage, setToastMessage, generateWhatsAppLink }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
}
