import type { ReactNode } from "react";

export default function ProductDetailSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <details className="product-detail-disclosure">
      <summary>
        <span>{title}</span>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
      </summary>
      <div className="product-detail-disclosure__content">{children}</div>
    </details>
  );
}
