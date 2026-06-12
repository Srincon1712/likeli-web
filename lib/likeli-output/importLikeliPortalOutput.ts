import type { LikeliClientPortalOutput, OutputPlanId, PortalPlanId } from "@/types/likeliPortalOutput";

const outputPlanIds = new Set(["signals", "signals_pro", "signals_elite"]);
export const portalToOutputPlan: Record<PortalPlanId, OutputPlanId> = {
  signals: "signals",
  "signals-pro": "signals_pro",
  "signals-elite": "signals_elite",
};

export const planRequirements = {
  signals: { contentIdeas: 20, hooksLibrary: 20, captionsLibrary: 20, ctaLibrary: 20, trends: 4, opportunities: 4, scripts: 0, premium: false },
  signals_pro: { contentIdeas: 30, hooksLibrary: 30, captionsLibrary: 30, ctaLibrary: 30, trends: 4, opportunities: 4, scripts: 12, premium: true },
  signals_elite: { contentIdeas: 40, hooksLibrary: 40, captionsLibrary: 40, ctaLibrary: 40, trends: 4, opportunities: 4, scripts: 16, premium: true },
};

const arrayFields = [
  "trends",
  "opportunities",
  "contentIdeas",
  "hooksLibrary",
  "captionsLibrary",
  "ctaLibrary",
  "scripts",
  "contentCalendar",
  "monthlyRoadmap",
  "prioritizationMatrix",
] as const;

const objectFields = [
  "meta",
  "clientProfile",
  "plan",
  "executiveSummary",
  "diagnosis",
  "predictions",
  "likeliScore",
  "benchmarks",
  "reviewChecklists",
  "finalRecommendation",
] as const;

const idPrefixes: Record<(typeof arrayFields)[number], string> = {
  contentIdeas: "idea",
  hooksLibrary: "hook",
  captionsLibrary: "caption",
  ctaLibrary: "cta",
  trends: "trend",
  opportunities: "opportunity",
  scripts: "script",
  contentCalendar: "calendar",
  monthlyRoadmap: "roadmap",
  prioritizationMatrix: "priority",
};

export function extractJsonFromText(input: string) {
  const text = String(input || "").trim();
  if (!text) throw new Error("No se pudo leer el JSON. Verifica que el texto sea un JSON valido.");

  const fencedMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const source = (fencedMatch ? fencedMatch[1] : text).trim();
  if (source.startsWith("{") && source.endsWith("}")) return source;

  const start = source.indexOf("{");
  if (start === -1) throw new Error("No se pudo leer el JSON. Verifica que el texto sea un JSON valido.");

  let depth = 0;
  let inString = false;
  let escaped = false;

  for (let index = start; index < source.length; index += 1) {
    const char = source[index];
    if (escaped) {
      escaped = false;
      continue;
    }
    if (char === "\\") {
      escaped = inString;
      continue;
    }
    if (char === '"') {
      inString = !inString;
      continue;
    }
    if (inString) continue;
    if (char === "{") depth += 1;
    if (char === "}") {
      depth -= 1;
      if (depth === 0) return source.slice(start, index + 1);
    }
  }

  throw new Error("No se pudo leer el JSON. Verifica que el texto sea un JSON valido.");
}

export function parseLikeliPortalOutput(input: string) {
  try {
    return JSON.parse(extractJsonFromText(input)) as LikeliClientPortalOutput;
  } catch {
    throw new Error("No se pudo leer el JSON. Verifica que el texto sea un JSON valido.");
  }
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function getOutputPlanId(data: LikeliClientPortalOutput) {
  return String(data?.plan?.id || data?.plan?.planId || "");
}

export function validateLikeliPortalOutput(data: LikeliClientPortalOutput) {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!isPlainObject(data)) {
    return { ok: false, errors: ["El output debe ser un objeto JSON."], warnings, data: null };
  }

  if (!isPlainObject(data.meta)) {
    errors.push("Falta meta.");
  } else {
    if (data.meta.outputType !== "LIKELI_CLIENT_PORTAL_OUTPUT") errors.push("outputType incorrecto. Debe ser LIKELI_CLIENT_PORTAL_OUTPUT.");
    if (data.meta.version !== "1.0") errors.push("Version no soportada. Debe ser 1.0.");
  }

  const planId = getOutputPlanId(data);
  if (!outputPlanIds.has(planId)) errors.push("plan.id debe ser signals, signals_pro o signals_elite.");

  arrayFields.forEach((field) => {
    if (!Array.isArray(data[field])) errors.push(`${field} debe ser array.`);
  });

  objectFields.forEach((field) => {
    if (data[field] == null) warnings.push(`${field} esta vacio y sera normalizado.`);
  });

  if (outputPlanIds.has(planId)) validatePlanQuantities(data, planId as OutputPlanId, errors);

  return { ok: errors.length === 0, errors, warnings, data };
}

