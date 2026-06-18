"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import {
  ArrowRight,
  CalendarDays,
  Camera,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Film,
  Gauge,
  Layers3,
  Link2,
  MessageCircle,
  Mic2,
  Play,
  Quote,
  Target,
  Video,
  X,
  XCircle,
  Zap,
} from "lucide-react";
import { plans } from "@/data/plans";
import type { EnrichedScript } from "@/lib/likeli-output/enrichment";
import type { ClientPortal, PortalPlanId } from "@/types/likeliPortalOutput";

const scriptAliases = {
  title: ["title", "titulo", "name", "nombre", "script", "guion"],
  format: ["format", "formato"],
  objective: ["objective", "objetivo", "goal"],
  duration: ["duration", "duracion", "durationSeconds", "estimatedDuration"],
  hook: ["hook", "openingHook", "structureHook"],
  structure: ["structure", "estructura", "scenes", "escenas", "steps", "pasos", "timestamps", "sceneSequence"],
  overlay: ["overlayText", "textoPantalla", "onScreenText", "screenTexts", "textsOnScreen"],
  voiceover: ["voiceover", "vozEnOff", "voiceOver", "dialogue", "dialogo", "narration"],
  shots: ["shots", "tomas", "resources", "recursos", "clips"],
  caption: ["caption", "recommendedCaption"],
  cta: ["cta", "recommendedCta", "recommendedCTA", "finalCta", "finalCTA"],
  visual: ["visualRecommendation", "recomendacionVisual", "visualStyle", "direction"],
  prediction: ["prediction", "prediccion", "expectedPerformance"],
  score: ["score", "likeliScore", "pieceScore"],
  strengths: ["strengths", "fortalezas"],
  weaknesses: ["weaknesses", "debilidades"],
  priority: ["priority", "prioridad"],
  recommendedDate: ["recommendedDate", "fechaRecomendada", "publishDate", "fechaPublicacion"],
  recommendedTime: ["recommendedTime", "horarioRecomendado"],
} as const;

const planCards = [
  {
    id: "signals" as const,
    name: "Signals",
    description: "Base para negocios que crean su propio contenido y necesitan saber qué publicar.",
    price: "199.000 COP / mes",
    link: "https://wa.link/tv4i85",
    includes: [
      "20 ideas de contenido", "20 hooks", "20 captions", "20 CTAs", "4 tendencias destacadas",
      "4 oportunidades detectadas", "Formato recomendado por idea", "Horario recomendado",
      "Duración recomendada", "Inteligencia segmentada", "Actualizaciones periódicas", "Acceso a recursos del plan",
    ],
    excludes: ["Soporte personalizado", "Revisión de contenido", "Revisión de videos", "Guiones completos", "Predicciones", "Benchmarking"],
  },
  {
    id: "signals-pro" as const,
    name: "Signals Pro",
    description: "Sistema para descubrir qué publicar y validar cuáles ideas tienen mayor potencial antes de ejecutarlas.",
    price: "599.000 COP / mes",
    link: "https://wa.link/7myafm",
    recommended: true,
    includes: [
      "Todo lo de Signals", "30 ideas de contenido", "30 hooks", "30 captions", "30 CTAs", "12 guiones completos",
      "Predicción de rendimiento por guion", "Puntuación Likeli", "Análisis de fortalezas", "Análisis de debilidades",
      "Comparación con contenido exitoso", "Biblioteca de casos de éxito", "Biblioteca de casos de fracaso",
      "Benchmark de competencia", "Benchmark de industria", "Calendario de contenido de 30 días",
      "Priorización de ideas", "Roadmap mensual", "Hasta 4 revisiones de contenido al mes",
      "Hasta 4 revisiones de videos terminados al mes",
    ],
    excludes: [],
  },
  {
    id: "signals-elite" as const,
    name: "Signals Elite",
    description: "Inteligencia avanzada con apoyo operativo para acelerar la ejecución del contenido.",
    price: "1.199.000 COP / mes",
    link: "https://wa.link/kj642u",
    includes: [
      "Todo lo de Signals Pro", "40 ideas de contenido", "40 hooks", "40 captions", "40 CTAs", "16 guiones completos",
      "Hasta 8 revisiones de contenido al mes", "Hasta 8 revisiones de videos terminados al mes",
      "Edición de hasta 10 videos mensuales", "Atención prioritaria", "Recursos avanzados Likeli",
      "Acceso ampliado a investigaciones, frameworks y recursos exclusivos",
    ],
    excludes: [],
  },
];

