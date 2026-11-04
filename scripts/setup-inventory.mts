import { readFile } from "node:fs/promises";
import postgres from "postgres";
import { products, getSelectedProduct } from "../src/data/products.ts";
import { openingStock } from "../src/data/opening-stock.ts";

async function main() {
  if (!process.argv.includes("--apply")) {
    console.log(JSON.stringify({ mode: "preview; no database changes", products: products.map(product => ({ slug: product.slug,
      ...(openingStock[product.slug] ?? { unit: "item", quantity: 0 }) })) }, null, 2));
    return;
  }
  if (!process.env.POSTGRES_URL) throw new Error("Set the existing admin POSTGRES_URL locally; keep it out of chat.");
  const sql = postgres(process.env.POSTGRES_URL, { max: 1, prepare: false, connect_timeout: 15, onnotice: () => {} });
  try {
    const schema = await readFile(new URL("./sql/inventory.sql", import.meta.url), "utf8");
    await sql.begin(async tx => {
      await tx.unsafe(schema);
      for (const scope of ["live", "sandbox"]) {
        const stock = products.map(product => ({ scope, slug: product.slug, name: product.name, image: product.image,
          availability: product.availability, unit: openingStock[product.slug]?.unit ?? "item", on_hand: openingStock[product.slug]?.quantity ?? 0 }));
        await tx.unsafe(`INSERT INTO zewid_stock(scope,slug,name,image,availability,unit,on_hand)
          SELECT scope,slug,name,image,availability,unit,on_hand FROM jsonb_to_recordset($1::jsonb)
          AS x(scope text,slug text,name text,image text,availability text,unit text,on_hand integer)
          ON CONFLICT(scope,slug) DO UPDATE SET name=excluded.name,image=excluded.image,availability=excluded.availability`, [tx.json(stock)]);
        const skus = products.flatMap(product => (product.variants?.map(variant => variant.id) ?? [undefined]).map(variantId => {
          const selected = getSelectedProduct(product, variantId)!;
          return { scope, slug: product.slug, variant_id: variantId ?? "", label: selected.weight,
            units: openingStock[product.slug]?.unit === "g" ? Math.round((selected.weightKg ?? 0) * 1000) : 1,
            price_cents: selected.priceEur === null ? null : Math.round(selected.priceEur * 100) };
        }));
        if (skus.some(sku => sku.units < 1)) throw new Error("A stock pack is missing its weight.");
        await tx.unsafe(`INSERT INTO zewid_stock_sku(scope,slug,variant_id,label,units,price_cents)
          SELECT scope,slug,variant_id,label,units,price_cents FROM jsonb_to_recordset($1::jsonb)
          AS x(scope text,slug text,variant_id text,label text,units integer,price_cents integer)
          ON CONFLICT(scope,slug,variant_id) DO UPDATE SET label=excluded.label,units=excluded.units,price_cents=excluded.price_cents`, [tx.json(skus)]);
      }
    });
    console.log("Inventory schema and original purchase balances are ready. Existing stock balances, orders and users were preserved.");
  } finally { await sql.end(); }
}
main().catch((error: unknown) => {
  const detail = error as { code?: string; position?: string; message?: string };
  console.error("Inventory setup failed.", JSON.stringify({ code: detail.code, position: detail.position,
    ...(detail.code?.startsWith("42") || detail.code === "22023" ? { sqlError: detail.message } : {}) }));
  process.exitCode = 1;
});
