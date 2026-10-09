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

Edit `src/data/products.ts` to update products. Each product has a stable slug, name, pack size, description, image, features, and `availability` (`in-stock` or `out-of-stock`). Currently all products are available except Mashila (sorghum).

Prices have not been supplied. Leave `priceEur` unset to display “Price: confirm on WhatsApp”, or add a verified numeric euro price per listed bag/pack:

```ts
priceEur: 25, // Example only; replace with the actual price.
```

Unavailable products remain visible for enquiries but cannot be added to the cart. Rebuild/redeploy after changing the catalog or stock status.

## Delivery and ordering

`src/lib/site.ts` contains the site URL, WhatsApp number, delivery coverage, and delivery time. Delivery is currently 1–2 days throughout Finland. Delivery charges have not been supplied and are confirmed on WhatsApp before the customer confirms the order.

Customers add available products from the homepage, catalog, or product detail page. Product detail pages include quantity selection. The cart's “Request Total on WhatsApp” action opens a draft containing every cart item, pack size, and quantity. Opening WhatsApp does not submit or confirm an order, and the cart is not cleared automatically.

There is no payment gateway, inventory service, order database, or admin portal. Fulfilment and payment arrangements happen directly with the business on WhatsApp.

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
