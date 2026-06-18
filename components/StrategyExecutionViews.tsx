"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode, type RefObject } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  ClipboardCheck,
  Eye,
  Gauge,
  Layers3,
  Lightbulb,
  ListChecks,
  Route,
  Scale,
  ShieldAlert,
  Sparkles,
  Target,
  Telescope,
  TriangleAlert,
  X,
  Zap,
} from "lucide-react";
import type { LikeliOutputItem } from "@/types/likeliPortalOutput";

const opportunityAliases = {
  title: ["title", "titulo", "name", "nombre", "opportunity", "oportunidad"],
  category: ["type", "tipo", "category", "categoria", "contentType"],
  problem: ["problem", "problema", "gap", "vacio", "diagnosis", "diagnostico", "description", "descripcion"],
  why: ["why", "razon", "whyItMatters", "porQueImporta", "reason"],
  action: ["action", "accion", "recommendedAction", "accionRecomendada"],
  impact: ["impact", "impacto", "expectedImpact", "impactoEsperado", "potential", "potencial"],
  ease: ["ease", "facilidad", "difficulty", "dificultad"],
  priority: ["priority", "prioridad"],
  timeframe: ["timeframe", "tiempo", "executionTime", "tiempoEjecucion"],
  content: ["contentIdeas", "ideasContenido", "recommendedContent", "contenidosRecomendados"],
  risks: ["risks", "riesgos", "avoid", "evitar"],
  nextStep: ["nextStep", "siguientePaso"],
  result: ["result", "resultado", "desiredResult", "resultadoBuscado", "intention", "intencion"],
  evidence: ["evidence", "evidencia", "evidenceUsed"],
} as const;

const benchmarkAliases = {
  title: ["title", "titulo", "name", "nombre", "benchmark", "referente", "competitor", "competidor"],
  type: ["type", "tipo", "category", "categoria", "comparisonType"],
  observed: ["observed", "observado", "whatTheyDo", "queHacen", "summary", "resumen"],
  works: ["whatWorks", "queFunciona", "working"],
  why: ["whyItWorks", "porQueFunciona"],
  learning: ["learning", "aprendizaje", "takeaway", "conclusion", "lesson"],
  adapt: ["adapt", "adaptar", "adaptable"],
  avoid: ["avoid", "evitar", "risk", "riesgo"],
  gap: ["gap", "brecha", "opportunity", "oportunidad"],
  relevance: ["relevance", "relevancia"],
  differential: ["differentiation", "diferenciacion", "recommendedDifferential", "diferencialRecomendado", "recommendation"],
  ideas: ["ideas", "ideasDerivadas"],
  metrics: ["metrics", "metricas", "evidenceUsed"],
  engagement: ["engagement", "interaccion"],
  format: ["format", "formato", "contentType"],
  platform: ["platform", "plataforma"],
} as const;

const roadmapAliases = {
  title: ["title", "titulo", "name", "nombre", "action", "accion", "task", "tarea", "step", "paso", "focus"],
  phase: ["phase", "fase", "week", "semana", "date", "fecha", "timing", "momento"],
  objective: ["objective", "objetivo"],
  priority: ["priority", "prioridad"],
  type: ["type", "tipo", "category", "categoria"],
  deliverable: ["deliverable", "entregable"],
  instructions: ["instructions", "instrucciones", "howToExecute", "comoEjecutar", "mainActions"],
  resources: ["resources", "recursos"],
  result: ["expectedResult", "resultadoEsperado"],
  success: ["successMetric", "metricaExito", "kpi", "successCriteria"],
  relatedIdea: ["relatedIdea", "ideaRelacionada"],
  relatedTrend: ["relatedTrend", "tendenciaRelacionada"],
  relatedOpportunity: ["relatedOpportunity", "oportunidadRelacionada"],
  relatedBenchmark: ["relatedBenchmark", "benchmarkRelacionado"],
  status: ["status", "estado"],
  notes: ["notes", "notas", "why", "porQue"],
} as const;

type Opportunity = ReturnType<typeof normalizeOpportunity>;
type Benchmark = ReturnType<typeof normalizeBenchmark>;
type RoadmapStep = ReturnType<typeof normalizeRoadmapStep>;
type OverlayItem = { kind: "opportunity"; item: Opportunity } | { kind: "benchmark"; item: Benchmark };

