import type { Product } from "../data/products.ts";

const shelfOrder = [
  "white-teff-flour", "red-teff-flour", "berbere", "mitmita",
  "shiro", "mashila-sorghum", "bula", "gaat-porridge",
  "korerima", "abish-fenugreek", "abish-flour", "mekelesha-spice",
];
const shelfRank = new Map(shelfOrder.map((slug, index) => [slug, index]));

export function getProductsInDisplayOrder(products: readonly Product[]): Product[] {
  return [...products].sort((a, b) =>
    (shelfRank.get(a.slug) ?? shelfOrder.length) - (shelfRank.get(b.slug) ?? shelfOrder.length));
}

// Short shelf labels; the supplied full titles stay on detail pages and orders.
const cardNames: Record<string, string> = {
  "white-teff-flour": "White Teff Flour",
  "red-teff-flour": "Red Teff Flour",
  "mashila-sorghum": "Sorghum Flour (Mashila)",
  "berbere": "Berbere Spice",
  "mitmita": "Mitmita Chilli Blend",
  "bula": "Bula Enset Starch",
  "korerima": "Korerima Cardamom Seeds",
  "shiro": "Mitin Shiro",
  "buna-coffee": "Sidamo Green Coffee Beans",
  "abish-fenugreek": "Roasted Abish Seeds",
  "abish-flour": "Abish Flour",
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
  "rekebot-silver": "Silver Rekebot Set",
  "rekebot-gold": "Gold Rekebot Set",
  "rekebot-rose": "Rose Glass-Top Rekebot",
  "rekebot-white": "White Traditional Rekebot",
  "rekebot-small": "Small Black & White Rekebot",
  "rekebot-led": "Glass-Top Rekebot & Stove Holder",
  "luwam-extensions": "Alviia Luwam Curly Extensions",
  "zenith-paraffin": "Zenith Paraffin Hair Oil",
  "zenith-tonic": "Zenith Hair Tonic Oil",
};

export function getProductCardName(product: Pick<Product, "slug" | "name">): string {
  return cardNames[product.slug] ?? product.name;
}

export function getProductDisplayName(product: Pick<Product, "name" | "amharicName">): string {
  return product.amharicName ? `${product.name} · ${product.amharicName}` : product.name;
}

export function getProductEnquiryMessage(product: Pick<Product, "name" | "amharicName" | "availability">, purchasable: boolean): string {
  if (product.availability === "on-request") {
    return `Hi ZEWID Market! I'd like to order ${getProductDisplayName(product)}.`;
  }
  return `Hi ZEWID! I'd like to ask about ${getProductDisplayName(product)}${purchasable ? ", delivery and ordering" : ", its price and when it will be available"}.`;
}

export function getProductDiscount(product: Pick<Product, "priceEur" | "compareAtPriceEur">) {
  if (product.priceEur == null || product.compareAtPriceEur == null) return null;
  const priceCents = Math.round(product.priceEur * 100);
  const originalCents = Math.round(product.compareAtPriceEur * 100);
  if (!Number.isSafeInteger(priceCents) || !Number.isSafeInteger(originalCents) || priceCents <= 0 || originalCents <= priceCents) return null;
  const percentOff = Math.floor((originalCents - priceCents) * 100 / originalCents);
  return { originalCents, percentOff, label: percentOff > 0 ? `${percentOff}% off` : "Sale" };
}
