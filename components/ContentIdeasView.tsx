"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode, type RefObject } from "react";
import {
  ArrowUpRight,
  CalendarClock,
  CheckCircle2,
  Clock3,
  Gauge,
  Layers3,
  Lightbulb,
  Megaphone,
  PackageOpen,
  Palette,
  Quote,
  Sparkles,
  Target,
  TriangleAlert,
  X,
  Zap,
} from "lucide-react";
import type { LikeliOutputItem } from "@/types/likeliPortalOutput";

type IdeaField = unknown;

type DetailSectionProps = {
  title: string;
  icon: ReactNode;
  children: ReactNode;
  className?: string;
};

const aliases = {
  title: ["title", "titulo", "idea", "name", "nombre"],
  format: ["format", "formato", "contentFormat", "tipo"],
  objective: ["objective", "objetivo", "goal", "proposito"],
  priority: ["priority", "prioridad"],
  score: ["likeliScore", "score", "puntaje"],
  potential: ["prediction", "prediccion", "potencial", "expectedPerformance", "estimatedImpact", "impactoEstimado"],
  concept: ["concept", "concepto", "creativeConcept", "ideaDescription", "description", "descripcion"],
  insight: ["insight", "razon", "strategy", "estrategia", "whyItShouldWork", "strategicReason", "rationale"],
  signals: ["signals", "senales", "evidenceUsed", "evidence", "relatedFlags"],
  hook: ["hook", "recommendedHook", "hookPrincipal"],
  hooks: ["hooks", "hookVariants", "variantesHook", "hookOptions"],
  script: ["script", "guion", "structure", "estructura", "steps", "pasos", "slides", "scenes", "escenas"],
  caption: ["caption", "copy", "captionSugerido", "suggestedCaption"],
  cta: ["cta", "callToAction", "accion", "recommendedCta", "recommendedCTA"],
  visual: ["visualRecommendation", "recomendacionVisual", "visualStyle", "direccionVisual", "recommendedAngle", "angle"],
  duration: ["duration", "duracion", "durationSeconds", "estimatedDuration", "extension", "length", "numeroSlides"],
  resources: ["resources", "recursos", "requiredResources", "clips", "shots", "tomas", "assets"],
  strengths: ["strengths", "fortalezas", "pros"],
  weaknesses: ["weaknesses", "debilidades", "risks", "riesgos", "cons", "thingsToWatch"],
  publishTime: ["publishTime", "momentoPublicacion", "horario", "bestTime", "recommendedTime", "publicationMoment"],
  variants: ["variants", "variantes", "versions", "versiones"],
  emotion: ["emotion", "emocion", "intention", "intencion", "whatToTransmit", "queTransmitir"],
} as const;

