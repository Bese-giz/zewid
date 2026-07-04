export interface Product {
  slug: string;
  name: string;
  weight: string;
  description: string;
  image: string;
  features: string[];
}

export const products: Product[] = [
  {
    slug: "white-teff-flour",
    name: "White Teff Flour",
    weight: "5 kg bag",
    description:
      "Premium Ethiopian white teff flour for baking authentic injera. Finely milled and imported directly from Ethiopia. Known for its delicate flavor and light color.",
    image: "/images/white_teff_bag_transparent_enhanced.png",
    features: [
      "100% Ethiopian white teff",
      "Perfect for authentic light injera",
      "Fresh stock in Finland",
      "Fast, reliable delivery all over Finland",
    ],
  },
  {
    slug: "red-teff-flour",
    name: "Red Teff Flour",
    weight: "5 kg bag",
    description:
      "Rich, nutty Ethiopian red teff flour for dark injera. Full-bodied flavor with excellent nutritional value.",
    image: "/images/red_teff_flour_enhanced_transparent.png",
    features: [
      "100% Ethiopian red teff",
      "High in iron and fiber",
      "High in iron & calcium",
      "Perfect for dark injera",
    ],
  },
  {
    slug: "mashila-sorghum",
    name: "Mashila (Sorghum)",
    weight: "5 kg bag",
    description:
      "High-quality whole grain mashila (sorghum). Traditionally mixed with teff for injera or used for making hearty porridge (genfo).",
    image: "/images/mashila.png",
    features: [
      "Premium quality sorghum",
      "Authentic Ethiopian mashila",
      "Versatile cooking",
      "Direct from Ethiopia",
    ],
  },
  {
    slug: "berbere",
    name: "Berbere",
    weight: "1 kg pack",
    description:
      "Authentic Ethiopian Berbere spice blend. Rich, flavorful, and perfect for wot (stews).",
    image: "/images/berbere_enhanced_transparent.png",
    features: [
      "Authentic Ethiopian spice",
      "Rich flavor",
      "Perfect for wot",
    ],
  },
  {
    slug: "buna-coffee",
    name: "Buna (Coffee)",
    weight: "1 kg pack",
    description:
      "Premium Ethiopian coffee beans (Buna). Experience the birthplace of coffee with this rich, aromatic blend.",
    image: "/images/green_coffee_beans_enhanced_transparent.png",
    features: [
      "Premium Ethiopian coffee",
      "Rich aroma",
      "Traditional buna",
    ],
  },
  {
    slug: "shiro",
    name: "Shiro",
    weight: "1 kg pack",
    description:
      "Traditional Ethiopian Shiro powder. Easy to prepare and makes a delicious, savory stew.",
    image: "/images/shiro_enhanced_transparent.png",
    features: [
      "Traditional shiro powder",
      "Easy to prepare",
      "Delicious flavor",
    ],
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}