export function OpportunitiesBoardView({ items }: { items: LikeliOutputItem[] }) {
  const opportunities = useMemo(() => items.map(normalizeOpportunity), [items]);
  const categories = useMemo(() => unique(opportunities.map((item) => item.category)), [opportunities]);
  const [activeCategory, setActiveCategory] = useState("Todas");
  const [selected, setSelected] = useState<Opportunity | null>(null);
  const visible = activeCategory === "Todas" ? opportunities : opportunities.filter((item) => item.category === activeCategory);

  if (!items.length) return <ModuleEmpty title="Sin oportunidades detectadas" />;

  return (
    <>
      <section className="opportunity-board">
        <BoardHeader opportunities={opportunities} />
        <FilterBar active={activeCategory} allLabel="Todas" items={categories} onChange={setActiveCategory} source={opportunities.map((item) => item.category)} />
        <div className="opportunity-grid">
          {visible.map((item, index) => <OpportunityCard item={item} index={index} key={item.key} onOpen={() => setSelected(item)} />)}
        </div>
      </section>
      {selected && <StrategyOverlay value={{ kind: "opportunity", item: selected }} onDismiss={() => setSelected(null)} />}
    </>
  );
}

export function BenchmarksObservatoryView({ items }: { items: LikeliOutputItem[] }) {
  const benchmarks = useMemo(() => items.map(normalizeBenchmark), [items]);
  const categories = useMemo(() => unique(benchmarks.map((item) => item.type)), [benchmarks]);
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [selected, setSelected] = useState<Benchmark | null>(null);
  const visible = activeCategory === "Todos" ? benchmarks : benchmarks.filter((item) => item.type === activeCategory);

  if (!items.length) return <ModuleEmpty title="Sin benchmarks disponibles" />;

  return (
    <>
      <section className="benchmark-observatory">
        <ObservatoryHeader benchmarks={benchmarks} />
        <FilterBar active={activeCategory} allLabel="Todos" items={categories} onChange={setActiveCategory} source={benchmarks.map((item) => item.type)} />
        <div className="benchmark-grid">
          {visible.map((item) => <BenchmarkCard item={item} key={item.key} onOpen={() => setSelected(item)} />)}
        </div>
      </section>
      {selected && <StrategyOverlay value={{ kind: "benchmark", item: selected }} onDismiss={() => setSelected(null)} />}
    </>
  );
}

export function ExecutionRoadmapView({ items }: { items: LikeliOutputItem[] }) {
  const steps = useMemo(() => items.map(normalizeRoadmapStep), [items]);
  const [expandedKey, setExpandedKey] = useState<string | null>(steps[0]?.key || null);

  if (!items.length) return <ModuleEmpty title="Sin ruta de ejecucion disponible" />;

  return (
    <section className="execution-roadmap">
      <RoadmapHeader steps={steps} />
      <div className="execution-timeline">
        {steps.map((step, index) => (
          <RoadmapStepCard
            expanded={expandedKey === step.key}
            index={index}
            key={step.key}
            onToggle={() => setExpandedKey((current) => current === step.key ? null : step.key)}
            step={step}
          />
        ))}
      </div>
    </section>
  );
}

function BoardHeader({ opportunities }: { opportunities: Opportunity[] }) {
  const highPriority = opportunities.filter((item) => isHigh(item.priority)).length;
  const easy = opportunities.filter((item) => /facil|easy|low/i.test(item.ease)).length;
  const withImpact = opportunities.filter((item) => item.impact).length;
  return (
    <header className="opportunity-board__header">
      <div>
        <p className="eyebrow">Opportunity board</p>
        <h3>Acciones para convertir atencion en resultados</h3>
        <p>Oportunidades detectadas y traducidas en movimientos concretos para el negocio.</p>
      </div>
      <div className="strategy-summary-metrics">
        <SummaryMetric icon={<Target size={16} />} label="Detectadas" value={opportunities.length} />
        {highPriority > 0 && <SummaryMetric icon={<Zap size={16} />} label="Alta prioridad" value={highPriority} />}
        {easy > 0 && <SummaryMetric icon={<Gauge size={16} />} label="Ejecucion rapida" value={easy} />}
        {withImpact > 0 && <SummaryMetric icon={<BarChart3 size={16} />} label="Impacto definido" value={withImpact} />}
      </div>
    </header>
  );
}

