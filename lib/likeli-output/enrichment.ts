import type { LikeliClientPortalOutput, LikeliOutputItem } from "@/types/likeliPortalOutput";

export interface EnrichedScript {
  script: LikeliOutputItem;
  idea?: LikeliOutputItem;
  hook?: LikeliOutputItem;
  caption?: LikeliOutputItem;
  cta?: LikeliOutputItem;
  prediction?: LikeliOutputItem;
  prioritization?: LikeliOutputItem;
  score?: unknown;
  scoreLabel?: unknown;
}

export interface EnrichedCalendarItem {
  item: LikeliOutputItem;
  date: Date;
  dateLabel: string;
  dayLabel: string;
  script?: EnrichedScript;
  hook?: LikeliOutputItem;
  caption?: LikeliOutputItem;
  cta?: LikeliOutputItem;
}

export function buildEnrichedScripts(output: Partial<LikeliClientPortalOutput>): EnrichedScript[] {
  const scripts = asItems(output.scripts);
  const ideas = asItems(output.contentIdeas);
  const hooks = asItems(output.hooksLibrary);
  const captions = asItems(output.captionsLibrary);
  const ctas = asItems(output.ctaLibrary);
  const predictions = asItems(output.predictions?.items);
  const prioritization = asItems(output.prioritizationMatrix);

  return scripts.map((script, index) => {
    const idea = matchRelated(script, ideas, index);
    const hook = matchRelated(script, hooks, index, idea);
    const caption = matchRelated(script, captions, index, idea);
    const cta = matchRelated(script, ctas, index, idea);
    const prediction = matchRelated(script, predictions, index, idea, true);
    const priority = matchRelated(script, prioritization, index, idea);

    return {
      script,
      idea,
      hook,
      caption,
      cta,
      prediction,
      prioritization: priority,
      score: firstDefined(script.score, script.likeliScore, script.pieceScore, priority?.score, priority?.likeliScore),
      scoreLabel: firstDefined(script.scoreLabel, script.potentialLabel, priority?.scoreLabel, priority?.priority, priority?.label),
    };
  });
}

export function buildEnrichedCalendar(
  output: Partial<LikeliClientPortalOutput>,
  options: { importedAt?: string; startDate?: string | Date; frequency?: string } = {},
) {
  const sortedItems = [...asItems(output.contentCalendar)].sort((a, b) => numericDay(a) - numericDay(b));
  const scripts = buildEnrichedScripts(output);
  const startDate = normalizeDate(options.startDate || findStartDate(output) || options.importedAt) || new Date();

  return sortedItems.map((item, index) => {
    const date = getRecommendedPublishDate({ calendarItem: item, index, startDate, plan: output.plan, frequency: options.frequency });
    const script = matchCalendarScript(item, scripts, index);

    return {
      item,
      date,
      dateLabel: formatPublishDate(date),
      dayLabel: `Dia ${numericDay(item) || index + 1}`,
      script,
      hook: script?.hook || matchRelated(item, asItems(output.hooksLibrary), index, script?.idea),
      caption: script?.caption || matchRelated(item, asItems(output.captionsLibrary), index, script?.idea),
      cta: script?.cta || matchRelated(item, asItems(output.ctaLibrary), index, script?.idea),
    };
  });
}

export function getRecommendedPublishDate({
  calendarItem,
  index,
  startDate,
}: {
  calendarItem: LikeliOutputItem;
  index: number;
  startDate: string | Date;
  plan?: unknown;
  frequency?: string;
}) {
  const explicitDate = normalizeDate(
    firstDefined(calendarItem.date, calendarItem.publishDate, calendarItem.recommendedDate, calendarItem.scheduledDate),
  );
  if (explicitDate) return explicitDate;

  const baseDate = normalizeDate(startDate) || new Date();
  const date = new Date(baseDate);
  date.setDate(baseDate.getDate() + index);
  return date;
}

