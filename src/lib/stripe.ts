import "server-only";
import Stripe from "stripe";
import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
import { site } from "./site";
import { keyMatchesStripeMode, readStripeMode, type StripeMode } from "./stripe-mode";

export const CHECKOUT_COOKIE = "zewid_checkout_browser";

export function checkoutMode(): StripeMode | null {
  try {
    const mode = readStripeMode(process.env.STRIPE_MODE);
    if (!keyMatchesStripeMode(process.env.STRIPE_SECRET_KEY, mode)) return null;
    if (mode === "live" && (
      (process.env.VERCEL_ENV && process.env.VERCEL_ENV !== "production") ||
      !process.env.STRIPE_WEBHOOK_SECRET?.startsWith("whsec_") ||
      !checkoutBaseUrl().startsWith("https:")
    )) return null;
    return mode;
  } catch { return null; }
}

export function getStripe(): Stripe {
  const mode = readStripeMode(process.env.STRIPE_MODE);
  if (!keyMatchesStripeMode(process.env.STRIPE_SECRET_KEY, mode) ||
      (mode === "live" && process.env.VERCEL_ENV && process.env.VERCEL_ENV !== "production")) {
    throw new Error("Stripe checkout is not configured for this environment.");
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY!, { timeout: 20_000, maxNetworkRetries: 2 });
}

export function matchesStripeMode(livemode: boolean): boolean {
  return livemode === (readStripeMode(process.env.STRIPE_MODE) === "live");
}

export function checkoutBaseUrl(): string {
  const url = new URL(process.env.CHECKOUT_BASE_URL || (process.env.NODE_ENV === "development" ? "http://localhost:3000" : site.url));
  if (url.username || url.password || url.pathname !== "/" || url.search || url.hash ||
      (url.protocol !== "https:" && !(url.protocol === "http:" && ["localhost", "127.0.0.1"].includes(url.hostname)))) {
    throw new Error("CHECKOUT_BASE_URL must be the HTTPS site origin or a localhost URL.");
  }
  return url.origin;
}

export function browserToken(existing?: string): string {
  return existing && /^[a-f0-9]{64}$/.test(existing) ? existing : randomBytes(32).toString("hex");
}

export function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export function ownsCheckout(session: Stripe.Checkout.Session, token?: string): boolean {
  const expected = session.metadata?.zewid_browser;
  if (!token || !/^[a-f0-9]{64}$/.test(token) || !expected || !/^[a-f0-9]{64}$/.test(expected)) return false;
  return timingSafeEqual(Buffer.from(expected, "hex"), Buffer.from(hashToken(token), "hex"));
}
