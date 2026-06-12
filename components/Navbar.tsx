import Link from "next/link";
import Logo from "./Logo";

const whatsappLink = "https://wa.link/jyx9l0";

const navItems = [
  { id: "producto", label: "Producto", href: "#producto" },
  { id: "motor-likeli", label: "Motor Likeli", href: "#motor-likeli" },
  { id: "portales", label: "Portales", href: "#portales" },
  { id: "casos-de-uso", label: "Casos de uso", href: "#casos-de-uso" },
  { id: "precios", label: "Precios", href: "#precios" },
  { id: "metodologia", label: "Metodología", href: "#metodologia" },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.08] bg-lk-black/82 backdrop-blur-xl">
      <div className="lk-container flex h-16 items-center justify-between gap-4">
        <a href="#producto" className="flex min-w-0 shrink-0 items-center gap-3" aria-label="Ir al inicio">
          <span className="grid h-9 w-[112px] shrink-0 place-items-center sm:w-[122px]">
            <Logo variant="navbar" size="sm" priority />
          </span>
        </a>

        <nav className="hidden min-w-0 flex-1 items-center justify-center gap-1 mono text-[0.72rem] text-muted lg:flex" aria-label="Navegación principal">
          {navItems.map((item) => (
            <a key={item.id} href={item.href} className="whitespace-nowrap rounded-full px-3 py-2 hover:bg-white/[0.045] hover:text-lk-beige">
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <Link href="/portal" className="hidden whitespace-nowrap mono text-xs uppercase tracking-[0.12em] text-muted hover:text-lk-beige sm:block">
            Portal
          </Link>
          <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="btn btn-secondary min-h-10 whitespace-nowrap px-3 text-[0.7rem] sm:px-4 sm:text-[0.74rem]">
            Analizar mi negocio
          </a>
        </div>
      </div>
    </header>
  );
}
