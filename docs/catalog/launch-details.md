# Catalog launch details

Updated 13 November 2026. All 41 listings remain public, with 31 available to buy, nine available on request and Mitmita sold out. All supplied Amharic names and image galleries are retained.

## Confirmed retail prices

`retail-prices.json` records the selling-price handoff from `accepted-pack-prices.json` and the `Stock and profit` worksheet in `zewid-stock-costs-and-profit.xlsx`. Only selling prices and retail units are copied into the repository. Invoice purchase costs and projected profits remain in the source workbook.

The user confirmed the 500 g coffee price of €8.90 and confirmed that all newly priced products should become available to buy. Prices include VAT as previously confirmed. The existing Finland delivery charge remains €8.90 per order.

On 13 November 2026, the user confirmed Abish flour at €5 per 200 g pack. Roasted Abish seed prices remain unchanged. Product names display Amharic first in the primary style, with English below in the secondary style.

| Product | Retail unit | Price |
| --- | --- | ---: |
| Mashila sorghum flour | 5 kg bag | €12.90 |
| Sidamo green coffee | 500 g / 1 kg | €8.90 / €15.90 |
| Berbere | 250 g / 500 g / 1 kg | €9.50 / €17.50 / €30 |
| Korerima | 250 g / 500 g / 1 kg | €17.50 / €30 / €55 |
| Roasted Abish | 250 g / 500 g / 1 kg | €7.50 / €13.50 / €25 |
| Abish Flour | 200 g | €5 |
| Bula | 250 g / 500 g / 1 kg | €7.50 / €12.50 / €22 |
| Zemen injera maker, small | 40 cm maker | €130 |
| Coffee roasting pan | 1 pan | €15 |
| Mogogo temperature controller | 1 controller | €25 |
| Berele tej glass | 1 glass | €7 |
| Ceramic incense burner | 1 burner | €13 |
| Floral coffee cups | Set of 12 | €20 |
| Clay spice container | 1 container | €20 |
| Ga’at porridge mix | 1 kg pack | €7 |
| Electric coffee hot plate | 1 hot plate | €40 |
| Mekelesha | 100 g pack | €7 |
| Ceramic food warmer | 3-dish set | €90 |
| Coffee cup, saucer and spoon set | 18-piece set | €27 |
| Ceramic food warmer | 2-dish set | €70 |
| Coffee ceremony set | 23-piece set | €50 |
| Alphabet Chart (Tigrinya) | 1 chart | €22 |
| Cake and snack stand | 3-tier stand | €23 |
| Frankincense | 250 g pack | €7 |
| Ketema grass | 1 bundle | €12.50 |
| Floral injera tray | 40 cm tray | €15 |
| Zemen injera maker, large | 46 cm maker | €140 |
| Meshrefet | 1 basket | €12 |

White and red teff remain €25 per 5 kg bag at every quantity. Mitin Shiro (ምጥን ሽሮ) is €16 per 500 g pack and €30 per 1 kg pack. The supplied workbook treats complete sets as single retail units; no per-piece prices are inferred.

## Pack-size selection

Berbere, Korerima, Abish and Bula have 250 g, 500 g and 1 kg options. Coffee has 500 g and 1 kg only. Korerima and Abish no longer offer a 200 g retail option. All sizes represent alternative packs from the same product stock. The shared inventory system below tracks their combined weight rather than separate balances for each pack size.

Product detail pages present selectable size cards with the price of each option. Selecting a size updates the main price, weight, add-to-cart subtotal and WhatsApp enquiry. Cart lines, persisted carts and Stripe orders retain the exact selected pack ID.

Abish and Korerima now use the supplied gold-pouch photos for each size. Selecting 250 g, 500 g or 1 kg also changes the detail photo and enlarged view; the matching photo is retained in the cart and Stripe catalog. Korerima is whole Ethiopian cardamom seeds removed from pods, with the supplied English and Amharic names replacing the former powder description. All accepted selling prices remain unchanged, including the separately confirmed €8.90 coffee option.

## Shared inventory

Opening balances are recorded in `opening-stock.md` and seeded once into the shared storefront/admin database. White and red teff each start at 50 bags. Website checkout reserves available stock before payment; verified payment deducts it once. Cancelled or expired Stripe sessions release their holds after verification. Admin manual orders use the same stock through explicit product and pack selection. Current balances are managed in ZEWID Admin → Stock; redeploying or rerunning setup does not reset them. Sandbox and live balances are separate.

## Available on request

Six Rekebot ceremony sets/tables, Alviia Luwam extensions and the two Zenith oils remain WhatsApp-only because these files contain no confirmed retail prices for them. Their existing photos and descriptions remain published. No zero prices or estimated prices are used. Mitmita is marked sold out; enquiries remain available, but cart purchases are disabled.

## Product details

Original descriptions and verification notes remain in `website-orders.md` and `additional-products.draft.json`. The updated workbook confirms frankincense at 250 g. Product images can depict one of the offered package sizes; the selected retail size is shown beside the price and in the order. Electrical specifications, ingredients and allergens continue to use supplied product information without new claims.

For future price changes, edit `src/data/products.ts`, sync the appropriate Stripe catalog and deploy. Preserve existing product slugs and pack IDs so carts and historical order references remain compatible.

## Image organization

Active photos are grouped by purpose and product category under `public/images/`; see its README. Print-label masters are retained in `assets/packaging-labels/`. All unused photos and previous archive contents are consolidated into the ignored local `photos-to-delete/` folder, which can be deleted after review. Existing gallery order and pack-specific photos are preserved, and old active image URLs continue to work through Next.js rewrites.