function ObservatoryHeader({ benchmarks }: { benchmarks: Benchmark[] }) {
  const success = benchmarks.filter((item) => /success|exito|ganador/i.test(item.type)).length;
  const caution = benchmarks.filter((item) => /failure|fallo|riesgo|debil/i.test(item.type)).length;
  const withMetrics = benchmarks.filter((item) => item.metrics.length || item.engagement).length;
  return (
    <header className="observatory-header">
      <div className="observatory-lens" aria-hidden="true"><Telescope size={30} /><span /><i /></div>
      <div>
        <p className="eyebrow">Benchmark observatory</p>
        <h3>Lecturas comparativas frente al mercado</h3>
        <p>Patrones, casos y aprendizajes para adaptar lo que funciona sin perder diferenciacion.</p>
      </div>
      <div className="strategy-summary-metrics">
        <SummaryMetric icon={<Eye size={16} />} label="Referencias" value={benchmarks.length} />
        {success > 0 && <SummaryMetric icon={<CheckCircle2 size={16} />} label="Casos fuertes" value={success} />}
        {caution > 0 && <SummaryMetric icon={<ShieldAlert size={16} />} label="Alertas" value={caution} />}
        {withMetrics > 0 && <SummaryMetric icon={<BarChart3 size={16} />} label="Con evidencia" value={withMetrics} />}
      </div>
    </header>
  );
}

function RoadmapHeader({ steps }: { steps: RoadmapStep[] }) {
  const priority = steps.filter((step) => isHigh(step.priority)).length;
  const deliverables = steps.filter((step) => step.deliverable).length;
  const successMetrics = steps.filter((step) => step.success.length).length;
  return (
    <header className="roadmap-header">
      <div className="roadmap-route-icon" aria-hidden="true"><Route size={27} /></div>
      <div>
        <p className="eyebrow">Execution roadmap</p>
        <h3>Ruta sugerida para convertir analisis en ejecucion</h3>
        <p>Una secuencia ordenada de acciones, entregables y criterios para aprender durante el mes.</p>
      </div>
      <div className="strategy-summary-metrics">
        <SummaryMetric icon={<ListChecks size={16} />} label="Fases" value={steps.length} />
        {priority > 0 && <SummaryMetric icon={<Zap size={16} />} label="Prioritarias" value={priority} />}
        {deliverables > 0 && <SummaryMetric icon={<Layers3 size={16} />} label="Entregables" value={deliverables} />}
        {successMetrics > 0 && <SummaryMetric icon={<ClipboardCheck size={16} />} label="Con criterio" value={successMetrics} />}
      </div>
    </header>
  );
}

function OpportunityCard({ item, index, onOpen }: { item: Opportunity; index: number; onOpen: () => void }) {
  return (
    <button className="opportunity-card" type="button" onClick={onOpen} aria-label={`Abrir oportunidad: ${item.title}`}>
      <header>
        <div className="strategy-tags">
          {item.priority && <StrategyTag tone={priorityTone(item.priority)}>{prettyLabel(item.priority)}</StrategyTag>}
          {item.category !== "General" && <StrategyTag>{prettyLabel(item.category)}</StrategyTag>}
        </div>
        <span className="opportunity-card__number">{String(index + 1).padStart(2, "0")}</span>
      </header>
      <div className="opportunity-card__main">
        <h3>{item.title}</h3>
        {item.problem && <p>{item.problem}</p>}
      </div>
      {item.action && <div className="opportunity-card__action"><ArrowRight size={15} /><span>Accion recomendada</span><p>{item.action}</p></div>}
      {(item.impact || item.ease || item.result) && (
        <div className="opportunity-card__indicators">
          {item.impact && <InlineMetric label="Impacto" value={item.impact} />}
          {item.ease && <InlineMetric label="Ejecucion" value={item.ease} />}
          {item.result && <InlineMetric label="Resultado" value={item.result} />}
        </div>
      )}
      <footer><span>{item.timeframe}</span><strong>Abrir accion <ArrowUpRight size={14} /></strong></footer>
    </button>
  );
}

