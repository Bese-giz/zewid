export default function PaymentMethods() {
  return (
    <section aria-labelledby="payment-methods-title" className="market-container market-payments">
      <div className="market-payments__copy">
        <h2 id="payment-methods-title">Pay your way.</h2>
        <p>Choose your preferred payment method at checkout.</p>
      </div>
      <div>
        <ul className="market-payments__methods" aria-label="Payment methods">
          <li className="market-payments__badge">
            <svg width="23" height="18" viewBox="0 0 24 18" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><rect x="1" y="1" width="22" height="16" rx="3" /><path d="M1 6h22M5 12h4" /></svg>
            Cards
          </li>
          <li className="market-payments__badge">Apple Pay</li>
          <li className="market-payments__badge">Google Pay</li>
          <li className="market-payments__badge market-payments__badge--klarna">Klarna</li>
        </ul>
        <p className="market-payments__note">Payment options depend on your device and eligibility.</p>
      </div>
    </section>
  );
}
