"use client";

import { useMemo, useState, type ReactNode } from "react";
import {
  ArrowDown,
  ArrowUpRight,
  Bookmark,
  ChevronDown,
  ChevronUp,
  CircleDot,
  Hash,
  MessageCircle,
  MousePointer2,
  Quote,
  Sparkles,
  Target,
  Zap,
} from "lucide-react";
import type { LikeliOutputItem } from "@/types/likeliPortalOutput";

type LibraryKind = "hooks" | "ctas" | "captions";

type LibraryConfig = {
  eyebrow: string;
  title: string;
  description: string;
  emptyLabel: string;
};

const libraryConfig: Record<LibraryKind, LibraryConfig> = {
  hooks: {
    eyebrow: "Biblioteca de aperturas",
    title: "Encuentra el angulo que detiene el scroll",
    description: "Explora hooks por tipo y elige la apertura adecuada para cada formato e intencion.",
    emptyLabel: "hooks",
  },
  ctas: {
    eyebrow: "Biblioteca de acciones",
    title: "Cierres claros para mover a la audiencia",
    description: "Navega por tipo de accion y encuentra el CTA adecuado para cada momento de conversion.",
    emptyLabel: "CTAs",
  },
  captions: {
    eyebrow: "Biblioteca editorial",
    title: "Copies listos para adaptar y publicar",
    description: "Filtra por estilo de comunicacion y revisa cada caption en una vista comoda y editorial.",
    emptyLabel: "captions",
  },
};

const aliases = {
  hooks: {
    text: ["hook", "text", "texto", "title", "titulo"],
    category: ["hookType", "type", "tipo", "category", "categoria", "contentType"],
    format: ["bestForFormat", "format", "formato", "recommendedFormat"],
    intention: ["psychologicalTrigger", "intention", "intencion", "intent", "trigger"],
    useCase: ["useCase", "uso", "use", "bestFor", "whenToUse", "cuandoUsar"],
    strength: ["strength", "force", "intensity", "intensidad", "priority", "prioridad"],
    description: ["description", "descripcion", "explanation", "explicacion", "example", "ejemplo"],
  },
  ctas: {
    text: ["cta", "text", "texto", "action", "accion", "title", "titulo"],
    category: ["ctaType", "type", "tipo", "category", "categoria"],
    intention: ["conversionIntent", "intention", "intencion", "intent", "funnelStage", "etapa"],
    useCase: ["useCase", "uso", "use", "whenToUse", "cuandoUsar", "description", "descripcion"],
    friction: ["friction", "friccion", "frictionLevel"],
    format: ["bestFor", "format", "formato", "recommendedFormat", "placement"],
    variants: ["variants", "variantes", "alternatives", "alternativas", "shortVariant", "varianteCorta"],
    description: ["example", "ejemplo", "notes", "notas"],
  },
  captions: {
    text: ["caption", "text", "texto", "copy", "title", "titulo"],
    category: ["type", "tipo", "category", "categoria", "communicationType"],
    format: ["bestFor", "format", "formato", "recommendedFormat"],
    objective: ["objective", "objetivo", "intention", "intencion", "goal"],
    tone: ["tone", "tono", "style", "estilo"],
    cta: ["cta", "suggestedCta", "ctaSugerido", "recommendedCTA"],
    hashtags: ["hashtags", "tags", "etiquetas"],
    notes: ["notes", "notas", "useCase", "uso", "whenToUse", "cuandoUsar"],
  },
} as const;