function BenchmarkCard({ item, onOpen }: { item: Benchmark; onOpen: () => void }) {
  const isCaution = /failure|fallo|riesgo|debil/i.test(item.type);
  return (
    <button className={`benchmark-card${isCaution ? " is-caution" : ""}`} type="button" onClick={onOpen} aria-label={`Abrir benchmark: ${item.title}`}>
      <header>
        <StrategyTag tone={isCaution ? "warning" : "analytical"}>{prettyLabel(item.type)}</StrategyTag>
        {item.relevance && <span className="benchmark-relevance">Relevancia {prettyLabel(item.relevance)}</span>}
      </header>
      <h3>{item.title}</h3>
      {item.observed && <p className="benchmark-observed">{item.observed}</p>}
      <div className="benchmark-card__comparison">
        {(item.works || item.observed) && <ComparisonMini label="Patron observado" value={item.works || item.observed} />}
        {item.learning && <ComparisonMini label="Aprendizaje" value={item.learning} highlight />}
      </div>
      <footer><span>{item.format || item.platform}</span><strong>Ver analisis <Scale size={14} /></strong></footer>
    </button>
  );
}

function RoadmapStepCard({ expanded, index, onToggle, step }: { expanded: boolean; index: number; onToggle: () => void; step: RoadmapStep }) {
  const hasDetails = step.instructions.length || step.resources.length || step.success.length || step.result || step.deliverable || step.notes || step.related.length;
  return (
    <article className={`roadmap-step-card${expanded ? " is-expanded" : ""}`}>
      <div className="roadmap-step-card__rail">
        <span>{String(index + 1).padStart(2, "0")}</span>
      </div>
      <div className="roadmap-step-card__body">
        <button type="button" onClick={onToggle} aria-expanded={expanded}>
          <div className="roadmap-step-card__heading">
            <div className="strategy-tags">
              {step.phase && <StrategyTag tone="phase">{prettyPhase(step.phase)}</StrategyTag>}
              {step.priority && <StrategyTag tone={priorityTone(step.priority)}>{prettyLabel(step.priority)}</StrategyTag>}
              {step.status && <StrategyTag>{prettyLabel(step.status)}</StrategyTag>}
            </div>
            <h3>{step.title}</h3>
            {step.objective && <p>{step.objective}</p>}
          </div>
          {hasDetails && (expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />)}
        </button>
        {expanded && hasDetails && (
          <div className="roadmap-step-card__details">
            {step.instructions.length > 0 && <RoadmapList icon={<ListChecks size={16} />} title="Que hacer" items={step.instructions} />}
            <div className="roadmap-detail-grid">
              {step.deliverable && <RoadmapInfo icon={<Layers3 size={15} />} label="Entregable" value={step.deliverable} />}
              {step.result && <RoadmapInfo icon={<Target size={15} />} label="Resultado esperado" value={step.result} />}
              {step.resources.length > 0 && <RoadmapInfo icon={<Sparkles size={15} />} label="Recursos" value={step.resources.join(" · ")} />}
            </div>
            {step.success.length > 0 && <RoadmapList icon={<ClipboardCheck size={16} />} title="Como saber si funciono" items={step.success} success />}
            {step.notes && <div className="roadmap-note"><Lightbulb size={15} /><p>{step.notes}</p></div>}
            {step.related.length > 0 && <div className="roadmap-related">{step.related.map((value, idx) => <span key={`${value}-${idx}`}>{value}</span>)}</div>}
          </div>
        )}
      </div>
    </article>
  );
}

function StrategyOverlay({ onDismiss, value }: { onDismiss: () => void; value: OverlayItem }) {
  const [closing, setClosing] = useState(false);
  const closingRef = useRef(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const close = useCallback(() => {
    if (closingRef.current) return;
    closingRef.current = true;
    setClosing(true);
    window.setTimeout(onDismiss, 190);
  }, [onDismiss]);

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const timer = window.setTimeout(() => closeRef.current?.focus(), 60);
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === "Escape") close(); };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previous;
      window.clearTimeout(timer);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [close]);

  return (
    <div className={`strategy-overlay${closing ? " is-closing" : ""}`} role="presentation" onClick={(event) => event.target === event.currentTarget && close()}>
      {value.kind === "opportunity"
        ? <OpportunityDetail item={value.item} closeRef={closeRef} onClose={close} />
        : <BenchmarkDetail item={value.item} closeRef={closeRef} onClose={close} />}
    </div>
  );
}

