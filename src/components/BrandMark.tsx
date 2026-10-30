import Image from "next/image";
import marketLogo from "../../public/images/final-logo.png";

export default function BrandMark() {
  return (
    <span className="market-brand">
      <Image src={marketLogo} alt="ZEWID Market" sizes="(max-width: 1023px) 119px, 141px" />
    </span>
  );
}
