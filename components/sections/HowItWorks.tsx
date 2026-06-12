import SectionHeader from "@/components/ui/SectionHeader";

const steps = [
  "Analizar contexto turístico",
  "Detectar patrones de contenido",
  "Disenar ideas y hooks",
  "Construir guiones priorizados",
  "Organizar calendario recomendado",
  "Repetir lo que funciona",
];

export default function HowItWorks() {
  return (
    <section className="section border-b hairline">
      <div className="lk-container">
        <SectionHeader
          eyebrow="Operating model"
          title="Un sistema de inteligencia para contenido turístico."
          copy="Un ciclo compacto para transformar señales dispersas en ideas, guiones, scores, predicciones y decisiones de contenido."
          align="center"
        />

        <div className="timeline timeline-compact mt-12">
          {steps.map((step, index) => (
            <article key={step} className="timeline-step">
              <span className="timeline-dot" />
              <span className="mono text-[0.65rem] uppercase tracking-[0.15em] text-faint">0{index + 1}</span>
              <h3 className="mt-4 text-xl leading-tight">{step}</h3>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
