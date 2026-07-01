"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import styles from "./webstudio.module.css";

const WHATSAPP_URL = "https://wa.link/33rwr3";
const MAX_SCROLL_SHIFT = 86;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export default function HeroWebstudio() {
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) {
      return;
    }

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;

    const updateFigureScroll = () => {
      frame = 0;

      if (mediaQuery.matches) {
        hero.style.setProperty("--figure-scroll-y", "0px");
        return;
      }

      const rect = hero.getBoundingClientRect();
      const progress = clamp(-rect.top / rect.height, 0, 1);
      hero.style.setProperty("--figure-scroll-y", `${Math.round(progress * MAX_SCROLL_SHIFT)}px`);
    };

    const requestUpdate = () => {
      if (frame) {
        return;
      }

      frame = window.requestAnimationFrame(updateFigureScroll);
    };

    updateFigureScroll();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    mediaQuery.addEventListener("change", requestUpdate);

    return () => {
      if (frame) {
        window.cancelAnimationFrame(frame);
      }

      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      mediaQuery.removeEventListener("change", requestUpdate);
    };
  }, []);

  return (
    <section ref={heroRef} className={styles.hero} aria-labelledby="webstudio-title">
      <div className={styles.heroShell}>
        <h1 id="webstudio-title" className={styles.title}>
          WEBSTUDIO
        </h1>

        <div className={styles.visualStage} aria-label="Figura 3D de WEBSTUDIO">
          <div className={styles.visualBlock} aria-hidden="true" />
          <div className={styles.figureWrap}>
            <div className={styles.figureMotion}>
              <Image
                className={styles.figure}
                src="/webstudio/webstudio-figure.png"
                alt=""
                width={1339}
                height={611}
                priority
                sizes="(max-width: 700px) 96vw, (max-width: 1100px) 92vw, 1050px"
              />
            </div>
          </div>
        </div>

        <div className={styles.heroFooter}>
          <div className={styles.support}>
            <span>Con el apoyo de</span>
            <Image
              className={styles.likeliLogo}
              src="/logos/likeli/likeli-black-transparent.png"
              alt="Likeli"
              width={74}
              height={24}
              sizes="74px"
            />
          </div>

          <a
            className={styles.whatsappButton}
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Contactar por WhatsApp"
          >
            WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
