# ZEWID storefront

ZEWID sells Ethiopian ingredients in Finland through a product catalog and WhatsApp ordering. This is a Next.js App Router project using React, TypeScript, and Tailwind CSS.

## Local development

Use Node.js 22 (also recorded in `.nvmrc`).

```sh
npm ci
npm run dev
```

Open http://localhost:3000.

## Quality checks and production

```sh
npm run lint
npm run typecheck
npm run build
npm run start
```

The GitHub Actions workflow runs dependency installation, linting, type checking, and a production build on pushes and pull requests. It does not run tests. No automated tests are included.

Deploy to a host that supports the Next.js server and image optimizer. All catalog pages are prerendered. `next/font/google` downloads Inter at build time; the build environment needs access to Google Fonts. Fonts are served locally to visitors after the build.

## Product catalog and stock

Edit `src/data/products.ts` to update products. Each product has a stable slug, name, pack size, description, image, features, and `availability` (`in-stock` or `out-of-stock`). Mashila costs €15 per 5 kg bag and is currently out of stock. The temporary €1 checkout test has ended.

The catalog includes these selling prices per bag/pack:

| Product | Pack size | Price |
| --- | --- | --- |
| White teff (Magna) | 5 kg | €25 |
| Red teff | 5 kg | €25 |
| Mashila (out of stock) | 5 kg | €15 |
| Buna coffee | 1 kg | €18 |
| Berbere | 1 kg | €30 |
| Shiro | 1 kg | €30 |

`priceEur` is the price per pack and `weightKg` is the pack's numeric weight. `src/lib/pricing.ts` calculates totals in integer cents from catalog data, never from stored or customer-supplied prices. White and red teff cost €25 per bag at every quantity; website orders do not receive a bulk discount.

Unavailable products remain visible for enquiries but cannot be added to the cart. Rebuild/redeploy after changing the catalog or stock status.

## Delivery and ordering

`src/lib/site.ts` contains the site URL, WhatsApp number, delivery coverage, and delivery time. Delivery is currently 1–2 days throughout Finland and costs €8.90 per non-empty order, with no free-delivery threshold. The fee is configured as `deliveryFeeEur` in the same file.

Customers add available products from the homepage, catalog, or product detail page. Product detail pages include quantity selection. The cart displays unit prices, line totals, delivery, and the final total. Its “Send Order on WhatsApp” action opens a draft containing those amounts along with every cart item, pack size, and quantity. Product detail pages preview the selected quantity. Opening WhatsApp does not submit or confirm an order, and the cart is not cleared automatically.

Stripe hosted checkout supports **sandbox and live mode** alongside WhatsApp ordering. Sandbox is the default. Checkout collects the customer's email, phone number, and Finnish shipping address. Amounts are checked on the server against the catalog and the imported Stripe price lookup keys, including the fixed delivery rate. Customer-supplied prices are ignored and invalid/unavailable items are rejected.

The cart's checkout button is available when the configured mode and key match. Live mode also requires an HTTPS origin and webhook signing secret, and is blocked on Vercel Preview/Development deployments. The Stripe payment methods offered depend on the account's activated methods and customer eligibility; this integration limits the choices to cards (including supported Apple Pay/Google Pay wallets) and MobilePay. Klarna is not offered by the website checkout. Finish Stripe account activation and enable eligible methods in the Dashboard when they become available.

The merchant confirmed VAT registration and VAT-inclusive selling prices. Product prices and delivery rates are marked inclusive in Stripe; the website displays that prices include VAT. Checkout does not add VAT to the quoted total. Automatic Stripe Tax is disabled; the merchant handles VAT reporting and any required VAT invoices in their accounting system. This implementation does not produce a VAT invoice or a tax breakdown. Finland's food/ingredient VAT rate is 13.5% from 1 January 2026 ([Finnish Tax Administration](https://www.vero.fi/en/businesses-and-corporations/taxes-and-charges/vat/rates-of-vat/)); this rate is accounting guidance and is not automatically applied by this code. Changing the catalog to include non-food products or offering a different delivery service requires reviewing the applicable VAT treatment.