export function ContentLibrariesView({ kind, items }: { kind: LibraryKind; items: LikeliOutputItem[] }) {
  const config = libraryConfig[kind];
  const normalizedItems = useMemo(
    () => items.map((item, index) => normalizeLibraryItem(kind, item, index)),
    [items, kind],
  );
  const categories = useMemo(
    () => Array.from(new Set(normalizedItems.map((item) => item.category))).sort((a, b) => a.localeCompare(b, "es")),
    [normalizedItems],
  );
  const [activeCategory, setActiveCategory] = useState("Todos");
  const visibleItems = activeCategory === "Todos"
    ? normalizedItems
    : normalizedItems.filter((item) => item.category === activeCategory);

  if (!items.length) {
    return (
      <article className="empty-state">
        <strong>Sin {config.emptyLabel} disponibles</strong>
        <p>Importa el output desde admin o revisa el contenido del modulo mas tarde.</p>
      </article>
    );
  }

  return (
    <section className={`content-library content-library--${kind}`}>
      <header className="content-library__intro">
        <div>
          <p className="eyebrow">{config.eyebrow}</p>
          <h3>{config.title}</h3>
          <p>{config.description}</p>
        </div>
        <div className="content-library__total">
          <strong>{visibleItems.length}</strong>
          <span>{activeCategory === "Todos" ? "recursos" : prettyLabel(activeCategory)}</span>
        </div>
      </header>

      <nav className="library-filters" aria-label={`Filtrar ${config.emptyLabel} por categoria`}>
        <FilterChip
          active={activeCategory === "Todos"}
          count={normalizedItems.length}
          label="Todos"
          onClick={() => setActiveCategory("Todos")}
        />
        {categories.map((category) => (
          <FilterChip
            active={activeCategory === category}
            count={normalizedItems.filter((item) => item.category === category).length}
            key={category}
            label={prettyLabel(category)}
            onClick={() => setActiveCategory(category)}
          />
        ))}
      </nav>

      <div className={`library-grid library-grid--${kind}`}>
        {visibleItems.map((item) => {
          if (kind === "hooks") return <HookCard item={item} key={item.key} />;
          if (kind === "ctas") return <CtaCard item={item} key={item.key} />;
          return <CaptionCard item={item} key={item.key} />;
        })}
      </div>
    </section>
  );
}

type NormalizedLibraryItem = {
  key: string;
  text: string;
  category: string;
  format: string;
  intention: string;
  useCase: string;
  strength: string;
  friction: string;
  description: string;
  tone: string;
  objective: string;
  cta: string;
  variants: string[];
  hashtags: string[];
  notes: string;
};

function HookCard({ item }: { item: NormalizedLibraryItem }) {
  const [expanded, setExpanded] = useState(false);
  const hasDetails = Boolean(item.useCase || item.description);

  return (
    <article className={`library-card hook-card${expanded ? " is-expanded" : ""}`}>
      <header className="library-card__topline">
        <LibraryTag>{prettyLabel(item.category)}</LibraryTag>
        {item.strength && <SignalBadge icon={<Zap aria-hidden="true" size={13} />}>{prettyLabel(item.strength)}</SignalBadge>}
      </header>

      <blockquote>{item.text}</blockquote>

      <div className="hook-card__meta">
        {item.format && <MetaItem icon={<CircleDot aria-hidden="true" size={13} />} label="Formato" value={item.format} />}
        {item.intention && <MetaItem icon={<Target aria-hidden="true" size={13} />} label="Activa" value={item.intention} />}
      </div>

      {expanded && hasDetails && (
        <div className="library-card__details">
          {item.useCase && <DetailText label="Cuando usarlo">{item.useCase}</DetailText>}
          {item.description && <DetailText label="Aplicacion">{item.description}</DetailText>}
        </div>
      )}

      {hasDetails && (
        <button className="library-card__expand" type="button" onClick={() => setExpanded((value) => !value)} aria-expanded={expanded}>
          {expanded ? "Cerrar detalle" : "Ver uso recomendado"}
          {expanded ? <ChevronUp aria-hidden="true" size={15} /> : <ChevronDown aria-hidden="true" size={15} />}
        </button>
      )}
    </article>
  );
}

