import type { CanonicalPlanId, PortalPlanRules } from "@/types/portalSchema";
import type { PortalPlanId } from "@/types/likeliPortalOutput";

export const PORTAL_PLAN_RULES: Record<CanonicalPlanId, PortalPlanRules> = {
  signals: {
    label: "Signals",
    ideas: 20,
    hooks: 20,
    captions: 20,
    ctas: 20,
    trends: 4,
    opportunities: 4,
    scripts: 0,
    predictions: false,
    likeliScore: false,
    benchmarks: false,
    calendar: false,
    roadmap: false,
    caseLibraries: false,
  },
  signals_pro: {
    label: "Signals Pro",
    ideas: 30,
    hooks: 30,
    captions: 30,
    ctas: 30,
    trends: 4,
    opportunities: 4,
    scripts: 12,
    predictions: true,
    likeliScore: true,
    benchmarks: true,
    calendar: true,
    roadmap: true,
    caseLibraries: true,
  },
  signals_elite: {
    label: "Signals Elite",
    ideas: 40,
    hooks: 40,
    captions: 40,
    ctas: 40,
    trends: 4,
    opportunities: 4,
    scripts: 16,
    predictions: true,
    likeliScore: true,
    benchmarks: true,
    calendar: true,
    roadmap: true,
    caseLibraries: true,
  },
};

export function normalizeCanonicalPlan(value: unknown): CanonicalPlanId {
  const normalized = String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, "_");

  if (["signals_pro", "signal_pro", "pro"].includes(normalized)) return "signals_pro";
  if (["signals_elite", "signal_elite", "elite"].includes(normalized)) return "signals_elite";
  return "signals";
}

export function canonicalToPortalPlan(value: unknown): PortalPlanId {
  const plan = normalizeCanonicalPlan(value);
  if (plan === "signals_pro") return "signals-pro";
  if (plan === "signals_elite") return "signals-elite";
  return "signals";
}

export function portalToCanonicalPlan(value: unknown): CanonicalPlanId {
  return normalizeCanonicalPlan(value);
}
