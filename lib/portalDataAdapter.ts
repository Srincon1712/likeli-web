import { LIKELI_PORTAL_SCHEMA_VERSION, type CanonicalPortalModules, type PortalDataItem } from "@/types/portalSchema";
import type { LikeliClientPortalOutput } from "@/types/likeliPortalOutput";
import { normalizeCanonicalPlan, PORTAL_PLAN_RULES } from "@/lib/portalSchema";

const aliases = {
  ideas: ["ideas", "contentIdeas", "ideasContenido"],
  hooks: ["hooks", "hooksLibrary", "bibliotecaHooks"],
  captions: ["captions", "captionsLibrary", "copys", "copies"],
  ctas: ["ctas", "ctaLibrary", "callsToAction"],
  trends: ["trends", "tendencias"],
  opportunities: ["opportunities", "oportunidades"],
  scripts: ["scripts", "guiones"],
  benchmarks: ["benchmarks"],
  roadmap: ["roadmap", "monthlyRoadmap"],
  calendar: ["calendar", "calendario", "contentCalendar", "contentCalendar30Days"],
} as const;

const prefixes: Record<keyof typeof aliases, string> = {
  ideas: "idea",
  hooks: "hook",
  captions: "caption",
  ctas: "cta",
  trends: "trend",
  opportunities: "opportunity",
  scripts: "script",
  benchmarks: "benchmark",
  roadmap: "roadmap",
  calendar: "calendar",
};

export type PortalAdapterWarning = { code: string; message: string; path?: string };

export type AdaptedPortalOutput = LikeliClientPortalOutput & {
  schemaVersion: typeof LIKELI_PORTAL_SCHEMA_VERSION;
  portal: Record<string, unknown>;
  businessContext: Record<string, unknown>;
  analysis: Record<string, unknown>;
  modules: CanonicalPortalModules;
};