function CtaCard({ item }: { item: NormalizedLibraryItem }) {
  const [expanded, setExpanded] = useState(false);
  const hasExtra = Boolean(item.useCase || item.description || item.variants.length);

  return (
    <article className={`library-card cta-card${expanded ? " is-expanded" : ""}`}>
      <header className="library-card__topline">
        <LibraryTag>{prettyLabel(item.category)}</LibraryTag>
        {item.friction && <SignalBadge icon={<ArrowDown aria-hidden="true" size={13} />}>Friccion {prettyLabel(item.friction)}</SignalBadge>}
      </header>

      <div className="cta-card__action">
        <MousePointer2 aria-hidden="true" size={18} />
        <p>{item.text}</p>
        <ArrowUpRight aria-hidden="true" size={17} />
      </div>

      <div className="cta-card__meta">
        {item.intention && <MetaItem icon={<Target aria-hidden="true" size={13} />} label="Intencion" value={prettyLabel(item.intention)} />}
        {item.format && <MetaItem icon={<Sparkles aria-hidden="true" size={13} />} label="Ideal para" value={item.format} />}
      </div>

      {expanded && hasExtra && (
        <div className="library-card__details">
          {item.useCase && <DetailText label="Cuando usarlo">{item.useCase}</DetailText>}
          {item.description && <DetailText label="Nota de uso">{item.description}</DetailText>}
          {item.variants.length > 0 && (
            <div>
              <span className="library-detail-label">Variantes</span>
              <div className="cta-variants">
                {item.variants.map((variant, index) => <span key={`${variant}-${index}`}>{variant}</span>)}
              </div>
            </div>
          )}
        </div>
      )}

      {hasExtra && (
        <button className="library-card__expand" type="button" onClick={() => setExpanded((value) => !value)} aria-expanded={expanded}>
          {expanded ? "Ocultar opciones" : "Ver como usarlo"}
          {expanded ? <ChevronUp aria-hidden="true" size={15} /> : <ChevronDown aria-hidden="true" size={15} />}
        </button>
      )}
    </article>
  );
}

