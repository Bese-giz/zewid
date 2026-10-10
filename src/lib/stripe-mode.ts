export type StripeMode = "sandbox" | "live";

export function readStripeMode(value: string | undefined): StripeMode {
  if (!value || value === "sandbox") return "sandbox";
  if (value === "live") return "live";
  throw new Error("STRIPE_MODE must be sandbox or live.");
}

export function keyMatchesStripeMode(key: string | undefined, mode: StripeMode): boolean {
  return new RegExp(`^(sk|rk)_${mode === "live" ? "live" : "test"}_`).test(key ?? "");
}
