import type { Metadata } from "next";
import { site } from "./site";

export function pageMetadata({
  title,
  description,
  path,
  image = "/images/landing.png",
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
}): Metadata {
  const shareTitle = `${title} | ${site.name}`;
  const images = [{
    url: image,
    alt: title,
    ...(image === "/images/landing.png" ? { width: 1852, height: 849 } : {}),
  }];

  return {
    title: { absolute: shareTitle },
    description,
    alternates: { canonical: path },
    openGraph: {
      title: shareTitle,
      description,
      url: new URL(path, site.url).href,
      siteName: site.name,
      locale: "en_FI",
      type: "website",
      images,
    },
    twitter: { card: "summary_large_image", title: shareTitle, description, images },
  };
}
