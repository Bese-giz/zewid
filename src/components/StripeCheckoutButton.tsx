"use client";

export default function StripeCheckoutButton({ sandbox, busy, error }: { sandbox: boolean; busy: boolean; error: string | null }) {
  return (
    <div className="cart-checkout">
      <button type="submit" disabled={busy} className="cart-checkout-button">
        {busy ? "Opening checkout…" : "Continue to payment"}
      </button>
      <p className="cart-checkout-note">{sandbox ? "Sandbox checkout — no real payment." : "Available payment methods appear at checkout."}</p>
      {error && <p id="checkout-delivery-error" role="alert" className="cart-checkout-error">{error}</p>}
    </div>
  );
}