export function adaptPortalOutput(input: unknown, options: { createdAt?: string; plan?: unknown } = {}) {
  const source = asRecord(input);
  const sourceModules = asRecord(source.modules);
  const legacyPlan = asRecord(source.plan);
  const portalSource = asRecord(source.portal);
  const warnings: PortalAdapterWarning[] = [];
  const plan = normalizeCanonicalPlan(
    firstValue(
      portalSource.plan,
      legacyPlan.id,
      legacyPlan.planId,
      source.plan,
      source.activePlan,
      source.tier,
      options.plan,
    ),
  );
  const rules = PORTAL_PLAN_RULES[plan];
  const createdAt = validIsoDate(firstValue(portalSource.createdAt, source.generatedAt, asRecord(source.meta).generatedAt, options.createdAt))
    || new Date().toISOString();

  const ideas = normalizeItems(readModule(sourceModules, source, aliases.ideas), prefixes.ideas);
  const hooks = normalizeItems(readModule(sourceModules, source, aliases.hooks), prefixes.hooks);
  const captions = normalizeItems(readModule(sourceModules, source, aliases.captions), prefixes.captions);
  const ctas = normalizeItems(readModule(sourceModules, source, aliases.ctas), prefixes.ctas);
  const trends = normalizeItems(readModule(sourceModules, source, aliases.trends), prefixes.trends);
  const opportunities = normalizeItems(readModule(sourceModules, source, aliases.opportunities), prefixes.opportunities);
  const scripts = connectScriptsToIdeas(
    normalizeItems(readModule(sourceModules, source, aliases.scripts), prefixes.scripts).slice(0, rules.scripts),
    ideas,
    warnings,
  );
  const benchmarks = rules.benchmarks
    ? normalizeItems(readModule(sourceModules, source, aliases.benchmarks), prefixes.benchmarks)
    : [];
  const roadmap = rules.roadmap
    ? normalizeItems(readModule(sourceModules, source, aliases.roadmap), prefixes.roadmap)
    : [];
  const importedCalendar = rules.calendar
    ? normalizeItems(readModule(sourceModules, source, aliases.calendar), prefixes.calendar)
    : [];
  const calendar = rules.calendar
    ? normalizeCalendar(importedCalendar, scripts, ideas, createdAt, plan, warnings)
    : [];
  const scriptsWithDates = applyCalendarToScripts(scripts, calendar);
  const caseLibraries = rules.caseLibraries
    ? normalizeCaseLibraries(sourceModules, source)
    : { successCases: [], failureCases: [] };
  const modules: CanonicalPortalModules = {
    ideas,
    hooks,
    captions,
    ctas,
    trends,
    opportunities,
    scripts: scriptsWithDates,
    benchmarks,
    roadmap,
    calendar,
    caseLibraries,
  };
  const meta = cleanRecord({
    ...asRecord(source.meta),
    outputType: "LIKELI_CLIENT_PORTAL_OUTPUT",
    version: "2.0",
    schemaVersion: LIKELI_PORTAL_SCHEMA_VERSION,
    generatedAt: validIsoDate(firstValue(source.generatedAt, asRecord(source.meta).generatedAt)) || createdAt,
  });
  const portal = cleanRecord({
    ...portalSource,
    clientName: firstValue(portalSource.clientName, portalSource.businessName, asRecord(source.clientProfile).clientName),
    businessName: firstValue(portalSource.businessName, asRecord(source.clientProfile).businessName),
    plan,
    industry: firstValue(portalSource.industry, asRecord(source.clientProfile).industry, asRecord(source.clientProfile).businessType),
    location: firstValue(portalSource.location, asRecord(source.clientProfile).location),
    createdAt,
    period: {
      ...asRecord(portalSource.period),
      startDate: dateOnly(createdAt),
      endDate: dateOnly(addDays(parseDate(createdAt) || new Date(), 30)),
      durationDays: 30,
    },
  });
  const analysis = cleanRecord({
    ...asRecord(source.analysis),
    executiveSummary: firstValue(asRecord(source.analysis).executiveSummary, asRecord(source.executiveSummary).summary, source.executiveSummary),
    strengths: firstValue(asRecord(source.analysis).strengths, asRecord(source.diagnosis).strengths),
    weaknesses: firstValue(asRecord(source.analysis).weaknesses, asRecord(source.diagnosis).weaknesses),
    risks: firstValue(asRecord(source.analysis).risks, asRecord(source.diagnosis).risks),
    recommendations: firstValue(asRecord(source.analysis).recommendations, source.finalRecommendation),
  });
  const businessContext = cleanRecord({
    ...asRecord(source.businessContext),
    summary: firstValue(asRecord(source.businessContext).summary, asRecord(source.clientProfile).summary),
    audience: firstValue(asRecord(source.businessContext).audience, asRecord(source.clientProfile).audience),
    mainObjective: firstValue(asRecord(source.businessContext).mainObjective, asRecord(source.clientProfile).objective),
  });

  const output: AdaptedPortalOutput = {
    ...source,
    schemaVersion: LIKELI_PORTAL_SCHEMA_VERSION,
    generatedAt: String(meta.generatedAt || createdAt),
    portal,
    businessContext,
    analysis,
    modules,
    meta,
    clientProfile: cleanRecord({ ...asRecord(source.clientProfile), businessName: portal.businessName, clientName: portal.clientName }),
    plan: {
      ...legacyPlan,
      id: plan,
      planId: plan,
      label: rules.label,
      requiredCounts: {
        contentIdeas: rules.ideas,
        hooks: rules.hooks,
        captions: rules.captions,
        ctas: rules.ctas,
        trends: rules.trends,
        opportunities: rules.opportunities,
        scripts: rules.scripts,
      },
    },
    executiveSummary: asRecord(source.executiveSummary),
    diagnosis: asRecord(source.diagnosis),
    contentIdeas: ideas,
    hooksLibrary: hooks,
    captionsLibrary: captions,
    ctaLibrary: ctas,
    trends,
    opportunities,
    scripts: scriptsWithDates,
    predictions: rules.predictions ? normalizeEnabledSection(source.predictions, true) : { enabled: false, items: [] },
    likeliScore: rules.likeliScore ? normalizeEnabledSection(source.likeliScore, true) : { enabled: false },
    benchmarks: { enabled: rules.benchmarks, items: benchmarks },
    contentCalendar: calendar,
    monthlyRoadmap: roadmap,
    prioritizationMatrix: normalizeItems(source.prioritizationMatrix, "priority"),
    reviewChecklists: asRecord(source.reviewChecklists),
    finalRecommendation: asRecord(source.finalRecommendation),
    caseLibraries,
    successCases: caseLibraries.successCases,
    failureCases: caseLibraries.failureCases,
  };

  addQuantityWarnings(modules, plan, warnings);
  return { output, warnings };
}