Orders, contact/delivery details, and payment status remain in Stripe. The reference and purchased items are attached to the Checkout Session and PaymentIntent metadata, so the merchant can review paid orders in the Stripe Dashboard. A signed webhook and the authenticated return page verify Stripe's actual paid status and amount before marking a payment verified. No shipment is triggered automatically. There is no separate order database, inventory-counting service, or local admin portal. Payment receipt emails must be enabled in Stripe's customer email settings; this app does not send custom order emails.

New website checkouts initialize `fulfillment_status = pending` in the Checkout Session and PaymentIntent metadata. Stripe copies the PaymentIntent's initial metadata to the resulting Charge, so the field appears on the payment automatically without requiring additional API-key permissions. Payment and fulfillment are separate: an incomplete or failed payment can also show `pending`; only process payments marked **Succeeded**. In the payment's **Metadata → Edit**, change this field to `packed` or `shipped` as you handle the order, and optionally add `tracking_number`. Payment verification and repeated webhooks never reset this field. Existing orders and WhatsApp orders are not changed, and manual status edits are not synchronized between Stripe objects or with PostNord.

### PostNord pickup-point selection

Configure a production **Service Points v5** API key from [PostNord Developer](https://developer.postnord.com) as `POSTNORD_API_KEY` in `.env.local`, `.env.live.local`, and Vercel **Production**. Mark the Vercel value Secret/Sensitive and deploy after adding it. The key stays on the server. Without a configured key, checkout retains its existing address-based delivery flow.

With the key configured, the cart requires a five-digit Finnish postcode and a PostNord pickup-point selection before opening Stripe. The server queries the official nearest-by-address API for eligible Finnish pickup points, returns public visiting addresses, and rechecks the chosen ID against the postcode results before creating checkout. Changing the postcode clears the selection. Both order options share the same selection: the WhatsApp draft includes the selected point's name, visiting address, ID, and country. WhatsApp remains available without a selection to agree delivery directly. The customer sees the selected point in Stripe and on the return page. The carrier, country, pickup-point ID, name, and visiting address are saved in Checkout Session and PaymentIntent metadata.

To find a paid order's pickup point, open the successful payment in the Stripe Dashboard and find its **Metadata** section. `zewid_pickup_name` is the selected location; `zewid_pickup_street`, `zewid_pickup_postcode`, and `zewid_pickup_city` give its visiting address. Use `zewid_pickup_id` and `zewid_pickup_country` when booking with PostNord. These fields are saved when checkout is created; only fulfill orders whose payment has succeeded. The app does not email this information to the merchant or book the shipment automatically.

The delivery charge uses the merchant's fixed fee in `site.deliveryFeeEur` (€8.90); this lookup does not quote the contract shipping price. Shipment booking, labels, tracking messages, and fulfillment remain merchant tasks. Use the selected point's **ID and country** when booking with PostNord; its public visiting address is for customer directions and should not be copied as the recipient's home address or assumed to be the carrier's label/EDI delivery address. See [PostNord's integration guide](https://guide.developer.postnord.com/) for Service Points v5 and booking details. Verify real Finnish pickup-point results and an unpaid checkout before enabling this flow in production.

## Automated Stripe sandbox catalog import

The importer reads the same product catalog used by the website, including descriptions, pack sizes, image URLs, availability, and pricing. Node.js 22.13+ is required for its environment-file and TypeScript support. It creates six sandbox products with one price per pack and a Finland shipping rate matching `site.deliveryFeeEur`. Product availability matches the current catalog. No subscriptions or live charges are created.

Preview the import without credentials or Stripe requests:

```sh
npm run stripe:sync
```

To perform the sandbox import, copy `.env.example` to `.env.local` and set `STRIPE_SECRET_KEY` to your sandbox secret/restricted key. For a restricted key, enable the product, price, and shipping-rate permissions needed for reading and writing the catalog. Keep the file local; it is ignored by Git. Then run:

```sh
npm run stripe:sync -- --apply
```

The default importer refuses live keys. A live import requires a separate environment file, matching live mode/key, and the explicit `--live --apply` options described below. Existing managed products and matching price lookup keys are reused on subsequent runs. Updated amounts receive new prices, and the standard default price is updated. VAT-inclusive tax behavior is set on prices and delivery. An existing tax-exclusive rate stops the import rather than changing its tax treatment. IDs are written to `.stripe/catalog.sandbox.json` or `.stripe/catalog.live.json`, both ignored by Git. Product images use their publicly accessible URLs on the configured domain; deploy the corresponding assets before using checkout.

Stripe prices for white and red teff are separate. Checkout always selects the standard €25 price; previously imported bulk prices are not used for new website orders. Existing checkouts retain their original amounts. Importing the catalog does not activate live payments; order shipment remains a merchant task. Tax configuration should match the business's actual VAT treatment before accepting live payments.

## Running the sandbox checkout locally

Configure these server-only values in `.env.local`:

- `STRIPE_SECRET_KEY`: the configured sandbox secret/restricted key. Restricted keys must also permit checkout, prices, shipping rates, sessions, and payment method settings as needed.
- `STRIPE_MODE=sandbox`: explicitly keeps local development in sandbox mode (also the default).
- `CHECKOUT_BASE_URL=http://localhost:3000`: the trusted site origin used for redirects and origin validation.
- `STRIPE_WEBHOOK_SECRET`: the local listener saves this automatically. For a deployed sandbox, use the signing secret from that site's Stripe webhook endpoint.

Run the local webhook listener first:

```sh
npm run stripe:listen
```

It uses the sandbox key through the child process environment, forwards only checkout completion/success events to `/api/stripe/webhook`, and saves the signing secret without printing it. Keep it running during local checkout. Then start/restart the website in another terminal so it loads that secret:

```sh
npm run dev
```

Open http://localhost:3000, add available products, and select Checkout. The checkout page is explicitly marked as a sandbox: no real payment or delivery is created. Stripe's standard sandbox card is `4242 4242 4242 4242`, with a future expiry and any three-digit CVC. Do not use real card details for sandbox purchases.

Use `npm run stripe:methods` to see account/payout status and wallet availability, or `npm run stripe:methods -- --enable` to enable Apple Pay/Google Pay/MobilePay if the sandbox account makes them available.

The confirmation page retrieves payment status directly from Stripe and shows only an order belonging to the checkout browser's HttpOnly cookie. A successful payment removes purchased quantities once, retaining other cart contents. Cancellation, expiry, or unverified payment keeps the cart. The webhook uses the original request body and verifies the Stripe signature; duplicate events are idempotent and unrelated store events are ignored. Browser redirects alone never prove payment.

Before deploying a sandbox preview, set `CHECKOUT_BASE_URL` to the actual HTTPS origin, configure its sandbox secrets in the hosting environment, import the catalog into the same sandbox, and register `/api/stripe/webhook` with `checkout.session.completed` and `checkout.session.async_payment_succeeded`. The local CLI listener is not a production webhook.

Live keys and events are rejected in sandbox mode; sandbox keys and events are rejected in live mode. A browser return URL never marks an unpaid checkout successful. A live rollout still needs actual account/payout activation, eligible payment methods, business policies, receipt emails, and fulfilment arrangements.

## Live deployment on Vercel

The current local setup remains in sandbox mode. Prepare live catalog/account access in a separate ignored file:

```sh
cp .env.live.example .env.live.local
```

Enter the live secret/restricted key in `.env.live.local` on your computer. Keep `STRIPE_MODE=live` in that file; do not replace the sandbox values in `.env.local`. Do not send secret keys in chat or commit either file. The live importer changes products/prices/delivery rates only; it does not charge a customer or create a payment.

Preview and import the same catalog into Stripe live mode:

```sh
npm run stripe:sync:live
npm run stripe:sync:live -- --apply
npm run stripe:methods:live
```

Confirm charges and payouts are enabled for the live account. Google Pay, Apple Pay and MobilePay must be enabled in the live account's payment settings when available. The sandbox's settings/catalog are separate. Enable successful-payment receipt emails in Stripe; VAT invoices and fulfilment remain merchant tasks.

In Stripe **live mode**, create a webhook endpoint at `https://www.zewid.com/api/stripe/webhook` for `checkout.session.completed` and `checkout.session.async_payment_succeeded`. Select **Your account** and **Snapshot** payloads: this handler expects the event's Checkout Session in `data.object`. Use that endpoint's signing secret, not the local CLI secret. Because the checkout verifies the request origin, the configured origin must match the site's canonical domain; this project uses `www.zewid.com`.

In the linked Vercel project's **Settings → Environment Variables**, set these for **Production only**:

| Variable | Production value |
| --- | --- |
| `STRIPE_MODE` | `live` |
| `STRIPE_SECRET_KEY` | Live secret/restricted key; mark **Sensitive** |
| `STRIPE_WEBHOOK_SECRET` | Live endpoint signing secret; mark **Sensitive** |
| `CHECKOUT_BASE_URL` | `https://www.zewid.com` |

Use sandbox values with a matching origin for Preview deployments. Live mode is blocked when `VERCEL_ENV` is not `production`. Never prefix secrets with `NEXT_PUBLIC_`. Vercel environment changes apply to new deployments, so redeploy after setting them ([Vercel environment documentation](https://vercel.com/docs/environment-variables)).

Run lint, type checking and a production build before publishing. After deployment, confirm the site's prices/delivery total, successful payment return, Stripe order reference, signed webhook delivery and receipt email with a merchant-authorized live purchase. This code does not itself make that purchase. Do not use sandbox cards in live mode. To disable online payments, remove the production secret key and redeploy; WhatsApp ordering remains available.

The compatible Next.js update and PostCSS override resolve the reported production dependency advisories. Development-only globbing advisories remain in the lint tooling; no breaking downgrade was applied.

## Cart persistence and accessibility

The cart is stored under `zewid_cart` in browser local storage. Stored items are validated and rebuilt from the current catalog. Legacy entries identified by product name are migrated to stable slugs. Invalid, unknown, and unavailable entries are discarded; duplicate products are merged. Each product quantity is an integer between 1 and 999. Storage failures fall back to an in-memory cart.

The cart uses a native modal dialog for keyboard focus containment and Escape dismissal, restores focus to its opener, and locks background scrolling. Product links are separate from cart buttons. Quantity controls have product-specific accessible names, and the site includes a skip link, visible keyboard focus, and reduced-motion support.

## Content and SEO

The feedback page provides direct feedback and order-support links. Unverified testimonials and unfinished photo/video placeholders were removed. Publish customer reviews only after verifying their source and obtaining permission for their public use.

`src/lib/metadata.ts` generates canonical URLs and matching Open Graph/Twitter metadata for each page. Product previews use the corresponding product image. The default share image is `public/opengraph-image.png`; its declared dimensions match the source. The older JPG remains at `public/opengraph-image.jpg` to preserve its URL without overriding page metadata.

Robots and sitemap routes derive the domain from the shared site configuration. Add future routes to `src/app/sitemap.ts`.

## Images

Use `next/image` with appropriate `sizes`. The hero image is prioritized and optimized rather than loaded as a CSS background. Product cards, detail pages, and cart thumbnails request sizes suited to their layouts. The image optimizer negotiates AVIF or WebP with supporting browsers; original source images are retained.

To inspect actual mobile performance, run the production server and use browser performance tools on the homepage, catalog, and a product page. Compare cold and cached loads; record image transfer size, Largest Contentful Paint, layout shifts, and responsiveness. Measurements depend on the deployment host, cache, device, and connection.
