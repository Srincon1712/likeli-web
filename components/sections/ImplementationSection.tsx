import SectionHeader from "@/components/ui/SectionHeader";

const steps = [
  "Diagnóstico inicial",
  "Segmentación del negocio",
  "Configuración del portal",
  "Generación de inteligencia",
  "Priorización y guiones",
  "Calendario y optimización",
];

export default function ImplementationSection() {
  return (
    <section id="metodologia" className="section border-b hairline">
      <div className="lk-container grid gap-12 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
        <SectionHeader
          eyebrow="Implementation"
          title="No necesitas cambiar todo tu negocio para empezar."
          copy="Likeli se implementa con una ruta clara: primero entendemos el negocio, luego configuramos su portal y después conectamos su contexto al Motor Likeli."
        />

        <div className="implementation-list">
          {steps.map((step, index) => (
            <div key={step} className="implementation-step">
              <span className="mono text-[0.68rem] uppercase tracking-[0.15em] text-accent">0{index + 1}</span>
              <strong>{step}</strong>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
