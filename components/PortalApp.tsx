"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { GraduationCap, LockKeyhole, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { getModuleByView, PORTAL_MODULES, type PortalModule } from "@/data/portalModules";
import { getPlan } from "@/data/plans";
import type { PortalTutorialStep } from "@/data/portalTutorial";
import { ModuleCard } from "@/components/ModuleCard";
import { ModuleIcon } from "@/components/ModuleIcon";
import { PortalTutorial } from "@/components/PortalTutorial";
import { ContentIdeasView } from "@/components/ContentIdeasView";
import { ContentLibrariesView } from "@/components/ContentLibrariesView";
import { TrendsRadarView } from "@/components/TrendsRadarView";
import { BenchmarksObservatoryView, ExecutionRoadmapView, OpportunitiesBoardView } from "@/components/StrategyExecutionViews";
import { ExecutionCalendarView, PlanControlCenter, ScriptStudioView } from "@/components/ProductionPlanViews";
import { buildEnrichedScripts } from "@/lib/likeli-output/enrichment";
import { getPortalOutputSections } from "@/lib/likeli-output/getPortalOutputSections";
import type { ClientPortal, LikeliClientPortalOutput, LikeliOutputItem } from "@/types/likeliPortalOutput";

const statusLabels: Record<string, string> = { active: "Activo", inactive: "Inactivo", review: "En revision" };
const allowedViews = new Set(["inicio", ...PORTAL_MODULES.map((module) => module.view), "plan"]);
const lockedModuleMessage = "Funcion superior no incluida en tu plan actual. Mejora tu plan para desbloquearla.";

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
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [tutorialOpen, setTutorialOpen] = useState(false);
  const [tutorialStepId, setTutorialStepId] = useState<string | null>(null);
  const sections = useMemo(() => getPortalOutputSections(client), [client]);
  const output = useMemo(() => buildOutputForEnrichment(client, sections), [client, sections]);
  const enrichedScripts = useMemo(() => buildEnrichedScripts(output), [output]);
  const tutorialCapabilities = useMemo(() => ({
    hasCaseLibrary: false,
    hasLockedModules: PORTAL_MODULES.some((module) => !isModuleIncludedInPlan(module, plan.id)),
    hasScripts: plan.id !== "signals" && enrichedScripts.length > 0,
  }), [enrichedScripts.length, plan.id]);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 920px)");
    const syncSidebar = () => setSidebarOpen(!media.matches);

    syncSidebar();
    media.addEventListener("change", syncSidebar);
    return () => media.removeEventListener("change", syncSidebar);
  }, []);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSidebarOpen(false);
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);

  useEffect(() => {
    const readHash = () => {
      const view = window.location.hash.replace("#", "");
      setActiveView(allowedViews.has(view) ? view : "inicio");
    };
    readHash();
    window.addEventListener("hashchange", readHash);
    return () => window.removeEventListener("hashchange", readHash);
  }, []);

  const openView = useCallback((view: string) => {
    setActiveView(view);
    window.history.replaceState(null, "", `#${view}`);
    if (window.matchMedia("(max-width: 920px)").matches) setSidebarOpen(false);
  }, []);

  const navigateTutorial = useCallback((step: PortalTutorialStep) => {
    setActiveView(step.view);
    window.history.replaceState(null, "", `#${step.view}`);
    const isMobile = window.matchMedia("(max-width: 920px)").matches;
    setSidebarOpen(step.target === "portal-navigation" ? true : !isMobile);
  }, []);

  return (
    <div className={`portal-shell ${sidebarOpen ? "is-sidebar-open" : "is-sidebar-collapsed"}`}>
      {!sidebarOpen && (
        <button className="sidebar-reopen" type="button" aria-label="Abrir barra lateral" aria-expanded="false" onClick={() => setSidebarOpen(true)}>
          <PanelLeftOpen aria-hidden="true" size={18} strokeWidth={2} />
        </button>
      )}
      {sidebarOpen && <button className="sidebar-overlay" type="button" aria-label="Cerrar menu lateral" onClick={() => setSidebarOpen(false)} />}
      <aside className="sidebar">
        <div className="sidebar-header">
          <button className="brand-block" type="button" onClick={() => openView("inicio")}>
            <Image src="/brand/likeli-white-transparent.png" width={106} height={38} alt="Likeli" priority />
            <span>Portal</span>
          </button>
          <button className="sidebar-toggle" type="button" aria-label="Cerrar barra lateral" aria-expanded="true" onClick={() => setSidebarOpen(false)}>
            <PanelLeftClose aria-hidden="true" size={18} strokeWidth={2} />
          </button>
        </div>
        <nav className="sidebar-nav" data-tour-id="portal-navigation" aria-label="Navegacion del portal">
          <NavButton view="inicio" label="Inicio" active={activeView === "inicio"} onClick={() => openView("inicio")} />
          {PORTAL_MODULES.map((module) => (
            <NavButton
              key={module.id}
              view={module.view}
              label={module.title}
              active={activeView === module.view}
              locked={!isModuleIncludedInPlan(module, plan.id)}
              onClick={() => openView(module.view)}
            />
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
          {activeView === "inicio" && (
            <PortalHome client={client} modules={PORTAL_MODULES} onOpen={openView} onStartTutorial={() => setTutorialOpen(true)} />
          )}
          {activeView === "plan" && <PlanControlCenter client={client} />}
          {activeView !== "inicio" && activeView !== "plan" && (
            <ModuleView client={client} view={activeView} sections={sections} output={output} tutorialStepId={tutorialStepId} />
          )}
        </main>
      </div>
      {tutorialOpen && (
        <PortalTutorial
          capabilities={tutorialCapabilities}
          completionKey={`likeli.portal-tutorial.completed.${client.clientSlug}`}
          onClose={() => {
            setTutorialOpen(false);
            setTutorialStepId(null);
          }}
          onNavigate={navigateTutorial}
          onStepChange={setTutorialStepId}
        />
      )}
    </div>
  );
}

function NavButton({
  view,
  label,
  active,
  locked = false,
  onClick,
}: {
  view: string;
  label: string;
  active: boolean;
  locked?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      aria-disabled={locked}
      className={`${active ? "is-active" : ""}${locked ? " is-locked" : ""}`}
      data-tooltip={locked ? lockedModuleMessage : undefined}
      title={locked ? lockedModuleMessage : undefined}
      type="button"
      onClick={locked ? undefined : onClick}
    >
      <ModuleIcon view={view} />
      <span>{label}</span>
      {locked && <LockKeyhole className="lock-icon" aria-hidden="true" size={13} strokeWidth={2.2} />}
    </button>
  );
}

function PortalHome({
  client,
  modules,
  onOpen,
  onStartTutorial,
}: {
  client: ClientPortal;
  modules: PortalModule[];
  onOpen: (view: string) => void;
  onStartTutorial: () => void;
}) {
  const plan = getPlan(client.activePlan);
  const nextFocus = String(client.generatedOutput?.nextFocus || "Priorizar contenido claro, accionable y facil de producir durante el mes.");

  return (
    <div className="portal-home">
      <section className="home-hero" data-tour-id="portal-home">
        <div>
          <p className="eyebrow">{plan.level}</p>
          <h2>{client.clientName}</h2>
          <p>{nextFocus}</p>
          <button className="portal-tutorial-launch" type="button" onClick={onStartTutorial}>
            <GraduationCap aria-hidden="true" size={17} />
            Ver tutorial
          </button>
        </div>
        <div className="hero-summary" data-tour-id="portal-plan">
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
          <ModuleCard key={module.id} module={module} locked={!isModuleIncludedInPlan(module, plan.id)} onOpen={onOpen} />
        ))}
      </section>
    </div>
  );
}

