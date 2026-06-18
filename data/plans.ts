import type { PortalPlanId } from "@/types/likeliPortalOutput";
import { PORTAL_PLAN_RULES } from "@/lib/portalSchema";

export const planOrder: PortalPlanId[] = ["signals", "signals-pro", "signals-elite"];

export const plans = {
  signals: {
    id: "signals",
    name: "SIGNALS",
    price: "199.000 COP / mes",
    level: "Base",
    objective: "Claridad mensual sobre que publicar, con ideas y senales listas para ejecutar.",
    deliverables: toDeliverables(PORTAL_PLAN_RULES.signals),
  },
  "signals-pro": {
    id: "signals-pro",
    name: "SIGNALS PRO",
    price: "599.000 COP / mes",
    level: "Pro",
    objective: "Estrategia avanzada para priorizar, validar y organizar contenido antes de producir.",
    deliverables: toDeliverables(PORTAL_PLAN_RULES.signals_pro),
  },
  "signals-elite": {
    id: "signals-elite",
    name: "SIGNALS ELITE",
    price: "1.199.000 COP / mes",
    level: "Elite",
    objective: "Inteligencia avanzada con mayor volumen de entregables y foco operativo.",
    deliverables: toDeliverables(PORTAL_PLAN_RULES.signals_elite),
  },
} satisfies Record<PortalPlanId, {
  id: PortalPlanId;
  name: string;
  price: string;
  level: string;
  objective: string;
  deliverables: Record<string, number>;
}>;

function toDeliverables(rules: (typeof PORTAL_PLAN_RULES)[keyof typeof PORTAL_PLAN_RULES]) {
  return {
    contentIdeas: rules.ideas,
    hooks: rules.hooks,
    captions: rules.captions,
    ctas: rules.ctas,
    trends: rules.trends,
    opportunities: rules.opportunities,
    scripts: rules.scripts,
  };
}

export function getPlan(planId?: string) {
  return plans[(planId as PortalPlanId) || "signals"] || plans.signals;
}
