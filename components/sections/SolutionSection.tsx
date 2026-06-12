"use client";

import SectionHeader from "@/components/ui/SectionHeader";
import { useEffect, useRef } from "react";

const modules = [
  {
    label: "Captura señales",
    title: "Captura señales",
    copy: "Convierte tendencias, referencias, casos reales y comportamiento de audiencia en entradas organizadas para el Motor Likeli.",
  },
  {
    label: "Genera ideas",
    title: "Genera ideas",
    copy: "A partir del contexto del negocio, el sistema propone ideas adaptadas al tipo de experiencia, público, ubicación y etapa comercial.",
  },
  {
    label: "Prioriza oportunidades",
    title: "Prioriza oportunidades",
    copy: "De un conjunto inicial de ideas, Likeli selecciona las que tienen mayor posibilidad de funcionar según patrones observados.",
  },
  {
    label: "Construye guiones",
    title: "Construye guiones",
    copy: "Cada idea priorizada se convierte en guiones con hook, caption, CTA, formato, duración, estructura, score y predicción.",
  },
  {
    label: "Organiza calendario",
    title: "Organiza el calendario",
    copy: "Los guiones se distribuyen en un calendario con fechas recomendadas de publicación para darle orden operativo a la estrategia.",
  },
];

export default function SolutionSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const cardsScrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    function handleSolutionWheel(event: WheelEvent) {
      if (window.innerWidth < 1024) return;

      const el = cardsScrollRef.current;
      if (!el) return;

      const atTop = el.scrollTop <= 0;
      const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 2;
      const scrollingDown = event.deltaY > 0;
      const scrollingUp = event.deltaY < 0;

      if (scrollingDown && !atBottom) {
        event.preventDefault();
        el.scrollBy({ top: event.deltaY, behavior: "auto" });
        return;
      }

      if (scrollingUp && !atTop) {
        event.preventDefault();
        el.scrollBy({ top: event.deltaY, behavior: "auto" });
      }
    }

    section.addEventListener("wheel", handleSolutionWheel, { passive: false, capture: true });

    return () => {
      section.removeEventListener("wheel", handleSolutionWheel, { capture: true });
    };
  }, []);

  return (
    <section id="motor-likeli" ref={sectionRef} className="section border-b hairline overflow-hidden">
      <div className="lk-container solution-layout">
        <div className="solution-copy">
          <SectionHeader
            eyebrow="Solution / Likeli intelligence"
            title="Likeli convierte datos, patrones y casos reales en recomendaciones de contenido."
            copy="Una capa de producto para transformar información dispersa en ideas, guiones, calendarios y decisiones más claras para negocios turísticos."
          />
        </div>

        <div ref={cardsScrollRef} className="solution-scroll-box" aria-label="Pasos de Solution">
          <div className="solution-cards">
            {modules.map((module, index) => (
              <article key={module.title} className="solution-card">
                <div className="solution-card-head">
                  <span className="mono">{String(index + 1).padStart(2, "0")}/05</span>
                  <span className="mono">state: live</span>
                </div>
                <h3>{module.title}</h3>
                <p>{module.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
