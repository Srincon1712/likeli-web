import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/seo";

const publicRoutes = ["/"];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return publicRoutes.map((route) => ({
    url: new URL(route, siteConfig.url).toString(),
    lastModified,
    changeFrequency: "weekly",
    priority: route === "/" ? 1 : 0.7,
  }));
}
