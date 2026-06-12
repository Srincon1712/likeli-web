import type { PortalPlanId } from "@/types/likeliPortalOutput";

export type PortalModuleId =
  | "contentIdeas"
  | "hooksLibrary"
  | "captionsLibrary"
  | "ctaLibrary"
  | "trends"
  | "opportunities"
  | "scripts"
  | "benchmarks"
  | "contentCalendar"
  | "monthlyRoadmap";

export interface PortalModule {
  id: PortalModuleId;
  view: string;
  title: string;
  description: string;
  plans: PortalPlanId[];
}

export const PORTAL_MODULES: PortalModule[] = [
  {
    id: "contentIdeas",
    view: "ideas",
    title: "Ideas de contenido",
    description: "Conceptos accionables para crear publicaciones con intencion estrategica.",
    plans: ["signals", "signals-pro", "signals-elite"],
  },
  {
    id: "hooksLibrary",
    view: "hooks",
    title: "Hooks",
    description: "Frases de apertura para captar atencion desde el primer segundo.",
    plans: ["signals", "signals-pro", "signals-elite"],
  },
  {
    id: "captionsLibrary",
    view: "captions",
    title: "Captions",
    description: "Textos listos para acompanar publicaciones y reforzar el mensaje.",
    plans: ["signals", "signals-pro", "signals-elite"],
  },
  {
    id: "ctaLibrary",
    view: "ctas",
    title: "CTAs",
    description: "Llamados a la accion para convertir interes en mensajes o reservas.",
    plans: ["signals", "signals-pro", "signals-elite"],
  },
  {
    id: "trends",
    view: "tendencias",
    title: "Tendencias",
    description: "Patrones detectados que pueden orientar la estrategia de contenido.",
    plans: ["signals", "signals-pro", "signals-elite"],
  },
  {
    id: "opportunities",
    view: "oportunidades",
    title: "Oportunidades",
    description: "Acciones recomendadas para crecer, diferenciarse o convertir mejor.",
    plans: ["signals", "signals-pro", "signals-elite"],
  },
  {
    id: "scripts",
    view: "guiones",
    title: "Guiones",
    description: "Centro de produccion con idea, hook, caption, CTA, prediccion y score por pieza.",
    plans: ["signals-pro", "signals-elite"],
  },
  {
    id: "benchmarks",
    view: "benchmarks",
    title: "Benchmarks",
    description: "Comparaciones y aprendizajes frente a patrones de exito o fracaso.",
    plans: ["signals-pro", "signals-elite"],
  },
  {
    id: "contentCalendar",
    view: "calendario",
    title: "Calendario de contenido",
    description: "Plan organizado de publicaciones y acciones recomendadas.",
    plans: ["signals-pro", "signals-elite"],
  },
  {
    id: "monthlyRoadmap",
    view: "roadmap",
    title: "Roadmap",
    description: "Ruta mensual para priorizar acciones y mejorar resultados.",
    plans: ["signals-pro", "signals-elite"],
  },
];

export function getModulesForPlan(planId: PortalPlanId) {
  return PORTAL_MODULES.filter((module) => module.plans.includes(planId));
}

export function getModuleByView(view: string) {
  return PORTAL_MODULES.find((module) => module.view === view) || PORTAL_MODULES[0];
}