export function validatePortalOutput(input: unknown) {
  const source = asRecord(input);
  const errors: string[] = [];
  const warnings: PortalAdapterWarning[] = [];
  if (!Object.keys(source).length) errors.push("El output debe ser un objeto JSON.");

  const hasPlan = Boolean(
    firstValue(asRecord(source.portal).plan, asRecord(source.plan).id, asRecord(source.plan).planId, source.plan, source.activePlan),
  );
  if (!hasPlan) errors.push("Falta portal.plan o un plan detectable.");
  if (!source.schemaVersion) warnings.push({ code: "legacy_schema", message: "El JSON no declara schemaVersion; se importara mediante compatibilidad legacy." });
  else if (source.schemaVersion !== LIKELI_PORTAL_SCHEMA_VERSION) {
    warnings.push({ code: "schema_version", message: `Se normalizara ${String(source.schemaVersion)} a ${LIKELI_PORTAL_SCHEMA_VERSION}.` });
  }

  const modules = asRecord(source.modules);
  for (const [key, names] of Object.entries(aliases)) {
    const existing = firstValue(...names.map((name) => modules[name]), ...names.map((name) => source[name]));
    if (existing !== undefined && !Array.isArray(existing) && !isPlainObject(existing)) {
      warnings.push({ code: "invalid_module", path: `modules.${key}`, message: `${key} no es una coleccion valida y se normalizara a [].` });
    }
  }
  return { ok: errors.length === 0, errors, warnings };
}

export function generateCalendarFromScripts({
  scripts,
  plan,
  createdAt,
}: {
  scripts: PortalDataItem[];
  plan: unknown;
  createdAt?: string;
}) {
  const canonicalPlan = normalizeCanonicalPlan(plan);
  const limit = PORTAL_PLAN_RULES[canonicalPlan].scripts;
  if (!limit) return [];
  const selected = scripts.slice(0, limit);
  const start = parseDate(createdAt) || new Date();
  const candidates = Array.from({ length: 30 }, (_, offset) => addDays(start, offset))
    .filter((date) => date.getDay() !== 0);
  const used = new Set<string>();

  return selected.map((script, index) => {
    const format = text(firstValue(script.format, script.formato));
    const target = selected.length === 1 ? 0 : Math.round(index * (candidates.length - 1) / (selected.length - 1));
    const date = findAvailableDate(candidates, target, used, isLightFormat(format));
    used.add(dateOnly(date));
    return cleanRecord({
      id: `calendar_${String(index + 1).padStart(3, "0")}`,
      date: dateOnly(date),
      dayName: new Intl.DateTimeFormat("es-CO", { weekday: "long" }).format(date),
      week: `Semana ${Math.floor(daysBetween(start, date) / 7) + 1}`,
      scriptId: script.id,
      scriptTitle: firstValue(script.title, script.name),
      linkedIdeaId: script.linkedIdeaId,
      linkedIdeaTitle: firstValue(script.linkedIdeaTitle, script.ideaTitle),
      format,
      objective: script.objective,
      cta: script.cta,
      priority: script.priority,
      recommendedTime: script.recommendedTime,
      status: "recommended",
    });
  });
}

