# Small payment-method icons

Files: cards, visa, mastercard, apple-pay, google-pay, klarna.

Each is supplied as SVG (recommended for websites) and PNG. PNGs are 64 pixels high, suitable for displaying at 32 pixels high on high-density screens. SVGs stay sharp at any display size and preserve the provided artwork/proportions.

Website paths: `/images/payment-methods/apple-pay.svg`, `/images/payment-methods/google-pay.svg`, etc.

Example:

```html
<img src="/images/payment-methods/apple-pay.svg" alt="Apple Pay" style="height:28px;width:auto">
```

Use the same display height and consistent spacing across the payment row. These are payment-method display icons; payment functionality is supplied by your checkout integration.

Sources: Apple Pay, Google Pay and Klarna are downloaded from their official brand/CDN resources. The generic card, Visa and Mastercard files come from the Active Merchant Payment Icons project, extracted from Shopify. The project's MIT license is included. Exact URLs are in sources.json. Preserve brand artwork, colors and aspect ratios.