export function ContentIdeasView({ items, openFirstIdea = false }: { items: LikeliOutputItem[]; openFirstIdea?: boolean }) {
  const [selectedIdea, setSelectedIdea] = useState<LikeliOutputItem | null>(null);
  const [isClosing, setIsClosing] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const closingRef = useRef(false);
  const tutorialOpenedRef = useRef(false);

  const beginClose = useCallback(() => {
    if (closingRef.current) return;
    closingRef.current = true;
    setIsClosing(true);
    window.setTimeout(() => {
      setSelectedIdea(null);
      setIsClosing(false);
      closingRef.current = false;
    }, 180);
  }, []);

  useEffect(() => {
    let frame = 0;
    if (openFirstIdea && items[0] && !selectedIdea) {
      tutorialOpenedRef.current = true;
      frame = window.requestAnimationFrame(() => setSelectedIdea(items[0]));
    } else if (!openFirstIdea && tutorialOpenedRef.current) {
      tutorialOpenedRef.current = false;
      frame = window.requestAnimationFrame(() => setSelectedIdea(null));
    }
    return () => window.cancelAnimationFrame(frame);
  }, [items, openFirstIdea, selectedIdea]);

  useEffect(() => {
    if (!selectedIdea) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusTimer = window.setTimeout(() => closeButtonRef.current?.focus(), 60);

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") beginClose();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.clearTimeout(focusTimer);
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [beginClose, selectedIdea]);

  if (!items.length) {
    return (
      <article className="empty-state">
        <strong>Sin datos disponibles</strong>
        <p>Importa el output desde admin o revisa el contenido del modulo mas tarde.</p>
      </article>
    );
  }

  return (
    <>
      <section className="ideas-grid" aria-label="Ideas de contenido">
        {items.map((item, index) => (
          <IdeaCard item={item} index={index} key={String(item.id || index)} onOpen={() => setSelectedIdea(item)} />
        ))}
      </section>

      {selectedIdea && (
        <div
          className={`idea-modal-backdrop${isClosing ? " is-closing" : ""}`}
          role="presentation"
          onClick={(event) => {
            if (event.target === event.currentTarget) beginClose();
          }}
        >
          <IdeaModal item={selectedIdea} onClose={beginClose} closeButtonRef={closeButtonRef} />
        </div>
      )}
    </>
  );
}

function IdeaCard({
  item,
  index,
  onOpen,
}: {
  item: LikeliOutputItem;
  index: number;
  onOpen: () => void;
}) {
  const title = textOf(pick(item, aliases.title)) || `Idea ${index + 1}`;
  const format = textOf(pick(item, aliases.format));
  const objective = textOf(pick(item, aliases.objective));
  const priority = textOf(pick(item, aliases.priority));
  const score = textOf(pick(item, aliases.score));
  const potential = textOf(pick(item, aliases.potential));
  const cta = textOf(pick(item, aliases.cta));
  const summary = objective || textOf(pick(item, aliases.concept)) || textOf(pick(item, aliases.insight));

  return (
    <button className="idea-card" data-tour-id={index === 0 ? "idea-card" : undefined} type="button" onClick={onOpen} aria-label={`Abrir estrategia: ${title}`}>
      <span className="idea-card__glow" aria-hidden="true" />
      <header className="idea-card__header">
        <div className="idea-card__chips">
          {format && <Chip>{format}</Chip>}
          {priority && <Chip tone={priorityTone(priority)}>{prettyValue(priority)}</Chip>}
        </div>
        <ArrowUpRight className="idea-card__arrow" aria-hidden="true" size={18} />
      </header>

      <div className="idea-card__body">
        <p className="idea-card__number">Idea {String(index + 1).padStart(2, "0")}</p>
        <h3>{title}</h3>
        {summary && <p className="idea-card__summary">{summary}</p>}
      </div>

      {(score || potential) && (
        <div className="idea-card__signals">
          {score && (
            <span>
              <Gauge aria-hidden="true" size={14} />
              <small>Score</small>
              <strong>{score}</strong>
            </span>
          )}
          {potential && (
            <span>
              <Zap aria-hidden="true" size={14} />
              <small>Potencial</small>
              <strong>{prettyValue(potential)}</strong>
            </span>
          )}
        </div>
      )}

      <footer className="idea-card__footer">
        <span>{cta || "Estrategia lista para explorar"}</span>
        <strong>Ver idea</strong>
      </footer>
    </button>
  );
}

function IdeaModal({
  item,
  onClose,
  closeButtonRef,
}: {
  item: LikeliOutputItem;
  onClose: () => void;
  closeButtonRef: RefObject<HTMLButtonElement | null>;
}) {
  const title = textOf(pick(item, aliases.title)) || "Idea de contenido";
  const format = textOf(pick(item, aliases.format));
  const priority = textOf(pick(item, aliases.priority));
  const score = textOf(pick(item, aliases.score));
  const potential = textOf(pick(item, aliases.potential));
  const objective = textOf(pick(item, aliases.objective));
  const insight = textOf(pick(item, aliases.insight));
  const signals = listOf(pick(item, aliases.signals));
  const concept = textOf(pick(item, aliases.concept));
  const emotion = textOf(pick(item, aliases.emotion));
  const mainHook = textOf(pick(item, aliases.hook));
  const hookVariants = collectHookVariants(item);
  const scriptItems = structuredItems(pick(item, aliases.script));
  const caption = textOf(pick(item, aliases.caption));
  const cta = textOf(pick(item, aliases.cta));
  const visual = pick(item, aliases.visual);
  const duration = textOf(pick(item, aliases.duration));
  const resources = listOf(pick(item, aliases.resources));
  const strengths = listOf(pick(item, aliases.strengths));
  const weaknesses = listOf(pick(item, aliases.weaknesses));
  const publishTime = textOf(pick(item, aliases.publishTime));
  const variants = structuredItems(pick(item, aliases.variants));

  const hasStrategy = objective || insight || signals.length;
  const hasConcept = concept || emotion;
  const hasHooks = mainHook || hookVariants.length;
  const hasProduction = visual != null || duration || resources.length;

  return (
    <section className="idea-modal" data-tour-id="idea-expanded" role="dialog" aria-modal="true" aria-labelledby="idea-modal-title">
      <header className="idea-modal__hero">
        <div className="idea-modal__topline">
          <div className="idea-card__chips">
            {format && <Chip>{format}</Chip>}
            {priority && <Chip tone={priorityTone(priority)}>{prettyValue(priority)}</Chip>}
            {score && <Chip tone="score">Score {score}</Chip>}
          </div>
          <button ref={closeButtonRef} className="idea-modal__close" type="button" onClick={onClose} aria-label="Cerrar idea">
            <X aria-hidden="true" size={20} />
          </button>
        </div>
        <div>
          <p className="eyebrow">Estrategia de contenido</p>
          <h2 id="idea-modal-title">{title}</h2>
          {potential && (
            <p className="idea-modal__potential">
              <Sparkles aria-hidden="true" size={16} />
              Potencial esperado: <strong>{prettyValue(potential)}</strong>
            </p>
          )}
        </div>
      </header>

      <div className="idea-modal__content">
        {hasStrategy && (
          <DetailSection title="Resumen estrategico" icon={<Target aria-hidden="true" size={18} />}>
            <div className="idea-detail-grid">
              {objective && <LabeledText label="Objetivo de la pieza">{objective}</LabeledText>}
              {insight && <LabeledText label="Razon estrategica">{insight}</LabeledText>}
            </div>
            {signals.length > 0 && (
              <div className="idea-signal-list" aria-label="Señales analizadas">
                {signals.map((signal, index) => <span key={`${signal}-${index}`}>{humanizeKey(signal)}</span>)}
              </div>
            )}
          </DetailSection>
        )}

        {hasConcept && (
          <DetailSection title="Concepto creativo" icon={<Lightbulb aria-hidden="true" size={18} />}>
            {concept && <p className="idea-prose">{concept}</p>}
            {emotion && <LabeledText label="Intencion a activar">{emotion}</LabeledText>}
          </DetailSection>
        )}

        {hasHooks && (
          <DetailSection title="Hook recomendado" icon={<Zap aria-hidden="true" size={18} />}>
            {mainHook && <blockquote className="idea-hook">{mainHook}</blockquote>}
            {hookVariants.length > 0 && (
              <div className="idea-variant-grid">
                {hookVariants.map((variant, index) => (
                  <article key={`${variant.label}-${index}`}>
                    <span>{variant.label || `Variante ${index + 1}`}</span>
                    <p>{variant.value}</p>
                  </article>
                ))}
              </div>
            )}
          </DetailSection>
        )}

        {scriptItems.length > 0 && (
          <DetailSection title={isCarousel(format) ? "Estructura del carrusel" : "Guion o estructura"} icon={<Layers3 aria-hidden="true" size={18} />}>
            <ol className="idea-steps">
              {scriptItems.map((step, index) => (
                <li key={`${step.label}-${index}`}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <strong>{step.label || (isCarousel(format) ? `Slide ${index + 1}` : `Paso ${index + 1}`)}</strong>
                    {step.value && <p>{step.value}</p>}
                  </div>
                </li>
              ))}
            </ol>
          </DetailSection>
        )}

        {caption && (
          <DetailSection title="Caption sugerido" icon={<Quote aria-hidden="true" size={18} />} className="idea-detail-section--caption">
            <p className="idea-caption">{caption}</p>
          </DetailSection>
        )}

        {cta && (
          <DetailSection title="CTA recomendado" icon={<Megaphone aria-hidden="true" size={18} />} className="idea-detail-section--cta">
            <p className="idea-cta">{cta}</p>
          </DetailSection>
        )}

        {hasProduction && (
          <DetailSection title="Direccion de produccion" icon={<Palette aria-hidden="true" size={18} />}>
            <div className="idea-detail-grid">
              {visual != null && <LabeledText label="Recomendacion visual">{textOf(visual)}</LabeledText>}
              {duration && (
                <LabeledText label="Duracion o extension">
                  <span className="idea-inline-icon"><Clock3 aria-hidden="true" size={15} />{formatDuration(duration)}</span>
                </LabeledText>
              )}
            </div>
            {resources.length > 0 && (
              <div>
                <p className="idea-detail-label"><PackageOpen aria-hidden="true" size={14} /> Recursos necesarios</p>
                <div className="idea-chip-list">
                  {resources.map((resource, index) => <span key={`${resource}-${index}`}>{resource}</span>)}
                </div>
              </div>
            )}
          </DetailSection>
        )}

        {(strengths.length > 0 || weaknesses.length > 0) && (
          <DetailSection title="Lectura critica" icon={<CheckCircle2 aria-hidden="true" size={18} />}>
            <div className="idea-pros-cons">
              {strengths.length > 0 && <BulletGroup title="Fortalezas" items={strengths} tone="positive" />}
              {weaknesses.length > 0 && <BulletGroup title="Riesgos y cuidados" items={weaknesses} tone="warning" />}
            </div>
          </DetailSection>
        )}

        {publishTime && (
          <DetailSection title="Momento recomendado" icon={<CalendarClock aria-hidden="true" size={18} />}>
            <p className="idea-publish-time">{publishTime}</p>
          </DetailSection>
        )}

        {variants.length > 0 && (
          <DetailSection title="Variantes de la idea" icon={<Sparkles aria-hidden="true" size={18} />}>
            <div className="idea-variant-grid">
              {variants.map((variant, index) => (
                <article key={`${variant.label}-${index}`}>
                  <span>{variant.label || `Version ${index + 1}`}</span>
                  {variant.value && <p>{variant.value}</p>}
                </article>
              ))}
            </div>
          </DetailSection>
        )}
      </div>
    </section>
  );
}

function DetailSection({ title, icon, children, className = "" }: DetailSectionProps) {
  return (
    <section className={`idea-detail-section ${className}`.trim()}>
      <header>
        <span>{icon}</span>
        <h3>{title}</h3>
      </header>
      <div className="idea-detail-section__body">{children}</div>
    </section>
  );
}

function LabeledText({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="idea-labeled-text">
      <span>{label}</span>
      <p>{children}</p>
    </div>
  );
}

function BulletGroup({ title, items, tone }: { title: string; items: string[]; tone: "positive" | "warning" }) {
  return (
    <article className={`idea-bullet-group is-${tone}`}>
      <h4>{tone === "warning" ? <TriangleAlert aria-hidden="true" size={16} /> : <CheckCircle2 aria-hidden="true" size={16} />}{title}</h4>
      <ul>{items.map((item, index) => <li key={`${item}-${index}`}>{item}</li>)}</ul>
    </article>
  );
}

function Chip({ children, tone = "default" }: { children: ReactNode; tone?: string }) {
  return <span className={`idea-chip is-${tone}`}>{children}</span>;
}

function pick(item: LikeliOutputItem, keys: readonly string[]): IdeaField {
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
  if (typeof value === "object") {
    return Object.entries(value as Record<string, unknown>)
      .filter(([, entry]) => hasValue(entry))
      .map(([key, entry]) => `${humanizeKey(key)}: ${textOf(entry)}`)
      .join(" · ");
  }
  return String(value).trim();
}

function listOf(value: unknown): string[] {
  if (!hasValue(value)) return [];
  if (Array.isArray(value)) return value.flatMap((entry) => listOf(entry)).filter(Boolean);
  if (typeof value === "object") {
    return Object.entries(value as Record<string, unknown>)
      .filter(([, entry]) => hasValue(entry))
      .map(([key, entry]) => `${humanizeKey(key)}: ${textOf(entry)}`);
  }
  return String(value)
    .split(/\n|(?:\s*[•]\s*)|(?:\s*;\s*)/)
    .map((entry) => entry.replace(/^[-*]\s*/, "").trim())
    .filter(Boolean);
}

function structuredItems(value: unknown): Array<{ label: string; value: string }> {
  if (!hasValue(value)) return [];

  if (Array.isArray(value)) {
    return value.flatMap((entry, index) => {
      if (entry && typeof entry === "object") {
        const record = entry as Record<string, unknown>;
        const label = textOf(record.title || record.titulo || record.label || record.name || record.step || record.slide || record.scene);
        const detail = textOf(record.description || record.descripcion || record.content || record.text || record.copy || record.action);
        return [{ label: label || `Paso ${index + 1}`, value: detail }];
      }
      return [{ label: "", value: textOf(entry) }];
    }).filter((entry) => entry.label || entry.value);
  }

  if (typeof value === "object") {
    return Object.entries(value as Record<string, unknown>)
      .filter(([, entry]) => hasValue(entry))
      .map(([key, entry]) => ({ label: humanizeKey(key), value: textOf(entry) }));
  }

  const source = String(value).trim();
  const markedParts = source
    .split(/(?=(?:Plano|Slide|Paso|Escena|Apertura|Desarrollo|Momento fuerte|Cierre|CTA)\s*\d*\s*[:.-])/gi)
    .map((part) => part.trim())
    .filter(Boolean);
  const parts = markedParts.length > 1
    ? markedParts
    : source.split(/\n+/).map((part) => part.trim()).filter(Boolean);

  return parts.map((part, index) => {
    const match = part.match(/^([^:.-]{2,40})\s*[:.-]\s*([\s\S]+)$/);
    return match
      ? { label: match[1].trim(), value: match[2].trim() }
      : { label: `Paso ${index + 1}`, value: part };
  });
}

function collectHookVariants(item: LikeliOutputItem) {
  const variants = structuredItems(pick(item, aliases.hooks));
  const knownVariants = [
    ["Hook emocional", pick(item, ["emotionalHook", "hookEmocional"])],
    ["Hook directo", pick(item, ["directHook", "hookDirecto"])],
    ["Hook aspiracional", pick(item, ["aspirationalHook", "hookAspiracional"])],
  ] as const;

  knownVariants.forEach(([label, value]) => {
    if (hasValue(value)) variants.push({ label, value: textOf(value) });
  });
  return variants;
}

function priorityTone(priority: string) {
  const normalized = priority.toLowerCase();
  if (normalized.includes("alta") || normalized === "high") return "high";
  if (normalized.includes("media") || normalized === "medium") return "medium";
  if (normalized.includes("baja") || normalized === "low") return "low";
  return "default";
}

function prettyValue(value: string) {
  const normalized = value.trim().toLowerCase();
  const translations: Record<string, string> = {
    high: "Alta",
    medium: "Media",
    low: "Baja",
    "medium high": "Medio alto",
  };
  return translations[normalized] || value;
}

function humanizeKey(value: string) {
  return value
    .replace(/[_-]+/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/^\w/, (letter) => letter.toUpperCase());
}

function formatDuration(value: string) {
  return /^\d+$/.test(value) ? `${value} segundos` : value;
}

function isCarousel(format: string) {
  return /carrusel|carousel/i.test(format);
}