function CaptionCard({ item }: { item: NormalizedLibraryItem }) {
  const [expanded, setExpanded] = useState(false);
  const longCaption = item.text.length > 230;
  const hasDetails = Boolean(item.objective || item.cta || item.hashtags.length || item.notes);

  return (
    <article className={`library-card caption-card${expanded ? " is-expanded" : ""}`}>
      <header className="library-card__topline">
        <div className="caption-card__tags">
          <LibraryTag>{prettyLabel(item.category)}</LibraryTag>
          {item.tone && <LibraryTag tone="soft">{prettyLabel(item.tone)}</LibraryTag>}
        </div>
        <Quote aria-hidden="true" size={20} />
      </header>

      <div className={`caption-card__copy${expanded ? " is-expanded" : ""}`}>
        <p>{item.text}</p>
      </div>

      <div className="caption-card__meta">
        {item.format && <MetaItem icon={<Bookmark aria-hidden="true" size={13} />} label="Formato" value={item.format} />}
        {item.objective && <MetaItem icon={<Target aria-hidden="true" size={13} />} label="Objetivo" value={item.objective} />}
      </div>

      {expanded && hasDetails && (
        <div className="library-card__details caption-card__details">
          {item.cta && (
            <div className="caption-card__cta">
              <MessageCircle aria-hidden="true" size={15} />
              <div><span>CTA sugerido</span><p>{item.cta}</p></div>
            </div>
          )}
          {item.notes && <DetailText label="Nota de uso">{item.notes}</DetailText>}
          {item.hashtags.length > 0 && (
            <div>
              <span className="library-detail-label">Hashtags</span>
              <div className="caption-hashtags">
                {item.hashtags.map((hashtag, index) => (
                  <span key={`${hashtag}-${index}`}><Hash aria-hidden="true" size={11} />{hashtag.replace(/^#/, "")}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {(longCaption || hasDetails) && (
        <button className="library-card__expand" type="button" onClick={() => setExpanded((value) => !value)} aria-expanded={expanded}>
          {expanded ? "Ver menos" : "Ver completo"}
          {expanded ? <ChevronUp aria-hidden="true" size={15} /> : <ChevronDown aria-hidden="true" size={15} />}
        </button>
      )}
    </article>
  );
}

function FilterChip({
  active,
  count,
  label,
  onClick,
}: {
  active: boolean;
  count: number;
  label: string;
  onClick: () => void;
}) {
  return (
    <button className={active ? "is-active" : ""} type="button" onClick={onClick} aria-pressed={active}>
      <span>{label}</span>
      <small>{count}</small>
    </button>
  );
}

function LibraryTag({ children, tone = "default" }: { children: ReactNode; tone?: "default" | "soft" }) {
  return <span className={`library-tag is-${tone}`}>{children}</span>;
}

function SignalBadge({ children, icon }: { children: ReactNode; icon: ReactNode }) {
  return <span className="library-signal">{icon}{children}</span>;
}

function MetaItem({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="library-meta-item">
      {icon}
      <span>{label}</span>
      <strong>{prettyLabel(value)}</strong>
    </div>
  );
}

function DetailText({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="library-detail-text">
      <span className="library-detail-label">{label}</span>
      <p>{children}</p>
    </div>
  );
}

function normalizeLibraryItem(kind: LibraryKind, item: LikeliOutputItem, index: number): NormalizedLibraryItem {
  const emptyBase = {
    key: String(item.id || `${kind}-${index}`),
    format: "",
    intention: "",
    useCase: "",
    strength: "",
    friction: "",
    description: "",
    tone: "",
    objective: "",
    cta: "",
    variants: [],
    hashtags: [],
    notes: "",
  };

  if (kind === "hooks") {
    const fields = aliases.hooks;
    return {
      ...emptyBase,
      text: textOf(pick(item, fields.text)) || `Hook ${index + 1}`,
      category: textOf(pick(item, fields.category)) || "General",
      format: textOf(pick(item, fields.format)),
      intention: textOf(pick(item, fields.intention)),
      useCase: textOf(pick(item, fields.useCase)),
      strength: textOf(pick(item, fields.strength)),
      description: textOf(pick(item, fields.description)),
    };
  }

  if (kind === "ctas") {
    const fields = aliases.ctas;
    return {
      ...emptyBase,
      text: textOf(pick(item, fields.text)) || `CTA ${index + 1}`,
      category: textOf(pick(item, fields.category)) || "General",
      format: textOf(pick(item, fields.format)),
      intention: textOf(pick(item, fields.intention)),
      useCase: textOf(pick(item, fields.useCase)),
      friction: textOf(pick(item, fields.friction)),
      variants: listOf(pick(item, fields.variants)),
      description: textOf(pick(item, fields.description)),
    };
  }

  const fields = aliases.captions;
  return {
    ...emptyBase,
    text: textOf(pick(item, fields.text)) || `Caption ${index + 1}`,
    category: textOf(pick(item, fields.category)) || textOf(pick(item, fields.tone)) || "General",
    format: textOf(pick(item, fields.format)),
    tone: textOf(pick(item, fields.tone)),
    objective: textOf(pick(item, fields.objective)),
    cta: textOf(pick(item, fields.cta)),
    hashtags: listOf(pick(item, fields.hashtags)),
    notes: textOf(pick(item, fields.notes)),
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
  if (typeof value === "object") {
    return Object.entries(value as Record<string, unknown>)
      .filter(([, entry]) => hasValue(entry))
      .map(([key, entry]) => `${prettyLabel(key)}: ${textOf(entry)}`)
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
      .map(([key, entry]) => `${prettyLabel(key)}: ${textOf(entry)}`);
  }
  return String(value)
    .split(/\n|;|,/)
    .map((entry) => entry.replace(/^[-*#]\s*/, "").trim())
    .filter(Boolean);
}

function prettyLabel(value: string) {
  const normalized = value.trim().toLowerCase();
  const translations: Record<string, string> = {
    high: "Alta",
    medium: "Media",
    low: "Baja",
    aspirational: "Aspiracional",
    emotional: "Emocional",
    educational: "Educativo",
    conversion: "Conversion",
    curiosity_gap: "Curiosidad",
    direct_benefit: "Beneficio directo",
    soft_sell: "Venta suave",
    share_cta: "Compartir",
    faq_hook: "Preguntas frecuentes",
    negative_hook: "Contraste",
    visual_metaphor: "Metafora visual",
    value_question: "Pregunta de valor",
    how_to: "Guia practica",
  };

  if (translations[normalized]) return translations[normalized];
  return value
    .replace(/[_-]+/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/^\w/, (letter) => letter.toUpperCase());
}
