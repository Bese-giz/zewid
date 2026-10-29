"use client";

import Image from "next/image";
import { useRef, useState, type PointerEvent } from "react";
import type { Product } from "@/data/products";

export default function ProductImageCarousel({ product }: { product: Product }) {
  const images = product.images.length ? product.images : [product.image];
  const [selected, setSelected] = useState(0);
  const rail = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; scroll: number; moved: boolean } | null>(null);
  const multiple = images.length > 1;

  function goTo(index: number) {
    const target = Math.max(0, Math.min(images.length - 1, index));
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    rail.current?.scrollTo({ left: target * rail.current.clientWidth, behavior: reducedMotion ? "auto" : "smooth" });
  }

  function startDrag(event: PointerEvent<HTMLDivElement>) {
    if (!multiple || event.pointerType !== "mouse" || event.button !== 0) return;
    drag.current = { x: event.clientX, scroll: event.currentTarget.scrollLeft, moved: false };
  }

  function moveDrag(event: PointerEvent<HTMLDivElement>) {
    const active = drag.current;
    if (!active || event.buttons !== 1) return;
    const distance = event.clientX - active.x;
    if (Math.abs(distance) <= 6 && !active.moved) return;
    if (!active.moved) {
      active.moved = true;
      event.currentTarget.focus({ preventScroll: true });
      event.currentTarget.setPointerCapture(event.pointerId);
      event.currentTarget.style.scrollSnapType = "none";
      event.currentTarget.style.scrollBehavior = "auto";
    }
    event.preventDefault();
    event.currentTarget.scrollLeft = active.scroll - distance;
  }

  function finishDrag(event: PointerEvent<HTMLDivElement>) {
    const active = drag.current;
    drag.current = null;
    if (!active?.moved) return;
    const element = event.currentTarget;
    element.style.scrollSnapType = "";
    element.style.scrollBehavior = "";
    if (element.hasPointerCapture(event.pointerId)) element.releasePointerCapture(event.pointerId);
    const start = Math.round(active.scroll / element.clientWidth);
    const distance = element.scrollLeft - active.scroll;
    let target = Math.round(element.scrollLeft / element.clientWidth);
    if (target === start && Math.abs(distance) > element.clientWidth * 0.2) target += Math.sign(distance);
    goTo(target);
  }

  return (
    <div className="min-w-0 w-full" role="group" aria-roledescription={multiple ? "carousel" : undefined} aria-label={`${product.name} photos`}>
      <div className="relative mx-auto max-w-lg overflow-hidden rounded-xl">
        <div ref={rail} className={`product-photo-rail ${multiple ? "cursor-grab active:cursor-grabbing" : ""}`} tabIndex={multiple ? 0 : undefined}
          onScroll={event => {
            const element = event.currentTarget;
            if (element.clientWidth) setSelected(Math.max(0, Math.min(images.length - 1, Math.round(element.scrollLeft / element.clientWidth))));
          }}
          onPointerDown={startDrag} onPointerMove={moveDrag} onPointerUp={finishDrag} onPointerCancel={finishDrag}
          onDragStart={event => event.preventDefault()}
          onKeyDown={event => {
            if (!multiple) return;
            if (event.key === "ArrowLeft" || event.key === "ArrowRight") { event.preventDefault(); event.currentTarget.focus({ preventScroll: true }); goTo(selected + (event.key === "ArrowRight" ? 1 : -1)); }
            if (event.key === "Home" || event.key === "End") { event.preventDefault(); event.currentTarget.focus({ preventScroll: true }); goTo(event.key === "Home" ? 0 : images.length - 1); }
          }}>
          {images.map((image, index) => {
            const photo = <Image src={image} alt={`${product.name}${multiple ? ` — image ${index + 1}` : ""}`} fill draggable={false}
              priority={index === 0} sizes="(max-width: 767px) 100vw, 512px" className="select-none object-contain drop-shadow-xl" />;
            return <div key={image} className="product-photo-slide aspect-square" role="group" aria-roledescription="slide" aria-label={`${index + 1} of ${images.length}`} aria-hidden={index !== selected}>{photo}</div>;
          })}
        </div>
        {multiple && <>
          <button type="button" onClick={() => goTo(selected - 1)} disabled={selected === 0} aria-label={`Previous photo of ${product.name}`}
            className="product-photo-arrow left-2 md:left-3">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="m14 6-6 6 6 6" /></svg>
          </button>
          <button type="button" onClick={() => goTo(selected + 1)} disabled={selected === images.length - 1} aria-label={`Next photo of ${product.name}`}
            className="product-photo-arrow right-2 md:right-3">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="m10 6 6 6-6 6" /></svg>
          </button>
          <div className="absolute bottom-2 left-1/2 z-20 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-2 shadow-sm ring-1 ring-black/5 md:bottom-3">
            {images.map((image, index) => <button key={image} type="button" onClick={() => goTo(index)} aria-label={`Show photo ${index + 1} of ${product.name}`} aria-pressed={selected === index}
              className="flex h-5 w-5 items-center justify-center rounded-full">
              <span aria-hidden="true" className={`h-1.5 rounded-full transition-all ${selected === index ? "w-4 bg-green-800" : "w-1.5 bg-gray-300"}`} />
            </button>)}
            <span className="ml-1 text-[10px] font-semibold tabular-nums text-gray-600" aria-hidden="true">{selected + 1}/{images.length}</span>
          </div>
          <span className="sr-only" role="status">Photo {selected + 1} of {images.length}</span>
        </>}
      </div>
      {multiple && <div className="mt-6 flex flex-wrap justify-center gap-3" role="group" aria-label={`Choose a photo of ${product.name}`}>
        {images.map((image, index) => <button key={image} type="button" onClick={() => goTo(index)} aria-label={`View image ${index + 1} of ${images.length} of ${product.name}`} aria-pressed={selected === index}
          className={`relative h-20 w-20 overflow-hidden rounded-xl border-2 bg-white ${selected === index ? "border-green-700" : "border-gray-200 hover:border-green-500"}`}>
          <Image src={image} alt="" fill sizes="80px" className="object-contain p-2" />
        </button>)}
      </div>}
    </div>
  );
}
