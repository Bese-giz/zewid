import Image from "next/image";

interface ProductCardProps {
  name: string;
  description: string;
  weight: string;
  image: string;
  features: string[];
  showDetails?: boolean;
}

export default function ProductCard({
  name,
  description,
  weight,
  image,
  features,
  showDetails = true,
}: ProductCardProps) {
  return (
    <div className="product-card overflow-hidden rounded-[1rem] border border-slate-100 bg-white shadow-[0_14px_34px_rgba(15,23,42,0.06)]">
      <div className="relative aspect-[7/6] overflow-hidden bg-white md:aspect-square">
        <Image
          src={image}
          alt={name}
          fill
          sizes="(max-width: 768px) 50vw, 33vw"
          className="object-contain px-2 pt-3 md:object-cover md:px-0 md:pt-0"
        />
      </div>
      <div className={showDetails ? "p-2.5 md:p-6" : "p-2.5 md:p-5"}>
        <h3 className="mb-0.5 text-[12px] font-bold leading-snug tracking-tight text-gray-900 sm:text-sm md:text-lg">
          {name}
        </h3>
        <p className="mb-2 text-[10px] font-medium uppercase tracking-wide text-green-700 sm:text-[11px] md:text-xs">
          {weight}
        </p>
        {showDetails && (
          <>
            <p className="mb-4 hidden text-sm leading-relaxed text-slate-600 md:block">
              {description}
            </p>
            <ul className="mb-4 hidden space-y-1 md:block">
              {features.map((feature, idx) => (
                <li key={idx} className="flex items-center gap-1.5 text-sm text-slate-600">
                  <span className="text-green-500 text-[10px]">●</span>
                  {feature}
                </li>
              ))}
            </ul>
          </>
        )}
        <a
          href={`https://wa.me/358417059015?text=Hi%20ZEWID!%20I%20would%20like%20to%20order%20${encodeURIComponent(name)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full rounded-full bg-green-600 px-1.5 py-2 text-center text-[10px] font-semibold leading-tight text-white transition-colors hover:bg-green-700 sm:px-2 sm:text-[11px] md:py-3 md:text-sm"
        >
          Order on WhatsApp
        </a>
      </div>
    </div>
  );
}