function normalizeCalendar(
  items: PortalDataItem[],
  scripts: PortalDataItem[],
  ideas: PortalDataItem[],
  createdAt: string,
  plan: unknown,
  warnings: PortalAdapterWarning[],
) {
  const scriptById = new Map(scripts.map((script) => [key(script.id), script]));
  const ideaById = new Map(ideas.map((idea) => [key(idea.id), idea]));
  const start = parseDate(createdAt) || new Date();
  const end = addDays(start, 29);
  const usedScripts = new Set<string>();
  const valid = items.flatMap((item, index) => {
    const scriptId = text(firstValue(item.scriptId, item.relatedScriptId, item.linkedScriptId));
    const script = scriptById.get(key(scriptId));
    if (!script || usedScripts.has(key(scriptId))) {
      warnings.push({ code: "invalid_calendar_script", path: `modules.calendar.${index}`, message: "Se omitio un item de calendario sin scriptId valido." });
      return [];
    }
    const rawDate = parseDate(firstValue(item.date, item.publishDate, item.recommendedDate));
    const date = rawDate && rawDate >= start && rawDate <= end ? adjustPublishDate(rawDate, text(script.format)) : null;
    if (!date) return [];
    usedScripts.add(key(scriptId));
    const linkedIdeaId = text(script.linkedIdeaId);
    const linkedIdea = ideaById.get(key(linkedIdeaId));
    return [cleanRecord({
      ...item,
      id: item.id || `calendar_${String(index + 1).padStart(3, "0")}`,
      date: dateOnly(date),
      dayName: new Intl.DateTimeFormat("es-CO", { weekday: "long" }).format(date),
      scriptId: script.id,
      scriptTitle: firstValue(item.scriptTitle, script.title),
      linkedIdeaId,
      linkedIdeaTitle: firstValue(item.linkedIdeaTitle, script.linkedIdeaTitle, linkedIdea?.title),
      format: firstValue(item.format, script.format),
      status: "recommended",
    })];
  });

  if (valid.length === scripts.length || scripts.length === 0) return valid;
  warnings.push({ code: "calendar_generated", message: "El calendario faltante o invalido se regenero a partir de los guiones." });
  return generateCalendarFromScripts({ scripts, plan, createdAt });
}

function connectScriptsToIdeas(scripts: PortalDataItem[], ideas: PortalDataItem[], warnings: PortalAdapterWarning[]) {
  const byId = new Map(ideas.map((idea) => [key(idea.id), idea]));
  const byTitle = new Map(ideas.map((idea) => [key(firstValue(idea.title, idea.name)), idea]));
  return scripts.flatMap((script, index) => {
    const requestedId = firstValue(
      script.linkedIdeaId,
      script.ideaId,
      script.relatedIdeaId,
      firstArrayValue(script.relatedIdeaIds),
      asRecord(script.idea).id,
    );
    const requestedTitle = firstValue(script.linkedIdeaTitle, script.ideaTitle, asRecord(script.idea).title);
    const idea = byId.get(key(requestedId)) || byTitle.get(key(requestedTitle)) || (scripts.length <= ideas.length ? ideas[index] : undefined);
    if (!idea) {
      warnings.push({ code: "orphan_script", path: `modules.scripts.${index}`, message: "Se omitio un guion que no pudo conectarse con una idea." });
      return [];
    }
    return [cleanRecord({
      ...script,
      linkedIdeaId: idea.id,
      linkedIdeaTitle: firstValue(idea.title, idea.name),
    })];
  });
}

function applyCalendarToScripts(scripts: PortalDataItem[], calendar: PortalDataItem[]) {
  const byScript = new Map(calendar.map((item) => [key(item.scriptId), item]));
  return scripts.map((script) => {
    const item = byScript.get(key(script.id));
    return item ? cleanRecord({ ...script, recommendedDate: item.date, recommendedTime: firstValue(item.recommendedTime, script.recommendedTime) }) : script;
  });
}

function normalizeCaseLibraries(modules: Record<string, unknown>, source: Record<string, unknown>) {
  const library = asRecord(firstValue(modules.caseLibraries, source.caseLibraries));
  return {
    successCases: normalizeItems(firstValue(library.successCases, modules.successCases, source.successCases), "success"),
    failureCases: normalizeItems(firstValue(library.failureCases, modules.failureCases, source.failureCases), "failure"),
  };
}

function readModule(modules: Record<string, unknown>, source: Record<string, unknown>, names: readonly string[]) {
  return firstValue(...names.map((name) => modules[name]), ...names.map((name) => source[name]));
}

function normalizeItems(value: unknown, prefix: string): PortalDataItem[] {
  const raw = flattenCollection(value);
  const used = new Set<string>();
  return raw.flatMap((item, index) => {
    const record = isPlainObject(item) ? item : scalarItem(item, prefix);
    const cleaned = cleanRecord(record);
    if (!Object.keys(cleaned).length) return [];
    const fallback = `${prefix}_${String(index + 1).padStart(3, "0")}`;
    let id = text(cleaned.id) || fallback;
    if (used.has(id)) id = fallback;
    used.add(id);
    return [{ ...cleaned, id }];
  });
}

