export const site = {
  name: "ZEWID | ዘውድ",
  url: "https://www.zewid.com",
  phone: "358417059015",
  deliveryTime: "1–2 days",
  deliveryArea: "All over Finland",
  // Temporary checkout test: restore €7 after testing.
  deliveryFeeEur: 1,
};

export function whatsappLink(message?: string): string {
  return `https://wa.me/${site.phone}${message ? `?text=${encodeURIComponent(message)}` : ""}`;
}
