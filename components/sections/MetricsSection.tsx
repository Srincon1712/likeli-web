import MetricCard from "@/components/ui/MetricCard";
import SectionHeader from "@/components/ui/SectionHeader";

const metrics = [
  ["Idea potential", "scored", "Ideas comparadas segun patrones, contexto y oportunidad."],
  ["Hook strength", "ranked", "Hooks ordenados por claridad, deseo y ajuste al negocio."],
  ["Script score", "mapped", "Guiones evaluados por estructura, formato, duración y CTA."],
  ["Review insight", "visible", "Reseñas usadas para detectar confianza, objeciones y frases útiles."],
  ["Publish timing", "suggested", "Fechas recomendadas para ordenar la ejecución del contenido."],
  ["Best format", "ranked", "Formatos priorizados por señal, no solo por alcance."],
];

export default function MetricsSection() {
  return (
    <section className="section border-b hairline">
      <div className="lk-container">
        <SectionHeader
          eyebrow="Metrics"
          title="Métricas diseñadas para decisiones de contenido."
          copy="Indicadores sobrios para entender ideas, hooks, guiones, confianza y oportunidades sin inflar números vacíos."
        />
        <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {metrics.map(([label, value, detail]) => (
            <MetricCard key={label} label={label} value={value} detail={detail} />
          ))}
        </div>
      </div>
    </section>
  );
}
