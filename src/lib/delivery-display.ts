// Keep carrier branding out of customer-facing delivery-point names.
export function deliveryPointName(name?: string): string {
  return name?.replace(/\bpost\s*nord\b/gi, "").replace(/^\s*[-:–]\s*/, "").trim() || "Delivery point";
}
