"use client";

import type { CSSProperties } from "react";
import { useState } from "react";

export type Review = {
  quote: string;
  channel: string;
  state: string;
  metric: string;
  metricLabel?: string;
  time: string;
  tone: "red" | "beige" | "yellow" | "cool";
};

type ReviewCardProps = {
  review: Review;
  index: number;
};

export default function ReviewCard({ review, index }: ReviewCardProps) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  return (
    <article
      className={`review-card review-card-${index} review-tone-${review.tone}`}
      onMouseMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width - 0.5) * 10;
        const y = ((event.clientY - rect.top) / rect.height - 0.5) * -10;
        setTilt({ x, y });
      }}
      onMouseLeave={() => setTilt({ x: 0, y: 0 })}
      style={
        {
          "--tilt-x": `${tilt.y}deg`,
          "--tilt-y": `${tilt.x}deg`,
        } as CSSProperties
      }
    >
      <div className="review-card-shine" />
      <div className="relative z-10">
        <div className="flex items-center justify-between gap-4">
          <span className="mono text-[0.62rem] uppercase tracking-[0.14em] text-faint">{review.channel}</span>
          <span className="mono text-[0.62rem] uppercase tracking-[0.14em] text-lk-gray-light">{review.time}</span>
        </div>

        <p className="mt-5 text-[1.02rem] leading-7 text-lk-beige sm:text-lg">“{review.quote}”</p>

        <div className="mt-6 flex items-end justify-between gap-4 border-t hairline pt-4">
          <div>
            <span className="mono text-[0.62rem] uppercase tracking-[0.14em] text-faint">state</span>
            <strong className="mt-1 block mono text-[0.7rem] uppercase tracking-[0.12em] text-accent">
              {review.state}
            </strong>
          </div>
          <div className="text-right">
            <span className="mono text-[0.62rem] uppercase tracking-[0.14em] text-faint">{review.metricLabel ?? "signal"}</span>
            <strong className="mt-1 block text-2xl leading-none text-lk-beige">{review.metric}</strong>
          </div>
        </div>
      </div>
    </article>
  );
}
