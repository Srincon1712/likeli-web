import type { PortalPlanId } from "@/types/likeliPortalOutput";

export const planOrder: PortalPlanId[] = ["signals", "signals-pro", "signals-elite"];

export const plans = {
  signals: {
    id: "signals",
    name: "SIGNALS",
    price: "199.000 COP / mes",
    level: "Base",
    objective: "Claridad mensual sobre que publicar, con ideas y senales listas para ejecutar.",
    deliverables: { contentIdeas: 20, hooks: 20, captions: 20, ctas: 20, trends: 4, opportunities: 4, scripts: 0 },
  },
  "signals-pro": {
    id: "signals-pro",
    name: "SIGNALS PRO",
    price: "599.000 COP / mes",
    level: "Pro",
    objective: "Estrategia avanzada para priorizar, validar y organizar contenido antes de producir.",
    deliverables: { contentIdeas: 30, hooks: 30, captions: 30, ctas: 30, trends: 4, opportunities: 4, scripts: 12 },
  },
  "signals-elite": {
    id: "signals-elite",
    name: "SIGNALS ELITE",
    price: "1.199.000 COP / mes",
    level: "Elite",
    objective: "Inteligencia avanzada con mayor volumen de entregables y foco operativo.",
    deliverables: { contentIdeas: 40, hooks: 40, captions: 40, ctas: 40, trends: 4, opportunities: 4, scripts: 16 },
  },
} satisfies Record<PortalPlanId, {
  id: PortalPlanId;
  name: string;
  price: string;
  level: string;
  objective: string;
  deliverables: Record<string, number>;
}>;

export function getPlan(planId?: string) {
  return plans[(planId as PortalPlanId) || "signals"] || plans.signals;
}
