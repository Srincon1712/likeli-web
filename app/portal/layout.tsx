import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Likeli Portal",
  description: "Portal de cliente Likeli para visualizar estrategia, módulos y entregables.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
  icons: {
    icon: "/portal/favicon.ico",
    shortcut: "/portal/favicon.ico",
    apple: "/portal/favicon.ico",
  },
};

export default function PortalLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <div className="portal-scope">{children}</div>;
}
