"use client";

import { type CSSProperties, type ReactNode, useEffect, useRef } from "react";

type LandingRevealProps = {
  children: ReactNode;
  delay?: number;
};

type RevealStyle = CSSProperties & {
  "--reveal-delay"?: string;
};

export default function LandingReveal({ children, delay = 0 }: LandingRevealProps) {
  const elementRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    if (!("IntersectionObserver" in window)) {
      element.classList.add("is-visible");
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        element.classList.add("is-visible");
        observer.unobserve(entry.target);
      },
      {
        rootMargin: "0px 0px -12% 0px",
        threshold: 0.14,
      },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={elementRef}
      className="landing-reveal"
      style={{ "--reveal-delay": `${delay}ms` } as RevealStyle}
    >
      {children}
    </div>
  );
}
