import SectionHeader from "@/components/ui/SectionHeader";

const reviews = [
  [
    "Likeli no nace para publicar más contenido, sino para decidir mejor qué contenido merece ser creado.",
    "Fundador",
    "signal / founder note",
  ],
  [
    "Cada idea debe pasar por una pregunta simple: ¿esto ayuda al negocio a entender mejor qué quiere ver su audiencia?",
    "Motor Likeli",
    "signal / intelligence",
  ],
  [
    "No buscamos adivinar tendencias. Buscamos encontrar patrones que puedan repetirse con intención.",
    "Equipo de estrategia",
    "signal / strategy",
  ],
  [
    "Un buen video turístico no solo muestra un lugar; hace que la persona imagine cómo sería estar ahí.",
    "Equipo de contenido",
    "signal / content",
  ],
  [
    "Los likes son una señal incompleta. El valor está en conectar formatos, contexto, intención y aprendizaje.",
    "Equipo de datos",
    "signal / data",
  ],
  [
    "El portal existe para que la estrategia no viva en documentos sueltos, sino en un sistema claro, consultable y accionable.",
    "Equipo de producto",
    "signal / product",
  ],
  [
    "Los casos de bajo rendimiento son tan importantes como los casos exitosos: muestran qué evitar, qué ajustar y qué probar después.",
    "Equipo de investigación",
    "signal / research",
  ],
  [
    "No prometemos viralidad. Construimos una forma más inteligente de reducir incertidumbre antes de publicar.",
    "Dirección de Likeli",
    "signal / system vision",
  ],
];

export default function ReviewSignals() {
  const leftColumn = reviews;
  const rightColumn = [...reviews].reverse();

  return (
    <section id="portales" className="section border-b hairline">
      <div className="lk-container grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <SectionHeader
          eyebrow="Notas desde el sistema"
          title="Cómo pensamos en Likeli."
          copy="Antes de ser una plataforma completa, Likeli está construyendo una forma más clara de decidir qué contenido turístico merece ser creado. Estas notas resumen los principios que guían el Motor Likeli, los portales y la inteligencia detrás de cada recomendación."
        />

        <div className="review-intel-panel">
          <div className="review-marquee" aria-label="Notas internas de Likeli">
            <div className="review-marquee-column review-marquee-down">
              <div className="review-marquee-track">
                {[0, 1].map((setIndex) => (
                  <div key={setIndex} className="review-marquee-set" aria-hidden={setIndex === 1}>
                    {leftColumn.map(([quote, tag, signal]) => (
                      <article key={`${quote}-${setIndex}`} className="review-signal-card">
                        <span className="mono">{tag}</span>
                        <p>&quot;{quote}&quot;</p>
                        <small className="mono">{signal}</small>
                      </article>
                    ))}
                  </div>
                ))}
              </div>
            </div>
            <div className="review-marquee-column review-marquee-up">
              <div className="review-marquee-track">
                {[0, 1].map((setIndex) => (
                  <div key={setIndex} className="review-marquee-set" aria-hidden={setIndex === 1}>
                    {rightColumn.map(([quote, tag, signal]) => (
                      <article key={`${quote}-${setIndex}`} className="review-signal-card">
                        <span className="mono">{tag}</span>
                        <p>&quot;{quote}&quot;</p>
                        <small className="mono">{signal}</small>
                      </article>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
