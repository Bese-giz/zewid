import type { Product } from "@/data/products";

export default function ProductStatusTag({ availability }: { availability: Product["availability"] }) {
  if (availability === "in-stock") return null;
  const soon = availability === "coming-soon";
  return (
    <p className={`product-status-tag ${soon ? "product-status-tag--soon" : "product-status-tag--unavailable"}`}>
      <span className="product-status-tag__icon" aria-hidden="true">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
          {soon ? <><circle cx="12" cy="12" r="8" /><path d="M12 8v4l2.5 1.5" /></> : <><rect x="4" y="6" width="16" height="14" rx="2" /><path d="M9 6V4h6v2M4 10h16m-7 5h-2" /></>}
        </svg>
      </span>
      <span>{soon ? "Coming soon" : "Out of stock"}</span>
      <span className="product-status-tag__mark" aria-hidden="true">✧</span>
    </p>
  );
}