type StudioScript = ReturnType<typeof normalizeScript>;
type ScheduledScript = StudioScript & { date: Date; week: number };

export function ScriptStudioView({
  entries,
  ideaCount,
  planId,
}: {
  entries: EnrichedScript[];
  ideaCount: number;
  planId: PortalPlanId;
}) {
  const scripts = useMemo(() => selectScripts(entries.map(normalizeScript), planId), [entries, planId]);
  const [selected, setSelected] = useState<StudioScript | null>(null);

  if (!scripts.length) {
    return <ProductionEmpty title="Sin guiones disponibles en este output" />;
  }

  return (
    <>
      <section className="script-studio">
        <ProductionHeader scripts={scripts} ideaCount={ideaCount} planId={planId} />
        <div className="studio-script-grid">
          {scripts.map((script, index) => (
            <ScriptStudioCard index={index} key={script.key} onOpen={() => setSelected(script)} script={script} />
          ))}
        </div>
      </section>
      {selected && <ScriptDetailOverlay script={selected} onDismiss={() => setSelected(null)} />}
    </>
  );
}

export function ExecutionCalendarView({
  client,
  entries,
  planId,
}: {
  client: ClientPortal;
  entries: EnrichedScript[];
  planId: PortalPlanId;
}) {
  const scripts = useMemo(() => selectScripts(entries.map(normalizeScript), planId), [entries, planId]);
  const startDate = useMemo(() => resolvePortalStartDate(client), [client]);
  const scheduled = useMemo(() => scheduleScripts(scripts, startDate), [scripts, startDate]);
  const weeks = useMemo(() => groupByWeek(scheduled), [scheduled]);
  const [selected, setSelected] = useState<StudioScript | null>(null);

  if (!scripts.length) return <ProductionEmpty title="No hay guiones para calendarizar" />;

  const endDate = addDays(startDate, 29);
  return (
    <>
      <section className="execution-calendar">
        <CalendarHeader endDate={endDate} planId={planId} scheduled={scheduled} startDate={startDate} />
        <div className="calendar-weeks">
          {weeks.map(({ items, week }) => (
            <section className="calendar-week" key={week}>
              <header>
                <span>Semana {week}</span>
                <small>{formatShortDate(items[0].date)} — {formatShortDate(items[items.length - 1].date)}</small>
              </header>
              <div className="calendar-week__items">
                {items.map((item) => <CalendarScriptCard item={item} key={`${item.key}-${item.date.toISOString()}`} onOpen={() => setSelected(item)} />)}
              </div>
            </section>
          ))}
        </div>
      </section>
      {selected && <ScriptDetailOverlay compact script={selected} onDismiss={() => setSelected(null)} />}
    </>
  );
}

