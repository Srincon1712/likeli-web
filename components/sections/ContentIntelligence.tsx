import SectionHeader from "@/components/ui/SectionHeader";

const signals = ["ideas", "hooks", "captions", "CTAs", "guiones", "scores", "predicciones", "calendario"];

export default function ContentIntelligence() {
  return (
    <section className="section border-b hairline">
      <div className="lk-container">
        <SectionHeader
          eyebrow="Content intelligence"
          title="No medimos likes como destino. Leemos patrones para decidir."
          copy="La lectura importante está en las capas donde una idea se convierte en hook, guion, score, predicción y calendario recomendado."
          align="center"
        />

        <div className="signal-matrix mt-12">
          {signals.map((signal, index) => (
            <div key={signal} className={`matrix-cell matrix-cell-${index % 3}`}>
              <span className="mono text-[0.62rem] uppercase tracking-[0.14em] text-faint">signal</span>
              <strong>{signal}</strong>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
