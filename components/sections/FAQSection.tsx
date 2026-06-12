"use client";

import { useState } from "react";

const faqs = [
  {
    question: "¿Likeli es una agencia de marketing?",
    answer:
      "No. Likeli no funciona como una agencia tradicional de gestión de redes. Se enfoca en ayudar a decidir qué contenido tiene más sentido crear según datos, patrones, casos y contexto turístico.",
  },
  {
    question: "¿Likeli gestiona mis redes sociales?",
    answer:
      "No como servicio principal. Likeli se enfoca en inteligencia, recomendaciones, guiones, calendarios y análisis. En Elite existe apoyo parcial de edición, pero la gestión completa de redes no es el centro.",
  },
  {
    question: "¿Necesito tener muchas redes sociales?",
    answer:
      "No. Puede funcionar con una o varias redes. Lo importante es entender qué canales usa el negocio, qué contenido publica y qué oportunidades existen según su etapa.",
  },
  {
    question: "¿Funciona si apenas estoy empezando?",
    answer:
      "Sí. Si el negocio aún no tiene mucho contenido, Likeli trabaja con contexto del negocio, referentes, tendencias, casos de industria y oportunidades iniciales.",
  },
  {
    question: "¿Sirve para negocios fuera de alojamientos?",
    answer:
      "Sí. Likeli está enfocado en turismo y experiencias: glampings, cabañas, fincas, tours, aventura, gastronomía, bienestar, restaurantes destino y otros negocios visuales.",
  },
  {
    question: "¿Likeli promete viralidad?",
    answer:
      "No. Likeli no promete viralidad ni resultados garantizados. Su objetivo es reducir la incertidumbre y aumentar la probabilidad de tomar mejores decisiones de contenido.",
  },
  {
    question: "¿Qué es el Motor Likeli?",
    answer:
      "Es el sistema interno que organiza tendencias, estructuras, hooks, formatos, casos de éxito, bajo rendimiento, comportamiento de audiencia y variables de publicación para generar recomendaciones.",
  },
  {
    question: "¿Qué es el portal Likeli?",
    answer:
      "Es el espacio donde cada cliente consulta su inteligencia de contenido: ideas, guiones, calendarios, benchmarks, casos, recursos y recomendaciones según su plan.",
  },
  {
    question: "¿Qué significa el score de un guion?",
    answer:
      "Es una puntuación interna para comparar el potencial relativo de un guion frente a otros. No garantiza resultados, pero ayuda a priorizar mejor.",
  },
  {
    question: "¿Qué significa la predicción?",
    answer:
      "Es una lectura estimada basada en patrones observados por el sistema. Sirve como apoyo para decidir, no como promesa de rendimiento.",
  },
  {
    question: "¿Cuánto tarda en verse información útil?",
    answer:
      "Desde el primer ciclo el cliente puede recibir ideas, hooks, captions, CTAs y recomendaciones. La calidad mejora a medida que se acumulan observaciones, contenido y resultados.",
  },
  {
    question: "¿Qué pasa cuando el SaaS esté disponible?",
    answer:
      "Los portales y el Motor Likeli son la base de la futura plataforma SaaS. La Etapa 2 permite validar la metodología, mejorar el sistema y construir con aprendizaje real.",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="section border-b hairline">
      <div className="lk-container grid items-start gap-10 lg:grid-cols-[0.76fr_1.24fr]">
        <div className="faq-head">
          <span className="faq-kicker mono">FAQ</span>
          <h2 className="title">Preguntas para esta etapa.</h2>
          <p className="lead">Respuestas claras para entender qué es Likeli, cómo funciona y qué puede esperar cada negocio.</p>
        </div>

        <div className="faq-list">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            const answerId = `faq-answer-${index}`;

            return (
              <button
                key={faq.question}
                type="button"
                className={`faq-item ${isOpen ? "is-open" : ""}`}
                aria-expanded={isOpen}
                aria-controls={answerId}
                onClick={() => setOpenIndex(isOpen ? null : index)}
              >
                <span className="faq-question">
                  <span>{faq.question}</span>
                  <span className="faq-plus" aria-hidden="true">
                    +
                  </span>
                </span>
                <span id={answerId} className="faq-answer">
                  <span className="copy">
                    {faq.answer}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
