"use client";

import type { PortalModule } from "@/data/portalModules";
import { ModuleIcon } from "@/components/ModuleIcon";
import { LockKeyhole } from "lucide-react";

const lockedModuleMessage = "Funcion superior no incluida en tu plan actual. Mejora tu plan para desbloquearla.";

export function ModuleCard({ module, locked = false, onOpen }: { module: PortalModule; locked?: boolean; onOpen: (view: string) => void }) {
  return (
    <button
      aria-disabled={locked}
      className={`module-card${locked ? " is-locked" : ""}`}
      data-tour-id={locked ? "locked-module" : undefined}
      data-tooltip={locked ? lockedModuleMessage : undefined}
      title={locked ? lockedModuleMessage : undefined}
      type="button"
      onClick={locked ? undefined : () => onOpen(module.view)}
    >
      <span className="module-card__icon" aria-hidden="true">
        <ModuleIcon view={module.view} size={18} />
      </span>
      <h3>
        <span>{module.title}</span>
        {locked && <LockKeyhole className="lock-icon" aria-hidden="true" size={14} strokeWidth={2.2} />}
      </h3>
      <p>{module.description}</p>
    </button>
  );
}
