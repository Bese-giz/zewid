# Catalog launch details

The 24 confirmed-list items are prepared alongside the four retained products. New listings are coming soon, with no retail price or confirmed stock. Items 25–33 remain in `additional-products.draft.json`, outside the public catalog. The supplied Amharic names are attached to all 33 mapped entries, including the nine drafts; English-only parenthetical transliterations are omitted from Amharic labels.

## New listings to price and confirm

| Item | Product | Retail price (VAT inclusive) | Stock |
| --- | --- | --- | --- |
| 3 | Ethiopian Abish (Fenugreek Seeds) – 200 g | To confirm | To confirm |
| 4 | Ethiopian Ga’at Porridge Mix – Barley & Rye, 1 kg | To confirm | To confirm |
| 5 | Ethiopian Mekelesha Spice Mix – 100 g | To confirm | To confirm |
| 6 | Zemen Electric Injera Maker (Mogogo / Mitad) – 40 cm | To confirm | To confirm |
| 7 | Traditional Ethiopian Coffee Roasting Pan – Black | To confirm | To confirm |
| 8 | Digital Temperature Controller for Mogogo Injera Maker | To confirm | To confirm |
| 9 | Traditional Ethiopian Berele Glass – Tej Serving Glass | To confirm | To confirm |
| 10 | Traditional Ethiopian Ceramic Incense Burner | To confirm | To confirm |
| 11 | Ethiopian Floral Coffee Cups – Set of 12, 60 ml | To confirm | To confirm |
| 12 | Traditional Ethiopian Clay Spice Container | To confirm | To confirm |
| 13 | Electric Coffee Hot Plate – 1200 W | To confirm | To confirm |
| 14 | Ethiopian Ceramic Food Warmer – 3-Dish Serving Set | To confirm | To confirm |
| 15 | Ethiopian Coffee Cup, Saucer & Spoon Set – 18 Pieces | To confirm | To confirm |
| 16 | Ethiopian Ceramic Food Warmer – 2-Dish Serving Set | To confirm | To confirm |
| 17 | Ethiopian Traditional Coffee Ceremony Set – 23 Pieces | To confirm | To confirm |
| 18 | Amharic Alphabet Learning Chart for Kids | To confirm | To confirm |
| 19 | Ethiopian-Style 3-Tier Cake & Snack Stand | To confirm | To confirm |
| 20 | Ethiopian Frankincense (Etan) – Traditional Incense | To confirm | To confirm |
| 21 | Traditional Ethiopian Ketema Grass – Coffee Ceremony Decoration | To confirm | To confirm |
| 22 | Ethiopian Melamine Injera Serving Tray – Floral Design, 40 cm | To confirm | To confirm |
| 23 | Zemen Electric Injera Maker (Mogogo / Mitad) – 46 cm | To confirm | To confirm |
| 24 | Traditional Ethiopian Woven Meshrefet Basket – Medium | To confirm | To confirm |

## Product details awaiting confirmation

The original publication checklist and unverified fields are retained in `website-orders.md`. Confirm these against received goods before enabling purchases.

- Frankincense: confirm 100 g versus 250 g; no weight is displayed in the listing.
- Two electric injera makers: confirm controller inclusion, electrical ratings and supplied instructions.
- Serving sets: confirm contents, materials and care instructions; no active heating function is claimed.
- Food labels: complete the missing ingredient, allergen and storage details from received goods.
- The shared bare injera-maker photo appears in both model galleries, as specified by the image mapping; each model uses its size-specific box photo as the primary image.

## Enabling sales

Set a confirmed positive `priceEur` and change `availability` to `in-stock` in `src/data/products.ts`, then sync the appropriate Stripe catalog and deploy. Keep stable existing slugs so cart and order references remain compatible.
