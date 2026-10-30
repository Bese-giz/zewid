import Image from "next/image";

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
            <span className="market-payments__card-icons">
              <Image src="/images/payment-methods/cards.svg" alt="" width={38} height={24} />
              <Image src="/images/payment-methods/visa.svg" alt="Visa" width={38} height={24} />
              <Image src="/images/payment-methods/mastercard.svg" alt="Mastercard" width={38} height={24} />
            </span>
            <span>Cards</span>
          </li>
          <li className="market-payments__badge">
            <Image src="/images/payment-methods/apple-pay.svg" alt="" width={100} height={64} className="market-payments__icon" />
            <span>Apple Pay</span>
          </li>
          <li className="market-payments__badge">
            <Image src="/images/payment-methods/google-pay.svg" alt="" width={94} height={64} className="market-payments__icon" />
            <span>Google Pay</span>
          </li>
          <li className="market-payments__badge market-payments__badge--klarna">
            <Image src="/images/payment-methods/klarna.svg" alt="" width={152} height={64} className="market-payments__icon" />
            <span>Klarna</span>
          </li>
        </ul>
        <p className="market-payments__note">Payment options depend on your device and eligibility.</p>
      </div>
    </section>
  );
}
