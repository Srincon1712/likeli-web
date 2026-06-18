"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode, type RefObject } from "react";
import {
  ArrowUpRight,
  BarChart3,
  CalendarClock,
  CircleDotDashed,
  Clock3,
  Crosshair,
  Eye,
  Gauge,
  Lightbulb,
  MapPin,
  Radar,
  ShieldAlert,
  Sparkles,
  Target,
  TrendingUp,
  TriangleAlert,
  X,
  Zap,
} from "lucide-react";
import type { LikeliOutputItem } from "@/types/likeliPortalOutput";

const aliases = {
  title: ["title", "titulo", "name", "nombre", "trend", "tendencia"],
  category: ["type", "tipo", "category", "categoria"],
  status: ["status", "estado", "stage", "etapa"],
  location: ["location", "zona", "context", "contexto", "detectedIn", "detectadaEn"],
  signal: ["signal", "señal", "senal", "detectedSignal", "señalDetectada", "senalDetectada", "description", "descripcion"],
  evidence: ["evidence", "evidencia", "evidenceUsed", "signals", "senales"],
  evidenceStrength: ["evidenceStrength", "signalStrength", "fuerzaEvidencia", "fuerzaSeñal", "fuerzaSenal"],
  importance: ["whyItMatters", "porQueImporta", "reason", "razon", "interpretation", "interpretacion"],
  opportunity: ["opportunity", "oportunidad", "opportunityLevel", "nivelOportunidad"],
  opportunityScore: ["opportunityScore", "scoreOportunidad", "score", "likeliScore"],
  urgency: ["urgency", "urgencia", "timeToAct", "momentoActuar"],
  saturation: ["saturationRisk", "riesgoSaturacion", "saturation", "saturacion"],
  recommendation: ["howToUse", "comoAprovecharla", "recommendation", "recomendacion", "strategicImplication", "application"],
  ideas: ["contentIdeas", "ideasContenido", "derivedIdeas", "ideasDerivadas"],
  formats: ["formats", "formatos", "format", "formato", "recommendedFormats"],
  audience: ["audience", "audiencia"],
  intention: ["intention", "intencion", "commercialImpact", "impactoComercial", "bookingImpact", "relacionReservas"],
  publish: ["publishRecommendation", "recomendacionPublicacion", "bestTime", "momentoPublicacion"],
  businessExample: ["businessExample", "ejemploAplicado", "appliedExample", "comoSeVeria"],
  nextStep: ["nextStep", "siguientePaso", "recommendedAction", "accionRecomendada"],
  risks: ["risks", "riesgos", "avoid", "evitar", "weaknesses", "debilidades"],
  detectedAt: ["detectedAt", "fechaDeteccion", "detectedDate", "fecha"],
} as const;

type TrendItem = ReturnType<typeof normalizeTrend>;

