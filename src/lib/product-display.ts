import type { Product } from "../data/products.ts";

// Short shelf labels; the supplied full titles stay on detail pages and orders.
const cardNames: Record<string, string> = {
  "white-teff-flour": "White Teff Flour",
  "red-teff-flour": "Red Teff Flour",
  "mashila-sorghum": "Sorghum Flour (Mashila)",
  "berbere": "Berbere Spice",
  "shiro": "Shiro Powder",
  "buna-coffee": "Sidamo Green Coffee Beans",
  "abish-fenugreek": "Abish Fenugreek Seeds",
  "gaat-porridge": "Ga’at Porridge Mix",
  "mekelesha-spice": "Mekelesha Spice Mix",
  "zemen-injera-maker-40cm": "Zemen Injera Maker",
  "zemen-injera-maker-46cm": "Zemen Injera Maker",
  "coffee-roasting-pan": "Coffee Roasting Pan",
  "mogogo-temperature-controller": "Mogogo Temperature Controller",
  "berele-tej-glass": "Berele Tej Glass",
  "ceramic-incense-burner": "Ceramic Incense Burner",
  "floral-coffee-cups-12": "Floral Coffee Cups",
  "clay-spice-container": "Clay Spice Container",
  "electric-coffee-hot-plate": "Electric Coffee Hot Plate",
  "food-warmer-3-dish": "Three-Dish Serving Set",
  "food-warmer-2-dish": "Two-Dish Serving Set",
  "coffee-set-18-piece": "Coffee Cup & Saucer Set",
  "coffee-ceremony-set-23-piece": "Coffee Ceremony Set",
  "amharic-alphabet-chart": "Amharic Alphabet Chart",
  "snack-stand-3-tier": "Three-Tier Snack Stand",
  "ethiopian-frankincense": "Ethiopian Frankincense",
  "ketema-grass": "Ketema Ceremony Grass",
  "floral-injera-tray-40cm": "Floral Injera Tray",
  "meshrefet-basket": "Woven Meshrefet Basket",
};

export function getProductCardName(product: Pick<Product, "slug" | "name">): string {
  return cardNames[product.slug] ?? product.name;
}

export function getProductDisplayName(product: Pick<Product, "name" | "amharicName">): string {
  return product.amharicName ? `${product.name} · ${product.amharicName}` : product.name;
}

export function getProductDiscount(product: Pick<Product, "priceEur" | "compareAtPriceEur">) {
  if (product.priceEur == null || product.compareAtPriceEur == null) return null;
  const priceCents = Math.round(product.priceEur * 100);
  const originalCents = Math.round(product.compareAtPriceEur * 100);
  if (!Number.isSafeInteger(priceCents) || !Number.isSafeInteger(originalCents) || priceCents <= 0 || originalCents <= priceCents) return null;
  const percentOff = Math.floor((originalCents - priceCents) * 100 / originalCents);
  return { originalCents, percentOff, label: percentOff > 0 ? `${percentOff}% off` : "Sale" };
}
