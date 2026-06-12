"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { getModuleByView, getModulesForPlan, PORTAL_MODULES } from "@/data/portalModules";
import { getPlan } from "@/data/plans";
import { ModuleCard } from "@/components/ModuleCard";
import { ModuleIcon } from "@/components/ModuleIcon";
import { buildEnrichedCalendar, buildEnrichedScripts, type EnrichedScript } from "@/lib/likeli-output/enrichment";
import { getPortalOutputSections } from "@/lib/likeli-output/getPortalOutputSections";
import type { ClientPortal, LikeliClientPortalOutput, LikeliOutputItem } from "@/types/likeliPortalOutput";

const statusLabels: Record<string, string> = { active: "Activo", inactive: "Inactivo", review: "En revision" };
const allowedViews = new Set(["inicio", ...PORTAL_MODULES.map((module) => module.view), "plan"]);

export function PortalRoute({ clientSlug, accessKey }: { clientSlug: string; accessKey: string }) {
  const [client, setClient] = useState<ClientPortal | null | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;

    async function loadPortal() {
      try {
        const response = await fetch(`/api/portals/${encodeURIComponent(clientSlug)}?accessKey=${encodeURIComponent(accessKey)}`, { cache: "no-store" });
        if (!response.ok) {
          if (!cancelled) setClient(null);
          return;
        }

        const data = await response.json() as { portal: ClientPortal };
        if (!cancelled) setClient(data.portal || null);
      } catch {
        if (!cancelled) setClient(null);
      }
    }

    void loadPortal();
    return () => {
      cancelled = true;
    };
  }, [clientSlug, accessKey]);

  if (client === undefined) return <main className="center-screen">Cargando portal...</main>;
  if (!client) return <InvalidAccess />;
  if (client.status === "inactive") return <InactivePortal />;
  return <PortalApp client={client} />;
}

function PortalApp({ client }: { client: ClientPortal }) {
  const plan = getPlan(client.activePlan);
  const [activeView, setActiveView] = useState("inicio");
  const sections = useMemo(() => getPortalOutputSections(client), [client]);
  const output = useMemo(() => buildOutputForEnrichment(client, sections), [client, sections]);
  const modules = useMemo(() => getVisibleModulesForClient(plan.id, sections), [plan.id, sections]);

  useEffect(() => {
    const readHash = () => {
      const view = window.location.hash.replace("#", "");
      setActiveView(allowedViews.has(view) ? view : "inicio");
    };
    readHash();
    window.addEventListener("hashchange", readHash);
    return () => window.removeEventListener("hashchange", readHash);
  }, []);

  function openView(view: string) {
    setActiveView(view);
    window.history.replaceState(null, "", `#${view}`);
  }

  return (
    <div className="portal-shell">
      <aside className="sidebar">
        <button className="brand-block" type="button" onClick={() => openView("inicio")}>
          <Image src="/brand/likeli-white-transparent.png" width={106} height={38} alt="Likeli" priority />
          <span>Portal</span>
        </button>
        <nav className="sidebar-nav" aria-label="Navegacion del portal">
          <NavButton view="inicio" label="Inicio" active={activeView === "inicio"} onClick={() => openView("inicio")} />
          {modules.map((module) => (
            <NavButton key={module.id} view={module.view} label={module.title} active={activeView === module.view} onClick={() => openView(module.view)} />
          ))}
          <NavButton view="plan" label="Plan" active={activeView === "plan"} onClick={() => openView("plan")} />
        </nav>
      </aside>

      <div className="portal-main">
        <header className="topbar">
          <div className="client-heading">
            <p className="eyebrow">Portal de cliente</p>
            <h1>{client.clientName}</h1>
            <span>{client.businessType}</span>
          </div>
          <div className="topbar-actions">
            <span className="pill">{plan.name}</span>
            <span className="pill muted">{statusLabels[client.status] || client.status}</span>
            <span className="pill muted">Actualizado {formatDate(client.lastUpdate)}</span>
          </div>
        </header>

        <main className="workspace">
          {activeView === "inicio" && <PortalHome client={client} modules={modules} onOpen={openView} />}
          {activeView === "plan" && <PlanView client={client} sections={sections} />}
          {activeView !== "inicio" && activeView !== "plan" && (
            <ModuleView client={client} view={activeView} sections={sections} output={output} />
          )}
        </main>
      </div>
    </div>
  );
}

function NavButton({ view, label, active, onClick }: { view: string; label: string; active: boolean; onClick: () => void }) {
  return (
    <button className={active ? "is-active" : ""} type="button" onClick={onClick}>
      <ModuleIcon view={view} />
      <span>{label}</span>
    </button>
  );
}

