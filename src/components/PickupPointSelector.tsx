"use client";

import { useEffect, useRef, useState } from "react";
import type { PickupPoint, PickupSelection } from "@/lib/postnord";

export default function PickupPointSelector({ value, onChange }: { value: PickupSelection | null; onChange: (selection: PickupSelection | null) => void }) {
  const [postalCode, setPostalCode] = useState("");
  const [points, setPoints] = useState<PickupPoint[]>([]);
  const [searched, setSearched] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const controller = useRef<AbortController | null>(null);
  useEffect(() => () => controller.current?.abort(), []);

  function changePostcode(next: string) {
    controller.current?.abort();
    controller.current = null;
    setPostalCode(next);
    setPoints([]);
    setSearched(false);
    setBusy(false);
    setError(null);
    onChange(null);
  }

  async function search() {
    const code = postalCode.trim();
    if (!/^\d{5}$/.test(code)) { setError("Enter a Finnish postcode with five digits."); return; }
    controller.current?.abort();
    const active = new AbortController();
    controller.current = active;
    setBusy(true);
    setError(null);
    setPoints([]);
    setSearched(false);
    onChange(null);
    try {
      const response = await fetch(`/api/delivery/pickup-points?postal_code=${encodeURIComponent(code)}`, { signal: active.signal });
      const result: { points?: PickupPoint[]; error?: string } = await response.json();
      if (!response.ok || !result.points) throw new Error(result.error || "Pickup points could not be found. Please try again.");
      if (!active.signal.aborted) { setPoints(result.points); setSearched(true); }
    } catch (failure) {
      if (!active.signal.aborted) setError(failure instanceof Error ? failure.message : "Pickup points could not be found.");
    } finally { if (!active.signal.aborted) setBusy(false); }
  }

  return (
    <div className="mb-4 rounded-xl border border-gray-200 bg-white p-4">
      <p className="font-semibold text-gray-900">Choose a PostNord pickup point</p>
      <p className="mt-1 text-sm text-gray-600">Enter your postcode to find nearby places to collect your order.</p>
      <form className="mt-3" onSubmit={(event) => { event.preventDefault(); void search(); }}>
        <label htmlFor="pickup-postcode" className="block text-sm font-medium text-gray-700">Finnish postcode</label>
        <div className="mt-1 flex gap-2">
          <input id="pickup-postcode" value={postalCode} onChange={(event) => changePostcode(event.target.value)}
            autoComplete="postal-code" inputMode="numeric" pattern="[0-9]{5}" maxLength={5} required
            className="min-w-0 flex-1 rounded-lg border border-gray-300 px-3 py-2 text-gray-900" placeholder="00100" />
          <button type="submit" disabled={busy} className="rounded-lg bg-green-700 px-3 py-2 text-sm font-semibold text-white disabled:opacity-50">
            {busy ? "Searching…" : "Find points"}
          </button>
        </div>
      </form>
      <div aria-live="polite">
        {searched && points.length === 0 && <p className="mt-3 text-sm text-gray-600">No pickup points were found. Check the postcode or contact us for delivery options.</p>}
        {error && <p role="alert" className="mt-3 text-sm text-red-700">{error}</p>}
      </div>
      {points.length > 0 && (
        <fieldset className="mt-3 space-y-2">
          <legend className="mb-2 text-sm font-medium text-gray-700">Nearby pickup points</legend>
          {points.map((point) => (
            <label key={point.id} className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 text-sm ${value?.servicePointId === point.id ? "border-green-700 bg-green-50" : "border-gray-200"}`}>
              <input type="radio" name="postnord-pickup" checked={value?.servicePointId === point.id}
                onChange={() => onChange({ postalCode: postalCode.trim(), servicePointId: point.id })} className="mt-1 accent-green-700" />
              <span><span className="block font-semibold text-gray-900">{point.name}</span><span className="block text-gray-600">{point.street}, {point.postalCode} {point.city}</span></span>
            </label>
          ))}
        </fieldset>
      )}
    </div>
  );
}
