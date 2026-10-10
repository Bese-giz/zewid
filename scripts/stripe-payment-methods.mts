import Stripe from "stripe";
import { keyMatchesStripeMode, readStripeMode } from "../src/lib/stripe-mode.ts";

const key = process.env.STRIPE_SECRET_KEY;
const mode = readStripeMode(process.env.STRIPE_MODE);
if (!keyMatchesStripeMode(key, mode)) throw new Error("STRIPE_MODE and STRIPE_SECRET_KEY must match.");
const stripe = new Stripe(key!, { timeout: 20_000, maxNetworkRetries: 1 });
try {
  const configurations = await stripe.paymentMethodConfigurations.list({ limit: 100 });
  const configuration = configurations.data.find((entry) => entry.active && entry.is_default);
  if (!configuration) throw new Error("No default payment configuration was found.");
  if (process.argv.includes("--enable")) {
    await stripe.paymentMethodConfigurations.update(configuration.id, {
      ...(configuration.apple_pay?.available ? { apple_pay: { display_preference: { preference: "on" } } } : {}),
      ...(configuration.google_pay?.available ? { google_pay: { display_preference: { preference: "on" } } } : {}),
      ...(configuration.mobilepay?.available ? { mobilepay: { display_preference: { preference: "on" } } } : {}),
    });
  }
  const current = await stripe.paymentMethodConfigurations.retrieve(configuration.id);
  const account = await stripe.accounts.retrieve(null);
  console.log(JSON.stringify({
    mode,
    country: account.country,
    accountDetailsSubmitted: account.details_submitted,
    chargesEnabled: account.charges_enabled,
    payoutsEnabled: account.payouts_enabled,
    applePay: { available: current.apple_pay?.available ?? false, display: current.apple_pay?.display_preference.value ?? "unknown" },
    googlePay: { available: current.google_pay?.available ?? false, display: current.google_pay?.display_preference.value ?? "unknown" },
    mobilePay: { available: current.mobilepay?.available ?? false, display: current.mobilepay?.display_preference.value ?? "unknown" },
  }, null, 2));
} catch {
  console.error("Payment settings could not be checked. Review Payment methods in the matching Stripe Dashboard environment.");
  process.exitCode = 1;
}