function PortalHome({ client, modules, onOpen }: { client: ClientPortal; modules: ReturnType<typeof getModulesForPlan>; onOpen: (view: string) => void }) {
  const plan = getPlan(client.activePlan);
  const nextFocus = String(client.generatedOutput?.nextFocus || "Priorizar contenido claro, accionable y facil de producir durante el mes.");

  return (
    <>
      <section className="home-hero">
        <div>
          <p className="eyebrow">{plan.level}</p>
          <h2>{client.clientName}</h2>
          <p>{nextFocus}</p>
        </div>
        <div className="hero-summary">
          <span>Plan actual</span>
          <strong>{plan.name}</strong>
          <p>{plan.objective}</p>
        </div>
      </section>

      <section className="section-heading">
        <div>
          <p className="eyebrow">Modulos disponibles</p>
          <h2>Inteligencia lista para usar</h2>
        </div>
      </section>
      <section className="module-grid">
        {modules.map((module) => (
          <ModuleCard key={module.id} module={module} onOpen={onOpen} />
        ))}
      </section>
    </>
  );
}

function ModuleView({
  client,
  view,
  sections,
  output,
}: {
  client: ClientPortal;
  view: string;
  sections: ReturnType<typeof getPortalOutputSections>;
  output: Partial<LikeliClientPortalOutput>;
}) {
  const portalModule = getModuleByView(view);
  const plan = getPlan(client.activePlan);
  const allowed = portalModule.plans.includes(plan.id);

  if (!allowed) {
    return (
      <section className="locked-view">
        <h2>{portalModule.title}</h2>
        <p>Este modulo esta disponible desde Signals Pro.</p>
      </section>
    );
  }

  const content = getModuleItems(portalModule.id, sections);

  return (
    <>
      <section className="section-heading">
        <div>
          <p className="eyebrow">Modulo</p>
          <h2>{portalModule.title}</h2>
          <p>{portalModule.description}</p>
        </div>
      </section>
      {renderModuleContent(portalModule.id, content, { client, output, sections })}
    </>
  );
}

function getModuleItems(moduleId: string, sections: ReturnType<typeof getPortalOutputSections>) {
  if (moduleId === "benchmarks") return Array.isArray(sections.benchmarks.items) ? sections.benchmarks.items : [];
  return sections[moduleId as keyof typeof sections] || [];
}

function renderModuleContent(
  moduleId: string,
  content: unknown,
  context: { client: ClientPortal; output: Partial<LikeliClientPortalOutput>; sections: ReturnType<typeof getPortalOutputSections> },
) {
  if (moduleId === "scripts") return <ScriptsView scripts={buildEnrichedScripts(context.output)} generalScore={context.output.likeliScore || {}} />;
  if (moduleId === "contentCalendar") {
    return <CalendarView items={buildEnrichedCalendar(context.output, { importedAt: context.client.likeliOutput?.importedAt || context.client.lastUpdate })} />;
  }
  if (moduleId === "monthlyRoadmap") return <RoadmapView items={asItems(content)} />;

  const fieldsByModule: Record<string, string[]> = {
    contentIdeas: ["title", "concept", "format", "objective", "priority", "estimatedImpact"],
    hooksLibrary: ["hook", "hookType", "bestForFormat", "psychologicalTrigger"],
    captionsLibrary: ["caption", "tone", "bestFor"],
    ctaLibrary: ["cta", "ctaType", "bestFor", "conversionIntent"],
    trends: ["title", "description", "strategicImplication"],
    opportunities: ["title", "description", "recommendedAction", "priority"],
    benchmarks: ["title", "summary", "lesson", "evidenceUsed"],
  };

  const fields = fieldsByModule[moduleId] || ["title", "description"];
  const items = asItems(content);
  return (
    <section className="resource-grid">
      {items.length ? items.map((item, index) => <ResourceCard key={String(item.id || index)} item={item} fields={fields} />) : <EmptyState />}
    </section>
  );
}

function ResourceCard({ item, fields }: { item: LikeliOutputItem; fields: string[] }) {
  const title = String(item.title || item.hook || item.caption || item.cta || item.focus || item.id || "Item");
  return (
    <article className="resource-card">
      <h3>{title}</h3>
      <dl>
        {fields
          .filter((field) => item[field] != null && field !== "title")
          .map((field) => (
            <div key={field}>
              <dt>{labelFor(field)}</dt>
              <dd>{formatValue(item[field])}</dd>
            </div>
          ))}
      </dl>
    </article>
  );
}

