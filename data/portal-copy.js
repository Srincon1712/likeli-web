window.LikeliPortal = window.LikeliPortal || {};

const navigationItems = [
  { id: "inicio", label: "Inicio", icon: "/icons/home.svg" },
  { id: "ideas", label: "Ideas", icon: "/icons/ideas.svg" },
  { id: "hooks", label: "Hooks", icon: "/icons/hooks.svg" },
  { id: "captions", label: "Captions", icon: "/icons/libraries.svg" },
  { id: "ctas", label: "CTAs", icon: "/icons/ctas.svg" },
  { id: "tendencias", label: "Tendencias", icon: "/icons/trends.svg" },
  { id: "oportunidades", label: "Oportunidades", icon: "/icons/opportunities.svg" },
  { id: "guiones", label: "Guiones", icon: "/icons/libraries.svg" },
  { id: "benchmarks", label: "Benchmarks", icon: "/icons/benchmarks.svg" },
  { id: "calendario", label: "Calendario", icon: "/icons/calendar.svg" },
  { id: "roadmap", label: "Roadmap", icon: "/icons/roadmap.svg" },
  { id: "priorizacion", label: "Priorizacion", icon: "/icons/opportunities.svg" },
  { id: "checklists", label: "Checklists", icon: "/icons/settings.svg" },
  { id: "recomendacion", label: "Recomendacion", icon: "/icons/home.svg" },
  { id: "plan", label: "Configuracion / Plan", icon: "/icons/settings.svg" },
];

const statusLabels = {
  active: "Activo",
  review: "En revision",
  paused: "Pausado",
};

window.LikeliPortal.navigationItems = navigationItems;
window.LikeliPortal.statusLabels = statusLabels;
