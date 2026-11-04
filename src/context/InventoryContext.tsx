"use client";
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { cartLineKey, MAX_CART_QUANTITY } from "@/lib/pricing";
import { getProductBySlug } from "@/data/products";

interface InventoryContextValue {
  ready: boolean; error: boolean; enabled: boolean;
  limit: (slug: string, variantId?: string) => number;
  refresh: () => Promise<void>;
}
const InventoryContext = createContext<InventoryContextValue | null>(null);
export function InventoryProvider({ children, enabled }: { children: ReactNode; enabled: boolean }) {
  const [quantities, setQuantities] = useState<Record<string, number> | null>(null);
  const [error, setError] = useState(false);
  const refresh = useCallback(async () => {
    if (!enabled) return;
    try {
      const response = await fetch("/api/inventory", { cache: "no-store" });
      if (!response.ok) throw new Error();
      const data = await response.json();
      if (!data.enabled || !data.quantities) throw new Error();
      setQuantities(data.quantities); setError(false);
    } catch { setError(true); }
  }, [enabled]);
  useEffect(() => {
    const initial = setTimeout(() => { void refresh(); }, 0);
    const timer = setInterval(() => { if (document.visibilityState === "visible") void refresh(); }, 30_000);
    const onFocus = () => { void refresh(); };
    window.addEventListener("focus", onFocus);
    return () => { clearTimeout(initial); clearInterval(timer); window.removeEventListener("focus", onFocus); };
  }, [refresh]);
  const limit = (slug: string, variantId?: string) => {
    if (!enabled) return MAX_CART_QUANTITY;
    const product = getProductBySlug(slug);
    return Math.min(MAX_CART_QUANTITY, quantities?.[cartLineKey({ slug, variantId: variantId ?? product?.defaultVariantId })] ?? 0);
  };
  return <InventoryContext.Provider value={{ enabled, ready: !enabled || (quantities !== null && !error), error, limit, refresh }}>{children}</InventoryContext.Provider>;
}
export function useInventory() {
  const value = useContext(InventoryContext);
  if (!value) throw new Error("InventoryProvider is required.");
  return value;
}