function ScriptsView({ scripts, generalScore }: { scripts: EnrichedScript[]; generalScore: Record<string, unknown> }) {
  if (!scripts.length) return <EmptyState />;
  const generalScoreValue = generalScore.score;

  return (
    <section className="scripts-stack">
      {generalScoreValue != null && (
        <article className="inline-summary">
          <span>Score general</span>
          <strong>{formatValue(generalScoreValue)}</strong>
          <p>{formatValue(generalScore.scoreLabel || generalScore.explanation || "Contexto general de la estrategia.")}</p>
        </article>
      )}
      {scripts.map((entry, index) => (
        <ScriptCard entry={entry} key={String(entry.script.id || index)} />
      ))}
    </section>
  );
}

function ScriptCard({ entry }: { entry: EnrichedScript }) {
  const script = entry.script;
  const prediction = entry.prediction;
  const score = entry.score;
  const title = String(script.title || script.name || script.id || "Guion");

  return (
    <article className="script-card">
      <header className="script-card__header">
        <div>
          <p className="eyebrow">Guion</p>
          <h3>{title}</h3>
        </div>
        <div className="script-meta">
          <span>{formatValue(script.format || "Sin formato")}</span>
          <span>{formatDuration(script.durationSeconds || script.duration || script.estimatedDuration)}</span>
        </div>
      </header>

      <div className="script-grid">
        <InfoBlock label="Idea relacionada" value={entry.idea ? `${formatValue(entry.idea.id)} · ${formatValue(entry.idea.title || entry.idea.concept)}` : "Sin idea relacionada"} />
        <InfoBlock label="Hook recomendado" value={formatValue(script.hook || script.recommendedHook || entry.hook?.hook || entry.hook?.title)} />
        <InfoBlock label="Caption recomendado" value={formatValue(script.caption || script.recommendedCaption || entry.caption?.caption || entry.caption?.title)} />
        <InfoBlock label="CTA recomendado" value={formatValue(script.cta || script.recommendedCta || script.recommendedCTA || entry.cta?.cta || entry.cta?.title)} />
      </div>

      <div className="script-grid compact">
        <InfoBlock label="Score" value={score == null ? "Sin score especifico" : `${formatValue(score)}${entry.scoreLabel ? ` · ${formatValue(entry.scoreLabel)}` : ""}`} />
        <InfoBlock label="Prediccion" value={prediction ? formatValue(prediction.expectedPerformance || prediction.prediction || prediction.title) : "Sin prediccion especifica"} />
        <InfoBlock label="Confianza" value={prediction ? formatValue(prediction.confidence || prediction.predictionConfidence || prediction.confidenceLevel) : "Sin dato"} />
        <InfoBlock label="Razon" value={prediction ? formatValue(prediction.reasoning || prediction.reason || prediction.rationale) : "Sin dato"} />
      </div>

      <section className="structure-block">
        <h4>Estructura del video</h4>
        <dl>
          <InfoRow label="Hook" value={formatValue(script.structureHook || script.openingHook || script.hook || entry.hook?.hook)} />
          <InfoRow label="Escenas" value={formatValue(script.scenes || script.sceneSequence || script.sequence || script.structure)} />
          <InfoRow label="Voiceover" value={formatValue(script.voiceover || script.voiceOver || script.narration)} />
          <InfoRow label="Textos en pantalla" value={formatValue(script.onScreenText || script.screenTexts || script.textsOnScreen)} />
          <InfoRow label="CTA final" value={formatValue(script.finalCta || script.finalCTA || script.cta || entry.cta?.cta)} />
        </dl>
      </section>

      {(script.evidenceUsed != null || script.evidence != null) && (
        <details className="evidence-details">
          <summary>EvidenceUsed</summary>
          <p>{formatValue(script.evidenceUsed || script.evidence)}</p>
        </details>
      )}
    </article>
  );
}

function InfoBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="info-block">
      <span>{label}</span>
      <p>{value}</p>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}

function ScoreView({ score }: { score: Record<string, unknown> }) {
  return (
    <section className="split-grid">
      <article className="score-card">
        <span>Score</span>
        <strong>{String(score.score || "N/A")}</strong>
        <p>{String(score.scoreLabel || score.explanation || "Sin score importado.")}</p>
      </article>
      <ListCard title="Fortalezas" items={asStringArray(score.strengths)} />
      <ListCard title="Debilidades" items={asStringArray(score.weaknesses)} />
      <ListCard title="Siguiente movimiento" items={[String(score.recommendedNextMove || "Sin recomendacion importada.")]} />
    </section>
  );
}

