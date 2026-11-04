-- Additive shared inventory. No existing orders/users are reset or deleted.
ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "inventoryItems" text;
ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "inventoryScope" text;
ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "inventoryReservationId" text;
CREATE TABLE IF NOT EXISTS zewid_stock (
  scope text NOT NULL CHECK(scope IN ('live','sandbox')), slug text NOT NULL,
  name text NOT NULL, image text NOT NULL, unit text NOT NULL CHECK(unit IN ('item','g')),
  on_hand integer NOT NULL CHECK(on_hand >= 0), availability text NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now(), PRIMARY KEY(scope,slug)
);
CREATE TABLE IF NOT EXISTS zewid_stock_sku (
  scope text NOT NULL, slug text NOT NULL, variant_id text NOT NULL DEFAULT '',
  label text NOT NULL, units integer NOT NULL CHECK(units > 0), price_cents integer,
  PRIMARY KEY(scope,slug,variant_id), FOREIGN KEY(scope,slug) REFERENCES zewid_stock(scope,slug)
);
CREATE TABLE IF NOT EXISTS zewid_stock_reservation (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), scope text NOT NULL CHECK(scope IN ('live','sandbox')),
  request_key text NOT NULL, owner_hash text NOT NULL, fingerprint text NOT NULL,
  status text NOT NULL DEFAULT 'held' CHECK(status IN ('held','paid','released')),
  items jsonb NOT NULL, expires_at timestamptz NOT NULL DEFAULT now()+interval '31 minutes',
  stripe_session_id text, stripe_payload jsonb, next_check_at timestamptz NOT NULL DEFAULT now()+interval '31 minutes',
  created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(scope,request_key), UNIQUE(scope,stripe_session_id)
);
CREATE TABLE IF NOT EXISTS zewid_stock_reservation_line (
  reservation_id uuid NOT NULL REFERENCES zewid_stock_reservation(id), scope text NOT NULL,
  slug text NOT NULL, units integer NOT NULL CHECK(units > 0), PRIMARY KEY(reservation_id,slug),
  FOREIGN KEY(scope,slug) REFERENCES zewid_stock(scope,slug)
);
CREATE INDEX IF NOT EXISTS zewid_stock_reservation_due ON zewid_stock_reservation(scope,status,next_check_at);
CREATE TABLE IF NOT EXISTS zewid_stock_manual_order (
  scope text NOT NULL, order_id text NOT NULL, items jsonb NOT NULL, units jsonb NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now(), PRIMARY KEY(scope,order_id)
);
CREATE TABLE IF NOT EXISTS zewid_stock_movement (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), scope text NOT NULL, slug text NOT NULL,
  delta integer NOT NULL, reason text NOT NULL, reference text, created_at timestamptz NOT NULL DEFAULT now()
);

CREATE OR REPLACE FUNCTION zewid_stock_snapshot(p_scope text) RETURNS jsonb LANGUAGE sql AS $$
 SELECT coalesce(jsonb_agg(to_jsonb(rows) ORDER BY rows.name),'[]'::jsonb) FROM (
  SELECT s.slug,s.name,s.image,s.unit,s.on_hand,s.availability,
    coalesce(h.held,0)::integer AS reserved,
    (s.on_hand-coalesce(h.held,0))::integer AS available,
    coalesce((SELECT jsonb_agg(jsonb_build_object('variantId',k.variant_id,'label',k.label,'units',k.units,'priceCents',k.price_cents) ORDER BY k.units) FROM zewid_stock_sku k WHERE k.scope=s.scope AND k.slug=s.slug AND (k.variant_id<>'' OR NOT EXISTS (SELECT 1 FROM zewid_stock_sku sized WHERE sized.scope=k.scope AND sized.slug=k.slug AND sized.variant_id<>''))),'[]'::jsonb) AS options
  FROM zewid_stock s LEFT JOIN (
   SELECT l.slug,sum(l.units) AS held FROM zewid_stock_reservation_line l
   JOIN zewid_stock_reservation r ON r.id=l.reservation_id WHERE r.scope=p_scope AND r.status='held' GROUP BY l.slug
  ) h ON h.slug=s.slug WHERE s.scope=p_scope
 ) rows;
$$;

