import "server-only";

export interface PickupPoint {
  id: string;
  name: string;
  street: string;
  postalCode: string;
  city: string;
  countryCode: "FI";
}

export interface PickupSelection { postalCode: string; servicePointId: string }
export class PickupInputError extends Error {}

export function postnordPickupEnabled(): boolean {
  return Boolean(process.env.POSTNORD_API_KEY?.trim());
}

function record(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : null;
}

function text(value: unknown, maximum = 150): string | null {
  return typeof value === "string" && value.trim().length > 0 && value.length <= maximum ? value.trim() : null;
}

export function validatePostalCode(value: unknown): string {
  if (typeof value !== "string" || !/^\d{5}$/.test(value.trim())) throw new PickupInputError("Enter a Finnish postcode with five digits.");
  return value.trim();
}

export async function findPickupPoints(postalCode: string): Promise<PickupPoint[]> {
  const postcode = validatePostalCode(postalCode);
  const key = process.env.POSTNORD_API_KEY?.trim();
  if (!key) throw new Error("PostNord pickup is not configured.");
  // The API key stays on the server. Do not log this URL or upstream responses.
  const url = new URL("https://api2.postnord.com/rest/businesslocation/v5/servicepoints/nearest/byaddress");
  url.search = new URLSearchParams({
    apikey: key, returnType: "json", countryCode: "FI", agreementCountry: "FI", postalCode: postcode,
    numberOfServicePoints: "10", context: "optionalservicepoint", responseFilter: "public",
  }).toString();
  const response = await fetch(url, { redirect: "error", signal: AbortSignal.timeout(12_000), next: { revalidate: 300 } });
  if (!response.ok) throw new Error("PostNord pickup search is unavailable.");
  const data = record(await response.json());
  const result = record(data?.servicePointInformationResponse);
  if (!result || result.compositeFault || !Array.isArray(result.servicePoints)) throw new Error("PostNord pickup response is unavailable.");
  const seen = new Set<string>();
  return result.servicePoints.flatMap((value: unknown): PickupPoint[] => {
    const point = record(value);
    const address = record(point?.visitingAddress);
    const id = text(point?.servicePointId, 64);
    const name = text(point?.name);
    const streetName = text(address?.streetName);
    const streetNumber = text(address?.streetNumber, 30);
    const city = text(address?.city);
    const pointPostcode = text(address?.postalCode, 5);
    if (!id || !/^[a-zA-Z0-9_-]+$/.test(id) || seen.has(id) || !name || !streetName || !city ||
        !pointPostcode || !/^\d{5}$/.test(pointPostcode) || address?.countryCode !== "FI") return [];
    seen.add(id);
    return [{ id, name, street: [streetName, streetNumber].filter(Boolean).join(" "), postalCode: pointPostcode, city, countryCode: "FI" }];
  }).slice(0, 10);
}

export async function validatePickupSelection(value: unknown): Promise<{ selection: PickupSelection; point: PickupPoint }> {
  const selected = record(value);
  const postalCode = validatePostalCode(selected?.postalCode);
  const id = text(selected?.servicePointId, 64);
  if (!id || !/^[a-zA-Z0-9_-]+$/.test(id)) throw new PickupInputError("Choose a PostNord pickup point before continuing.");
  // Recheck eligibility and use the carrier's address, never customer-supplied names or addresses.
  const points = await findPickupPoints(postalCode);
  const point = points.find((entry) => entry.id === id);
  if (!point) throw new PickupInputError("That pickup point is no longer available. Search again and choose another point.");
  return { selection: { postalCode, servicePointId: id }, point };
}