function flattenCollection(value: unknown): unknown[] {
  if (Array.isArray(value)) return value;
  if (!isPlainObject(value)) return value == null ? [] : [value];
  if (Array.isArray(value.items)) return value.items;
  return Object.entries(value).flatMap(([category, entries]) => {
    if (!Array.isArray(entries)) return [];
    return entries.map((entry) => isPlainObject(entry) ? { category, ...entry } : { category, text: entry });
  });
}

function scalarItem(value: unknown, prefix: string) {
  if (prefix === "hook") return { text: value };
  if (prefix === "caption") return { text: value };
  if (prefix === "cta") return { text: value };
  return { title: value };
}

function normalizeEnabledSection(value: unknown, enabled: boolean) {
  const record = asRecord(value);
  return cleanRecord({ ...record, enabled, items: normalizeItems(record.items, "item") });
}

function addQuantityWarnings(modules: CanonicalPortalModules, plan: keyof typeof PORTAL_PLAN_RULES, warnings: PortalAdapterWarning[]) {
  const rules = PORTAL_PLAN_RULES[plan];
  const counts = {
    ideas: rules.ideas,
    hooks: rules.hooks,
    captions: rules.captions,
    ctas: rules.ctas,
    trends: rules.trends,
    opportunities: rules.opportunities,
    scripts: rules.scripts,
  };
  for (const [field, expected] of Object.entries(counts)) {
    const actual = modules[field as keyof typeof counts].length;
    if (actual < expected) warnings.push({ code: "plan_quantity", path: `modules.${field}`, message: `${field}: ${actual}/${expected} entregables del plan.` });
  }
}

function cleanRecord(value: Record<string, unknown>): PortalDataItem {
  return Object.fromEntries(
    Object.entries(value).flatMap(([name, item]) => {
      const cleaned = cleanValue(item);
      return cleaned === undefined ? [] : [[name, cleaned]];
    }),
  );
}

function cleanValue(value: unknown): unknown {
  if (value == null) return undefined;
  if (typeof value === "string") {
    const trimmed = value.trim();
    return !trimmed || /^(n\/a|na|undefined|null|no especificado|sin dato)$/i.test(trimmed) ? undefined : trimmed;
  }
  if (Array.isArray(value)) return value.map(cleanValue).filter((item) => item !== undefined);
  if (isPlainObject(value)) {
    const record = cleanRecord(value);
    return Object.keys(record).length ? record : undefined;
  }
  return value;
}

function adjustPublishDate(date: Date, format: string) {
  if (date.getDay() === 0) return addDays(date, 1);
  if (date.getDay() === 6 && !isLightFormat(format)) return addDays(date, 2);
  return date;
}

function findAvailableDate(dates: Date[], target: number, used: Set<string>, allowSaturday: boolean) {
  for (let distance = 0; distance < dates.length; distance += 1) {
    for (const index of [target + distance, target - distance]) {
      const date = dates[index];
      if (!date || used.has(dateOnly(date)) || (date.getDay() === 6 && !allowSaturday)) continue;
      return date;
    }
  }
  return dates[Math.min(target, dates.length - 1)] || new Date();
}

function isLightFormat(value: string) {
  return /historia|story|stories|liger[ao]|light/i.test(value);
}

function parseDate(value: unknown) {
  if (value instanceof Date && !Number.isNaN(value.getTime())) return startOfDay(value);
  if (typeof value !== "string" && typeof value !== "number") return null;
  const parsed = new Date(typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value) ? `${value}T00:00:00` : value);
  return Number.isNaN(parsed.getTime()) ? null : startOfDay(parsed);
}

function validIsoDate(value: unknown) {
  const date = parseDate(value);
  return date ? date.toISOString() : "";
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

function dateOnly(value: Date | string) {
  const date = value instanceof Date ? value : parseDate(value);
  if (!date) return "";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function firstValue(...values: unknown[]) {
  return values.find((value) => value !== undefined && value !== null && value !== "");
}

function firstArrayValue(value: unknown) {
  return Array.isArray(value) ? value[0] : undefined;
}

function asRecord(value: unknown): Record<string, unknown> {
  return isPlainObject(value) ? value : {};
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function text(value: unknown) {
  return value == null ? "" : String(value).trim();
}

function key(value: unknown) {
  return text(value).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}
