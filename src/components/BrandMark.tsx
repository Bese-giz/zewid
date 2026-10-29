import Image from "next/image";

export default function BrandMark() {
  return (
    <span className="market-brand">
      <Image src="/images/zewid-logo.png" alt="ZEWID Market" width={1774} height={887} sizes="(max-width: 1023px) 127px, 152px" />
    </span>
  );
}