export function PlanControlCenter({ client }: { client: ClientPortal }) {
  const currentPlan = normalizePlanId(client.activePlan || readPlanCandidate(client));
  const current = planCards.find((plan) => plan.id === currentPlan);
  return (
    <section className="plan-control-center">
      <header className="plan-control-header" data-tour-id="module-plans">
        <div>
          <p className="eyebrow">Plan control center</p>
          <h2>Elige el nivel de inteligencia que quieres activar</h2>
          {current && <p>Tu plan actual es <strong>{current.name}</strong>. Puedes cambiar a cualquier otro plan desde este comparador.</p>}
        </div>
        {current && <div className="current-plan-orbit"><span>Plan actual</span><strong>{current.name}</strong></div>}
      </header>

      <div className="plan-comparison-grid">
        {planCards.map((plan) => {
          const active = plan.id === currentPlan;
          return (
            <article className={`premium-plan-card${active ? " is-current" : ""}${plan.recommended ? " is-recommended" : ""}`} key={plan.id}>
              <header>
                <div className="plan-card-badges">
                  {active && <span className="plan-badge is-current">Plan actual</span>}
                  {plan.recommended && <span className="plan-badge is-recommended">Recomendado</span>}
                </div>
                <h3>{plan.name}</h3>
                <p>{plan.description}</p>
                <strong className="plan-price">{plan.price}</strong>
              </header>

              <div className="plan-feature-group">
                <h4>Incluye</h4>
                <ul>{plan.includes.map((feature) => <li key={feature}><Check size={14} />{feature}</li>)}</ul>
              </div>

              {plan.excludes.length > 0 && (
                <details className="plan-exclusions">
                  <summary>No incluye <ChevronDown size={15} /></summary>
                  <ul>{plan.excludes.map((feature) => <li key={feature}><XCircle size={14} />{feature}</li>)}</ul>
                </details>
              )}

              {active
                ? <div className="plan-current-state"><CheckCircle2 size={17} />Activo</div>
                : <a className="plan-acquire-button" href={plan.link} target="_blank" rel="noreferrer">Adquirir este plan <ArrowRight size={16} /></a>}
            </article>
          );
        })}
      </div>
    </section>
  );
}

function ProductionHeader({ ideaCount, planId, scripts }: { ideaCount: number; planId: PortalPlanId; scripts: StudioScript[] }) {
  return (
    <header className="production-header">
      <div className="production-header__icon"><Film size={28} /><span /></div>
      <div>
        <p className="eyebrow">Script studio</p>
        <h3>Guiones conectados a tus ideas de mayor potencial</h3>
        <p>Estas piezas fueron seleccionadas para ejecución y ya tienen una estructura lista para producir.</p>
      </div>
      <div className="production-header__metrics">
        <ProductionMetric label="Guiones listos" value={scripts.length} />
        <ProductionMetric label="Ideas analizadas" value={ideaCount} />
        <ProductionMetric label="Limite del plan" value={scriptLimit(planId)} />
      </div>
    </header>
  );
}

function CalendarHeader({ endDate, planId, scheduled, startDate }: { endDate: Date; planId: PortalPlanId; scheduled: ScheduledScript[]; startDate: Date }) {
  const weekCount = Math.max(1, new Set(scheduled.map((item) => item.week)).size);
  return (
    <header className="execution-calendar-header">
      <div className="calendar-range-icon"><CalendarDays size={27} /></div>
      <div>
        <p className="eyebrow">Execution calendar</p>
        <h3>Calendario de 30 dias basado en guiones</h3>
        <p>{formatLongDate(startDate)} — {formatLongDate(endDate)}</p>
      </div>
      <div className="production-header__metrics">
        <ProductionMetric label="Calendarizados" value={scheduled.length} />
        <ProductionMetric label="Promedio semanal" value={Number((scheduled.length / weekCount).toFixed(1))} />
        <ProductionMetric label="Plan" value={plans[planId].level} text />
      </div>
    </header>
  );
}

