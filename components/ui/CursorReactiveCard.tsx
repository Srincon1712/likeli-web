"use client";

import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import { useState } from "react";

type CursorReactiveCardProps = HTMLAttributes<HTMLElement> & {
  children: ReactNode;
  as?: "article" | "div" | "li";
};

export default function CursorReactiveCard({
  children,
  as = "article",
  className = "",
  ...props
}: CursorReactiveCardProps) {
  const [cursor, setCursor] = useState({ x: 50, y: 50 });
  const Component = as;

  return (
    <Component
      className={`cursor-card ${className}`}
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
      {...props}
    >
      <span className="cursor-card-light" aria-hidden="true" />
      <span className="relative z-10 block">{children}</span>
    </Component>
  );
}
