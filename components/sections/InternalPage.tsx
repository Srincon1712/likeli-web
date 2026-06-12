import Button from "@/components/ui/Button";
import CursorReactiveCard from "@/components/ui/CursorReactiveCard";
import PageShell from "@/components/ui/PageShell";
import SectionHeader from "@/components/ui/SectionHeader";
import SystemPanel from "@/components/ui/SystemPanel";

const whatsappLink = "https://wa.link/jyx9l0";

export type InternalPageProps = {
  eyebrow: string;
  title: string;
  copy: string;
  modules: string[];
  steps?: string[];
  mode?: "product" | "system" | "pricing" | "legal" | "contact";
};

export default function InternalPage({ eyebrow, title, copy, modules, steps = [], mode = "product" }: InternalPageProps) {
  const isLegal = mode === "legal";

  return (
    <PageShell>
      <section className="inner-hero relative isolate overflow-hidden border-b hairline">
        <div className="hero-light hero-light-red" />
        <div className="hero-light hero-light-cool" />
        <div className="hero-grid" />
        <div className="lk-container grid min-h-[54dvh] items-center gap-10 py-16 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="relative z-10 max-w-3xl">
            <span className="eyebrow">{eyebrow}</span>
            <h1 className="display mt-7 max-w-4xl">{title}</h1>
            <p className="lead mt-7 max-w-2xl">{copy}</p>
            {!isLegal ? (
              <div className="mt-9 flex flex-wrap gap-3">
                <Button href={whatsappLink} target="_blank" rel="noopener noreferrer">Analizar negocio</Button>
                <Button href="/portal" variant="secondary">
                  Portal
                </Button>
              </div>
            ) : null}
          </div>

          <SystemPanel label="Page system" className="inner-system inner-system-console">
            <div className="inner-system-grid">
              {modules.slice(0, 6).map((module, index) => (
                <CursorReactiveCard key={module} className={`inner-system-cell inner-system-cell-${index} p-4`}>
                  <span className="mono text-[0.62rem] uppercase tracking-[0.14em] text-faint">0{index + 1}</span>
                  <strong className="mt-3 block text-lg leading-tight text-lk-beige">{module}</strong>
                </CursorReactiveCard>
              ))}
              <div className="inner-system-core">
                <span className="mono text-[0.62rem] uppercase tracking-[0.14em] text-faint">flow</span>
                <strong>{mode === "system" ? "Motor Likeli" : "Likeli layer"}</strong>
              </div>
            </div>
          </SystemPanel>
        </div>
      </section>

      {isLegal ? (
        <section className="section">
          <article className="legal-copy lk-container">
            {modules.map((item) => (
              <section key={item}>
                <h2>{item}</h2>
                <p>
                  Texto legal temporal. Esta página mantiene estructura, lectura clara y consistencia visual mientras se
                  prepara la versión jurídica final.
                </p>
              </section>
            ))}
          </article>
        </section>
      ) : (
        <>
          <section className="section border-b hairline">
            <div className="lk-container">
              <SectionHeader
                eyebrow="System modules"
                title="Una arquitectura visual lista para evolucionar."
                copy="Estos módulos muestran cómo Likeli organiza inteligencia, recursos y recomendaciones dentro de una superficie de producto real."
              />
              <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {modules.map((module, index) => (
                  <CursorReactiveCard key={module} className="p-6">
                    <span className="mono text-[0.66rem] uppercase tracking-[0.15em] text-accent">module / 0{index + 1}</span>
                    <h3 className="mt-6 text-2xl leading-tight">{module}</h3>
                    <p className="copy mt-4">
                      Capa del sistema para organizar información, reducir incertidumbre y apoyar mejores decisiones de contenido.
                    </p>
                  </CursorReactiveCard>
                ))}
              </div>
            </div>
          </section>

          {steps.length ? (
            <section className="section border-b hairline">
              <div className="lk-container grid gap-10 lg:grid-cols-[0.75fr_1.25fr]">
                <SectionHeader
                  eyebrow="Flow"
                  title="Flujo operativo inicial."
                  copy="Una secuencia clara para que cada página tenga profundidad sin depender de texto largo."
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
          ) : null}

          <section className="section-tight">
            <div className="lk-container">
              <div className="final-cta">
                <span className="eyebrow">Next layer</span>
                <h2 className="mt-7 max-w-3xl text-5xl font-bold leading-[0.95] md:text-6xl">Solicita una lectura inicial.</h2>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Button href={whatsappLink} target="_blank" rel="noopener noreferrer">Ir a diagnóstico</Button>
                  <Button href="#demo" variant="secondary">
                    Contacto
                  </Button>
                </div>
              </div>
            </div>
          </section>
        </>
      )}
    </PageShell>
  );
}
