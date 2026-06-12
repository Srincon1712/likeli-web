import SectionHeader from "@/components/ui/SectionHeader";

const channels = ["Instagram", "TikTok", "Reseñas", "Tendencias", "Ideas", "Guiones", "Calendario"];

export default function ChannelConversion() {
  return (
    <section className="section border-b hairline">
      <div className="lk-container grid gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:items-center">
        <SectionHeader
          eyebrow="Content intelligence"
          title="De cada señal a una decisión de contenido."
          copy="Las fuentes no se tratan como silos. Se conectan a un núcleo de patrones, recomendaciones y aprendizaje."
        />

        <div className="channel-flow-panel">
          <div className="channel-column">
            <span className="mono text-[0.62rem] uppercase tracking-[0.14em] text-faint">Inputs</span>
            {channels.slice(0, 4).map((channel, index) => (
              <span key={channel} className={`channel-chip channel-chip-${index}`}>
                {channel}
              </span>
            ))}
          </div>
          <div className="routing-spine">
            <span className="spine-line" />
            <div className="routing-core">
              <span className="mono text-[0.62rem] uppercase tracking-[0.14em] text-faint">Likeli core</span>
              <strong>Motor Likeli</strong>
            </div>
          </div>
          <div className="channel-column channel-column-right">
            <span className="mono text-[0.62rem] uppercase tracking-[0.14em] text-faint">Outputs</span>
            {channels.slice(4).map((channel, index) => (
              <span key={channel} className={`channel-chip channel-chip-${index + 4}`}>
                {channel}
              </span>
            ))}
            <div className="booking-output">
              <span className="mono text-[0.62rem] uppercase tracking-[0.14em] text-accent">decision layer</span>
              <strong>Guion / calendario</strong>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