function ModuleView({
  client,
  view,
  sections,
  output,
  tutorialStepId,
}: {
  client: ClientPortal;
  view: string;
  sections: ReturnType<typeof getPortalOutputSections>;
  output: Partial<LikeliClientPortalOutput>;
  tutorialStepId: string | null;
}) {
  const portalModule = getModuleByView(view);
  const plan = getPlan(client.activePlan);
  const allowed = portalModule.plans.includes(plan.id);

  if (!allowed) {
    const premiumMessage = portalModule.id === "scripts"
      ? "Los guiones completos estan disponibles en Signals Pro y Signals Elite."
      : portalModule.id === "contentCalendar"
        ? "El calendario de contenido de 30 dias esta disponible en Signals Pro y Signals Elite porque se construye a partir de guiones completos."
        : lockedModuleMessage;
    return (
      <div data-tour-id={tourTargetForModule(portalModule.id)}>
        <section className="locked-view" data-tour-id="locked-module">
          <h2>{portalModule.title}</h2>
          <p>{premiumMessage}</p>
        </section>
      </div>
    );
  }

  const content = getModuleItems(portalModule.id, sections);

  return (
    <div className="portal-module-view">
      <section className="section-heading" data-tour-id={tourTargetForModule(portalModule.id)}>
        <div>
          <p className="eyebrow">Modulo</p>
          <h2>{portalModule.title}</h2>
          <p>{portalModule.description}</p>
        </div>
      </section>
      {renderModuleContent(portalModule.id, content, { client, output, sections, tutorialStepId })}
    </div>
  );
}

