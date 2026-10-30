import { internationalDeliveryLink, site } from "@/lib/site";
import { formatEuro } from "@/lib/pricing";
import { postnordPickupEnabled } from "@/lib/postnord";

export default function OrderInformation() {
  return (
    <div className="rounded-2xl border border-green-100 bg-green-50/60 p-5 text-sm">
      <dl className="grid gap-4 sm:grid-cols-3">
        <div>
          <dt className="font-semibold text-gray-900">Delivery in Finland</dt>
          <dd className="mt-1 text-gray-600">{site.deliveryArea}</dd>
        </div>
        <div>
          <dt className="font-semibold text-gray-900">Estimated time in Finland</dt>
          <dd className="mt-1 text-gray-600">{site.deliveryTime}</dd>
        </div>
        <div>
          <dt className="font-semibold text-gray-900">Finland delivery charge</dt>
          <dd className="mt-1 text-gray-600">{formatEuro(site.deliveryFeeEur * 100)} per order{postnordPickupEnabled() ? ", to your selected PostNord pickup point." : ", anywhere in Finland."}</dd>
        </div>
      </dl>
      <p className="mt-4 border-t border-green-100 pt-4 leading-relaxed text-gray-600">We also deliver outside Finland. <a href={internationalDeliveryLink()} target="_blank" rel="noopener noreferrer" className="font-semibold text-green-800 underline underline-offset-4">Contact us on WhatsApp</a> with your country and postcode to confirm shipping costs and timing. Website checkout is available for Finland delivery.</p>
    </div>
  );
}
