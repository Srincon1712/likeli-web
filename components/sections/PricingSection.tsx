import Button from "@/components/ui/Button";
import CursorReactiveCard from "@/components/ui/CursorReactiveCard";
import SectionHeader from "@/components/ui/SectionHeader";

type PricingPlan = {
  id: string;
  name: string;
  price: string;
  description: string;
  includes: string[];
  excludes: string[];
  featured: boolean;
  ctaHref: string;
};

const plans: PricingPlan[] = [
  {
    id: "signals",
    name: "Signals",
    price: "199.000 COP / mes",
    description: "Base para negocios que crean su propio contenido y necesitan saber qué publicar.",
    includes: [
      "20 ideas de contenido",
      "20 hooks",
      "20 captions",
      "20 CTAs",
      "4 tendencias destacadas",
      "4 oportunidades detectadas",
      "Formato recomendado por idea",
      "Horario recomendado",
      "Duración recomendada",
      "Inteligencia segmentada",
      "Actualizaciones periódicas",
      "Acceso a recursos del plan",
    ],
    excludes: [
      "Soporte personalizado",
      "Revisión de contenido",
      "Revisión de videos",
      "Guiones completos",
      "Predicciones",
      "Benchmarking",
    ],
    featured: false,
    ctaHref: "https://wa.link/tv4i85",
  },
  {
    id: "signals-pro",
    name: "Signals Pro",
    price: "599.000 COP / mes",
    description: "Sistema para descubrir qué publicar y validar cuáles ideas tienen mayor potencial antes de ejecutarlas.",
    includes: [
      "Todo lo de Signals",
      "30 ideas de contenido",
      "30 hooks",
      "30 captions",
      "30 CTAs",
      "12 guiones completos",
      "Predicción de rendimiento por guion",
      "Puntuación Likeli",
      "Análisis de fortalezas",
      "Análisis de debilidades",
      "Comparación con contenido exitoso",
      "Biblioteca de casos de éxito",
      "Biblioteca de casos de fracaso",
      "Benchmark de competencia",
      "Benchmark de industria",
      "Calendario de contenido de 30 días",
      "Priorización de ideas",
      "Roadmap mensual",
      "Hasta 4 revisiones de contenido al mes",
      "Hasta 4 revisiones de videos terminados al mes",
    ],
    excludes: [],
    featured: true,
    ctaHref: "https://wa.link/7myafm",
  },
  {
    id: "signals-elite",
    name: "Signals Elite",
    price: "1.199.000 COP / mes",
    description: "Inteligencia avanzada con apoyo operativo para acelerar la ejecución del contenido.",
    includes: [
      "Todo lo de Signals Pro",
      "40 ideas de contenido",
      "40 hooks",
      "40 captions",
      "40 CTAs",
      "16 guiones completos",
      "Hasta 8 revisiones de contenido al mes",
      "Hasta 8 revisiones de videos terminados al mes",
      "Edición de hasta 10 videos mensuales",
      "Atención prioritaria",
      "Recursos avanzados Likeli",
      "Acceso ampliado a investigaciones, frameworks y recursos exclusivos",
    ],
    excludes: [],
    featured: false,
    ctaHref: "https://wa.link/kj642u",
  },
];

export default function PricingSection() {
  return (
    <section id="precios" className="section border-b hairline">
      <div className="lk-container">
        <SectionHeader
          eyebrow="Plans"
          title="Planes diseñados para convertir señales en reservas"
          copy="Elige el nivel de análisis que necesita tu negocio para detectar oportunidades reales, crear contenido con intención y tomar mejores decisiones cada mes."
        />

        <div className="mt-12 grid items-stretch gap-4 md:grid-cols-2 xl:grid-cols-3">
          {plans.map((plan) => (
            <CursorReactiveCard
              key={plan.id}
              className={`pricing-card flex h-full flex-col p-5 sm:p-6 ${plan.featured ? "pricing-featured" : ""}`}
            >
              <div className="flex min-h-0 flex-1 flex-col">
                <div className="flex items-start justify-between gap-4">
                  <span className="mono text-[0.68rem] uppercase tracking-[0.15em] text-accent">{plan.name}</span>
                  {plan.featured ? (
                    <span className="rounded-full border border-lk-red-bright/30 bg-lk-red-bright/10 px-2.5 py-1 mono text-[0.58rem] uppercase tracking-[0.12em] text-lk-beige">
                      Recomendado
                    </span>
                  ) : null}
                </div>

                <p className="mt-5 min-h-21 text-sm leading-6 text-muted">{plan.description}</p>

                <strong className="mt-6 block text-balance text-[clamp(1.85rem,3vw,2.6rem)] leading-none text-lk-beige">
                  {plan.price}
                </strong>

                <Button
                  href={plan.ctaHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant={plan.featured ? "primary" : "secondary"}
                  className="mt-6 w-full whitespace-nowrap"
                >
                  Adquirir
                </Button>

                <div className="mt-7 border-t border-white/8 pt-6">
                  <p className="mono text-[0.62rem] uppercase tracking-[0.14em] text-lk-gray-light">Incluye</p>
                  <ul className="mt-4 grid gap-3">
                    {plan.includes.map((item) => (
                      <li key={`${plan.id}-include-${item}`} className="grid grid-cols-[1rem_1fr] gap-3 text-sm leading-6 text-muted">
                        <span className="mono text-lk-red-bright" aria-hidden="true">
                          ✓
                        </span>
                        <span className="min-w-0 wrap-break-word">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {plan.excludes.length ? (
                  <div className="mt-7 border-t border-white/8 pt-6">
                    <p className="mono text-[0.62rem] uppercase tracking-[0.14em] text-lk-gray-light">No incluye</p>
                    <ul className="mt-4 grid gap-3">
                      {plan.excludes.map((item) => (
                        <li key={`${plan.id}-exclude-${item}`} className="grid grid-cols-[1rem_1fr] gap-3 text-sm leading-6 text-muted">
                          <span className="mono text-lk-gray" aria-hidden="true">
                            ×
                          </span>
                          <span className="min-w-0 wrap-break-word">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>
            </CursorReactiveCard>
          ))}
        </div>
      </div>
    </section>
  );
}
