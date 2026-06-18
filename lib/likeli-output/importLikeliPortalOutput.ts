import { adaptPortalOutput, validatePortalOutput } from "@/lib/portalDataAdapter";
import { normalizeCanonicalPlan, PORTAL_PLAN_RULES, portalToCanonicalPlan } from "@/lib/portalSchema";
import type { LikeliClientPortalOutput, OutputPlanId, PortalPlanId } from "@/types/likeliPortalOutput";

export const portalToOutputPlan: Record<PortalPlanId, OutputPlanId> = {
  signals: "signals",
  "signals-pro": "signals_pro",
  "signals-elite": "signals_elite",
};

export const planRequirements = {
  signals: {
    contentIdeas: PORTAL_PLAN_RULES.signals.ideas,
    hooksLibrary: PORTAL_PLAN_RULES.signals.hooks,
    captionsLibrary: PORTAL_PLAN_RULES.signals.captions,
    ctaLibrary: PORTAL_PLAN_RULES.signals.ctas,
    trends: PORTAL_PLAN_RULES.signals.trends,
    opportunities: PORTAL_PLAN_RULES.signals.opportunities,
    scripts: 0,
    premium: false,
  },
  signals_pro: {
    contentIdeas: PORTAL_PLAN_RULES.signals_pro.ideas,
    hooksLibrary: PORTAL_PLAN_RULES.signals_pro.hooks,
    captionsLibrary: PORTAL_PLAN_RULES.signals_pro.captions,
    ctaLibrary: PORTAL_PLAN_RULES.signals_pro.ctas,
    trends: PORTAL_PLAN_RULES.signals_pro.trends,
    opportunities: PORTAL_PLAN_RULES.signals_pro.opportunities,
    scripts: PORTAL_PLAN_RULES.signals_pro.scripts,
    premium: true,
  },
  signals_elite: {
    contentIdeas: PORTAL_PLAN_RULES.signals_elite.ideas,
    hooksLibrary: PORTAL_PLAN_RULES.signals_elite.hooks,
    captionsLibrary: PORTAL_PLAN_RULES.signals_elite.captions,
    ctaLibrary: PORTAL_PLAN_RULES.signals_elite.ctas,
    trends: PORTAL_PLAN_RULES.signals_elite.trends,
    opportunities: PORTAL_PLAN_RULES.signals_elite.opportunities,
    scripts: PORTAL_PLAN_RULES.signals_elite.scripts,
    premium: true,
  },
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
    if (char === "}" && --depth === 0) return source.slice(start, index + 1);
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

export function validateLikeliPortalOutput(data: LikeliClientPortalOutput) {
  const validation = validatePortalOutput(data);
  return {
    ok: validation.ok,
    errors: validation.errors,
    warnings: validation.warnings.map((warning) => warning.message),
    data: validation.ok ? data : null,
  };
}

export function normalizeLikeliPortalOutput(data: LikeliClientPortalOutput, options: { createdAt?: string; plan?: unknown } = {}) {
  return adaptPortalOutput(data, options).output;
}

export function validatePlanCompatibility(outputPlanId: string, portalPlanId: PortalPlanId) {
  const outputPlan = normalizeCanonicalPlan(outputPlanId);
  const portalPlan = portalToCanonicalPlan(portalPlanId);
  if (outputPlan !== portalPlan) {
    return { ok: false, message: `El plan del JSON (${outputPlan}) no coincide con el plan actual del portal (${portalPlan}).` };
  }
  return { ok: true, message: "Plan compatible." };
}

export function buildImportPreview(output: LikeliClientPortalOutput, portalPlanId: PortalPlanId) {
  const outputPlanId = normalizeCanonicalPlan(output.portal?.plan || output.plan?.id);
  const requirements = planRequirements[portalToOutputPlan[portalPlanId]];
  const profile = output.portal || output.clientProfile || {};
  return {
    clientName: String(profile.businessName || profile.clientName || "No especificado"),
    outputPlanId,
    outputPlanLabel: PORTAL_PLAN_RULES[outputPlanId].label,
    portalPlanId,
    version: String(output.schemaVersion || output.meta?.version || ""),
    generatedAt: String(output.generatedAt || output.meta?.generatedAt || ""),
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
  const validation = validatePortalOutput(parsed);
  if (!validation.ok) {
    return {
      ok: false,
      errors: validation.errors,
      warnings: validation.warnings.map((warning) => warning.message),
      output: null,
      preview: null,
    };
  }

  const adapted = adaptPortalOutput(parsed, { plan: portalPlanId });
  const planCompatibility = validatePlanCompatibility(String(adapted.output.portal.plan || ""), portalPlanId);
  const warnings = [...validation.warnings, ...adapted.warnings].map((warning) => warning.message);
  const preview = buildImportPreview(adapted.output, portalPlanId);

  if (!planCompatibility.ok) {
    return { ok: false, errors: [planCompatibility.message], warnings, output: adapted.output, preview };
  }
  return { ok: true, errors: [], warnings, output: adapted.output, preview };
}
