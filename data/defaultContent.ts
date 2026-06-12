export const defaultContent = {
  contentIdeas: [
    {
      id: "idea-001",
      title: "Antes de elegir, revisa esto",
      concept: "Una pieza que explique criterios simples para tomar una mejor decision antes de comprar o reservar.",
      format: "Reel",
      objective: "Educar y reducir objeciones",
      priority: "Alta",
      estimatedImpact: "Alto",
    },
    {
      id: "idea-002",
      title: "Tres errores que bajan la conversion",
      concept: "Contenido comparativo con errores frecuentes y una correccion practica por cada uno.",
      format: "Carrusel",
      objective: "Autoridad y confianza",
      priority: "Media",
      estimatedImpact: "Medio alto",
    },
  ],
  hooksLibrary: [
    {
      id: "hook-001",
      hook: "Si estas comparando opciones, mira esto primero.",
      hookType: "Curiosidad practica",
      bestForFormat: "Reel educativo",
      psychologicalTrigger: "Reduccion de riesgo",
    },
    {
      id: "hook-002",
      hook: "La mayoria decide por precio, pero olvida este detalle.",
      hookType: "Contraste",
      bestForFormat: "Carrusel",
      psychologicalTrigger: "Reencuadre",
    },
  ],
  captionsLibrary: [
    {
      id: "caption-001",
      caption: "Una buena decision no empieza con mas opciones, sino con mejores criterios.",
      tone: "Experto cercano",
      bestFor: "Post educativo",
    },
  ],
  ctaLibrary: [
    {
      id: "cta-001",
      cta: "Escribenos y te ayudamos a elegir la mejor opcion para tu caso.",
      ctaType: "Conversacional",
      bestFor: "Cierre de reel",
      conversionIntent: "Mensaje directo",
    },
  ],
  trends: [
    {
      id: "trend-001",
      title: "Contenido con prueba concreta",
      description: "Los usuarios responden mejor a piezas que muestran evidencia, proceso o comparacion real.",
      strategicImplication: "Priorizar formatos que demuestren valor antes de pedir conversion.",
    },
  ],
  opportunities: [
    {
      id: "opportunity-001",
      title: "Convertir preguntas frecuentes en piezas cortas",
      description: "Las dudas repetidas pueden transformarse en contenido de alto valor y baja friccion.",
      recommendedAction: "Crear una serie semanal con una pregunta y una respuesta clara.",
      priority: "Alta",
    },
  ],
  scripts: [
    {
      id: "script-001",
      title: "Guion de comparacion simple",
      format: "Reel",
      durationSeconds: 35,
      structure: ["Hook directo", "Problema comun", "Comparacion", "Recomendacion", "CTA"],
    },
  ],
  predictions: {
    enabled: true,
    items: [
      {
        id: "prediction-001",
        title: "Mayor respuesta en contenido educativo",
        expectedPerformance: "Medio alto",
        reasoning: "Combina claridad, reduccion de riesgo y utilidad inmediata.",
      },
    ],
  },
  likeliScore: {
    enabled: true,
    score: 82,
    scoreLabel: "Potencial alto",
    explanation: "La estrategia tiene buena claridad, pero puede mejorar con mas evidencia visual.",
    strengths: ["Claridad del mensaje", "Formatos faciles de producir"],
    weaknesses: ["Falta de prueba social recurrente"],
    recommendedNextMove: "Crear una pieza comparativa con evidencia real.",
  },
  benchmarks: {
    enabled: true,
    items: [
      {
        id: "benchmark-001",
        title: "Patron de comparacion",
        summary: "Las piezas que comparan opciones ayudan a reducir indecision.",
        lesson: "Mostrar criterios antes que vender caracteristicas.",
      },
    ],
  },
  contentCalendar: [
    { id: "day-001", day: 3, title: "Criterios antes de decidir", format: "Reel", objective: "Educar" },
    { id: "day-002", day: 8, title: "Errores frecuentes", format: "Carrusel", objective: "Confianza" },
  ],
  monthlyRoadmap: [
    {
      id: "week-001",
      week: 1,
      focus: "Claridad de mensaje",
      mainActions: ["Publicar una pieza educativa", "Recolectar preguntas frecuentes"],
      successCriteria: "Mas respuestas guardadas o compartidas.",
    },
    {
      id: "week-002",
      week: 2,
      focus: "Prueba visual",
      mainActions: ["Mostrar proceso", "Comparar antes y despues"],
      successCriteria: "Mas mensajes con intencion concreta.",
    },
  ],
};
