"use client";

import type { PortalModule } from "@/data/portalModules";
import { ModuleIcon } from "@/components/ModuleIcon";

export function ModuleCard({ module, onOpen }: { module: PortalModule; onOpen: (view: string) => void }) {
  return (
    <button className="module-card" type="button" onClick={() => onOpen(module.view)}>
      <span className="module-card__icon" aria-hidden="true">
        <ModuleIcon view={module.view} size={18} />
      </span>
      <h3>{module.title}</h3>
      <p>{module.description}</p>
    </button>
  );
}