function ScriptStudioCard({ index, onOpen, script }: { index: number; onOpen: () => void; script: StudioScript }) {
  return (
    <button className="studio-script-card" data-tour-id={index === 0 ? "script-card" : undefined} type="button" onClick={onOpen} aria-label={`Abrir guion: ${script.title}`}>
      <header>
        <div className="production-tags">
          {script.format && <ProductionTag>{script.format}</ProductionTag>}
          {script.priority && <ProductionTag tone="priority">{prettyLabel(script.priority)}</ProductionTag>}
          {script.score && <ProductionTag tone="score">Score {script.score}</ProductionTag>}
        </div>
        <span className="studio-script-card__number">{String(index + 1).padStart(2, "0")}</span>
      </header>

      <div className="studio-script-card__title">
        <h3>{script.title}</h3>
        {script.objective && <p>{script.objective}</p>}
      </div>

      {script.ideaTitle && (
        <div className="script-idea-link">
          <Link2 size={15} />
          <span>Idea conectada</span>
          <strong>{script.ideaTitle}</strong>
        </div>
      )}

      <div className="studio-script-card__meta">
        {script.duration && <ProductionMeta icon={<Clock3 size={14} />} label="Duracion" value={formatDuration(script.duration)} />}
        {script.prediction && <ProductionMeta icon={<Gauge size={14} />} label="Potencial" value={script.prediction} />}
      </div>

      {script.cta && <p className="studio-script-card__cta"><MessageCircle size={14} />{script.cta}</p>}
      <footer><strong>Preparar grabacion</strong><Play size={15} /></footer>
    </button>
  );
}

function CalendarScriptCard({ item, onOpen }: { item: ScheduledScript; onOpen: () => void }) {
  return (
    <button className="calendar-script-card" type="button" onClick={onOpen}>
      <div className="calendar-script-card__date">
        <strong>{item.date.getDate()}</strong>
        <span>{weekday(item.date)}</span>
      </div>
      <div className="calendar-script-card__content">
        <div className="production-tags">
          {item.format && <ProductionTag>{item.format}</ProductionTag>}
          {item.priority && <ProductionTag tone="priority">{prettyLabel(item.priority)}</ProductionTag>}
        </div>
        <h4>{item.title}</h4>
        {item.ideaTitle && <p><Link2 size={13} />{item.ideaTitle}</p>}
      <div className="calendar-script-card__footer">
          <span>{item.recommendedTime || item.cta || item.objective}</span>
          <strong>Guion listo</strong>
        </div>
      </div>
    </button>
  );
}