function matchCalendarScript(item: LikeliOutputItem, scripts: EnrichedScript[], index: number) {
  const explicit = scripts.find(({ script, idea }) => hasExplicitRelation(item, script) || (idea ? hasExplicitRelation(item, idea) : false));
  if (explicit) return explicit;
  return scripts.length === asNumber(item.day) ? undefined : scripts[index];
}

function matchRelated(
  source: LikeliOutputItem,
  candidates: LikeliOutputItem[],
  index: number,
  relatedIdea?: LikeliOutputItem,
  allowFormatMatch = false,
) {
  if (!candidates.length) return undefined;

  const explicit = candidates.find((candidate) => {
    if (hasExplicitRelation(source, candidate)) return true;
    if (relatedIdea && hasExplicitRelation(candidate, relatedIdea)) return true;
    return relatedIdea ? hasExplicitRelation(source, relatedIdea) && sameId(candidate.itemId, relatedIdea.id) : false;
  });
  if (explicit) return explicit;

  if (allowFormatMatch) {
    const byFormat = candidates.find((candidate) => {
      const candidateType = normalizeKey(firstDefined(candidate.contentType, candidate.format, candidate.bestForFormat));
      const sourceType = normalizeKey(firstDefined(source.contentType, source.format, source.bestForFormat));
      return candidateType && sourceType && candidateType === sourceType;
    });
    if (byFormat) return byFormat;
  }

  return candidates.length === 1 || candidates.length === asNumber(source.totalItems) || candidates.length > index ? candidates[index] : undefined;
}

function hasExplicitRelation(a: LikeliOutputItem, b: LikeliOutputItem) {
  const aIds = relationIds(a);
  const bIds = relationIds(b);
  return aIds.some((id) => bIds.includes(id));
}

function relationIds(item: LikeliOutputItem) {
  const linkedIdea = asRecord(firstDefined(item.idea, item.linkedIdea, item.relatedIdea, item.sourceIdea, item.parentIdea));
  return [
    item.id,
    item.title,
    item.name,
    item.itemId,
    item.ideaId,
    item.linkedIdeaId,
    item.idea_id,
    item.ideaTitle,
    item.tituloIdea,
    item.ideaRelacionada,
    item.contentIdeaId,
    item.relatedIdeaId,
    item.relatedScriptId,
    item.scriptId,
    linkedIdea.id,
    linkedIdea.title,
    linkedIdea.name,
    ...asArray(item.relatedIdeaIds),
    ...asArray(item.relatedScriptIds),
  ]
    .map((value) => normalizeKey(value))
    .filter(Boolean);
}

function findStartDate(output: Partial<LikeliClientPortalOutput>) {
  return firstDefined(
    output.meta?.calendarStartDate,
    output.meta?.startDate,
    output.meta?.recommendedStartDate,
    output.meta?.importedAt,
  );
}

function normalizeDate(value: unknown) {
  if (!value) return null;
  if (value instanceof Date && !Number.isNaN(value.getTime())) return value;
  if (typeof value !== "string" && typeof value !== "number") return null;
  const parsed = new Date(typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value) ? `${value}T00:00:00` : value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function formatPublishDate(date: Date) {
  return new Intl.DateTimeFormat("es-CO", { weekday: "short", day: "numeric", month: "short" })
    .format(date)
    .replace(".", "");
}

function numericDay(item: LikeliOutputItem) {
  return asNumber(item.day) || 9999;
}

function asItems(value: unknown): LikeliOutputItem[] {
  return Array.isArray(value) ? (value as LikeliOutputItem[]) : [];
}

function asRecord(value: unknown): LikeliOutputItem {
  return value && typeof value === "object" && !Array.isArray(value) ? value as LikeliOutputItem : {};
}

function asArray(value: unknown) {
  return Array.isArray(value) ? value : value == null ? [] : [value];
}

function asNumber(value: unknown) {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}

function sameId(a: unknown, b: unknown) {
  return normalizeKey(a) === normalizeKey(b);
}

function normalizeKey(value: unknown) {
  return value == null ? "" : String(value).trim().toLowerCase();
}

function firstDefined(...values: unknown[]) {
  return values.find((value) => value !== undefined && value !== null && value !== "");
}
