import { site } from "@/lib/site";
import { formatEuro } from "@/lib/pricing";
import { postnordPickupEnabled } from "@/lib/postnord";

export default function OrderInformation() {
  return (
    <dl className="grid gap-4 rounded-2xl border border-green-100 bg-green-50/60 p-5 text-sm sm:grid-cols-3">
      <div>
        <dt className="font-semibold text-gray-900">Delivery coverage</dt>
        <dd className="mt-1 text-gray-600">{site.deliveryArea}</dd>
      </div>
      <div>
        <dt className="font-semibold text-gray-900">Delivery time</dt>
        <dd className="mt-1 text-gray-600">{site.deliveryTime}</dd>
      </div>
      <div>
        <dt className="font-semibold text-gray-900">Delivery charge</dt>
        <dd className="mt-1 text-gray-600">{formatEuro(site.deliveryFeeEur * 100)} per order{postnordPickupEnabled() ? ", to your selected PostNord pickup point." : ", anywhere in Finland."}</dd>
      </div>
    </dl>
  );
}
