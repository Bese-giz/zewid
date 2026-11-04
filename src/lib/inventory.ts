import "server-only";
import postgres from "postgres";
import type Stripe from "stripe";
import type { CartSelection } from "./pricing";
import { getStripe } from "./stripe";
import { readStripeMode } from "./stripe-mode";

export class InventoryError extends Error {
  constructor(message: string, public readonly retryWithNewAttempt = false) { super(message); }
}
interface Reservation {
  id: string; status: "held" | "paid" | "released"; request_key: string; owner_hash: string;
  expires_at: string; stripe_session_id: string | null; stripe_payload: Stripe.Checkout.SessionCreateParams | null;
}
export interface InventoryRow {
  slug: string; name: string; image: string; unit: "item" | "g"; on_hand: number; reserved: number; available: number;
  availability: string; options: { variantId: string; label: string; units: number; priceCents: number | null }[];
}
let connection: ReturnType<typeof postgres> | undefined;
function db() {
  if (!process.env.POSTGRES_URL) throw new Error("Inventory database is not configured.");
  return connection ??= postgres(process.env.POSTGRES_URL, { max: 3, prepare: false, connect_timeout: 10, idle_timeout: 20 });
}
function scope() { return readStripeMode(process.env.STRIPE_MODE); }

async function action<T>(operation: string, body: object): Promise<T> {
  const [row] = await db()`SELECT zewid_stock_action(${scope()},${operation},${db().json(JSON.parse(JSON.stringify(body)))}::jsonb) AS result`;
  const result = row.result;
  if (result.error === "insufficient-stock") throw new InventoryError(`${result.name}: there is not enough stock for this quantity. Please review your cart.`);
  if (result.error === "attempt-finished") throw new InventoryError("This checkout has ended. Please try again to start a new checkout.", true);
  if (result.error) throw new InventoryError("This stock reservation could not be used. Please try again.", true);
  return result as T;
}
export async function inventorySnapshot(): Promise<InventoryRow[]> {
  const [row] = await db()`SELECT zewid_stock_snapshot(${scope()}) AS products`;
  return row.products;
}
export async function reserveInventory(key: string, ownerHash: string, fingerprint: string, items: CartSelection[]) {
  return action<Reservation>("reserve", { key, ownerHash, fingerprint, items });
}
export async function prepareInventoryCheckout(id: string, ownerHash: string, payload: Stripe.Checkout.SessionCreateParams) {
  return action<Reservation>("prepare", { id, ownerHash, payload });
}
export async function attachInventoryCheckout(id: string, ownerHash: string, sessionId: string) {
  return action<Reservation>("attach", { id, ownerHash, sessionId });
}
export async function settleInventory(session: Stripe.Checkout.Session, failed = false) {
  const id = session.metadata?.zewid_inventory_reservation;
  if (!id) return;
  if (session.metadata?.zewid_inventory_scope !== scope() || session.metadata.zewid_store !== "zewid") throw new Error("Stock environment mismatch.");
  if (session.status === "complete" && session.payment_status === "paid") {
    const expected = Number(session.metadata.zewid_total_cents);
    if (!Number.isSafeInteger(expected) || expected <= 0 || session.amount_total !== expected || session.currency !== "eur") throw new Error("Stock payment total mismatch.");
    await action("settle", { id, sessionId: session.id, status: "paid" });
  } else if (session.status === "expired" || (failed && session.status === "complete" && session.payment_status === "unpaid")) {
    await action("settle", { id, sessionId: session.id, status: "released" });
  }
}

let reconciliation: Promise<void> | undefined;
let lastCheck = 0;
export async function reconcileInventory() {
  if (Date.now() - lastCheck < 30_000) return;
  if (reconciliation) return reconciliation;
  lastCheck = Date.now();
  reconciliation = (async () => {
    const rows = await db()`UPDATE zewid_stock_reservation SET next_check_at=now()+interval '1 minute'
      WHERE id IN (SELECT id FROM zewid_stock_reservation WHERE scope=${scope()} AND status='held'
        AND expires_at<now() AND next_check_at<=now() AND stripe_session_id IS NOT NULL ORDER BY next_check_at LIMIT 5 FOR UPDATE SKIP LOCKED)
      RETURNING stripe_session_id`;
    await Promise.allSettled(rows.map(async row => {
      const session = await getStripe().checkout.sessions.retrieve(row.stripe_session_id, { expand: ["payment_intent"] });
      const intent = typeof session.payment_intent === "object" ? session.payment_intent : null;
      const failed = session.status === "complete" && session.payment_status === "unpaid" &&
        (intent?.status === "canceled" || (intent?.status === "requires_payment_method" && Boolean(intent.last_payment_error)));
      await settleInventory(session, failed);
    }));
  })().finally(() => { reconciliation = undefined; });
  return reconciliation;
}

export async function expireOtherCheckouts(ownerHash: string, exceptKey: string) {
  const rows = await db()`SELECT stripe_session_id FROM zewid_stock_reservation WHERE scope=${scope()}
    AND owner_hash=${ownerHash} AND request_key<>${exceptKey} AND status='held' AND stripe_session_id IS NOT NULL LIMIT 5`;
  for (const row of rows) {
    let session = await getStripe().checkout.sessions.retrieve(row.stripe_session_id);
    if (session.status === "open") session = await getStripe().checkout.sessions.expire(session.id);
    await settleInventory(session);
    if (session.status === "complete" && session.payment_status !== "paid") throw new InventoryError("Your previous payment is still processing. Please wait before starting another checkout.");
  }
}

export async function cancelInventoryCheckout(id: string, ownerHash: string) {
  const [row] = await db()`SELECT stripe_session_id FROM zewid_stock_reservation WHERE scope=${scope()} AND id=${id}::uuid AND owner_hash=${ownerHash}`;
  if (!row?.stripe_session_id) throw new InventoryError("This checkout could not be cancelled. Please retry the original checkout or contact us.");
  let session = await getStripe().checkout.sessions.retrieve(row.stripe_session_id);
  if (session.status === "open") session = await getStripe().checkout.sessions.expire(session.id);
  await settleInventory(session);
  return { released: session.status === "expired", paid: session.payment_status === "paid" };
}
