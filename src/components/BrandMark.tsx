import Image from "next/image";
import marketLogo from "../../public/images/zewid-market-logo-new.png";

export default function BrandMark() {
  return (
    <span className="market-brand">
      <Image src={marketLogo} alt="ZEWID Market" loading="eager" sizes="(max-width: 1023px) 119px, 141px" />
    </span>
  );
}
