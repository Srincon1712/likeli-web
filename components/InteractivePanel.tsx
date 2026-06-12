"use client";

import type { CSSProperties } from "react";
import { useState } from "react";
import CursorReactiveLayer from "./CursorReactiveLayer";
import ReviewCard, { type Review } from "./ReviewCard";

const reviews: Review[] = [
  {
    quote: "Un video mostrando la llegada al alojamiento puede funcionar como introducción emocional.",
    channel: "Idea detectada",
    state: "idea generada",
    metric: "alto",
    metricLabel: "potencial",
    time: "T-04m",
    tone: "red",
  },
  {
    quote: "No necesitas salir del país para sentir que estás lejos de todo.",
    channel: "Hook recomendado",
    state: "hook sugerido",
    metric: "medio-alto",
    metricLabel: "potencial",
    time: "T-11m",
    tone: "beige",
  },
  {
    quote: "Estructura recomendada: llegada, detalle cozy, vista principal, momento de descanso y CTA.",
    channel: "Guion priorizado",
    state: "listo para grabar",
    metric: "87",
    metricLabel: "score",
    time: "T-18m",
    tone: "yellow",
  },
  {
    quote: "Contenido similar funcionó en negocios de alojamiento rural y glamping.",
    channel: "Caso de éxito relacionado",
    state: "referencia encontrada",
    metric: "alta",
    metricLabel: "confianza",
    time: "T-27m",
    tone: "cool",
  },
  {
    quote: "La idea puede perder fuerza si el primer segundo no muestra una escena visualmente clara.",
    channel: "Riesgo detectado",
    state: "ajuste recomendado",
    metric: "media",
    metricLabel: "prioridad",
    time: "T-39m",
    tone: "red",
  },
];

export default function InteractivePanel() {
  const [cursor, setCursor] = useState({ x: 50, y: 50 });

  return (
    <div
      className="review-stage relative z-10 min-h-[520px] overflow-hidden border hairline p-4 sm:min-h-[620px] sm:p-5 lg:min-h-[660px]"
      onMouseMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        setCursor({
          x: ((event.clientX - rect.left) / rect.width) * 100,
          y: ((event.clientY - rect.top) / rect.height) * 100,
        });
      }}
      onMouseLeave={() => setCursor({ x: 50, y: 50 })}
      style={
        {
          "--cursor-x": `${cursor.x}%`,
          "--cursor-y": `${cursor.y}%`,
        } as CSSProperties
      }
    >
      <CursorReactiveLayer />

      <div className="relative z-10 flex items-center justify-between border-b hairline pb-4">
        <div>
          <span className="mono text-[0.66rem] uppercase tracking-[0.16em] text-faint">Motor Likeli</span>
          <p className="mt-2 text-sm text-lk-gray-light">Inteligencia construida para turismo.</p>
        </div>
        <span className="status-pill mono text-[0.62rem] uppercase tracking-[0.14em] text-lk-beige">Live</span>
      </div>

      <p className="relative z-10 mt-5 text-sm leading-7 text-muted">
        El Motor Likeli analiza ideas, hooks, formatos, estructuras narrativas, tendencias, casos de éxito, casos de bajo rendimiento y patrones de comportamiento para generar recomendaciones accionables.
      </p>

      <div className="review-orbit relative z-10 mt-8 min-h-[420px] sm:min-h-[500px] lg:min-h-[520px]">
        {reviews.map((review, index) => (
          <ReviewCard key={review.quote} review={review} index={index} />
        ))}
      </div>

      <div className="relative z-10 grid grid-cols-3 border-t hairline pt-4 mono text-[0.62rem] uppercase tracking-[0.14em] text-faint">
        <span>fuentes analizadas</span>
        <span className="text-center text-lk-gray-light">potencial evaluado</span>
        <span className="text-right">calendario recomendado</span>
      </div>
    </div>
  );
}