function OpportunityDetail({ closeRef, item, onClose }: { closeRef: RefObject<HTMLButtonElement | null>; item: Opportunity; onClose: () => void }) {
  return (
    <section className="strategy-modal opportunity-detail" role="dialog" aria-modal="true" aria-labelledby="opportunity-detail-title">
      <StrategyModalHeader closeRef={closeRef} eyebrow="Oportunidad accionable" onClose={onClose} title={item.title}>
        {item.priority && <StrategyTag tone={priorityTone(item.priority)}>{prettyLabel(item.priority)}</StrategyTag>}
        {item.category !== "General" && <StrategyTag>{prettyLabel(item.category)}</StrategyTag>}
        {item.impact && <StrategyTag tone="impact">Impacto {prettyLabel(item.impact)}</StrategyTag>}
      </StrategyModalHeader>
      <div className="strategy-modal__content">
        {item.problem && <DetailSection icon={<Eye size={17} />} title="Diagnostico"><p>{item.problem}</p></DetailSection>}
        {item.why && <DetailSection icon={<Lightbulb size={17} />} title="Por que importa"><p>{item.why}</p></DetailSection>}
        {item.action && <DetailSection accent icon={<Target size={17} />} title="Accion recomendada"><p className="strategy-emphasis">{item.action}</p></DetailSection>}
        {(item.impact || item.ease || item.timeframe || item.result) && (
          <div className="strategy-detail-metrics">
            {item.impact && <DetailMetric label="Impacto" value={item.impact} />}
            {item.ease && <DetailMetric label="Ejecucion" value={item.ease} />}
            {item.timeframe && <DetailMetric label="Momento" value={item.timeframe} />}
            {item.result && <DetailMetric label="Resultado" value={item.result} />}
          </div>
        )}
        {item.content.length > 0 && <DetailSection icon={<Layers3 size={17} />} title="Contenidos sugeridos"><NumberedIdeas items={item.content} /></DetailSection>}
        {item.evidence.length > 0 && <DetailSection icon={<BarChart3 size={17} />} title="Evidencia utilizada"><ChipList items={item.evidence} /></DetailSection>}
        {item.risks.length > 0 && <DetailSection icon={<TriangleAlert size={17} />} title="Riesgos y cuidados"><SimpleList items={item.risks} /></DetailSection>}
        {item.nextStep && <NextAction text={item.nextStep} />}
      </div>
    </section>
  );
}