function getModuleItems(moduleId: string, sections: ReturnType<typeof getPortalOutputSections>) {
  if (moduleId === "benchmarks") return Array.isArray(sections.benchmarks.items) ? sections.benchmarks.items : [];
  return sections[moduleId as keyof typeof sections] || [];
}

function renderModuleContent(
  moduleId: string,
  content: unknown,
  context: {
    client: ClientPortal;
    output: Partial<LikeliClientPortalOutput>;
    sections: ReturnType<typeof getPortalOutputSections>;
    tutorialStepId: string | null;
  },
) {
  if (moduleId === "scripts") {
    return <ScriptStudioView entries={buildEnrichedScripts(context.output)} ideaCount={asItems(context.sections.contentIdeas).length} planId={context.client.activePlan} />;
  }
  if (moduleId === "contentCalendar") {
    return <ExecutionCalendarView client={context.client} entries={buildEnrichedScripts(context.output)} planId={context.client.activePlan} />;
  }
  if (moduleId === "monthlyRoadmap") return <ExecutionRoadmapView items={asItems(content)} />;
  if (moduleId === "contentIdeas") {
    return <ContentIdeasView items={asItems(content)} openFirstIdea={context.tutorialStepId === "idea-expanded"} />;
  }
  if (moduleId === "hooksLibrary") return <ContentLibrariesView key="hooks" kind="hooks" items={asItems(content)} />;
  if (moduleId === "ctaLibrary") return <ContentLibrariesView key="ctas" kind="ctas" items={asItems(content)} />;
  if (moduleId === "captionsLibrary") return <ContentLibrariesView key="captions" kind="captions" items={asItems(content)} />;
  if (moduleId === "trends") return <TrendsRadarView items={asItems(content)} />;
  if (moduleId === "opportunities") return <OpportunitiesBoardView items={asItems(content)} />;
  if (moduleId === "benchmarks") return <BenchmarksObservatoryView items={asItems(content)} />;

  const fields = ["title", "description"];
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

function EmptyState() {
  return (
    <article className="empty-state">
      <strong>Sin datos disponibles</strong>
      <p>Importa el output desde admin o revisa el contenido del modulo mas tarde.</p>
    </article>
  );
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

function tourTargetForModule(moduleId: string) {
  return ({
    contentIdeas: "module-ideas",
    hooksLibrary: "module-hooks",
    captionsLibrary: "module-captions",
    ctaLibrary: "module-ctas",
    trends: "module-trends",
    opportunities: "module-opportunities",
    scripts: "module-scripts",
    contentCalendar: "module-calendar",
    benchmarks: "module-benchmarks",
    monthlyRoadmap: "module-roadmap",
  } as Record<string, string>)[moduleId] || `module-${moduleId}`;
}

function isModuleIncludedInPlan(module: PortalModule, planId: ClientPortal["activePlan"]) {
  return module.plans.includes(planId);
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

function formatValue(value: unknown): string {
  if (Array.isArray(value)) return value.map((item) => formatValue(item)).filter(Boolean).join(", ");
  if (value && typeof value === "object") return Object.values(value).map((item) => formatValue(item)).filter(Boolean).join(", ");
  return value == null || value === "" ? "Sin dato" : String(value);
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
