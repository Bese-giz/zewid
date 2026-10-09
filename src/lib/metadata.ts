import type { Metadata } from "next";
import { site } from "./site";

export function pageMetadata({
  title,
  description,
  path,
  image = "/opengraph-image.png",
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
    ...(image === "/opengraph-image.png" ? { width: 1536, height: 1024 } : {}),
  }];

  return {
    title,
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
