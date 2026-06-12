import SectionHeader from "@/components/ui/SectionHeader";
import Image from "next/image";

const likeliItems = [
  "Sistema orientado a decisiones de contenido",
  "Motor interno de análisis turístico",
  "Portales personalizados por cliente",
  "Ideas, hooks, captions, CTAs y guiones",
  "Score y predicción por guion",
  "Calendario con fechas recomendadas",
  "Biblioteca de casos de éxito y fracaso",
  "Benchmark de competencia e industria",
  "Aprendizaje acumulativo",
  "Visión de producto SaaS",
];

const agencyItems = [
  "Publicaciones aisladas",
  "Estrategia basada principalmente en intuición",
  "Reportes centrados en likes y alcance",
  "Poca conexión entre aprendizaje y siguiente contenido",
  "Reseñas usadas solo como testimonios",
  "Optimizacion manual y lenta",
  "Menor acumulacion de inteligencia propia",
  "Servicio dificil de escalar",
];

function ComparisonRow({
  item,
  tone,
}: {
  item: string;
  tone: "likeli" | "agency";
}) {
  const isLikeli = tone === "likeli";

  return (
    <div
      className={`group grid min-h-16 grid-cols-[1rem_1fr] items-center gap-4 border-t px-1 py-4 transition-colors duration-200 ease-out ${
        isLikeli
          ? "border-[#ffeaea]/10 text-[#ffeaea] hover:bg-[#ffeaea]/[0.025]"
          : "border-[#ffeaea]/[0.075] text-[#c7c7c7]/75 hover:bg-[#ffeaea]/[0.018] hover:text-[#c7c7c7]"
      }`}
    >
      <span
        className={`mono grid size-4 place-items-center text-[0.7rem] leading-none ${
          isLikeli ? "text-[#d63a2f]" : "text-[#6e6e6e]"
        }`}
        aria-hidden="true"
      >
        {isLikeli ? "\u2713" : "\u00d7"}
      </span>
      <span className={isLikeli ? "font-semibold" : ""}>{item}</span>
    </div>
  );
}

export default function ComparisonSection() {
  return (
    <section className="section border-b hairline">
      <div className="lk-container">
        <SectionHeader
          eyebrow="Positioning"
          title="No es gestión de redes. Es inteligencia para decidir qué publicar."
          copy="Una comparación simple para separar ejecución manual de aprendizaje sistemático."
          align="center"
        />

        <div className="mx-auto mt-12 max-w-6xl">
          <div className="grid items-stretch gap-4 md:grid-cols-2">
            <section
              className="relative isolate flex h-full min-h-[34rem] overflow-hidden rounded-[1.15rem] border border-[#d63a2f]/35 bg-[#181818] p-6 shadow-[0_28px_90px_rgb(0_0_0/0.32),inset_0_1px_0_rgb(255_234_234/0.08)] transition-transform duration-300 ease-out hover:-translate-y-0.5 md:p-7"
              aria-label="Likeli"
            >
              <div
                className="pointer-events-none absolute right-0 top-0 -z-10 h-48 w-64 bg-[radial-gradient(circle_at_70%_10%,rgb(214_58_47/0.32),transparent_68%)]"
                aria-hidden="true"
              />
              <div
                className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(145deg,rgb(255_234_234/0.06),transparent_58%)]"
                aria-hidden="true"
              />

              <div className="flex min-h-0 w-full flex-col">
                <header className="flex min-h-24 flex-col items-start justify-start gap-4">
                  <Image
                    src="/logos/likeli/likeli-white-transparent.png"
                    alt="Likeli"
                    width={132}
                    height={42}
                    className="h-9 w-auto object-contain"
                  />
                  <span className="mono text-[0.62rem] uppercase tracking-[0.14em] text-[#d63a2f]">Intelligence system</span>
                </header>

                <div className="mt-2 grid flex-1 content-stretch">
                  {likeliItems.map((item) => (
                    <ComparisonRow key={item} item={item} tone="likeli" />
                  ))}
                </div>
              </div>
            </section>

            <section
              className="flex h-full min-h-[34rem] overflow-hidden rounded-[1.15rem] border border-[#ffeaea]/10 bg-[#141414] p-6 shadow-[inset_0_1px_0_rgb(255_234_234/0.05)] transition-colors duration-300 ease-out hover:border-[#ffeaea]/15 md:p-7"
              aria-label="Agencias tradicionales"
            >
              <div className="flex min-h-0 w-full flex-col">
                <header className="flex min-h-24 flex-col items-start justify-start gap-4">
                  <h3 className="text-3xl leading-none text-[#ffeaea] md:text-4xl">Agencias tradicionales</h3>
                  <span className="mono text-[0.62rem] uppercase tracking-[0.14em] text-[#6e6e6e]">
                    Traditional service
                  </span>
                </header>

                <div className="mt-2 grid flex-1 content-stretch">
                  {agencyItems.map((item) => (
                    <ComparisonRow key={item} item={item} tone="agency" />
                  ))}
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </section>
  );
}