function BenchmarkDetail({ closeRef, item, onClose }: { closeRef: RefObject<HTMLButtonElement | null>; item: Benchmark; onClose: () => void }) {
  const isCaution = /failure|fallo|riesgo|debil/i.test(item.type);
  return (
    <section className="strategy-modal benchmark-detail" role="dialog" aria-modal="true" aria-labelledby="benchmark-detail-title">
      <StrategyModalHeader closeRef={closeRef} eyebrow="Ficha comparativa" onClose={onClose} title={item.title}>
        <StrategyTag tone={isCaution ? "warning" : "analytical"}>{prettyLabel(item.type)}</StrategyTag>
        {item.relevance && <StrategyTag>Relevancia {prettyLabel(item.relevance)}</StrategyTag>}
        {item.format && <StrategyTag tone="soft">{item.format}</StrategyTag>}
      </StrategyModalHeader>
      <div className="strategy-modal__content">
        {item.observed && <DetailSection icon={<Eye size={17} />} title="Que se observo"><p>{item.observed}</p></DetailSection>}
        <div className="benchmark-comparison">
          {(item.works || item.why) && (
            <article className="benchmark-comparison__side is-market">
              <span>Lo que funciona</span>
              {item.works && <p>{item.works}</p>}
              {item.why && <small>{item.why}</small>}
            </article>
          )}
          {(item.learning || item.adapt) && (
            <article className="benchmark-comparison__side is-client">
              <span>Lo que puedes hacer</span>
              {item.learning && <p>{item.learning}</p>}
              {item.adapt && <small>{item.adapt}</small>}
            </article>
          )}
        </div>
        {(item.adapt || item.avoid) && (
          <div className="benchmark-decisions">
            {item.adapt && <DecisionBlock icon={<CheckCircle2 size={16} />} label="Adaptar" text={item.adapt} tone="positive" />}
            {item.avoid && <DecisionBlock icon={<ShieldAlert size={16} />} label="Evitar" text={item.avoid} tone="warning" />}
          </div>
        )}
        {item.gap && <DetailSection accent icon={<Target size={17} />} title="Oportunidad abierta"><p className="strategy-emphasis">{item.gap}</p></DetailSection>}
        {item.differential && <DetailSection icon={<Sparkles size={17} />} title="Diferencial recomendado"><p>{item.differential}</p></DetailSection>}
        {item.ideas.length > 0 && <DetailSection icon={<Lightbulb size={17} />} title="Ideas derivadas"><NumberedIdeas items={item.ideas} /></DetailSection>}
        {(item.metrics.length > 0 || item.engagement || item.platform) && (
          <DetailSection icon={<BarChart3 size={17} />} title="Datos comparativos">
            <ChipList items={[...item.metrics, item.engagement, item.platform].filter(Boolean)} />
          </DetailSection>
        )}
      </div>
    </section>
  );
}

function StrategyModalHeader({ children, closeRef, eyebrow, onClose, title }: { children: ReactNode; closeRef: RefObject<HTMLButtonElement | null>; eyebrow: string; onClose: () => void; title: string }) {
  return (
    <header className="strategy-modal__header">
      <div className="strategy-modal__topline">
        <div className="strategy-tags">{children}</div>
        <button ref={closeRef} type="button" onClick={onClose} aria-label="Cerrar"><X size={20} /></button>
      </div>
      <div><p className="eyebrow">{eyebrow}</p><h2>{title}</h2></div>
    </header>
  );
}

function DetailSection({ accent = false, children, icon, title }: { accent?: boolean; children: ReactNode; icon: ReactNode; title: string }) {
  return <section className={`strategy-detail-section${accent ? " is-accent" : ""}`}><header><span>{icon}</span><h3>{title}</h3></header><div>{children}</div></section>;
}

function DecisionBlock({ icon, label, text, tone }: { icon: ReactNode; label: string; text: string; tone: string }) {
  return <article className={`benchmark-decision is-${tone}`}><header>{icon}<span>{label}</span></header><p>{text}</p></article>;
}

function RoadmapList({ icon, items, success = false, title }: { icon: ReactNode; items: string[]; success?: boolean; title: string }) {
  return <section className={`roadmap-list${success ? " is-success" : ""}`}><header>{icon}<h4>{title}</h4></header><ol>{items.map((item, index) => <li key={`${item}-${index}`}><span>{success ? <CheckCircle2 size={14} /> : index + 1}</span><p>{item}</p></li>)}</ol></section>;
}