CREATE OR REPLACE FUNCTION zewid_stock_units(p_scope text,p_items jsonb) RETURNS jsonb LANGUAGE plpgsql AS $$
DECLARE item jsonb; sku zewid_stock_sku%ROWTYPE; result jsonb='{}'; amount integer; key text;
BEGIN
 IF jsonb_typeof(p_items)<>'array' OR jsonb_array_length(p_items)>100 THEN RAISE EXCEPTION 'Invalid stock items'; END IF;
 FOR item IN SELECT value FROM jsonb_array_elements(p_items) LOOP
  IF jsonb_typeof(item->'quantity')<>'number' OR (item->>'quantity') !~ '^[0-9]+$' THEN RAISE EXCEPTION 'Invalid quantity'; END IF;
  amount=(item->>'quantity')::integer;
  IF amount<1 OR amount>999 THEN RAISE EXCEPTION 'Invalid quantity'; END IF;
  SELECT * INTO sku FROM zewid_stock_sku WHERE scope=p_scope AND slug=item->>'slug' AND variant_id=coalesce(item->>'variantId','');
  IF NOT FOUND THEN RAISE EXCEPTION 'Unknown stock item'; END IF;
  key=sku.slug;
  result=jsonb_set(result,ARRAY[key],to_jsonb(coalesce((result->>key)::integer,0)+sku.units*amount),true);
 END LOOP;
 RETURN result;
END;
$$;

CREATE OR REPLACE FUNCTION zewid_stock_action(p_scope text,p_action text,p_body jsonb) RETURNS jsonb LANGUAGE plpgsql AS $$
DECLARE r zewid_stock_reservation%ROWTYPE; s zewid_stock%ROWTYPE; requested jsonb;
 item record; held integer; available integer; previous jsonb; change integer; old_items jsonb;