function validatePlanQuantities(data: LikeliClientPortalOutput, planId: OutputPlanId, errors: string[]) {
  const requirements = planRequirements[planId];
  (["contentIdeas", "hooksLibrary", "captionsLibrary", "ctaLibrary", "trends", "opportunities"] as const).forEach((field) => {
    const length = data[field]?.length || 0;
    if (length < requirements[field]) errors.push(`${field} tiene menos items que el minimo del plan (${length}/${requirements[field]}).`);
  });

  if (planId === "signals") {
    if ((data.scripts?.length || 0) > 0) errors.push("Signals debe tener scripts vacio.");
    if (data.predictions?.enabled === true) errors.push("Signals debe tener predictions.enabled en false.");
    if (data.likeliScore?.enabled === true) errors.push("Signals debe tener likeliScore.enabled en false.");
    if (data.benchmarks?.enabled === true) errors.push("Signals debe tener benchmarks.enabled en false.");
    if ((data.contentCalendar?.length || 0) > 0) errors.push("Signals debe tener contentCalendar vacio.");
    if ((data.monthlyRoadmap?.length || 0) > 0) errors.push("Signals debe tener monthlyRoadmap vacio.");
    return;
  }

  if ((data.scripts?.length || 0) < requirements.scripts) errors.push(`scripts tiene menos items que el minimo del plan (${data.scripts?.length || 0}/${requirements.scripts}).`);
  if (data.predictions?.enabled !== true) errors.push(`${planId} debe tener predictions.enabled en true.`);
  if (data.likeliScore?.enabled !== true) errors.push(`${planId} debe tener likeliScore.enabled en true.`);
  if (data.benchmarks?.enabled !== true) errors.push(`${planId} debe tener benchmarks.enabled en true.`);
  if ((data.contentCalendar?.length || 0) === 0) errors.push(`${planId} debe traer contentCalendar con contenido.`);
  if ((data.monthlyRoadmap?.length || 0) === 0) errors.push(`${planId} debe traer monthlyRoadmap con contenido.`);
}

function normalizeValue(value: unknown): unknown {
  if (value == null) return "";
  if (Array.isArray(value)) return value.map((item) => normalizeValue(item));
  if (isPlainObject(value)) return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, normalizeValue(item)]));
  return value;
}

function normalizeObject(value: unknown) {
  return isPlainObject(value) ? (normalizeValue(value) as Record<string, unknown>) : {};
}

function normalizeItemArray(value: unknown, prefix: string) {
  const items = Array.isArray(value) ? value : [];
  const usedIds = new Set<string>();
  return items.map((item, index) => {
    const normalized = isPlainObject(item) ? (normalizeValue(item) as Record<string, unknown>) : { value: normalizeValue(item) };
    const fallbackId = `${prefix}_${String(index + 1).padStart(3, "0")}`;
    const rawId = String(normalized.id || "").trim();
    const id = rawId && !usedIds.has(rawId) ? rawId : fallbackId;
    usedIds.add(id);
    return { ...normalized, id };
  });
}

export function normalizeLikeliPortalOutput(data: LikeliClientPortalOutput): LikeliClientPortalOutput {
  const output: LikeliClientPortalOutput = { ...data };
  objectFields.forEach((field) => {
    output[field] = normalizeObject(output[field]) as never;
  });
  arrayFields.forEach((field) => {
    output[field] = normalizeItemArray(output[field], idPrefixes[field]) as never;
  });
  output.plan = { ...output.plan, id: getOutputPlanId(output) };
  return output;
}

export function validatePlanCompatibility(outputPlanId: string, portalPlanId: PortalPlanId) {
  const normalizedPortalPlanId = portalToOutputPlan[portalPlanId];
  if (!outputPlanIds.has(outputPlanId)) return { ok: false, message: "El plan del JSON no es valido." };
  if (outputPlanId !== normalizedPortalPlanId) {
    return { ok: false, message: `El plan del JSON (${outputPlanId}) no coincide con el plan actual del portal (${portalPlanId}).` };
  }
  return { ok: true, message: "Plan compatible." };
}

export function buildImportPreview(output: LikeliClientPortalOutput, portalPlanId: PortalPlanId) {
  const portalOutputPlanId = portalToOutputPlan[portalPlanId];
  const requirements = planRequirements[portalOutputPlanId] || planRequirements.signals;
  const clientProfile = output.clientProfile || {};
  return {
    clientName: String(clientProfile.businessName || clientProfile.clientName || "No especificado"),
    outputPlanId: String(output.plan?.id || ""),
    outputPlanLabel: String(output.plan?.label || output.plan?.id || ""),
    portalPlanId,
    version: String(output.meta?.version || ""),
    generatedAt: String(output.meta?.generatedAt || ""),
    counts: {
      contentIdeas: output.contentIdeas?.length || 0,
      hooksLibrary: output.hooksLibrary?.length || 0,
      captionsLibrary: output.captionsLibrary?.length || 0,
      ctaLibrary: output.ctaLibrary?.length || 0,
      trends: output.trends?.length || 0,
      opportunities: output.opportunities?.length || 0,
      scripts: output.scripts?.length || 0,
    },
    requirements,
  };
}

export function readAndValidateLikeliPortalOutput(rawInput: string, portalPlanId: PortalPlanId) {
  const parsed = parseLikeliPortalOutput(rawInput);
  const validation = validateLikeliPortalOutput(parsed);
  if (!validation.ok || !validation.data) {
    return { ok: false, errors: validation.errors, warnings: validation.warnings, output: null, preview: null };
  }

  const normalized = normalizeLikeliPortalOutput(validation.data);
  const planCompatibility = validatePlanCompatibility(String(normalized.plan?.id || ""), portalPlanId);
  const preview = buildImportPreview(normalized, portalPlanId);
  if (!planCompatibility.ok) {
    return { ok: false, errors: [planCompatibility.message], warnings: validation.warnings, output: normalized, preview };
  }

  return { ok: true, errors: [], warnings: validation.warnings, output: normalized, preview };
}