function RoadmapInfo({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return <div className="roadmap-info">{icon}<span>{label}</span><p>{value}</p></div>;
}

function ComparisonMini({ highlight = false, label, value }: { highlight?: boolean; label: string; value: string }) {
  return <div className={highlight ? "is-highlight" : ""}><span>{label}</span><p>{value}</p></div>;
}

function SummaryMetric({ icon, label, value }: { icon: ReactNode; label: string; value: number }) {
  return <div className="strategy-summary-metric">{icon}<strong>{value}</strong><span>{label}</span></div>;
}

function InlineMetric({ label, value }: { label: string; value: string }) {
  return <div><span>{label}</span><strong>{prettyLabel(value)}</strong></div>;
}

function DetailMetric({ label, value }: { label: string; value: string }) {
  return <div><span>{label}</span><strong>{prettyLabel(value)}</strong></div>;
}

function StrategyTag({ children, tone = "default" }: { children: ReactNode; tone?: string }) {
  return <span className={`strategy-tag is-${tone}`}>{children}</span>;
}

function FilterBar({ active, allLabel, items, onChange, source }: { active: string; allLabel: string; items: string[]; onChange: (value: string) => void; source: string[] }) {
  return (
    <nav className="strategy-filters" aria-label="Filtros">
      <FilterButton active={active === allLabel} count={source.length} label={allLabel} onClick={() => onChange(allLabel)} />
      {items.map((item) => <FilterButton active={active === item} count={source.filter((value) => value === item).length} key={item} label={prettyLabel(item)} onClick={() => onChange(item)} />)}
    </nav>
  );
}

function FilterButton({ active, count, label, onClick }: { active: boolean; count: number; label: string; onClick: () => void }) {
  return <button className={active ? "is-active" : ""} type="button" onClick={onClick} aria-pressed={active}><span>{label}</span><small>{count}</small></button>;
}

function NumberedIdeas({ items }: { items: string[] }) {
  return <div className="strategy-numbered-list">{items.map((item, index) => <article key={`${item}-${index}`}><span>{String(index + 1).padStart(2, "0")}</span><p>{item}</p></article>)}</div>;
}

function ChipList({ items }: { items: string[] }) {
  return <div className="strategy-chip-list">{items.map((item, index) => <span key={`${item}-${index}`}>{prettyLabel(item)}</span>)}</div>;
}

function SimpleList({ items }: { items: string[] }) {
  return <ul className="strategy-simple-list">{items.map((item, index) => <li key={`${item}-${index}`}>{item}</li>)}</ul>;
}

function NextAction({ text }: { text: string }) {
  return <section className="strategy-next-action"><span><Zap size={15} />Proximo paso</span><p>{text}</p></section>;
}

function ModuleEmpty({ title }: { title: string }) {
  return <article className="empty-state"><strong>{title}</strong><p>Importa el output desde admin o revisa el contenido del modulo mas tarde.</p></article>;
}

function normalizeOpportunity(item: LikeliOutputItem, index: number) {
  const problem = textOf(pick(item, opportunityAliases.problem));
  const action = textOf(pick(item, opportunityAliases.action));
  return {
    key: String(item.id || `opportunity-${index}`),
    title: textOf(pick(item, opportunityAliases.title)) || shortTitle(problem || action || "Oportunidad detectada"),
    category: textOf(pick(item, opportunityAliases.category)) || "General",
    problem,
    why: textOf(pick(item, opportunityAliases.why)),
    action,
    impact: textOf(pick(item, opportunityAliases.impact)),
    ease: textOf(pick(item, opportunityAliases.ease)),
    priority: textOf(pick(item, opportunityAliases.priority)),
    timeframe: textOf(pick(item, opportunityAliases.timeframe)),
    content: listOf(pick(item, opportunityAliases.content)),
    risks: listOf(pick(item, opportunityAliases.risks)),
    nextStep: textOf(pick(item, opportunityAliases.nextStep)),
    result: textOf(pick(item, opportunityAliases.result)),
    evidence: listOf(pick(item, opportunityAliases.evidence)),
  };
}

function normalizeBenchmark(item: LikeliOutputItem, index: number) {
  const observed = textOf(pick(item, benchmarkAliases.observed));
  const learning = textOf(pick(item, benchmarkAliases.learning));
  return {
    key: String(item.id || `benchmark-${index}`),
    title: textOf(pick(item, benchmarkAliases.title)) || shortTitle(observed || learning || "Benchmark"),
    type: textOf(pick(item, benchmarkAliases.type)) || "General",
    observed,
    works: textOf(pick(item, benchmarkAliases.works)),
    why: textOf(pick(item, benchmarkAliases.why)),
    learning,
    adapt: textOf(pick(item, benchmarkAliases.adapt)),
    avoid: textOf(pick(item, benchmarkAliases.avoid)),
    gap: textOf(pick(item, benchmarkAliases.gap)),
    relevance: textOf(pick(item, benchmarkAliases.relevance)),
    differential: textOf(pick(item, benchmarkAliases.differential)),
    ideas: listOf(pick(item, benchmarkAliases.ideas)),
    metrics: listOf(pick(item, benchmarkAliases.metrics)),
    engagement: textOf(pick(item, benchmarkAliases.engagement)),
    format: textOf(pick(item, benchmarkAliases.format)),
    platform: textOf(pick(item, benchmarkAliases.platform)),
  };
}

function normalizeRoadmapStep(item: LikeliOutputItem, index: number) {
  const instructions = listOf(pick(item, roadmapAliases.instructions));
  return {
    key: String(item.id || `roadmap-${index}`),
    title: textOf(pick(item, roadmapAliases.title)) || shortTitle(instructions[0] || `Fase ${index + 1}`),
    phase: textOf(pick(item, roadmapAliases.phase)) || `Fase ${index + 1}`,
    objective: textOf(pick(item, roadmapAliases.objective)),
    priority: textOf(pick(item, roadmapAliases.priority)),
    type: textOf(pick(item, roadmapAliases.type)),
    deliverable: textOf(pick(item, roadmapAliases.deliverable)),
    instructions,
    resources: listOf(pick(item, roadmapAliases.resources)),
    result: textOf(pick(item, roadmapAliases.result)),
    success: listOf(pick(item, roadmapAliases.success)),
    status: textOf(pick(item, roadmapAliases.status)),
    notes: textOf(pick(item, roadmapAliases.notes)),
    related: [
      textOf(pick(item, roadmapAliases.relatedIdea)),
      textOf(pick(item, roadmapAliases.relatedTrend)),
      textOf(pick(item, roadmapAliases.relatedOpportunity)),
      textOf(pick(item, roadmapAliases.relatedBenchmark)),
    ].filter(Boolean),
  };
}

function pick(item: LikeliOutputItem, keys: readonly string[]) {
  for (const key of keys) {
    const value = item[key];
    if (hasValue(value)) return value;
  }
  return undefined;
}

function hasValue(value: unknown) {
  if (value == null || value === "") return false;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === "object") return Object.keys(value as object).length > 0;
  return true;
}

