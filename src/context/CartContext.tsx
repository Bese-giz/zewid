"use client";

import { createContext, useContext, useState, ReactNode, useEffect, useCallback, useRef } from "react";
import { getProductBySlug, getProductVariant, getSelectedProduct, isProductPurchasable, products } from "@/data/products";
import { whatsappLink } from "@/lib/site";
import { MAX_CART_QUANTITY, calculateCart, cartLineKey, formatEuro, type CartSelection } from "@/lib/pricing";
import type { PickupPoint } from "@/lib/postnord";
import { deliveryPointName } from "@/lib/delivery-display";
import { getProductDisplayName } from "@/lib/product-display";
import { useInventory } from "./InventoryContext";

export { MAX_CART_QUANTITY } from "@/lib/pricing";
const STORAGE_KEY = "zewid_cart";

export interface CartItem {
  slug: string;
  variantId?: string;
  name: string;
  weight: string;
  image: string;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  pricing: ReturnType<typeof calculateCart>;
  addToCart: (slug: string, quantity?: number, variantId?: string) => void;
  removeFromCart: (slug: string, variantId?: string) => void;
  updateQuantity: (slug: string, quantity: number, variantId?: string) => void;
  clearCart: () => void;
  completeCheckout: (sessionId: string, purchased: CartSelection[]) => void;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
  toastMessage: string | null;
  setToastMessage: (message: string | null) => void;
  generateWhatsAppLink: (pickupPoint?: PickupPoint) => string;
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
      : products.find((product) => typeof entry.name === "string" &&
          (product.name === entry.name || product.legacyNames?.includes(entry.name)));
    if (!product || (entry.variantId !== undefined && typeof entry.variantId !== "string") ||
        !Number.isSafeInteger(entry.quantity) || entry.quantity <= 0 ||
        entry.quantity > MAX_CART_QUANTITY) continue;
    const selected = getSelectedProduct(product, entry.variantId);
    if (!selected || !isProductPurchasable(selected)) continue;
    const variantId = getProductVariant(product, entry.variantId)?.id;
    const key = cartLineKey({ slug: product.slug, variantId });
    const quantity = Math.min(MAX_CART_QUANTITY, (restored.get(key)?.quantity ?? 0) + entry.quantity);
    restored.set(key, {
      slug: product.slug,
      ...(variantId ? { variantId } : {}),
      name: product.name,
      weight: selected.weight,
      image: selected.image,
      quantity,
    });
  }
  return [...restored.values()];
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const stock = useInventory();
  const [cart, setCart] = useState<{ items: CartItem[]; loaded: boolean }>({ items: [], loaded: false });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const completedSessions = useRef(new Set<string>());
  const { items } = cart;
  const pricing = calculateCart(items);

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

  const addToCart = (slug: string, quantity = 1, requestedVariantId?: string) => {
    const catalogProduct = getProductBySlug(slug);
    const product = catalogProduct && getSelectedProduct(catalogProduct, requestedVariantId);
    if (!product || !isProductPurchasable(product) ||
        !Number.isSafeInteger(quantity) || quantity <= 0 || quantity > MAX_CART_QUANTITY) return;

    const variantId = getProductVariant(catalogProduct!, requestedVariantId)?.id;
    const key = cartLineKey({ slug, variantId });
    const existingQuantity = items.find(item => cartLineKey(item) === key)?.quantity ?? 0;
    if (!stock.ready || existingQuantity + quantity > stock.limit(slug, variantId)) {
      setToastMessage(stock.ready ? "There is not enough stock for this quantity." : "Please wait while we check stock availability.");
      return;
    }
    setCart((previous) => {
      const existing = previous.items.find((item) => cartLineKey(item) === key);
      const nextItems = existing
        ? previous.items.map((item) => cartLineKey(item) === key
            ? { ...item, quantity: Math.min(MAX_CART_QUANTITY, item.quantity + quantity) }
            : item)
        : [...previous.items, { slug, ...(variantId ? { variantId } : {}), name: product.name, weight: product.weight, image: product.image, quantity }];
      return { ...previous, items: nextItems };
    });
    setToastMessage(`${product.name}${variantId ? ` (${product.weight})` : ""} added to cart`);
  };

  const removeFromCart = (slug: string, variantId?: string) => {
    const key = cartLineKey({ slug, variantId });
    setCart((previous) => ({ ...previous, items: previous.items.filter((item) => cartLineKey(item) !== key) }));
  };

  const updateQuantity = (slug: string, quantity: number, variantId?: string) => {
    if (!Number.isSafeInteger(quantity) || quantity < 0 || quantity > MAX_CART_QUANTITY) return;
    if (quantity === 0) {
      removeFromCart(slug, variantId);
      return;
    }
    const previousQuantity = items.find(item => cartLineKey(item) === cartLineKey({ slug, variantId }))?.quantity ?? 0;
    if (quantity > previousQuantity && (!stock.ready || quantity > stock.limit(slug, variantId))) {
      setToastMessage("There is not enough stock for this quantity."); return;
    }
    setCart((previous) => ({
      ...previous,
      items: previous.items.map((item) => cartLineKey(item) === cartLineKey({ slug, variantId }) ? { ...item, quantity } : item),
    }));
  };

  const clearCart = () => setCart((previous) => ({ ...previous, items: [] }));

  const completeCheckout = useCallback((sessionId: string, purchased: CartSelection[]) => {
    if (!cart.loaded || completedSessions.current.has(sessionId)) return;
    let saved: string[] = [];
    try {
      const raw: unknown = JSON.parse(localStorage.getItem("zewid_completed_checkouts") ?? "[]");
      if (Array.isArray(raw)) saved = raw.filter((entry): entry is string => typeof entry === "string");
    } catch { /* An in-memory guard still prevents duplicate processing. */ }
    completedSessions.current.add(sessionId);
    if (saved.includes(sessionId)) return;
    setCart((previous) => ({ ...previous, items: previous.items.flatMap((item) => {
      const bought = purchased.filter((entry) => {
        const product = getProductBySlug(entry.slug);
        const variantId = product ? getProductVariant(product, entry.variantId)?.id : entry.variantId;
        return cartLineKey({ slug: entry.slug, variantId }) === cartLineKey(item);
      }).reduce((sum, entry) => sum + entry.quantity, 0);
      const quantity = Math.max(0, item.quantity - bought);
      return quantity > 0 ? [{ ...item, quantity }] : [];
    }) }));
    try { localStorage.setItem("zewid_completed_checkouts", JSON.stringify([...saved, sessionId].slice(-50))); }
    catch { /* The cart remains usable if storage is unavailable. */ }
    try { localStorage.removeItem("zewid_checkout_attempt"); } catch { /* Storage is optional. */ }
  }, [cart.loaded]);

  const generateWhatsAppLink = (pickupPoint?: PickupPoint) => {
    const lines = pricing.lines.map((line, index) =>
      `${index + 1}. ${getProductDisplayName(line.product)} (${line.product.weight}) x ${line.quantity} at ${formatEuro(line.unitPriceCents)} each = ${formatEuro(line.lineTotalCents)}`);
    const pickupDetails = pickupPoint
      ? `\n\nDelivery point: ${deliveryPointName(pickupPoint.name)}\nAddress: ${pickupPoint.street}, ${pickupPoint.postalCode} ${pickupPoint.city}\nDelivery point ID: ${pickupPoint.id}\nCountry: ${pickupPoint.countryCode}`
      : "";
    return whatsappLink(`Hi ZEWID! I would like to order:\n\n${lines.join("\n")}\n\nProducts: ${formatEuro(pricing.subtotalCents)}\nDelivery: ${formatEuro(pricing.deliveryCents)}\nTotal: ${formatEuro(pricing.totalCents)}${pickupDetails}\n\nPlease confirm my order and delivery details. Thanks!`);
  };

  return (
    <CartContext.Provider value={{ items, pricing, addToCart, removeFromCart, updateQuantity, clearCart, completeCheckout,
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