export function TrendsRadarView({ items }: { items: LikeliOutputItem[] }) {
  const trends = useMemo(() => items.map(normalizeTrend), [items]);
  const categories = useMemo(
    () => Array.from(new Set(trends.map((trend) => trend.category))).sort((a, b) => a.localeCompare(b, "es")),
    [trends],
  );
  const [activeCategory, setActiveCategory] = useState("Todas");
  const [selectedTrend, setSelectedTrend] = useState<TrendItem | null>(null);
  const [isClosing, setIsClosing] = useState(false);
  const closingRef = useRef(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const visibleTrends = activeCategory === "Todas" ? trends : trends.filter((trend) => trend.category === activeCategory);

  const closeDrawer = useCallback(() => {
    if (closingRef.current) return;
    closingRef.current = true;
    setIsClosing(true);
    window.setTimeout(() => {
      setSelectedTrend(null);
      setIsClosing(false);
      closingRef.current = false;
    }, 190);
  }, []);

  useEffect(() => {
    if (!selectedTrend) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusTimer = window.setTimeout(() => closeButtonRef.current?.focus(), 70);
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeDrawer();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.clearTimeout(focusTimer);
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [closeDrawer, selectedTrend]);

  if (!items.length) {
    return (
      <article className="empty-state">
        <strong>Sin tendencias detectadas</strong>
        <p>Importa el output desde admin o revisa el contenido del modulo mas tarde.</p>
      </article>
    );
  }

  return (
    <>
      <section className="trends-radar">
        <RadarSummary trends={trends} />

        <nav className="trend-filters" aria-label="Filtrar tendencias">
          <FilterChip active={activeCategory === "Todas"} count={trends.length} label="Todas" onClick={() => setActiveCategory("Todas")} />
          {categories.map((category) => (
            <FilterChip
              active={activeCategory === category}
              count={trends.filter((trend) => trend.category === category).length}
              key={category}
              label={prettyLabel(category)}
              onClick={() => setActiveCategory(category)}
            />
          ))}
        </nav>

        <div className="trend-grid">
          {visibleTrends.map((trend, index) => (
            <TrendCard trend={trend} index={index} key={trend.key} onOpen={() => setSelectedTrend(trend)} />
          ))}
        </div>
      </section>

      {selectedTrend && (
        <div
          className={`trend-drawer-backdrop${isClosing ? " is-closing" : ""}`}
          role="presentation"
          onClick={(event) => {
            if (event.target === event.currentTarget) closeDrawer();
          }}
        >
          <TrendDrawer trend={selectedTrend} closeButtonRef={closeButtonRef} onClose={closeDrawer} />
        </div>
      )}
    </>
  );
}

function RadarSummary({ trends }: { trends: TrendItem[] }) {
  const emergent = trends.filter((trend) => /emerg|early|tempran|crecim|growth/i.test(trend.status)).length;
  const highOpportunity = trends.filter((trend) => isHigh(trend.opportunity) || numericScore(trend.opportunityScore) >= 75).length;
  const lowSaturation = trends.filter((trend) => /baj|low/i.test(trend.saturation)).length;
  const withEvidence = trends.filter((trend) => trend.evidence.length > 0).length;
  const hasStatus = trends.some((trend) => trend.status);
  const hasOpportunity = trends.some((trend) => trend.opportunity || trend.opportunityScore);
  const hasSaturation = trends.some((trend) => trend.saturation);

  return (
    <header className="radar-summary">
      <div className="radar-summary__visual" aria-hidden="true">
        <span className="radar-ring radar-ring--one" />
        <span className="radar-ring radar-ring--two" />
        <span className="radar-ring radar-ring--three" />
        <span className="radar-sweep" />
        {trends.slice(0, 7).map((trend, index) => (
          <i key={trend.key} style={{ "--radar-index": index } as CSSProperties} />
        ))}
        <Radar size={27} />
      </div>

      <div className="radar-summary__content">
        <p className="eyebrow">Radar estrategico</p>
        <h3>Señales detectadas para este negocio</h3>
        <p>Patrones observados y oportunidades traducidas en acciones concretas de contenido.</p>
      </div>

      <div className="radar-summary__metrics">
        <RadarMetric icon={<Crosshair size={16} />} label="Detectadas" value={trends.length} />
        {withEvidence > 0 && <RadarMetric icon={<Eye size={16} />} label="Con evidencia" value={withEvidence} />}
        {hasStatus && <RadarMetric icon={<TrendingUp size={16} />} label="Emergentes" value={emergent} />}
        {hasOpportunity && <RadarMetric icon={<Zap size={16} />} label="Alta oportunidad" value={highOpportunity} />}
        {hasSaturation && <RadarMetric icon={<ShieldAlert size={16} />} label="Baja saturacion" value={lowSaturation} />}
      </div>
    </header>
  );
}

function TrendCard({ trend, index, onOpen }: { trend: TrendItem; index: number; onOpen: () => void }) {
  return (
    <button className="trend-card" type="button" onClick={onOpen} aria-label={`Abrir tendencia: ${trend.title}`}>
      <span className="trend-card__beam" aria-hidden="true" />
      <header>
        <div className="trend-card__tags">
          {trend.status && <TrendTag tone={statusTone(trend.status)}>{prettyLabel(trend.status)}</TrendTag>}
          {!trend.status && trend.category !== "General" && <TrendTag>{prettyLabel(trend.category)}</TrendTag>}
          {trend.evidenceStrength && <TrendTag tone="evidence">Evidencia {prettyLabel(trend.evidenceStrength)}</TrendTag>}
        </div>
        <ArrowUpRight aria-hidden="true" size={18} />
      </header>

      <div className="trend-card__title">
        <span>Señal {String(index + 1).padStart(2, "0")}</span>
        <h3>{trend.title}</h3>
        {trend.location && <p><MapPin aria-hidden="true" size={13} />{trend.location}</p>}
      </div>

      {trend.signal && (
        <div className="trend-card__signal">
          <span><CircleDotDashed aria-hidden="true" size={14} />Señal detectada</span>
          <p>{trend.signal}</p>
        </div>
      )}

      {(trend.opportunity || trend.opportunityScore || trend.saturation) && (
        <div className="trend-card__metrics">
          {(trend.opportunity || trend.opportunityScore) && (
            <Metric label="Oportunidad" value={trend.opportunityScore || prettyLabel(trend.opportunity)} />
          )}
          {trend.saturation && <Metric label="Saturacion" value={prettyLabel(trend.saturation)} />}
        </div>
      )}

      <footer>
        {(trend.urgency || trend.detectedAt) && <span>{trend.urgency || trend.detectedAt}</span>}
        <strong>Ver tendencia</strong>
      </footer>
    </button>
  );
}

function TrendDrawer({
  trend,
  closeButtonRef,
  onClose,
}: {
  trend: TrendItem;
  closeButtonRef: RefObject<HTMLButtonElement | null>;
  onClose: () => void;
}) {
  return (
    <aside className="trend-drawer" role="dialog" aria-modal="true" aria-labelledby="trend-drawer-title">
      <header className="trend-drawer__header">
        <div className="trend-drawer__topline">
          <div className="trend-card__tags">
            {trend.status && <TrendTag tone={statusTone(trend.status)}>{prettyLabel(trend.status)}</TrendTag>}
            {trend.category !== "General" && <TrendTag>{prettyLabel(trend.category)}</TrendTag>}
            {trend.evidenceStrength && <TrendTag tone="evidence">Evidencia {prettyLabel(trend.evidenceStrength)}</TrendTag>}
          </div>
          <button ref={closeButtonRef} type="button" onClick={onClose} aria-label="Cerrar tendencia">
            <X aria-hidden="true" size={20} />
          </button>
        </div>

        <div>
          <p className="eyebrow">Señal detectada</p>
          <h2 id="trend-drawer-title">{trend.title}</h2>
          {(trend.location || trend.urgency) && (
            <div className="trend-drawer__context">
              {trend.location && <span><MapPin size={14} />{trend.location}</span>}
              {trend.urgency && <span><Clock3 size={14} />{trend.urgency}</span>}
            </div>
          )}
        </div>

        {(trend.opportunity || trend.opportunityScore || trend.saturation) && (
          <div className="trend-drawer__scores">
            {(trend.opportunity || trend.opportunityScore) && (
              <ScoreBlock icon={<Gauge size={17} />} label="Nivel de oportunidad" value={trend.opportunityScore || prettyLabel(trend.opportunity)} />
            )}
            {trend.saturation && (
              <ScoreBlock icon={<ShieldAlert size={17} />} label="Riesgo de saturacion" value={prettyLabel(trend.saturation)} />
            )}
          </div>
        )}
      </header>

      <div className="trend-drawer__content">
        {(trend.signal || trend.evidence.length > 0) && (
          <DrawerSection icon={<Crosshair size={17} />} title="Señal detectada" accent>
            {trend.signal && <p className="trend-drawer__lead">{trend.signal}</p>}
            {trend.evidence.length > 0 && (
              <div className="trend-evidence">
                {trend.evidence.map((evidence, index) => <span key={`${evidence}-${index}`}>{prettyLabel(evidence)}</span>)}
              </div>
            )}
          </DrawerSection>
        )}

        {trend.importance && (
          <DrawerSection icon={<BarChart3 size={17} />} title="Interpretacion estrategica">
            <p>{trend.importance}</p>
          </DrawerSection>
        )}

        {trend.recommendation && (
          <DrawerSection icon={<Target size={17} />} title="Como aprovecharla" accent>
            <p className="trend-action-copy">{trend.recommendation}</p>
          </DrawerSection>
        )}

        {trend.ideas.length > 0 && (
          <DrawerSection icon={<Lightbulb size={17} />} title="Ideas derivadas">
            <div className="trend-derived-ideas">
              {trend.ideas.map((idea, index) => (
                <article key={`${idea}-${index}`}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <p>{idea}</p>
                </article>
              ))}
            </div>
          </DrawerSection>
        )}

        {(trend.formats.length > 0 || trend.audience.length > 0 || trend.intention) && (
          <DrawerSection icon={<Sparkles size={17} />} title="Aplicacion">
            <div className="trend-application-grid">
              {trend.formats.length > 0 && <ChipGroup label="Formatos" items={trend.formats} />}
              {trend.audience.length > 0 && <ChipGroup label="Audiencia" items={trend.audience} />}
              {trend.intention && <TextBlock label="Impacto esperado">{trend.intention}</TextBlock>}
            </div>
          </DrawerSection>
        )}

        {trend.businessExample && (
          <DrawerSection icon={<Eye size={17} />} title="Como se veria en tu contenido">
            <blockquote>{trend.businessExample}</blockquote>
          </DrawerSection>
        )}

        {(trend.publish || trend.detectedAt) && (
          <DrawerSection icon={<CalendarClock size={17} />} title="Momento recomendado">
            <div className="trend-timing">
              {trend.publish && <TextBlock label="Publicacion">{trend.publish}</TextBlock>}
              {trend.detectedAt && <TextBlock label="Deteccion">{trend.detectedAt}</TextBlock>}
            </div>
          </DrawerSection>
        )}

        {trend.risks.length > 0 && (
          <DrawerSection icon={<TriangleAlert size={17} />} title="Riesgos y cuidados">
            <ul className="trend-risk-list">{trend.risks.map((risk, index) => <li key={`${risk}-${index}`}>{risk}</li>)}</ul>
          </DrawerSection>
        )}

        {trend.nextStep && (
          <section className="trend-next-step">
            <span><Zap aria-hidden="true" size={15} />Proximo paso recomendado</span>
            <p>{trend.nextStep}</p>
          </section>
        )}
      </div>
    </aside>
  );
}

function DrawerSection({ accent = false, children, icon, title }: { accent?: boolean; children: ReactNode; icon: ReactNode; title: string }) {
  return (
    <section className={`trend-drawer-section${accent ? " is-accent" : ""}`}>
      <header><span>{icon}</span><h3>{title}</h3></header>
      <div>{children}</div>
    </section>
  );
}

function RadarMetric({ icon, label, value }: { icon: ReactNode; label: string; value: number }) {
  return <div className="radar-metric">{icon}<strong>{value}</strong><span>{label}</span></div>;
}

function ScoreBlock({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return <div>{icon}<span>{label}</span><strong>{value}</strong></div>;
}

function Metric({ label, value }: { label: string; value: string }) {
  return <div><span>{label}</span><strong>{value}</strong></div>;
}

function TrendTag({ children, tone = "default" }: { children: ReactNode; tone?: string }) {
  return <span className={`trend-tag is-${tone}`}>{children}</span>;
}

function FilterChip({ active, count, label, onClick }: { active: boolean; count: number; label: string; onClick: () => void }) {
  return (
    <button className={active ? "is-active" : ""} type="button" onClick={onClick} aria-pressed={active}>
      <span>{label}</span><small>{count}</small>
    </button>
  );
}

function ChipGroup({ items, label }: { items: string[]; label: string }) {
  return (
    <div>
      <span className="trend-detail-label">{label}</span>
      <div className="trend-chip-list">{items.map((item, index) => <span key={`${item}-${index}`}>{prettyLabel(item)}</span>)}</div>
    </div>
  );
}

function TextBlock({ children, label }: { children: ReactNode; label: string }) {
  return <div className="trend-text-block"><span className="trend-detail-label">{label}</span><p>{children}</p></div>;
}

function normalizeTrend(item: LikeliOutputItem, index: number) {
  const category = textOf(pick(item, aliases.category));
  const status = textOf(pick(item, aliases.status));
  const signal = textOf(pick(item, aliases.signal));
  const recommendation = textOf(pick(item, aliases.recommendation));
  const evidence = listOf(pick(item, aliases.evidence));
  return {
    key: String(item.id || `trend-${index}`),
    title: textOf(pick(item, aliases.title)) || shortTitle(signal || recommendation || evidence[0] || "Señal detectada"),
    category: category || status || "General",
    status,
    location: textOf(pick(item, aliases.location)),
    signal,
    evidence,
    evidenceStrength: textOf(pick(item, aliases.evidenceStrength)),
    importance: textOf(pick(item, aliases.importance)),
    opportunity: textOf(pick(item, aliases.opportunity)),
    opportunityScore: textOf(pick(item, aliases.opportunityScore)),
    urgency: textOf(pick(item, aliases.urgency)),
    saturation: textOf(pick(item, aliases.saturation)),
    recommendation,
    ideas: listOf(pick(item, aliases.ideas)).slice(0, 6),
    formats: listOf(pick(item, aliases.formats)),
    audience: listOf(pick(item, aliases.audience)),
    intention: textOf(pick(item, aliases.intention)),
    publish: textOf(pick(item, aliases.publish)),
    businessExample: textOf(pick(item, aliases.businessExample)),
    nextStep: textOf(pick(item, aliases.nextStep)),
    risks: listOf(pick(item, aliases.risks)),
    detectedAt: textOf(pick(item, aliases.detectedAt)),
  };
}

function shortTitle(value: string) {
  const sentence = value.split(/[.!?]/)[0]?.trim() || value;
  return sentence.length > 82 ? `${sentence.slice(0, 79).trim()}…` : sentence;
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
    .split(/\n|;|(?:\s*[•]\s*)/)
    .map((entry) => entry.replace(/^[-*]\s*/, "").trim())
    .filter(Boolean);
}

function prettyLabel(value: string) {
  const normalized = value.trim().toLowerCase();
  const translations: Record<string, string> = {
    high: "Alta",
    medium: "Media",
    low: "Baja",
    emerging: "Emergente",
    growing: "En crecimiento",
    consolidated: "Consolidada",
    saturated: "Saturada",
  };
  if (translations[normalized]) return translations[normalized];
  return value
    .replace(/[_-]+/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/^\w/, (letter) => letter.toUpperCase());
}

function statusTone(value: string) {
  const normalized = value.toLowerCase();
  if (/emerg|growth|crecim|early|tempran/.test(normalized)) return "emerging";
  if (/satur|high risk|alto riesgo/.test(normalized)) return "warning";
  if (/consolid|stable|estable/.test(normalized)) return "stable";
  return "default";
}

function isHigh(value: string) {
  return /alt|high|strong|fuerte/i.test(value);
}

function numericScore(value: string) {
  const score = Number.parseFloat(value);
  return Number.isFinite(score) ? score : 0;
}