function ScriptDetailOverlay({ compact = false, onDismiss, script }: { compact?: boolean; onDismiss: () => void; script: StudioScript }) {
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
    <div className={`production-overlay${closing ? " is-closing" : ""}`} role="presentation" onClick={(event) => event.target === event.currentTarget && close()}>
      <section className={`script-detail-modal${compact ? " is-compact" : ""}`} role="dialog" aria-modal="true" aria-labelledby="script-detail-title">
        <header className="script-detail-modal__header">
          <div className="script-detail-modal__topline">
            <div className="production-tags">
              {script.format && <ProductionTag>{script.format}</ProductionTag>}
              {script.priority && <ProductionTag tone="priority">{prettyLabel(script.priority)}</ProductionTag>}
              {script.score && <ProductionTag tone="score">Score {script.score}</ProductionTag>}
            </div>
            <button ref={closeRef} type="button" onClick={close} aria-label="Cerrar guion"><X size={20} /></button>
          </div>
          <div>
            <p className="eyebrow">{compact ? "Guion calendarizado" : "Guion listo para producir"}</p>
            <h2 id="script-detail-title">{script.title}</h2>
            <div className="script-detail-summary">
              {script.duration && <span><Clock3 size={14} />{formatDuration(script.duration)}</span>}
              {script.prediction && <span><Gauge size={14} />{script.prediction}</span>}
              {script.recommendedTime && <span><CalendarDays size={14} />{script.recommendedTime}</span>}
            </div>
          </div>
        </header>

        <div className="script-detail-modal__content">
          {script.ideaTitle && (
            <section className="script-base-idea">
              <Link2 size={18} />
              <div><span>Idea base del guion</span><h3>{script.ideaTitle}</h3>{script.ideaInsight && <p>{script.ideaInsight}</p>}</div>
            </section>
          )}
          {script.objective && <ScriptSection icon={<Target size={17} />} title="Objetivo"><p>{script.objective}</p></ScriptSection>}
          {script.hook && <ScriptSection accent icon={<Zap size={17} />} title="Hook inicial"><blockquote>{script.hook}</blockquote></ScriptSection>}
          {script.steps.length > 0 && <ScriptSection icon={<Layers3 size={17} />} title="Estructura del guion"><ScriptSteps steps={script.steps} /></ScriptSection>}
          {(script.overlay.length > 0 || script.voiceover) && (
            <div className="script-copy-grid">
              {script.overlay.length > 0 && <ScriptCopyBlock icon={<Quote size={16} />} label="Texto en pantalla" items={script.overlay} />}
              {script.voiceover && <ScriptCopyBlock icon={<Mic2 size={16} />} label="Voz en off o dialogo" items={[script.voiceover]} />}
            </div>
          )}
          {script.shots.length > 0 && <ScriptSection icon={<Camera size={17} />} title="Tomas necesarias"><ProductionChips items={script.shots} /></ScriptSection>}
          {script.caption && <ScriptSection icon={<Quote size={17} />} title="Caption relacionado"><p className="script-caption-copy">{script.caption}</p></ScriptSection>}
          {script.cta && <ScriptSection accent icon={<MessageCircle size={17} />} title="CTA recomendado"><p className="script-cta-copy">{script.cta}</p></ScriptSection>}
          {script.visual && <ScriptSection icon={<Video size={17} />} title="Recomendacion visual"><p>{script.visual}</p></ScriptSection>}
          {(script.strengths.length > 0 || script.weaknesses.length > 0) && (
            <div className="script-analysis-grid">
              {script.strengths.length > 0 && <AnalysisBlock label="Fortalezas" items={script.strengths} positive />}
              {script.weaknesses.length > 0 && <AnalysisBlock label="Cuidados" items={script.weaknesses} />}
            </div>
          )}
          {(script.steps.length > 0 || script.overlay.length > 0 || script.shots.length > 0 || script.cta) && (
            <section className="production-checklist">
              <span><CheckCircle2 size={15} />Checklist de produccion</span>
              <div>
                {script.shots.length > 0 && <p><Check size={13} />Grabar tomas necesarias</p>}
                {script.overlay.length > 0 && <p><Check size={13} />Agregar textos en pantalla</p>}
                {script.steps.length > 0 && <p><Check size={13} />Seguir la secuencia del guion</p>}
                {script.cta && <p><Check size={13} />Cerrar con CTA</p>}
              </div>
            </section>
          )}
        </div>
      </section>
    </div>
  );
}

function ScriptSection({ accent = false, children, icon, title }: { accent?: boolean; children: ReactNode; icon: ReactNode; title: string }) {
  return <section className={`script-detail-section${accent ? " is-accent" : ""}`}><header><span>{icon}</span><h3>{title}</h3></header><div>{children}</div></section>;
}

function ScriptSteps({ steps }: { steps: Array<{ label: string; value: string }> }) {
  return <ol className="production-script-steps">{steps.map((step, index) => <li key={`${step.label}-${index}`}><span>{String(index + 1).padStart(2, "0")}</span><div><strong>{step.label}</strong>{step.value && <p>{step.value}</p>}</div></li>)}</ol>;
}

function ScriptCopyBlock({ icon, items, label }: { icon: ReactNode; items: string[]; label: string }) {
  return <article>{icon}<span>{label}</span><div>{items.map((item, index) => <p key={`${item}-${index}`}>{item}</p>)}</div></article>;
}

function AnalysisBlock({ items, label, positive = false }: { items: string[]; label: string; positive?: boolean }) {
  return <article className={positive ? "is-positive" : "is-warning"}><h4>{positive ? <CheckCircle2 size={15} /> : <XCircle size={15} />}{label}</h4><ul>{items.map((item, index) => <li key={`${item}-${index}`}>{item}</li>)}</ul></article>;
}

