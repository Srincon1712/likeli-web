"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { ArrowLeft, ArrowRight, Check, X } from "lucide-react";
import { PORTAL_TUTORIAL_STEPS, type PortalTutorialStep } from "@/data/portalTutorial";

type TargetRect = {
  top: number;
  left: number;
  width: number;
  height: number;
};

type TutorialCapabilities = {
  hasCaseLibrary: boolean;
  hasLockedModules: boolean;
  hasScripts: boolean;
};

export function PortalTutorial({
  capabilities,
  completionKey,
  onClose,
  onNavigate,
  onStepChange,
}: {
  capabilities: TutorialCapabilities;
  completionKey: string;
  onClose: () => void;
  onNavigate: (step: PortalTutorialStep) => void;
  onStepChange: (stepId: string | null) => void;
}) {
  const steps = useMemo(
    () => PORTAL_TUTORIAL_STEPS.filter((step) => {
      if (step.requirement === "case-library") return capabilities.hasCaseLibrary;
      if (step.requirement === "locked-module") return capabilities.hasLockedModules;
      if (step.requirement === "script-card") return capabilities.hasScripts;
      return true;
    }),
    [capabilities],
  );
  const [stepIndex, setStepIndex] = useState(0);
  const [targetRect, setTargetRect] = useState<TargetRect | null>(null);
  const panelRef = useRef<HTMLElement>(null);
  const step = steps[stepIndex];
  const isLastStep = stepIndex === steps.length - 1;

  useEffect(() => {
    if (!step) return;
    onStepChange(step.id);
    onNavigate(step);
    return () => onStepChange(null);
  }, [onNavigate, onStepChange, step]);

  useEffect(() => {
    if (!step) return;
    let frame = 0;
    let resizeObserver: ResizeObserver | null = null;
    let activeTarget: HTMLElement | null = null;

    const updateRect = () => {
      const element = findTarget(step);
      if (!element) {
        activeTarget = null;
        setTargetRect(null);
        return;
      }

      if (activeTarget !== element) {
        resizeObserver?.disconnect();
        activeTarget = element;
        resizeObserver = new ResizeObserver(updateRect);
        resizeObserver.observe(element);
      }

      const rect = element.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) {
        setTargetRect(null);
        return;
      }

      const outsideViewport = rect.bottom < 96 || rect.top > window.innerHeight - 96;
      if (outsideViewport) {
        element.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });
      }

      setTargetRect({
        top: Math.max(8, rect.top - 8),
        left: Math.max(8, rect.left - 8),
        width: Math.min(window.innerWidth - 16, rect.width + 16),
        height: Math.min(window.innerHeight - 16, rect.height + 16),
      });
    };

    const scheduleUpdate = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(updateRect);
    };

    const mutationObserver = new MutationObserver(scheduleUpdate);
    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["class"],
    });
    document.addEventListener("transitionend", scheduleUpdate, true);
    window.addEventListener("resize", scheduleUpdate);
    window.addEventListener("scroll", scheduleUpdate, true);
    scheduleUpdate();

    return () => {
      window.cancelAnimationFrame(frame);
      mutationObserver.disconnect();
      resizeObserver?.disconnect();
      document.removeEventListener("transitionend", scheduleUpdate, true);
      window.removeEventListener("resize", scheduleUpdate);
      window.removeEventListener("scroll", scheduleUpdate, true);
    };
  }, [step]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowRight" && !isLastStep) setStepIndex((value) => Math.min(value + 1, steps.length - 1));
      if (event.key === "ArrowLeft" && stepIndex > 0) setStepIndex((value) => Math.max(value - 1, 0));
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isLastStep, onClose, stepIndex, steps.length]);

  useEffect(() => {
    panelRef.current?.focus({ preventScroll: true });
  }, [stepIndex]);

  if (!step) return null;

  const panelStyle = getPanelPosition(targetRect);

  const finish = () => {
    try {
      window.localStorage.setItem(completionKey, new Date().toISOString());
    } catch {
      // El tutorial sigue funcionando aunque el navegador bloquee localStorage.
    }
    onClose();
  };

  return (
    <div className="portal-tour" aria-live="polite">
      {targetRect ? (
        <div
          className="portal-tour__spotlight"
          style={{
            top: targetRect.top,
            left: targetRect.left,
            width: targetRect.width,
            height: targetRect.height,
          }}
        />
      ) : (
        <div className="portal-tour__veil" />
      )}

      <section
        ref={panelRef}
        className={`portal-tour__panel${targetRect ? "" : " is-centered"}`}
        style={panelStyle}
        role="dialog"
        aria-modal="true"
        aria-labelledby="portal-tour-title"
        tabIndex={-1}
      >
        <header className="portal-tour__header">
          <div>
            <span className="portal-tour__kicker">Guía Likeli</span>
            <span className="portal-tour__step">Paso {stepIndex + 1} de {steps.length}</span>
          </div>
          <button type="button" onClick={onClose} aria-label="Cerrar tutorial">
            <X aria-hidden="true" size={18} />
          </button>
        </header>

        <div className="portal-tour__progress" aria-hidden="true">
          <span style={{ width: `${((stepIndex + 1) / steps.length) * 100}%` }} />
        </div>

        <div className="portal-tour__copy">
          <h2 id="portal-tour-title">{step.title}</h2>
          <p>{step.body}</p>
          {step.secondary && <p className="portal-tour__secondary">{step.secondary}</p>}
        </div>

        <footer className="portal-tour__actions">
          <button
            className="portal-tour__button is-secondary"
            type="button"
            disabled={stepIndex === 0}
            onClick={() => setStepIndex((value) => Math.max(0, value - 1))}
          >
            <ArrowLeft aria-hidden="true" size={16} />
            Anterior
          </button>
          {isLastStep ? (
            <button className="portal-tour__button is-primary" type="button" onClick={finish}>
              Finalizar
              <Check aria-hidden="true" size={16} />
            </button>
          ) : (
            <button
              className="portal-tour__button is-primary"
              type="button"
              onClick={() => setStepIndex((value) => Math.min(steps.length - 1, value + 1))}
            >
              Siguiente
              <ArrowRight aria-hidden="true" size={16} />
            </button>
          )}
        </footer>
      </section>
    </div>
  );
}

function findTarget(step: PortalTutorialStep) {
  const primary = document.querySelector<HTMLElement>(`[data-tour-id="${step.target}"]`);
  if (isVisible(primary)) return primary;
  if (!step.fallbackTarget) return null;
  const fallback = document.querySelector<HTMLElement>(`[data-tour-id="${step.fallbackTarget}"]`);
  return isVisible(fallback) ? fallback : null;
}

function isVisible(element: HTMLElement | null): element is HTMLElement {
  if (!element) return false;
  const style = window.getComputedStyle(element);
  return style.display !== "none" && style.visibility !== "hidden";
}

function getPanelPosition(target: TargetRect | null): CSSProperties {
  if (!target || typeof window === "undefined" || window.innerWidth <= 700) return {};

  const panelWidth = 410;
  const panelGap = 22;
  const margin = 20;
  const estimatedHeight = Math.min(540, window.innerHeight - margin * 2);
  let left = target.left + target.width + panelGap;

  if (left + panelWidth > window.innerWidth - margin) {
    left = target.left - panelWidth - panelGap;
  }
  if (left < margin) {
    left = Math.min(window.innerWidth - panelWidth - margin, Math.max(margin, target.left));
  }

  const top = Math.min(
    window.innerHeight - estimatedHeight - margin,
    Math.max(margin, target.top + Math.min(36, target.height / 3)),
  );
  return { left, top: Math.max(margin, top) };
}
