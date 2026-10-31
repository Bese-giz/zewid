export type CheckoutPaymentMethod = "card" | "mobilepay" | "klarna";
export const KLARNA_MINIMUM_TOTAL_CENTS = 10_000;

export function checkoutPaymentMethods(totalCents: number, deliveryCountry: string): CheckoutPaymentMethod[] {
  const methods: CheckoutPaymentMethod[] = ["card", "mobilepay"];
  if (deliveryCountry === "FI" && Number.isSafeInteger(totalCents) && totalCents > KLARNA_MINIMUM_TOTAL_CENTS) methods.push("klarna");
  return methods;
}
