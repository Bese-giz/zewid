# Website images

| Folder | Contents |
| --- | --- |
| `brand/` | Current ZEWID Market logo |
| `site/` | Homepage and About page photos |
| `products/food/` | Food product photos and secondary views |
| `products/coffee/` | Coffee ceremony, serving sets and incense photos |
| `products/kitchen/` | Injera makers, kitchenware and serving stands |
| `products/culture/` | Alphabet chart and Meshrefet basket |
| `packaging/` | Current pouch photos, including size-specific packs |
| `on-request-products/` | Supplier photos for WhatsApp-only listings |
| `payment-methods/` | Active SVG payment icons and attribution |

Product photos, gallery order and variant photos are set in `src/data/products.ts`. Keep existing second and later gallery photos unless intentionally replacing them. Image-map files beside supplied photos record the source artwork.

Editable print labels are in `assets/packaging-labels/` at the repository root. They are retained as design sources rather than public product photos.

All unused images and previous archived files are in the single local `photos-to-delete/` folder at the repository root. Its README and inventory explain what was moved. The whole folder can be deleted after review; no website page depends on it.

Old URLs for reorganized active photos resolve through `src/data/legacy-image-paths.json`, so existing Stripe image links and shared image URLs keep working.