BEGIN
 IF p_scope NOT IN ('live','sandbox') THEN RAISE EXCEPTION 'Invalid stock environment'; END IF;
 -- All mutations share a short transaction lock. The check and reservation
 -- cannot interleave with another checkout, stock adjustment or manual sale.
 PERFORM pg_advisory_xact_lock(hashtext('zewid_stock_'||p_scope));
 IF p_action='reserve' THEN
  SELECT * INTO r FROM zewid_stock_reservation WHERE scope=p_scope AND request_key=p_body->>'key';
  IF FOUND THEN
   IF r.owner_hash<>p_body->>'ownerHash' OR r.fingerprint<>p_body->>'fingerprint' THEN RETURN jsonb_build_object('error','attempt-mismatch'); END IF;
   IF r.status<>'held' OR r.expires_at<=now() THEN RETURN jsonb_build_object('error','attempt-finished'); END IF;
   RETURN to_jsonb(r);
  END IF;
  IF jsonb_array_length(p_body->'items')=0 THEN RAISE EXCEPTION 'Empty stock order'; END IF;
  requested=zewid_stock_units(p_scope,p_body->'items');
  FOR item IN SELECT * FROM jsonb_each_text(requested) LOOP
   SELECT * INTO s FROM zewid_stock WHERE scope=p_scope AND slug=item.key;
   SELECT coalesce(sum(l.units),0)::integer INTO held FROM zewid_stock_reservation_line l JOIN zewid_stock_reservation x ON x.id=l.reservation_id WHERE x.scope=p_scope AND x.status='held' AND l.slug=item.key;
   available=s.on_hand-held;
   IF s.availability<>'in-stock' OR available<item.value::integer THEN RETURN jsonb_build_object('error','insufficient-stock','slug',s.slug,'name',s.name); END IF;
  END LOOP;
  INSERT INTO zewid_stock_reservation(scope,request_key,owner_hash,fingerprint,items)
   VALUES(p_scope,p_body->>'key',p_body->>'ownerHash',p_body->>'fingerprint',p_body->'items') RETURNING * INTO r;
  INSERT INTO zewid_stock_reservation_line(reservation_id,scope,slug,units) SELECT r.id,p_scope,key,value::integer FROM jsonb_each_text(requested);
  RETURN to_jsonb(r);
 ELSIF p_action IN ('prepare','attach','settle') THEN
  SELECT * INTO r FROM zewid_stock_reservation WHERE scope=p_scope AND id=(p_body->>'id')::uuid;
  IF NOT FOUND THEN RETURN jsonb_build_object('error','reservation-missing'); END IF;
  IF p_body ? 'ownerHash' AND r.owner_hash<>p_body->>'ownerHash' THEN RETURN jsonb_build_object('error','attempt-mismatch'); END IF;
  IF p_action='prepare' THEN
   IF r.status<>'held' THEN RETURN jsonb_build_object('error','attempt-finished'); END IF;
   IF r.stripe_payload IS NULL THEN UPDATE zewid_stock_reservation SET stripe_payload=p_body->'payload',updated_at=now() WHERE id=r.id RETURNING * INTO r; END IF;
  ELSIF p_action='attach' THEN
   IF r.stripe_session_id IS NOT NULL AND r.stripe_session_id<>p_body->>'sessionId' THEN RAISE EXCEPTION 'Stock checkout mismatch'; END IF;
   UPDATE zewid_stock_reservation SET stripe_session_id=p_body->>'sessionId',updated_at=now() WHERE id=r.id RETURNING * INTO r;
  ELSE
   IF r.stripe_session_id IS NOT NULL AND r.stripe_session_id<>p_body->>'sessionId' THEN RAISE EXCEPTION 'Stock checkout mismatch'; END IF;
   IF p_body->>'status'='paid' AND r.status='released' THEN RAISE EXCEPTION 'Released stock requires payment review'; END IF;
   IF p_body->>'status'='paid' AND r.status='held' THEN
    FOR item IN SELECT slug,units FROM zewid_stock_reservation_line WHERE reservation_id=r.id LOOP
     UPDATE zewid_stock SET on_hand=on_hand-item.units,updated_at=now() WHERE scope=p_scope AND slug=item.slug;
     INSERT INTO zewid_stock_movement(scope,slug,delta,reason,reference) VALUES(p_scope,item.slug,-item.units,'Website payment',r.id::text);
    END LOOP;
    UPDATE zewid_stock_reservation SET status='paid',stripe_session_id=p_body->>'sessionId',updated_at=now() WHERE id=r.id RETURNING * INTO r;
   ELSIF p_body->>'status'='released' AND r.status='held' THEN
    UPDATE zewid_stock_reservation SET status='released',stripe_session_id=coalesce(stripe_session_id,p_body->>'sessionId'),updated_at=now() WHERE id=r.id RETURNING * INTO r;
   END IF;
  END IF;
  RETURN to_jsonb(r);
 ELSIF p_action='adjust' THEN
  SELECT * INTO s FROM zewid_stock WHERE scope=p_scope AND slug=p_body->>'slug';
  IF NOT FOUND THEN RAISE EXCEPTION 'Unknown stock product'; END IF;
  available=(p_body->>'onHand')::integer;
  SELECT coalesce(sum(l.units),0)::integer INTO held FROM zewid_stock_reservation_line l JOIN zewid_stock_reservation x ON x.id=l.reservation_id WHERE x.scope=p_scope AND x.status='held' AND l.slug=s.slug;
  IF available<held OR available<0 THEN RETURN jsonb_build_object('error','below-reservations'); END IF;
  INSERT INTO zewid_stock_movement(scope,slug,delta,reason) VALUES(p_scope,s.slug,available-s.on_hand,p_body->>'reason');
  UPDATE zewid_stock SET on_hand=available,updated_at=now() WHERE scope=p_scope AND slug=s.slug;
  RETURN jsonb_build_object('ok',true);
 ELSIF p_action='manual' THEN
  requested=zewid_stock_units(p_scope,p_body->'items');
  SELECT units INTO previous FROM zewid_stock_manual_order WHERE scope=p_scope AND order_id=p_body->>'orderId';
  previous=coalesce(previous,'{}');
  FOR item IN SELECT key FROM jsonb_each(requested||previous) LOOP
   change=coalesce((requested->>item.key)::integer,0)-coalesce((previous->>item.key)::integer,0);
   SELECT * INTO s FROM zewid_stock WHERE scope=p_scope AND slug=item.key;
   SELECT coalesce(sum(l.units),0)::integer INTO held FROM zewid_stock_reservation_line l JOIN zewid_stock_reservation x ON x.id=l.reservation_id WHERE x.scope=p_scope AND x.status='held' AND l.slug=item.key;
   IF change>0 AND (s.on_hand-held<change OR s.availability<>'in-stock') THEN RETURN jsonb_build_object('error','insufficient-stock','slug',s.slug,'name',s.name); END IF;
  END LOOP;
  FOR item IN SELECT key FROM jsonb_each(requested||previous) LOOP
   change=coalesce((requested->>item.key)::integer,0)-coalesce((previous->>item.key)::integer,0);
   IF change<>0 THEN
    UPDATE zewid_stock SET on_hand=on_hand-change,updated_at=now() WHERE scope=p_scope AND slug=item.key;
    INSERT INTO zewid_stock_movement(scope,slug,delta,reason,reference) VALUES(p_scope,item.key,-change,'Manual order allocation',p_body->>'orderId');
   END IF;
  END LOOP;
  INSERT INTO zewid_stock_manual_order(scope,order_id,items,units) VALUES(p_scope,p_body->>'orderId',p_body->'items',requested)
   ON CONFLICT(scope,order_id) DO UPDATE SET items=excluded.items,units=excluded.units,updated_at=now();
  RETURN jsonb_build_object('ok',true);
 END IF;
 RAISE EXCEPTION 'Unknown stock action';
END;
$$;
