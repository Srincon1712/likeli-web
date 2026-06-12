import SectionHeader from "@/components/ui/SectionHeader";
import type { CSSProperties } from "react";

type ProblemStyle = CSSProperties & {
  "--step-strength"?: string;
  "--bar"?: number;
};

const journeySteps = [
  {
    title: "Tiene muchas ideas",
    detail: "El negocio sabe que necesita publicar, pero las ideas aparecen desordenadas, sin prioridad ni criterio claro.",
  },
  {
    title: "Copia lo que ve en redes",
    detail: "Muchas decisiones nacen de imitar tendencias sin saber si realmente aplican a su tipo de experiencia turística.",
  },
  {
    title: "Graba sin estructura",
    detail: "Una buena experiencia puede perder fuerza si el video no tiene hook, ritmo, narrativa, CTA o intención clara.",
  },
  {
    title: "Publica sin lectura",
    detail: "El contenido sale al aire, pero el aprendizaje queda disperso entre likes, comentarios, vistas y guardados.",
  },
  {
    title: "Aprende demasiado tarde",
    detail: "Sin un sistema, el negocio entiende qué funcionó cuando ya gastó tiempo, energía y recursos produciendo contenido.",
  },
];

export default function ProblemSection() {
  return (
    <section className="section border-b hairline">
      <div className="lk-container">
        <SectionHeader
          eyebrow="Problem / content uncertainty"
          title="Publicar no es el problema. El problema es decidir qué publicar."
          copy="La mayoría de negocios turísticos crea contenido desde la intuición. Publican porque hay que publicar, pero no siempre saben qué ideas tienen mayor potencial, qué formatos convienen, qué hooks usar o cómo convertir contenido en una estrategia más clara."
        />

        <div className="problem-flow" aria-label="Flujo de perdida de leads">
          {journeySteps.map((step, index) => (
            <article
              key={step.title}
              className="problem-step"
              tabIndex={0}
              style={{ "--step-strength": `${100 - index * 14}%` } as ProblemStyle}
            >
              <div className="problem-step-top">
                <span className="mono text-[0.62rem] uppercase tracking-[0.14em] text-faint">Content friction</span>
              </div>
              <h3>{step.title}</h3>
              <div className="problem-visual" aria-hidden="true">
                <span className="problem-signal-line" />
                <span className="problem-bars">
                  {[0, 1, 2, 3].map((bar) => (
                    <i key={bar} style={{ "--bar": bar } as ProblemStyle} />
                  ))}
                </span>
                <span className="problem-dots">
                  {[0, 1, 2, 3, 4].map((dot) => (
                    <i key={dot} className={dot > 4 - index ? "is-faded" : ""} />
                  ))}
                </span>
              </div>
              <p>{step.detail}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
