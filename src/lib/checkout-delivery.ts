export interface CheckoutDelivery {
  name: string;
  email: string;
  phone: string;
  line1: string;
  line2: string;
  postalCode: string;
  city: string;
  country: "FI";
}

export type DeliveryField = keyof CheckoutDelivery;

export class DeliveryInputError extends Error {
  constructor(message: string, public field?: DeliveryField) { super(message); }
}

export function emptyCheckoutDelivery(): CheckoutDelivery {
  return { name: "", email: "", phone: "", line1: "", line2: "", postalCode: "", city: "", country: "FI" };
}

export function validateCheckoutDelivery(value: unknown): CheckoutDelivery {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new DeliveryInputError("Please return to your cart and enter your delivery details before payment.");
  const input = value as Record<string, unknown>;
  function field(key: DeliveryField, label: string, max: number, optional = false): string {
    const raw = input[key];
    if (optional && (raw === undefined || raw === null)) return "";
    if (typeof raw !== "string" || (!optional && !raw.trim()) || raw.trim().length > max || /[\u0000-\u001f\u007f]/.test(raw)) {
      throw new DeliveryInputError(`Enter a valid ${label}.`, key);
    }
    return raw.trim();
  }
  const name = field("name", "recipient name", 100);
  const email = field("email", "email address", 254);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new DeliveryInputError("Enter a valid email address.", "email");
  const phone = field("phone", "phone number", 30).replace(/[\s()-]/g, "");
  if (!/^\+?[0-9]{7,15}$/.test(phone)) throw new DeliveryInputError("Enter a phone number with 7–15 digits, including the country code if needed.", "phone");
  const line1 = field("line1", "street address", 200);
  const line2 = field("line2", "apartment or address line 2", 200, true);
  const postalCode = field("postalCode", "Finnish postcode", 5);
  if (!/^[0-9]{5}$/.test(postalCode)) throw new DeliveryInputError("Enter a Finnish postcode with five digits.", "postalCode");
  const city = field("city", "city", 100);
  if (input.country !== "FI") throw new DeliveryInputError("Website checkout is available for delivery in Finland only.", "country");
  return { name, email, phone, line1, line2, postalCode, city, country: "FI" };
}

export function checkoutDeliveryMetadata(delivery: CheckoutDelivery): Record<string, string> {
  return {
    zewid_delivery_source: "website",
    zewid_delivery_name: delivery.name,
    zewid_delivery_email: delivery.email,
    zewid_delivery_phone: delivery.phone,
    zewid_delivery_line1: delivery.line1,
    zewid_delivery_line2: delivery.line2,
    zewid_delivery_postcode: delivery.postalCode,
    zewid_delivery_city: delivery.city,
    zewid_delivery_country: delivery.country,
  };
}

export function deliveryFromMetadata(metadata?: Record<string, string> | null): CheckoutDelivery | null {
  if (metadata?.zewid_delivery_source !== "website") return null;
  try {
    return validateCheckoutDelivery({
      name: metadata.zewid_delivery_name, email: metadata.zewid_delivery_email, phone: metadata.zewid_delivery_phone,
      line1: metadata.zewid_delivery_line1, line2: metadata.zewid_delivery_line2,
      postalCode: metadata.zewid_delivery_postcode, city: metadata.zewid_delivery_city, country: metadata.zewid_delivery_country,
    });
  } catch { return null; }
}