function textOf(value: unknown): string {
  if (!hasValue(value)) return "";
  if (Array.isArray(value)) return value.map(textOf).filter(Boolean).join(" · ");
  if (typeof value === "object") return Object.entries(value as Record<string, unknown>).filter(([, entry]) => hasValue(entry)).map(([key, entry]) => `${prettyLabel(key)}: ${textOf(entry)}`).join(" · ");
  return String(value).trim();
}

function listOf(value: unknown): string[] {
  if (!hasValue(value)) return [];
  if (Array.isArray(value)) return value.flatMap((entry) => listOf(entry)).filter(Boolean);
  if (typeof value === "object") return Object.entries(value as Record<string, unknown>).filter(([, entry]) => hasValue(entry)).map(([key, entry]) => `${prettyLabel(key)}: ${textOf(entry)}`);
  return String(value).split(/\n|;|(?:\s*[•]\s*)/).map((entry) => entry.replace(/^[-*]\s*/, "").trim()).filter(Boolean);
}

function unique(values: string[]) {
  return Array.from(new Set(values.filter(Boolean))).sort((a, b) => a.localeCompare(b, "es"));
}

function shortTitle(value: string) {
  const sentence = value.split(/[.!?]/)[0]?.trim() || value;
  return sentence.length > 82 ? `${sentence.slice(0, 79).trim()}…` : sentence;
}

function prettyLabel(value: string) {
  const normalized = value.trim().toLowerCase();
  const translations: Record<string, string> = {
    high: "Alta", medium: "Media", low: "Baja",
    success_case: "Caso de exito", failure_case: "Caso de alerta",
    pattern: "Patron", evidence_based: "Basado en evidencia",
  };
  if (translations[normalized]) return translations[normalized];
  return value.replace(/[_-]+/g, " ").replace(/([a-z])([A-Z])/g, "$1 $2").replace(/^\w/, (letter) => letter.toUpperCase());
}

function prettyPhase(value: string) {
  const trimmed = value.trim();
  return /^\d+$/.test(trimmed) ? `Semana ${trimmed}` : prettyLabel(trimmed);
}

function isHigh(value: string) {
  return /alt|high|critical|urgente/i.test(value);
}

function priorityTone(value: string) {
  if (isHigh(value)) return "high";
  if (/med|medium/i.test(value)) return "medium";
  if (/baj|low/i.test(value)) return "low";
  return "default";
}
