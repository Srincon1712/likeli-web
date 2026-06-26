import type { Metadata } from "next";
import WebstudioLanding from "./WebstudioLanding";

const title = "WEBSTUDIO por Sebastián | Desarrollo web freelance premium";
const description =
  "Landing personal de Sebastián: desarrollo web premium, directo y personalizado para negocios que quieren transmitir confianza desde su propia página.";

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "WEBSTUDIO",
    "Sebastián",
    "desarrollo web freelance",
    "páginas web Colombia",
    "landing page premium",
    "LIKELI",
  ],
  alternates: {
    canonical: "/webstudio",
  },
  openGraph: {
    title,
    description,
    url: "/webstudio",
    siteName: "WEBSTUDIO",
    locale: "es_CO",
    type: "website",
    images: [
      {
        url: "/webstudio/opengraph-image",
        width: 1200,
        height: 630,
        alt: "WEBSTUDIO por Sebastián",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/webstudio/opengraph-image"],
  },
  icons: {
    icon: "/webstudio/icon.svg",
    shortcut: "/webstudio/icon.svg",
    apple: "/webstudio/icon.svg",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function WebstudioPage() {
  return <WebstudioLanding />;
}