function CalendarView({ items }: { items: ReturnType<typeof buildEnrichedCalendar> }) {
  return (
    <section className="calendar-list">
      {items.map((entry, index) => (
        <article className="calendar-item" key={String(entry.item.id || index)}>
          <div className="calendar-date">
            <strong>{entry.dateLabel}</strong>
            <span>{entry.dayLabel}</span>
          </div>
          <div className="calendar-content">
            <h3>{formatValue(entry.item.title || entry.item.contentTitle || entry.item.pieceTitle)}</h3>
            <div className="calendar-grid">
              <InfoBlock label="Formato" value={formatValue(entry.item.format || entry.script?.script.format)} />
              <InfoBlock label="Objetivo" value={formatValue(entry.item.objective || entry.item.goal)} />
              <InfoBlock label="Guion" value={entry.script ? formatValue(entry.script.script.title || entry.script.script.id) : "No asignado"} />
              <InfoBlock label="Hook" value={formatValue(entry.item.hook || entry.hook?.hook || entry.script?.script.hook)} />
              <InfoBlock label="Caption" value={formatValue(entry.item.caption || entry.caption?.caption || entry.script?.script.caption)} />
              <InfoBlock label="CTA" value={formatValue(entry.item.cta || entry.cta?.cta || entry.script?.script.cta)} />
            </div>
          </div>
        </article>
      ))}
      {!items.length && <EmptyState />}
    </section>
  );
}

function RoadmapView({ items }: { items: LikeliOutputItem[] }) {
  return (
    <section className="roadmap-grid">
      {items.length ? items.map((item, index) => (
        <article className="resource-card" key={String(item.id || index)}>
          <span className="eyebrow">Semana {formatValue(item.week)}</span>
          <h3>{formatValue(item.focus)}</h3>
          <dl>
            <div><dt>Acciones</dt><dd>{formatValue(item.mainActions)}</dd></div>
            <div><dt>Criterio de exito</dt><dd>{formatValue(item.successCriteria)}</dd></div>
          </dl>
        </article>
      )) : <EmptyState />}
    </section>
  );
}

function PlanView({ client, sections }: { client: ClientPortal; sections: ReturnType<typeof getPortalOutputSections> }) {
  const plan = getPlan(client.activePlan);
  const modules = getVisibleModulesForClient(plan.id, sections);
  const volumes = [
    ["Ideas", asItems(sections.contentIdeas).length],
    ["Hooks", asItems(sections.hooksLibrary).length],
    ["Captions", asItems(sections.captionsLibrary).length],
    ["CTAs", asItems(sections.ctaLibrary).length],
    ["Guiones", asItems(sections.scripts).length],
  ];

  return (
    <>
      <section className="section-heading">
        <div>
          <p className="eyebrow">Plan activo</p>
          <h2>{plan.name}</h2>
          <p>{plan.objective}</p>
        </div>
        <span className="pill">{plan.price}</span>
      </section>

      <section className="plan-grid">
        <article className="resource-card">
          <h3>Volumen incluido</h3>
          <dl>
            {volumes.map(([label, value]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{String(value)}</dd>
              </div>
            ))}
          </dl>
        </article>
        <article className="resource-card">
          <h3>Secciones disponibles</h3>
          <ul>{modules.map((module) => <li key={module.id}>{module.title}</li>)}</ul>
        </article>
        <article className="resource-card">
          <h3>Contexto</h3>
          <dl>
            <div><dt>Plan</dt><dd>{plan.name}</dd></div>
            <div><dt>Nivel</dt><dd>{plan.level}</dd></div>
            <div><dt>Fecha de importacion</dt><dd>{formatDateTime(client.likeliOutput?.importedAt || client.lastUpdate)}</dd></div>
          </dl>
        </article>
      </section>
    </>
  );
}

function ListCard({ title, items }: { title: string; items: string[] }) {
  return (
    <article className="resource-card">
      <h3>{title}</h3>
      <ul>{items.filter(Boolean).map((item) => <li key={item}>{item}</li>)}</ul>
    </article>
  );
}

function EmptyState() {
  return (
    <article className="empty-state">
      <strong>Sin datos disponibles</strong>
      <p>Importa el output desde admin o revisa el contenido del modulo mas tarde.</p>
    </article>
  );
}

