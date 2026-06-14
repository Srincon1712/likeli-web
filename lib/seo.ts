const rawSiteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.VERCEL_PROJECT_PRODUCTION_URL ||
  process.env.VERCEL_URL ||
  "likeli-web.vercel.app";

function normalizeSiteUrl(url: string) {
  const withProtocol = /^https?:\/\//i.test(url) ? url : `https://${url}`;
  return withProtocol.replace(/\/+$/, "");
}

export const siteConfig = {
  name: "Likeli",
  title: "Likeli | Sistema de Inteligencia para Contenido Turístico",
  description:
    "Likeli construye inteligencia para contenido turístico con portales claros, precisos y orientados a mejores decisiones.",
  url: normalizeSiteUrl(rawSiteUrl),
  locale: "es_CO",
  ogImage: "/logos/likeli/likeli-red-in-beige.png",
};
