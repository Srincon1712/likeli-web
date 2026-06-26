import type { Metadata } from "next";
import WebstudioLanding from "./WebstudioLanding";

export const metadata: Metadata = {
  title: "Webstudio - Presencia digital premium",
  description:
    "Landing de estudio digital para negocios que necesitan una presencia web elegante, estrategica y memorable.",
  alternates: {
    canonical: "/webstudio",
  },
  openGraph: {
    title: "Webstudio - Presencia digital premium",
    description:
      "Diseno, desarrollo y estrategia para crear paginas web que elevan la primera impresion de un negocio.",
    url: "/webstudio",
    type: "website",
    images: [
      {
        url: "/webstudio/studio-hero.png",
        alt: "Composicion editorial abstracta de un estudio digital premium",
      },
    ],
  },
};

export default function WebstudioPage() {
  return <WebstudioLanding />;
}
