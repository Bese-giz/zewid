"use client";

import Image from "next/image";
import { useState } from "react";
import type { Product } from "@/data/products";
import ProductBadges from "./ProductBadges";

export default function ProductGallery({ product }: { product: Product }) {
  const { name, images } = product;
  const [selected, setSelected] = useState(0);
  return (
    <figure className="w-full">
      <div className="relative mx-auto aspect-square w-full max-w-lg">
        <Image src={images[selected]} alt={`${name} — image ${selected + 1}`} fill priority
          sizes="(max-width: 767px) 100vw, 512px" className="object-contain drop-shadow-xl" />
        <ProductBadges product={product} />
      </div>
      {images.length > 1 && (
        <div className="mt-6 flex flex-wrap justify-center gap-3" role="group" aria-label={`Images of ${name}`}>
          {images.map((image, index) => (
            <button key={image} type="button" onClick={() => setSelected(index)}
              aria-label={`View image ${index + 1} of ${images.length} of ${name}`} aria-pressed={selected === index}
              className={`relative h-20 w-20 overflow-hidden rounded-xl border-2 bg-white p-2 transition-colors ${selected === index ? "border-green-700" : "border-gray-200 hover:border-green-500"}`}>
              <Image src={image} alt="" fill sizes="80px" className="object-contain p-2" />
            </button>
          ))}
        </div>
      )}
      <figcaption className="sr-only">{images.length} product {images.length === 1 ? "image" : "images"}. {images.length > 1 && "Select a thumbnail to change the main image."}</figcaption>
    </figure>
  );
}
