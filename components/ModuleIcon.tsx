"use client";

import {
  BadgeCheck,
  BarChart3,
  CalendarDays,
  Clapperboard,
  Home,
  Layers,
  Lightbulb,
  Magnet,
  MousePointerClick,
  Route,
  Target,
  Text,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";

const iconByView: Record<string, LucideIcon> = {
  inicio: Home,
  ideas: Lightbulb,
  hooks: Magnet,
  captions: Text,
  ctas: MousePointerClick,
  tendencias: TrendingUp,
  oportunidades: Target,
  guiones: Clapperboard,
  benchmarks: BarChart3,
  calendario: CalendarDays,
  roadmap: Route,
  plan: BadgeCheck,
};

export function ModuleIcon({ view, size = 17 }: { view: string; size?: number }) {
  const Icon = iconByView[view] || Layers;
  return <Icon aria-hidden="true" size={size} strokeWidth={2} />;
}
