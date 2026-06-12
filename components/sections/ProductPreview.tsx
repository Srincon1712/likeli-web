import CursorReactiveCard from "@/components/ui/CursorReactiveCard";
import SectionHeader from "@/components/ui/SectionHeader";
import SystemPanel from "@/components/ui/SystemPanel";

const modules = [
  { name: "Ideas de contenido", state: "active", detail: "content input" },
  { name: "Review Intelligence", state: "learning", detail: "trust layer" },
  { name: "Guiones priorizados", state: "mapped", detail: "script signal" },
  { name: "Score Likeli", state: "scored", detail: "prediction model" },
];

const events = ["Idea detectada", "Hook sugerido", "Guion priorizado", "Fecha recomendada"];

export default function ProductPreview() {
  return (
    <section className="section border-b hairline">
      <div className="lk-container">
        <div className="grid gap-10 lg:grid-cols-[0.76fr_1.24fr] lg:items-center">
          <SectionHeader
            eyebrow="Product preview"
            title="Cada negocio tiene su propio espacio de inteligencia."
            copy="Los portales Likeli organizan ideas, guiones, calendario, casos, benchmarks, recomendaciones y recursos según el plan contratado."
          />

          <SystemPanel label="Likeli command layer" className="product-preview product-console">
            <div className="product-console-grid">
              <aside className="product-rail">
                {modules.map((module, index) => (
                  <CursorReactiveCard key={module.name} className={`product-module product-module-${index} p-4`}>
                    <div className="flex items-center justify-between gap-3">
                      <span className="mono text-[0.6rem] uppercase tracking-[0.14em] text-faint">{module.state}</span>
                      <span className="module-pulse" />
                    </div>
                    <strong className="mt-3 block text-base leading-tight text-lk-beige">{module.name}</strong>
                    <span className="mt-3 block mono text-[0.6rem] uppercase tracking-[0.13em] text-muted">
                      {module.detail}
                    </span>
                  </CursorReactiveCard>
                ))}
              </aside>

              <div className="product-stream">
                <div className="stream-header">
                  <span className="mono text-[0.62rem] uppercase tracking-[0.14em] text-faint">Content timeline</span>
                  <span className="mono text-[0.62rem] uppercase tracking-[0.14em] text-accent">Live insight</span>
                </div>
                <div className="stream-track">
                  {events.map((event, index) => (
                    <div key={event} className="stream-event">
                      <span className="stream-dot" />
                      <div>
                        <strong>{event}</strong>
                        <span>portal / modulo 0{index + 1}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <aside className="product-inspector">
                <span className="mono text-[0.62rem] uppercase tracking-[0.14em] text-faint">Inspector</span>
                <strong className="mt-4 block text-3xl leading-none text-lk-beige">Score</strong>
                <div className="intent-meter mt-6">
                  <span />
                </div>
                <div className="mt-6 grid gap-3">
                  {["hook strength", "script score", "publish timing"].map((item) => (
                    <div key={item} className="inspector-row">
                      <span>{item}</span>
                      <strong>on</strong>
                    </div>
                  ))}
                </div>
              </aside>
            </div>
          </SystemPanel>
        </div>
      </div>
    </section>
  );
}
