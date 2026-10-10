import { mkdir, writeFile } from "node:fs/promises";
import { products, type Product } from "../src/data/products.ts";
import { site } from "../src/lib/site.ts";
import { keyMatchesStripeMode, readStripeMode } from "../src/lib/stripe-mode.ts";

type Fields = Record<string, string | number | boolean>;
type StripeProduct = { id: string; metadata: Record<string, string> };
type StripePrice = { id: string; product: string; unit_amount: number; currency: string; active: boolean; tax_behavior?: string };
type ShippingRate = { id: string; metadata: Record<string, string>; tax_behavior?: string; fixed_amount?: { amount: number; currency: string } };
type StripeList<T> = { data: T[]; has_more: boolean };

class StripeRequestError extends Error {
  status: number;
  constructor(status: number, code?: string) {
    // Do not log response bodies or credentials.
    super(`Stripe request failed (${status}${code ? `, ${code}` : ""}). Check your configured key and its catalog permissions.`);
    this.status = status;
  }
}

function stripePrices(product: Product) {
  return [
    { tier: "standard", amount: Math.round(product.priceEur * 100) },
  ];
}

async function main() {
  const args = process.argv.slice(2);
  if (args.some((arg) => !["--apply", "--live"].includes(arg))) throw new Error("Usage: npm run stripe:sync [-- --apply] or npm run stripe:sync:live [-- --apply]");
  const mode = args.includes("--live") ? "live" : "sandbox";

  if (!args.includes("--apply")) {
    console.log(JSON.stringify({
      mode: "preview: no Stripe requests or changes",
      target: mode,
      pricesIncludeVat: true,
      products: products.map((product) => ({
        slug: product.slug, name: product.name, description: product.description,
        weight: product.weight, image: new URL(product.image, site.url).href,
        active: product.availability === "in-stock", prices: stripePrices(product), currency: "eur",
      })),
      delivery: { amountCents: site.deliveryFeeEur * 100, currency: "eur", time: site.deliveryTime },
    }, null, 2));
    return;
  }

  const key = process.env.STRIPE_SECRET_KEY;
  if (readStripeMode(process.env.STRIPE_MODE) !== mode || !keyMatchesStripeMode(key, mode)) {
    throw new Error(`Set STRIPE_MODE=${mode} and a matching ${mode} secret/restricted key. Live imports require the explicit --live option.`);
  }

  async function request<T>(path: string, method: "GET" | "POST" = "GET", fields: Fields = {}, idempotencyKey?: string): Promise<T> {
    const body = new URLSearchParams(Object.entries(fields).map(([name, value]) => [name, String(value)]));
    const url = new URL(`https://api.stripe.com/v1${path}`);
    if (method === "GET") url.search = body.toString();
    const response = await fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${key}`,
        ...(method === "POST" ? { "Content-Type": "application/x-www-form-urlencoded" } : {}),
        ...(idempotencyKey ? { "Idempotency-Key": idempotencyKey } : {}),
      },
      ...(method === "POST" ? { body } : {}),
      signal: AbortSignal.timeout(30_000),
    });
    if (!response.ok) {
      const result = await response.json() as { error?: { code?: string } };
      throw new StripeRequestError(response.status, result.error?.code);
    }
    return await response.json() as T;
  }

  const manifest: Record<string, { productId: string; prices: Record<string, string> }> = {};
  for (const product of products) {
    const id = `zewid_${product.slug.replaceAll("-", "_")}`;
    let existing: StripeProduct | undefined;
    try {
      existing = await request<StripeProduct>(`/products/${id}`);
    } catch (error) {
      if (!(error instanceof StripeRequestError) || error.status !== 404) throw error;
    }
    if (existing && existing.metadata.zewid_slug !== product.slug) {
      throw new Error(`Product ID ${id} is already used by another catalog entry; no changes were made to it.`);
    }

    const fields: Fields = {
      name: `${product.name} — ${product.weight}`,
      description: product.description,
      "images[0]": new URL(product.image, site.url).href,
      url: new URL(`/products/${product.slug}`, site.url).href,
      shippable: true,
      active: product.availability === "in-stock",
      "metadata[zewid_slug]": product.slug,
      "metadata[weight_kg]": product.weightKg,
      "metadata[pack_size]": product.weight,
      "metadata[pricing_group]": "",
      "metadata[prices_include_vat]": "true",
      "metadata[bulk_minimum_combined_kg]": "",
    };
    const synced = await request<StripeProduct>(existing ? `/products/${id}` : "/products", "POST", {
      ...fields, ...(!existing ? { id } : {}),
    });

    const priceIds: Record<string, string> = {};
    for (const price of stripePrices(product)) {
      const lookupKey = `${id}_${price.tier}_${price.amount}_eur`;
      const query = { "lookup_keys[0]": lookupKey, limit: 1 };
      let found = await request<StripeList<StripePrice>>("/prices", "GET", { ...query, active: true });
      if (!found.data.length) found = await request<StripeList<StripePrice>>("/prices", "GET", { ...query, active: false });
      let syncedPrice = found.data[0];
      const active = product.availability === "in-stock";
      if (syncedPrice) {
        if (syncedPrice.product !== synced.id || syncedPrice.unit_amount !== price.amount || syncedPrice.currency !== "eur") {
          throw new Error(`Price lookup key ${lookupKey} has unexpected pricing; import stopped.`);
        }
        if (syncedPrice.tax_behavior === "exclusive") throw new Error(`Price ${lookupKey} is tax-exclusive; import stopped to protect the advertised VAT-inclusive total.`);
        if (syncedPrice.active !== active || syncedPrice.tax_behavior !== "inclusive") {
          syncedPrice = await request<StripePrice>(`/prices/${syncedPrice.id}`, "POST", { active, tax_behavior: "inclusive" });
        }
      } else {
        syncedPrice = await request<StripePrice>("/prices", "POST", {
          product: synced.id, currency: "eur", unit_amount: price.amount,
          lookup_key: lookupKey, active, tax_behavior: "inclusive", "metadata[pricing_tier]": price.tier,
        }, lookupKey);
      }
      priceIds[price.tier] = syncedPrice.id;
    }
    if (product.availability === "in-stock") await request(`/products/${id}`, "POST", { default_price: priceIds.standard });
    manifest[product.slug] = { productId: synced.id, prices: priceIds };
    console.log(`Synced ${product.name} (${product.availability}).`);
  }

  const deliveryAmount = site.deliveryFeeEur * 100;
  const shippingKey = `zewid_finland_${deliveryAmount}_eur`;
  let shippingRate: ShippingRate | undefined;
  let cursor: string | undefined;
  do {
    const rates = await request<StripeList<ShippingRate>>("/shipping_rates", "GET", {
      active: true, currency: "eur", limit: 100, ...(cursor ? { starting_after: cursor } : {}),
    });
    shippingRate = rates.data.find((rate) => rate.metadata.zewid_rate === shippingKey &&
      rate.fixed_amount?.amount === deliveryAmount && rate.fixed_amount.currency === "eur");
    cursor = rates.has_more ? rates.data.at(-1)?.id : undefined;
  } while (!shippingRate && cursor);
  if (shippingRate?.tax_behavior === "exclusive") throw new Error("Delivery rate is tax-exclusive; import stopped to protect the advertised €7 total.");
  if (shippingRate && shippingRate.tax_behavior !== "inclusive") {
    shippingRate = await request<ShippingRate>(`/shipping_rates/${shippingRate.id}`, "POST", { tax_behavior: "inclusive" });
  }
  if (!shippingRate) shippingRate = await request<ShippingRate>("/shipping_rates", "POST", {
    display_name: `Finland delivery (${site.deliveryTime})`, type: "fixed_amount",
    "fixed_amount[amount]": deliveryAmount, "fixed_amount[currency]": "eur",
    "metadata[zewid_rate]": shippingKey, tax_behavior: "inclusive",
  }, shippingKey);

  await mkdir(".stripe", { recursive: true });
  await writeFile(`.stripe/catalog.${mode}.json`, JSON.stringify({ mode, products: manifest, shippingRateId: shippingRate.id }, null, 2) + "\n");
  console.log(`${mode === "live" ? "Live" : "Sandbox"} import complete. Stripe IDs saved to .stripe/catalog.${mode}.json.`);
  console.log("Checkout uses the standard price at every quantity; the import alone does not enable website payments.");
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : "Stripe catalog import failed.");
  process.exitCode = 1;
});
