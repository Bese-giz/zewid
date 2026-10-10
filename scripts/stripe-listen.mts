import { spawn } from "node:child_process";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const key = process.env.STRIPE_SECRET_KEY;
if (!key || !/^(sk|rk)_test_/.test(key)) throw new Error("A sandbox STRIPE_SECRET_KEY must be configured in .env.local.");
const origin = new URL(process.env.CHECKOUT_BASE_URL || "http://localhost:3000");
if (origin.protocol !== "http:" || !["localhost", "127.0.0.1"].includes(origin.hostname)) throw new Error("This listener is for localhost only. Configure a Stripe webhook endpoint for deployed hosting.");
await mkdir(".stripe/config", { recursive: true });
const child = spawn(fileURLToPath(new URL("../node_modules/.bin/stripe", import.meta.url)), [
  "listen", "--events", "checkout.session.completed,checkout.session.async_payment_succeeded",
  "--forward-to", `${origin.origin}/api/stripe/webhook`,
], { env: { ...process.env, STRIPE_API_KEY: key, STRIPE_DEVICE_NAME: "zewid-local-checkout", XDG_CONFIG_HOME: fileURLToPath(new URL("../.stripe/config", import.meta.url)) }, stdio: ["ignore", "pipe", "pipe"] });

let configured = false;
let pending = "";
let chain = Promise.resolve();
function receive(chunk: Buffer) {
  pending += chunk.toString();
  const lines = pending.split(/\r?\n/);
  pending = lines.pop() ?? "";
  for (const line of lines) {
    chain = chain.then(async () => {
      const signingSecret = line.match(/whsec_[a-zA-Z0-9]+/)?.[0];
      if (signingSecret && !configured) {
        const source = await readFile(".env.local", "utf8");
        const next = /^STRIPE_WEBHOOK_SECRET=.*$/m.test(source)
          ? source.replace(/^STRIPE_WEBHOOK_SECRET=.*$/m, `STRIPE_WEBHOOK_SECRET=${signingSecret}`)
          : `${source.trimEnd()}\nSTRIPE_WEBHOOK_SECRET=${signingSecret}\n`;
        await writeFile(".env.local", next);
        configured = true;
        console.log("Stripe sandbox webhook forwarding is ready. The signing secret was saved locally without displaying it.");
        console.log("Start or restart the website so it loads the signing secret. Leave this listener running during local checkout.");
      } else if (configured && /checkout\.session|--> POST/.test(line)) {
        console.log(line.replace(/(?:sk|rk)_(?:test|live)_[a-zA-Z0-9]+|whsec_[a-zA-Z0-9]+/g, "[redacted]"));
      } else if (/ERROR|Error|error|failed|unauthorized/i.test(line)) {
        console.error("Stripe listener reported a connection error. Check sandbox credentials and connectivity.");
      }
    }).catch(() => { console.error("The local webhook signing secret could not be saved."); child.kill("SIGTERM"); });
  }
}
child.stdout.on("data", receive);
child.stderr.on("data", receive);
child.on("error", () => { console.error("Stripe CLI could not be started."); process.exitCode = 1; });
child.on("exit", async (code) => { await chain; process.exitCode = code ?? 0; });
process.on("SIGINT", () => child.kill("SIGINT"));
process.on("SIGTERM", () => child.kill("SIGTERM"));