function getVisibleModulesForClient(planId: ClientPortal["activePlan"], sections: ReturnType<typeof getPortalOutputSections>) {
  return getModulesForPlan(planId).filter((module) => {
    if (module.id === "scripts") return asItems(sections.scripts).length > 0;
    if (module.id === "contentCalendar") return asItems(sections.contentCalendar).length > 0;
    if (module.id === "monthlyRoadmap") return asItems(sections.monthlyRoadmap).length > 0;
    if (module.id === "benchmarks") return asItems(sections.benchmarks.items).length > 0;
    return true;
  });
}

function buildOutputForEnrichment(
  client: ClientPortal,
  sections: ReturnType<typeof getPortalOutputSections>,
): Partial<LikeliClientPortalOutput> {
  return {
    ...(client.likeliOutput?.output || {}),
    contentIdeas: asItems(sections.contentIdeas),
    hooksLibrary: asItems(sections.hooksLibrary),
    captionsLibrary: asItems(sections.captionsLibrary),
    ctaLibrary: asItems(sections.ctaLibrary),
    trends: asItems(sections.trends),
    opportunities: asItems(sections.opportunities),
    scripts: asItems(sections.scripts),
    predictions: asRecord(sections.predictions) as LikeliClientPortalOutput["predictions"],
    likeliScore: asRecord(sections.likeliScore) as LikeliClientPortalOutput["likeliScore"],
    benchmarks: asRecord(sections.benchmarks) as LikeliClientPortalOutput["benchmarks"],
    contentCalendar: asItems(sections.contentCalendar),
    monthlyRoadmap: asItems(sections.monthlyRoadmap),
    prioritizationMatrix: asItems(sections.prioritization),
  };
}

function InvalidAccess() {
  return (
    <main className="center-screen">
      <section className="access-card">
        <Image src="/brand/likeli-white-transparent.png" width={126} height={46} alt="Likeli" />
        <p className="eyebrow">Likeli Portal</p>
        <h1>Acceso no valido</h1>
        <p>El enlace no coincide con un cliente activo. Verifica el acceso o solicita un nuevo link.</p>
        <Link className="button" href="/portal">Volver</Link>
      </section>
    </main>
  );
}

function InactivePortal() {
  return (
    <main className="center-screen">
      <section className="access-card">
        <Image src="/brand/likeli-white-transparent.png" width={126} height={46} alt="Likeli" />
        <p className="eyebrow">Likeli Portal</p>
        <h1>Portal inactivo</h1>
        <p>Este portal no esta disponible actualmente.</p>
        <Link className="button" href="/portal">Volver</Link>
      </section>
    </main>
  );
}

function asItems(value: unknown): LikeliOutputItem[] {
  return Array.isArray(value) ? (value as LikeliOutputItem[]) : [];
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : {};
}

function asStringArray(value: unknown) {
  return Array.isArray(value) ? value.map((item) => String(item)) : [];
}

function formatValue(value: unknown): string {
  if (Array.isArray(value)) return value.map((item) => formatValue(item)).filter(Boolean).join(", ");
  if (value && typeof value === "object") return Object.values(value).map((item) => formatValue(item)).filter(Boolean).join(", ");
  return value == null || value === "" ? "Sin dato" : String(value);
}

function formatDuration(value: unknown) {
  if (value == null || value === "") return "Sin duracion";
  const text = String(value);
  return /^\d+$/.test(text) ? `${text}s` : text;
}

function labelFor(field: string) {
  return ({
    concept: "Concepto",
    format: "Formato",
    objective: "Objetivo",
    priority: "Prioridad",
    estimatedImpact: "Impacto estimado",
    hookType: "Tipo",
    bestForFormat: "Mejor formato",
    psychologicalTrigger: "Trigger",
    tone: "Tono",
    bestFor: "Ideal para",
    ctaType: "Tipo",
    conversionIntent: "Intencion",
    strategicImplication: "Implicacion",
    recommendedAction: "Accion recomendada",
    durationSeconds: "Duracion",
    structure: "Estructura",
    expectedPerformance: "Rendimiento",
    reasoning: "Razonamiento",
    summary: "Resumen",
    lesson: "Aprendizaje",
    evidenceUsed: "Evidencia",
  } as Record<string, string>)[field] || field;
}

function formatDate(value: string) {
  try {
    return new Intl.DateTimeFormat("es-CO", { year: "numeric", month: "short", day: "numeric" }).format(new Date(`${value}T00:00:00`));
  } catch {
    return value;
  }
}

function formatDateTime(value: string) {
  try {
    return new Intl.DateTimeFormat("es-CO", { year: "numeric", month: "short", day: "numeric" }).format(new Date(value));
  } catch {
    return value;
  }
}
