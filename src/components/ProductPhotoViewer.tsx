"use client";

import Image from "next/image";
import { useEffect, useId, useRef } from "react";
import MarketIcon from "./MarketIcon";

export default function ProductPhotoViewer({ src, alt, productName, counter, trigger, onClose }: {
  src: string; alt: string; productName: string; counter?: string;
  trigger: HTMLButtonElement; onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const previousOverflow = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
      if (trigger.isConnected) trigger.focus({ preventScroll: true });
    };
  }, [trigger]);

  return <dialog ref={dialogRef} aria-labelledby={titleId} className="product-photo-viewer"
    onCancel={event => { event.preventDefault(); onClose(); }}
    onClose={event => {
      if (event.currentTarget.isConnected && !event.currentTarget.open) onClose();
    }}
    onClick={event => {
      const target = event.target;
      if (target instanceof Element && target.closest(".product-photo-viewer-image, .product-photo-viewer-close")) return;
      onClose();
    }}>
    <h2 id={titleId} className="sr-only">Enlarged photo of {productName}</h2>
    <button type="button" autoFocus className="product-photo-viewer-close" aria-label="Close photo" onClick={onClose}>
      <MarketIcon name="close" size={24} />
    </button>
    <figure className="product-photo-viewer-content">
      <Image src={src} alt={alt} width={2000} height={2000} loading="eager" draggable={false}
        sizes="(max-width: 767px) 96vw, 1200px" className="product-photo-viewer-image" />
      {counter && <figcaption className="product-photo-viewer-counter">{counter}</figcaption>}
    </figure>
  </dialog>;
}