function ProductionMetric({ label, text = false, value }: { label: string; text?: boolean; value: number | string }) {
  return <div><strong className={text ? "is-text" : ""}>{value}</strong><span>{label}</span></div>;
}

function ProductionTag({ children, tone = "default" }: { children: ReactNode; tone?: string }) {
  return <span className={`production-tag is-${tone}`}>{children}</span>;
}

function ProductionMeta({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return <div>{icon}<span>{label}</span><strong>{value}</strong></div>;
}

function ProductionChips({ items }: { items: string[] }) {
  return <div className="production-chip-list">{items.map((item, index) => <span key={`${item}-${index}`}>{item}</span>)}</div>;
}

function ProductionEmpty({ title }: { title: string }) {
  return <article className="empty-state"><strong>{title}</strong><p>Los guiones completos se muestran cuando existen dentro del output del portal.</p></article>;
}

function normalizeScript(entry: EnrichedScript, index: number) {
  const script = entry.script;
  const structure = asRecord(script.structure);
  const idea = entry.idea || asRecord(pick(script, ["idea", "sourceIdea", "parentIdea", "relatedIdea", "linkedIdea"]));
  const ideaTitle = textOf(pick(idea, ["title", "titulo", "name", "idea", "concept"])) || textOf(pick(script, ["ideaTitle", "tituloIdea", "ideaRelacionada"]));
  const hook = textOf(pick(script, scriptAliases.hook)) || textOf(pick(structure, ["hook", "opening", "apertura"])) || textOf(entry.hook?.hook);
  const cta = textOf(pick(script, scriptAliases.cta)) || textOf(pick(structure, ["cta", "finalCta", "finalCTA"])) || textOf(entry.cta?.cta);
  const score = textOf(pick(script, scriptAliases.score)) || textOf(entry.score);
  const prediction = textOf(pick(script, scriptAliases.prediction)) || textOf(entry.prediction?.expectedPerformance || entry.prediction?.title);
  return {
    key: String(script.id || `script-${index}`),
    title: textOf(pick(script, scriptAliases.title)) || ideaTitle || `Guion ${index + 1}`,
    ideaTitle,
    ideaInsight: textOf(pick(idea, ["objective", "objetivo", "concept", "concepto", "whyItShouldWork", "insight"])),
    format: textOf(pick(script, scriptAliases.format)),
    objective: textOf(pick(script, scriptAliases.objective)) || textOf(pick(idea, ["objective", "objetivo"])),
    duration: textOf(pick(script, scriptAliases.duration)),
    hook,
    steps: structuredItems(pick(script, scriptAliases.structure) || pick(structure, ["sceneSequence", "scenes", "steps"])),
    overlay: listOf(pick(script, scriptAliases.overlay) || pick(structure, ["onScreenText", "overlayText"])),
    voiceover: textOf(pick(script, scriptAliases.voiceover) || pick(structure, ["voiceover", "voiceOver", "dialogue"])),
    shots: listOf(pick(script, scriptAliases.shots)),
    caption: textOf(pick(script, scriptAliases.caption)) || textOf(entry.caption?.caption),
    cta,
    visual: textOf(pick(script, scriptAliases.visual)),
    prediction,
    score,
    strengths: listOf(pick(script, scriptAliases.strengths)),
    weaknesses: listOf(pick(script, scriptAliases.weaknesses)),
    priority: textOf(pick(script, scriptAliases.priority)) || textOf(entry.scoreLabel || entry.prioritization?.priority),
    recommendedDate: textOf(pick(script, scriptAliases.recommendedDate)),
    recommendedTime: textOf(pick(script, scriptAliases.recommendedTime)),
  };
}

function selectScripts(scripts: StudioScript[], planId: PortalPlanId) {
  const limit = scriptLimit(planId);
  return [...scripts]
    .sort((a, b) => priorityWeight(b.priority) - priorityWeight(a.priority) || numericScore(b.score) - numericScore(a.score))
    .slice(0, limit);
}

function scheduleScripts(scripts: StudioScript[], startDate: Date): ScheduledScript[] {
  const endDate = addDays(startDate, 29);
  const weekdays = Array.from({ length: 30 }, (_, offset) => addDays(startDate, offset)).filter((date) => date.getDay() !== 0);
  const used = new Set<string>();

  return scripts.map((script, index) => {
    const explicit = parseDate(script.recommendedDate);
    let date = explicit
      && explicit >= startDate
      && explicit <= endDate
      && explicit.getDay() !== 0
      && (explicit.getDay() !== 6 || isLightFormat(script.format))
      && !used.has(dateKey(explicit))
      ? explicit
      : null;
    if (!date) {
      const targetIndex = scripts.length === 1 ? 0 : Math.round(index * (weekdays.length - 1) / (scripts.length - 1));
      date = findAvailableDate(weekdays, targetIndex, used, isLightFormat(script.format));
    }
    used.add(dateKey(date));
    return { ...script, date, week: Math.floor(daysBetween(startDate, date) / 7) + 1 };
  }).sort((a, b) => a.date.getTime() - b.date.getTime());
}

function findAvailableDate(dates: Date[], targetIndex: number, used: Set<string>, allowSaturday: boolean) {
  for (let distance = 0; distance < dates.length; distance += 1) {
    for (const index of [targetIndex + distance, targetIndex - distance]) {
      const date = dates[index];
      if (!date || used.has(dateKey(date))) continue;
      if (date.getDay() === 6 && !allowSaturday) continue;
      return date;
    }
  }
  return dates[Math.min(targetIndex, dates.length - 1)];
}

function groupByWeek(items: ScheduledScript[]) {
  return Array.from(new Set(items.map((item) => item.week))).sort((a, b) => a - b).map((week) => ({ week, items: items.filter((item) => item.week === week) }));
}

function resolvePortalStartDate(client: ClientPortal) {
  const generated = asRecord(client.generatedOutput);
  const candidates = [
    client.createdAt,
    generated.createdAt,
    generated.creationDate,
    generated.fechaCreacion,
    generated.portalCreatedAt,
    generated.created_at,
    generated.created,
    generated.fecha_creacion,
    client.lastPaymentDate,
    client.lastUpdate,
    client.likeliOutput?.importedAt,
  ];
  for (const value of candidates) {
    const date = parseDate(textOf(value));
    if (date) return startOfDay(date);
  }
  return startOfDay(new Date());
}

function structuredItems(value: unknown): Array<{ label: string; value: string }> {
  if (!hasValue(value)) return [];
  if (Array.isArray(value)) {
    return value.map((entry, index) => {
      if (entry && typeof entry === "object") {
        const record = entry as Record<string, unknown>;
        return { label: textOf(record.title || record.label || record.step || record.scene) || `Paso ${index + 1}`, value: textOf(record.description || record.content || record.text || record.action) };
      }
      const text = textOf(entry);
      const match = text.match(/^([^:]{2,38}):\s*(.*)$/);
      return match ? { label: match[1], value: match[2] } : { label: `Paso ${index + 1}`, value: text };
    }).filter((entry) => entry.label || entry.value);
  }
  if (typeof value === "object") {
    const record = value as Record<string, unknown>;
    const sequence = pick(record, ["sceneSequence", "scenes", "steps", "pasos"]);
    if (sequence) return structuredItems(sequence);
    return Object.entries(record)
      .filter(([key, entry]) => hasValue(entry) && !["hook", "voiceover", "voiceOver", "onScreenText", "cta"].includes(key))
      .map(([key, entry]) => ({ label: prettyLabel(key), value: textOf(entry) }));
  }
  return String(value).split(/\n+/).filter(Boolean).map((entry, index) => ({ label: `Paso ${index + 1}`, value: entry.trim() }));
}

function scriptLimit(planId: PortalPlanId) {
  return planId === "signals-elite" ? 16 : planId === "signals-pro" ? 12 : 0;
}

function readPlanCandidate(client: ClientPortal) {
  const generated = asRecord(client.generatedOutput);
  return textOf(generated.plan || generated.currentPlan || generated.activePlan || generated.planName || generated.subscriptionPlan || generated.tier || generated.tipoPlan);
}

function normalizePlanId(value: unknown): PortalPlanId | "" {
  const normalized = String(value || "").trim().toLowerCase().replace(/[_\s]+/g, "-");
  if (["signals", "signal", "base"].includes(normalized)) return "signals";
  if (["signals-pro", "pro"].includes(normalized)) return "signals-pro";
  if (["signals-elite", "elite"].includes(normalized)) return "signals-elite";
  return "";
}

function priorityWeight(value: string) {
  if (/alt|high|critical/i.test(value)) return 3;
  if (/med|medium/i.test(value)) return 2;
  if (/baj|low/i.test(value)) return 1;
  return 0;
}

function numericScore(value: string) {
  const number = Number.parseFloat(value);
  return Number.isFinite(number) ? number : 0;
}

function isLightFormat(value: string) {
  return /historia|story|stories|ligero|light/i.test(value);
}

function parseDate(value: string) {
  if (!value) return null;
  const date = new Date(/^\d{4}-\d{2}-\d{2}$/.test(value) ? `${value}T00:00:00` : value);
  return Number.isNaN(date.getTime()) ? null : startOfDay(date);
}

function startOfDay(value: Date) {
  const date = new Date(value);
  date.setHours(0, 0, 0, 0);
  return date;
}

function addDays(value: Date, days: number) {
  const date = new Date(value);
  date.setDate(date.getDate() + days);
  return date;
}

function daysBetween(a: Date, b: Date) {
  return Math.round((startOfDay(b).getTime() - startOfDay(a).getTime()) / 86400000);
}

function dateKey(value: Date) {
  return `${value.getFullYear()}-${value.getMonth()}-${value.getDate()}`;
}

function weekday(value: Date) {
  return new Intl.DateTimeFormat("es-CO", { weekday: "short" }).format(value).replace(".", "");
}

function formatShortDate(value: Date) {
  return new Intl.DateTimeFormat("es-CO", { day: "numeric", month: "short" }).format(value).replace(".", "");
}

function formatLongDate(value: Date) {
  return new Intl.DateTimeFormat("es-CO", { day: "numeric", month: "long", year: "numeric" }).format(value);
}

function formatDuration(value: string) {
  return /^\d+$/.test(value) ? `${value} segundos` : value;
}

function pick(item: Record<string, unknown>, keys: readonly string[]) {
  for (const key of keys) if (hasValue(item[key])) return item[key];
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
  if (typeof value === "object") return Object.values(value as Record<string, unknown>).map(textOf).filter(Boolean).join(" · ");
  return String(value).trim();
}

function listOf(value: unknown): string[] {
  if (!hasValue(value)) return [];
  if (Array.isArray(value)) return value.flatMap(listOf).filter(Boolean);
  if (typeof value === "object") return Object.entries(value as Record<string, unknown>).filter(([, entry]) => hasValue(entry)).map(([key, entry]) => `${prettyLabel(key)}: ${textOf(entry)}`);
  return String(value).split(/\n|;|(?:\s*[•]\s*)/).map((entry) => entry.replace(/^[-*]\s*/, "").trim()).filter(Boolean);
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {};
}

function prettyLabel(value: string) {
  const normalized = value.trim().toLowerCase();
  const translations: Record<string, string> = { high: "Alta", medium: "Media", low: "Baja" };
  return translations[normalized] || value.replace(/[_-]+/g, " ").replace(/([a-z])([A-Z])/g, "$1 $2").replace(/^\w/, (letter) => letter.toUpperCase());
}
