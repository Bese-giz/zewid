export const site = {
  name: "ZEWID | ዘውድ",
  url: "https://www.zewid.com",
  phone: "358417059015",
  deliveryTime: "1–2 days",
  deliveryArea: "All over Finland",
  deliveryFeeEur: 8.90,
};

export function whatsappLink(message?: string): string {
  return `https://wa.me/${site.phone}${message ? `?text=${encodeURIComponent(message)}` : ""}`;
}
