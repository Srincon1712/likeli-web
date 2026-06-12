import InteractivePanel from "./InteractivePanel";

const whatsappLink = "https://wa.link/jyx9l0";

export default function Hero() {
  return (
    <section id="producto" className="hero-shell relative isolate overflow-hidden border-b hairline">
      <div className="hero-light hero-light-red" />
      <div className="hero-light hero-light-cool" />
      <div className="hero-grid" />

      <div className="lk-container grid min-h-[calc(100dvh-4rem)] items-center gap-10 py-14 sm:py-18 lg:grid-cols-[0.92fr_1.08fr] lg:gap-12 lg:py-20">
        <div className="relative z-10 max-w-[40rem]">
          <span className="eyebrow">LIKELI / ETAPA 2</span>

          <h1 className="display mt-7 max-w-[12ch] break-words">Sistema de Inteligencia para Contenido Turístico</h1>

          <p className="lead mt-7 max-w-xl">
            Ayudamos a negocios turísticos a saber qué contenido publicar, qué ideas tienen mayor potencial y cómo organizar su estrategia con base en datos, patrones y casos reales.
          </p>

          <p className="mt-5 max-w-xl text-sm leading-7 text-muted">
            Likeli no es una agencia tradicional. Es una capa de inteligencia para tomar mejores decisiones de contenido.
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <a id="analizar" href={whatsappLink} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-magnetic whitespace-nowrap">
              Analizar mi negocio
            </a>
            <a href="#motor-likeli" className="btn btn-secondary btn-magnetic whitespace-nowrap">
              Ver cómo funciona
            </a>
          </div>

          <div className="mt-12 grid max-w-md grid-cols-3 border-y hairline py-4">
            {[
              ["Ideas", "detectadas"],
              ["Hooks", "recomendados"],
              ["Score", "por guion"],
            ].map(([value, label]) => (
              <div key={label} className="border-r hairline px-4 first:pl-0 last:border-r-0 last:pr-0">
                <strong className="block text-lg leading-none text-lk-beige">{value}</strong>
                <span className="mt-2 block mono text-[0.64rem] uppercase tracking-[0.14em] text-faint">{label}</span>
              </div>
            ))}
          </div>
        </div>

        <InteractivePanel />
      </div>
    </section>
  );
}
