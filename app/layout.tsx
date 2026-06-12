import type { Metadata } from "next";
import { IBM_Plex_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Likeli | Sistema de Inteligencia para Contenido Turístico",
  description:
    "Likeli construye inteligencia para contenido turístico con portales claros, precisos y orientados a mejores decisiones.",
  icons: {
    icon: "/logos/li/li-red-in-beige.png",
    shortcut: "/logos/li/li-red-in-beige.png",
    apple: "/logos/li/li-red-in-beige.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      data-scroll-behavior="smooth"
      className={`${spaceGrotesk.variable} ${ibmPlexMono.variable} h-full scroll-smooth antialiased`}
    >
      <body>{children}</body>
    </html>
  );
}
